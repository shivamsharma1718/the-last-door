/**
 * Game 07: THE MIRROR TRIAL - Pure Game Logic & Rules Engine
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 */

import type {
  Game07Status,
  MirrorId,
  MirrorDefinition,
  MirrorArtifact,
  MirrorTrialState,
  Vector3Tuple,
} from './mirrorTrialTypes'
import {
  ALTAR_WORLD_POS,
  INITIAL_MIRROR_POS,
  INITIAL_MIRROR_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G07,
  ALTAR_DISTANCE_THRESHOLD_G07,
  REQUIRED_MIRRORS_COUNT,
  TOTAL_DISCREPANCIES_COUNT,
  TRUE_MIRROR_ID,
} from './mirrorTrialTypes'

// ---------------------------------------------------------------------------
// Canonical Mirror Definitions
// ---------------------------------------------------------------------------

export const MIRROR_DEFINITIONS: MirrorDefinition[] = [
  {
    id: 'mirror_north',
    latinTitle: 'Speculum Veritatis',
    englishTitle: 'The Mirror of Truth',
    direction: 'north',
    mirrorType: 'truth',
    isDeceptive: false,
    mirrorPosition: [0, 1.8, -5.8],
    mirrorRotation: [0, 0, 0],
    mirrorDimensions: [2.2, 3.2],
    artifact: {
      id: 'artifact_pocket_watch',
      name: 'The Silver Pocket Watch',
      position: [0, 0.9, -4.8],
      realDescription:
        'An antique pocket watch encased in ornate silver. The sweep second hand ticks forward with quiet, relentless precision at 11:58.',
      reflectedDescription:
        'The reflection shows the exact same silver pocket watch, ticking forward in immaculate synchrony at 11:58. No lag, no distortion.',
      hasDiscrepancy: false,
      discrepancyType: 'none',
    },
    clues: [
      {
        id: 'clue_watch_synchrony',
        title: 'Temporal Synchrony',
        text: 'The second hand in the glass ticks precisely with reality. The glass does not distort the passage of seconds.',
        revealed: false,
      },
      {
        id: 'clue_watch_truth',
        title: 'Undivided Reflection',
        text: 'Every microscopic scratch and silver reflection matches physical space flawlessly.',
        revealed: false,
      },
    ],
    inscription:
      'That which remains faithful to the unbroken second speaks without deceit.',
    reflectionDescription:
      'The glass is calm, silvery, and sharp. The room in the mirror matches the chamber with mathematical precision.',
    realityDescription:
      'An antique silver watch resting on a black obsidian plinth, quietly counting down.',
    deceptionAnalysis:
      'Speculum Veritatis is the sole truthful mirror. It presents reality without distortion or deceit.',
  },
  {
    id: 'mirror_east',
    latinTitle: 'Speculum Ignis',
    englishTitle: 'The Mirror of Phantom Fire',
    direction: 'east',
    mirrorType: 'phantom_flame',
    isDeceptive: true,
    mirrorPosition: [5.8, 1.8, 0],
    mirrorRotation: [0, -Math.PI / 2, 0],
    mirrorDimensions: [2.2, 3.2],
    artifact: {
      id: 'artifact_candelabra',
      name: 'The Wrought-Iron Candelabra',
      position: [4.8, 0.9, 0],
      realDescription:
        'A heavy three-branched wrought-iron candelabra. The wicks are burnt down, cold to the touch, and dead.',
      reflectedDescription:
        'Deep within the reflection, three vivid violet flames burn brightly upon the wicks, casting shifting spectral shadows.',
      hasDiscrepancy: true,
      discrepancyType: 'phantom_flame',
    },
    clues: [
      {
        id: 'clue_fire_discrepancy',
        title: 'Cold Fire',
        text: 'The physical candelabra is cold and unlit, but the mirror burns with spectral violet flames.',
        revealed: false,
      },
      {
        id: 'clue_fire_deception',
        title: 'Phantom Light',
        text: 'The shadows cast inside the reflection do not match the darkness of the physical chamber.',
        revealed: false,
      },
    ],
    inscription:
      'Beware the light born without heat or tallow. Phantom fire betrays a wandering mind.',
    reflectionDescription:
      'Eerie violet flames flicker silently behind the glass, illuminating a phantom version of the hall.',
    realityDescription:
      'A cold, unlit iron candelabra with charred wicks standing silent on the plinth.',
    deceptionAnalysis:
      'Speculum Ignis generates illusions of light and fire where only darkness resides in reality.',
  },
  {
    id: 'mirror_west',
    latinTitle: 'Speculum Temporis',
    englishTitle: 'The Mirror of Inverted Time',
    direction: 'west',
    mirrorType: 'inverted_time',
    isDeceptive: true,
    mirrorPosition: [-5.8, 1.8, 0],
    mirrorRotation: [0, Math.PI / 2, 0],
    mirrorDimensions: [2.2, 3.2],
    artifact: {
      id: 'artifact_hourglass',
      name: 'The Gilded Hourglass',
      position: [-4.8, 0.9, 0],
      realDescription:
        'A gilded hourglass standing upright. Fine crimson sand steadily falls from the upper bulb into the lower chamber.',
      reflectedDescription:
        'In the mirror reflection, crimson grains of sand defy gravity, streaming upward from the bottom bulb into the top.',
      hasDiscrepancy: true,
      discrepancyType: 'inverted_time',
    },
    clues: [
      {
        id: 'clue_hourglass_discrepancy',
        title: 'Inverted Gravity',
        text: 'While real sand falls toward the earth, the reflected sand streams upward into the past.',
        revealed: false,
      },
      {
        id: 'clue_hourglass_entropy',
        title: 'False Chronology',
        text: 'The glass reverses cause and effect, projecting a false timeline into your vision.',
        revealed: false,
      },
    ],
    inscription:
      'Time flows like water down a slope; when the glass shows the river running to the clouds, trust not what you see.',
    reflectionDescription:
      'The glass ripples with faint chronological distortion as sand particles rise toward the upper bulb.',
    realityDescription:
      'A heavy brass hourglass steadily emptying downward with each passing heartbeat.',
    deceptionAnalysis:
      'Speculum Temporis distorts the flow of time and reverses natural causality.',
  },
  {
    id: 'mirror_south',
    latinTitle: 'Speculum Ianuae',
    englishTitle: 'The Mirror of the False Door',
    direction: 'south',
    mirrorType: 'false_door',
    isDeceptive: true,
    mirrorPosition: [0, 1.8, 5.8],
    mirrorRotation: [0, Math.PI, 0],
    mirrorDimensions: [2.2, 3.2],
    artifact: {
      id: 'artifact_sealed_portal',
      name: 'The Sealed Granite Arch',
      position: [0, 0.9, 4.8],
      realDescription:
        'A monolithic slab of solid granite reinforced with rusted iron cross-braces, sealing the southern wall.',
      reflectedDescription:
        'In the mirror glass, the slab is gone. An open archway shines with warm amber light and a clear staircase leading out.',
      hasDiscrepancy: true,
      discrepancyType: 'false_door',
    },
    clues: [
      {
        id: 'clue_portal_discrepancy',
        title: 'Lethal Mirage',
        text: 'The physical chamber is dead stone, but the reflection promises an effortless escape.',
        revealed: false,
      },
      {
        id: 'clue_portal_deception',
        title: 'The False Threshold',
        text: 'Walking toward the reflected open door would mean walking into solid granite.',
        revealed: false,
      },
    ],
    inscription:
      'The easiest path is carved by lies. When stone appears as an open portal, it invites your demise.',
    reflectionDescription:
      'A golden archway shines alluringly within the glass, whispering an illusion of freedom.',
    realityDescription:
      'Cold, unyielding granite blocks the southern wall without any seam or passage.',
    deceptionAnalysis:
      'Speculum Ianuae fabricates an illusory escape to lure the desperate into destruction.',
  },
]

// ---------------------------------------------------------------------------
// Transition Rules
// ---------------------------------------------------------------------------

const VALID_STATE_TRANSITIONS: Record<Game07Status, Game07Status[]> = {
  intro: ['exploring'],
  exploring: ['examining', 'altar_ready', 'failing', 'failed'],
  examining: ['exploring', 'altar_ready', 'failing', 'failed'],
  altar_ready: ['resolving', 'exploring', 'examining', 'failing', 'failed'],
  resolving: ['victory_cinematic', 'failing', 'failed'],
  victory_cinematic: ['victory'],
  victory: ['next_trial'],
  failing: ['failed', 'exploring'],
  failed: ['intro', 'exploring'],
  next_trial: [],
}

// ---------------------------------------------------------------------------
// Pure State Factory Functions
// ---------------------------------------------------------------------------

/**
 * Creates the initial state for Game 07: The Mirror Trial.
 */
export function createInitialMirrorTrialState(): MirrorTrialState {
  return {
    status: 'intro',
    investigation: {
      activeMirrorId: null,
      investigatedMirrorIds: [],
      discoveredDiscrepancies: [],
      isExamining: false,
      altarUnlocked: false,
      selectedMirrorChoice: null,
      trialResolved: false,
      isCorrectChoice: false,
    },
    timeElapsed: 0,
    sanity: 100,
    whisperCount: 0,
    hallucinationLevel: 0.0,
    altarActivated: false,
  }
}

/**
 * Resets state back to clean initial conditions.
 */
export function createResetState(): MirrorTrialState {
  return createInitialMirrorTrialState()
}

// ---------------------------------------------------------------------------
// Mirror Queries & Introspection
// ---------------------------------------------------------------------------

/**
 * Returns all mirror definitions.
 */
export function getMirrorDefinitions(): MirrorDefinition[] {
  return MIRROR_DEFINITIONS
}

/**
 * Finds a mirror definition by its MirrorId.
 */
export function getMirrorById(id: string): MirrorDefinition | undefined {
  return MIRROR_DEFINITIONS.find((mirror) => mirror.id === id)
}

/**
 * Type guard validating if a string is a valid MirrorId.
 */
export function isValidMirrorId(id: string): id is MirrorId {
  return (
    id === 'mirror_north' ||
    id === 'mirror_east' ||
    id === 'mirror_west' ||
    id === 'mirror_south'
  )
}

/**
 * Checks if a given mirror ID represents the one true, uncorrupted mirror.
 */
export function isTrueMirror(id: string): boolean {
  return id === TRUE_MIRROR_ID
}

/**
 * Returns discrepancy details for a given mirror ID.
 */
export function getMirrorDiscrepancy(mirrorId: MirrorId): {
  hasDiscrepancy: boolean
  type: string
  description: string
} | null {
  const def = getMirrorById(mirrorId)
  if (!def) return null
  return {
    hasDiscrepancy: def.artifact.hasDiscrepancy,
    type: def.artifact.discrepancyType,
    description: def.deceptionAnalysis,
  }
}

// ---------------------------------------------------------------------------
// Spatial & Proximity Calculations
// ---------------------------------------------------------------------------

/**
 * Computes 2D Euclidean distance on the X/Z horizontal plane.
 */
export function calculateHorizontalDistance(
  x1: number,
  z1: number,
  x2: number,
  z2: number
): number {
  return Math.hypot(x2 - x1, z2 - z1)
}

/**
 * Finds the nearest mirror to a given horizontal coordinate within threshold.
 */
export function getNearestMirror(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G07
): MirrorDefinition | null {
  let nearest: MirrorDefinition | null = null
  let minDistance = threshold

  for (const mirror of MIRROR_DEFINITIONS) {
    const dist = calculateHorizontalDistance(
      playerX,
      playerZ,
      mirror.mirrorPosition[0],
      mirror.mirrorPosition[2]
    )
    if (dist <= minDistance) {
      minDistance = dist
      nearest = mirror
    }
  }

  return nearest
}

/**
 * Finds the nearest artifact pedestal to a given horizontal coordinate within threshold.
 */
export function getNearestArtifact(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G07
): MirrorArtifact | null {
  let nearest: MirrorArtifact | null = null
  let minDistance = threshold

  for (const mirror of MIRROR_DEFINITIONS) {
    const dist = calculateHorizontalDistance(
      playerX,
      playerZ,
      mirror.artifact.position[0],
      mirror.artifact.position[2]
    )
    if (dist <= minDistance) {
      minDistance = dist
      nearest = mirror.artifact
    }
  }

  return nearest
}

/**
 * Determines whether the player is within range to interact with the central altar.
 */
export function isNearAltar(
  playerX: number,
  playerZ: number,
  threshold: number = ALTAR_DISTANCE_THRESHOLD_G07
): boolean {
  const dist = calculateHorizontalDistance(
    playerX,
    playerZ,
    ALTAR_WORLD_POS[0],
    ALTAR_WORLD_POS[2]
  )
  return dist <= threshold
}

/**
 * Returns the altar world coordinates.
 */
export function getAltarWorldPosition(): Vector3Tuple {
  return [...ALTAR_WORLD_POS]
}

/**
 * Returns the initial player spawn coordinates.
 */
export function getPlayerSpawnPosition(): Vector3Tuple {
  return [...INITIAL_MIRROR_POS]
}

/**
 * Returns the initial player camera look target.
 */
export function getPlayerInitialLook(): Vector3Tuple {
  return [...INITIAL_MIRROR_LOOK]
}

// ---------------------------------------------------------------------------
// Investigation Progress & Pure State Updates
// ---------------------------------------------------------------------------

/**
 * Checks whether all 4 required mirrors have been examined.
 */
export function hasExaminedAllMirrors(
  examinedIds: MirrorId[] | readonly MirrorId[] | Set<MirrorId>
): boolean {
  const count =
    examinedIds instanceof Set ? examinedIds.size : new Set(examinedIds).size
  return count >= REQUIRED_MIRRORS_COUNT
}

/**
 * Determines whether the central altar can be unlocked.
 * Requires all four mirrors to have been investigated.
 */
export function canActivateAltar(
  examinedIds: MirrorId[] | readonly MirrorId[] | Set<MirrorId>
): boolean {
  return hasExaminedAllMirrors(examinedIds)
}

/**
 * Records an examined mirror, adding it to the investigated list and recording
 * any discovered discrepancies. Pure function returning a new state.
 */
export function recordExaminedMirror(
  state: MirrorTrialState,
  mirrorId: MirrorId
): MirrorTrialState {
  if (state.investigation.investigatedMirrorIds.includes(mirrorId)) {
    return state
  }

  const mirrorDef = getMirrorById(mirrorId)
  if (!mirrorDef) {
    return state
  }

  const updatedInvestigated = [
    ...state.investigation.investigatedMirrorIds,
    mirrorId,
  ]

  const updatedDiscrepancies = [...state.investigation.discoveredDiscrepancies]
  if (
    mirrorDef.artifact.hasDiscrepancy &&
    !updatedDiscrepancies.includes(mirrorDef.artifact.discrepancyType)
  ) {
    updatedDiscrepancies.push(mirrorDef.artifact.discrepancyType)
  }

  const allExamined = hasExaminedAllMirrors(updatedInvestigated)

  return {
    ...state,
    investigation: {
      ...state.investigation,
      investigatedMirrorIds: updatedInvestigated,
      discoveredDiscrepancies: updatedDiscrepancies,
      altarUnlocked: allExamined,
    },
    status:
      allExamined && state.status === 'exploring'
        ? 'altar_ready'
        : state.status,
  }
}

/**
 * Checks whether all deceptive discrepancies have been discovered.
 */
export function hasDiscoveredAllDiscrepancies(
  discrepancies: string[] | readonly string[] | Set<string>
): boolean {
  const count =
    discrepancies instanceof Set
      ? discrepancies.size
      : new Set(discrepancies).size
  return count >= TOTAL_DISCREPANCIES_COUNT
}

/**
 * Summarizes the current discrepancy findings.
 */
export function getDiscrepancySummary(examinedIds: MirrorId[]): {
  total: number
  totalExpectedDiscrepancies: number
  deceptiveFound: number
  truthFound: boolean
  allDiscrepanciesFound: boolean
} {
  const uniqueIds = new Set(examinedIds)
  let deceptiveFound = 0
  let truthFound = false

  for (const id of uniqueIds) {
    const def = getMirrorById(id)
    if (def) {
      if (def.isDeceptive) {
        deceptiveFound++
      } else {
        truthFound = true
      }
    }
  }

  return {
    total: uniqueIds.size,
    totalExpectedDiscrepancies: TOTAL_DISCREPANCIES_COUNT,
    deceptiveFound,
    truthFound,
    allDiscrepanciesFound: deceptiveFound >= TOTAL_DISCREPANCIES_COUNT,
  }
}

// ---------------------------------------------------------------------------
// Altar Resolution & State Transitions
// ---------------------------------------------------------------------------

/**
 * Validates whether a state transition from currentStatus to nextStatus is allowed.
 */
export function validateStateTransition(
  currentStatus: Game07Status,
  nextStatus: Game07Status
): boolean {
  if (currentStatus === nextStatus) return true
  const allowed = VALID_STATE_TRANSITIONS[currentStatus]
  return allowed ? allowed.includes(nextStatus) : false
}

/**
 * Transitions state to nextStatus if valid; returns unchanged state if invalid.
 */
export function transitionStatus(
  state: MirrorTrialState,
  nextStatus: Game07Status
): MirrorTrialState {
  if (!validateStateTransition(state.status, nextStatus)) {
    return state
  }
  return {
    ...state,
    status: nextStatus,
  }
}

/**
 * Submits the player's choice at the central altar.
 * Pure function returning the updated state and whether the choice was correct.
 */
export function submitAltarChoice(
  state: MirrorTrialState,
  chosenMirrorId: MirrorId
): { state: MirrorTrialState; isCorrect: boolean } {
  if (!canActivateAltar(state.investigation.investigatedMirrorIds)) {
    return { state, isCorrect: false }
  }

  const isCorrect = isTrueMirror(chosenMirrorId)

  if (isCorrect) {
    return {
      state: {
        ...state,
        status: 'resolving',
        altarActivated: true,
        investigation: {
          ...state.investigation,
          selectedMirrorChoice: chosenMirrorId,
          trialResolved: true,
          isCorrectChoice: true,
        },
      },
      isCorrect: true,
    }
  }

  // Deception penalty
  const newSanity = Math.max(0, state.sanity - 25)
  const newHallucination = Math.min(1.0, state.hallucinationLevel + 0.3)

  return {
    state: {
      ...state,
      sanity: newSanity,
      whisperCount: state.whisperCount + 1,
      hallucinationLevel: newHallucination,
      status: newSanity <= 0 ? 'failing' : state.status,
      investigation: {
        ...state.investigation,
        selectedMirrorChoice: chosenMirrorId,
        trialResolved: false,
        isCorrectChoice: false,
      },
    },
    isCorrect: false,
  }
}

/**
 * Computes psychological sanity drain over time and hallucination intensity.
 */
export function calculateSanityDrain(
  timeElapsed: number,
  hallucinationLevel: number
): number {
  const baseRate = 0.05
  const hallucinationFactor = 1.0 + hallucinationLevel * 2.0
  return Math.min(100, timeElapsed * baseRate * hallucinationFactor)
}
