import type {
  WatcherInvestigationObject,
  WatcherObjectType,
  WatcherModel,
} from './theWatcherTypes'
import {
  INTERACTION_DISTANCE_THRESHOLD_G04,
  WATCHER_POSITION,
  EXIT_POSITION,
  EXIT_Z,
} from './theWatcherTypes'

/**
 * Default Watcher entity model definition.
 * Framework-independent pure data representation.
 */
const WATCHER_ENTITY: WatcherModel = {
  id: 'the_watcher_prime',
  label: 'THE WATCHER',
  position: WATCHER_POSITION,
  detectionRange: 8.5,
  alertState: false,
}

/**
 * 4 Investigation objects located in the chamber.
 * Thematic clues teaching the player how to survive the Watcher's presence.
 */
const WATCHER_OBJECTS: readonly WatcherInvestigationObject[] = [
  {
    id: 'torn_photograph',
    type: 'torn_photograph',
    title: 'TORN PHOTOGRAPH',
    position: [-5.0, 0.9, 2.0],
    clues: [
      '“The subject was never photographed directly.”',
      '“The photographer always stood behind glass.”',
    ],
  },
  {
    id: 'warning_note',
    type: 'warning_note',
    title: 'WARNING NOTE',
    position: [5.0, 0.9, 1.0],
    clues: [
      '“Do not look toward the observation window when the light turns white.”',
      '“If you see it looking at you, close your eyes.”',
    ],
  },
  {
    id: 'security_monitor',
    type: 'security_monitor',
    title: 'SECURITY MONITOR',
    position: [-4.5, 0.9, -3.0],
    clues: [
      '“The camera feed shows an empty room.”',
      '“The timestamp says the recording was made three minutes from now.”',
    ],
  },
  {
    id: 'observation_window',
    type: 'observation_window',
    title: 'OBSERVATION WINDOW',
    position: [4.5, 0.9, -3.0],
    clues: [
      '“The glass reflects the room.”',
      '“It does not reflect the person watching it.”',
    ],
  },
] as const

/**
 * Returns a list of all investigation objects in Game 04.
 */
export function getWatcherObjects(): WatcherInvestigationObject[] {
  return [...WATCHER_OBJECTS]
}

/**
 * Finds an investigation object by ID.
 */
export function getWatcherObjectById(id: string): WatcherInvestigationObject | undefined {
  return WATCHER_OBJECTS.find((obj) => obj.id.toLowerCase() === id.toLowerCase())
}

/**
 * Returns the object type for a given object ID.
 */
export function getWatcherObjectType(id: string): WatcherObjectType | undefined {
  const obj = getWatcherObjectById(id)
  return obj ? (obj.type as WatcherObjectType) : undefined
}

/**
 * Finds the closest investigation object to horizontal coordinates (playerX, playerZ) within threshold.
 */
export function getNearestWatcherObject(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G04
): WatcherInvestigationObject | null {
  let closestObj: WatcherInvestigationObject | null = null
  let minDistance = threshold

  for (const obj of WATCHER_OBJECTS) {
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

/**
 * Returns the Watcher entity data model.
 */
export function getWatcher(): WatcherModel {
  return { ...WATCHER_ENTITY }
}

/**
 * Returns the room exit position coordinates.
 */
export function getExitPosition(): [number, number, number] {
  return [...EXIT_POSITION]
}

/**
 * Checks if a player's Z coordinate is at or beyond the room exit boundary.
 */
export function isAtExit(playerZ: number, threshold: number = 1.0): boolean {
  return playerZ <= EXIT_Z + threshold
}

/**
 * Pure vector/geometry calculation to determine if the player's view vector
 * is aligned towards the Watcher's position within a cosine angle threshold.
 *
 * @param playerPosition - [x, y, z] player location
 * @param playerLookDirection - [dx, dy, dz] forward view direction vector
 * @param watcherPosition - [wx, wy, wz] Watcher entity location
 * @param angleThresholdCos - Minimum cosine of angle for detection (default 0.707 ~ 45deg cone)
 */
export function isLookingAtWatcher(
  playerPosition: [number, number, number],
  playerLookDirection: [number, number, number],
  watcherPosition: [number, number, number] = WATCHER_POSITION,
  angleThresholdCos: number = 0.88
): boolean {
  const toWx = watcherPosition[0] - playerPosition[0]
  const toWy = watcherPosition[1] - playerPosition[1]
  const toWz = watcherPosition[2] - playerPosition[2]

  const dist = Math.sqrt(toWx * toWx + toWy * toWy + toWz * toWz)
  if (dist < 0.0001) return false

  const dirX = toWx / dist
  const dirY = toWy / dist
  const dirZ = toWz / dist

  const lookLen = Math.sqrt(
    playerLookDirection[0] * playerLookDirection[0] +
    playerLookDirection[1] * playerLookDirection[1] +
    playerLookDirection[2] * playerLookDirection[2]
  )
  if (lookLen < 0.0001) return false

  const normLookX = playerLookDirection[0] / lookLen
  const normLookY = playerLookDirection[1] / lookLen
  const normLookZ = playerLookDirection[2] / lookLen

  const dot = normLookX * dirX + normLookY * dirY + normLookZ * dirZ
  return dot >= angleThresholdCos
}
