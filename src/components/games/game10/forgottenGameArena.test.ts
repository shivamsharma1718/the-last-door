/**
 * Game 10: THE FORGOTTEN GAME - 3D Environment & Spatial Collision Verification
 *
 * Validates:
 * 1. Environment Dimensions and Spatial Constants
 * 2. Initial Player Spawn Walkability & Area Detection
 * 3. All 5 Physical Zones and Designated Walkable Waypoints
 * 4. Outer Wall Boundary Collisions (North, South, East, West)
 * 5. Structural Obstacle Collisions (4 Support Pillars, Core Pedestal, Wing Furniture)
 * 6. Seamless Inter-Area Navigation & Wall Sliding Resolution
 * 7. 360-Degree Walkability around the Suspended Memory Core
 */

import {
  constrainForgottenGamePosition,
  getForgottenGameArea,
  isPointWalkable,
  FORGOTTEN_GAME_OBSTACLES,
} from './TheForgottenGameArena'
import {
  INITIAL_GAME10_POS,
  INITIAL_GAME10_LOOK,
  GAME10_TOTAL_WIDTH,
  GAME10_TOTAL_DEPTH,
  GAME10_CEILING_HEIGHT_HALL,
  GAME10_CEILING_HEIGHT_CORE,
  GAME10_AREAS,
} from './game10Types'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 10 Arena & Spatial Collision Verification] Starting tests...')

// ===========================================================================
// 1. Verify Environment Dimensions & Constants
// ===========================================================================
assert(GAME10_TOTAL_WIDTH === 46.0, 'Total width is 46.0m')
assert(GAME10_TOTAL_DEPTH === 52.0, 'Total depth is 52.0m')
assert(GAME10_CEILING_HEIGHT_HALL === 4.5, 'Hallway ceiling height is 4.5m')
assert(GAME10_CEILING_HEIGHT_CORE === 6.5, 'Memory Core ceiling height is 6.5m')

// ===========================================================================
// 2. Verify Initial Player Spawn Walkability & Area Detection
// ===========================================================================
const spawnX = INITIAL_GAME10_POS[0]
const spawnZ = INITIAL_GAME10_POS[2]
assert(spawnX === 0 && spawnZ === 18.0, 'Spawn point is [0, 1.65, 18.0]')
assert(INITIAL_GAME10_LOOK[0] === 0 && INITIAL_GAME10_LOOK[2] === 0.0, 'Spawn look target faces North')

const spawnWalkable = isPointWalkable(spawnX, spawnZ, 0.35)
assert(spawnWalkable === true, 'Player spawn point must be completely walkable')

const spawnConstrained = constrainForgottenGamePosition(
  { x: spawnX, z: spawnZ },
  { x: spawnX, z: spawnZ },
  0.35
)
assert(
  spawnConstrained.x === spawnX && spawnConstrained.z === spawnZ,
  'Spawn position must not collide with any obstacle or boundary'
)

const spawnArea = getForgottenGameArea(spawnX, spawnZ)
assert(
  spawnArea === 'hall_of_mirrors',
  `Spawn area must resolve to hall_of_mirrors, got: ${spawnArea}`
)

// ===========================================================================
// 3. Verify All 5 Physical Zones and Designated Walkable Waypoints
// ===========================================================================
assert(GAME10_AREAS.length === 5, 'Exactly 5 canonical areas defined')

const expectedWaypoints: Record<string, [number, number]> = {
  hall_of_mirrors: [0, 12.0],
  wing_01_first_rule: [-14.0, 10.0],
  wing_02_forgotten_name: [14.0, 2.0],
  wing_03_command_verdict: [-14.0, 0.0],
  memory_core_chamber: [0, -10.0],
}

for (const area of GAME10_AREAS) {
  const waypoint = expectedWaypoints[area.id]
  assert(Boolean(waypoint), `Area ${area.id} must have a designated waypoint`)

  const testWalk = isPointWalkable(waypoint[0], waypoint[1], 0.35)
  assert(
    testWalk === true,
    `Waypoint for area ${area.id} at [${waypoint[0]}, ${waypoint[1]}] must be walkable`
  )

  const testConstrain = constrainForgottenGamePosition(
    { x: waypoint[0], z: waypoint[1] },
    { x: waypoint[0], z: waypoint[1] },
    0.35
  )
  assert(
    testConstrain.x === waypoint[0] && testConstrain.z === waypoint[1],
    `Waypoint for area ${area.id} must be unobstructed`
  )

  const detectedArea = getForgottenGameArea(waypoint[0], waypoint[1])
  assert(
    detectedArea === area.id,
    `Waypoint coordinates [${waypoint[0]}, ${waypoint[1]}] must resolve to area ${area.id}, got: ${detectedArea}`
  )
}

// ===========================================================================
// 4. Outer Wall Boundary Collisions
// ===========================================================================
// 4a. South Corridor Boundary (Z = 22.0)
const southWall = constrainForgottenGamePosition({ x: 0, z: 23.0 }, { x: 0, z: 18.0 }, 0.35)
assert(southWall.z === 18.0, 'Moving past South outer boundary must be blocked')

// 4b. Hall West Wall (X = -3.0, at Z = 16.0)
const hallWestWall = constrainForgottenGamePosition({ x: -3.5, z: 16.0 }, { x: 0, z: 16.0 }, 0.35)
assert(hallWestWall.x === 0, 'Moving past Hall West wall must be blocked')

// 4c. Hall East Wall (X = 3.0, at Z = 16.0)
const hallEastWall = constrainForgottenGamePosition({ x: 3.5, z: 16.0 }, { x: 0, z: 16.0 }, 0.35)
assert(hallEastWall.x === 0, 'Moving past Hall East wall must be blocked')

// 4d. Memory Core Chamber North Boundary (Z = -28.0)
const coreNorthWall = constrainForgottenGamePosition({ x: 0, z: -29.0 }, { x: 0, z: -25.0 }, 0.35)
assert(coreNorthWall.z === -25.0, 'Moving past Core North outer wall must be blocked')

// 4e. Memory Core Chamber West Boundary (X = -10.0, at Z = -16.0)
const coreWestWall = constrainForgottenGamePosition({ x: -10.5, z: -16.0 }, { x: -5.0, z: -16.0 }, 0.35)
assert(coreWestWall.x === -5.0, 'Moving past Core West outer wall must be blocked')

// 4f. Memory Core Chamber East Boundary (X = 10.0, at Z = -16.0)
const coreEastWall = constrainForgottenGamePosition({ x: 10.5, z: -16.0 }, { x: 5.0, z: -16.0 }, 0.35)
assert(coreEastWall.x === 5.0, 'Moving past Core East outer wall must be blocked')

// 4g. Wing 01 West Wall Boundary (X = -18.0, at Z = 10.0)
const wing01WestWall = constrainForgottenGamePosition({ x: -18.5, z: 10.0 }, { x: -14.0, z: 10.0 }, 0.35)
assert(wing01WestWall.x === -14.0, 'Moving past Wing 01 West wall must be blocked')

// 4h. Wing 02 East Wall Boundary (X = 18.0, at Z = 2.0)
const wing02EastWall = constrainForgottenGamePosition({ x: 18.5, z: 2.0 }, { x: 14.0, z: 2.0 }, 0.35)
assert(wing02EastWall.x === 14.0, 'Moving past Wing 02 East wall must be blocked')

// 4i. Wing 03 West Wall Boundary (X = -18.0, at Z = 0.0)
const wing03WestWall = constrainForgottenGamePosition({ x: -18.5, z: 0.0 }, { x: -14.0, z: 0.0 }, 0.35)
assert(wing03WestWall.x === -14.0, 'Moving past Wing 03 West wall must be blocked')

// ===========================================================================
// 5. Structural Obstacle Collisions
// ===========================================================================
assert(FORGOTTEN_GAME_OBSTACLES.length === 9, 'Must define 9 solid obstacle boxes')

// 5a. NW Pillar Collision (at [-7.0, -22.0])
const nwPillar = constrainForgottenGamePosition({ x: -7.0, z: -22.0 }, { x: -5.0, z: -22.0 }, 0.35)
assert(nwPillar.x === -5.0, 'Moving directly into NW Pillar must be blocked')

// 5b. NE Pillar Collision (at [7.0, -22.0])
const nePillar = constrainForgottenGamePosition({ x: 7.0, z: -22.0 }, { x: 5.0, z: -22.0 }, 0.35)
assert(nePillar.x === 5.0, 'Moving directly into NE Pillar must be blocked')

// 5c. SW Pillar Collision (at [-7.0, -10.0])
const swPillar = constrainForgottenGamePosition({ x: -7.0, z: -10.0 }, { x: -5.0, z: -10.0 }, 0.35)
assert(swPillar.x === -5.0, 'Moving directly into SW Pillar must be blocked')

// 5d. SE Pillar Collision (at [7.0, -10.0])
const sePillar = constrainForgottenGamePosition({ x: 7.0, z: -10.0 }, { x: 5.0, z: -10.0 }, 0.35)
assert(sePillar.x === 5.0, 'Moving directly into SE Pillar must be blocked')

// 5e. Central Memory Core Dais Pedestal (at [0, -16.0])
const corePedestal = constrainForgottenGamePosition({ x: 0, z: -16.0 }, { x: 0, z: -13.0 }, 0.35)
assert(corePedestal.z === -13.0, 'Moving directly into Central Core Pedestal must be blocked')

// 5f. Wing 01 Dais Bench Collision (at [-14.0, 12.8])
const wing01Bench = constrainForgottenGamePosition({ x: -14.0, z: 12.8 }, { x: -14.0, z: 10.0 }, 0.35)
assert(wing01Bench.z === 10.0, 'Moving directly into Wing 01 Dais Bench must be blocked')

// 5g. Wing 02 Registry Counter Collision (at [14.0, -0.8])
const wing02Counter = constrainForgottenGamePosition({ x: 14.0, z: -0.8 }, { x: 14.0, z: 2.0 }, 0.35)
assert(wing02Counter.z === 2.0, 'Moving directly into Wing 02 Counter must be blocked')

// 5h. Wing 03 Server Rack Monolith Collision (at [-17.3, 0.0])
const wing03Rack = constrainForgottenGamePosition({ x: -17.3, z: 0.0 }, { x: -14.0, z: 0.0 }, 0.35)
assert(wing03Rack.x === -14.0, 'Moving directly into Wing 03 Server Rack must be blocked')

// ===========================================================================
// 6. Seamless Inter-Area Navigation & Wall Sliding Tests
// ===========================================================================
// 6a. Walk North from Hall into Core Chamber
const toChamber = constrainForgottenGamePosition({ x: 0, z: -6.0 }, { x: 0, z: -2.0 }, 0.35)
assert(toChamber.x === 0 && toChamber.z === -6.0, 'Navigating from Hall into Core Chamber must be open')

// 6b. Walk West from Hall into Wing 01 Connector
const toWing01Connector = constrainForgottenGamePosition({ x: -6.0, z: 10.0 }, { x: 0, z: 10.0 }, 0.35)
assert(toWing01Connector.x === -6.0 && toWing01Connector.z === 10.0, 'Navigating from Hall into Wing 01 connector must be open')

// 6c. Walk West from Connector into Wing 01 Chamber
const toWing01Chamber = constrainForgottenGamePosition({ x: -14.0, z: 10.0 }, { x: -6.0, z: 10.0 }, 0.35)
assert(toWing01Chamber.x === -14.0 && toWing01Chamber.z === 10.0, 'Navigating into Wing 01 chamber must be open')

// 6d. Walk East from Hall into Wing 02 Connector
const toWing02Connector = constrainForgottenGamePosition({ x: 6.0, z: 2.0 }, { x: 0, z: 2.0 }, 0.35)
assert(toWing02Connector.x === 6.0 && toWing02Connector.z === 2.0, 'Navigating from Hall into Wing 02 connector must be open')

// 6e. Walk East from Connector into Wing 02 Chamber
const toWing02Chamber = constrainForgottenGamePosition({ x: 14.0, z: 2.0 }, { x: 6.0, z: 2.0 }, 0.35)
assert(toWing02Chamber.x === 14.0 && toWing02Chamber.z === 2.0, 'Navigating into Wing 02 chamber must be open')

// 6f. Walk West from Hall into Wing 03 Connector
const toWing03Connector = constrainForgottenGamePosition({ x: -6.0, z: 0.0 }, { x: 0, z: 0.0 }, 0.35)
assert(toWing03Connector.x === -6.0 && toWing03Connector.z === 0.0, 'Navigating from Hall into Wing 03 connector must be open')

// 6g. Walk West from Connector into Wing 03 Chamber
const toWing03Chamber = constrainForgottenGamePosition({ x: -14.0, z: 0.0 }, { x: -6.0, z: 0.0 }, 0.35)
assert(toWing03Chamber.x === -14.0 && toWing03Chamber.z === 0.0, 'Navigating into Wing 03 chamber must be open')

// 6h. Diagonal Wall Sliding Resolution
// Player is at [2.0, 10.0] in Hall, attempts diagonal move towards [3.5, 9.0] (hitting East wall)
const slideMove = constrainForgottenGamePosition({ x: 3.5, z: 9.0 }, { x: 2.0, z: 10.0 }, 0.35)
assert(slideMove.x === 2.0 && slideMove.z === 9.0, 'Should slide along Z axis when X collides with wall')

// ===========================================================================
// 7. 360-Degree Walkability Around Suspended Memory Core
// ===========================================================================
const corePerimeterPoints: Array<[number, number]> = [
  [0, -10.0],   // South approach
  [-5.0, -16.0], // West flank
  [0, -22.0],   // North promenade
  [5.0, -16.0],  // East flank
]

for (const [px, pz] of corePerimeterPoints) {
  const walkable = isPointWalkable(px, pz, 0.35)
  assert(walkable === true, `Core perimeter position [${px}, ${pz}] must be completely walkable`)
  const testP = constrainForgottenGamePosition({ x: px, z: pz }, { x: px, z: pz }, 0.35)
  assert(testP.x === px && testP.z === pz, `Core perimeter position [${px}, ${pz}] must be unobstructed`)
}

console.log('>>> [Game 10 Arena & Spatial Collision Verification] ALL 32 ASSERTIONS PASSED WITH 100% SUCCESS!')
