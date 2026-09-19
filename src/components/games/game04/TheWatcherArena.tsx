import React, { useRef } from 'react'
import { Text } from '@react-three/drei'
import { SpotLight } from 'three'
import type { WatcherInvestigationObject } from './theWatcherTypes'
import {
  ROOM04_WIDTH,
  ROOM04_HEIGHT,
  ROOM04_DEPTH,
  EXIT_POSITION,
  WATCHER_POSITION,
} from './theWatcherTypes'
import { getWatcherObjects } from './theWatcherLogic'

/**
 * 1. Base Stand for Investigation Artifacts
 */
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
        <boxGeometry args={[0.95, 0.1, 0.95]} />
        <meshStandardMaterial color="#0f131a" roughness={0.9} metalness={0.25} />
      </mesh>
      {/* Central Column */}
      <mesh position={[0, 0.48, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.55, 0.76, 0.55]} />
        <meshStandardMaterial color="#161b26" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Top Tabletop Surface */}
      <mesh position={[0, 0.88, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.88, 0.06, 0.88]} />
        <meshStandardMaterial color="#1f2636" roughness={0.75} metalness={0.35} />
      </mesh>
      {/* Ambient Floor Ring Accent */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.8, 24]} />
        <meshBasicMaterial
          color={isExamined ? '#38bdf8' : '#334155'}
          transparent
          opacity={isExamined ? 0.45 : 0.2}
        />
      </mesh>
      {children}
    </group>
  )
}

/**
 * 2. OBJECT 1: Torn Photograph Representation
 */
const TornPhotographMesh: React.FC<{
  item: WatcherInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.position} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      {/* Frame Stand Angle Bracket */}
      <group position={[0, 0.91, 0]}>
        {/* Damaged Wooden Frame */}
        <mesh position={[0, 0.28, -0.04]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[0.54, 0.64, 0.04]} />
          <meshStandardMaterial color="#1a1410" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Left Half of Torn Photograph */}
        <mesh position={[-0.08, 0.28, -0.015]} rotation={[-0.22, 0, -0.04]}>
          <planeGeometry args={[0.22, 0.52]} />
          <meshStandardMaterial color="#8c857b" roughness={0.9} />
        </mesh>
        {/* Right Half (Jagged / Offset Tear) */}
        <mesh position={[0.11, 0.25, -0.016]} rotation={[-0.22, 0, 0.08]}>
          <planeGeometry args={[0.18, 0.44]} />
          <meshStandardMaterial color="#7a7369" roughness={0.9} />
        </mesh>
        {/* Shadowed Tear Gap Inset */}
        <mesh position={[0.01, 0.27, -0.02]} rotation={[-0.22, 0, 0]}>
          <planeGeometry args={[0.06, 0.5]} />
          <meshStandardMaterial color="#12100e" roughness={0.95} />
        </mesh>

        {/* Focused Dim Spotlight on Photo */}
        <pointLight position={[0, 0.6, 0.4]} color="#ffe4c4" intensity={1.8} distance={3.5} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 3. OBJECT 2: Warning Note Representation
 */
const WarningNoteMesh: React.FC<{
  item: WatcherInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.position} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Metal Clipboard Base */}
        <mesh position={[0, 0.02, 0]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.62, 0.025]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Aged Paper Sheet */}
        <mesh position={[0, 0.038, 0]} rotation={[-0.15, 0, 0.02]}>
          <planeGeometry args={[0.42, 0.54]} />
          <meshStandardMaterial color="#d4c7a3" roughness={0.88} />
        </mesh>
        {/* Curled Top Corner */}
        <mesh position={[0.16, 0.28, 0.02]} rotation={[-0.1, 0.2, 0.4]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshStandardMaterial color="#c0b38e" roughness={0.9} />
        </mesh>
        {/* Dark Ink / Smudge Accents */}
        <mesh position={[-0.04, 0.04, 0.04]} rotation={[-0.15, 0, 0]}>
          <planeGeometry args={[0.3, 0.32]} />
          <meshStandardMaterial color="#4a4233" roughness={0.95} transparent opacity={0.65} />
        </mesh>
        {/* Steel Clip Header */}
        <mesh position={[0, 0.3, -0.03]} rotation={[-0.15, 0, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.05]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Soft Focused Warm Light */}
        <pointLight position={[0, 0.6, 0.35]} color="#fef08a" intensity={1.5} distance={3.2} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 4. OBJECT 3: Security Monitor Representation
 */
const SecurityMonitorMesh: React.FC<{
  item: WatcherInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.position} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* CRT Housing Box */}
        <mesh position={[0, 0.28, -0.05]} castShadow>
          <boxGeometry args={[0.68, 0.52, 0.48]} />
          <meshStandardMaterial color="#1e2330" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Front Bezel */}
        <mesh position={[0, 0.28, 0.195]} castShadow>
          <boxGeometry args={[0.62, 0.46, 0.04]} />
          <meshStandardMaterial color="#151922" roughness={0.8} metalness={0.25} />
        </mesh>
        {/* Dark CRT Screen Display */}
        <mesh position={[0, 0.28, 0.22]}>
          <planeGeometry args={[0.5, 0.36]} />
          <meshStandardMaterial
            color="#0d1b1e"
            emissive="#0a2a2c"
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        {/* Faint Scanline Grid Overlay */}
        <mesh position={[0, 0.28, 0.222]}>
          <planeGeometry args={[0.49, 0.35]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.12} wireframe />
        </mesh>
        {/* Power LED Indicator */}
        <mesh position={[0.24, 0.1, 0.22]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        {/* Coiled Power Cables */}
        <mesh position={[-0.2, 0.05, -0.28]} rotation={[0.4, 0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color="#0b0d12" roughness={0.9} />
        </mesh>

        {/* Cold Phosphor Monitor Glow */}
        <pointLight position={[0, 0.32, 0.4]} color="#2dd4bf" intensity={1.6} distance={3.8} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 5. OBJECT 4: Observation Window Representation
 */
const ObservationWindowMesh: React.FC<{
  item: WatcherInvestigationObject
  isExamined?: boolean
}> = ({ item, isExamined = false }) => {
  return (
    <ArtifactStand position={item.position} isExamined={isExamined}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.85, 0]}
        fontSize={0.15}
        color={isExamined ? '#7dd3fc' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Heavy Steel Window Pane Frame */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.74, 0.76, 0.08]} />
          <meshStandardMaterial color="#171b24" roughness={0.8} metalness={0.5} />
        </mesh>
        {/* Inner Cutout Frame Border */}
        <mesh position={[0, 0.38, 0.045]}>
          <boxGeometry args={[0.66, 0.68, 0.02]} />
          <meshStandardMaterial color="#0f1219" roughness={0.9} metalness={0.3} />
        </mesh>
        {/* Dark Tinted One-Way Observation Glass */}
        <mesh position={[0, 0.38, 0.05]}>
          <planeGeometry args={[0.58, 0.6]} />
          <meshStandardMaterial
            color="#080c14"
            emissive="#0b1626"
            emissiveIntensity={0.3}
            roughness={0.15}
            metalness={0.85}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Specular Highlight Ring */}
        <mesh position={[0, 0.38, 0.052]}>
          <ringGeometry args={[0.22, 0.24, 24]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
        </mesh>

        {/* Cold Ambient Window Glow */}
        <pointLight position={[0, 0.45, 0.35]} color="#38bdf8" intensity={1.5} distance={3.5} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 6. Architectural Watcher Observation Gallery / Shadowed Presence
 * Positioned at WATCHER_POSITION without explicit monster mesh or gore.
 */
const WatcherAlcoveMesh: React.FC<{ isAlert?: boolean }> = ({ isAlert = false }) => {
  const [wx, wy, wz] = WATCHER_POSITION

  return (
    <group position={[wx, 0, wz]}>
      {/* Recessed Observation Gallery Box */}
      <mesh position={[0, wy, -0.6]} receiveShadow>
        <boxGeometry args={[4.6, 3.4, 1.5]} />
        <meshStandardMaterial color="#040608" roughness={0.98} metalness={0.05} />
      </mesh>

      {/* Dark Outer Frame Header & Pillars */}
      <mesh position={[-2.35, wy, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.35, 3.6, 0.45]} />
        <meshStandardMaterial color="#0e121a" roughness={0.85} metalness={0.35} />
      </mesh>
      <mesh position={[2.35, wy, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.35, 3.6, 0.45]} />
        <meshStandardMaterial color="#0e121a" roughness={0.85} metalness={0.35} />
      </mesh>
      <mesh position={[0, wy + 1.7, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.0, 0.35, 0.5]} />
        <meshStandardMaterial color="#121622" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Vertical Surveillance Louvers / Slits */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((lx, i) => (
        <mesh key={i} position={[lx, wy, -0.08]} castShadow>
          <boxGeometry args={[0.08, 3.0, 0.18]} />
          <meshStandardMaterial color="#090b10" roughness={0.9} metalness={0.7} />
        </mesh>
      ))}

      {/* Tinted Surveillance Glass Sheet Behind Louvers */}
      <mesh position={[0, wy, -0.2]}>
        <planeGeometry args={[4.4, 3.0]} />
        <meshStandardMaterial
          color="#060910"
          emissive="#08101a"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Ceiling Surveillance Camera Housing */}
      <group position={[0, wy + 1.4, -0.3]}>
        <mesh position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.35]} />
          <meshStandardMaterial color="#1e2430" roughness={0.6} metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.04, 0.15]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#0a0e14" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Surveillance Status Optical Indicator */}
        <mesh position={[0.07, 0.02, 0.18]}>
          <sphereGeometry args={[0.015, 12, 12]} />
          <meshBasicMaterial color={isAlert ? '#ef4444' : '#64748b'} />
        </mesh>
      </group>

      {/* Shadowed Architectural Silhouette Implying an Unseen Presence */}
      <mesh position={[0, wy - 0.2, -0.65]} receiveShadow>
        <cylinderGeometry args={[0.38, 0.54, 2.2, 16]} />
        <meshStandardMaterial color="#020305" roughness={1.0} metalness={0.0} />
      </mesh>
      <mesh position={[0, wy + 1.0, -0.65]} receiveShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#020305" roughness={1.0} metalness={0.0} />
      </mesh>

      {/* Overhead Cable Bundles */}
      <mesh position={[-1.2, wy + 1.7, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.9} />
      </mesh>
      <mesh position={[1.2, wy + 1.7, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.9} />
      </mesh>

      {/* Ambient Void Light Dropoff / Alert Observation Flare */}
      <pointLight
        position={[0, wy + 0.8, -0.2]}
        color={isAlert ? '#f8fafc' : '#0f172a'}
        intensity={isAlert ? 2.6 : 0.35}
        distance={isAlert ? 7.5 : 3.0}
        decay={2}
      />
    </group>
  )
}

/**
 * 7. Heavy Industrial Exit Door with Dramatic Unlocking Visuals
 * Positioned at EXIT_POSITION.
 */
const ExitDoorMesh: React.FC<{
  isExitUnlocked?: boolean
  revealPhase?: number
}> = ({ isExitUnlocked = false, revealPhase = 0 }) => {
  const [ex, , ez] = EXIT_POSITION
  const isUnlockedVisual = isExitUnlocked || revealPhase >= 3
  const isFlarActive = revealPhase === 3 || revealPhase === 4 || isExitUnlocked
  const spotRef = useRef<SpotLight>(null)

  return (
    <group position={[ex, 0, ez]}>
      {/* Heavy Outer Door Frame Pillars */}
      <mesh position={[-1.25, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.35, 3.2, 0.4]} />
        <meshStandardMaterial color="#1a202c" roughness={0.85} metalness={0.4} />
      </mesh>
      <mesh position={[1.25, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.35, 3.2, 0.4]} />
        <meshStandardMaterial color="#1a202c" roughness={0.85} metalness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.85, 0.35, 0.45]} />
        <meshStandardMaterial color="#1f2736" roughness={0.8} metalness={0.45} />
      </mesh>

      {/* Main Steel Double-Panel Blast Door */}
      <mesh position={[-0.52, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.02, 2.9, 0.14]} />
        <meshStandardMaterial color="#111622" roughness={0.7} metalness={0.65} />
      </mesh>
      <mesh position={[0.52, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.02, 2.9, 0.14]} />
        <meshStandardMaterial color="#111622" roughness={0.7} metalness={0.65} />
      </mesh>

      {/* Vertical Central Door Seam */}
      <mesh position={[0, 1.5, 0.08]}>
        <boxGeometry args={[0.04, 2.85, 0.04]} />
        <meshStandardMaterial
          color={isUnlockedVisual ? '#38bdf8' : '#0a0d14'}
          emissive={isUnlockedVisual ? '#38bdf8' : '#000000'}
          emissiveIntensity={isUnlockedVisual ? 0.8 : 0}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Heavy Hydraulic Locking Pistons */}
      <mesh position={[-0.85, 1.5, 0.09]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
        <meshStandardMaterial
          color={isUnlockedVisual ? '#22c55e' : '#475569'}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0.85, 1.5, 0.09]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
        <meshStandardMaterial
          color={isUnlockedVisual ? '#22c55e' : '#475569'}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Diagonal Industrial Hazard Stripes & Crossbars */}
      <mesh position={[0, 2.2, 0.075]}>
        <boxGeometry args={[2.05, 0.14, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.75, 0.075]}>
        <boxGeometry args={[2.05, 0.14, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Illuminated Perimeter Door Light Strip (Lights up when Unlocked) */}
      {isUnlockedVisual && (
        <>
          <mesh position={[-1.05, 1.5, 0.08]}>
            <boxGeometry args={[0.03, 2.9, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[1.05, 1.5, 0.08]}>
            <boxGeometry args={[0.03, 2.9, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, 2.95, 0.08]}>
            <boxGeometry args={[2.1, 0.03, 0.02]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </>
      )}

      {/* Prominent High-Contrast EXIT Plaque */}
      <group position={[0, 3.55, 0.15]}>
        {/* Housing Base */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.0, 0.32, 0.08]} />
          <meshStandardMaterial color="#0a0f1d" roughness={0.7} metalness={0.5} />
        </mesh>
        {/* Outer Frame Accent */}
        <mesh position={[0, 0, 0.042]}>
          <boxGeometry args={[0.96, 0.28, 0.01]} />
          <meshBasicMaterial color={isUnlockedVisual ? '#38bdf8' : '#ef4444'} transparent opacity={0.3} />
        </mesh>
        {/* 3D Readable EXIT Text */}
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.15}
          color={isUnlockedVisual ? '#ffffff' : '#f87171'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          {isUnlockedVisual ? 'EXIT' : 'LOCKED'}
        </Text>
        {/* Local Sign Backlight */}
        <pointLight
          position={[0, 0, 0.25]}
          color={isUnlockedVisual ? '#38bdf8' : '#ef4444'}
          intensity={isUnlockedVisual ? 2.5 : 0.8}
          distance={3.5}
          decay={2}
        />
      </group>

      {/* Status Beacon Indicators */}
      <mesh position={[-1.25, 3.2, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color={isUnlockedVisual ? '#22c55e' : '#ef4444'} />
      </mesh>
      <mesh position={[1.25, 3.2, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color={isUnlockedVisual ? '#22c55e' : '#ef4444'} />
      </mesh>

      {/* High-Intensity Dramatic Exit Flare Spotlight (Phase 3+ & Unlocked) */}
      {isFlarActive && (
        <>
          <spotLight
            ref={spotRef}
            position={[0, 4.0, 1.8]}
            target-position={[ex, 0.5, ez]}
            color="#e0f2fe"
            intensity={6.0}
            distance={10.0}
            angle={0.65}
            penumbra={0.4}
            decay={1.8}
          />
          {/* Luminous Floor Guidance Spill */}
          <mesh position={[0, 0.02, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.8, 2.5]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.28} />
          </mesh>
          <mesh position={[0, 0.025, 2.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 1.8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
          </mesh>
        </>
      )}
    </group>
  )
}

export interface TheWatcherArenaProps {
  isAlert?: boolean
  isExitUnlocked?: boolean
  revealPhase?: number
  examinedIds?: Set<string>
}

/**
 * Top-Level 3D Arena Component for Game 04: THE WATCHER.
 * Fully enclosed room geometry, atmospheric lighting, spatial layout, and dramatic exit unlock reaction.
 */
export const TheWatcherArena: React.FC<TheWatcherArenaProps> = ({
  isAlert = false,
  isExitUnlocked = false,
  revealPhase = 0,
  examinedIds = new Set(),
}) => {
  const items = getWatcherObjects()

  const halfWidth = ROOM04_WIDTH / 2
  const halfHeight = ROOM04_HEIGHT / 2
  const halfDepth = ROOM04_DEPTH / 2

  // Lighting calculations based on blackout phase
  const isBlackout = revealPhase === 2
  const isSilence = revealPhase === 1

  const ambientIntensity = isBlackout ? 0.04 : isSilence ? 0.2 : isAlert ? 0.15 : 0.45
  const overheadIntensity = isBlackout ? 0.1 : isSilence ? 0.7 : isAlert ? 0.4 : 1.8

  return (
    <>
      {/* 1. Psychological Horror Atmosphere & Distance Fog */}
      <color attach="background" args={['#05070b']} />
      <fog attach="fog" args={['#05070b', 3, isBlackout ? 8 : 18]} />

      {/* 2. Controlled Atmospheric Lighting */}
      <ambientLight color="#0c121d" intensity={ambientIntensity} />
      <directionalLight position={[0, 3.8, 2]} color="#1e293b" intensity={isBlackout ? 0.05 : isAlert ? 0.1 : 0.35} />

      {/* Overhead Dim Cold Downlights */}
      <pointLight position={[0, 3.8, 4.0]} color="#334155" intensity={overheadIntensity} distance={8.0} decay={2} />
      <pointLight position={[0, 3.8, -1.0]} color="#1e293b" intensity={overheadIntensity * 0.8} distance={8.0} decay={2} />

      {/* 3. Fully Enclosed Room Chamber */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM04_WIDTH, ROOM04_DEPTH]} />
        <meshStandardMaterial color="#0d1118" roughness={0.88} metalness={0.2} />
      </mesh>

      {/* Floor Grid Seams & Directional Guidance Lines */}
      {[-6, -3, 0, 3, 6].map((gx, i) => (
        <mesh key={`grid-x-${i}`} position={[gx, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, ROOM04_DEPTH]} />
          <meshBasicMaterial
            color={isExitUnlocked && gx === 0 ? '#38bdf8' : '#1e293b'}
            transparent
            opacity={isExitUnlocked && gx === 0 ? 0.65 : 0.35}
          />
        </mesh>
      ))}
      {[-7, -4, -1, 2, 5, 8].map((gz, i) => (
        <mesh key={`grid-z-${i}`} position={[0, 0.005, gz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[ROOM04_WIDTH, 0.03]} />
          <meshBasicMaterial color="#1e293b" transparent opacity={0.35} />
        </mesh>
      ))}

      {/* Floor Center Pathway Strip leading toward Exit */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, ROOM04_DEPTH - 2]} />
        <meshStandardMaterial
          color="#121722"
          roughness={0.7}
          metalness={0.4}
          emissive={isExitUnlocked ? '#0284c7' : '#000000'}
          emissiveIntensity={isExitUnlocked ? 0.15 : 0}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM04_HEIGHT, 0]} receiveShadow>
        <planeGeometry args={[ROOM04_WIDTH, ROOM04_DEPTH]} />
        <meshStandardMaterial color="#090c12" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Ceiling Ventilation / Conduit Trays */}
      <mesh position={[0, ROOM04_HEIGHT - 0.1, 0]}>
        <boxGeometry args={[1.2, 0.15, ROOM04_DEPTH - 2]} />
        <meshStandardMaterial color="#161b24" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[-4.5, ROOM04_HEIGHT - 0.1, 0]}>
        <boxGeometry args={[0.6, 0.12, ROOM04_DEPTH - 2]} />
        <meshStandardMaterial color="#121620" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[4.5, ROOM04_HEIGHT - 0.1, 0]}>
        <boxGeometry args={[0.6, 0.12, ROOM04_DEPTH - 2]} />
        <meshStandardMaterial color="#121620" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* North Wall (Far Wall with Exit & Observation Gallery) */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <planeGeometry args={[ROOM04_WIDTH, ROOM04_HEIGHT]} />
        <meshStandardMaterial color="#10141d" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* South Wall (Player Spawn End) */}
      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM04_WIDTH, ROOM04_HEIGHT]} />
        <meshStandardMaterial color="#10141d" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* East Wall with Structural Panels */}
      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM04_DEPTH, ROOM04_HEIGHT]} />
        <meshStandardMaterial color="#10141d" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* West Wall with Structural Panels */}
      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM04_DEPTH, ROOM04_HEIGHT]} />
        <meshStandardMaterial color="#10141d" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* Structural Wall Rib Columns */}
      {[-6, -2, 2, 6].map((wx, i) => (
        <group key={`rib-north-${i}`} position={[wx, halfHeight, -halfDepth + 0.15]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.4, ROOM04_HEIGHT, 0.3]} />
            <meshStandardMaterial color="#161c28" roughness={0.8} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Base Skirting Trims */}
      <mesh position={[0, 0.15, -halfDepth + 0.05]}>
        <boxGeometry args={[ROOM04_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0b0d13" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, halfDepth - 0.05]}>
        <boxGeometry args={[ROOM04_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0b0d13" roughness={0.7} />
      </mesh>
      <mesh position={[halfWidth - 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM04_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0b0d13" roughness={0.7} />
      </mesh>
      <mesh position={[-halfWidth + 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM04_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0b0d13" roughness={0.7} />
      </mesh>

      {/* 4. Investigation Objects (Physical Artifacts) */}
      {items.map((item) => {
        const isExamined = examinedIds.has(item.id)
        if (item.id === 'torn_photograph') {
          return <TornPhotographMesh key={item.id} item={item} isExamined={isExamined} />
        }
        if (item.id === 'warning_note') {
          return <WarningNoteMesh key={item.id} item={item} isExamined={isExamined} />
        }
        if (item.id === 'security_monitor') {
          return <SecurityMonitorMesh key={item.id} item={item} isExamined={isExamined} />
        }
        if (item.id === 'observation_window') {
          return <ObservationWindowMesh key={item.id} item={item} isExamined={isExamined} />
        }
        return null
      })}

      {/* 5. Watcher Presence / Shadowed Observation Alcove */}
      <WatcherAlcoveMesh isAlert={isAlert} />

      {/* 6. Physical Exit Blast Door */}
      <ExitDoorMesh isExitUnlocked={isExitUnlocked} revealPhase={revealPhase} />
    </>
  )
}
