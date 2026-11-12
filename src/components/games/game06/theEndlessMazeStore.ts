import { useSyncExternalStore } from 'react'
import type {
  Game06Status,
  MazeInvestigationObject,
} from './endlessMazeTypes'

export interface EndlessMazeState {
  isActive: boolean
  status: Game06Status
  activeClue: MazeInvestigationObject | null
  nearestClue: MazeInvestigationObject | null
  examinedIds: Set<string>
  resetCounter: number
}

const initialState: EndlessMazeState = {
  isActive: false,
  status: 'intro',
  activeClue: null,
  nearestClue: null,
  examinedIds: new Set(),
  resetCounter: 0,
}

let currentState: EndlessMazeState = { ...initialState }
const listeners = new Set<() => void>()

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

  initFreshRun: () => {
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

