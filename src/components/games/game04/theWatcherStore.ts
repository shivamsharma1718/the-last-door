import { useSyncExternalStore } from 'react'
import type { Game04Status, WatcherInvestigationObject } from './theWatcherTypes'

export interface WatcherState {
  isActive: boolean
  status: Game04Status
  activeItem: WatcherInvestigationObject | null
  nearestItem: WatcherInvestigationObject | null
  isNearExit: boolean
  examinedIds: Set<string>
  exitUnlocked: boolean
  revealPhase: number
  resetCounter: number
}

const initialState: WatcherState = {
  isActive: false,
  status: 'intro',
  activeItem: null,
  nearestItem: null,
  isNearExit: false,
  examinedIds: new Set(),
  exitUnlocked: false,
  revealPhase: 0,
  resetCounter: 0,
}

let currentState: WatcherState = { ...initialState }
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

let onCompleteCallback: (() => void) | null = null

export const watcherStore = {
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
  setStatus: (status: Game04Status) => {
    currentState = { ...currentState, status }
    emitChange()
  },
  setNearestItem: (nearestItem: WatcherInvestigationObject | null) => {
    if (currentState.nearestItem?.id !== nearestItem?.id) {
      currentState = { ...currentState, nearestItem }
      emitChange()
    }
  },
  setIsNearExit: (isNearExit: boolean) => {
    if (currentState.isNearExit !== isNearExit) {
      currentState = { ...currentState, isNearExit }
      emitChange()
    }
  },
  openExamination: (item: WatcherInvestigationObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    const nextExamined = new Set(currentState.examinedIds).add(item.id)
    currentState = {
      ...currentState,
      activeItem: item,
      examinedIds: nextExamined,
      status: 'examining',
    }
    emitChange()
  },
  closeExamination: () => {
    currentState = {
      ...currentState,
      activeItem: null,
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
        // Ignore browser restriction
      }
    }
    currentState = {
      ...currentState,
      status: 'exploring',
    }
    emitChange()
  },
  setRevealPhase: (revealPhase: number) => {
    currentState = { ...currentState, revealPhase }
    emitChange()
  },
  setExitUnlocked: (exitUnlocked: boolean) => {
    currentState = { ...currentState, exitUnlocked }
    emitChange()
  },
  triggerWatcherAlert: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    currentState = {
      ...currentState,
      status: 'watcher_alert',
    }
    emitChange()
  },
  triggerFailing: () => {
    currentState = {
      ...currentState,
      status: 'failing',
    }
    emitChange()
  },
  triggerFailed: () => {
    currentState = {
      ...currentState,
      status: 'failed',
    }
    emitChange()
  },
  triggerExitSuccess: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    currentState = {
      ...currentState,
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
  restart: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    currentState = {
      ...initialState,
      isActive: true,
      resetCounter: currentState.resetCounter + 1,
    }
    emitChange()
  },
}

export function useWatcherStore(): WatcherState {
  return useSyncExternalStore(watcherStore.subscribe, watcherStore.getSnapshot)
}
