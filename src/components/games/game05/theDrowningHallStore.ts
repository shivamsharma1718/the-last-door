import { useSyncExternalStore } from 'react'
import type { Game05Status } from './drowningHallTypes'

export interface DrowningHallState {
  isActive: boolean
  status: Game05Status
  resetCounter: number
}

const initialState: DrowningHallState = {
  isActive: false,
  status: 'intro',
  resetCounter: 0,
}

let currentState: DrowningHallState = { ...initialState }
const listeners = new Set<() => void>()

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
  completeTrial: () => {
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
}

export function useDrowningHallStore(): DrowningHallState {
  return useSyncExternalStore(
    drowningHallStore.subscribe,
    drowningHallStore.getSnapshot
  )
}
