/**
 * Game 07: THE MIRROR TRIAL - Reactive Game Store
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Manages:
 * - Active status (intro, exploring, examining, altar_ready)
 * - Examined mirror IDs (Set<MirrorId>)
 * - Discrepancies discovered count
 * - Current nearest mirror, artifact, and altar proximity
 * - Active examination modal target (MirrorDefinition or Altar)
 * - Altar availability state (unlocked after all 4 mirrors examined)
 * - Reset counter for player controls reset
 * - Completion callback for game progression
 */

import { useSyncExternalStore } from 'react'
import type {
  Game07Status,
  MirrorId,
  MirrorDefinition,
  MirrorArtifact,
} from './mirrorTrialTypes'
import {
  getMirrorById,
  hasExaminedAllMirrors,
} from './mirrorTrialLogic'

export type ProximityType = 'mirror' | 'artifact' | 'altar' | null

export interface ProximityState {
  type: ProximityType
  mirror: MirrorDefinition | null
  artifact: MirrorArtifact | null
  isNearAltar: boolean
  promptText: string | null
}

export interface MirrorTrialStoreState {
  isActive: boolean
  status: Game07Status
  examinedMirrorIds: Set<MirrorId>
  discoveredDiscrepancies: Set<string>
  activeExaminationMirror: MirrorDefinition | null
  isExaminingAltar: boolean
  proximity: ProximityState
  altarUnlocked: boolean
  resetCounter: number
}

const initialProximity: ProximityState = {
  type: null,
  mirror: null,
  artifact: null,
  isNearAltar: false,
  promptText: null,
}

const initialState: MirrorTrialStoreState = {
  isActive: false,
  status: 'intro',
  examinedMirrorIds: new Set<MirrorId>(),
  discoveredDiscrepancies: new Set<string>(),
  activeExaminationMirror: null,
  isExaminingAltar: false,
  proximity: initialProximity,
  altarUnlocked: false,
  resetCounter: 0,
}

let currentState: MirrorTrialStoreState = { ...initialState }
const listeners = new Set<() => void>()
let onCompleteCallback: (() => void) | null = null

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const mirrorTrialStore = {
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

  setStatus: (status: Game07Status) => {
    currentState = { ...currentState, status }
    emitChange()
  },

  beginExploration: () => {
    if (typeof document !== 'undefined') {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl && canvasEl.requestPointerLock) {
        try {
          canvasEl.requestPointerLock()
        } catch {
          // Ignore browser restriction if any
        }
      }
    }

    const isAltarReady = currentState.altarUnlocked
    currentState = {
      ...currentState,
      status: isAltarReady ? 'altar_ready' : 'exploring',
    }
    emitChange()
  },

  updateProximity: (params: {
    nearAltar: boolean
    nearArtifact: MirrorArtifact | null
    nearMirror: MirrorDefinition | null
    mirrorForArtifact: MirrorDefinition | null
    isCloserToArtifact: boolean
  }) => {
    const { nearAltar, nearArtifact, nearMirror, mirrorForArtifact, isCloserToArtifact } = params

    let type: ProximityType = null
    let mirror: MirrorDefinition | null = null
    let artifact: MirrorArtifact | null = null
    let promptText: string | null = null

    if (nearAltar) {
      type = 'altar'
      promptText = 'READ INSCRIPTION'
    } else if (nearArtifact && isCloserToArtifact && mirrorForArtifact) {
      type = 'artifact'
      artifact = nearArtifact
      mirror = mirrorForArtifact
      promptText = 'INSPECT ARTIFACT'
    } else if (nearMirror) {
      type = 'mirror'
      mirror = nearMirror
      promptText = 'EXAMINE MIRROR'
    } else if (nearArtifact && mirrorForArtifact) {
      type = 'artifact'
      artifact = nearArtifact
      mirror = mirrorForArtifact
      promptText = 'INSPECT ARTIFACT'
    }

    // Only emit if proximity changed
    const prev = currentState.proximity
    const hasChanged =
      prev.type !== type ||
      prev.isNearAltar !== nearAltar ||
      prev.mirror?.id !== mirror?.id ||
      prev.artifact?.id !== artifact?.id

    if (hasChanged) {
      currentState = {
        ...currentState,
        proximity: {
          type,
          mirror,
          artifact,
          isNearAltar: nearAltar,
          promptText,
        },
      }
      emitChange()
    }
  },

  openExamination: (mirrorId: MirrorId) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const mirrorDef = getMirrorById(mirrorId)
    if (!mirrorDef) return

    // Record examined mirror without duplicates
    const nextExamined = new Set(currentState.examinedMirrorIds)
    nextExamined.add(mirrorId)

    // Record discrepancy if this deceptive mirror has one
    const nextDiscrepancies = new Set(currentState.discoveredDiscrepancies)
    if (mirrorDef.artifact.hasDiscrepancy) {
      nextDiscrepancies.add(mirrorDef.artifact.discrepancyType)
    }

    const altarNowUnlocked = hasExaminedAllMirrors(nextExamined)

    currentState = {
      ...currentState,
      activeExaminationMirror: mirrorDef,
      isExaminingAltar: false,
      examinedMirrorIds: nextExamined,
      discoveredDiscrepancies: nextDiscrepancies,
      altarUnlocked: altarNowUnlocked,
      status: 'examining',
    }
    emitChange()
  },

  openAltarExamination: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      activeExaminationMirror: null,
      isExaminingAltar: true,
      status: 'examining',
    }
    emitChange()
  },

  closeExamination: () => {
    const nextStatus: Game07Status = currentState.altarUnlocked
      ? 'altar_ready'
      : 'exploring'

    currentState = {
      ...currentState,
      activeExaminationMirror: null,
      isExaminingAltar: false,
      status: nextStatus,
    }
    emitChange()
  },

  restartTrial: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...initialState,
      isActive: true,
      examinedMirrorIds: new Set<MirrorId>(),
      discoveredDiscrepancies: new Set<string>(),
      resetCounter: currentState.resetCounter + 1,
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
      examinedMirrorIds: new Set<MirrorId>(),
      discoveredDiscrepancies: new Set<string>(),
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

export function useMirrorTrialStore(): MirrorTrialStoreState {
  return useSyncExternalStore(
    mirrorTrialStore.subscribe,
    mirrorTrialStore.getSnapshot
  )
}
