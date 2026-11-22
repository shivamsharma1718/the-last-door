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
 * - Evidence comparison board & contradiction deduction engine
 * - Multi-stage cinematic identity and truth revelations
 * - Reactive proximity calculation for evidence, security doors, and deduction stations
 * - Safe pointer-lock transitions
 */

import { useSyncExternalStore } from 'react'
import type {
  Game08Status,
  Ward13RoomId,
  EvidenceId,
  EvidenceDefinition,
  ContradictionPair,
  TerminalDecisionOption,
} from './ward13Types'
import {
  INTERACTION_DISTANCE_THRESHOLD_G08,
  TERMINAL_WORLD_POS,
  TERMINAL_DISTANCE_THRESHOLD_G08,
} from './ward13Types'
import {
  createInitialWard13State,
  collectEvidence,
  getEvidenceById,
  getRoomByPosition,
  getNearestEvidence,
  compareEvidence,
  getContradictionByKey,
  resolveContradiction,
  validateFinalDecision,
  isTerminalReady,
} from './ward13Logic'

export type ProximityTargetType =
  | 'evidence'
  | 'locked_door'
  | 'comparison_station'
  | 'terminal'
  | 'escape_exit'
  | null

export interface Ward13ProximityState {
  type: ProximityTargetType
  evidence: EvidenceDefinition | null
  doorMessage: string | null
  stationName: string | null
  promptText: string | null
}

export interface ComparisonResultState {
  tested: boolean
  pair: ContradictionPair | null
  isMatch: boolean
  message: string
}

export interface ActiveRevelationState {
  contradiction: ContradictionPair
  stage: number
  totalStages: number
  isComplete: boolean
}

export interface UnlockNotificationState {
  title: string
  clearance: number
  unlockedRooms: string[]
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

  // Step 4: Contradiction Comparison & Revelation
  selectedEvidenceA: EvidenceId | null
  selectedEvidenceB: EvidenceId | null
  comparisonResult: ComparisonResultState | null
  activeRevelation: ActiveRevelationState | null
  recentUnlockNotification: UnlockNotificationState | null

  // Step 5: Final Identity Verdict, Failure, Victory & Escape
  isTerminalOpen: boolean
  isTerminalActive: boolean
  selectedDecision: TerminalDecisionOption | null
  failedDecision: TerminalDecisionOption | null
  isEscapePassageOpen: boolean
  alarmsActive: boolean
}

const initialProximity: Ward13ProximityState = {
  type: null,
  evidence: null,
  doorMessage: null,
  stationName: null,
  promptText: null,
}

// ---------------------------------------------------------------------------
// Deduction / Comparison Analysis Stations in 3D Space
// ---------------------------------------------------------------------------
export interface ComparisonStation {
  id: string
  name: string
  position: [number, number, number]
  radius: number
}

export const COMPARISON_STATIONS: ComparisonStation[] = [
  {
    id: 'station_reception',
    name: 'Admissions Deduction Desk',
    position: [0.0, 0.85, 8.8],
    radius: 2.2,
  },
  {
    id: 'station_patient_ward',
    name: 'Clinical Telemetry Station',
    position: [0.0, 0.85, 0.8],
    radius: 2.2,
  },
  {
    id: 'station_observation',
    name: 'Surveillance Analysis Console',
    position: [0.0, 0.85, -6.2],
    radius: 2.2,
  },
  {
    id: 'station_archive',
    name: 'Archive Reconstruction Table',
    position: [8.5, 0.85, -6.5],
    radius: 2.2,
  },
]

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
    selectedEvidenceA: null,
    selectedEvidenceB: null,
    comparisonResult: null,
    activeRevelation: null,
    recentUnlockNotification: null,
    isTerminalOpen: false,
    isTerminalActive: false,
    selectedDecision: null,
    failedDecision: null,
    isEscapePassageOpen: false,
    alarmsActive: false,
  }
}

let currentState: Ward13StoreState = getInitialStoreState()
const listeners = new Set<() => void>()
let onCompleteCallback: (() => void) | null = null
let notificationTimer: ReturnType<typeof setTimeout> | null = null

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

    const isTerminalActive = isTerminalReady(
      currentState.collectedEvidenceIds.size,
      currentState.resolvedContradictionKeys.length,
      currentState.currentClearanceLevel
    )

    // 0. Check physical escape corridor proximity when escape passage is open
    let isNearEscape = false
    if (currentState.isEscapePassageOpen) {
      if (Math.abs(x) <= 1.8 && z <= -15.5) {
        isNearEscape = true
      }
    }

    // 1. Check nearest evidence (skip terminal manifest if terminal is already active)
    let nearestEvidence = getNearestEvidence(x, z, INTERACTION_DISTANCE_THRESHOLD_G08)
    if (nearestEvidence && nearestEvidence.id === 'evidence_terminal_manifest' && isTerminalActive) {
      nearestEvidence = null
    }

    // 2. Check diagnostic terminal proximity in Area 6 (TERMINAL_WORLD_POS = [0, 1.1, -14.5])
    let isNearTerminal = false
    if (!nearestEvidence && !isNearEscape && currentRoom === 'decon_exit') {
      const distToTerminal = Math.hypot(x - TERMINAL_WORLD_POS[0], z - TERMINAL_WORLD_POS[2])
      if (distToTerminal <= TERMINAL_DISTANCE_THRESHOLD_G08 + 0.4) {
        isNearTerminal = true
      }
    }

    // 3. Check nearest comparison station (only if not standing on evidence, escape or terminal)
    let nearStation: ComparisonStation | null = null
    if (!nearestEvidence && !isNearEscape && !isNearTerminal) {
      for (const st of COMPARISON_STATIONS) {
        const dist = Math.hypot(x - st.position[0], z - st.position[2])
        if (dist <= st.radius) {
          nearStation = st
          break
        }
      }
    }

    // 4. Check locked doors if no evidence or station nearby
    let doorPrompt: string | null = null
    if (!nearestEvidence && !isNearEscape && !isNearTerminal && !nearStation) {
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
    let stationName: string | null = null

    if (isNearEscape) {
      type = 'escape_exit'
      promptText = `[E] ENTER MAINTENANCE SHAFT — ESCAPE WARD 13`
    } else if (isNearTerminal) {
      type = 'terminal'
      if (isTerminalActive) {
        promptText = `[E] ACCESS DIAGNOSTIC TERMINAL — VERIFY IDENTITY`
      } else {
        promptText = `[ACCESS RESTRICTED] CLEARANCE LEVEL 4 & IDENTITY SYNTHESIS REQUIRED`
      }
    } else if (nearestEvidence) {
      type = 'evidence'
      const isAlreadyCollected = currentState.collectedEvidenceIds.has(nearestEvidence.id)
      promptText = isAlreadyCollected
        ? `[E] RE-EXAMINE: ${nearestEvidence.title.toUpperCase()}`
        : `[E] EXAMINE: ${nearestEvidence.title.toUpperCase()}`
    } else if (nearStation) {
      type = 'comparison_station'
      stationName = nearStation.name
      promptText = `[E] ACCESS DEDUCTION TERMINAL — COMPARE EVIDENCE`
    } else if (doorPrompt) {
      type = 'locked_door'
      promptText = `[ACCESS RESTRICTED] ${doorPrompt}`
    }

    const prev = currentState.proximity
    const hasChanged =
      prev.type !== type ||
      prev.evidence?.id !== nearestEvidence?.id ||
      prev.doorMessage !== doorPrompt ||
      prev.stationName !== stationName ||
      prev.promptText !== promptText ||
      currentState.currentRoomId !== currentRoom ||
      currentState.isTerminalActive !== isTerminalActive ||
      Math.abs(currentState.playerPosition.x - x) > 0.05 ||
      Math.abs(currentState.playerPosition.z - z) > 0.05

    if (hasChanged) {
      currentState = {
        ...currentState,
        currentRoomId: currentRoom,
        isTerminalActive,
        playerPosition: { x, z },
        proximity: {
          type,
          evidence: nearestEvidence,
          doorMessage: doorPrompt,
          stationName,
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

  // ---------------------------------------------------------------------------
  // Step 4: Comparison Board & Revelation Actions
  // ---------------------------------------------------------------------------

  openComparisonBoard: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      status: 'comparing_evidence',
      comparisonResult: null,
    }
    emitChange()
  },

  closeComparisonBoard: () => {
    currentState = {
      ...currentState,
      status: 'exploring',
      selectedEvidenceA: null,
      selectedEvidenceB: null,
      comparisonResult: null,
    }
    emitChange()
  },

  selectEvidenceForComparison: (slot: 'A' | 'B', id: EvidenceId) => {
    if (slot === 'A') {
      currentState = {
        ...currentState,
        selectedEvidenceA: id,
        comparisonResult: null,
      }
    } else {
      currentState = {
        ...currentState,
        selectedEvidenceB: id,
        comparisonResult: null,
      }
    }
    emitChange()
  },

  clearComparisonSelection: () => {
    currentState = {
      ...currentState,
      selectedEvidenceA: null,
      selectedEvidenceB: null,
      comparisonResult: null,
    }
    emitChange()
  },

  executeComparison: () => {
    const { selectedEvidenceA, selectedEvidenceB, resolvedContradictionKeys } = currentState

    if (!selectedEvidenceA || !selectedEvidenceB) {
      currentState = {
        ...currentState,
        comparisonResult: {
          tested: true,
          pair: null,
          isMatch: false,
          message: 'SELECT TWO DIFFERENT DOCUMENTS TO EXECUTE COMPARISON.',
        },
      }
      emitChange()
      return
    }

    if (selectedEvidenceA === selectedEvidenceB) {
      currentState = {
        ...currentState,
        comparisonResult: {
          tested: true,
          pair: null,
          isMatch: false,
          message: 'CANNOT COMPARE A DOCUMENT TO ITSELF. SELECT A SECOND DOCUMENT.',
        },
      }
      emitChange()
      return
    }

    const pair = compareEvidence(selectedEvidenceA, selectedEvidenceB)

    if (!pair) {
      currentState = {
        ...currentState,
        comparisonResult: {
          tested: true,
          pair: null,
          isMatch: false,
          message:
            'NO CONTRADICTION DETECTED. These records do not expose a direct institutional falsification. Re-examine the timeline, biometric claims, or identity data.',
        },
      }
      emitChange()
      return
    }

    if (resolvedContradictionKeys.includes(pair.key)) {
      currentState = {
        ...currentState,
        comparisonResult: {
          tested: true,
          pair,
          isMatch: false,
          message: `CONTRADICTION ALREADY RECONCILED: "${pair.name}". Security clearance already granted.`,
        },
      }
      emitChange()
      return
    }

    // Successful canonical contradiction match!
    currentState = {
      ...currentState,
      comparisonResult: {
        tested: true,
        pair,
        isMatch: true,
        message: `CANONICAL DISCREPANCY IDENTIFIED: ${pair.name.toUpperCase()}`,
      },
    }
    emitChange()
  },

  startRevelation: (contradictionKey: string) => {
    const pair = getContradictionByKey(contradictionKey)
    if (!pair) return

    const totalStages = pair.key === 'contradiction_3_identity_erasure' ? 6 : 3

    currentState = {
      ...currentState,
      activeRevelation: {
        contradiction: pair,
        stage: 1,
        totalStages,
        isComplete: false,
      },
    }
    emitChange()
  },

  advanceRevelationStage: () => {
    if (!currentState.activeRevelation) return

    const { stage, totalStages, contradiction } = currentState.activeRevelation
    const nextStage = stage + 1

    if (nextStage > totalStages) {
      currentState = {
        ...currentState,
        activeRevelation: {
          contradiction,
          stage: nextStage,
          totalStages,
          isComplete: true,
        },
      }
    } else {
      currentState = {
        ...currentState,
        activeRevelation: {
          ...currentState.activeRevelation,
          stage: nextStage,
        },
      }
    }
    emitChange()
  },

  completeRevelation: () => {
    if (!currentState.activeRevelation) return
    const pair = currentState.activeRevelation.contradiction

    // Run pure logic resolution
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

    const resolvedState = resolveContradiction(dummyState, pair.key)
    const newUnlocked = [...resolvedState.investigation.unlockedRoomIds]
    const newlyAddedRooms = newUnlocked.filter(
      (r) => !currentState.unlockedRoomIds.includes(r)
    )

    const roomNames = newlyAddedRooms.map((r) => {
      switch (r) {
        case 'isolation_room':
          return 'Isolation Room'
        case 'observation_room':
          return 'Observation Room'
        case 'records_archive':
          return 'Medical Records Archive'
        case 'decon_exit':
          return 'Ward 13 Final Exit'
        default:
          return r
      }
    })

    if (notificationTimer) {
      clearTimeout(notificationTimer)
    }

    notificationTimer = setTimeout(() => {
      ward13Store.dismissUnlockNotification()
    }, 6000)

    currentState = {
      ...currentState,
      status: 'exploring',
      resolvedContradictionKeys: [...resolvedState.investigation.resolvedContradictionKeys],
      currentClearanceLevel: resolvedState.investigation.currentClearanceLevel,
      unlockedRoomIds: newUnlocked,
      selectedEvidenceA: null,
      selectedEvidenceB: null,
      comparisonResult: null,
      activeRevelation: null,
      recentUnlockNotification: {
        title: pair.name,
        clearance: pair.unlockedClearance,
        unlockedRooms: roomNames,
      },
    }
    emitChange()
  },

  dismissUnlockNotification: () => {
    if (notificationTimer) {
      clearTimeout(notificationTimer)
      notificationTimer = null
    }
    currentState = {
      ...currentState,
      recentUnlockNotification: null,
    }
    emitChange()
  },

  openTerminal: () => {
    if (!currentState.isTerminalActive) return

    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      status: 'terminal_input',
      isTerminalOpen: true,
    }
    emitChange()
  },

  closeTerminal: () => {
    currentState = {
      ...currentState,
      status: 'exploring',
      isTerminalOpen: false,
    }
    emitChange()
  },

  submitDecision: (decision: TerminalDecisionOption) => {
    if (currentState.status !== 'terminal_input') return

    const isCorrect = validateFinalDecision(decision)

    if (isCorrect) {
      currentState = {
        ...currentState,
        status: 'terminal_transition',
        selectedDecision: decision,
        isTerminalOpen: false,
      }
      emitChange()

      setTimeout(() => {
        currentState = {
          ...currentState,
          status: 'victory_cinematic',
        }
        emitChange()
      }, 1500)
    } else {
      currentState = {
        ...currentState,
        status: 'failure_cinematic',
        selectedDecision: decision,
        failedDecision: decision,
        isTerminalOpen: false,
        alarmsActive: true,
      }
      emitChange()
    }
  },

  restartTrial: () => {
    if (notificationTimer) {
      clearTimeout(notificationTimer)
      notificationTimer = null
    }

    currentState = {
      ...currentState,
      status: 'exploring',
      currentRoomId: 'reception',
      collectedEvidenceIds: new Set(),
      activeEvidence: null,
      currentClearanceLevel: 1,
      unlockedRoomIds: ['reception'],
      resolvedContradictionKeys: [],
      proximity: initialProximity,
      resetCounter: currentState.resetCounter + 1,
      playerPosition: { x: 0, z: 11.5 },
      selectedEvidenceA: null,
      selectedEvidenceB: null,
      comparisonResult: null,
      activeRevelation: null,
      recentUnlockNotification: null,
      isTerminalOpen: false,
      isTerminalActive: false,
      selectedDecision: null,
      failedDecision: null,
      isEscapePassageOpen: false,
      alarmsActive: false,
    }
    emitChange()

    if (typeof document !== 'undefined') {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl && canvasEl.requestPointerLock) {
        try {
          canvasEl.requestPointerLock()
        } catch {
          // Ignore
        }
      }
    }
  },

  beginEscapePhase: () => {
    currentState = {
      ...currentState,
      status: 'exploring',
      isEscapePassageOpen: true,
    }
    emitChange()

    if (typeof document !== 'undefined') {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl && canvasEl.requestPointerLock) {
        try {
          canvasEl.requestPointerLock()
        } catch {
          // Ignore
        }
      }
    }
  },

  triggerVictory: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    currentState = {
      ...currentState,
      status: 'victory',
    }
    emitChange()
  },

  interact: () => {
    if (currentState.status === 'examining') {
      ward13Store.closeExamination()
      return
    }

    if (currentState.status === 'comparing_evidence') {
      ward13Store.closeComparisonBoard()
      return
    }

    if (currentState.status === 'terminal_input') {
      ward13Store.closeTerminal()
      return
    }

    if (currentState.status === 'exploring') {
      if (currentState.proximity.type === 'escape_exit') {
        ward13Store.triggerVictory()
      } else if (currentState.proximity.type === 'terminal' && currentState.isTerminalActive) {
        ward13Store.openTerminal()
      } else if (currentState.proximity.type === 'evidence' && currentState.proximity.evidence) {
        ward13Store.openExamination(currentState.proximity.evidence.id)
      } else if (currentState.proximity.type === 'comparison_station') {
        ward13Store.openComparisonBoard()
      }
    }
  },

  initFreshRun: () => {
    if (notificationTimer) {
      clearTimeout(notificationTimer)
      notificationTimer = null
    }
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
