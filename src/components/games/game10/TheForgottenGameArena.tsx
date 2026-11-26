/**
 * Game 10: THE FORGOTTEN GAME - Complete 3D Environment Arena & Spatial Collision System
 *
 * Coordinates:
 * - 46m x 52m Brutalist Memory Manipulation Complex
 * - 5 Distinct Zones:
 *   1. Hall of Distorted Mirrors (Z = 22.0 to -4.0, X in [-3.0, 3.0])
 *   2. Memory Wing 01: The First Rule (West, Observation, X in [-18.0, -3.0], Z in [6.0, 14.0])
 *   3. Memory Wing 02: The Forgotten Name (East, Clinical Registry, X in [3.0, 18.0], Z in [-2.0, 6.0])
 *   4. Memory Wing 03: The Command Verdict (West, Industrial Relay, X in [-18.0, -3.0], Z in [-4.0, 4.0])
 *   5. Memory Core Chamber (North, Grand Sanctuary, X in [-10.0, 10.0], Z in [-28.0, -4.0])
 * - Sliding AABB collision resolution for walls, pillars, and pedestals
 * - Seamless area transition detection
 */

import React from 'react'
import { ForgottenGameLighting } from './ForgottenGameLighting'
import { ForgottenGameArchitecture } from './ForgottenGameArchitecture'
import type { Game10AreaId } from './game10Types'

// ---------------------------------------------------------------------------
// 1. Spatial Collision Definitions & Obstacle Bounding Boxes
// ---------------------------------------------------------------------------

export interface AABB {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

// Walkable Zones
export const FORGOTTEN_GAME_ZONES: Record<string, AABB> = {
  // Main Corridor (Z = -4.5 to 21.8)
  hall_of_mirrors: { minX: -2.8, maxX: 2.8, minZ: -4.5, maxZ: 21.8 },

  // Wing 01: The First Rule (West)
  wing_01_connector: { minX: -10.5, maxX: -2.0, minZ: 8.8, maxZ: 11.2 },
  wing_01_chamber: { minX: -17.6, maxX: -9.5, minZ: 6.4, maxZ: 13.6 },

  // Wing 02: The Forgotten Name (East)
  wing_02_connector: { minX: 2.0, maxX: 10.5, minZ: 0.8, maxZ: 3.2 },
  wing_02_chamber: { minX: 9.5, maxX: 17.6, minZ: -1.6, maxZ: 5.6 },

  // Wing 03: The Command Verdict (West)
  wing_03_connector: { minX: -10.5, maxX: -2.0, minZ: -1.2, maxZ: 1.2 },
  wing_03_chamber: { minX: -17.6, maxX: -9.5, minZ: -3.6, maxZ: 3.6 },

  // Memory Core Chamber (North)
  memory_core_chamber: { minX: -9.6, maxX: 9.6, minZ: -27.6, maxZ: -3.5 },
}

// Solid Physical Obstacles
export const FORGOTTEN_GAME_OBSTACLES: AABB[] = [
  // Four Grand Concrete Structural Pillars in Core Chamber (1.2m x 1.2m)
  { minX: -7.7, maxX: -6.3, minZ: -22.7, maxZ: -21.3 }, // NW Pillar
  { minX: 6.3, maxX: 7.7, minZ: -22.7, maxZ: -21.3 },   // NE Pillar
  { minX: -7.7, maxX: -6.3, minZ: -10.7, maxZ: -9.3 },  // SW Pillar
  { minX: 6.3, maxX: 7.7, minZ: -10.7, maxZ: -9.3 },   // SE Pillar

  // Memory Core Center Dais Platform Obstacle (Pedestal at center [0, -16.0])
  { minX: -1.2, maxX: 1.2, minZ: -17.2, maxZ: -14.8 },

  // Wing 01 Observation Dais Bench (against North wall of chamber)
  { minX: -15.9, maxX: -12.1, minZ: 12.1, maxZ: 13.5 },

  // Wing 02 Registry Counter & Filing Monoliths
  { minX: 12.1, maxX: 15.9, minZ: -1.5, maxZ: -0.1 },  // Counter desk
  { minX: 16.9, maxX: 17.7, minZ: -0.7, maxZ: 4.7 },   // Filing Monoliths

  // Wing 03 Server Rack & Relay Monolith
  { minX: -17.8, maxX: -16.8, minZ: -1.7, maxZ: 1.7 }, // Server rack
]

// ---------------------------------------------------------------------------
// 2. Spatial Query & Collision Functions
// ---------------------------------------------------------------------------

/**
 * Determines which canonical Game 10 facility area contains the given coordinates.
 */
export function getForgottenGameArea(x: number, z: number): Game10AreaId {
  // Wing 01: West, Z in [6.0, 14.0]
  if (x <= -2.8 && z >= 4.0) {
    return 'wing_01_first_rule'
  }
  // Wing 03: West, Z in [-4.0, 4.0]
  if (x <= -2.8 && z < 4.0 && z >= -4.2) {
    return 'wing_03_command_verdict'
  }
  // Wing 02: East, Z in [-2.5, 6.0]
  if (x >= 2.8 && z <= 6.0 && z >= -2.5) {
    return 'wing_02_forgotten_name'
  }
  // Memory Core Chamber: North, Z <= -4.0
  if (z <= -4.0) {
    return 'memory_core_chamber'
  }
  // Main Corridor
  return 'hall_of_mirrors'
}

/**
 * Tests whether a circular player footprint of radius `radius` at (x, z) is walkable.
 * Must be within at least one valid walkable zone, and not intersecting any obstacle.
 */
export function isPointWalkable(x: number, z: number, radius: number = 0.35): boolean {
  // 1. Test containment within the connected walkable zones
  let insideWalkableZone = false

  // A. Hall of Mirrors Corridor
  if (
    x >= FORGOTTEN_GAME_ZONES.hall_of_mirrors.minX + radius &&
    x <= FORGOTTEN_GAME_ZONES.hall_of_mirrors.maxX - radius &&
    z >= FORGOTTEN_GAME_ZONES.hall_of_mirrors.minZ &&
    z <= FORGOTTEN_GAME_ZONES.hall_of_mirrors.maxZ - radius
  ) {
    insideWalkableZone = true
  }

  // B. Wing 01: Connector & Chamber (West)
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_01_connector.minX &&
    x <= FORGOTTEN_GAME_ZONES.wing_01_connector.maxX &&
    z >= FORGOTTEN_GAME_ZONES.wing_01_connector.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_01_connector.maxZ - radius
  ) {
    insideWalkableZone = true
  }
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_01_chamber.minX + radius &&
    x <= FORGOTTEN_GAME_ZONES.wing_01_chamber.maxX &&
    z >= FORGOTTEN_GAME_ZONES.wing_01_chamber.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_01_chamber.maxZ - radius
  ) {
    insideWalkableZone = true
  }

  // C. Wing 02: Connector & Chamber (East)
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_02_connector.minX &&
    x <= FORGOTTEN_GAME_ZONES.wing_02_connector.maxX &&
    z >= FORGOTTEN_GAME_ZONES.wing_02_connector.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_02_connector.maxZ - radius
  ) {
    insideWalkableZone = true
  }
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_02_chamber.minX &&
    x <= FORGOTTEN_GAME_ZONES.wing_02_chamber.maxX - radius &&
    z >= FORGOTTEN_GAME_ZONES.wing_02_chamber.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_02_chamber.maxZ - radius
  ) {
    insideWalkableZone = true
  }

  // D. Wing 03: Connector & Chamber (West)
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_03_connector.minX &&
    x <= FORGOTTEN_GAME_ZONES.wing_03_connector.maxX &&
    z >= FORGOTTEN_GAME_ZONES.wing_03_connector.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_03_connector.maxZ - radius
  ) {
    insideWalkableZone = true
  }
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.wing_03_chamber.minX + radius &&
    x <= FORGOTTEN_GAME_ZONES.wing_03_chamber.maxX &&
    z >= FORGOTTEN_GAME_ZONES.wing_03_chamber.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.wing_03_chamber.maxZ - radius
  ) {
    insideWalkableZone = true
  }

  // E. Memory Core Chamber (North)
  if (
    !insideWalkableZone &&
    x >= FORGOTTEN_GAME_ZONES.memory_core_chamber.minX + radius &&
    x <= FORGOTTEN_GAME_ZONES.memory_core_chamber.maxX - radius &&
    z >= FORGOTTEN_GAME_ZONES.memory_core_chamber.minZ + radius &&
    z <= FORGOTTEN_GAME_ZONES.memory_core_chamber.maxZ
  ) {
    insideWalkableZone = true
  }

  // If outside all navigable architectural zones, movement is blocked
  if (!insideWalkableZone) {
    return false
  }

  // 2. Test intersection with any solid obstacle
  for (const obs of FORGOTTEN_GAME_OBSTACLES) {
    if (
      x >= obs.minX - radius &&
      x <= obs.maxX + radius &&
      z >= obs.minZ - radius &&
      z <= obs.maxZ + radius
    ) {
      return false
    }
  }

  return true
}

/**
 * Constrains player position inside the Game 10 facility.
 * Supports smooth sliding along walls, obstacles, and portals.
 */
export function constrainForgottenGamePosition(
  proposed: { x: number; z: number },
  current: { x: number; z: number },
  radius: number = 0.35
): { x: number; z: number } {
  const { x, z } = proposed

  // Test full diagonal proposed movement
  if (isPointWalkable(x, z, radius)) {
    return { x, z }
  }

  // Slide along X axis
  if (isPointWalkable(x, current.z, radius)) {
    return { x, z: current.z }
  }

  // Slide along Z axis
  if (isPointWalkable(current.x, z, radius)) {
    return { x: current.x, z }
  }

  // Completely blocked
  return { x: current.x, z: current.z }
}

// ---------------------------------------------------------------------------
// 3. TheForgottenGameArena Component
// ---------------------------------------------------------------------------

export const TheForgottenGameArena: React.FC = () => {
  return (
    <group name="the-forgotten-game-arena">
      <ForgottenGameLighting />
      <ForgottenGameArchitecture />
    </group>
  )
}
