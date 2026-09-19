export type Game04Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'watcher_alert'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type WatcherObjectId =
  | 'torn_photograph'
  | 'warning_note'
  | 'security_monitor'
  | 'observation_window'

export type WatcherObjectType =
  | 'torn_photograph'
  | 'warning_note'
  | 'security_monitor'
  | 'observation_window'

export interface WatcherInvestigationObject {
  id: WatcherObjectId | string
  type: WatcherObjectType | string
  title: string
  position: [number, number, number]
  clues: string[]
}

export interface WatcherModel {
  id: string
  label: string
  position: [number, number, number]
  detectionRange: number
  alertState?: boolean
}

export interface TheWatcherProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export const ROOM04_WIDTH = 16
export const ROOM04_HEIGHT = 4.2
export const ROOM04_DEPTH = 18

export const INTERACTION_DISTANCE_THRESHOLD_G04 = 2.4

export const INITIAL_ROOM04_POS: [number, number, number] = [0, 1.65, 6.5]
export const INITIAL_ROOM04_LOOK: [number, number, number] = [0, 1.65, 8.0]

export const EXIT_Z = -7.5
export const EXIT_POSITION: [number, number, number] = [0, 1.65, EXIT_Z]
export const WATCHER_POSITION: [number, number, number] = [0, 1.65, -5.8]
