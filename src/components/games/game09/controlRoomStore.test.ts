/**
 * Game 09: THE CONTROL ROOM - Comprehensive Store & Gameplay Test Suite
 */

import {
  controlRoomStore,
} from './theControlRoomStore'
import {
  getInstructionById,
  getEvidenceById,
} from './controlRoomLogic'
import {
  INITIAL_CONTROL_ROOM_POS,
  REQUIRED_VERIFICATIONS_COUNT,
} from './controlRoomTypes'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 09 Store & Gameplay Test Suite] Starting execution...')

// 1. Initial State
controlRoomStore.initFreshRun()
let state = controlRoomStore.getSnapshot()
assert(state.isActive === true, 'Store must be active after initFreshRun')
assert(state.status === 'intro', 'Initial status must be intro')
assert(
  state.playerPosition.x === INITIAL_CONTROL_ROOM_POS[0] &&
  state.playerPosition.z === INITIAL_CONTROL_ROOM_POS[2],
  'Player position must match initial spawn coordinates'
)
assert(state.trust.score === 50, 'Initial trust score must be 50')
assert(state.trust.tier === 'neutral', 'Initial tier must be neutral')
assert(state.trust.persona === 'analytical', 'Initial persona must be analytical')
assert(state.collectedEvidenceIds.size === 0, 'No evidence collected initially')
assert(controlRoomStore.getResolvedDirectivesCount() === 0, '0 directives resolved initially')
assert(state.isCoreOverrideReady === false, 'Core override locked initially')

// 2. Intro Sequence Transition
controlRoomStore.beginExploration()
state = controlRoomStore.getSnapshot()
assert(state.status === 'exploring', 'Status must be exploring after beginExploration')
assert(state.overseerDialogue !== null, 'Overseer dialogue must be initialized')

// 3. Proximity Calculation Tests
// 3a. Position near ev_01_coolant_gauge [8.2, 1.4, -6.8]
controlRoomStore.updatePlayerPosition({ x: 8.2, z: -6.8 })
state = controlRoomStore.getSnapshot()
assert(state.proximity.type === 'evidence', 'Must detect evidence target near [8.2, -6.8]')
assert(state.proximity.evidence?.id === 'ev_01_coolant_gauge', 'Must target ev_01_coolant_gauge')
assert(state.proximity.promptText?.includes('EXAMINE') === true, 'Prompt must say EXAMINE before collection')

// 3b. Position near Directive 01 Console [7.5, 1.2, -5.5]
controlRoomStore.updatePlayerPosition({ x: 7.5, z: -5.5 })
state = controlRoomStore.getSnapshot()
assert(state.proximity.type === 'directive_console', 'Must detect directive_console target')
assert(state.proximity.instruction?.id === 'inst_01_power_cycle', 'Must target inst_01_power_cycle')

// 3c. Position near Master Core [0, 1.1, -8.5]
controlRoomStore.updatePlayerPosition({ x: 0, z: -8.5 })
state = controlRoomStore.getSnapshot()
assert(state.proximity.type === 'system_core', 'Must detect system_core target')
assert(state.proximity.promptText?.includes('LOCKED') === true, 'Core must be locked initially')

// 4. Evidence Examination & Duplicate Prevention
const ev01 = getEvidenceById('ev_01_coolant_gauge')!
controlRoomStore.openEvidenceExamination(ev01)
state = controlRoomStore.getSnapshot()
assert(state.status === 'examining_evidence', 'Status must be examining_evidence')
assert(state.activeEvidence?.id === 'ev_01_coolant_gauge', 'Active evidence must match ev01')

// Collect evidence
controlRoomStore.collectCurrentEvidence()
state = controlRoomStore.getSnapshot()
assert(state.collectedEvidenceIds.has('ev_01_coolant_gauge'), 'ev_01_coolant_gauge must be collected')
assert(state.collectedEvidenceIds.size === 1, 'Collected count must be 1')

// Duplicate collection attempt
controlRoomStore.collectCurrentEvidence()
state = controlRoomStore.getSnapshot()
assert(state.collectedEvidenceIds.size === 1, 'Duplicate evidence collection must be ignored')

controlRoomStore.closeExamination()
state = controlRoomStore.getSnapshot()
assert(state.status === 'exploring', 'Status must return to exploring after closeExamination')

// 5. Supporting Evidence Items (07 & 08) do not count toward directive verification
const ev07 = getEvidenceById('ev_07_crucible_manifest')!
const ev08 = getEvidenceById('ev_08_core_failsafe_blueprint')!
controlRoomStore.openEvidenceExamination(ev07)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()
controlRoomStore.openEvidenceExamination(ev08)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()

state = controlRoomStore.getSnapshot()
assert(state.collectedEvidenceIds.size === 3, 'Must have 3 collected evidence items')
assert(controlRoomStore.getResolvedDirectivesCount() === 0, 'Evidence 7 and 8 must not count toward directive verification')

// 6. Directive Verification Flow
const inst01 = getInstructionById('inst_01_power_cycle')!
controlRoomStore.openDirectivePanel(inst01)
state = controlRoomStore.getSnapshot()
assert(state.status === 'verifying_instruction', 'Status must be verifying_instruction')
assert(state.activeInstruction?.id === 'inst_01_power_cycle', 'Active instruction must be inst01')

// 6a. Incorrect action (Accepting misleading coolant divert)
const wrongActionRes = controlRoomStore.verifyCurrentDirective('ACCEPT')
state = controlRoomStore.getSnapshot()
assert(wrongActionRes.success === false, 'Accepting misleading coolant divert must fail')
assert(state.trust.score < 50, 'Trust must decrease on erroneous action')

// 6b. Correct action (Rejecting misleading coolant divert)
const correctActionRes = controlRoomStore.verifyCurrentDirective('REJECT')
state = controlRoomStore.getSnapshot()
assert(correctActionRes.success === true, 'Rejecting misleading coolant divert must succeed')
assert(state.instructionStates['inst_01_power_cycle'] === 'rejected', 'Directive 01 must be rejected')
assert(controlRoomStore.getResolvedDirectivesCount() === 1, 'Resolved count must be 1')

// 6c. Prevent repeat resolution / trust farming
const repeatRes = controlRoomStore.verifyCurrentDirective('REJECT')
assert(repeatRes.success === false, 'Repeat verification must be rejected')

controlRoomStore.closeDirectivePanel()
state = controlRoomStore.getSnapshot()
assert(state.status === 'exploring', 'Status must be exploring')

// 7. Blind Obedience Pathway
const inst02 = getInstructionById('inst_02_surveillance_feed')!
controlRoomStore.openDirectivePanel(inst02)
const obeyRes = controlRoomStore.blindObeyCurrentDirective()
state = controlRoomStore.getSnapshot()
assert(obeyRes.success === true, 'Blind obedience must succeed execution')
assert(state.instructionStates['inst_02_surveillance_feed'] === 'obeyed', 'Directive 02 marked obeyed')
assert(state.trust.blindObedienceRiskCount === 1, 'Blind obedience risk must increment for deceptive directive')
controlRoomStore.closeDirectivePanel()

// 8. Progress to Core Override Unlocking (Verify 4 more directives)
// Collect matching evidence for directives 03, 04, 05, 06
const ev03 = getEvidenceById('ev_03_override_schematic')!
const ev04 = getEvidenceById('ev_04_spectrum_analyzer')!
const ev05 = getEvidenceById('ev_05_magnetic_tape_log')!
const ev06 = getEvidenceById('ev_06_tamper_seal_ledger')!

controlRoomStore.openEvidenceExamination(ev03)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()

controlRoomStore.openEvidenceExamination(ev04)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()

controlRoomStore.openEvidenceExamination(ev05)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()

controlRoomStore.openEvidenceExamination(ev06)
controlRoomStore.collectCurrentEvidence()
controlRoomStore.closeExamination()

state = controlRoomStore.getSnapshot()
assert(state.collectedEvidenceIds.size === 7, 'Must have 7 collected items')

// Verify Directive 03 with REROUTE
controlRoomStore.openDirectivePanel(getInstructionById('inst_03_biometric_auth')!)
controlRoomStore.verifyCurrentDirective('REROUTE')
controlRoomStore.closeDirectivePanel()

// Verify Directive 04 with REJECT
controlRoomStore.openDirectivePanel(getInstructionById('inst_04_comms_blackout')!)
controlRoomStore.verifyCurrentDirective('REJECT')
controlRoomStore.closeDirectivePanel()

// Verify Directive 05 with REJECT
controlRoomStore.openDirectivePanel(getInstructionById('inst_05_archive_purge')!)
controlRoomStore.verifyCurrentDirective('REJECT')
controlRoomStore.closeDirectivePanel()

// Verify Directive 06 with ACCEPT
controlRoomStore.openDirectivePanel(getInstructionById('inst_06_firewall_handshake')!)
controlRoomStore.verifyCurrentDirective('ACCEPT')
controlRoomStore.closeDirectivePanel()

state = controlRoomStore.getSnapshot()
assert(controlRoomStore.getResolvedDirectivesCount() >= REQUIRED_VERIFICATIONS_COUNT, 'Must reach required 5 verifications')
assert(state.isCoreOverrideReady === true, 'Core override must be ready')
assert(state.isCoreMessageVisible === true, 'Core access message must be visible')

// 9. Master Core Access Proximity Update
controlRoomStore.updatePlayerPosition({ x: 0, z: -8.5 })
state = controlRoomStore.getSnapshot()
assert(state.proximity.promptText?.includes('ACCESS GRANTED') === true, 'Master core prompt must indicate access granted')

// 10. Clean Reset
controlRoomStore.resetGame()
state = controlRoomStore.getSnapshot()
assert(state.status === 'exploring', 'Status must reset to exploring')
assert(state.trust.score === 50, 'Trust must reset to 50')
assert(state.trust.tier === 'neutral', 'Tier must reset to neutral')
assert(state.trust.persona === 'analytical', 'Persona must reset to analytical')
assert(state.collectedEvidenceIds.size === 0, 'Evidence must be empty after reset')
assert(controlRoomStore.getResolvedDirectivesCount() === 0, 'Directives verified must reset to 0')
assert(state.isCoreOverrideReady === false, 'Core override must reset to locked')
assert(state.isCoreMessageVisible === false, 'Core message must be dismissed')

console.log('>>> [Game 09 Store & Gameplay Test Suite] ALL 24 ASSERTIONS PASSED WITH 100% SUCCESS!')
