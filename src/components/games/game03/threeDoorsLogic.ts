import type {
  DoorOption,
  InvestigationObject,
  CentralInscription,
} from './threeDoorsTypes'
import { INTERACTION_DISTANCE_THRESHOLD_G03 } from './threeDoorsTypes'

/**
 * Internal solution identifier for Game 03: THREE DOORS.
 * Sourced purely for game logic checks and never exposed directly in UI text.
 */
export const CORRECT_DOOR_ID: string = 'quiet'

/**
 * The three doors of the chamber.
 */
const DOORS: readonly DoorOption[] = [
  {
    id: 'safe',
    doorNumber: 'DOOR I',
    name: 'THE SAFE DOOR',
    statement: '“I have never killed anyone.”',
    position: [-4.0, 0, -5.5],
    isCorrect: false,
  },
  {
    id: 'honest',
    doorNumber: 'DOOR II',
    name: 'THE HONEST DOOR',
    statement: '“I will tell you the truth.”',
    position: [0.0, 0, -5.5],
    isCorrect: false,
  },
  {
    id: 'quiet',
    doorNumber: 'DOOR III',
    name: 'THE QUIET DOOR',
    statement: '“I have nothing to say.”',
    position: [4.0, 0, -5.5],
    isCorrect: true,
  },
] as const

/**
 * Investigation objects scattered in the chamber holding psychological clues.
 * Includes the 3 stand items and the rear hidden central inscription.
 */
const INVESTIGATION_OBJECTS: readonly InvestigationObject[] = [
  {
    id: 'broken_key',
    name: 'BROKEN KEY',
    objectType: 'key',
    position: [-4.2, 0.9, 0.5],
    clues: [
      '“A key was made for the safe door.”',
      '“It was never used.”',
    ],
  },
  {
    id: 'prisoner_note',
    name: "PRISONER'S NOTE",
    objectType: 'note',
    position: [0.0, 0.9, 1.8],
    clues: [
      '“I asked the honest door one question.”',
      '“It answered exactly what I wanted to hear.”',
      '“That was when I understood the danger.”',
    ],
  },
  {
    id: 'black_mirror',
    name: 'BLACK MIRROR',
    objectType: 'mirror',
    position: [4.2, 0.9, 0.5],
    clues: [
      '“You keep looking at the doors.”',
      '“Look at what they don’t say.”',
    ],
  },
  {
    id: 'hidden_inscription',
    name: 'HIDDEN INSCRIPTION',
    objectType: 'inscription',
    position: [0.0, 0.9, -1.8],
    clues: [
      '“The truth does not need to convince you.”',
    ],
  },
] as const

/**
 * Central chamber hidden floor inscription.
 */
export const CENTRAL_INSCRIPTION: CentralInscription = {
  text: '“The truth does not need to convince you.”',
  position: [0.0, 0.05, -1.5],
}

/**
 * Returns an array of all three door definitions.
 */
export function getDoors(): DoorOption[] {
  return [...DOORS]
}

/**
 * Returns a specific door option by its ID.
 */
export function getDoorById(id: string): DoorOption | undefined {
  return DOORS.find((door) => door.id.toLowerCase() === id.toLowerCase())
}

/**
 * Returns an array of all investigation objects (including hidden inscription).
 */
export function getInvestigationObjects(): InvestigationObject[] {
  return [...INVESTIGATION_OBJECTS]
}

/**
 * Returns an investigation object by its ID.
 */
export function getInvestigationObjectById(id: string): InvestigationObject | undefined {
  return INVESTIGATION_OBJECTS.find((obj) => obj.id.toLowerCase() === id.toLowerCase())
}

/**
 * Returns the central chamber inscription.
 */
export function getCentralInscription(): CentralInscription {
  return { ...CENTRAL_INSCRIPTION }
}

/**
 * Evaluates whether a chosen door ID is the correct solution.
 */
export function isCorrectDoor(doorId: string): boolean {
  const door = getDoorById(doorId)
  return door ? door.isCorrect === true : false
}

/**
 * Finds the closest door to horizontal coordinates (playerX, playerZ) within threshold.
 */
export function getNearestDoor(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G03
): DoorOption | null {
  let closestDoor: DoorOption | null = null
  let minDistance = threshold

  for (const door of DOORS) {
    const dx = playerX - door.position[0]
    const dz = playerZ - door.position[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance <= minDistance) {
      minDistance = distance
      closestDoor = door
    }
  }

  return closestDoor
}

/**
 * Finds the closest investigation object to horizontal coordinates (playerX, playerZ) within threshold.
 */
export function getNearestInvestigationObject(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G03
): InvestigationObject | null {
  let closestObj: InvestigationObject | null = null
  let minDistance = threshold

  for (const obj of INVESTIGATION_OBJECTS) {
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
