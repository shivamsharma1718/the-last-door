import { useSyncExternalStore } from 'react'
import type {
  Game05Status,
  DrowningHallObject,
  ValveModel,
  ValveId,
} from './drowningHallTypes'
import {
  clampWaterLevel,
  isCorrectValveActivation,
  isDrainageSequenceComplete,
  resetValveSequence,
  isWaterWarning,
  isWaterCritical,
  shouldFailDrowningHall,
} from './drowningHallLogic'

export interface DrowningHallState {
  isActive: boolean
  status: Game05Status
  activeItem: DrowningHallObject | null
  nearestItem: DrowningHallObject | null
  nearestValve: ValveModel | null
  isNearExit: boolean
  examinedIds: Set<string>
  waterLevel: number
  waterActive: boolean
  activatedValves: ValveId[]
  isDrainageComplete: boolean
  sequenceError: string | null
  resetCounter: number
}

const initialState: DrowningHallState = {
  isActive: false,
  status: 'intro',
  activeItem: null,
  nearestItem: null,
  nearestValve: null,
  isNearExit: false,
  examinedIds: new Set(),
  waterLevel: 0,
  waterActive: false,
  activatedValves: [],
  isDrainageComplete: false,
  sequenceError: null,
  resetCounter: 0,
}

let currentState: DrowningHallState = { ...initialState }
const listeners = new Set<() => void>()
let sequenceErrorTimer: ReturnType<typeof setTimeout> | null = null

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

let onCompleteCallback: (() => void) | null = null

export const drowningHallStore = {
  getSnapshot: () => currentState,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setOnComplete: (cb?: () => void) => {
    onCompleteCallback = cb || null
  },
  setActive: (isActive: boolean) => {
    currentState = { ...currentState, isActive }
    emitChange()
  },
  setStatus: (status: Game05Status) => {
    currentState = { ...currentState, status }
    emitChange()
  },
  setNearestItem: (nearestItem: DrowningHallObject | null) => {
    if (currentState.nearestItem?.id !== nearestItem?.id) {
      currentState = { ...currentState, nearestItem }
      emitChange()
    }
  },
  setNearestValve: (nearestValve: ValveModel | null) => {
    if (currentState.nearestValve?.id !== nearestValve?.id) {
      currentState = { ...currentState, nearestValve }
      emitChange()
    }
  },
  setIsNearExit: (isNearExit: boolean) => {
    if (currentState.isNearExit !== isNearExit) {
      currentState = { ...currentState, isNearExit }
      emitChange()
    }
  },
  openExamination: (item: DrowningHallObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    const nextExamined = new Set(currentState.examinedIds).add(item.id as string)
    const isNowAllExamined = nextExamined.size >= 4
    currentState = {
      ...currentState,
      activeItem: item,
      examinedIds: nextExamined,
      waterActive: isNowAllExamined && !currentState.isDrainageComplete ? true : currentState.waterActive,
      status: 'examining',
    }
    emitChange()
  },
  closeExamination: () => {
    const isWaterCrit = isWaterCritical(currentState.waterLevel)
    const isWaterWarn = isWaterWarning(currentState.waterLevel)
    let nextStatus: Game05Status = 'exploring'
    if (isWaterCrit) {
      nextStatus = 'water_critical'
    } else if (isWaterWarn) {
      nextStatus = 'water_warning'
    }

    currentState = {
      ...currentState,
      activeItem: null,
      status: nextStatus,
    }
    emitChange()
  },
  updateWaterLevel: (deltaAmount: number) => {
    if (
      !currentState.waterActive ||
      currentState.isDrainageComplete ||
      currentState.status === 'failing' ||
      currentState.status === 'failed' ||
      currentState.status === 'intro' ||
      currentState.status === 'victory_cinematic' ||
      currentState.status === 'victory'
    ) {
      return
    }

    const nextLevel = clampWaterLevel(currentState.waterLevel + deltaAmount)
    
    // Check failure condition
    if (shouldFailDrowningHall(nextLevel, currentState.activatedValves)) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
      currentState = {
        ...currentState,
        waterLevel: 100,
        waterActive: false,
        status: 'failing',
      }
      emitChange()
      return
    }

    // Determine status warning / critical / exploring (unless examining)
    let nextStatus = currentState.status
    if (currentState.status !== 'examining') {
      if (isWaterCritical(nextLevel)) {
        nextStatus = 'water_critical'
      } else if (isWaterWarning(nextLevel)) {
        nextStatus = 'water_warning'
      } else {
        nextStatus = 'exploring'
      }
    }

    currentState = {
      ...currentState,
      waterLevel: nextLevel,
      status: nextStatus,
    }
    emitChange()
  },
  interactValve: (valveId: ValveId) => {
    if (currentState.isDrainageComplete) {
      return
    }

    const isCorrect = isCorrectValveActivation(valveId, currentState.activatedValves)

    if (sequenceErrorTimer) {
      clearTimeout(sequenceErrorTimer)
      sequenceErrorTimer = null
    }

    if (isCorrect) {
      const nextActivated = [...currentState.activatedValves, valveId]
      const isComplete = isDrainageSequenceComplete(nextActivated)

      currentState = {
        ...currentState,
        activatedValves: nextActivated,
        isDrainageComplete: isComplete,
        waterActive: isComplete ? false : currentState.waterActive,
        sequenceError: null,
      }
      emitChange()
    } else {
      // Out of sequence - reset sequence & show error
      currentState = {
        ...currentState,
        activatedValves: resetValveSequence(),
        sequenceError: 'INCORRECT SEQUENCE — THE VALVES MUST BE OPENED IN ORDER.',
      }
      emitChange()

      sequenceErrorTimer = setTimeout(() => {
        if (currentState.sequenceError) {
          currentState = { ...currentState, sequenceError: null }
          emitChange()
        }
      }, 3500)
    }
  },
  beginExploration: () => {
    const canvasEl = document.querySelector('canvas')
    if (canvasEl && canvasEl.requestPointerLock) {
      try {
        canvasEl.requestPointerLock()
      } catch {
        // Ignore browser restriction
      }
    }
    currentState = {
      ...currentState,
      status: 'exploring',
    }
    emitChange()
  },
  triggerExitSuccess: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    currentState = {
      ...currentState,
      waterActive: false,
      status: 'victory_cinematic',
    }
    emitChange()
  },
  triggerVictory: () => {
    currentState = {
      ...currentState,
      status: 'victory',
    }
    emitChange()
  },
  continueNextTrial: () => {
    currentState = {
      ...currentState,
      status: 'next_trial',
      isActive: false,
    }
    emitChange()
    if (onCompleteCallback) {
      onCompleteCallback()
    }
  },
  triggerFailing: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    currentState = {
      ...currentState,
      waterActive: false,
      status: 'failing',
    }
    emitChange()
  },
  restart: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    if (sequenceErrorTimer) {
      clearTimeout(sequenceErrorTimer)
      sequenceErrorTimer = null
    }
    currentState = {
      ...initialState,
      isActive: true,
      resetCounter: currentState.resetCounter + 1,
    }
    emitChange()
  },
}

export function useDrowningHallStore(): DrowningHallState {
  return useSyncExternalStore(
    drowningHallStore.subscribe,
    drowningHallStore.getSnapshot
  )
}
