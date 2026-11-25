/**
 * Game 10: THE FORGOTTEN GAME - Reactive Store & Integration Tests
 * Validates:
 * 1. Store Lifecycle & Reactive Snapshot Stability
 * 2. Invalid Actions Do Not Mutate State or Emit Unnecessary Changes
 * 3. Evidence Discovery & Verification Workflow
 * 4. Strict Sequential Memory Decision Progression
 * 5. Two-Step Final Decision Flow via Store (Select -> Confirm)
 * 6. REMEMBER Victory at Non-Perfect Integrity Scores
 * 7. Game 11 Callback Progression
 * 8. Clean Multiple-Reset Behavior
 */

import { forgottenGameStore } from './forgottenGameStore'
import { MAX_INTEGRITY } from './game10Types'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 10 Store & Integration Test Suite] Starting execution...')

// ===========================================================================
// 1. Initial State & Lifecycle
// ===========================================================================
forgottenGameStore.initFreshRun()
let state = forgottenGameStore.getSnapshot()

assert(state.isActive === true, 'Store must be active after initFreshRun')
assert(state.currentStage === 'memory_01', 'Initial stage must be memory_01')
assert(state.currentMemoryId === 'mem_01_first_game', 'Current memory must be mem_01_first_game')
assert(state.memoryIntegrity === 0, 'Initial integrity must be 0')
assert(state.discoveredEvidenceIds.size === 0, 'Discovered evidence must be empty initially')
assert(state.verifiedEvidenceIds.size === 0, 'Verified evidence must be empty initially')
assert(state.selectedFinalChoice === null, 'Selected choice must be null initially')
assert(state.finalDecision === null, 'Final decision must be null initially')
assert(state.isFinalDecisionConfirmed === false, 'Final decision must not be confirmed initially')

// Test Subscription Listener & Snapshot Stability
let listenerFiredCount = 0
const unsubscribe = forgottenGameStore.subscribe(() => {
  listenerFiredCount++
})

// ===========================================================================
// 2. Invalid Actions Must NOT Mutate State or Emit Listener Changes
// ===========================================================================
const preInvalidSnapshot = forgottenGameStore.getSnapshot()
const preInvalidFireCount = listenerFiredCount

// Attempt to discover future memory evidence (should fail and not emit)
const invalidDisc = forgottenGameStore.discoverEvidence('ev_10_03_hospital_intake_registry')
assert(invalidDisc === false, 'Discovering locked future evidence must return false')
assert(listenerFiredCount === preInvalidFireCount, 'Listener must NOT fire on invalid discovery')
assert(forgottenGameStore.getSnapshot() === preInvalidSnapshot, 'Snapshot reference must be identical')

// Attempt to evaluate non-active memory (should fail and not emit)
const invalidEval = forgottenGameStore.submitMemoryDecision('mem_02_identity', 'REJECT')
assert(invalidEval.success === false, 'Evaluating locked memory must return success: false')
assert(listenerFiredCount === preInvalidFireCount, 'Listener must NOT fire on invalid evaluation')
assert(forgottenGameStore.getSnapshot() === preInvalidSnapshot, 'Snapshot reference must remain identical')

// ===========================================================================
// 3. Evidence Workflow for Memory 01
// ===========================================================================
const isNew1 = forgottenGameStore.discoverEvidence('ev_10_01_motion_sensor_log')
assert(isNew1 === true, 'First discovery must return true')
assert(listenerFiredCount > preInvalidFireCount, 'Listener must fire on valid discovery')

const isNewDup = forgottenGameStore.discoverEvidence('ev_10_01_motion_sensor_log')
assert(isNewDup === false, 'Duplicate discovery must return false')

const ver1 = forgottenGameStore.verifyEvidence('ev_10_01_motion_sensor_log')
assert(ver1.success === true, 'Verification must succeed')
state = forgottenGameStore.getSnapshot()
assert(state.verifiedEvidenceIds.has('ev_10_01_motion_sensor_log'), 'Must store verified evidence')
assert(state.memories.mem_01_first_game.isSufficientEvidenceGathered === false, '1 evidence is not sufficient')

// Discover and verify second evidence
forgottenGameStore.discoverEvidence('ev_10_02_red_light_audio_tape')
const ver2 = forgottenGameStore.verifyEvidence('ev_10_02_red_light_audio_tape')
assert(ver2.success === true, 'Second verification must succeed')
state = forgottenGameStore.getSnapshot()
assert(state.memories.mem_01_first_game.isSufficientEvidenceGathered === true, 'Sufficiency must be true with 2 items')
assert(state.memories.mem_01_first_game.status === 'evaluating', 'Status must be evaluating')

// ===========================================================================
// 4. Memory 01 Decision & Stage 1 -> Stage 2 Progression
// ===========================================================================
const dec1 = forgottenGameStore.submitMemoryDecision('mem_01_first_game', 'REJECT')
assert(dec1.success === true, 'Memory 01 decision must succeed')
assert(dec1.isCorrect === true, 'Memory 01 REJECT must be correct')
state = forgottenGameStore.getSnapshot()
assert(state.memoryIntegrity === 1, 'Integrity must increase to 1')
assert(state.memories.mem_01_first_game.isCompleted === true, 'Memory 01 must be completed')
assert(state.currentStage === 'memory_02', 'Stage must progress to memory_02')
assert(state.currentMemoryId === 'mem_02_identity', 'Current memory must be mem_02_identity')
assert(state.memories.mem_02_identity.status === 'active', 'Memory 02 must be active')

// ===========================================================================
// 5. Memory 02 Workflow & Stage 2 -> Stage 3 Progression
// ===========================================================================
forgottenGameStore.discoverEvidence('ev_10_03_hospital_intake_registry')
forgottenGameStore.verifyEvidence('ev_10_03_hospital_intake_registry')
forgottenGameStore.discoverEvidence('ev_10_04_intake_biometric_badge')
forgottenGameStore.verifyEvidence('ev_10_04_intake_biometric_badge')

const dec2 = forgottenGameStore.submitMemoryDecision('mem_02_identity', 'REJECT')
assert(dec2.success === true, 'Memory 02 decision must succeed')
assert(dec2.isCorrect === true, 'Memory 02 REJECT must be correct')
state = forgottenGameStore.getSnapshot()
assert(state.memoryIntegrity === 2, 'Integrity must increase to 2')
assert(state.memories.mem_02_identity.isCompleted === true, 'Memory 02 must be completed')
assert(state.currentStage === 'memory_03', 'Stage must progress to memory_03')
assert(state.memories.mem_03_control_room.status === 'active', 'Memory 03 must be active')

// ===========================================================================
// 6. Memory 03 Workflow & Stage 3 -> Stage 4 (Judgment Unlocked)
// ===========================================================================
forgottenGameStore.discoverEvidence('ev_10_05_optical_trunk_sever_log')
forgottenGameStore.verifyEvidence('ev_10_05_optical_trunk_sever_log')
forgottenGameStore.discoverEvidence('ev_10_06_bulkhead_release_manifest')
forgottenGameStore.verifyEvidence('ev_10_06_bulkhead_release_manifest')

const dec3 = forgottenGameStore.submitMemoryDecision('mem_03_control_room', 'REJECT')
assert(dec3.success === true, 'Memory 03 decision must succeed')
assert(dec3.isCorrect === true, 'Memory 03 REJECT must be correct')
state = forgottenGameStore.getSnapshot()
assert(state.memoryIntegrity === MAX_INTEGRITY, 'Integrity must reach max 3')
assert(state.memories.mem_03_control_room.isCompleted === true, 'Memory 03 must be completed')
assert(state.currentStage === 'judgment_unlocked', 'Stage must progress to judgment_unlocked')
assert(state.currentMemoryId === null, 'No active memory remains')

// Duplicate unlockFinalJudgment() should not emit change
const countBeforeDupUnlock = listenerFiredCount
forgottenGameStore.unlockFinalJudgment()
assert(listenerFiredCount === countBeforeDupUnlock, 'Duplicate unlock must not fire listeners')

// ===========================================================================
// 7. Strict Two-Step Final Decision Flow via Store
// ===========================================================================
// Cannot confirm while still in judgment_unlocked stage
const earlyConfirm = forgottenGameStore.confirmFinalDecision('remember')
assert(earlyConfirm.success === false, 'Confirming before final_decision stage must fail')

// Enter final decision stage
const entered = forgottenGameStore.enterFinalDecision()
assert(entered === true, 'Should enter final decision stage')
assert(forgottenGameStore.getSnapshot().currentStage === 'final_decision', 'Stage must be final_decision')

// Cannot confirm without selecting first
const noSelectConfirm = forgottenGameStore.confirmFinalDecision('remember')
assert(noSelectConfirm.success === false, 'Cannot confirm without prior selection')

// Select 'erase'
forgottenGameStore.selectFinalDecision('erase')
assert(forgottenGameStore.getSnapshot().selectedFinalChoice === 'erase', 'Selection must be erase')

// Cannot confirm 'remember' when 'erase' is selected (mismatch)
const mismatchConfirm = forgottenGameStore.confirmFinalDecision('remember')
assert(mismatchConfirm.success === false, 'Mismatch confirmation must be rejected')

// Cancel selection
forgottenGameStore.cancelFinalDecision()
assert(forgottenGameStore.getSnapshot().selectedFinalChoice === null, 'Cancel must clear selection')

// Select 'remember' and confirm
forgottenGameStore.selectFinalDecision('remember')
assert(forgottenGameStore.getSnapshot().selectedFinalChoice === 'remember', 'Selection must be remember')

const finalResult = forgottenGameStore.confirmFinalDecision('remember')
assert(finalResult.success === true, 'Confirming selected choice REMEMBER must succeed')
assert(finalResult.isVictory === true, 'Option C REMEMBER must be victory')
assert(finalResult.ending === 'ending_remember', 'Ending must be ending_remember')

state = forgottenGameStore.getSnapshot()
assert(state.currentStage === 'ending', 'Stage must be ending')
assert(state.isFinalDecisionConfirmed === true, 'Final decision must be confirmed')
assert(state.isGameCompleted === true, 'Game must be marked completed')

// Game 11 Progression Callback
let advancedToGame11: boolean = false
forgottenGameStore.setOnComplete(() => {
  advancedToGame11 = true
})
forgottenGameStore.proceedToGame11()
assert(Boolean(advancedToGame11), 'Must call onComplete callback to advance to Game 11')

// ===========================================================================
// 8. Multiple Reset Invocations
// ===========================================================================
forgottenGameStore.resetGame()
state = forgottenGameStore.getSnapshot()

assert(state.currentStage === 'memory_01', 'Reset must restore memory_01 stage')
assert(state.currentMemoryId === 'mem_01_first_game', 'Reset must restore currentMemoryId')
assert(state.memoryIntegrity === 0, 'Reset must restore integrity to 0')
assert(state.discoveredEvidenceIds.size === 0, 'Reset must clear discovered evidence')
assert(state.verifiedEvidenceIds.size === 0, 'Reset must clear verified evidence')
assert(state.selectedFinalChoice === null, 'Reset must clear selectedFinalChoice')
assert(state.finalDecision === null, 'Reset must clear final decision')
assert(state.isFinalDecisionConfirmed === false, 'Reset must clear confirmed flag')
assert(state.ending === null, 'Reset must clear ending')
assert(state.isGameCompleted === false, 'Reset must clear completion flag')
assert(state.resetCounter === 1, 'Reset counter must increment to 1')

// Reset a second time
forgottenGameStore.resetGame()
state = forgottenGameStore.getSnapshot()
assert(state.resetCounter === 2, 'Reset counter must increment to 2 on second reset')
assert(state.memoryIntegrity === 0, 'Integrity must remain 0')

// Clean up listener
unsubscribe()

console.log('>>> [Game 10 Store & Integration Test Suite] ALL ASSERTIONS PASSED WITH 100% SUCCESS!')
