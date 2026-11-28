/**
 * Game 10: THE FORGOTTEN GAME - Investigation Objects & Interaction Unit Tests (Step 2.3)
 * Validates:
 * 1. Interaction Object Definitions & Sector Registration
 * 2. Spatial Distance Calculation & Proximity Queries
 * 3. Nearest Interactable Selection & Radius Filtering
 * 4. Store Proximity State Tracking on Movement
 * 5. Interaction State Transitions (exploring -> inspecting -> exploring)
 * 6. Interaction Input Guarding (Out-of-range, duplicate triggers)
 * 7. Store Reset Clears All Interaction & Inspection State
 */

import {
  GAME10_INTERACTION_OBJECTS,
  findNearestInteractable,
} from './interactions/game10InteractionRegistry'
import { forgottenGameStore } from './forgottenGameStore'
import type { Game10InteractableObject } from './game10Types'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 10 Interactions Test Suite] Starting execution...')

// ===========================================================================
// 1. Registry Sanity & Canonical Object Verification
// ===========================================================================
console.log('--- 1. Registry Sanity & Canonical Object Verification ---')
assert(GAME10_INTERACTION_OBJECTS.length >= 3, 'Must register at least 3 investigation objects')

const ids = new Set(GAME10_INTERACTION_OBJECTS.map((o) => o.id))
assert(ids.has('obj_w01_observation_log'), 'Wing 01 observation terminal must exist')
assert(ids.has('obj_w02_admissions_ledger'), 'Wing 02 admissions ledger must exist')
assert(ids.has('obj_w03_optical_relay'), 'Wing 03 optical relay console must exist')

GAME10_INTERACTION_OBJECTS.forEach((obj) => {
  assert(obj.id.length > 0, 'Object id must be non-empty')
  assert(obj.name.length > 0, `Object ${obj.id} name must be non-empty`)
  assert(obj.areaId.length > 0, `Object ${obj.id} areaId must be non-empty`)
  assert(obj.worldPosition.length === 3, `Object ${obj.id} worldPosition must have 3 coordinates`)
  assert(obj.interactionRadius > 0, `Object ${obj.id} interactionRadius must be positive`)
  assert(obj.title.length > 0, `Object ${obj.id} title must be non-empty`)
  assert(obj.description.length > 0, `Object ${obj.id} description must be non-empty`)
  assert(obj.isInteractable === true, `Object ${obj.id} must be interactable by default`)
})

const w01Obj = GAME10_INTERACTION_OBJECTS.find((o) => o.id === 'obj_w01_observation_log')!
assert(w01Obj.areaId === 'wing_01_first_rule', 'w01Obj must belong to wing_01_first_rule')
assert(w01Obj.worldPosition[0] === -16.0 && w01Obj.worldPosition[2] === 10.0, 'w01Obj position matches [-16, 10]')

const w02Obj = GAME10_INTERACTION_OBJECTS.find((o) => o.id === 'obj_w02_admissions_ledger')!
assert(w02Obj.areaId === 'wing_02_forgotten_name', 'w02Obj must belong to wing_02_forgotten_name')
assert(w02Obj.worldPosition[0] === 14.0 && w02Obj.worldPosition[2] === -0.8, 'w02Obj position matches [14, -0.8]')

const w03Obj = GAME10_INTERACTION_OBJECTS.find((o) => o.id === 'obj_w03_optical_relay')!
assert(w03Obj.areaId === 'wing_03_command_verdict', 'w03Obj must belong to wing_03_command_verdict')
assert(w03Obj.worldPosition[0] === -16.0 && w03Obj.worldPosition[2] === 0.0, 'w03Obj position matches [-16, 0]')

console.log('✓ Section 1 Passed: All canonical objects verified.')

// ===========================================================================
// 2. Spatial Distance Calculation & Proximity Queries
// ===========================================================================
console.log('--- 2. Spatial Distance Calculation & Proximity Queries ---')

// Spawn position [0, 18.0] in Hall of Mirrors: Far away from all wing objects
const atSpawn = findNearestInteractable({ x: 0, z: 18.0 })
assert(atSpawn.nearest === null, 'Spawn position must not trigger any interaction')
assert(atSpawn.distance === Infinity, 'Spawn position distance must be Infinity')

// Position within Wing 01 interaction radius (obj at [-16.0, 10.0], radius 2.2m)
const nearW01 = findNearestInteractable({ x: -15.0, z: 10.0 })
assert(nearW01.nearest?.id === 'obj_w01_observation_log', 'Near W01 terminal should find obj_w01_observation_log')
assert(Math.abs(nearW01.distance - 1.0) < 0.001, 'Distance to W01 should be exactly 1.0m')

// Position just outside Wing 01 interaction radius (distance = 2.5m > 2.2m)
const outsideW01 = findNearestInteractable({ x: -13.5, z: 10.0 })
assert(outsideW01.nearest === null, 'Position outside radius should find no interactable')
assert(outsideW01.distance === Infinity, 'Distance outside radius should be Infinity')

// Position near Wing 02 counter ledger (obj at [14.0, -0.8], radius 2.2m)
const nearW02 = findNearestInteractable({ x: 13.5, z: -0.8 })
assert(nearW02.nearest?.id === 'obj_w02_admissions_ledger', 'Near W02 ledger should find obj_w02_admissions_ledger')
assert(Math.abs(nearW02.distance - 0.5) < 0.001, 'Distance to W02 should be 0.5m')

// Position near Wing 03 optical relay (obj at [-16.0, 0.0], radius 2.2m)
const nearW03 = findNearestInteractable({ x: -15.2, z: 0.0 })
assert(nearW03.nearest?.id === 'obj_w03_optical_relay', 'Near W03 relay should find obj_w03_optical_relay')
assert(Math.abs(nearW03.distance - 0.8) < 0.001, 'Distance to W03 should be 0.8m')

console.log('✓ Section 2 Passed: Spatial proximity queries accurately compute distances.')

// ===========================================================================
// 3. Nearest Selection & Status Filtering
// ===========================================================================
console.log('--- 3. Nearest Selection & Status Filtering ---')

const testObjects: Game10InteractableObject[] = [
  {
    id: 'test_obj_a',
    name: 'Object A',
    areaId: 'hall_of_mirrors',
    worldPosition: [0, 0, 10.0],
    interactionRadius: 3.0,
    isInteractable: true,
    title: 'TITLE A',
    description: 'DESC A',
  },
  {
    id: 'test_obj_b',
    name: 'Object B',
    areaId: 'hall_of_mirrors',
    worldPosition: [0, 0, 11.0],
    interactionRadius: 3.0,
    isInteractable: true,
    title: 'TITLE B',
    description: 'DESC B',
  },
]

// Standing at [0, 9.5]: Distance to A is 0.5m, distance to B is 1.5m -> Must pick A
const nearestChoice = findNearestInteractable({ x: 0, z: 9.5 }, testObjects)
assert(nearestChoice.nearest?.id === 'test_obj_a', 'Must pick closest object among multiple candidates')
assert(Math.abs(nearestChoice.distance - 0.5) < 0.001, 'Distance must match closest object')

// Standing at [0, 11.2]: Distance to B is 0.2m, distance to A is 1.2m -> Must pick B
const nearestChoiceB = findNearestInteractable({ x: 0, z: 11.2 }, testObjects)
assert(nearestChoiceB.nearest?.id === 'test_obj_b', 'Must pick B when closer to B')

// Non-interactable object filtering
const inactiveObjects: Game10InteractableObject[] = [
  {
    id: 'test_disabled',
    name: 'Disabled Object',
    areaId: 'hall_of_mirrors',
    worldPosition: [0, 0, 0],
    interactionRadius: 5.0,
    isInteractable: false,
    title: 'OFF',
    description: 'OFF',
  },
]
const inactiveQuery = findNearestInteractable({ x: 0, z: 0 }, inactiveObjects)
assert(inactiveQuery.nearest === null, 'Disabled object must never be returned as interactable')

console.log('✓ Section 3 Passed: Nearest selection and filtering verified.')

// ===========================================================================
// 4. Store Integration & Proximity State Tracking
// ===========================================================================
console.log('--- 4. Store Integration & Proximity State Tracking ---')

forgottenGameStore.initFreshRun()
let storeState = forgottenGameStore.getSnapshot()

assert(storeState.interactionStatus === 'exploring', 'Initial interaction status must be exploring')
assert(storeState.proximity.targetId === null, 'Initial targetId must be null')
assert(storeState.proximity.promptText === null, 'Initial promptText must be null')
assert(storeState.inspectingObject === null, 'Initial inspectingObject must be null')

// Player walks into Wing 01 near terminal
forgottenGameStore.updatePlayerPosition({ x: -15.0, z: 10.0 })
storeState = forgottenGameStore.getSnapshot()

assert(storeState.proximity.targetId === 'obj_w01_observation_log', 'Store proximity targetId must match W01 terminal')
assert(storeState.proximity.targetName === 'Observation Log Terminal', 'Store targetName must match terminal name')
assert(storeState.proximity.promptText === '[E] Investigate — Observation Log Terminal', 'Prompt text must match')
assert(storeState.proximity.activeObject?.id === 'obj_w01_observation_log', 'activeObject must be populated')
assert(Math.abs(storeState.proximity.distance - 1.0) < 0.001, 'Proximity distance must be 1.0m')

// Player walks away into center of hall
forgottenGameStore.updatePlayerPosition({ x: 0, z: 10.0 })
storeState = forgottenGameStore.getSnapshot()

assert(storeState.proximity.targetId === null, 'Moving away must clear targetId')
assert(storeState.proximity.promptText === null, 'Moving away must clear promptText')
assert(storeState.proximity.activeObject === null, 'Moving away must clear activeObject')
assert(storeState.proximity.distance === Infinity, 'Moving away must set distance to Infinity')

console.log('✓ Section 4 Passed: Store updates proximity dynamically on player movement.')

// ===========================================================================
// 5. Interaction State Transitions & Inspection Modal
// ===========================================================================
console.log('--- 5. Interaction State Transitions & Inspection Modal ---')

// 1. Move back to W01 terminal
forgottenGameStore.updatePlayerPosition({ x: -15.0, z: 10.0 })
assert(forgottenGameStore.getSnapshot().proximity.activeObject !== null, 'Object must be in range')

// 2. Trigger interaction [E]
const interactSuccess = forgottenGameStore.interact()
assert(interactSuccess === true, 'interact() must return true when object in range')

storeState = forgottenGameStore.getSnapshot()
assert(storeState.interactionStatus === 'inspecting', 'interactionStatus must change to inspecting')
assert(storeState.inspectingObject?.id === 'obj_w01_observation_log', 'inspectingObject must match target')
assert(storeState.inspectingObject?.title === 'OBSERVATION LOG TERMINAL // SECTOR 01', 'Modal title matches')

// 3. Attempt duplicate interact while already inspecting (must fail safely)
const duplicateInteract = forgottenGameStore.interact()
assert(duplicateInteract === false, 'Duplicate interact() while inspecting must return false')

// 4. Close inspection [ESC]
const closeSuccess = forgottenGameStore.closeInspection()
assert(closeSuccess === true, 'closeInspection() must return true when inspecting')

storeState = forgottenGameStore.getSnapshot()
assert(storeState.interactionStatus === 'exploring', 'interactionStatus must revert to exploring')
assert(storeState.inspectingObject === null, 'inspectingObject must be null after close')
assert(storeState.proximity.targetId === 'obj_w01_observation_log', 'Proximity must re-evaluate cleanly on close')

// 5. Attempt close when already exploring (must fail safely)
const redundantClose = forgottenGameStore.closeInspection()
assert(redundantClose === false, 'closeInspection() when already exploring must return false')

console.log('✓ Section 5 Passed: Interaction modal lifecycle verified.')

// ===========================================================================
// 6. Interaction Input Guarding Out-of-Range
// ===========================================================================
console.log('--- 6. Interaction Input Guarding Out-of-Range ---')

forgottenGameStore.updatePlayerPosition({ x: 0, z: 12.0 }) // Middle of hall
assert(forgottenGameStore.getSnapshot().proximity.activeObject === null, 'No object in range in hall')

const outOfRangeInteract = forgottenGameStore.interact()
assert(outOfRangeInteract === false, 'interact() must return false when no object is in range')
assert(forgottenGameStore.getSnapshot().interactionStatus === 'exploring', 'Status must stay exploring')
assert(forgottenGameStore.getSnapshot().inspectingObject === null, 'inspectingObject must stay null')

console.log('✓ Section 6 Passed: Out-of-range interaction input safely rejected.')

// ===========================================================================
// 7. Store Reset Clears All Interaction States
// ===========================================================================
console.log('--- 7. Store Reset Clears All Interaction States ---')

// Move to Wing 03 optical relay and open inspection
forgottenGameStore.updatePlayerPosition({ x: -15.5, z: 0.0 })
forgottenGameStore.interact()

assert(forgottenGameStore.getSnapshot().interactionStatus === 'inspecting', 'Should be inspecting')
assert(forgottenGameStore.getSnapshot().inspectingObject?.id === 'obj_w03_optical_relay', 'Inspecting W03')

// Trigger reset
forgottenGameStore.resetGame()
storeState = forgottenGameStore.getSnapshot()

assert(storeState.interactionStatus === 'exploring', 'Reset must restore exploring status')
assert(storeState.inspectingObject === null, 'Reset must clear inspectingObject')
assert(storeState.proximity.targetId === null, 'Reset must restore spawn proximity (null)')
assert(storeState.playerPosition.x === 0 && storeState.playerPosition.z === 18.0, 'Player reset to initial spawn')

console.log('✓ Section 7 Passed: Store reset clears all interaction and inspection states.')

console.log('======================================================================')
console.log('>>> [Game 10 Interactions Test Suite] ALL TESTS PASSED SUCCESSFULLY! <<<')
console.log('======================================================================')
