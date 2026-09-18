export type Game03Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'door_confirmation'
  | 'confirming'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type DoorId = 'safe' | 'honest' | 'quiet'
export type ObjectId =
  | 'broken_key'
  | 'prisoner_note'
  | 'black_mirror'
  | 'hidden_inscription'

export interface DoorOption {
  id: DoorId | string
  doorNumber: string
  name: string
  statement: string
  position: [number, number, number]
  isCorrect: boolean
}

export interface InvestigationObject {
  id: ObjectId | string
  name: string
  objectType: string
  position: [number, number, number]
  clues: string[]
}

export interface CentralInscription {
  text: string
  position: [number, number, number]
}

export interface ThreeDoorsProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export const INITIAL_ROOM03_POS: [number, number, number] = [0, 1.65, 5.0]
export const INITIAL_ROOM03_LOOK: [number, number, number] = [0, 1.65, -5.0]

export const ROOM03_WIDTH = 14
export const ROOM03_HEIGHT = 4.0
export const ROOM03_DEPTH = 14
export const INTERACTION_DISTANCE_THRESHOLD_G03 = 2.4
