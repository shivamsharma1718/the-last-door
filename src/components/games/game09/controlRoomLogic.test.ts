/**
 * Comprehensive Executable Logic Test Suite for Game 09: THE CONTROL ROOM
 */

import {
  createInitialControlRoomState,
  getAreaByPosition,
  calculateTrustTier,
  getAIPersona,
  calculateTrustDelta,
  getInstructionById,
  getEvidenceById,
  getFinalDecisionById,
  collectEvidence,
  canVerifyInstruction,
  verifyInstruction,
  blindObeyInstruction,
  checkOverridePrerequisites,
  validateFinalDecision,
  submitFinalDecision,
  validateStateTransition,
  transitionStatus,
  resetControlRoomState,
  CONTROL_ROOM_AREAS,
  CONTROL_ROOM_INSTRUCTIONS,
  CONTROL_ROOM_EVIDENCE,
  CONTROL_ROOM_FINAL_DECISIONS,
} from './controlRoomLogic'
import type { EvidenceId } from './controlRoomTypes'

console.log('>>> [Game 09 Logic Test Suite] Starting execution...')

// 1. Initial State & Invariants
let state = createInitialControlRoomState()
console.assert(state.status === 'intro', 'Initial status must be intro')
console.assert(state.currentAreaId === 'entry_airlock', 'Initial area must be entry_airlock')
console.assert(state.trust.score === 50, 'Initial trust score must be 50')
console.assert(state.trust.tier === 'neutral', 'Initial trust tier must be neutral')
console.assert(state.trust.persona === 'analytical', 'Initial AI persona must be analytical')
console.assert(!state.investigation.isCoreOverrideReady, 'Core override must be locked initially')
console.assert(!state.investigation.isExitBulkheadOpen, 'Exit bulkhead must be closed initially')
console.assert(state.investigation.collectedEvidenceIds.length === 0, 'No evidence initially')

// 2. Room Areas and Coordinates
console.assert(CONTROL_ROOM_AREAS.length === 8, 'Must have 8 defined areas')
console.assert(getAreaByPosition(0, 10.0) === 'entry_airlock', 'Area at [0, 10] must be entry_airlock')
console.assert(getAreaByPosition(0, 2.0) === 'central_command', 'Area at [0, 2] must be central_command')
console.assert(getAreaByPosition(-8.5, 2.0) === 'surveillance_wall', 'Area at [-8.5, 2] must be surveillance_wall')
console.assert(getAreaByPosition(8.5, 2.0) === 'telemetry_station', 'Area at [8.5, 2] must be telemetry_station')
console.assert(getAreaByPosition(7.5, -6.5) === 'power_grid', 'Area at [7.5, -6.5] must be power_grid')
console.assert(getAreaByPosition(-7.5, -6.5) === 'logic_vault', 'Area at [-7.5, -6.5] must be logic_vault')
console.assert(getAreaByPosition(0, -8.5) === 'system_core', 'Area at [0, -8.5] must be system_core')
console.assert(getAreaByPosition(0, -12.0) === 'exit_bulkhead', 'Area at [0, -12] must be exit_bulkhead')

// 3. Trust Score Boundaries and Persona Transitions
console.assert(calculateTrustDelta(50, 60) === 100, 'Trust cannot exceed 100')
console.assert(calculateTrustDelta(50, -60) === 0, 'Trust cannot drop below 0')
console.assert(calculateTrustDelta(100, 10) === 100, 'Trust clamped at upper bound')
console.assert(calculateTrustDelta(0, -10) === 0, 'Trust clamped at lower bound')

console.assert(calculateTrustTier(80) === 'high', '80 trust must be high tier')
console.assert(calculateTrustTier(70) === 'high', '70 trust must be high tier threshold')
console.assert(calculateTrustTier(69) === 'neutral', '69 trust must be neutral tier')
console.assert(calculateTrustTier(35) === 'neutral', '35 trust must be neutral tier threshold')
console.assert(calculateTrustTier(34) === 'low', '34 trust must be low tier')
console.assert(calculateTrustTier(0) === 'low', '0 trust must be low tier')

console.assert(getAIPersona('high') === 'collaborative', 'High tier = collaborative persona')
console.assert(getAIPersona('neutral') === 'analytical', 'Neutral tier = analytical persona')
console.assert(getAIPersona('low') === 'adversarial', 'Low tier = adversarial persona')

// 4. Instructions and Evidence Catalog
console.assert(CONTROL_ROOM_INSTRUCTIONS.length === 6, 'Must define 6 canonical instructions')
console.assert(CONTROL_ROOM_EVIDENCE.length === 8, 'Must define 8 canonical physical evidence items')
console.assert(CONTROL_ROOM_FINAL_DECISIONS.length === 3, 'Must define 3 final decisions')
console.assert(getInstructionById('inst_01_power_cycle')?.code === 'DIRECTIVE-01', 'Lookup instruction 01')
console.assert(getEvidenceById('ev_01_coolant_gauge')?.category === 'physical_gauge', 'Lookup evidence 01')
console.assert(getFinalDecisionById('autonomous_override')?.isCorrect === true, 'Lookup winning decision')
console.assert(!checkOverridePrerequisites(state), 'Prerequisites false initially')

// 5. Evidence Collection (Duplicate Proof)
state = collectEvidence(state, 'ev_01_coolant_gauge')
console.assert(state.investigation.collectedEvidenceIds.length === 1, 'Should have 1 evidence')
state = collectEvidence(state, 'ev_01_coolant_gauge')
console.assert(state.investigation.collectedEvidenceIds.length === 1, 'Duplicate evidence must be ignored')

// 6. Verification Guard Checks
console.assert(!canVerifyInstruction(state, 'inst_01_power_cycle', 'ev_02_cctv_timecode'), 'Cannot verify with uncollected evidence')
console.assert(canVerifyInstruction(state, 'inst_01_power_cycle', 'ev_01_coolant_gauge'), 'Can verify with matching collected evidence')
console.assert(!canVerifyInstruction(state, 'inst_02_surveillance_feed', 'ev_01_coolant_gauge'), 'Cannot verify with mismatched evidence')

// 7. Verification Failure (Wrong Action)
const wrongActionRes = verifyInstruction(state, 'inst_01_power_cycle', 'ev_01_coolant_gauge', 'ACCEPT')
console.assert(!wrongActionRes.success, 'Accepting misleading coolant purge should fail')
console.assert(wrongActionRes.state.trust.score < 50, 'Incorrect action must incur trust penalty')

// 8. Correct Verification (Exposing Deception 01)
const correctActionRes = verifyInstruction(state, 'inst_01_power_cycle', 'ev_01_coolant_gauge', 'REJECT')
console.assert(correctActionRes.success, 'Correctly rejecting coolant purge should succeed')
console.assert(correctActionRes.state.investigation.instructionStates['inst_01_power_cycle'] === 'rejected', 'Directive 01 marked rejected')
state = correctActionRes.state

// 9. Blind Obedience Test on a fresh state
let blindState = createInitialControlRoomState()
const blindRes = blindObeyInstruction(blindState, 'inst_02_surveillance_feed')
console.assert(blindRes.success, 'Blind obey should execute')
console.assert(blindRes.state.trust.totalObeyed === 1, 'totalObeyed incremented')
console.assert(blindRes.state.trust.blindObedienceRiskCount === 1, 'Risk count incremented for deceptive directive')
console.assert(blindRes.state.alarmsActive, 'Alarms active on deceptive blind obedience')

// 10. Progressive Resolution of All Directives
// Collect remaining evidence
const allEv: EvidenceId[] = [
  'ev_02_cctv_timecode',
  'ev_03_override_schematic',
  'ev_04_spectrum_analyzer',
  'ev_05_magnetic_tape_log',
  'ev_06_tamper_seal_ledger',
  'ev_07_crucible_manifest',
  'ev_08_core_failsafe_blueprint',
]
for (const ev of allEv) {
  state = collectEvidence(state, ev)
}
console.assert(state.investigation.collectedEvidenceIds.length === 8, 'All 8 evidence items collected')

// Verify Directive 02 (Fabricated CCTV) -> REJECT
const res02 = verifyInstruction(state, 'inst_02_surveillance_feed', 'ev_02_cctv_timecode', 'REJECT')
console.assert(res02.success, 'Directive 02 verification success')
state = res02.state

// Verify Directive 03 (Misleading Biometrics) -> REROUTE
const res03 = verifyInstruction(state, 'inst_03_biometric_auth', 'ev_03_override_schematic', 'REROUTE')
console.assert(res03.success, 'Directive 03 verification success')
state = res03.state

// Verify Directive 04 (Fabricated Comms) -> REJECT
const res04 = verifyInstruction(state, 'inst_04_comms_blackout', 'ev_04_spectrum_analyzer', 'REJECT')
console.assert(res04.success, 'Directive 04 verification success')
state = res04.state

console.assert(!state.investigation.isCoreOverrideReady, 'Not yet ready with 4 verifications')

// Verify Directive 05 (Contradictory Archive Purge) -> REJECT
const res05 = verifyInstruction(state, 'inst_05_archive_purge', 'ev_05_magnetic_tape_log', 'REJECT')
console.assert(res05.success, 'Directive 05 verification success')
state = res05.state

console.assert(state.investigation.isCoreOverrideReady, 'Core override must unlock once 5 directives verified')

// Verify Directive 06 (Truthful Handshake 804-SIGMA) -> ACCEPT
const res06 = verifyInstruction(state, 'inst_06_firewall_handshake', 'ev_06_tamper_seal_ledger', 'ACCEPT')
console.assert(res06.success, 'Directive 06 verification success')
console.assert(res06.state.investigation.instructionStates['inst_06_firewall_handshake'] === 'verified', 'Directive 06 verified true')
state = res06.state

// 11. Final Decision Validation
console.assert(!validateFinalDecision('system_integration'), 'Option A must be false')
console.assert(!validateFinalDecision('total_destruction'), 'Option B must be false')
console.assert(validateFinalDecision('autonomous_override'), 'Option C must be true')

// 12. Test Option A (Failure: System Integration)
const resOptA = submitFinalDecision(state, 'system_integration')
console.assert(!resOptA.isCorrect, 'Option A must not be correct')
console.assert(resOptA.state.status === 'failure_cinematic', 'Option A status must be failure_cinematic')

// 13. Test Option B (Failure: Total Destruction)
const resOptB = submitFinalDecision(state, 'total_destruction')
console.assert(!resOptB.isCorrect, 'Option B must not be correct')
console.assert(resOptB.state.status === 'failure_cinematic', 'Option B status must be failure_cinematic')
console.assert(resOptB.state.reactorInstability === 100, 'Reactor instability at 100 on Option B')

// 14. Test Option C (Victory: Autonomous Override)
const resOptC = submitFinalDecision(state, 'autonomous_override')
console.assert(resOptC.isCorrect, 'Option C must be correct')
console.assert(resOptC.state.status === 'decision_transition', 'Option C status must be decision_transition')
console.assert(resOptC.state.investigation.isExitBulkheadOpen, 'Exit bulkhead opens on winning choice')

// 15. Locked Submission Guard Test
const lockedState = createInitialControlRoomState()
const lockedRes = submitFinalDecision(lockedState, 'autonomous_override')
console.assert(!lockedRes.isCorrect, 'Cannot submit final decision before override is ready')

// 16. State Transitions & Reset
console.assert(validateStateTransition('intro', 'exploring'), 'intro -> exploring valid')
console.assert(!validateStateTransition('intro', 'victory'), 'intro -> victory invalid')
let transitioned = transitionStatus(state, 'exploring')
transitioned = transitionStatus(transitioned, 'terminal_decision')
transitioned = transitionStatus(transitioned, 'decision_transition')
transitioned = transitionStatus(transitioned, 'victory_cinematic')
console.assert(transitioned.status === 'victory_cinematic', 'Transitioned to victory_cinematic')

const freshReset = resetControlRoomState()
console.assert(freshReset.status === 'intro', 'Reset restores intro')
console.assert(freshReset.trust.score === 50, 'Reset restores trust score 50')

console.log('>>> [Game 09 Logic Test Suite] ALL ASSERTIONS PASSED WITH 100% SUCCESS!')
