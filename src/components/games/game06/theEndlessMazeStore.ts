import { useSyncExternalStore } from 'react'
import type {
  Game06Status,
  MazeInvestigationObject,
  MazeLayout,
  MazeShiftState,
} from './endlessMazeTypes'
import {
  createInitialMazeLayout,
  createInitialShiftState,
  applyDeterministicShift,
  getShiftLoreNotice,
} from './endlessMazeLogic'

export interface EndlessMazeState {
  isActive: boolean
  status: Game06Status
  activeClue: MazeInvestigationObject | null
  nearestClue: MazeInvestigationObject | null
  examinedIds: Set<string>
  layout: MazeLayout
  shiftState: MazeShiftState
  shiftNotice: string | null
  isShifting: boolean
  resetCounter: number
}

const initialLayout = createInitialMazeLayout()
const initialShift = createInitialShiftState()

const initialState: EndlessMazeState = {
  isActive: false,
  status: 'intro',
  activeClue: null,
  nearestClue: null,
  examinedIds: new Set(),
  layout: initialLayout,
  shiftState: initialShift,
  shiftNotice: null,
  isShifting: false,
  resetCounter: 0,
}

let currentState: EndlessMazeState = { ...initialState }
const listeners = new Set<() => void>()
let shiftNoticeTimer: ReturnType<typeof setTimeout> | null = null

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

let onCompleteCallback: (() => void) | null = null

export const endlessMazeStore = {
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

  setStatus: (status: Game06Status) => {
    currentState = { ...currentState, status }
    emitChange()
  },

  setNearestClue: (nearestClue: MazeInvestigationObject | null) => {
    if (currentState.nearestClue?.id !== nearestClue?.id) {
      currentState = { ...currentState, nearestClue }
      emitChange()
    }
  },

  openExamination: (clue: MazeInvestigationObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    const nextExamined = new Set(currentState.examinedIds).add(clue.id as string)
    currentState = {
      ...currentState,
      activeClue: clue,
      examinedIds: nextExamined,
      status: 'examining',
    }
    emitChange()
  },

  closeExamination: () => {
    currentState = {
      ...currentState,
      activeClue: null,
      status: 'exploring',
    }
    emitChange()
  },

  beginExploration: () => {
    const canvasEl = document.querySelector('canvas')
    if (canvasEl && canvasEl.requestPointerLock) {
      try {
        canvasEl.requestPointerLock()
      } catch {
        // Ignore browser restriction if any
      }
    }
    currentState = {
      ...currentState,
      status: 'exploring',
    }
    emitChange()
  },

  triggerShift: (ruleId: string) => {
    if (
      currentState.status !== 'exploring' ||
      currentState.shiftState.activeShifts.includes(ruleId)
    ) {
      return
    }

    if (shiftNoticeTimer) {
      clearTimeout(shiftNoticeTimer)
      shiftNoticeTimer = null
    }

    const loreNotice = getShiftLoreNotice(ruleId)

    // Phase 1: Begin shifting state & initiate lighting flicker
    currentState = {
      ...currentState,
      status: 'maze_shifting',
      isShifting: true,
      shiftNotice: loreNotice,
    }
    emitChange()

    // Phase 2: After 350ms, update the physical 3D layout while lights are dim
    setTimeout(() => {
      const { layout, shiftState } = applyDeterministicShift(
        currentState.layout,
        currentState.shiftState,
        ruleId
      )

      currentState = {
        ...currentState,
        layout,
        shiftState,
      }
      emitChange()
    }, 350)

    // Phase 3: At 1200ms, restore exploration and player movement
    setTimeout(() => {
      currentState = {
        ...currentState,
        status: 'exploring',
        isShifting: false,
      }
      emitChange()
    }, 1200)

    // Phase 4: Clear the shift notice after 3500ms
    shiftNoticeTimer = setTimeout(() => {
      if (currentState.shiftNotice) {
        currentState = {
          ...currentState,
          shiftNotice: null,
        }
        emitChange()
      }
    }, 3500)
  },

  initFreshRun: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    if (shiftNoticeTimer) {
      clearTimeout(shiftNoticeTimer)
      shiftNoticeTimer = null
    }
    currentState = {
      ...initialState,
      isActive: true,
      layout: createInitialMazeLayout(),
      shiftState: createInitialShiftState(),
      resetCounter: currentState.resetCounter + 1,
    }
    emitChange()
  },

  triggerComplete: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    if (onCompleteCallback) {
      onCompleteCallback()
    }
  },
}

export function useEndlessMazeStore(): EndlessMazeState {
  return useSyncExternalStore(
    endlessMazeStore.subscribe,
    endlessMazeStore.getSnapshot
  )
}
