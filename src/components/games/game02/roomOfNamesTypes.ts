export type Game02Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'memory_transition'
  | 'identity_decision'
  | 'confirming'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type ObjectType =
  | 'photograph'
  | 'desk'
  | 'hospital_record'
  | 'mirror'
  | 'old_tape'

export interface IdentityOption {
  id: string
  name: string
  position: [number, number, number]
  memoryClues: string[]
  isTrueIdentity: boolean
  objectType: ObjectType | string
}

export interface RoomOfNamesProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export const INITIAL_ROOM02_POS: [number, number, number] = [0, 1.65, 4.5]
export const INITIAL_ROOM02_LOOK: [number, number, number] = [0, 1.65, -4]

export const ROOM02_WIDTH = 14
export const ROOM02_HEIGHT = 4.0
export const ROOM02_DEPTH = 14
export const INTERACTION_DISTANCE_THRESHOLD = 2.2
