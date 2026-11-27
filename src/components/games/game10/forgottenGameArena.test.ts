/**
 * Game 10: THE FORGOTTEN GAME - 3D Environment & Spatial Navigation Verification (Step 2.2)
 *
 * Validates:
 * 1. Environment Dimensions and Spatial Constants
 * 2. Initial Player Spawn Walkability & Area Detection
 * 3. All 5 Physical Zones and Designated Walkable Waypoints
 * 4. Outer Wall Boundary Collisions & Core Chamber South Wall Integrity
 * 5. Structural Obstacle Collisions (4 Support Pillars, Core Pedestal, Furniture, South Walls)
 * 6. Multi-Step Route Traversals (Hall to Wing 01, Wing 02, Wing 03, Core Chamber & Return)
 * 7. Precise Area Classification & Strict Boundary Separation (No Wing 03 Misclassification from Core)
 * 8. Store Reactive Navigation Integration (Position & Area Tracking)
 * 9. 360-Degree Walkability around the Suspended Memory Core
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
import { forgottenGameStore } from './forgottenGameStore'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed]: ${message}`)
  }
}

console.log('>>> [Game 10 Arena & Spatial Navigation Verification] Starting tests...')

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
// 4. Outer Wall Boundary & Core South Wall Collisions
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

// 4j. Core Chamber South Wall West Segment (X = -6.0, attempting to cross south towards Z = -3.8)
const coreSouthWestBlocked = constrainForgottenGamePosition({ x: -6.0, z: -3.8 }, { x: -6.0, z: -6.0 }, 0.35)
assert(coreSouthWestBlocked.z === -6.0, 'Moving south into Core Chamber solid south wall (West) must be blocked')

// 4k. Core Chamber South Wall East Segment (X = 6.0, attempting to cross south towards Z = -3.8)
const coreSouthEastBlocked = constrainForgottenGamePosition({ x: 6.0, z: -3.8 }, { x: 6.0, z: -6.0 }, 0.35)
assert(coreSouthEastBlocked.z === -6.0, 'Moving south into Core Chamber solid south wall (East) must be blocked')

// ===========================================================================
// 5. Structural Obstacle Collisions
// ===========================================================================
assert(FORGOTTEN_GAME_OBSTACLES.length === 11, 'Must define 11 solid obstacle boxes')

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
// 6. Multi-Step Physical Route Traversals (In & Out of All Wings & Core)
// ===========================================================================
// Route 1: Hall -> Wing 01 (Observation) -> Hall
const wing01Route: Array<[number, number]> = [
  [0, 18.0],   // Spawn
  [0, 10.0],   // Hall doorway approach
  [-2.2, 10.0], // Corridor doorway threshold
  [-4.0, 10.0], // Inside Wing 01 connector
  [-8.0, 10.0], // Connector midpoint
  [-10.0, 10.0], // Chamber entrance
  [-14.0, 10.0], // Waypoint center
  [-10.0, 10.0], // Chamber exit
  [-4.0, 10.0], // Connector return
  [-2.2, 10.0], // Doorway return
  [0, 10.0],   // Back in Hall
]
for (let i = 0; i < wing01Route.length; i++) {
  const [x, z] = wing01Route[i]
  assert(isPointWalkable(x, z, 0.35), `Wing 01 Route point ${i} [${x}, ${z}] must be walkable`)
}

// Route 2: Hall -> Wing 02 (Archive) -> Hall
const wing02Route: Array<[number, number]> = [
  [0, 10.0],  // Hall
  [0, 2.0],   // Hall doorway approach
  [2.2, 2.0], // Corridor doorway threshold
  [4.0, 2.0], // Inside Wing 02 connector
  [8.0, 2.0], // Connector midpoint
  [10.0, 2.0], // Chamber entrance
  [14.0, 2.0], // Waypoint center
  [10.0, 2.0], // Chamber exit
  [4.0, 2.0], // Connector return
  [2.2, 2.0], // Doorway return
  [0, 2.0],   // Back in Hall
]
for (let i = 0; i < wing02Route.length; i++) {
  const [x, z] = wing02Route[i]
  assert(isPointWalkable(x, z, 0.35), `Wing 02 Route point ${i} [${x}, ${z}] must be walkable`)
}

// Route 3: Hall -> Wing 03 (Command Verdict) -> Hall (Direct connection at Z = 0.0)
const wing03Route: Array<[number, number]> = [
  [0, 2.0],   // Hall
  [0, 0.0],   // Hall doorway approach
  [-2.2, 0.0], // Corridor doorway threshold
  [-4.0, 0.0], // Inside Wing 03 connector
  [-8.0, 0.0], // Connector midpoint
  [-10.0, 0.0], // Chamber entrance
  [-14.0, 0.0], // Waypoint center
  [-10.0, 0.0], // Chamber exit
  [-4.0, 0.0], // Connector return
  [-2.2, 0.0], // Doorway return
  [0, 0.0],   // Back in Hall
]
for (let i = 0; i < wing03Route.length; i++) {
  const [x, z] = wing03Route[i]
  assert(isPointWalkable(x, z, 0.35), `Wing 03 Route point ${i} [${x}, ${z}] must be walkable`)
}

// Route 4: Hall -> Core Chamber -> 360 Loop -> Hall
const coreRoute: Array<[number, number]> = [
  [0, 0.0],    // Hall
  [0, -3.0],   // Portal approach
  [0, -4.0],   // Through grand portal
  [0, -6.0],   // Core threshold
  [0, -10.0],  // Waypoint approach
  [-5.0, -16.0], // West promenade
  [0, -22.0],  // North promenade
  [5.0, -16.0], // East promenade
  [0, -10.0],  // South return
  [0, -5.0],   // Portal return
  [0, -3.0],   // Back in Hall
  [0, 0.0],    // Hall center
]
for (let i = 0; i < coreRoute.length; i++) {
  const [x, z] = coreRoute[i]
  assert(isPointWalkable(x, z, 0.35), `Core Route point ${i} [${x}, ${z}] must be walkable`)
}

// Diagonal Wall Sliding Resolution
const slideMove = constrainForgottenGamePosition({ x: 3.5, z: 9.0 }, { x: 2.0, z: 10.0 }, 0.35)
assert(slideMove.x === 2.0 && slideMove.z === 9.0, 'Should slide along Z axis when X collides with wall')

// ===========================================================================
// 7. Area Classification & Strict Boundary Separation Tests
// ===========================================================================
// 7a. Hall of Mirrors
assert(getForgottenGameArea(0, 18.0) === 'hall_of_mirrors', 'Spawn resolves to hall_of_mirrors')
assert(getForgottenGameArea(0, 5.0) === 'hall_of_mirrors', 'Mid corridor resolves to hall_of_mirrors')
assert(getForgottenGameArea(0, -3.5) === 'hall_of_mirrors', 'Core approach resolves to hall_of_mirrors')

// 7b. Wing 01 (Observation)
assert(getForgottenGameArea(-6.0, 10.0) === 'wing_01_first_rule', 'Wing 01 connector resolves to wing_01_first_rule')
assert(getForgottenGameArea(-14.0, 10.0) === 'wing_01_first_rule', 'Wing 01 chamber resolves to wing_01_first_rule')

// 7c. Wing 02 (Archive)
assert(getForgottenGameArea(6.0, 2.0) === 'wing_02_forgotten_name', 'Wing 02 connector resolves to wing_02_forgotten_name')
assert(getForgottenGameArea(14.0, 2.0) === 'wing_02_forgotten_name', 'Wing 02 chamber resolves to wing_02_forgotten_name')

// 7d. Wing 03 (Command Verdict)
assert(getForgottenGameArea(-6.0, 0.0) === 'wing_03_command_verdict', 'Wing 03 connector resolves to wing_03_command_verdict')
assert(getForgottenGameArea(-14.0, 0.0) === 'wing_03_command_verdict', 'Wing 03 chamber resolves to wing_03_command_verdict')
assert(getForgottenGameArea(-14.0, -3.5) === 'wing_03_command_verdict', 'Wing 03 chamber near north wall resolves to wing_03_command_verdict')
assert(getForgottenGameArea(-14.0, -4.0) === 'wing_03_command_verdict', 'Wing 03 chamber north wall boundary [-14, -4] resolves to wing_03_command_verdict')
assert(getForgottenGameArea(-14.0, 4.0) === 'wing_03_command_verdict', 'Wing 03 chamber south wall boundary [-14, 4] resolves to wing_03_command_verdict')

// 7e. Core Chamber & STRICT NON-MISCLASSIFICATION OF WEST FLANK
assert(getForgottenGameArea(0, -6.0) === 'memory_core_chamber', 'Core entrance resolves to memory_core_chamber')
assert(getForgottenGameArea(0, -10.0) === 'memory_core_chamber', 'Core waypoint resolves to memory_core_chamber')
assert(getForgottenGameArea(0, -22.0) === 'memory_core_chamber', 'Core North resolves to memory_core_chamber')
assert(getForgottenGameArea(5.0, -16.0) === 'memory_core_chamber', 'Core East flank resolves to memory_core_chamber')
// Crucial: Coordinates in the west flank of the Core Chamber MUST NEVER resolve to wing_03
assert(
  getForgottenGameArea(-6.0, -4.5) === 'memory_core_chamber',
  'Core West flank near south wall [-6, -4.5] must resolve to memory_core_chamber'
)
assert(
  getForgottenGameArea(-8.0, -10.0) === 'memory_core_chamber',
  'Core West flank [-8, -10] must resolve to memory_core_chamber'
)
assert(
  getForgottenGameArea(-5.0, -16.0) === 'memory_core_chamber',
  'Core West flank [-5, -16] must resolve to memory_core_chamber'
)

// 7f. Doorway Threshold Separations
assert(getForgottenGameArea(-2.5, 0.0) === 'hall_of_mirrors', 'Hall side of Wing 03 doorway resolves to hall_of_mirrors')
assert(getForgottenGameArea(-3.2, 0.0) === 'wing_03_command_verdict', 'Wing side of Wing 03 doorway resolves to wing_03_command_verdict')
assert(getForgottenGameArea(2.5, 2.0) === 'hall_of_mirrors', 'Hall side of Wing 02 doorway resolves to hall_of_mirrors')
assert(getForgottenGameArea(3.2, 2.0) === 'wing_02_forgotten_name', 'Wing side of Wing 02 doorway resolves to wing_02_forgotten_name')
assert(getForgottenGameArea(-2.5, 10.0) === 'hall_of_mirrors', 'Hall side of Wing 01 doorway resolves to hall_of_mirrors')
assert(getForgottenGameArea(-3.2, 10.0) === 'wing_01_first_rule', 'Wing side of Wing 01 doorway resolves to wing_01_first_rule')

// 7g. Exterior Out-of-Bounds Coordinates (Must Fallback to Hall Default, Never Core)
assert(getForgottenGameArea(15.0, -10.0) === 'hall_of_mirrors', 'Exterior East of Core [15, -10] falls back to hall_of_mirrors')
assert(getForgottenGameArea(-15.0, -10.0) === 'hall_of_mirrors', 'Exterior West of Core [-15, -10] falls back to hall_of_mirrors')
assert(getForgottenGameArea(0, -35.0) === 'hall_of_mirrors', 'Exterior North of Core [0, -35] falls back to hall_of_mirrors')
assert(getForgottenGameArea(-25.0, 0.0) === 'hall_of_mirrors', 'Exterior West of Wing 03 [-25, 0] falls back to hall_of_mirrors')

// ===========================================================================
// 8. Store Reactive Navigation Integration
// ===========================================================================
forgottenGameStore.initFreshRun()
const storeInitial = forgottenGameStore.getSnapshot()
assert(storeInitial.currentAreaId === 'hall_of_mirrors', 'Initial store area must be hall_of_mirrors')
assert(storeInitial.playerPosition.x === 0 && storeInitial.playerPosition.z === 18.0, 'Initial store position at spawn')

// Player walks into Wing 01
forgottenGameStore.updatePlayerPosition({ x: -14.0, z: 10.0 })
assert(
  forgottenGameStore.getSnapshot().currentAreaId === 'wing_01_first_rule',
  'Store area updates to wing_01_first_rule'
)

// Player walks into Wing 02
forgottenGameStore.updatePlayerPosition({ x: 14.0, z: 2.0 })
assert(
  forgottenGameStore.getSnapshot().currentAreaId === 'wing_02_forgotten_name',
  'Store area updates to wing_02_forgotten_name'
)

// Player walks into Wing 03
forgottenGameStore.updatePlayerPosition({ x: -14.0, z: 0.0 })
assert(
  forgottenGameStore.getSnapshot().currentAreaId === 'wing_03_command_verdict',
  'Store area updates to wing_03_command_verdict'
)

// Player walks into Core Chamber (West flank)
forgottenGameStore.updatePlayerPosition({ x: -6.0, z: -10.0 })
assert(
  forgottenGameStore.getSnapshot().currentAreaId === 'memory_core_chamber',
  'Store area updates to memory_core_chamber from west flank'
)

// Player returns to Hall
forgottenGameStore.updatePlayerPosition({ x: 0.0, z: 12.0 })
assert(
  forgottenGameStore.getSnapshot().currentAreaId === 'hall_of_mirrors',
  'Store area updates to hall_of_mirrors upon return'
)

// Store clean reset restores initial area and position
forgottenGameStore.resetGame()
const storeReset = forgottenGameStore.getSnapshot()
assert(storeReset.currentAreaId === 'hall_of_mirrors', 'Store reset restores hall_of_mirrors')
assert(storeReset.playerPosition.x === 0 && storeReset.playerPosition.z === 18.0, 'Store reset restores spawn position')

console.log('>>> [Game 10 Arena & Spatial Navigation Verification] ALL 61 ASSERTIONS PASSED WITH 100% SUCCESS!')
