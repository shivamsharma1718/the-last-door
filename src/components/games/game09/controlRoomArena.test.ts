/**
 * Game 09: THE CONTROL ROOM - 3D Environment & Spatial Collision Verification
 */

import {
  constrainControlRoomPosition,
} from './TheControlRoomArena'
import {
  INITIAL_CONTROL_ROOM_POS,
  CONTROL_ROOM_TOTAL_WIDTH,
  CONTROL_ROOM_TOTAL_DEPTH,
  CONTROL_ROOM_CEILING_HEIGHT,
} from './controlRoomTypes'
import {
  CONTROL_ROOM_AREAS,
  CONTROL_ROOM_EVIDENCE,
  getAreaByPosition,
} from './controlRoomLogic'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 09 Arena Verification] Starting tests...')

// 1. Verify Environment Dimensions
assert(CONTROL_ROOM_TOTAL_WIDTH === 26.0, 'Width is 26.0m')
assert(CONTROL_ROOM_TOTAL_DEPTH === 24.0, 'Depth is 24.0m')
assert(CONTROL_ROOM_CEILING_HEIGHT === 4.2, 'Height is 4.2m')

// 2. Verify Initial Player Spawn Walkability & Area Detection
const spawnX = INITIAL_CONTROL_ROOM_POS[0]
const spawnZ = INITIAL_CONTROL_ROOM_POS[2]
const spawnConstrained = constrainControlRoomPosition({ x: spawnX, z: spawnZ }, { x: spawnX, z: spawnZ }, 0.35)
assert(spawnConstrained.x === spawnX && spawnConstrained.z === spawnZ, 'Spawn position must not collide with obstacles')
const spawnArea = getAreaByPosition(spawnX, spawnZ)
assert(spawnArea === 'entry_airlock', `Spawn area must be entry_airlock, got: ${spawnArea}`)

// 3. Verify All 8 Physical Areas Exist and Are Navigable
const areaWaypoints: Record<string, [number, number]> = {
  entry_airlock: [0, 10.0],
  central_command: [0, 3.5],
  surveillance_wall: [-8.5, 2.0],
  telemetry_station: [8.5, 2.0],
  power_grid: [6.0, -6.5],
  logic_vault: [-6.0, -6.5],
  system_core: [0, -6.0],
  exit_bulkhead: [0, -11.2],
}

assert(CONTROL_ROOM_AREAS.length === 8, 'Exactly 8 areas defined')
for (const area of CONTROL_ROOM_AREAS) {
  const waypoint = areaWaypoints[area.id]
  assert(!!waypoint, `Area ${area.id} must have a designated walkable waypoint`)
  const testMove = constrainControlRoomPosition(
    { x: waypoint[0], z: waypoint[1] },
    { x: waypoint[0], z: waypoint[1] },
    0.35
  )
  assert(
    testMove.x === waypoint[0] && testMove.z === waypoint[1],
    `Waypoint for area ${area.id} at [${waypoint[0]}, ${waypoint[1]}] must be unobstructed`
  )
  const detected = getAreaByPosition(waypoint[0], waypoint[1])
  assert(detected === area.id, `Waypoint coordinates must resolve to area ${area.id}, got: ${detected}`)
}

// 4. Verify Boundary and Obstacle Collisions
// 4a. Outer North Wall Boundary (Z = -12.0)
const northWallTest = constrainControlRoomPosition({ x: 0, z: -12.5 }, { x: 0, z: -10.5 }, 0.35)
assert(northWallTest.z === -10.5, 'Moving through outer North wall must be blocked')

// 4b. Outer South Wall Boundary (Z = +12.0)
const southWallTest = constrainControlRoomPosition({ x: 0, z: 12.5 }, { x: 0, z: 10.0 }, 0.35)
assert(southWallTest.z === 10.0, 'Moving through outer South wall must be blocked')

// 4c. Outer West Wall Boundary (X = -13.0)
const westWallTest = constrainControlRoomPosition({ x: -13.5, z: 2.0 }, { x: -8.5, z: 2.0 }, 0.35)
assert(westWallTest.x === -8.5, 'Moving through outer West wall must be blocked')

// 4d. Outer East Wall Boundary (X = +13.0)
const eastWallTest = constrainControlRoomPosition({ x: 13.5, z: 2.0 }, { x: 8.5, z: 2.0 }, 0.35)
assert(eastWallTest.x === 8.5, 'Moving through outer East wall must be blocked')

// 4e. Solid Column Obstacle Collision (SW Column at [-4.5, 4.5])
const columnTest = constrainControlRoomPosition({ x: -4.5, z: 4.5 }, { x: -3.5, z: 4.5 }, 0.35)
assert(columnTest.x === -3.5, 'Moving directly into SW Column must be blocked')

// 4f. Central Console Obstacle Collision ([0, 2.0])
const consoleTest = constrainControlRoomPosition({ x: 0, z: 2.0 }, { x: 0, z: 3.5 }, 0.35)
assert(consoleTest.z === 3.5, 'Moving directly into Central Console must be blocked')

// 5. Verify All 8 Canonical Evidence Props Locations
assert(CONTROL_ROOM_EVIDENCE.length === 8, 'Exactly 8 physical evidence props defined')
const expectedEvidenceCoords: Record<string, [number, number, number]> = {
  ev_01_coolant_gauge: [8.2, 1.4, -6.8],
  ev_02_cctv_timecode: [-9.2, 1.3, 1.6],
  ev_03_override_schematic: [-1.8, 1.0, 3.2],
  ev_04_spectrum_analyzer: [9.1, 1.2, 2.5],
  ev_05_magnetic_tape_log: [-8.1, 1.1, -7.2],
  ev_06_tamper_seal_ledger: [-6.8, 1.0, -5.8],
  ev_07_crucible_manifest: [1.6, 1.0, 1.5],
  ev_08_core_failsafe_blueprint: [0, 1.1, -7.2],
}

for (const ev of CONTROL_ROOM_EVIDENCE) {
  const expected = expectedEvidenceCoords[ev.id]
  assert(!!expected, `Evidence prop ${ev.id} must have expected coordinates`)
  assert(
    ev.worldPosition[0] === expected[0] &&
    ev.worldPosition[1] === expected[1] &&
    ev.worldPosition[2] === expected[2],
    `Evidence ${ev.id} position must match Step 1 canonical coordinates`
  )
}

console.log('>>> [Game 09 Arena Verification] ALL 18 ENVIRONMENT & COLLISION ASSERTIONS PASSED WITH 100% SUCCESS!')
