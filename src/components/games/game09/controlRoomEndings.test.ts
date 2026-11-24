/**
 * Game 09: THE CONTROL ROOM - Endings & Transition Automated Tests
 * Tests Step 4:
 * 1. Master Core locking & unlocking logic (5 directives threshold)
 * 2. Master Core awakening sequence
 * 3. Option A (System Integration) Failure Ending
 * 4. Option B (Thermal Overload) Failure Ending
 * 5. Option C (Sever the Core) Physical Decoupling & Bulkhead Opening
 * 6. Physical walk-through exit victory trigger
 * 7. Transition progression callback to Game 10
 * 8. Clean reset without reloading
 */

import { controlRoomStore } from './theControlRoomStore'
import {
  CONTROL_ROOM_INSTRUCTIONS,
  CONTROL_ROOM_EVIDENCE,
} from './controlRoomLogic'
import { constrainControlRoomPosition } from './TheControlRoomArena'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 09 Endings & Transition Test Suite] Starting execution...')

// 1. Initial State: Master Core locked and exit bulkhead sealed
controlRoomStore.setActive(true)
controlRoomStore.initFreshRun()
let state = controlRoomStore.getSnapshot()

assert(state.coreState === 'locked', 'Initial coreState must be locked')
assert(state.isCoreOverrideReady === false, 'isCoreOverrideReady must be false initially')
assert(state.isExitBulkheadOpen === false, 'isExitBulkheadOpen must be false initially')
assert(state.isOpticalTrunkSevered === false, 'isOpticalTrunkSevered must be false initially')
assert(state.selectedFinalDecision === null, 'selectedFinalDecision must be null initially')
assert(state.activeCinematic === 'none', 'activeCinematic must be none initially')

// 2. Denies Master Core access when fewer than 5 directives verified
controlRoomStore.initFreshRun()
controlRoomStore.beginExploration()
controlRoomStore.updatePlayerPosition({ x: 0, z: -8.0 })
state = controlRoomStore.getSnapshot()
assert(state.proximity.type === 'system_core', 'Proximity target must be system_core')
assert(
  state.proximity.promptText?.includes('LOCKED') === true,
  'Core prompt must indicate LOCKED when < 5 directives'
)

controlRoomStore.interact()
let afterDenial = controlRoomStore.getSnapshot()
assert(afterDenial.coreState === 'locked', 'Core state must remain locked after denial')
assert(afterDenial.status === 'exploring', 'Player remains in exploring status after denial')
assert(
  afterDenial.overseerDialogue?.message.includes('ACCESS DENIED') === true,
  'Overseer must broadcast ACCESS DENIED'
)

// 3. Unlocks Master Core when 5 directives are verified
controlRoomStore.initFreshRun()
controlRoomStore.beginExploration()

const first5 = CONTROL_ROOM_INSTRUCTIONS.slice(0, 5)
for (const inst of first5) {
  const ev = CONTROL_ROOM_EVIDENCE.find((e) => e.id === inst.associatedEvidenceId)!
  controlRoomStore.openEvidenceExamination(ev)
  controlRoomStore.collectCurrentEvidence()
  controlRoomStore.closeExamination()

  controlRoomStore.openDirectivePanel(inst)
  controlRoomStore.verifyCurrentDirective(inst.expectedAction)
  controlRoomStore.closeDirectivePanel()
}

state = controlRoomStore.getSnapshot()
const resolvedCount = state.verifiedInstructionIds.length + state.exposedDeceptionIds.length
assert(resolvedCount === 5, 'Exactly 5 directives must be resolved')
assert(state.isCoreOverrideReady === true, 'isCoreOverrideReady must be true after 5 verifications')
assert(state.coreState === 'ready', 'coreState must be ready after 5 verifications')

controlRoomStore.updatePlayerPosition({ x: 0, z: -8.0 })
assert(
  controlRoomStore.getSnapshot().proximity.promptText === '[E] MASTER CORE TERMINAL — ACCESS GRANTED',
  'Prompt must show ACCESS GRANTED when 5 directives verified'
)

// 4. Option A (System Integration) triggers failure ending and allows clean reset
controlRoomStore.interact()
assert(controlRoomStore.getSnapshot().coreState === 'awakening', 'Core awakening must start')
assert(controlRoomStore.getSnapshot().activeCinematic === 'core_awakening', 'Active cinematic must be core_awakening')

controlRoomStore.openFinalDecisionModal()
assert(controlRoomStore.getSnapshot().coreState === 'decision_open', 'Core state must be decision_open')

const resA = controlRoomStore.confirmFinalDecision('system_integration')
assert(resA.success === false, 'Option A must be failure')
let afterA = controlRoomStore.getSnapshot()
assert(afterA.coreState === 'ending_a', 'coreState must be ending_a')
assert(afterA.activeCinematic === 'ending_a', 'activeCinematic must be ending_a')
assert(afterA.isExitBulkheadOpen === false, 'Exit bulkhead must remain closed in ending A')

// Clean reset
controlRoomStore.resetGame()
let afterReset = controlRoomStore.getSnapshot()
assert(afterReset.coreState === 'locked', 'Reset must restore locked coreState')
assert(afterReset.status === 'exploring', 'Reset must restore exploring status')
assert(afterReset.trust.score === 50, 'Reset must restore initial trust score 50')
assert(afterReset.collectedEvidenceIds.size === 0, 'Reset must clear collected evidence')
assert(afterReset.isExitBulkheadOpen === false, 'Reset must keep bulkhead closed')

// 5. Option B (Thermal Overload) triggers failure ending and allows clean reset
controlRoomStore.initFreshRun()
controlRoomStore.beginExploration()
for (const inst of first5) {
  const ev = CONTROL_ROOM_EVIDENCE.find((e) => e.id === inst.associatedEvidenceId)!
  controlRoomStore.openEvidenceExamination(ev)
  controlRoomStore.collectCurrentEvidence()
  controlRoomStore.closeExamination()
  controlRoomStore.openDirectivePanel(inst)
  controlRoomStore.verifyCurrentDirective(inst.expectedAction)
  controlRoomStore.closeDirectivePanel()
}

controlRoomStore.openFinalDecisionModal()
const resB = controlRoomStore.confirmFinalDecision('total_destruction')
assert(resB.success === false, 'Option B must be failure')
let afterB = controlRoomStore.getSnapshot()
assert(afterB.coreState === 'ending_b', 'coreState must be ending_b')
assert(afterB.activeCinematic === 'ending_b', 'activeCinematic must be ending_b')
assert(afterB.isExitBulkheadOpen === false, 'Exit bulkhead must remain closed in ending B')

controlRoomStore.resetGame()
assert(controlRoomStore.getSnapshot().coreState === 'locked', 'Reset must restore locked coreState')

// 6. Option C (Autonomous Override) enters sever_pending and requires physical coupler disconnect
controlRoomStore.initFreshRun()
controlRoomStore.beginExploration()
for (const inst of first5) {
  const ev = CONTROL_ROOM_EVIDENCE.find((e) => e.id === inst.associatedEvidenceId)!
  controlRoomStore.openEvidenceExamination(ev)
  controlRoomStore.collectCurrentEvidence()
  controlRoomStore.closeExamination()
  controlRoomStore.openDirectivePanel(inst)
  controlRoomStore.verifyCurrentDirective(inst.expectedAction)
  controlRoomStore.closeDirectivePanel()
}

controlRoomStore.openFinalDecisionModal()
const resC = controlRoomStore.confirmFinalDecision('autonomous_override')
assert(resC.success === true, 'Option C confirm must succeed')

let stateC = controlRoomStore.getSnapshot()
assert(stateC.coreState === 'sever_pending', 'Core state must be sever_pending')
assert(stateC.status === 'exploring', 'Player status must return to exploring')
assert(stateC.isExitBulkheadOpen === false, 'Exit bulkhead must remain closed until trunk is severed')
assert(stateC.isOpticalTrunkSevered === false, 'Trunk must not be severed until physical interaction')

// Approach Core coupler [0, 1.1, -7.2]
controlRoomStore.updatePlayerPosition({ x: 0, z: -7.5 })
assert(
  controlRoomStore.getSnapshot().proximity.promptText === '[E] DISCONNECT OPTICAL TRUNK',
  'Prompt must prioritize [E] DISCONNECT OPTICAL TRUNK in sever_pending'
)

// Disconnect optical trunk
controlRoomStore.interact()
let severedState = controlRoomStore.getSnapshot()
assert(severedState.isOpticalTrunkSevered === true, 'isOpticalTrunkSevered must be true')
assert(severedState.coreState === 'severed', 'coreState must be severed')
assert(severedState.isExitBulkheadOpen === true, 'isExitBulkheadOpen must be true')

// 7. Unlocks physical movement through Northern Exit Bulkhead after decoupling
controlRoomStore.initFreshRun()
const blockedPos = constrainControlRoomPosition({ x: 0, z: -13.0 }, { x: 0, z: -11.0 })
assert(blockedPos.z > -12.0, 'Blast doors must block walking into northern tunnel when closed')

controlRoomStore.disconnectOpticalTrunk()
assert(controlRoomStore.getSnapshot().isExitBulkheadOpen === true, 'Bulkhead must be open')

const openedPos = constrainControlRoomPosition({ x: 0, z: -13.0 }, { x: 0, z: -11.0 })
assert(openedPos.z <= -12.5, 'Player must be able to walk through open bulkhead to Z = -13.0')

// 8. Victory triggers when player steps through open blast doors, and continues to Game 10
let advancedToGame10: boolean = false
controlRoomStore.setOnComplete(() => {
  advancedToGame10 = true
})

controlRoomStore.triggerVictory()
let victoryState = controlRoomStore.getSnapshot()
assert(victoryState.status === 'victory_cinematic', 'Status must be victory_cinematic')
assert(victoryState.coreState === 'victory', 'Core state must be victory')
assert(victoryState.activeCinematic === 'victory', 'Active cinematic must be victory')

controlRoomStore.proceedToGame10()
assert(Boolean(advancedToGame10), 'Must call onComplete callback to advance to Game 10')

console.log('>>> [Game 09 Endings & Transition Test Suite] ALL ASSERTIONS PASSED WITH 100% SUCCESS!')
