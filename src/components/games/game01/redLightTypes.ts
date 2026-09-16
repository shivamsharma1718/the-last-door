export type GameStatus =
  | 'playing'
  | 'failing'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

export type LightPhase = 'GREEN' | 'RED'

export interface RedLightGameProps {
  onBackToHallway?: () => void
}

export const INITIAL_ARENA_POS: [number, number, number] = [0, 1.65, 19.5]
export const INITIAL_ARENA_LOOK: [number, number, number] = [0, 1.65, -22]

export const ARENA_WIDTH = 10
export const ARENA_HEIGHT = 4.5
export const ARENA_DEPTH = 46
export const EXIT_Z = -22.5
