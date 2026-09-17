import React from 'react'
import { Text } from '@react-three/drei'
import type { IdentityOption } from './roomOfNamesTypes'
import {
  ROOM02_WIDTH,
  ROOM02_HEIGHT,
  ROOM02_DEPTH,
} from './roomOfNamesTypes'
import { getIdentityOptions } from './roomOfNamesLogic'

interface StationProps {
  identity: IdentityOption
  isLightsOut?: boolean
}

/**
 * Individual identity station rendering the base pedestal, name plaque,
 * 3D Text label, and unique physical object representation.
 */
const IdentityStation: React.FC<StationProps> = ({ identity, isLightsOut = false }) => {
  const [x, , z] = identity.position

  return (
    <group position={[x, 0, z]}>
      {/* 1. Base Pedestal Stand */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.12, 0.9]} />
        <meshStandardMaterial color="#14171f" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.52, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.68, 0.8, 0.68]} />
        <meshStandardMaterial color="#1c202a" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.95, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.96, 0.08, 0.96]} />
        <meshStandardMaterial color="#262c3a" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* 2. Brass Name Plaque on Front of Pedestal */}
      <mesh position={[0, 0.78, 0.355]}>
        <boxGeometry args={[0.62, 0.16, 0.02]} />
        <meshStandardMaterial color="#423620" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Front Plaque Text */}
      <Text
        position={[0, 0.78, 0.37]}
        fontSize={0.09}
        color="#f5e6cc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.18}
      >
        {identity.name}
      </Text>

      {/* Floating 3D Name Label above station */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.22}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.22}
      >
        {identity.name}
      </Text>

      {/* 3. Object-Specific Visual Representations */}
      {identity.objectType === 'photograph' && (
        <group position={[0, 1.0, 0]}>
          {/* Framed Photo */}
          <mesh position={[0, 0.28, -0.05]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.48, 0.58, 0.04]} />
            <meshStandardMaterial color="#241912" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.28, -0.028]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.4, 0.5]} />
            <meshStandardMaterial color="#948e83" roughness={0.9} />
          </mesh>
          {/* Small candlelight */}
          <mesh position={[0.26, 0.08, 0.18]}>
            <cylinderGeometry args={[0.03, 0.03, 0.14, 12]} />
            <meshStandardMaterial color="#d4cbb8" />
          </mesh>
          <mesh position={[0.26, 0.18, 0.18]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ff9933" />
          </mesh>
          {!isLightsOut && (
            <pointLight position={[0.26, 0.28, 0.18]} color="#ffaa44" intensity={3.2} distance={4.5} decay={2} />
          )}
        </group>
      )}

      {identity.objectType === 'desk' && (
        <group position={[0, 1.0, 0]}>
          {/* Scattered Paper Letters */}
          <mesh position={[-0.14, 0.01, 0.06]} rotation={[-Math.PI / 2, 0, 0.25]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color="#cfc7b6" roughness={0.95} />
          </mesh>
          <mesh position={[0.1, 0.012, -0.08]} rotation={[-Math.PI / 2, 0, -0.15]}>
            <planeGeometry args={[0.28, 0.38]} />
            <meshStandardMaterial color="#b8b09e" roughness={0.95} />
          </mesh>
          {/* Ink Bottle & Fountain Pen */}
          <mesh position={[-0.28, 0.04, -0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
            <meshStandardMaterial color="#0c0e12" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Banker's Study Lamp */}
          <mesh position={[0.26, 0.15, -0.2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color="#3a301a" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0.26, 0.28, -0.2]}>
            <boxGeometry args={[0.22, 0.08, 0.12]} />
            <meshStandardMaterial color="#1a4224" roughness={0.3} />
          </mesh>
          {!isLightsOut && (
            <pointLight position={[0.26, 0.22, -0.12]} color="#66ff99" intensity={3.6} distance={5.0} decay={2} />
          )}
        </group>
      )}

      {identity.objectType === 'hospital_record' && (
        <group position={[0, 1.0, 0]}>
          {/* Medical Clipboard */}
          <mesh position={[0, 0.18, 0.02]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.44, 0.58, 0.03]} />
            <meshStandardMaterial color="#4a4237" roughness={0.8} />
          </mesh>
          {/* Paper Medical Chart */}
          <mesh position={[0, 0.182, 0.037]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.38, 0.5]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
          {/* Metal Clip */}
          <mesh position={[0, 0.44, -0.06]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.16, 0.06, 0.04]} />
            <meshStandardMaterial color="#8892b0" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Clinical Examination Light */}
          {!isLightsOut && (
            <pointLight position={[0, 0.6, 0.1]} color="#70d6ff" intensity={4.2} distance={5.5} decay={2} />
          )}
        </group>
      )}

      {identity.objectType === 'old_tape' && (
        <group position={[0, 1.0, 0]}>
          {/* Tape Recorder Machine */}
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.56, 0.2, 0.44]} />
            <meshStandardMaterial color="#181a20" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Twin Magnetic Reels */}
          <mesh position={[-0.14, 0.225, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 16]} />
            <meshStandardMaterial color="#383d4a" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0.14, 0.225, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 16]} />
            <meshStandardMaterial color="#383d4a" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Recording LED & Warm Static Glow */}
          <mesh position={[0, 0.16, 0.225]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color={isLightsOut ? '#220804' : '#ff3311'} />
          </mesh>
          {!isLightsOut && (
            <pointLight position={[0, 0.32, 0.1]} color="#ff7733" intensity={3.2} distance={4.5} decay={2} />
          )}
        </group>
      )}

      {identity.objectType === 'mirror' && (
        <group position={[0, 1.0, 0]}>
          {/* Antique Mirror Frame */}
          <mesh position={[0, 0.72, -0.05]} castShadow>
            <boxGeometry args={[0.72, 1.45, 0.06]} />
            <meshStandardMaterial color="#2d2922" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Dark Antique Reflective Mirror Surface */}
          <mesh position={[0, 0.72, -0.015]}>
            <planeGeometry args={[0.6, 1.32]} />
            <meshStandardMaterial color="#080b12" roughness={0.08} metalness={0.92} />
          </mesh>
          {/* Ghostly Indigo Ambient Light */}
          {!isLightsOut && (
            <pointLight position={[0, 0.8, 0.2]} color="#4d62ff" intensity={3.5} distance={5.0} decay={2} />
          )}
        </group>
      )}
    </group>
  )
}

export interface RoomOfNamesArenaProps {
  examinedCount?: number
  isTransitioning?: boolean
  isDecisionReady?: boolean
}

/**
 * Presentational 3D arena for Game 02: THE ROOM OF NAMES.
 * Adapts ambient lighting, fog, and light sources based on investigation progression.
 */
export const RoomOfNamesArena: React.FC<RoomOfNamesArenaProps> = ({
  examinedCount = 0,
  isTransitioning = false,
  isDecisionReady = false,
}) => {
  const identities = getIdentityOptions()

  const halfWidth = ROOM02_WIDTH / 2
  const halfHeight = ROOM02_HEIGHT / 2
  const halfDepth = ROOM02_DEPTH / 2

  const isLightsOut = isTransitioning || isDecisionReady

  // Gradual ambient atmosphere modulation based on unique examined count (0/5 -> 5/5)
  let ambientColor = '#181f2c'
  let ambientIntensity = 0.65
  let centralLightIntensity = 6.5

  if (isLightsOut) {
    ambientColor = '#060810'
    ambientIntensity = 0.22
    centralLightIntensity = 4.2
  } else if (examinedCount === 1) {
    ambientColor = '#151b27'
    ambientIntensity = 0.58
  } else if (examinedCount === 2) {
    ambientColor = '#131722'
    ambientIntensity = 0.50
    centralLightIntensity = 6.0
  } else if (examinedCount === 3) {
    ambientColor = '#0f131c'
    ambientIntensity = 0.42
  } else if (examinedCount === 4) {
    ambientColor = '#0c0f16'
    ambientIntensity = 0.35
  } else if (examinedCount >= 5) {
    ambientColor = '#090b12'
    ambientIntensity = 0.30
  }

  return (
    <>
      {/* Dark psychological atmosphere fog and backdrop */}
      <color attach="background" args={['#06080d']} />
      <fog attach="fog" args={['#06080d', isLightsOut ? 2 : 3, isLightsOut ? 14 : 17]} />

      {/* Atmospheric ambient light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />

      {/* Central ceiling hanging light fixture */}
      <group position={[0, ROOM02_HEIGHT, 0]}>
        {/* Hanging wire cord */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
          <meshBasicMaterial color="#111318" />
        </mesh>
        {/* Metal Lantern Cage */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.35, 12]} />
          <meshStandardMaterial color="#1b1e26" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Central warm-dim omni light */}
        <pointLight
          position={[0, -0.9, 0]}
          color="#f0e2cc"
          intensity={centralLightIntensity}
          distance={isLightsOut ? 11 : 16}
          decay={2}
        />
      </group>

      {/* 1. Arena Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM02_WIDTH, ROOM02_DEPTH]} />
        <meshStandardMaterial
          color="#161a22"
          roughness={0.85}
          metalness={0.12}
        />
      </mesh>

      {/* Memory Spawn Threshold Ring on Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 4.5]}
        receiveShadow
      >
        <ringGeometry args={[0.7, 0.78, 32]} />
        <meshBasicMaterial color="#2d3748" transparent opacity={0.4} />
      </mesh>

      {/* 2. Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ROOM02_HEIGHT, 0]}
        receiveShadow
      >
        <planeGeometry args={[ROOM02_WIDTH, ROOM02_DEPTH]} />
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
        <planeGeometry args={[ROOM02_WIDTH, ROOM02_HEIGHT]} />
        <meshStandardMaterial
          color="#1b202c"
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
        <planeGeometry args={[ROOM02_WIDTH, ROOM02_HEIGHT]} />
        <meshStandardMaterial
          color="#1b202c"
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
        <planeGeometry args={[ROOM02_DEPTH, ROOM02_HEIGHT]} />
        <meshStandardMaterial
          color="#1b202c"
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
        <planeGeometry args={[ROOM02_DEPTH, ROOM02_HEIGHT]} />
        <meshStandardMaterial
          color="#1b202c"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 7. Wainscoting / Skirting Trim around Floor */}
      <mesh position={[0, 0.15, -halfDepth + 0.05]}>
        <boxGeometry args={[ROOM02_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#101218" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, halfDepth - 0.05]}>
        <boxGeometry args={[ROOM02_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#101218" roughness={0.7} />
      </mesh>
      <mesh position={[halfWidth - 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM02_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#101218" roughness={0.7} />
      </mesh>
      <mesh position={[-halfWidth + 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM02_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#101218" roughness={0.7} />
      </mesh>

      {/* 8. Render All 5 Identity Stations */}
      {identities.map((identity) => (
        <IdentityStation
          key={identity.id}
          identity={identity}
          isLightsOut={isLightsOut}
        />
      ))}
    </>
  )
}
