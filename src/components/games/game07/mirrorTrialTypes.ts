/**
 * Game 07: THE MIRROR TRIAL - Foundational Type Definitions
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 */

export type Game07Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'altar_ready'
  | 'resolving'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type MirrorCardinalDirection = 'north' | 'east' | 'west' | 'south'

export type MirrorId =
  | 'mirror_north'
  | 'mirror_east'
  | 'mirror_west'
  | 'mirror_south'

export type MirrorType =
  | 'truth'
  | 'phantom_flame'
  | 'inverted_time'
  | 'false_door'

export type Vector3Tuple = [number, number, number]
export type Vector2Tuple = [number, number]

export interface MirrorArtifact {
  id: string
  name: string
  position: Vector3Tuple
  realDescription: string
  reflectedDescription: string
  hasDiscrepancy: boolean
  discrepancyType: string
}

export interface MirrorClue {
  id: string
  title: string
  text: string
  revealed: boolean
}

export interface MirrorDefinition {
  id: MirrorId
  latinTitle: string
  englishTitle: string
  direction: MirrorCardinalDirection
  mirrorType: MirrorType
  isDeceptive: boolean
  mirrorPosition: Vector3Tuple
  mirrorRotation: Vector3Tuple
  mirrorDimensions: Vector2Tuple
  artifact: MirrorArtifact
  clues: MirrorClue[]
  inscription: string
  reflectionDescription: string
  realityDescription: string
  deceptionAnalysis: string
}

export interface MirrorInvestigationState {
  activeMirrorId: MirrorId | null
  investigatedMirrorIds: MirrorId[]
  discoveredDiscrepancies: string[]
  isExamining: boolean
  altarUnlocked: boolean
  selectedMirrorChoice: MirrorId | null
  trialResolved: boolean
  isCorrectChoice: boolean
}

export interface MirrorTrialState {
  status: Game07Status
  investigation: MirrorInvestigationState
  timeElapsed: number
  sanity: number
  whisperCount: number
  hallucinationLevel: number
  altarActivated: boolean
}

export interface TheMirrorTrialProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export type MirrorTrialProps = TheMirrorTrialProps

// ---------------------------------------------------------------------------
// Chamber Dimensions & Coordinates Constants
// ---------------------------------------------------------------------------
export const CHAMBER_WIDTH = 12.0
export const CHAMBER_DEPTH = 12.0
export const CHAMBER_HEIGHT = 4.2

export const ALTAR_WORLD_POS: Vector3Tuple = [0, 1.0, 0]
export const INITIAL_MIRROR_POS: Vector3Tuple = [0, 1.65, 2.4]
export const INITIAL_MIRROR_LOOK: Vector3Tuple = [0, 1.65, 0]

export const INTERACTION_DISTANCE_THRESHOLD_G07 = 2.2
export const ALTAR_DISTANCE_THRESHOLD_G07 = 2.0
export const REQUIRED_MIRRORS_COUNT = 4
export const TOTAL_DISCREPANCIES_COUNT = 3

export const TRUE_MIRROR_ID: MirrorId = 'mirror_north'

