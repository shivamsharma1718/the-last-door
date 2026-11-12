import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { AmbientLight, DirectionalLight } from 'three'
import { Text } from '@react-three/drei'
import type {
  MazeLayout,
  MazeCell,
  MazeInvestigationObject,
} from './endlessMazeTypes'
import {
  CELL_SIZE,
  MAZE_WALL_HEIGHT,
  MAZE_GRID_WIDTH,
  MAZE_GRID_DEPTH,
  EXIT_WORLD_POS,
} from './endlessMazeTypes'
import {
  createInitialMazeLayout,
  getMazeClues,
  gridToWorldPosition,
} from './endlessMazeLogic'

// ---------------------------------------------------------------------------
// 1. Investigation Artifact Pedestals
// ---------------------------------------------------------------------------

const ArtifactStand: React.FC<{
  position: [number, number, number]
  isExamined?: boolean
  children?: React.ReactNode
}> = ({ position, isExamined = false, children }) => {
  const [x, , z] = position

  return (
    <group position={[x, 0, z]}>
      {/* Heavy Base Plinth */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
        <meshStandardMaterial color="#0e131a" roughness={0.9} metalness={0.25} />
      </mesh>
      {/* Central Stone Column */}
      <mesh position={[0, 0.48, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.6, 0.76, 0.6]} />
        <meshStandardMaterial color="#141a24" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Tabletop Surface */}
      <mesh position={[0, 0.88, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.95, 0.06, 0.95]} />
        <meshStandardMaterial color="#1b2332" roughness={0.75} metalness={0.35} />
      </mesh>
      {/* Ambient Floor Ring Accent */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.85, 24]} />
        <meshBasicMaterial
          color={isExamined ? '#38bdf8' : '#22d3ee'}
          transparent
          opacity={isExamined ? 0.45 : 0.25}
        />
      </mesh>
      {children}
    </group>
  )
}

/**
 * OBJECT 1: Architect's Journal
 */
const ArchitectJournalMesh: React.FC<{
  item: MazeInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.worldPosition} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Slanted Drafting Board */}
        <mesh position={[0, 0.12, -0.05]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.62, 0.04, 0.46]} />
          <meshStandardMaterial color="#1f1812" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Open Field Journal Covers */}
        <mesh position={[0, 0.16, -0.04]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.48, 0.02, 0.36]} />
          <meshStandardMaterial color="#3d2716" roughness={0.9} />
        </mesh>
        {/* Manuscript Pages */}
        <mesh position={[0, 0.18, -0.04]} rotation={[-0.25, 0, 0]}>
          <planeGeometry args={[0.42, 0.3]} />
          <meshStandardMaterial color="#d4c7a5" roughness={0.95} />
        </mesh>
        {/* Brass Drafting Divider Tool */}
        <mesh position={[0.12, 0.2, -0.02]} rotation={[-0.25, 0.2, 0]}>
          <boxGeometry args={[0.02, 0.01, 0.14]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Focused Amber Reading Sconce */}
        <pointLight
          position={[0, 0.5, 0.3]}
          color="#fde047"
          intensity={2.8}
          distance={5.0}
          decay={2}
        />
      </group>
    </ArtifactStand>
  )
}

/**
 * OBJECT 2: Mirrored Compass
 */
const MirroredCompassMesh: React.FC<{
  item: MazeInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.worldPosition} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Obsidian Mirror Base Plate */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
          <meshStandardMaterial color="#080c14" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Gimbaled Brass Compass Housing */}
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.85} />
        </mesh>
        {/* Mirrored Enamel Dial */}
        <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial color="#e0f2fe" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Dual Needle Indicator */}
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <boxGeometry args={[0.28, 0.015, 0.005]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        {/* Glass Crystal Bezel Rim */}
        <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.015, 12, 24]} />
          <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Focused Cyan Luminescence */}
        <pointLight
          position={[0, 0.5, 0.25]}
          color="#38bdf8"
          intensity={3.0}
          distance={5.0}
          decay={2}
        />
      </group>
    </ArtifactStand>
  )
}

/**
 * OBJECT 3: Scratched Tally
 */
const ScratchedTallyMesh: React.FC<{
  item: MazeInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.worldPosition} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Heavy Stone Monument Block */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.54, 0.44, 0.32]} />
          <meshStandardMaterial color="#1a202c" roughness={0.95} metalness={0.15} />
        </mesh>
        {/* Four Chiseled Tally Marks */}
        {[-0.15, -0.05, 0.05, 0.15].map((tx, idx) => (
          <mesh key={`tally-${idx}`} position={[tx, 0.25, 0.165]}>
            <boxGeometry args={[0.016, 0.22, 0.01]} />
            <meshBasicMaterial color="#14b8a6" />
          </mesh>
        ))}
        {/* Diagonal Cross Strike */}
        <mesh position={[0, 0.25, 0.17]} rotation={[0, 0, -0.65]}>
          <boxGeometry args={[0.36, 0.016, 0.01]} />
          <meshBasicMaterial color="#0f766e" />
        </mesh>
        {/* Resting Iron Chisel */}
        <mesh position={[0.16, 0.46, 0.04]} rotation={[0.2, 0.4, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.26, 8]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Eerie Teal Accent Light */}
        <pointLight
          position={[0, 0.55, 0.35]}
          color="#2dd4bf"
          intensity={2.8}
          distance={5.0}
          decay={2}
        />
      </group>
    </ArtifactStand>
  )
}

/**
 * OBJECT 4: Unwound Thread
 */
const UnwoundThreadMesh: React.FC<{
  item: MazeInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.worldPosition} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Turned Wooden Spool Axle */}
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.32, 16]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        {/* Crimson Thread Core Wrap */}
        <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.24, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
        {/* Dropping Crimson Thread Tail */}
        <mesh position={[0.08, -0.15, 0.14]} rotation={[0.4, 0, 0.2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.7, 6]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Pool of Thread Coils on Pedestal */}
        <mesh position={[0.12, 0.02, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.15, 12]} />
          <meshBasicMaterial color="#b91c1c" />
        </mesh>

        {/* Focused Blood-Red Accent Light */}
        <pointLight
          position={[0, 0.5, 0.3]}
          color="#ef4444"
          intensity={3.2}
          distance={5.0}
          decay={2}
        />
      </group>
    </ArtifactStand>
  )
}

// ---------------------------------------------------------------------------
// 2. Entrance Airlock Architecture (South row 6)
// ---------------------------------------------------------------------------

const EntranceAirlock: React.FC = () => {
  const worldPos = gridToWorldPosition({ x: 3, z: 6 })

  return (
    <group position={[worldPos[0], 0, worldPos[2]]}>
      {/* Floor Spawn Indicator Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.05, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
      </mesh>

      {/* Sealed Southern Entry Arch (Behind player spawn) */}
      <group position={[0, 0, CELL_SIZE / 2]}>
        {/* Arch Pillars */}
        <mesh position={[-1.6, MAZE_WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, MAZE_WALL_HEIGHT, 0.4]} />
          <meshStandardMaterial color="#161d28" roughness={0.85} metalness={0.3} />
        </mesh>
        <mesh position={[1.6, MAZE_WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, MAZE_WALL_HEIGHT, 0.4]} />
          <meshStandardMaterial color="#161d28" roughness={0.85} metalness={0.3} />
        </mesh>
        {/* Overhead Lintel */}
        <mesh position={[0, MAZE_WALL_HEIGHT - 0.25, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.6, 0.5, 0.4]} />
          <meshStandardMaterial color="#192230" roughness={0.8} metalness={0.35} />
        </mesh>
        {/* Sealed Iron Gate Panels */}
        <mesh position={[0, 1.8, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.8, 3.4, 0.12]} />
          <meshStandardMaterial color="#0f141d" roughness={0.7} metalness={0.65} />
        </mesh>
        {/* Sconce Beacon */}
        <pointLight position={[0, 3.2, -0.4]} color="#38bdf8" intensity={2.5} distance={7.0} decay={2} />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. Exit Blast Door & Chamber (North row 0)
// ---------------------------------------------------------------------------

const ExitBlastDoor: React.FC<{ isUnlocked?: boolean; isEscaping?: boolean }> = ({
  isUnlocked = false,
  isEscaping = false,
}) => {
  const [ex, , ez] = EXIT_WORLD_POS

  return (
    <group position={[ex, 0, ez]}>
      {/* Heavy Steel Frame Columns */}
      <mesh position={[-1.4, 1.8, -CELL_SIZE / 2 + 0.2]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 3.6, 0.4]} />
        <meshStandardMaterial color="#161d28" roughness={0.8} metalness={0.4} />
      </mesh>
      <mesh position={[1.4, 1.8, -CELL_SIZE / 2 + 0.2]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 3.6, 0.4]} />
        <meshStandardMaterial color="#161d28" roughness={0.8} metalness={0.4} />
      </mesh>
      {/* Heavy Lintel Header */}
      <mesh position={[0, 3.4, -CELL_SIZE / 2 + 0.2]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.4, 0.4]} />
        <meshStandardMaterial color="#1a2332" roughness={0.75} metalness={0.45} />
      </mesh>

      {/* Main Double Blast Door Panels */}
      <mesh
        position={[
          isEscaping ? -1.35 : isUnlocked ? -0.85 : -0.55,
          1.6,
          -CELL_SIZE / 2 + 0.2,
        ]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.1, 3.1, 0.16]} />
        <meshStandardMaterial color="#0e131b" roughness={0.7} metalness={0.65} />
      </mesh>
      <mesh
        position={[
          isEscaping ? 1.35 : isUnlocked ? 0.85 : 0.55,
          1.6,
          -CELL_SIZE / 2 + 0.2,
        ]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1.1, 3.1, 0.16]} />
        <meshStandardMaterial color="#0e131b" roughness={0.7} metalness={0.65} />
      </mesh>

      {/* Hydraulic Lock Cylinders */}
      <mesh position={[-1.0, 1.6, -CELL_SIZE / 2 + 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[1.0, 1.6, -CELL_SIZE / 2 + 0.3]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Sign Plaque: LOCKED or UNLOCKED */}
      <group position={[0, 3.75, -CELL_SIZE / 2 + 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.35, 0.08]} />
          <meshStandardMaterial
            color={isUnlocked ? '#061320' : '#14080a'}
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.14}
          color={isUnlocked ? '#38bdf8' : '#f87171'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
          fontWeight="bold"
        >
          {isUnlocked ? 'EXIT UNLOCKED' : 'SEALED ARCH'}
        </Text>
        <pointLight
          position={[0, 0, 0.25]}
          color={isUnlocked ? '#38bdf8' : '#ef4444'}
          intensity={isUnlocked ? 3.0 : 2.2}
          distance={5.0}
          decay={2}
        />
      </group>

      {/* Warning Hazard Beacon Indicators */}
      <mesh position={[-1.4, 3.4, -CELL_SIZE / 2 + 0.4]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={isUnlocked ? '#38bdf8' : '#ef4444'} />
      </mesh>
      <mesh position={[1.4, 3.4, -CELL_SIZE / 2 + 0.4]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={isUnlocked ? '#38bdf8' : '#ef4444'} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. Corridor Lantern / Wall Sconce Fixture
// ---------------------------------------------------------------------------

const CorridorSconce: React.FC<{
  position: [number, number, number]
}> = ({ position }) => {
  return (
    <group position={position}>
      {/* Sconce Wall Flange */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
      </mesh>
      {/* Arm Bracket */}
      <mesh position={[0, -0.05, 0.12]}>
        <boxGeometry args={[0.04, 0.04, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Industrial Cage Housing */}
      <mesh position={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.85} wireframe />
      </mesh>
      {/* Glowing Core Bulb */}
      <mesh position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#e2e8f0" />
      </mesh>
      {/* Local Ambient Navigation Point Light */}
      <pointLight
        position={[0, 0, 0.3]}
        color="#cbd5e1"
        intensity={2.4}
        distance={9.5}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 5. Main Arena Component
// ---------------------------------------------------------------------------

export interface TheEndlessMazeArenaProps {
  layout?: MazeLayout
  examinedIds?: Set<string>
  isExitRevealed?: boolean
  isShifting?: boolean
  isEscaping?: boolean
}

/**
 * 3D Arena Component for Game 06: THE ENDLESS MAZE.
 * Procedurally constructs the stone and concrete labyrinth based on the MazeLayout grid,
 * placing deduplicated solid walls, floor and ceiling slabs, corridor sconces,
 * investigation objects, and entrance/exit portals.
 */
export const TheEndlessMazeArena: React.FC<TheEndlessMazeArenaProps> = ({
  layout: propLayout,
  examinedIds = new Set(),
  isExitRevealed = false,
  isShifting = false,
  isEscaping = false,
}) => {
  const maze = useMemo(() => propLayout || createInitialMazeLayout(), [propLayout])
  const clues = useMemo(() => getMazeClues(), [])

  const ambientRef = useRef<AmbientLight>(null)
  const dirLightRef = useRef<DirectionalLight>(null)

  // Atmospheric lighting modulation during labyrinth shifting
  useFrame(({ clock }, delta) => {
    if (!ambientRef.current || !dirLightRef.current) return

    if (isShifting) {
      // Subtle horror flicker during maze shift
      const t = clock.elapsedTime * 28
      const flickerNoise = 0.16 + 0.12 * Math.sin(t) + 0.08 * Math.cos(t * 1.6)
      ambientRef.current.intensity = Math.max(0.06, Math.min(0.35, flickerNoise))
      dirLightRef.current.intensity = Math.max(0.03, Math.min(0.18, flickerNoise * 0.5))
    } else {
      // Smooth return to default atmospheric illumination
      if (ambientRef.current.intensity < 0.78) {
        ambientRef.current.intensity = Math.min(0.8, ambientRef.current.intensity + delta * 2.5)
      } else {
        ambientRef.current.intensity = 0.8
      }
      if (dirLightRef.current.intensity < 0.38) {
        dirLightRef.current.intensity = Math.min(0.4, dirLightRef.current.intensity + delta * 1.5)
      } else {
        dirLightRef.current.intensity = 0.4
      }
    }
  })

  // Deduplicated wall segment generation
  const { vWalls, hWalls, traversableCells } = useMemo(() => {
    const vWallMap = new Map<string, { x: number; z: number }>()
    const hWallMap = new Map<string, { x: number; z: number }>()
    const activeCells: MazeCell[] = []

    for (const cell of Object.values(maze.cells)) {
      if (cell.connections.length === 0 && !cell.isExit && cell.type !== 'shifting_corridor') {
        continue
      }
      activeCells.push(cell)
      const { x, z, connections } = cell

      // West boundary (x - 1)
      if (!connections.includes('west')) {
        const key = `${x - 1},${z}`
        vWallMap.set(key, { x: x - 0.5, z })
      }
      // East boundary (x + 1)
      if (!connections.includes('east')) {
        const key = `${x},${z}`
        vWallMap.set(key, { x: x + 0.5, z })
      }
      // North boundary (z - 1)
      if (!connections.includes('north')) {
        const key = `${x},${z - 1}`
        hWallMap.set(key, { x, z: z - 0.5 })
      }
      // South boundary (z + 1)
      if (!connections.includes('south')) {
        const key = `${x},${z}`
        hWallMap.set(key, { x, z: z + 0.5 })
      }
    }

    return {
      vWalls: Array.from(vWallMap.values()),
      hWalls: Array.from(hWallMap.values()),
      traversableCells: activeCells,
    }
  }, [maze])

  // Key junction coordinates for sconce illumination
  const sconceCoords = useMemo(
    () => [
      { x: 3, z: 5, rot: 0 },
      { x: 3, z: 3, rot: 0 },
      { x: 1, z: 3, rot: 0 },
      { x: 5, z: 3, rot: 0 },
      { x: 3, z: 2, rot: 0 },
      { x: 3, z: 1, rot: 0 },
    ],
    []
  )

  const halfGridW = Math.floor(MAZE_GRID_WIDTH / 2)
  const halfGridD = Math.floor(MAZE_GRID_DEPTH / 2)

  return (
    <>
      {/* 1. Psychological Horror Atmosphere: Darkness, Cold Fog & Background */}
      <color attach="background" args={['#05080d']} />
      <fog attach="fog" args={['#05080d', 6, 26]} />

      {/* 2. Global Ambient & Directional Fill with Shift Flicker */}
      <ambientLight ref={ambientRef} color="#151d28" intensity={0.8} />
      <directionalLight ref={dirLightRef} position={[0, 4.0, 0]} color="#334155" intensity={0.4} />

      {/* 3. Floors and Ceilings for Each Traversable Cell */}
      {traversableCells.map((cell) => {
        const worldPos = gridToWorldPosition(cell)
        return (
          <group key={`cell-slab-${cell.x}-${cell.z}`} position={[worldPos[0], 0, worldPos[2]]}>
            {/* Concrete Floor Tile */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
              <meshStandardMaterial color="#12161f" roughness={0.88} metalness={0.2} />
            </mesh>

            {/* Floor Paver Accent Border Lines */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
              <ringGeometry args={[CELL_SIZE / 2 - 0.15, CELL_SIZE / 2 - 0.1, 4]} />
              <meshBasicMaterial color="#1e293b" transparent opacity={0.35} />
            </mesh>

            {/* Concrete Ceiling Tile */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, MAZE_WALL_HEIGHT, 0]} receiveShadow>
              <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
              <meshStandardMaterial color="#0a0e14" roughness={0.92} metalness={0.15} />
            </mesh>
          </group>
        )
      })}

      {/* 4. Deduplicated Vertical Walls (running North-South) */}
      {vWalls.map((wall, idx) => {
        const worldX = (wall.x - halfGridW) * CELL_SIZE
        const worldZ = (wall.z - halfGridD) * CELL_SIZE
        return (
          <mesh
            key={`v-wall-${idx}`}
            position={[worldX, MAZE_WALL_HEIGHT / 2, worldZ]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.3, MAZE_WALL_HEIGHT, CELL_SIZE + 0.3]} />
            <meshStandardMaterial color="#161c26" roughness={0.85} metalness={0.25} />
          </mesh>
        )
      })}

      {/* 5. Deduplicated Horizontal Walls (running East-West) */}
      {hWalls.map((wall, idx) => {
        const worldX = (wall.x - halfGridW) * CELL_SIZE
        const worldZ = (wall.z - halfGridD) * CELL_SIZE
        return (
          <mesh
            key={`h-wall-${idx}`}
            position={[worldX, MAZE_WALL_HEIGHT / 2, worldZ]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[CELL_SIZE + 0.3, MAZE_WALL_HEIGHT, 0.3]} />
            <meshStandardMaterial color="#161c26" roughness={0.85} metalness={0.25} />
          </mesh>
        )
      })}

      {/* 6. Corridor Wall Sconces at Key Junctions */}
      {sconceCoords.map((coord, idx) => {
        const worldPos = gridToWorldPosition(coord)
        return (
          <CorridorSconce
            key={`sconce-${idx}`}
            position={[worldPos[0], 2.4, worldPos[2] - CELL_SIZE / 2 + 0.2]}
          />
        )
      })}

      {/* 7. Four Investigation Clue Objects */}
      {clues.map((item) => {
        const isExamined = examinedIds.has(item.id)
        if (item.id === 'architect_journal') {
          return (
            <ArchitectJournalMesh
              key={item.id}
              item={item}
              isExamined={isExamined}
            />
          )
        }
        if (item.id === 'mirrored_compass') {
          return (
            <MirroredCompassMesh
              key={item.id}
              item={item}
              isExamined={isExamined}
            />
          )
        }
        if (item.id === 'scratched_tally') {
          return (
            <ScratchedTallyMesh
              key={item.id}
              item={item}
              isExamined={isExamined}
            />
          )
        }
        if (item.id === 'unwound_thread') {
          return (
            <UnwoundThreadMesh
              key={item.id}
              item={item}
              isExamined={isExamined}
            />
          )
        }
        return null
      })}

      {/* 8. Recognizable Entrance Airlock Area */}
      <EntranceAirlock />

      {/* 9. Sealed Exit Blast Door Chamber */}
      <ExitBlastDoor isUnlocked={isExitRevealed} isEscaping={isEscaping} />
    </>
  )
}
