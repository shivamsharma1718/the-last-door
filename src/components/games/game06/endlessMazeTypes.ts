/**
 * Game 06: THE ENDLESS MAZE - Foundational Type Definitions
 * Theme: Memory, Navigation, Disorientation, and Psychological Horror.
 */

export type Game06Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'maze_shifting'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type Direction = 'north' | 'south' | 'east' | 'west'

export interface GridCoord {
  x: number
  z: number
}

export type CellType =
  | 'entrance'
  | 'corridor'
  | 'turn'
  | 't_junction'
  | 'crossroads'
  | 'dead_end'
  | 'clue_alcove'
  | 'shifting_corridor'
  | 'exit_chamber'

export interface MazeCell {
  x: number
  z: number
  type: CellType
  connections: Direction[]
  hasClue?: boolean
  clueId?: string
  isExit?: boolean
  isEntrance?: boolean
  shiftTargetKey?: string
}

export type MazeClueId =
  | 'architect_journal'
  | 'mirrored_compass'
  | 'scratched_tally'
  | 'unwound_thread'

export interface MazeInvestigationObject {
  id: MazeClueId | string
  title: string
  gridCoord: GridCoord
  worldPosition: [number, number, number]
  clues: string[]
}

export interface MazeShiftRule {
  id: string
  name: string
  description: string
  targetCoord: GridCoord
  requiredClues: number
  newConnections: Direction[]
  originalConnections: Direction[]
}

export interface MazeShiftState {
  shiftCount: number
  lastShiftId: string | null
  isShifting: boolean
  activeShifts: string[]
}

export interface MazeLayout {
  width: number
  depth: number
  cells: Record<string, MazeCell>
  entrance: GridCoord
  exit: GridCoord
  shiftingCellKeys: string[]
}

export interface TheEndlessMazeProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

// ---------------------------------------------------------------------------
// Maze Grid & Coordinate Constants
// ---------------------------------------------------------------------------
export const MAZE_GRID_WIDTH = 7
export const MAZE_GRID_DEPTH = 7
export const CELL_SIZE = 4.0
export const MAZE_WALL_HEIGHT = 4.0

export const ENTRANCE_GRID_POS: GridCoord = { x: 3, z: 6 }
export const EXIT_GRID_POS: GridCoord = { x: 3, z: 0 }

// World Coordinates: Center grid at (0, 0)
// Grid (3, 3) is world [0, y, 0].
// x_world = (x - 3) * CELL_SIZE
// z_world = (z - 3) * CELL_SIZE
export const INITIAL_MAZE_POS: [number, number, number] = [0, 1.65, 12.0]
export const INITIAL_MAZE_LOOK: [number, number, number] = [0, 1.65, 8.0]
export const EXIT_WORLD_POS: [number, number, number] = [0, 1.65, -12.0]

export const INTERACTION_DISTANCE_THRESHOLD_G06 = 2.4
export const EXIT_DISTANCE_THRESHOLD_G06 = 2.2
export const REQUIRED_CLUES_COUNT_G06 = 4
