/**
 * Game 10: THE FORGOTTEN GAME - Investigation Objects Registry
 * Theme: Memory Manipulation, Psychological Horror, Distorted History.
 *
 * Defines the canonical interactable objects distributed across the memory facility wings.
 * Provides distance computation and nearest-interactable spatial query.
 */

import type { Game10InteractableObject } from '../game10Types'

// ---------------------------------------------------------------------------
// Canonical Investigation Objects for Step 2.3
// ---------------------------------------------------------------------------

export const GAME10_INTERACTION_OBJECTS: readonly Game10InteractableObject[] = [
  {
    id: 'obj_w01_observation_log',
    name: 'Observation Log Terminal',
    areaId: 'wing_01_first_rule',
    worldPosition: [-16.0, 1.0, 10.0],
    interactionRadius: 2.2,
    isInteractable: true,
    title: 'OBSERVATION LOG TERMINAL // SECTOR 01',
    description:
      'A heavy CRT telemetry terminal anchored into the brutalist masonry. The monitor flickers with telemetry traces from the Red Light chamber. A corrupted log entry reads: "SUBJECT CONVERGENCE ACHIEVED UNDER PROTOCOL 01. ALL PREVIOUS RECORDINGS MARKED FOR ERASURE."',
    hint: 'Investigate telemetry records for Sector 01',
  },
  {
    id: 'obj_w02_admissions_ledger',
    name: 'Admissions Registry Ledger',
    areaId: 'wing_02_forgotten_name',
    worldPosition: [14.0, 1.0, -0.8],
    interactionRadius: 2.2,
    isInteractable: true,
    title: 'CLINICAL ADMISSIONS REGISTRY // SECTOR 02',
    description:
      'A bound cold-rolled steel ledger rested on the clinical reception counter. The identity registry index has been systematically redacted. One entry remains legible: "PATIENT DESIGNATION 02: ADMITTED WITHOUT IDENTITY. CANONICAL RECOLLECTION FORCIBLY OVERWRITTEN."',
    hint: 'Inspect redacted intake records for Sector 02',
  },
  {
    id: 'obj_w03_optical_relay',
    name: 'Decoupled Optical Relay',
    areaId: 'wing_03_command_verdict',
    worldPosition: [-16.0, 1.0, 0.0],
    interactionRadius: 2.2,
    isInteractable: true,
    title: 'OPTICAL TRUNK RELAY CONSOLE // SECTOR 03',
    description:
      'An industrial optic bus junction box with severed fiber filaments humming faintly. A diagnostic tape feed prints continuously: "CORE COMMAND VERDICT OVERRIDE IN EFFECT. ARCHIVE PURGE COMPLETED AT CONTROL ROOM CONVERGENCE."',
    hint: 'Verify optical command signals for Sector 03',
  },
] as const

// ---------------------------------------------------------------------------
// Spatial Proximity Helper
// ---------------------------------------------------------------------------

export interface ProximityQueryResult {
  nearest: Game10InteractableObject | null
  distance: number
}

/**
 * Finds the nearest interactable object within its interaction radius from the player position.
 * Uses 2D horizontal distance (X, Z).
 */
export function findNearestInteractable(
  playerPos: { x: number; z: number },
  objects: readonly Game10InteractableObject[] = GAME10_INTERACTION_OBJECTS
): ProximityQueryResult {
  let nearest: Game10InteractableObject | null = null
  let minDistance = Infinity

  for (const obj of objects) {
    if (!obj.isInteractable) continue

    const dx = playerPos.x - obj.worldPosition[0]
    const dz = playerPos.z - obj.worldPosition[2]
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist <= obj.interactionRadius && dist < minDistance) {
      minDistance = dist
      nearest = obj
    }
  }

  return {
    nearest,
    distance: minDistance === Infinity ? Infinity : minDistance,
  }
}
