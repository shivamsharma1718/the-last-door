/**
 * Game 10: THE FORGOTTEN GAME - Pure Logic & Truth Matrix Tests
 * Validates:
 * 1. Truth Matrix & Canonical Historical Consistency (Games 01, 02, 09)
 * 2. Strict Evidence Discovery & Verification Progression (No early collection/verification)
 * 3. Strict Sequential Memory Decision Progression & Immutability
 * 4. Memory Integrity Bounds [0, 3] & Math
 * 5. Two-Step Final Decision Flow (Unlock -> Enter -> Select -> Confirm)
 * 6. REMEMBER Ending availability at Integrity 0, 1, 2, and 3 (Integrity is feedback metric only)
 * 7. All Final Choices work without perfect integrity
 * 8. State Immutability on Invalid Operations
 * 9. Deterministic Multiple-Reset Behavior
 */

import {
  createInitialGame10State,
  getMemoryDefinition,
  discoverEvidence,
  verifyEvidence,
  canEvaluateMemory,
  evaluateMemoryDecision,
  isFinalJudgmentUnlocked,
  enterFinalDecision,
  selectFinalDecision,
  cancelFinalDecisionSelection,
  confirmFinalDecision,
  resetGame10State,
} from './forgottenGameLogic'
import {
  CANONICAL_MEMORIES,
  CANONICAL_EVIDENCE,
  CANONICAL_FINAL_DECISIONS,
} from './forgottenGameTruth'
import {
  INITIAL_INTEGRITY,
  MAX_INTEGRITY,
  MIN_INTEGRITY,
  TOTAL_MEMORIES,
  REQUIRED_EVIDENCE_PER_MEMORY,
  type MemoryId,
  type EvidenceId,
  type PlayerDecision,
} from './game10Types'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 10 Pure Logic Test Suite] Starting execution...')

// ===========================================================================
// 1. Truth Matrix & Canonical Consistency Tests
// ===========================================================================
assert(CANONICAL_MEMORIES.length === TOTAL_MEMORIES, 'Must have exactly 3 canonical memories')
const memoryIds = new Set(CANONICAL_MEMORIES.map((m) => m.id))
assert(memoryIds.size === 3, 'All 3 memory IDs must be unique')
assert(memoryIds.has('mem_01_first_game'), 'Must define mem_01_first_game')
assert(memoryIds.has('mem_02_identity'), 'Must define mem_02_identity')
assert(memoryIds.has('mem_03_control_room'), 'Must define mem_03_control_room')

for (const mem of CANONICAL_MEMORIES) {
  assert(mem.title.length > 0, `Memory ${mem.id} must have a non-empty title`)
  assert(mem.subtitle.length > 0, `Memory ${mem.id} must have a non-empty subtitle`)
  assert(mem.systemClaim.length > 0, `Memory ${mem.id} must have a non-empty system claim`)
  assert(mem.canonicalTruth.length > 0, `Memory ${mem.id} must have a non-empty canonical truth`)
  assert(mem.systemClaim !== mem.canonicalTruth, `System claim must differ from canonical truth for ${mem.id}`)
  assert(mem.contradictionSummary.length > 0, `Memory ${mem.id} must have a contradiction summary`)
  assert(mem.associatedEvidenceIds.length >= REQUIRED_EVIDENCE_PER_MEMORY, `Memory ${mem.id} must link at least 2 evidence items`)
  assert(mem.expectedDecision === 'REJECT', `Memory ${mem.id} expected decision must be REJECT`)
  assert(mem.integrityReward === 1, `Memory ${mem.id} integrity reward must be exactly 1`)
}

// Evidence Verification in Truth Matrix
assert(CANONICAL_EVIDENCE.length === 6, 'Must define exactly 6 canonical evidence items')
const evidenceIds = new Set(CANONICAL_EVIDENCE.map((e) => e.id))
assert(evidenceIds.size === 6, 'All evidence IDs must be unique')

for (const ev of CANONICAL_EVIDENCE) {
  assert(ev.title.length > 0, `Evidence ${ev.id} must have title`)
  assert(ev.technicalRecord.length > 0, `Evidence ${ev.id} must have technical record`)
  assert(ev.factualContradiction.length > 0, `Evidence ${ev.id} must have factual contradiction`)
  const parentMem = getMemoryDefinition(ev.memoryId)
  assert(Boolean(parentMem), `Evidence ${ev.id} must reference a valid parent memory`)
  assert(
    parentMem!.associatedEvidenceIds.includes(ev.id),
    `Parent memory ${ev.memoryId} must include evidence ${ev.id}`
  )
}

// Canonical Event Checks (Ensures no invented historical events)
const mem01 = getMemoryDefinition('mem_01_first_game')!
assert(mem01.canonicalTruth.includes('green light permitted movement'), 'Mem 01 must reference canonical green light rule')
assert(mem01.canonicalTruth.includes('red light demanded complete physical immobility'), 'Mem 01 must reference canonical red light rule')

const mem02 = getMemoryDefinition('mem_02_identity')!
assert(mem02.canonicalTruth.includes('ELIAS'), 'Mem 02 must reference true identity Elias')
assert(mem02.systemClaim.includes('NOAH'), 'Mem 02 system claim must attempt to gaslight player into Noah')

const mem03 = getMemoryDefinition('mem_03_control_room')!
assert(mem03.canonicalTruth.includes('optical trunk bus #01'), 'Mem 03 must reference optical trunk decoupling')
assert(mem03.canonicalTruth.includes('804-SIGMA'), 'Mem 03 must reference authentic release code 804-SIGMA')

// Final Decisions in Truth Matrix
assert(CANONICAL_FINAL_DECISIONS.length === 3, 'Must define exactly 3 final decision choices')
const finalIds = new Set(CANONICAL_FINAL_DECISIONS.map((d) => d.id))
assert(finalIds.has('erase') && finalIds.has('accept') && finalIds.has('remember'), 'Must have erase, accept, remember')

// ===========================================================================
// 2. Strict Evidence Discovery & Verification Progression Tests
// ===========================================================================
let state = createInitialGame10State()
assert(state.currentStage === 'memory_01', 'Initial stage must be memory_01')
assert(state.currentMemoryId === 'mem_01_first_game', 'Initial memory must be mem_01_first_game')
assert(state.discoveredEvidenceIds.size === 0, 'Initial discovered evidence must be empty')
assert(state.verifiedEvidenceIds.size === 0, 'Initial verified evidence must be empty')

// Cannot discover evidence from locked future memories (Memory 02 & Memory 03)
const discMem02Early = discoverEvidence(state, 'ev_10_03_hospital_intake_registry')
assert(discMem02Early.isNew === false, 'Cannot discover Memory 02 evidence while in Memory 01')
assert(discMem02Early.success === false, 'Discovery from locked memory must fail')
assert(discMem02Early.state === state, 'State must not mutate on invalid discovery')

const discMem03Early = discoverEvidence(state, 'ev_10_05_optical_trunk_sever_log')
assert(discMem03Early.isNew === false, 'Cannot discover Memory 03 evidence while in Memory 01')
assert(discMem03Early.state === state, 'State must not mutate on invalid discovery')

// Cannot verify undiscovered evidence
const unverifiedFail = verifyEvidence(state, 'ev_10_01_motion_sensor_log')
assert(unverifiedFail.success === false, 'Cannot verify evidence before discovery')
assert(unverifiedFail.state === state, 'State must not mutate on failed verification')

// Cannot verify evidence from locked future memory
const verLockedEarly = verifyEvidence(state, 'ev_10_03_hospital_intake_registry')
assert(verLockedEarly.success === false, 'Cannot verify locked memory evidence')
assert(verLockedEarly.state === state, 'State must not mutate on locked verification')

// Discover first Memory 01 evidence
const disc1 = discoverEvidence(state, 'ev_10_01_motion_sensor_log')
assert(disc1.isNew === true, 'First discovery must report isNew: true')
assert(disc1.success === true, 'First discovery must report success: true')
state = disc1.state
assert(state.discoveredEvidenceIds.has('ev_10_01_motion_sensor_log'), 'Must track discovered evidence')
assert(
  state.memories.mem_01_first_game.discoveredEvidenceIds.includes('ev_10_01_motion_sensor_log'),
  'Memory 01 must track discovered evidence'
)

// Duplicate discovery cannot mutate state
const discDup = discoverEvidence(state, 'ev_10_01_motion_sensor_log')
assert(discDup.isNew === false, 'Duplicate discovery must report isNew: false')
assert(discDup.success === false, 'Duplicate discovery must report success: false')
assert(discDup.state === state, 'Duplicate discovery must return identical state reference')

// Verify discovered evidence succeeds
const ver1 = verifyEvidence(state, 'ev_10_01_motion_sensor_log')
assert(ver1.success === true, 'Verification of discovered evidence must succeed')
state = ver1.state
assert(state.verifiedEvidenceIds.has('ev_10_01_motion_sensor_log'), 'Must track verified evidence')
assert(state.memories.mem_01_first_game.isSufficientEvidenceGathered === false, '1 evidence is not yet sufficient')

// Duplicate verification fails without mutating state
const verDup = verifyEvidence(state, 'ev_10_01_motion_sensor_log')
assert(verDup.success === false, 'Duplicate verification must fail')
assert(verDup.state === state, 'Duplicate verification must return identical state reference')

// Discover and verify second evidence item for Memory 01
const disc2 = discoverEvidence(state, 'ev_10_02_red_light_audio_tape')
state = disc2.state
const ver2 = verifyEvidence(state, 'ev_10_02_red_light_audio_tape')
state = ver2.state
assert(state.memories.mem_01_first_game.isSufficientEvidenceGathered === true, '2 evidence items must satisfy sufficiency')
assert(state.memories.mem_01_first_game.status === 'evaluating', 'Status must transition to evaluating')
assert(canEvaluateMemory(state, 'mem_01_first_game') === true, 'Memory 01 must now be eligible for evaluation')

// ===========================================================================
// 3. Strict Sequential Memory Decision Progression & Immutability
// ===========================================================================
// Cannot evaluate locked Memory 02 while in Memory 01
const evalLocked = evaluateMemoryDecision(state, 'mem_02_identity', 'REJECT')
assert(evalLocked.success === false, 'Cannot evaluate locked memory')
assert(evalLocked.state === state, 'State must not mutate when evaluating locked memory')

// Cannot evaluate locked Memory 03 while in Memory 01
const evalMem03Early = evaluateMemoryDecision(state, 'mem_03_control_room', 'REJECT')
assert(evalMem03Early.success === false, 'Cannot evaluate future memory')
assert(evalMem03Early.state === state, 'State must not mutate when evaluating future memory')

// Evaluate Memory 01 correctly with REJECT
const evalMem01 = evaluateMemoryDecision(state, 'mem_01_first_game', 'REJECT')
assert(evalMem01.success === true, 'Evaluation must succeed')
assert(evalMem01.isCorrect === true, 'Rejecting the false reconstruction must be correct')
state = evalMem01.state

assert(state.memoryIntegrity === 1, 'Correct decision must award +1 integrity')
assert(state.memories.mem_01_first_game.isCompleted === true, 'Memory 01 must be completed')
assert(state.memories.mem_01_first_game.playerDecision === 'REJECT', 'Player decision must be stored')
assert(state.memories.mem_01_first_game.isDecisionCorrect === true, 'isDecisionCorrect must be true')

// Memory 02 must now be unlocked and active
assert(state.currentStage === 'memory_02', 'Stage must progress to memory_02')
assert(state.currentMemoryId === 'mem_02_identity', 'Current memory must become mem_02_identity')
assert(state.memories.mem_02_identity.status === 'active', 'Memory 02 status must become active')

// Attempting duplicate decision on completed Memory 01 cannot mutate state or score
const evalDup = evaluateMemoryDecision(state, 'mem_01_first_game', 'ACCEPT')
assert(evalDup.success === false, 'Completed memory cannot be re-evaluated')
assert(evalDup.state === state, 'State must not mutate on duplicate evaluation')
assert(state.memoryIntegrity === 1, 'Integrity must remain unchanged')
assert(state.memories.mem_01_first_game.playerDecision === 'REJECT', 'Decision must remain immutable')

// Cannot discover Memory 01 evidence again now that it is completed
const discOldMem = discoverEvidence(state, 'ev_10_01_motion_sensor_log')
assert(discOldMem.success === false, 'Cannot discover evidence for completed memory')
assert(discOldMem.state === state, 'State must not mutate on old evidence discovery')

// ===========================================================================
// 4. Memory Integrity Bounds & Math Tests
// ===========================================================================
assert(INITIAL_INTEGRITY === 0, 'Initial integrity must be 0')
assert(MAX_INTEGRITY === 3, 'Max integrity must be 3')
assert(MIN_INTEGRITY === 0, 'Min integrity must be 0')

// Incorrect decision test on Memory 02
state = discoverEvidence(state, 'ev_10_03_hospital_intake_registry').state
state = verifyEvidence(state, 'ev_10_03_hospital_intake_registry').state
state = discoverEvidence(state, 'ev_10_04_intake_biometric_badge').state
state = verifyEvidence(state, 'ev_10_04_intake_biometric_badge').state

const evalMem02Incorrect = evaluateMemoryDecision(state, 'mem_02_identity', 'ACCEPT')
assert(evalMem02Incorrect.success === true, 'Evaluation executes')
assert(evalMem02Incorrect.isCorrect === false, 'Accepting false reconstruction must be incorrect')
assert(evalMem02Incorrect.state.memoryIntegrity === 1, 'Incorrect decision must NOT award integrity (remains 1)')
assert(evalMem02Incorrect.state.memories.mem_02_identity.isCompleted === true, 'Memory 02 must still finalize')
assert(evalMem02Incorrect.state.currentStage === 'memory_03', 'Progression must still advance to memory_03')

// ===========================================================================
// 5. REMEMBER Works at ANY Integrity Level (0, 1, 2, and 3)
// ===========================================================================
// Helper to simulate a full run with given decisions
function runFullGame(decisions: [PlayerDecision, PlayerDecision, PlayerDecision]) {
  let s = createInitialGame10State()
  const memConfigs: Array<{ memId: MemoryId; ev1: EvidenceId; ev2: EvidenceId }> = [
    { memId: 'mem_01_first_game', ev1: 'ev_10_01_motion_sensor_log', ev2: 'ev_10_02_red_light_audio_tape' },
    { memId: 'mem_02_identity', ev1: 'ev_10_03_hospital_intake_registry', ev2: 'ev_10_04_intake_biometric_badge' },
    { memId: 'mem_03_control_room', ev1: 'ev_10_05_optical_trunk_sever_log', ev2: 'ev_10_06_bulkhead_release_manifest' },
  ]
  for (let i = 0; i < 3; i++) {
    const config = memConfigs[i]
    s = discoverEvidence(s, config.ev1).state
    s = verifyEvidence(s, config.ev1).state
    s = discoverEvidence(s, config.ev2).state
    s = verifyEvidence(s, config.ev2).state
    const evalRes = evaluateMemoryDecision(s, config.memId, decisions[i])
    assert(evalRes.success === true, `Memory ${i + 1} decision must evaluate`)
    s = evalRes.state
  }
  return s
}

// Case A: 0/3 Integrity Run (all decisions ACCEPT)
let runIntegrity0 = runFullGame(['ACCEPT', 'ACCEPT', 'ACCEPT'])
assert(runIntegrity0.memoryIntegrity === 0, 'Run with all ACCEPT decisions must have integrity 0')
assert(isFinalJudgmentUnlocked(runIntegrity0) === true, 'Judgment must unlock at integrity 0')
assert(runIntegrity0.currentStage === 'judgment_unlocked', 'Stage must be judgment_unlocked')
runIntegrity0 = enterFinalDecision(runIntegrity0)
assert(runIntegrity0.currentStage === 'final_decision', 'Stage must be final_decision')
runIntegrity0 = selectFinalDecision(runIntegrity0, 'remember')
assert(runIntegrity0.selectedFinalChoice === 'remember', 'Choice REMEMBER must be selectable at integrity 0')
const confirmAt0 = confirmFinalDecision(runIntegrity0, 'remember')
assert(confirmAt0.success === true, 'REMEMBER must be confirmable at integrity 0')
assert(confirmAt0.isVictory === true, 'REMEMBER must award victory at integrity 0')
assert(confirmAt0.ending === 'ending_remember', 'REMEMBER must yield ending_remember at integrity 0')

// Case B: 1/3 Integrity Run
let runIntegrity1 = runFullGame(['REJECT', 'ACCEPT', 'ACCEPT'])
assert(runIntegrity1.memoryIntegrity === 1, 'Run must have integrity 1')
runIntegrity1 = enterFinalDecision(runIntegrity1)
runIntegrity1 = selectFinalDecision(runIntegrity1, 'remember')
const confirmAt1 = confirmFinalDecision(runIntegrity1, 'remember')
assert(confirmAt1.success === true && confirmAt1.isVictory === true, 'REMEMBER must succeed at integrity 1')

// Case C: 2/3 Integrity Run
let runIntegrity2 = runFullGame(['REJECT', 'REJECT', 'ACCEPT'])
assert(runIntegrity2.memoryIntegrity === 2, 'Run must have integrity 2')
runIntegrity2 = enterFinalDecision(runIntegrity2)
runIntegrity2 = selectFinalDecision(runIntegrity2, 'remember')
const confirmAt2 = confirmFinalDecision(runIntegrity2, 'remember')
assert(confirmAt2.success === true && confirmAt2.isVictory === true, 'REMEMBER must succeed at integrity 2')

// Case D: 3/3 Integrity Run (Perfect Run)
let runIntegrity3 = runFullGame(['REJECT', 'REJECT', 'REJECT'])
assert(runIntegrity3.memoryIntegrity === 3, 'Run must have integrity 3')
runIntegrity3 = enterFinalDecision(runIntegrity3)
runIntegrity3 = selectFinalDecision(runIntegrity3, 'remember')
const confirmAt3 = confirmFinalDecision(runIntegrity3, 'remember')
assert(confirmAt3.success === true && confirmAt3.isVictory === true, 'REMEMBER must succeed at integrity 3')

// ===========================================================================
// 6. Strict Two-Step Final Decision Flow Validation
// ===========================================================================
let flowRun = runFullGame(['REJECT', 'REJECT', 'REJECT'])

// Step A: Cannot confirm while still in judgment_unlocked stage
assert(flowRun.currentStage === 'judgment_unlocked', 'Must be in judgment_unlocked')
const confirmInUnlocked = confirmFinalDecision(flowRun, 'remember')
assert(confirmInUnlocked.success === false, 'Cannot confirm final decision in judgment_unlocked stage')
assert(confirmInUnlocked.state === flowRun, 'State must not mutate')

// Step B: Transition to final_decision stage
flowRun = enterFinalDecision(flowRun)
assert(flowRun.currentStage === 'final_decision', 'Must be in final_decision stage')

// Step C: Cannot confirm without selection
assert(flowRun.selectedFinalChoice === null, 'Selection must be null initially')
const confirmWithoutSelect = confirmFinalDecision(flowRun, 'remember')
assert(confirmWithoutSelect.success === false, 'Cannot confirm decision without prior selection')
assert(confirmWithoutSelect.state === flowRun, 'State must not mutate')

// Step D: Select ERASE
flowRun = selectFinalDecision(flowRun, 'erase')
assert(flowRun.selectedFinalChoice === 'erase', 'selectedFinalChoice must be erase')
assert(flowRun.finalDecision === 'erase', 'finalDecision must be erase')

// Step E: Confirming a different choice than the selected one must be REJECTED
const mismatchConfirm = confirmFinalDecision(flowRun, 'remember')
assert(mismatchConfirm.success === false, 'Confirming mismatch choice must be rejected')
assert(mismatchConfirm.state === flowRun, 'State must not mutate on mismatch confirmation')

// Step F: Canceling selection clears selection without confirming
flowRun = cancelFinalDecisionSelection(flowRun)
assert(flowRun.selectedFinalChoice === null, 'Cancel must clear selectedFinalChoice')
assert(flowRun.finalDecision === null, 'Cancel must clear finalDecision')
assert(flowRun.isFinalDecisionConfirmed === false, 'isFinalDecisionConfirmed must remain false')

// Step G: Cannot confirm after canceling
const confirmAfterCancel = confirmFinalDecision(flowRun, 'erase')
assert(confirmAfterCancel.success === false, 'Cannot confirm after cancellation')
assert(confirmAfterCancel.state === flowRun, 'State must not mutate')

// Step H: Test Option A (ERASE) full selection and confirmation
let eraseRun = selectFinalDecision(flowRun, 'erase')
const eraseResult = confirmFinalDecision(eraseRun, 'erase')
assert(eraseResult.success === true, 'Confirming matching selection ERASE must succeed')
assert(eraseResult.isVictory === false, 'ERASE must yield isVictory: false')
assert(eraseResult.ending === 'ending_erase', 'ERASE must map to ending_erase')
assert(eraseResult.state.isFinalDecisionConfirmed === true, 'Decision must be confirmed')
assert(eraseResult.state.isGameCompleted === true, 'Game must be completed')
assert(eraseResult.state.currentStage === 'ending', 'Stage must become ending')

// Step I: Confirmed final decision is immutable
const reConfirmErase = confirmFinalDecision(eraseResult.state, 'remember')
assert(reConfirmErase.success === false, 'Cannot alter confirmed decision')
assert(reConfirmErase.state === eraseResult.state, 'State must not mutate on re-confirmation')

// Step J: Test Option B (ACCEPT) full selection and confirmation
let acceptRun = runFullGame(['REJECT', 'ACCEPT', 'REJECT'])
acceptRun = enterFinalDecision(acceptRun)
acceptRun = selectFinalDecision(acceptRun, 'accept')
const acceptResult = confirmFinalDecision(acceptRun, 'accept')
assert(acceptResult.success === true, 'Confirming ACCEPT must succeed')
assert(acceptResult.isVictory === false, 'ACCEPT must yield isVictory: false')
assert(acceptResult.ending === 'ending_accept', 'ACCEPT must map to ending_accept')

// ===========================================================================
// 7. Deterministic Multiple-Reset Behavior
// ===========================================================================
let resetState = resetGame10State(eraseResult.state)
assert(resetState.currentStage === 'memory_01', 'Reset must restore memory_01')
assert(resetState.currentMemoryId === 'mem_01_first_game', 'Reset must restore mem_01_first_game')
assert(resetState.memoryIntegrity === 0, 'Reset must restore integrity 0')
assert(resetState.selectedFinalChoice === null, 'Reset must clear selectedFinalChoice')
assert(resetState.finalDecision === null, 'Reset must clear finalDecision')
assert(resetState.isFinalDecisionConfirmed === false, 'Reset must clear isFinalDecisionConfirmed')
assert(resetState.isGameCompleted === false, 'Reset must clear isGameCompleted')
assert(resetState.resetCounter === 1, 'Reset counter must be 1 after first reset')

// Reset a second time
resetState = resetGame10State(resetState)
assert(resetState.resetCounter === 2, 'Reset counter must increment to 2')
assert(resetState.discoveredEvidenceIds.size === 0, 'Discovered evidence must remain empty')

// Reset a third time
resetState = resetGame10State(resetState)
assert(resetState.resetCounter === 3, 'Reset counter must increment to 3')

console.log('>>> [Game 10 Pure Logic Test Suite] ALL ASSERTIONS PASSED WITH 100% SUCCESS!')
