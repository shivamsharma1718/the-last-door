import type { IdentityOption } from './roomOfNamesTypes'
import { INTERACTION_DISTANCE_THRESHOLD } from './roomOfNamesTypes'

/**
 * Static puzzle identities for Game 02: THE ROOM OF NAMES.
 * Exactly 1 identity is the true player identity (ELIAS).
 */
const IDENTITIES: readonly IdentityOption[] = [
  {
    id: 'adrian',
    name: 'ADRIAN',
    position: [-4.2, 1.0, -3.8],
    objectType: 'photograph',
    isTrueIdentity: false,
    memoryClues: [
      '“You remember sitting beside him in a room with white curtains.”',
      '“He called you by a name you no longer recognize.”',
      '“Something about the memory feels borrowed, as if told to you rather than lived.”',
    ],
  },
  {
    id: 'julian',
    name: 'JULIAN',
    position: [4.2, 1.0, -3.8],
    objectType: 'desk',
    isTrueIdentity: false,
    memoryClues: [
      '“The desk drawer holds letters written in unfamiliar, frantic handwriting.”',
      '“Every letter speaks of a man who fled before the outer door was locked.”',
      '“You remember sealing the envelope, but the signature was never yours.”',
    ],
  },
  {
    id: 'elias',
    name: 'ELIAS',
    position: [0.0, 1.0, -4.8],
    objectType: 'hospital_record',
    isTrueIdentity: true,
    memoryClues: [
      '“Patient intake record: admitted after entering the dark corridor voluntarily.”',
      '“A note in the margin reads: ‘He wanders from room to room, searching for the first door.’”',
      '“Your pulse accelerates. The intake date matches the exact day your silence began.”',
    ],
  },
  {
    id: 'noah',
    name: 'NOAH',
    position: [-4.5, 1.0, 1.8],
    objectType: 'old_tape',
    isTrueIdentity: false,
    memoryClues: [
      '“The magnetic tape hisses with static and rhythmic, distant breathing.”',
      '“A distorted voice whispers: ‘Noah was the architect who built these trials.’”',
      '“You built nothing. You are only the wanderer trapped inside them.”',
    ],
  },
  {
    id: 'thomas',
    name: 'THOMAS',
    position: [4.5, 1.0, 1.8],
    objectType: 'mirror',
    isTrueIdentity: false,
    memoryClues: [
      '“The fractured glass reflects a silhouette staring back in total darkness.”',
      '“When you raise your hand, the glass reflection hesitates.”',
      '“Thomas was the one who looked away first. You are still staring forward.”',
    ],
  },
] as const

/**
 * Returns an array copy of all 5 identity options.
 */
export function getIdentityOptions(): IdentityOption[] {
  return [...IDENTITIES]
}

/**
 * Finds an identity option by its unique ID.
 */
export function getIdentityById(id: string): IdentityOption | undefined {
  return IDENTITIES.find((item) => item.id.toLowerCase() === id.toLowerCase())
}

/**
 * Evaluates the nearest identity pedestal to the player's horizontal (X, Z) coordinates.
 * Returns the closest identity within the specified threshold (default: 2.2m), or null if none.
 */
export function getNearestIdentity(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD
): IdentityOption | null {
  let closestIdentity: IdentityOption | null = null
  let minDistance = threshold

  for (const identity of IDENTITIES) {
    const dx = playerX - identity.position[0]
    const dz = playerZ - identity.position[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance <= minDistance) {
      minDistance = distance
      closestIdentity = identity
    }
  }

  return closestIdentity
}

/**
 * Checks whether the chosen identity ID is the true identity.
 */
export function isCorrectIdentity(id: string): boolean {
  const identity = getIdentityById(id)
  return identity ? identity.isTrueIdentity === true : false
}
