import { EXIT_Z } from './redLightTypes'

export const GREEN_PHASE_DURATION = 4500
export const RED_PHASE_DURATION = 3500
export const MOVEMENT_DETECTION_THRESHOLD = 0.015
export const VICTORY_DISTANCE_THRESHOLD = 1.5

/**
 * Calculates real-time distance from camera position to exit marker (meters)
 */
export function calculateDistanceToExit(cameraZ: number, exitZ: number = EXIT_Z): number {
  const rawDistance = cameraZ - exitZ
  return Math.max(0, Math.round(rawDistance))
}

/**
 * Checks if the player is within victory reach (<= 1.5m to exit)
 */
export function isAtExit(cameraZ: number, exitZ: number = EXIT_Z): boolean {
  return cameraZ - exitZ <= VICTORY_DISTANCE_THRESHOLD
}
