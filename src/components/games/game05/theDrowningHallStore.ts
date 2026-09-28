import { useSyncExternalStore } from 'react'
import type { Game05Status, DrowningHallObject } from './drowningHallTypes'

export interface DrowningHallState {
  isActive: boolean
  status: Game05Status
  activeItem: DrowningHallObject | null
  nearestItem: DrowningHallObject | null
  examinedIds: Set<string>
  resetCounter: number
}

const initialState: DrowningHallState = {
  isActive: false,
  status: 'intro',
  activeItem: null,
  nearestItem: null,
  examinedIds: new Set(),
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
  setNearestItem: (nearestItem: DrowningHallObject | null) => {
    if (currentState.nearestItem?.id !== nearestItem?.id) {
      currentState = { ...currentState, nearestItem }
      emitChange()
    }
  },
  openExamination: (item: DrowningHallObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    const nextExamined = new Set(currentState.examinedIds).add(item.id as string)
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
