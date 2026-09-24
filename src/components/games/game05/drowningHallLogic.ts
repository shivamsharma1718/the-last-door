import type {
  DrowningHallObject,
  DrowningHallObjectType,
  ValveModel,
  ValveId,
} from './drowningHallTypes'
import {
  INTERACTION_DISTANCE_THRESHOLD_G05,
  EXIT_POSITION,
  EXIT_Z,
  INITIAL_WATER_LEVEL,
  WATER_WARNING_THRESHOLD,
  WATER_CRITICAL_THRESHOLD,
  MAX_WATER_LEVEL,
  WATER_RISE_RATE,
} from './drowningHallTypes'

/**
 * 4 Investigation objects located in the abandoned water-control facility.
 * Centralized environmental lore & puzzle clues teaching the player the valve drainage sequence.
 */
const DROWNING_HALL_OBJECTS: readonly DrowningHallObject[] = [
  {
    id: 'pressure_gauge',
    type: 'pressure_gauge',
    title: 'PRESSURE GAUGE',
    position: [-4.5, 1.2, 4.0],
    clues: [
      'The pressure has been rising for hours.',
      'The main drain is still closed.',
    ],
  },
  {
    id: 'maintenance_log',
    type: 'maintenance_log',
    title: 'MAINTENANCE LOG',
    position: [4.5, 1.2, 2.5],
    clues: [
      'Drainage valves must be opened in sequence.',
      'Valve three cannot be opened while pressure remains unstable.',
    ],
  },
  {
    id: 'control_panel',
    type: 'control_panel',
    title: 'CONTROL PANEL',
    position: [-4.5, 1.2, -1.5],
    clues: [
      'EMERGENCY DRAINAGE SYSTEM.',
      'Manual override requires the correct valve sequence.',
    ],
  },
  {
    id: 'flood_marker',
    type: 'flood_marker',
    title: 'FLOOD MARKER',
    position: [4.5, 1.2, -3.5],
    clues: [
      'The previous flood reached this height.',
      'The system was never repaired.',
    ],
  },
] as const

/**
 * 3 Physical Industrial Valves located throughout the hall.
 */
const VALVES: readonly ValveModel[] = [
  {
    id: 'valve_1',
    label: 'VALVE 1',
    position: [-4.8, 1.1, 1.0],
  },
  {
    id: 'valve_2',
    label: 'VALVE 2',
    position: [4.8, 1.1, -0.5],
  },
  {
    id: 'valve_3',
    label: 'VALVE 3',
    position: [-4.8, 1.1, -4.5],
  },
] as const

/**
 * Deterministic drainage valve sequence:
 * VALVE 1 -> VALVE 3 -> VALVE 2
 */
export const DRAINAGE_SEQUENCE: readonly ValveId[] = [
  'valve_1',
  'valve_3',
  'valve_2',
] as const

// ---------------------------------------------------------------------------
// Investigation Object Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a list of all environmental investigation objects in Game 05.
 */
export function getDrowningHallObjects(): DrowningHallObject[] {
  return [...DROWNING_HALL_OBJECTS]
}

/**
 * Finds an investigation object by ID.
 */
export function getDrowningHallObjectById(
  id: string
): DrowningHallObject | undefined {
  return DROWNING_HALL_OBJECTS.find(
    (obj) => obj.id.toLowerCase() === id.toLowerCase()
  )
}

/**
 * Returns the object type for a given object ID.
 */
export function getDrowningHallObjectType(
  id: string
): DrowningHallObjectType | undefined {
  const obj = getDrowningHallObjectById(id)
  return obj ? (obj.type as DrowningHallObjectType) : undefined
}

/**
 * Finds the closest investigation object to horizontal coordinates within threshold.
 */
export function getNearestDrowningHallObject(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G05
): DrowningHallObject | null {
  let closestObj: DrowningHallObject | null = null
  let minDistance = threshold

  for (const obj of DROWNING_HALL_OBJECTS) {
    const dx = playerX - obj.position[0]
    const dz = playerZ - obj.position[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance <= minDistance) {
      minDistance = distance
      closestObj = obj
    }
  }

  return closestObj
}

// ---------------------------------------------------------------------------
// Valve & Drainage Sequence Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a list of all valve entities in Game 05.
 */
export function getValves(): ValveModel[] {
  return [...VALVES]
}

/**
 * Finds a valve entity by ID.
 */
export function getValveById(id: string): ValveModel | undefined {
  return VALVES.find((v) => v.id.toLowerCase() === id.toLowerCase())
}

/**
 * Finds the closest valve entity to horizontal coordinates within threshold.
 */
export function getNearestValve(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G05
): ValveModel | null {
  let closestValve: ValveModel | null = null
  let minDistance = threshold

  for (const valve of VALVES) {
    const dx = playerX - valve.position[0]
    const dz = playerZ - valve.position[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance <= minDistance) {
      minDistance = distance
      closestValve = valve
    }
  }

  return closestValve
}

/**
 * Returns the next expected valve in the drainage sequence given current activated list.
 * Returns null if the full sequence is already complete.
 */
export function getNextExpectedValve(
  currentSequence: readonly ValveId[]
): ValveId | null {
  if (currentSequence.length >= DRAINAGE_SEQUENCE.length) {
    return null
  }
  return DRAINAGE_SEQUENCE[currentSequence.length]
}

/**
 * Checks if activating a given valve matches the expected next step in the sequence.
 */
export function isCorrectValveActivation(
  valveId: ValveId,
  currentSequence: readonly ValveId[]
): boolean {
  const expected = getNextExpectedValve(currentSequence)
  return expected === valveId
}

/**
 * Checks if the full deterministic drainage valve sequence (1 -> 3 -> 2) has been completed.
 */
export function isDrainageSequenceComplete(
  currentSequence: readonly ValveId[]
): boolean {
  if (currentSequence.length !== DRAINAGE_SEQUENCE.length) {
    return false
  }
  return DRAINAGE_SEQUENCE.every((id, idx) => currentSequence[idx] === id)
}

/**
 * Returns an empty valve sequence to reset the drainage puzzle.
 */
export function resetValveSequence(): ValveId[] {
  return []
}

// ---------------------------------------------------------------------------
// Water System Helpers
// ---------------------------------------------------------------------------

/**
 * Clamps water level between INITIAL_WATER_LEVEL (0) and MAX_WATER_LEVEL (100).
 */
export function clampWaterLevel(level: number): number {
  return Math.max(INITIAL_WATER_LEVEL, Math.min(MAX_WATER_LEVEL, level))
}

/**
 * Returns current clamped water level.
 */
export function getWaterLevel(level: number): number {
  return clampWaterLevel(level)
}

/**
 * Checks if water level is in the warning range [50, 90).
 */
export function isWaterWarning(level: number): boolean {
  const clamped = clampWaterLevel(level)
  return (
    clamped >= WATER_WARNING_THRESHOLD && clamped < WATER_CRITICAL_THRESHOLD
  )
}

/**
 * Checks if water level has reached or exceeded critical threshold (>= 90).
 */
export function isWaterCritical(level: number): boolean {
  return clampWaterLevel(level) >= WATER_CRITICAL_THRESHOLD
}

/**
 * Increases water level by a specified amount (default: WATER_RISE_RATE), clamped to 100.
 */
export function increaseWaterLevel(
  currentLevel: number,
  amount: number = WATER_RISE_RATE
): number {
  return clampWaterLevel(currentLevel + amount)
}

// ---------------------------------------------------------------------------
// Exit & Completion Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the room exit coordinates.
 */
export function getExitPosition(): [number, number, number] {
  return [...EXIT_POSITION]
}

/**
 * Checks if a player's Z coordinate is at or beyond the room exit threshold.
 */
export function isAtExit(playerZ: number, threshold: number = 1.0): boolean {
  return playerZ <= EXIT_Z + threshold
}

/**
 * Checks if the exit blast door is unlocked (requires drainage sequence complete).
 */
export function isExitUnlocked(currentSequence: readonly ValveId[]): boolean {
  return isDrainageSequenceComplete(currentSequence)
}

/**
 * Pure evaluation for Game 05 completion:
 * 1. Drainage sequence complete.
 * 2. Exit unlocked.
 * 3. Player at the exit door.
 */
export function canCompleteDrowningHall(
  playerZ: number,
  currentSequence: readonly ValveId[],
  exitThreshold: number = 2.0
): boolean {
  return (
    isDrainageSequenceComplete(currentSequence) &&
    isExitUnlocked(currentSequence) &&
    isAtExit(playerZ, exitThreshold)
  )
}

/**
 * Pure evaluation for Game 05 failure:
 * Water reaches critical threshold (>= 100) and the drainage sequence is NOT complete.
 */
export function shouldFailDrowningHall(
  waterLevel: number,
  currentSequence: readonly ValveId[]
): boolean {
  return (
    clampWaterLevel(waterLevel) >= MAX_WATER_LEVEL &&
    !isDrainageSequenceComplete(currentSequence)
  )
}
