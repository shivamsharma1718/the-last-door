/**
 * Game 10: THE FORGOTTEN GAME - Pure Game Logic & Verification Engine
 * Theme: Memory Manipulation, Psychological Horror, Distorted History, Gaslighting & Free Will.
 * Central Message: "YOU REMEMBER WINNING. THE SYSTEM REMEMBERS OTHERWISE."
 *
 * Pure, deterministic functions with zero side effects.
 */

import type {
  Game10Stage,
  MemoryId,
  EvidenceId,
  PlayerDecision,
  FinalDecisionChoice,
  Game10Ending,
  MemoryFragmentDefinition,
  EvidenceDefinition,
  FinalDecisionDefinition,
  MemoryState,
  Game10State,
} from './game10Types'
import {
  INITIAL_INTEGRITY,
  MAX_INTEGRITY,
  MIN_INTEGRITY,
  REQUIRED_EVIDENCE_PER_MEMORY,
  CORRECT_FINAL_DECISION,
} from './game10Types'
import {
  CANONICAL_MEMORIES,
  CANONICAL_EVIDENCE,
  CANONICAL_FINAL_DECISIONS,
} from './forgottenGameTruth'

// ---------------------------------------------------------------------------
// 1. Initial State Factory
// ---------------------------------------------------------------------------

export function createInitialGame10State(): Game10State {
  const initialMemories: Record<MemoryId, MemoryState> = {
    mem_01_first_game: {
      id: 'mem_01_first_game',
      status: 'active',
      discoveredEvidenceIds: [],
      verifiedEvidenceIds: [],
      isSufficientEvidenceGathered: false,
      playerDecision: null,
      isDecisionCorrect: null,
      isCompleted: false,
    },
    mem_02_identity: {
      id: 'mem_02_identity',
      status: 'locked',
      discoveredEvidenceIds: [],
      verifiedEvidenceIds: [],
      isSufficientEvidenceGathered: false,
      playerDecision: null,
      isDecisionCorrect: null,
      isCompleted: false,
    },
    mem_03_control_room: {
      id: 'mem_03_control_room',
      status: 'locked',
      discoveredEvidenceIds: [],
      verifiedEvidenceIds: [],
      isSufficientEvidenceGathered: false,
      playerDecision: null,
      isDecisionCorrect: null,
      isCompleted: false,
    },
  }

  return {
    currentStage: 'memory_01',
    currentMemoryId: 'mem_01_first_game',
    memories: initialMemories,
    discoveredEvidenceIds: new Set<EvidenceId>(),
    verifiedEvidenceIds: new Set<EvidenceId>(),
    memoryIntegrity: INITIAL_INTEGRITY,
    selectedFinalChoice: null,
    finalDecision: null,
    isFinalDecisionConfirmed: false,
    ending: null,
    isGameCompleted: false,
    resetCounter: 0,
  }
}

// ---------------------------------------------------------------------------
// 2. Definition Lookups
// ---------------------------------------------------------------------------

export function getMemoryDefinition(id: MemoryId): MemoryFragmentDefinition | undefined {
  return CANONICAL_MEMORIES.find((m) => m.id === id)
}

export function getEvidenceDefinition(id: EvidenceId): EvidenceDefinition | undefined {
  return CANONICAL_EVIDENCE.find((e) => e.id === id)
}

export function getFinalDecisionDefinition(
  choice: FinalDecisionChoice
): FinalDecisionDefinition | undefined {
  return CANONICAL_FINAL_DECISIONS.find((d) => d.id === choice)
}

// ---------------------------------------------------------------------------
// 3. Evidence Discovery & Verification
// ---------------------------------------------------------------------------

/**
 * Discovers a physical evidence item.
 * Strictly enforces that evidence belongs to the currently active memory.
 * Prevents discovering evidence from locked or future memories.
 * Prevents duplicate collection.
 */
export function discoverEvidence(
  state: Game10State,
  evidenceId: EvidenceId
): { state: Game10State; isNew: boolean; success: boolean; message: string } {
  const evDef = getEvidenceDefinition(evidenceId)
  if (!evDef) {
    return { state, isNew: false, success: false, message: 'INVALID EVIDENCE ID' }
  }

  // Must belong to the currently active memory
  if (state.currentMemoryId === null || evDef.memoryId !== state.currentMemoryId) {
    return {
      state,
      isNew: false,
      success: false,
      message: 'CANNOT DISCOVER EVIDENCE FOR LOCKED OR NON-ACTIVE MEMORY.',
    }
  }

  const memState = state.memories[evDef.memoryId]
  if (!memState || memState.status === 'locked' || memState.isCompleted) {
    return {
      state,
      isNew: false,
      success: false,
      message: 'ASSOCIATED MEMORY IS LOCKED OR ALREADY COMPLETED.',
    }
  }

  if (state.discoveredEvidenceIds.has(evidenceId)) {
    return { state, isNew: false, success: false, message: 'EVIDENCE ALREADY DISCOVERED.' }
  }

  const nextDiscovered = new Set(state.discoveredEvidenceIds)
  nextDiscovered.add(evidenceId)

  const memId = evDef.memoryId
  const nextMemDiscovered = memState.discoveredEvidenceIds.includes(evidenceId)
    ? memState.discoveredEvidenceIds
    : [...memState.discoveredEvidenceIds, evidenceId]

  const updatedState: Game10State = {
    ...state,
    discoveredEvidenceIds: nextDiscovered,
    memories: {
      ...state.memories,
      [memId]: {
        ...memState,
        discoveredEvidenceIds: nextMemDiscovered,
      },
    },
  }

  return {
    state: updatedState,
    isNew: true,
    success: true,
    message: `DISCOVERED: ${evDef.title}`,
  }
}

/**
 * Verifies a discovered evidence item against the active memory claim.
 * Enforces:
 * - Evidence must exist in the canonical evidence registry.
 * - Evidence must already have been discovered.
 * - Evidence must belong to the currently active memory.
 * - Evidence from locked or future memories cannot be verified early.
 * - Previously verified evidence cannot award additional progress.
 * - Invalid attempts do not mutate state.
 */
export function verifyEvidence(
  state: Game10State,
  evidenceId: EvidenceId
): { state: Game10State; success: boolean; message: string } {
  const evDef = getEvidenceDefinition(evidenceId)
  if (!evDef) {
    return { state, success: false, message: 'INVALID EVIDENCE ID' }
  }

  // Must belong to the currently active memory
  if (state.currentMemoryId === null || evDef.memoryId !== state.currentMemoryId) {
    return {
      state,
      success: false,
      message: 'CANNOT VERIFY EVIDENCE FOR LOCKED OR NON-ACTIVE MEMORY.',
    }
  }

  const memState = state.memories[evDef.memoryId]
  if (!memState || memState.status === 'locked' || memState.isCompleted) {
    return {
      state,
      success: false,
      message: 'ASSOCIATED MEMORY IS LOCKED OR ALREADY COMPLETED.',
    }
  }

  if (!state.discoveredEvidenceIds.has(evidenceId)) {
    return {
      state,
      success: false,
      message: 'EVIDENCE NOT YET DISCOVERED. INSPECT PHYSICAL OBJECT FIRST.',
    }
  }

  if (state.verifiedEvidenceIds.has(evidenceId)) {
    return { state, success: false, message: 'EVIDENCE ALREADY VERIFIED' }
  }

  const memId = evDef.memoryId

  const nextVerified = new Set(state.verifiedEvidenceIds)
  nextVerified.add(evidenceId)

  const nextMemVerified = [...memState.verifiedEvidenceIds, evidenceId]
  const hasSufficient = nextMemVerified.length >= REQUIRED_EVIDENCE_PER_MEMORY

  let nextStatus = memState.status
  if (memState.status === 'active' && hasSufficient) {
    nextStatus = 'evaluating'
  }

  const updatedState: Game10State = {
    ...state,
    verifiedEvidenceIds: nextVerified,
    memories: {
      ...state.memories,
      [memId]: {
        ...memState,
        verifiedEvidenceIds: nextMemVerified,
        isSufficientEvidenceGathered: hasSufficient,
        status: nextStatus,
      },
    },
  }

  return {
    state: updatedState,
    success: true,
    message: evDef.factualContradiction,
  }
}

// ---------------------------------------------------------------------------
// 4. Memory Decision Evaluation & Progression
// ---------------------------------------------------------------------------

export function canEvaluateMemory(state: Game10State, memoryId: MemoryId): boolean {
  const mem = state.memories[memoryId]
  if (!mem) return false
  if (mem.isCompleted) return false
  if (mem.status === 'locked') return false
  if (state.currentMemoryId !== memoryId) return false
  return mem.isSufficientEvidenceGathered
}

/**
 * Submits player decision (ACCEPT / REJECT) for a specific memory fragment.
 * Enforces:
 * - Requested memory exists.
 * - Memory is the current active memory.
 * - Memory status is active/evaluating, not locked.
 * - Memory is not already completed (immutable).
 * - Has sufficient verified evidence.
 * - Decision is finalized only once.
 * - Rejects any attempt on a non-current or future memory without state mutation.
 * - Integrity is awarded only once on correct decision, clamped in [0, 3].
 */
export function evaluateMemoryDecision(
  state: Game10State,
  memoryId: MemoryId,
  decision: PlayerDecision
): { state: Game10State; success: boolean; isCorrect: boolean; message: string } {
  const mem = state.memories[memoryId]
  const memDef = getMemoryDefinition(memoryId)

  if (!mem || !memDef) {
    return { state, success: false, isCorrect: false, message: 'INVALID MEMORY SPECIFIED' }
  }

  if (state.currentMemoryId !== memoryId) {
    return {
      state,
      success: false,
      isCorrect: false,
      message: 'MEMORY IS NOT CURRENTLY ACTIVE. PROGRESSION ENFORCED SEQUENTIALLY.',
    }
  }

  if (mem.status !== 'active' && mem.status !== 'evaluating') {
    return {
      state,
      success: false,
      isCorrect: false,
      message: 'MEMORY IS LOCKED. PREVIOUS TRIAL MEMORY MUST BE RESOLVED FIRST.',
    }
  }

  if (mem.isCompleted) {
    return {
      state,
      success: false,
      isCorrect: mem.isDecisionCorrect ?? false,
      message: 'MEMORY HAS ALREADY BEEN FINALIZED AND IS IMMUTABLE.',
    }
  }

  if (!mem.isSufficientEvidenceGathered || mem.verifiedEvidenceIds.length < REQUIRED_EVIDENCE_PER_MEMORY) {
    return {
      state,
      success: false,
      isCorrect: false,
      message: `INSUFFICIENT EVIDENCE. Verify at least ${REQUIRED_EVIDENCE_PER_MEMORY} pieces of physical evidence.`,
    }
  }

  const isCorrect = decision === memDef.expectedDecision

  // Award integrity only if correct; clamp strictly between 0 and 3
  const nextIntegrity = isCorrect
    ? Math.min(MAX_INTEGRITY, Math.max(MIN_INTEGRITY, state.memoryIntegrity + memDef.integrityReward))
    : state.memoryIntegrity

  const updatedMem: MemoryState = {
    ...mem,
    playerDecision: decision,
    isDecisionCorrect: isCorrect,
    isCompleted: true,
    status: 'completed',
  }

  const updatedMemories: Record<MemoryId, MemoryState> = {
    ...state.memories,
    [memoryId]: updatedMem,
  }

  // Determine next stage progression
  let nextStage: Game10Stage = state.currentStage
  let nextCurrentMemoryId: MemoryId | null = state.currentMemoryId

  if (memoryId === 'mem_01_first_game') {
    // Unlock Memory 02
    updatedMemories.mem_02_identity = {
      ...updatedMemories.mem_02_identity,
      status: 'active',
    }
    nextStage = 'memory_02'
    nextCurrentMemoryId = 'mem_02_identity'
  } else if (memoryId === 'mem_02_identity') {
    // Unlock Memory 03
    updatedMemories.mem_03_control_room = {
      ...updatedMemories.mem_03_control_room,
      status: 'active',
    }
    nextStage = 'memory_03'
    nextCurrentMemoryId = 'mem_03_control_room'
  } else if (memoryId === 'mem_03_control_room') {
    // All 3 memories finalized -> Unlock Final Judgment
    nextStage = 'judgment_unlocked'
    nextCurrentMemoryId = null
  }

  const updatedState: Game10State = {
    ...state,
    currentStage: nextStage,
    currentMemoryId: nextCurrentMemoryId,
    memories: updatedMemories,
    memoryIntegrity: nextIntegrity,
  }

  const resultMessage = isCorrect
    ? `CORRECT DECISION: You rejected the false reconstruction. ${memDef.contradictionSummary}`
    : `INCORRECT DECISION: You accepted the system's manipulation. The canonical truth was: ${memDef.canonicalTruth}`

  return {
    state: updatedState,
    success: true,
    isCorrect,
    message: resultMessage,
  }
}

// ---------------------------------------------------------------------------
// 5. Final Judgment & Ending System
// ---------------------------------------------------------------------------

export function isFinalJudgmentUnlocked(state: Game10State): boolean {
  return (
    state.memories.mem_01_first_game.isCompleted &&
    state.memories.mem_02_identity.isCompleted &&
    state.memories.mem_03_control_room.isCompleted
  )
}

/**
 * Transitions from judgment_unlocked to final_decision stage.
 * Enforces that all three memories are finalized and stage was judgment_unlocked.
 */
export function enterFinalDecision(state: Game10State): Game10State {
  if (
    state.currentStage !== 'judgment_unlocked' ||
    !isFinalJudgmentUnlocked(state) ||
    state.isFinalDecisionConfirmed
  ) {
    return state
  }
  return {
    ...state,
    currentStage: 'final_decision',
  }
}

/**
 * Selects a final philosophical choice (ERASE, ACCEPT, REMEMBER).
 * Enforces final_decision stage. Does NOT confirm or lock the choice.
 */
export function selectFinalDecision(
  state: Game10State,
  choice: FinalDecisionChoice
): Game10State {
  if (state.currentStage !== 'final_decision' || state.isFinalDecisionConfirmed) {
    return state
  }
  const def = getFinalDecisionDefinition(choice)
  if (!def) {
    return state
  }
  return {
    ...state,
    selectedFinalChoice: choice,
    finalDecision: choice,
  }
}

/**
 * Cancels selection, clearing the selected choice without confirming.
 */
export function cancelFinalDecisionSelection(state: Game10State): Game10State {
  if (state.currentStage !== 'final_decision' || state.isFinalDecisionConfirmed) {
    return state
  }
  if (state.selectedFinalChoice === null && state.finalDecision === null) {
    return state
  }
  return {
    ...state,
    selectedFinalChoice: null,
    finalDecision: null,
  }
}

/**
 * Confirms the player's selected final choice.
 * Strict rules:
 * - All three memories must be completed.
 * - Allowed only in final_decision stage.
 * - Can confirm only once; immutable afterwards.
 * - Choice must match the currently selected choice.
 * - Cannot confirm without selection.
 * - REMEMBER and all other choices are available regardless of integrity score.
 */
export function confirmFinalDecision(
  state: Game10State,
  choice: FinalDecisionChoice
): {
  state: Game10State
  ending: Game10Ending
  isVictory: boolean
  message: string
  success: boolean
} {
  const def = getFinalDecisionDefinition(choice)
  if (!def) {
    return {
      state,
      ending: 'ending_erase',
      isVictory: false,
      message: `[Game 10 Logic]: Invalid final decision choice "${choice}"`,
      success: false,
    }
  }

  if (!isFinalJudgmentUnlocked(state)) {
    return {
      state,
      ending: 'ending_erase',
      isVictory: false,
      message: 'FINAL JUDGMENT LOCKED. All 3 memories must be finalized first.',
      success: false,
    }
  }

  if (state.currentStage !== 'final_decision') {
    return {
      state,
      ending: 'ending_erase',
      isVictory: false,
      message: 'CONFIRMATION ALLOWED ONLY IN final_decision STAGE.',
      success: false,
    }
  }

  if (state.isFinalDecisionConfirmed) {
    return {
      state,
      ending: state.ending ?? 'ending_erase',
      isVictory: state.ending === 'ending_remember',
      message: 'FINAL DECISION HAS ALREADY BEEN CONFIRMED AND CANNOT BE ALTERED.',
      success: false,
    }
  }

  if (state.selectedFinalChoice === null) {
    return {
      state,
      ending: 'ending_erase',
      isVictory: false,
      message: 'NO FINAL DECISION SELECTED. Select a choice before confirming.',
      success: false,
    }
  }

  if (state.selectedFinalChoice !== choice) {
    return {
      state,
      ending: 'ending_erase',
      isVictory: false,
      message: 'CONFIRMATION CHOICE DOES NOT MATCH CURRENT SELECTION.',
      success: false,
    }
  }

  const isVictory = choice === CORRECT_FINAL_DECISION
  const ending: Game10Ending = def.ending

  const updatedState: Game10State = {
    ...state,
    currentStage: 'ending',
    selectedFinalChoice: choice,
    finalDecision: choice,
    isFinalDecisionConfirmed: true,
    ending,
    isGameCompleted: true,
  }

  return {
    state: updatedState,
    ending,
    isVictory,
    message: def.narrativeOutcome,
    success: true,
  }
}

// ---------------------------------------------------------------------------
// 6. Clean Reset Function
// ---------------------------------------------------------------------------

/**
 * Fully resets Game 10 state to its pristine initial state.
 * Does not mutate or affect any other game. Safe to invoke repeatedly.
 */
export function resetGame10State(previousState?: Game10State): Game10State {
  const base = createInitialGame10State()
  return {
    ...base,
    resetCounter: (previousState?.resetCounter ?? 0) + 1,
  }
}
