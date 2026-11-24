/**
 * Game 09: THE CONTROL ROOM - Complete 3D Environment Arena
 * 26.0m x 4.2m x 24.0m Cold War Brutalist Command Facility.
 *
 * Implements:
 * 1. Area 1: Entry Checkpoint (South, Z = 10.0)
 * 2. Area 2: Central Command Dais (Center, [0, 1.1, 2.0])
 * 3. Area 3: Surveillance Bank (West, [-8.5, 2.1, 2.0])
 * 4. Area 4: Telemetry & Communications Bank (East, [8.5, 2.1, 2.0])
 * 5. Area 5: Power Grid Cabinet (Northeast, [7.5, 2.1, -6.5])
 * 6. Area 6: Logic Vault (Northwest, [-7.5, 2.1, -6.5])
 * 7. Area 7: System Core (Center North, [0, 1.1, -8.5])
 * 8. Area 8: Exit Bulkhead (Far North, [0, 1.9, -12.0])
 * 9. All 8 physical evidence props placed at exact canonical coordinates.
 * 10. Robust spatial collision constraint function.
 */

import React from 'react'
import { ControlRoomLighting } from './ControlRoomLighting'
import { ControlRoomArchitecture } from './ControlRoomArchitecture'
import { ControlRoomPropsEnvironment } from './ControlRoomProps'
import { controlRoomStore } from './theControlRoomStore'

// ---------------------------------------------------------------------------
// Spatial Collision & Movement Constraints
// ---------------------------------------------------------------------------

interface AABB {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

// Outer room walkable boundary (Room is 26m x 24m)
const ROOM_BOUNDS: AABB = {
  minX: -12.6,
  maxX: 12.6,
  minZ: -12.0,
  maxZ: 11.4,
}

// Solid physical obstacle bounding boxes
const CONTROL_ROOM_OBSTACLES: AABB[] = [
  // Four structural concrete columns (0.8m x 0.8m)
  { minX: -5.0, maxX: -4.0, minZ: 4.0, maxZ: 5.0 },   // SW Column
  { minX: 4.0, maxX: 5.0, minZ: 4.0, maxZ: 5.0 },     // SE Column
  { minX: -5.0, maxX: -4.0, minZ: -5.0, maxZ: -4.0 }, // NW Column
  { minX: 4.0, maxX: 5.0, minZ: -5.0, maxZ: -4.0 },   // NE Column

  // Area 1: Entry Checkpoint Desk & South Partitions
  { minX: 1.0, maxX: 3.0, minZ: 9.0, maxZ: 10.2 },    // Security Desk
  { minX: -13.0, maxX: -2.3, minZ: 7.2, maxZ: 7.7 },  // West Entry Partition Wall
  { minX: 2.3, maxX: 13.0, minZ: 7.2, maxZ: 7.7 },   // East Entry Partition Wall

  // Area 2: Central Command Console Desk (at center [0, 2.0])
  { minX: -1.9, maxX: 1.9, minZ: 1.4, maxZ: 2.7 },

  // Area 3: Surveillance Bank (West Wall multi-tier racks & desk)
  { minX: -13.0, maxX: -9.8, minZ: -1.2, maxZ: 5.2 },

  // Area 4: Telemetry & Communications Bank (East Wall racks & desk)
  { minX: 9.8, maxX: 13.0, minZ: -1.2, maxZ: 5.2 },

  // Area 5: Power Grid Transformers & Coolant Cabinet (Northeast)
  { minX: 8.5, maxX: 13.0, minZ: -9.4, maxZ: -3.8 },

  // Area 6: Logic Vault Tape Mainframe Cabinets (Northwest)
  { minX: -13.0, maxX: -8.5, minZ: -9.4, maxZ: -3.8 },
  // Area 6: Archive Drawers & Plotter Table
  { minX: -7.5, maxX: -6.0, minZ: -6.4, maxZ: -5.2 },

  // Area 7: Overseer System Core Pillar & Racks
  { minX: -1.3, maxX: 1.3, minZ: -9.8, maxZ: -7.5 },  // Central Core Cylinder & Pedestal
  { minX: -3.4, maxX: -2.2, minZ: -9.5, maxZ: -7.5 }, // Left Core Server Rack
  { minX: 2.2, maxX: 3.4, minZ: -9.5, maxZ: -7.5 },  // Right Core Server Rack
  { minX: -0.8, maxX: 0.8, minZ: -7.7, maxZ: -6.8 },  // Master Pedestal Console

  // Area 8: Exit Bulkhead (Hydraulic Blast Doors at Z = -11.8)
  { minX: -4.0, maxX: 4.0, minZ: -12.5, maxZ: -11.6 },
]

function isPointWalkable(x: number, z: number, radius: number): boolean {
  const isBulkheadOpen = controlRoomStore.getSnapshot().isExitBulkheadOpen

  // Check if player is entering or inside the Northern Exit Tunnel
  if (isBulkheadOpen && z < -11.6) {
    // Tunnel side walls at X = -1.8 and X = 1.8, tunnel end at Z = -15.5
    if (x < -1.8 + radius || x > 1.8 - radius || z < -15.5 + radius) {
      return false
    }
    return true
  }

  // 1. Must be strictly within outer room boundaries
  if (
    x < ROOM_BOUNDS.minX + radius ||
    x > ROOM_BOUNDS.maxX - radius ||
    z < ROOM_BOUNDS.minZ + radius ||
    z > ROOM_BOUNDS.maxZ - radius
  ) {
    return false
  }

  // 2. Must not penetrate any solid obstacles
  for (const obs of CONTROL_ROOM_OBSTACLES) {
    // If bulkhead is open, ignore the closed blast door obstacle in the center passage
    if (isBulkheadOpen && obs.minZ <= -11.6 && Math.abs(x) < 1.8) {
      continue
    }

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
 * Constrains player position inside the 26m x 24m Control Room facility.
 * Supports smooth sliding along walls, consoles, and pillars.
 */
export function constrainControlRoomPosition(
  proposed: { x: number; z: number },
  current: { x: number; z: number },
  radius: number = 0.35
): { x: number; z: number } {
  const { x, z } = proposed

  // Test full diagonal movement
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

  // Block movement if all directions collide
  return { x: current.x, z: current.z }
}

// ---------------------------------------------------------------------------
// TheControlRoomArena Component
// ---------------------------------------------------------------------------

export const TheControlRoomArena: React.FC = () => {
  return (
    <group name="the-control-room-arena">
      <ControlRoomLighting />
      <ControlRoomArchitecture />
      <ControlRoomPropsEnvironment />
    </group>
  )
}
