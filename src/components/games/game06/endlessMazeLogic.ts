import type {
  GridCoord,
  Direction,
  MazeCell,
  MazeLayout,
  MazeInvestigationObject,
  MazeShiftRule,
  MazeShiftState,
} from './endlessMazeTypes'
import {
  MAZE_GRID_WIDTH,
  MAZE_GRID_DEPTH,
  CELL_SIZE,
  ENTRANCE_GRID_POS,
  EXIT_GRID_POS,
  EXIT_WORLD_POS,
  INTERACTION_DISTANCE_THRESHOLD_G06,
  EXIT_DISTANCE_THRESHOLD_G06,
  REQUIRED_CLUES_COUNT_G06,
} from './endlessMazeTypes'

// ---------------------------------------------------------------------------
// Coordinate Conversion & Grid Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a grid coordinate {x, z} to a canonical string key "x,z".
 */
export function coordToKey(coord: GridCoord): string {
  return `${coord.x},${coord.z}`
}

/**
 * Parses a canonical string key "x,z" into a grid coordinate {x, z}.
 */
export function keyToCoord(key: string): GridCoord {
  const [xStr, zStr] = key.split(',')
  return {
    x: Number.parseInt(xStr, 10),
    z: Number.parseInt(zStr, 10),
  }
}

/**
 * Maps a discrete maze grid coordinate {x, z} to 3D world space [x, y, z].
 * The grid is centered such that grid (3, 3) corresponds to world (0, y, 0).
 */
export function gridToWorldPosition(
  coord: GridCoord,
  y: number = 1.65,
  cellSize: number = CELL_SIZE
): [number, number, number] {
  const worldX = (coord.x - Math.floor(MAZE_GRID_WIDTH / 2)) * cellSize
  const worldZ = (coord.z - Math.floor(MAZE_GRID_DEPTH / 2)) * cellSize
  return [worldX, y, worldZ]
}

/**
 * Maps continuous 3D world coordinates to the nearest discrete maze grid coordinate.
 */
export function worldToGridPosition(
  worldX: number,
  worldZ: number,
  cellSize: number = CELL_SIZE
): GridCoord {
  const gridX = Math.round(worldX / cellSize) + Math.floor(MAZE_GRID_WIDTH / 2)
  const gridZ = Math.round(worldZ / cellSize) + Math.floor(MAZE_GRID_DEPTH / 2)
  return {
    x: Math.max(0, Math.min(MAZE_GRID_WIDTH - 1, gridX)),
    z: Math.max(0, Math.min(MAZE_GRID_DEPTH - 1, gridZ)),
  }
}

/**
 * Validates whether a grid coordinate falls within the bounds of the maze grid.
 */
export function isValidCoord(
  coord: GridCoord,
  width: number = MAZE_GRID_WIDTH,
  depth: number = MAZE_GRID_DEPTH
): boolean {
  return coord.x >= 0 && coord.x < width && coord.z >= 0 && coord.z < depth
}

/**
 * Returns the opposite direction for a cardinal direction.
 */
export function getOppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case 'north':
      return 'south'
    case 'south':
      return 'north'
    case 'east':
      return 'west'
    case 'west':
      return 'east'
  }
}

/**
 * Returns the coordinate delta {x, z} for a cardinal direction.
 */
export function getDirectionOffset(dir: Direction): GridCoord {
  switch (dir) {
    case 'north':
      return { x: 0, z: -1 }
    case 'south':
      return { x: 0, z: 1 }
    case 'east':
      return { x: 1, z: 0 }
    case 'west':
      return { x: -1, z: 0 }
  }
}

/**
 * Returns the neighbor coordinate step in a given direction without bounds clamping.
 */
export function getNeighborCoord(coord: GridCoord, dir: Direction): GridCoord {
  const offset = getDirectionOffset(dir)
  return {
    x: coord.x + offset.x,
    z: coord.z + offset.z,
  }
}

// ---------------------------------------------------------------------------
// Investigation Clues Data
// ---------------------------------------------------------------------------

/**
 * Centralized environmental lore and navigation clues for Game 06.
 * Four unique remnants placed at distinct corners/alcoves of the maze.
 */
const MAZE_CLUES: readonly MazeInvestigationObject[] = [
  {
    id: 'architect_journal',
    title: 'ARCHITECT’S JOURNAL',
    gridCoord: { x: 1, z: 5 },
    worldPosition: [-8.0, 1.1, 8.0],
    clues: [
      '“The floor plan on parchment was immutable. The stone beneath my boots is not.”',
      '“When you turn your back on a corridor you have walked, the walls reorient.”',
    ],
  },
  {
    id: 'mirrored_compass',
    title: 'MIRRORED COMPASS',
    gridCoord: { x: 5, z: 5 },
    worldPosition: [8.0, 1.1, 8.0],
    clues: [
      '“The needle spins erratic when walking deeper, but calms when facing the threshold.”',
      '“True North in this labyrinth is not a compass heading—it is an intention.”',
    ],
  },
  {
    id: 'scratched_tally',
    title: 'SCRATCHED TALLY',
    gridCoord: { x: 1, z: 2 },
    worldPosition: [-8.0, 1.1, -4.0],
    clues: [
      '“Four marks carved into the mortar: one for each shifting corridor.”',
      '“The northern exit will only unseal once all four remnants have been examined.”',
    ],
  },
  {
    id: 'unwound_thread',
    title: 'UNWOUND THREAD',
    gridCoord: { x: 5, z: 2 },
    worldPosition: [8.0, 1.1, -4.0],
    clues: [
      '“A spool of crimson thread knotted to the entrance arch, trailing into the gloom.”',
      '“It ends cleanly severed three strides past the central junction.”',
    ],
  },
] as const

/**
 * Returns a list of all investigation objects in Game 06.
 */
export function getMazeClues(): MazeInvestigationObject[] {
  return [...MAZE_CLUES]
}

/**
 * Finds an investigation object by its ID.
 */
export function getMazeClueById(id: string): MazeInvestigationObject | undefined {
  return MAZE_CLUES.find((clue) => clue.id.toLowerCase() === id.toLowerCase())
}

/**
 * Finds an investigation object located at a specific grid coordinate.
 */
export function getClueAtCoord(coord: GridCoord): MazeInvestigationObject | undefined {
  return MAZE_CLUES.find(
    (clue) => clue.gridCoord.x === coord.x && clue.gridCoord.z === coord.z
  )
}

/**
 * Finds the closest investigation object to continuous world coordinates [playerX, playerZ].
 */
export function getNearestMazeClue(
  playerX: number,
  playerZ: number,
  threshold: number = INTERACTION_DISTANCE_THRESHOLD_G06
): MazeInvestigationObject | null {
  let closestClue: MazeInvestigationObject | null = null
  let minDistance = threshold

  for (const clue of MAZE_CLUES) {
    const dx = playerX - clue.worldPosition[0]
    const dz = playerZ - clue.worldPosition[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance <= minDistance) {
      minDistance = distance
      closestClue = clue
    }
  }

  return closestClue
}

/**
 * Checks if the player has discovered all required investigation clues.
 */
export function hasDiscoveredAllClues(
  discoveredClues: Set<string> | readonly string[]
): boolean {
  const clueCount =
    discoveredClues instanceof Set ? discoveredClues.size : discoveredClues.length
  return clueCount >= REQUIRED_CLUES_COUNT_G06
}

// ---------------------------------------------------------------------------
// Maze Shifting Rules (Deterministic)
// ---------------------------------------------------------------------------

/**
 * Deterministic shift rules that alter the labyrinth layout when specific milestones are met.
 */
export const MAZE_SHIFT_RULES: readonly MazeShiftRule[] = [
  {
    id: 'shift_west_corridor',
    name: 'West Passage Reorientation',
    description: 'Corridor (2, 4) opens, linking the south and west corridors into an unexpected loop.',
    targetCoord: { x: 2, z: 4 },
    requiredClues: 1,
    originalConnections: [],
    newConnections: ['north', 'south'],
  },
  {
    id: 'shift_east_corridor',
    name: 'East Passage Reorientation',
    description: 'Corridor (4, 4) opens, establishing an alternate eastern thoroughfare.',
    targetCoord: { x: 4, z: 4 },
    requiredClues: 2,
    originalConnections: [],
    newConnections: ['north', 'south'],
  },
  {
    id: 'shift_center_cross',
    name: 'Central Junction Realignment',
    description: 'Central approach (3, 4) opens east and west passageways.',
    targetCoord: { x: 3, z: 4 },
    requiredClues: 3,
    originalConnections: ['north', 'south'],
    newConnections: ['north', 'south', 'east', 'west'],
  },
  {
    id: 'shift_exit_unseal',
    name: 'Northern Exit Arch Unseal',
    description: 'Corridor (3, 1) unlocks its northern blast doorway leading into the exit chamber (3, 0).',
    targetCoord: { x: 3, z: 1 },
    requiredClues: 4,
    originalConnections: ['south'],
    newConnections: ['south', 'north'],
  },
] as const

// ---------------------------------------------------------------------------
// Maze Layout Generation & Traversability
// ---------------------------------------------------------------------------

/**
 * Creates the initial deterministic 7x7 maze layout for Game 06.
 * All connections are verified to be reciprocal and symmetric.
 */
export function createInitialMazeLayout(): MazeLayout {
  const cells: Record<string, MazeCell> = {}

  // Helper to register a cell
  function addCell(
    x: number,
    z: number,
    type: MazeCell['type'],
    connections: Direction[],
    extras: Partial<MazeCell> = {}
  ) {
    cells[coordToKey({ x, z })] = {
      x,
      z,
      type,
      connections: [...connections],
      ...extras,
    }
  }

  // Row 6 (South Entrance row)
  addCell(3, 6, 'entrance', ['north'], { isEntrance: true })

  // Row 5 (South crossroads & lower clue alcoves)
  addCell(1, 5, 'clue_alcove', ['east'], { hasClue: true, clueId: 'architect_journal' })
  addCell(2, 5, 'corridor', ['west', 'east'])
  addCell(3, 5, 'crossroads', ['north', 'south', 'east', 'west'])
  addCell(4, 5, 'corridor', ['west', 'east'])
  addCell(5, 5, 'clue_alcove', ['west'], { hasClue: true, clueId: 'mirrored_compass' })

  // Row 4 (Lower connective corridors & shifting cells)
  addCell(1, 4, 'corridor', ['north'])
  addCell(2, 4, 'shifting_corridor', [], { shiftTargetKey: 'shift_west_corridor' })
  addCell(3, 4, 'shifting_corridor', ['north', 'south'], { shiftTargetKey: 'shift_center_cross' })
  addCell(4, 4, 'shifting_corridor', [], { shiftTargetKey: 'shift_east_corridor' })
  addCell(5, 4, 'corridor', ['north'])

  // Row 3 (Central Hallway & Junctions)
  addCell(1, 3, 't_junction', ['north', 'south', 'east'])
  addCell(2, 3, 'corridor', ['west', 'east'])
  addCell(3, 3, 'crossroads', ['north', 'south', 'east', 'west'])
  addCell(4, 3, 'corridor', ['west', 'east'])
  addCell(5, 3, 't_junction', ['north', 'south', 'west'])

  // Row 2 (Upper clue alcoves & approach corridor)
  addCell(1, 2, 'clue_alcove', ['south'], { hasClue: true, clueId: 'scratched_tally' })
  addCell(3, 2, 'corridor', ['north', 'south'])
  addCell(5, 2, 'clue_alcove', ['south'], { hasClue: true, clueId: 'unwound_thread' })

  // Row 1 (Pre-exit threshold corridor)
  addCell(3, 1, 'shifting_corridor', ['south'], { shiftTargetKey: 'shift_exit_unseal' })

  // Row 0 (Northern Exit Chamber - unsealed after all 4 clues)
  addCell(3, 0, 'exit_chamber', [], { isExit: true })

  return {
    width: MAZE_GRID_WIDTH,
    depth: MAZE_GRID_DEPTH,
    cells,
    entrance: { ...ENTRANCE_GRID_POS },
    exit: { ...EXIT_GRID_POS },
    shiftingCellKeys: ['2,4', '4,4', '3,4', '3,1'],
  }
}

/**
 * Retrieves a cell from the layout by coordinate.
 */
export function getCell(layout: MazeLayout, coord: GridCoord): MazeCell | undefined {
  return layout.cells[coordToKey(coord)]
}

/**
 * Checks if a player can traverse from a given coordinate in a specified direction.
 */
export function canTraverse(
  layout: MazeLayout,
  fromCoord: GridCoord,
  dir: Direction
): boolean {
  const currentCell = getCell(layout, fromCoord)
  if (!currentCell || !currentCell.connections.includes(dir)) {
    return false
  }

  const targetCoord = getNeighborCoord(fromCoord, dir)
  if (!isValidCoord(targetCoord, layout.width, layout.depth)) {
    return false
  }

  const targetCell = getCell(layout, targetCoord)
  if (!targetCell) {
    return false
  }

  const returnDir = getOppositeDirection(dir)
  return targetCell.connections.includes(returnDir)
}

/**
 * Returns all valid cardinal directions a player can move from a given cell.
 */
export function getAvailableDirections(
  layout: MazeLayout,
  coord: GridCoord
): Direction[] {
  const directions: Direction[] = ['north', 'south', 'east', 'west']
  return directions.filter((dir) => canTraverse(layout, coord, dir))
}

/**
 * Returns all accessible neighboring cells from a coordinate.
 */
export function getTraversableNeighbors(
  layout: MazeLayout,
  coord: GridCoord
): { direction: Direction; coord: GridCoord; cell: MazeCell }[] {
  const availableDirs = getAvailableDirections(layout, coord)
  const neighbors: { direction: Direction; coord: GridCoord; cell: MazeCell }[] = []

  for (const dir of availableDirs) {
    const targetCoord = getNeighborCoord(coord, dir)
    const cell = getCell(layout, targetCoord)
    if (cell) {
      neighbors.push({ direction: dir, coord: targetCoord, cell })
    }
  }

  return neighbors
}

// ---------------------------------------------------------------------------
// Exploration Tracking Helpers
// ---------------------------------------------------------------------------

/**
 * Records a visited cell coordinate into the explored set. Returns a new Set instance.
 */
export function recordExploredCell(
  exploredCells: Set<string>,
  coord: GridCoord
): Set<string> {
  const key = coordToKey(coord)
  if (exploredCells.has(key)) {
    return exploredCells
  }
  const next = new Set(exploredCells)
  next.add(key)
  return next
}

/**
 * Calculates the total number of traversable cells in the layout.
 */
export function getTotalTraversableCells(layout: MazeLayout): number {
  return Object.values(layout.cells).filter((cell) => cell.connections.length > 0).length
}

/**
 * Calculates the percentage (0 to 100) of the maze explored so far.
 */
export function calculateExplorationPercentage(
  exploredCells: Set<string>,
  totalCells: number
): number {
  if (totalCells <= 0) return 0
  const percentage = (exploredCells.size / totalCells) * 100
  return Math.min(100, Math.max(0, Math.round(percentage)))
}

// ---------------------------------------------------------------------------
// Deterministic Maze Shifting Mechanics
// ---------------------------------------------------------------------------

/**
 * Creates the initial shift state.
 */
export function createInitialShiftState(): MazeShiftState {
  return {
    shiftCount: 0,
    lastShiftId: null,
    isShifting: false,
    activeShifts: [],
  }
}

/**
 * Checks if a specific shift rule can be applied based on current clue progress and shift history.
 */
export function canApplyShiftRule(
  rule: MazeShiftRule,
  discoveredClueCount: number,
  shiftState: MazeShiftState
): boolean {
  if (shiftState.activeShifts.includes(rule.id)) {
    return false
  }
  return discoveredClueCount >= rule.requiredClues
}

/**
 * Evaluates whether any deterministic shift rules should be triggered given the current state.
 * Returns the first applicable shift rule, or null if none.
 */
export function evaluateNextShiftRule(
  discoveredClueCount: number,
  shiftState: MazeShiftState
): MazeShiftRule | null {
  for (const rule of MAZE_SHIFT_RULES) {
    if (canApplyShiftRule(rule, discoveredClueCount, shiftState)) {
      return rule
    }
  }
  return null
}

/**
 * Deterministically applies a shift rule to the maze layout.
 * Updates target cell connections and ensures reciprocal neighbor connections.
 */
export function applyDeterministicShift(
  layout: MazeLayout,
  shiftState: MazeShiftState,
  ruleId: string
): { layout: MazeLayout; shiftState: MazeShiftState } {
  const rule = MAZE_SHIFT_RULES.find((r) => r.id === ruleId)
  if (!rule || shiftState.activeShifts.includes(ruleId)) {
    return { layout, shiftState }
  }

  // Clone cells
  const updatedCells: Record<string, MazeCell> = {}
  for (const [key, cell] of Object.entries(layout.cells)) {
    updatedCells[key] = {
      ...cell,
      connections: [...cell.connections],
    }
  }

  const targetKey = coordToKey(rule.targetCoord)
  const targetCell = updatedCells[targetKey]

  if (targetCell) {
    targetCell.connections = [...rule.newConnections]

    // Handle reciprocal connections with neighbors
    for (const dir of rule.newConnections) {
      const neighborCoord = getNeighborCoord(rule.targetCoord, dir)
      const neighborKey = coordToKey(neighborCoord)
      const neighborCell = updatedCells[neighborKey]

      if (neighborCell) {
        const returnDir = getOppositeDirection(dir)
        if (!neighborCell.connections.includes(returnDir)) {
          neighborCell.connections.push(returnDir)
        }
      }
    }
  }

  // Special case: When unsealing the exit, connect (3, 0) south to (3, 1)
  if (rule.id === 'shift_exit_unseal') {
    const exitKey = coordToKey(EXIT_GRID_POS)
    const exitCell = updatedCells[exitKey]
    if (exitCell && !exitCell.connections.includes('south')) {
      exitCell.connections.push('south')
    }
  }

  const updatedLayout: MazeLayout = {
    ...layout,
    cells: updatedCells,
  }

  const updatedShiftState: MazeShiftState = {
    shiftCount: shiftState.shiftCount + 1,
    lastShiftId: rule.id,
    isShifting: false,
    activeShifts: [...shiftState.activeShifts, rule.id],
  }

  return { layout: updatedLayout, shiftState: updatedShiftState }
}

// ---------------------------------------------------------------------------
// Exit & Escape Conditions
// ---------------------------------------------------------------------------

/**
 * Checks if the exit has been revealed.
 * The exit is revealed when all 4 clues have been collected.
 */
export function isExitRevealed(discoveredClueCount: number): boolean {
  return discoveredClueCount >= REQUIRED_CLUES_COUNT_G06
}

/**
 * Checks if the player's grid coordinate is at the exit chamber.
 */
export function isPlayerAtExit(
  playerCoord: GridCoord,
  exitCoord: GridCoord = EXIT_GRID_POS
): boolean {
  return playerCoord.x === exitCoord.x && playerCoord.z === exitCoord.z
}

/**
 * Checks if the player's continuous world position is within interaction range of the exit.
 */
export function isPlayerAtExitWorld(
  playerX: number,
  playerZ: number,
  exitWorldPos: [number, number, number] = EXIT_WORLD_POS,
  threshold: number = EXIT_DISTANCE_THRESHOLD_G06
): boolean {
  const dx = playerX - exitWorldPos[0]
  const dz = playerZ - exitWorldPos[2]
  return Math.sqrt(dx * dx + dz * dz) <= threshold
}

/**
 * Determines if the player can complete the trial:
 * Exit must be revealed (all 4 clues discovered) and the player must be at the exit.
 */
export function canEscapeMaze(
  playerCoord: GridCoord,
  exitRevealed: boolean
): boolean {
  return exitRevealed && isPlayerAtExit(playerCoord)
}
