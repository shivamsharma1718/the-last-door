/**
 * Game 07: THE MIRROR TRIAL - Reactive Game Store
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Manages:
 * - Active status (intro, exploring, examining, altar_ready, altar_verdict, verdict_transition, failure_cinematic, failed, victory_cinematic)
 * - Examined mirror IDs (Set<MirrorId>)
 * - Discrepancies discovered count
 * - Current nearest mirror, artifact, and altar proximity
 * - Active examination modal target (MirrorDefinition or Altar)
 * - Altar availability state (unlocked after all 4 mirrors examined)
 * - Selected verdict (North, East, West, South) and failed mirror ID
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
  isTrueMirror,
} from './mirrorTrialLogic'

export type ProximityType = 'mirror' | 'artifact' | 'altar' | 'exit' | null

export interface ProximityState {
  type: ProximityType
  mirror: MirrorDefinition | null
  artifact: MirrorArtifact | null
  isNearAltar: boolean
  isNearExit: boolean
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
  selectedVerdict: MirrorId | null
  failedMirrorId: MirrorId | null
  resetCounter: number
}

const initialProximity: ProximityState = {
  type: null,
  mirror: null,
  artifact: null,
  isNearAltar: false,
  isNearExit: false,
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
  selectedVerdict: null,
  failedMirrorId: null,
  resetCounter: 0,
}

let currentState: MirrorTrialStoreState = { ...initialState }
const listeners = new Set<() => void>()
let onCompleteCallback: (() => void) | null = null
let verdictTimer: ReturnType<typeof setTimeout> | null = null

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
    nearExit?: boolean
  }) => {
    const {
      nearAltar,
      nearArtifact,
      nearMirror,
      mirrorForArtifact,
      isCloserToArtifact,
      nearExit = false,
    } = params

    let type: ProximityType = null
    let mirror: MirrorDefinition | null = null
    let artifact: MirrorArtifact | null = null
    let promptText: string | null = null

    // In passage_revealed status, exit prompt takes precedence near the North opening
    if (currentState.status === 'passage_revealed' && nearExit) {
      type = 'exit'
      promptText = 'ENTER THE PASSAGE'
    } else if (nearAltar) {
      type = 'altar'
      promptText = currentState.altarUnlocked ? 'PRESENT VERDICT' : 'READ INSCRIPTION'
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
      prev.isNearExit !== nearExit ||
      prev.mirror?.id !== mirror?.id ||
      prev.artifact?.id !== artifact?.id ||
      prev.promptText !== promptText

    if (hasChanged) {
      currentState = {
        ...currentState,
        proximity: {
          type,
          mirror,
          artifact,
          isNearAltar: nearAltar,
          isNearExit: nearExit,
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

  openAltarVerdict: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    if (!currentState.altarUnlocked) {
      return
    }

    currentState = {
      ...currentState,
      status: 'altar_verdict',
    }
    emitChange()
  },

  closeAltarVerdict: () => {
    if (currentState.status !== 'altar_verdict') {
      return
    }

    currentState = {
      ...currentState,
      status: 'altar_ready',
    }
    emitChange()
  },

  submitVerdict: (chosenMirrorId: MirrorId) => {
    if (
      currentState.status !== 'altar_verdict' ||
      currentState.selectedVerdict !== null
    ) {
      return
    }

    if (!hasExaminedAllMirrors(currentState.examinedMirrorIds)) {
      return
    }

    if (verdictTimer) {
      clearTimeout(verdictTimer)
      verdictTimer = null
    }

    const isCorrect = isTrueMirror(chosenMirrorId)

    if (isCorrect) {
      // Correct choice: North (Speculum Veritatis)
      currentState = {
        ...currentState,
        selectedVerdict: chosenMirrorId,
        status: 'verdict_transition',
      }
      emitChange()

      verdictTimer = setTimeout(() => {
        currentState = {
          ...currentState,
          status: 'victory_cinematic',
        }
        emitChange()
      }, 4200)
    } else {
      // Wrong choice: East, West, or South
      currentState = {
        ...currentState,
        selectedVerdict: chosenMirrorId,
        failedMirrorId: chosenMirrorId,
        status: 'failure_cinematic',
      }
      emitChange()

      verdictTimer = setTimeout(() => {
        currentState = {
          ...currentState,
          status: 'failed',
        }
        emitChange()
      }, 6500)
    }
  },

  revealExitPassage: () => {
    if (
      currentState.status !== 'victory_cinematic' ||
      currentState.selectedVerdict !== 'mirror_north'
    ) {
      return
    }

    currentState = {
      ...currentState,
      status: 'passage_revealed',
    }
    emitChange()
  },

  triggerFinalEscape: () => {
    if (
      currentState.status !== 'passage_revealed' ||
      currentState.selectedVerdict !== 'mirror_north'
    ) {
      return
    }

    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      status: 'escaping',
    }
    emitChange()
  },

  triggerVictory: () => {
    if (currentState.status !== 'escaping') {
      return
    }

    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      status: 'victory',
    }
    emitChange()
  },

  continueNextTrial: () => {
    if (currentState.status !== 'victory') {
      return
    }

    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

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

  restartTrial: () => {
    // Prevent restarting if trial has already completed or progressed
    if (
      currentState.status === 'victory' ||
      currentState.status === 'next_trial'
    ) {
      return
    }

    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    if (verdictTimer) {
      clearTimeout(verdictTimer)
      verdictTimer = null
    }

    currentState = {
      ...initialState,
      isActive: true,
      status: 'exploring',
      examinedMirrorIds: new Set<MirrorId>(),
      discoveredDiscrepancies: new Set<string>(),
      altarUnlocked: false,
      selectedVerdict: null,
      failedMirrorId: null,
      resetCounter: currentState.resetCounter + 1,
    }
    emitChange()
  },

  initFreshRun: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    if (verdictTimer) {
      clearTimeout(verdictTimer)
      verdictTimer = null
    }

    currentState = {
      ...initialState,
      isActive: true,
      status: 'intro',
      examinedMirrorIds: new Set<MirrorId>(),
      discoveredDiscrepancies: new Set<string>(),
      altarUnlocked: false,
      selectedVerdict: null,
      failedMirrorId: null,
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
