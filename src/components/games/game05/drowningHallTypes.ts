export type Game05Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'water_warning'
  | 'water_critical'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type DrowningHallObjectId =
  | 'pressure_gauge'
  | 'maintenance_log'
  | 'control_panel'
  | 'flood_marker'

export type DrowningHallObjectType =
  | 'pressure_gauge'
  | 'maintenance_log'
  | 'control_panel'
  | 'flood_marker'

export interface DrowningHallObject {
  id: DrowningHallObjectId | string
  type: DrowningHallObjectType | string
  title: string
  position: [number, number, number]
  clues: string[]
}

export type ValveId = 'valve_1' | 'valve_2' | 'valve_3'

export interface ValveModel {
  id: ValveId
  label: string
  position: [number, number, number]
  activated?: boolean
}

export interface TheDrowningHallProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

// Chamber Dimensions & Interaction Constants
export const ROOM05_WIDTH = 14
export const ROOM05_HEIGHT = 4.5
export const ROOM05_DEPTH = 22

export const INTERACTION_DISTANCE_THRESHOLD_G05 = 2.4

export const INITIAL_ROOM05_POS: [number, number, number] = [0, 1.65, 8.0]
export const INITIAL_ROOM05_LOOK: [number, number, number] = [0, 1.65, 0.0]

export const EXIT_Z = -9.0
export const EXIT_POSITION: [number, number, number] = [0, 1.65, EXIT_Z]

// Water System Constants
export const INITIAL_WATER_LEVEL = 0
export const WATER_WARNING_THRESHOLD = 50
export const WATER_CRITICAL_THRESHOLD = 90
export const MAX_WATER_LEVEL = 100
export const WATER_RISE_RATE = 2.0
