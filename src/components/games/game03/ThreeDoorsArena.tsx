import React from 'react'
import { Text } from '@react-three/drei'
import type { DoorOption, InvestigationObject } from './threeDoorsTypes'
import {
  ROOM03_WIDTH,
  ROOM03_HEIGHT,
  ROOM03_DEPTH,
} from './threeDoorsTypes'
import {
  getDoors,
  getInvestigationObjects,
  getCentralInscription,
} from './threeDoorsLogic'

interface DoorMeshProps {
  door: DoorOption
}

/**
 * Renders an individual door with its architectural frame, physical panel,
 * plaque title, statement inscription, and ambient lighting fixture.
 */
const DoorMesh: React.FC<DoorMeshProps> = ({ door }) => {
  const [x, , z] = door.position

  const isSafe = door.id === 'safe'
  const isHonest = door.id === 'honest'
  const isQuiet = door.id === 'quiet'

  return (
    <group position={[x, 0, z]}>
      {/* 1. Substantial Outer Door Arch & Frame */}
      {/* Left Column */}
      <mesh position={[-1.05, 1.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 3.1, 0.35]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Right Column */}
      <mesh position={[1.05, 1.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 3.1, 0.35]} />
        <meshStandardMaterial color="#1a1d24" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Top Header Architrave */}
      <mesh position={[0, 3.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.35, 0.4]} />
        <meshStandardMaterial color="#1e222b" roughness={0.8} metalness={0.25} />
      </mesh>
      {/* Threshold Step */}
      <mesh position={[0, 0.05, 0.08]} receiveShadow>
        <boxGeometry args={[2.3, 0.1, 0.4]} />
        <meshStandardMaterial color="#14161d" roughness={0.9} />
      </mesh>

      {/* 2. Main Door Slab */}
      <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.8, 2.9, 0.12]} />
        {isSafe && (
          <meshStandardMaterial
            color="#222730"
            roughness={0.7}
            metalness={0.55}
          />
        )}
        {isHonest && (
          <meshStandardMaterial
            color="#28221c"
            roughness={0.8}
            metalness={0.15}
          />
        )}
        {isQuiet && (
          <meshStandardMaterial
            color="#14171d"
            roughness={0.9}
            metalness={0.1}
          />
        )}
      </mesh>

      {/* Safe Door Details: Iron Rivets & Reinforced Cross Bars */}
      {isSafe && (
        <group position={[0, 1.5, 0.07]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.65, 0.1, 0.03]} />
            <meshStandardMaterial color="#16181f" roughness={0.5} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[1.65, 0.1, 0.03]} />
            <meshStandardMaterial color="#16181f" roughness={0.5} metalness={0.7} />
          </mesh>
          <mesh position={[0.65, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
            <meshStandardMaterial color="#3a3e4a" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* Honest Door Details: Wood Inlay Paneling & Bronze Pull */}
      {isHonest && (
        <group position={[0, 1.5, 0.07]}>
          <mesh position={[-0.4, 0.5, 0]}>
            <boxGeometry args={[0.65, 0.95, 0.02]} />
            <meshStandardMaterial color="#1d1915" roughness={0.85} />
          </mesh>
          <mesh position={[0.4, 0.5, 0]}>
            <boxGeometry args={[0.65, 0.95, 0.02]} />
            <meshStandardMaterial color="#1d1915" roughness={0.85} />
          </mesh>
          <mesh position={[-0.4, -0.6, 0]}>
            <boxGeometry args={[0.65, 0.95, 0.02]} />
            <meshStandardMaterial color="#1d1915" roughness={0.85} />
          </mesh>
          <mesh position={[0.4, -0.6, 0]}>
            <boxGeometry args={[0.65, 0.95, 0.02]} />
            <meshStandardMaterial color="#1d1915" roughness={0.85} />
          </mesh>
          <mesh position={[0.65, 0, 0]}>
            <boxGeometry args={[0.06, 0.22, 0.04]} />
            <meshStandardMaterial color="#594628" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* Quiet Door Details: Obsidian Slab, Recessed Flush Seam */}
      {isQuiet && (
        <group position={[0, 1.5, 0.07]}>
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[1.72, 2.82, 0.01]} />
            <meshStandardMaterial color="#0b0d11" roughness={0.95} metalness={0.05} />
          </mesh>
          <mesh position={[0.65, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
            <meshStandardMaterial color="#1d212a" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* 3. Top Door Plaque (DOOR I, II, III & Name) */}
      <mesh position={[0, 3.15, 0.21]}>
        <boxGeometry args={[1.9, 0.24, 0.02]} />
        <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.6} />
      </mesh>

      <Text
        position={[0, 3.22, 0.23]}
        fontSize={0.09}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {door.doorNumber}
      </Text>

      <Text
        position={[0, 3.1, 0.23]}
        fontSize={0.075}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.16}
      >
        {door.name}
      </Text>

      {/* 4. Physical Inscription Plate below door handle/eye-level */}
      <mesh position={[0, 1.85, 0.08]}>
        <boxGeometry args={[1.5, 0.28, 0.015]} />
        <meshStandardMaterial color="#0d0f14" roughness={0.7} metalness={0.3} />
      </mesh>

      <Text
        position={[0, 1.85, 0.095]}
        fontSize={0.075}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        maxWidth={1.4}
      >
        {door.statement}
      </Text>

      {/* 5. Overhead Sconce Fixture & Subtle Localized Light */}
      <mesh position={[0, 3.48, 0.22]}>
        <boxGeometry args={[0.2, 0.12, 0.16]} />
        <meshStandardMaterial color="#1b1e26" roughness={0.5} metalness={0.7} />
      </mesh>

      {isSafe && (
        <pointLight
          position={[0, 3.35, 0.45]}
          color="#f6d365"
          intensity={2.8}
          distance={5.0}
          decay={2}
        />
      )}
      {isHonest && (
        <pointLight
          position={[0, 3.35, 0.45]}
          color="#d4e4fc"
          intensity={3.0}
          distance={5.0}
          decay={2}
        />
      )}
      {isQuiet && (
        <pointLight
          position={[0, 3.35, 0.45]}
          color="#c2c9d6"
          intensity={2.6}
          distance={4.8}
          decay={2}
        />
      )}
    </group>
  )
}

interface InvestigationMeshProps {
  item: InvestigationObject
}

/**
 * Renders physical representations of the chamber investigation items:
 * - Broken Key on pedestal
 * - Prisoner's Note on reading stand
 * - Black Mirror in standing frame
 */
const InvestigationObjectMesh: React.FC<InvestigationMeshProps> = ({ item }) => {
  const [x, , z] = item.position

  return (
    <group position={[x, 0, z]}>
      {/* 1. Base Stand / Plinth */}
      <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.7, 0.9, 0.7]} />
        <meshStandardMaterial color="#161922" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.92, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.82, 0.06, 0.82]} />
        <meshStandardMaterial color="#212632" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Plaque on front */}
      <mesh position={[0, 0.75, 0.36]}>
        <boxGeometry args={[0.55, 0.14, 0.02]} />
        <meshStandardMaterial color="#2a2e3a" roughness={0.5} metalness={0.6} />
      </mesh>
      <Text
        position={[0, 0.75, 0.375]}
        fontSize={0.065}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {item.name}
      </Text>

      {/* 2. Physical Item Representation */}
      {item.id === 'broken_key' && (
        <group position={[0, 0.96, 0]}>
          {/* Key Bow & Fractured Shank */}
          <mesh position={[-0.08, 0.015, 0]} rotation={[0, 0.3, 0]}>
            <torusGeometry args={[0.06, 0.016, 8, 16]} />
            <meshStandardMaterial color="#4a4237" roughness={0.4} metalness={0.85} />
          </mesh>
          <mesh position={[0.02, 0.015, 0]} rotation={[0, 0.3, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.12, 8]} />
            <meshStandardMaterial color="#4a4237" roughness={0.4} metalness={0.85} />
          </mesh>
          {/* Fractured Key Bit */}
          <mesh position={[0.14, 0.015, 0.04]} rotation={[0, -0.4, Math.PI / 2]}>
            <cylinderGeometry args={[0.014, 0.014, 0.09, 8]} />
            <meshStandardMaterial color="#4a4237" roughness={0.4} metalness={0.85} />
          </mesh>
          {/* Localized dim light */}
          <pointLight position={[0, 0.35, 0]} color="#f0e2cc" intensity={2.0} distance={3.5} decay={2} />
        </group>
      )}

      {item.id === 'prisoner_note' && (
        <group position={[0, 0.96, 0]}>
          {/* Worn Angled Parchment Note */}
          <mesh position={[0, 0.06, 0]} rotation={[-0.35, 0.15, 0]} castShadow>
            <planeGeometry args={[0.38, 0.48]} />
            <meshStandardMaterial color="#d8d0be" roughness={0.95} />
          </mesh>
          {/* Faint Ink Lines Textures */}
          <mesh position={[0, 0.062, 0]} rotation={[-0.35, 0.15, 0]}>
            <planeGeometry args={[0.32, 0.4]} />
            <meshStandardMaterial color="#9c9586" roughness={0.99} />
          </mesh>
          {/* Localized cold light */}
          <pointLight position={[0, 0.4, 0]} color="#d6e4f0" intensity={2.2} distance={3.5} decay={2} />
        </group>
      )}

      {item.id === 'black_mirror' && (
        <group position={[0, 0.96, 0]}>
          {/* Antique Standing Mirror Frame */}
          <mesh position={[0, 0.52, 0]} castShadow>
            <boxGeometry args={[0.62, 1.05, 0.06]} />
            <meshStandardMaterial color="#201c18" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Dark Glass Reflective Mirror Plate */}
          <mesh position={[0, 0.52, 0.035]}>
            <planeGeometry args={[0.5, 0.92]} />
            <meshStandardMaterial color="#060910" roughness={0.06} metalness={0.95} />
          </mesh>
          {/* Ghostly cold indigo light */}
          <pointLight position={[0, 0.6, 0.2]} color="#6366f1" intensity={2.4} distance={4.0} decay={2} />
        </group>
      )}
    </group>
  )
}

/**
 * Central chamber stone plinth holding the visible main inscription and
 * hidden rear inscription.
 */
const CentralPedestal: React.FC = () => {
  const centralInscription = getCentralInscription()

  return (
    <group position={[0, 0, -1.0]}>
      {/* Stepped Pedestal Base */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.3, 0.16, 1.3]} />
        <meshStandardMaterial color="#13161e" roughness={0.88} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.65, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
        <meshStandardMaterial color="#1b1e27" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.18, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.15, 0.08, 1.15]} />
        <meshStandardMaterial color="#262a36" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Front Face Inscription (Visible from spawn facing North) */}
      <Text
        position={[0, 0.78, 0.51]}
        fontSize={0.095}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.22}
      >
        THREE DOORS.
      </Text>
      <Text
        position={[0, 0.62, 0.51]}
        fontSize={0.08}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
      >
        ONE TRUTH.
      </Text>

      {/* Hidden Rear Inscription (Facing South, behind the pedestal) */}
      <group position={[0, 0.65, -0.51]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[0.9, 0.35, 0.01]} />
          <meshStandardMaterial color="#0e1017" roughness={0.9} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.065}
          color="#708090"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          maxWidth={0.85}
        >
          {centralInscription.text}
        </Text>
      </group>
    </group>
  )
}

/**
 * Presentational 3D arena for Game 03: THREE DOORS.
 * Renders the enclosed chamber, 3 distinct doors, 3 investigation objects,
 * central plinth with visible and hidden inscriptions, and moody lighting.
 */
export const ThreeDoorsArena: React.FC = () => {
  const doors = getDoors()
  const items = getInvestigationObjects()

  const halfWidth = ROOM03_WIDTH / 2
  const halfHeight = ROOM03_HEIGHT / 2
  const halfDepth = ROOM03_DEPTH / 2

  return (
    <>
      {/* Dark psychological atmosphere fog and backdrop */}
      <color attach="background" args={['#06080d']} />
      <fog attach="fog" args={['#06080d', 3, 17]} />

      {/* Ambient Room Lighting */}
      <ambientLight color="#151922" intensity={0.55} />

      {/* Central ceiling hanging light fixture */}
      <group position={[0, ROOM03_HEIGHT, 0]}>
        {/* Hanging cord */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
          <meshBasicMaterial color="#111318" />
        </mesh>
        {/* Metal Cage */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.35, 12]} />
          <meshStandardMaterial color="#1b1e26" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Central warm-dim omni light */}
        <pointLight
          position={[0, -0.9, 0]}
          color="#f0e2cc"
          intensity={5.8}
          distance={16}
          decay={2}
        />
      </group>

      {/* 1. Chamber Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_WIDTH, ROOM03_DEPTH]} />
        <meshStandardMaterial
          color="#141720"
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>

      {/* Spawn Threshold Ring on Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 5.0]}
        receiveShadow
      >
        <ringGeometry args={[0.7, 0.78, 32]} />
        <meshBasicMaterial color="#2d3748" transparent opacity={0.35} />
      </mesh>

      {/* 2. Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ROOM03_HEIGHT, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_WIDTH, ROOM03_DEPTH]} />
        <meshStandardMaterial
          color="#0e1017"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* 3. North Wall */}
      <mesh
        position={[0, halfHeight, -halfDepth]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_WIDTH, ROOM03_HEIGHT]} />
        <meshStandardMaterial
          color="#191d28"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 4. South Wall */}
      <mesh
        position={[0, halfHeight, halfDepth]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_WIDTH, ROOM03_HEIGHT]} />
        <meshStandardMaterial
          color="#191d28"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 5. East Wall */}
      <mesh
        position={[halfWidth, halfHeight, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_DEPTH, ROOM03_HEIGHT]} />
        <meshStandardMaterial
          color="#191d28"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 6. West Wall */}
      <mesh
        position={[-halfWidth, halfHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM03_DEPTH, ROOM03_HEIGHT]} />
        <meshStandardMaterial
          color="#191d28"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 7. Base Skirting Trim */}
      <mesh position={[0, 0.15, -halfDepth + 0.05]}>
        <boxGeometry args={[ROOM03_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0f1117" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, halfDepth - 0.05]}>
        <boxGeometry args={[ROOM03_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0f1117" roughness={0.7} />
      </mesh>
      <mesh position={[halfWidth - 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM03_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0f1117" roughness={0.7} />
      </mesh>
      <mesh position={[-halfWidth + 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM03_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0f1117" roughness={0.7} />
      </mesh>

      {/* 8. The Three Doors */}
      {doors.map((door) => (
        <DoorMesh key={door.id} door={door} />
      ))}

      {/* 9. The Three Investigation Objects */}
      {items.map((item) =>
        item.id !== 'hidden_inscription' ? (
          <InvestigationObjectMesh key={item.id} item={item} />
        ) : null
      )}

      {/* 10. Central Pedestal & Inscriptions */}
      <CentralPedestal />
    </>
  )
}
