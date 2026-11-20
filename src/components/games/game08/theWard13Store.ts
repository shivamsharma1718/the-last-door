/**
 * Game 08: WARD 13 - Reactive Game Store
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Implements useSyncExternalStore pattern for clean reactivity outside Canvas.
 * Manages:
 * - Active lifecycle and status state machine
 * - Collected evidence IDs without duplicates
 * - Unlocked rooms and security clearance levels
 * - Active evidence examination modal state
 * - Reactive proximity calculation for evidence and security doors
 * - Safe pointer-lock transitions
 */

import { useSyncExternalStore } from 'react'
import type {
  Game08Status,
  Ward13RoomId,
  EvidenceId,
  EvidenceDefinition,
} from './ward13Types'
import {
  INTERACTION_DISTANCE_THRESHOLD_G08,
} from './ward13Types'
import {
  createInitialWard13State,
  collectEvidence,
  getEvidenceById,
  getRoomByPosition,
  getNearestEvidence,
} from './ward13Logic'

export type ProximityTargetType = 'evidence' | 'locked_door' | 'terminal' | null

export interface Ward13ProximityState {
  type: ProximityTargetType
  evidence: EvidenceDefinition | null
  doorMessage: string | null
  promptText: string | null
}

export interface Ward13StoreState {
  isActive: boolean
  status: Game08Status
  currentRoomId: Ward13RoomId
  collectedEvidenceIds: Set<EvidenceId>
  activeEvidence: EvidenceDefinition | null
  currentClearanceLevel: number
  unlockedRoomIds: Ward13RoomId[]
  resolvedContradictionKeys: string[]
  proximity: Ward13ProximityState
  resetCounter: number
  playerPosition: { x: number; z: number }
}

const initialProximity: Ward13ProximityState = {
  type: null,
  evidence: null,
  doorMessage: null,
  promptText: null,
}

function getInitialStoreState(): Ward13StoreState {
  const pureState = createInitialWard13State()
  return {
    isActive: false,
    status: pureState.status,
    currentRoomId: pureState.currentRoomId,
    collectedEvidenceIds: new Set<EvidenceId>(pureState.investigation.collectedEvidenceIds),
    activeEvidence: null,
    currentClearanceLevel: pureState.investigation.currentClearanceLevel,
    unlockedRoomIds: [...pureState.investigation.unlockedRoomIds],
    resolvedContradictionKeys: [...pureState.investigation.resolvedContradictionKeys],
    proximity: initialProximity,
    resetCounter: 0,
    playerPosition: { x: 0, z: 11.5 },
  }
}

let currentState: Ward13StoreState = getInitialStoreState()
const listeners = new Set<() => void>()
let onCompleteCallback: (() => void) | null = null

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

// Proximity boundaries for locked doors
interface DoorTrigger {
  roomId: Ward13RoomId
  message: string
  isNear: (x: number, z: number) => boolean
}

const DOOR_TRIGGERS: DoorTrigger[] = [
  {
    roomId: 'patient_ward',
    message: 'INVESTIGATE RECEPTION INTAKE RECORDS TO UNLOCK PATIENT WARD',
    isNear: (x, z) => Math.abs(x) <= 1.8 && z >= 5.2 && z <= 7.4,
  },
  {
    roomId: 'isolation_room',
    message: 'CLEARANCE LEVEL 2 REQUIRED — ISOLATION CELL SEALED',
    isNear: (x, z) => x >= -7.4 && x <= -4.8 && z >= -0.5 && z <= 2.5,
  },
  {
    roomId: 'observation_room',
    message: 'CLEARANCE LEVEL 2 REQUIRED — OBSERVATION WING SEALED',
    isNear: (x, z) => Math.abs(x) <= 1.8 && z >= -4.5 && z <= -2.2,
  },
  {
    roomId: 'records_archive',
    message: 'CLEARANCE LEVEL 3 REQUIRED — ARCHIVE VAULT SEALED',
    isNear: (x, z) => x >= 4.0 && x <= 6.8 && z >= -8.5 && z <= -5.5,
  },
  {
    roomId: 'decon_exit',
    message: 'EMERGENCY AIRLOCK SEALED — FACILITY LOCKDOWN ACTIVE',
    isNear: (x, z) => Math.abs(x) <= 1.8 && z >= -12.0 && z <= -9.0,
  },
]

export const ward13Store = {
  getSnapshot: (): Ward13StoreState => currentState,

  subscribe: (listener: () => void): (() => void) => {
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

  setStatus: (status: Game08Status) => {
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

    currentState = {
      ...currentState,
      status: 'exploring',
    }
    emitChange()
  },

  updatePlayerPosition: (pos: { x: number; z: number }) => {
    const { x, z } = pos
    const currentRoom = getRoomByPosition(x, z)

    // 1. Check nearest evidence
    const nearest = getNearestEvidence(x, z, INTERACTION_DISTANCE_THRESHOLD_G08)

    // 2. Check locked doors if no evidence is nearby
    let doorPrompt: string | null = null
    if (!nearest) {
      for (const trigger of DOOR_TRIGGERS) {
        if (!currentState.unlockedRoomIds.includes(trigger.roomId)) {
          if (trigger.isNear(x, z)) {
            doorPrompt = trigger.message
            break
          }
        }
      }
    }

    // Determine proximity type and prompt text
    let type: ProximityTargetType = null
    let promptText: string | null = null

    if (nearest) {
      type = 'evidence'
      const isAlreadyCollected = currentState.collectedEvidenceIds.has(nearest.id)
      promptText = isAlreadyCollected
        ? `[E] RE-EXAMINE: ${nearest.title.toUpperCase()}`
        : `[E] EXAMINE: ${nearest.title.toUpperCase()}`
    } else if (doorPrompt) {
      type = 'locked_door'
      promptText = `[ACCESS RESTRICTED] ${doorPrompt}`
    }

    const prev = currentState.proximity
    const hasChanged =
      prev.type !== type ||
      prev.evidence?.id !== nearest?.id ||
      prev.doorMessage !== doorPrompt ||
      prev.promptText !== promptText ||
      currentState.currentRoomId !== currentRoom ||
      Math.abs(currentState.playerPosition.x - x) > 0.05 ||
      Math.abs(currentState.playerPosition.z - z) > 0.05

    if (hasChanged) {
      currentState = {
        ...currentState,
        currentRoomId: currentRoom,
        playerPosition: { x, z },
        proximity: {
          type,
          evidence: nearest,
          doorMessage: doorPrompt,
          promptText,
        },
      }
      emitChange()
    }
  },

  openExamination: (evidenceId: EvidenceId) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const def = getEvidenceById(evidenceId)
    if (!def) return

    // Run pure logic collection
    const dummyState = {
      ...createInitialWard13State(),
      investigation: {
        ...createInitialWard13State().investigation,
        collectedEvidenceIds: Array.from(currentState.collectedEvidenceIds),
        unlockedRoomIds: [...currentState.unlockedRoomIds],
        currentClearanceLevel: currentState.currentClearanceLevel,
        resolvedContradictionKeys: [...currentState.resolvedContradictionKeys],
      },
    }

    const updatedPureState = collectEvidence(dummyState, evidenceId)
    const nextCollected = new Set(updatedPureState.investigation.collectedEvidenceIds)
    const nextUnlocked = [...updatedPureState.investigation.unlockedRoomIds]

    currentState = {
      ...currentState,
      status: 'examining',
      activeEvidence: def,
      collectedEvidenceIds: nextCollected,
      unlockedRoomIds: nextUnlocked,
      proximity: {
        ...currentState.proximity,
        promptText: null,
      },
    }
    emitChange()
  },

  closeExamination: () => {
    currentState = {
      ...currentState,
      status: 'exploring',
      activeEvidence: null,
    }
    emitChange()
  },

  interact: () => {
    if (currentState.status === 'examining') {
      ward13Store.closeExamination()
      return
    }

    if (
      currentState.status === 'exploring' &&
      currentState.proximity.type === 'evidence' &&
      currentState.proximity.evidence
    ) {
      ward13Store.openExamination(currentState.proximity.evidence.id)
    }
  },

  initFreshRun: () => {
    currentState = getInitialStoreState()
    currentState.isActive = true
    currentState.status = 'intro'
    emitChange()
  },

  triggerCompletion: () => {
    onCompleteCallback?.()
  },
}

export function useWard13Store(): Ward13StoreState {
  return useSyncExternalStore(
    ward13Store.subscribe,
    ward13Store.getSnapshot
  )
}
