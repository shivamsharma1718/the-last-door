/**
 * Game 07: THE MIRROR TRIAL - 3D Mirror Chamber Environment
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Implements:
 * - 12m x 12m octagonal gothic stone chamber with 4.2m ceiling.
 * - Black polished checkerboard marble floor with brass inlay.
 * - Ribbed gothic vault ceiling and extinguished iron central chandelier.
 * - Four ornate baroque mirror structures with controlled deterministic deceptive reflections:
 *     1. North (Speculum Veritatis): Synchronous pocket watch matching reality (TRUTH).
 *     2. East (Speculum Ignis): Spectral violet flame flickering on cold wicks (DECEPTION).
 *     3. West (Speculum Temporis): Inverted hourglass with sand streaming upward (DECEPTION).
 *     4. South (Speculum Ianuae): Open glowing archway promising false escape (DECEPTION).
 * - Four real-world inspectable physical artifacts on obsidian plinths.
 * - Dormant central obsidian Altar of Truth with carved Latin inscription.
 * - Collision constraints preventing clipping through walls, mirrors, and pedestals.
 */

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { MirrorId } from './mirrorTrialTypes'
import {
  CHAMBER_WIDTH,
  CHAMBER_DEPTH,
  CHAMBER_HEIGHT,
  ALTAR_WORLD_POS,
} from './mirrorTrialTypes'
import { MIRROR_DEFINITIONS } from './mirrorTrialLogic'

// ---------------------------------------------------------------------------
// Collision Function for PlayerControls
// ---------------------------------------------------------------------------

/**
 * Constrains player position inside the 12m x 12m octagonal gothic chamber,
 * preventing clipping through the perimeter walls, mirror frames, central altar,
 * and artifact pedestals.
 */
export function constrainMirrorTrialPosition(
  proposed: { x: number; z: number },
  _current: { x: number; z: number },
  radius: number = 0.35
): { x: number; z: number } {
  let { x, z } = proposed

  // 1. Cardinal wall boundaries (half-extent ~5.6m)
  const maxCardinal = 5.4 - radius
  x = Math.max(-maxCardinal, Math.min(maxCardinal, x))
  z = Math.max(-maxCardinal, Math.min(maxCardinal, z))

  // 2. Corner diagonal walls (chamfers): |x| + |z| <= 7.8m
  const maxDiagonal = 7.7 - radius * 1.414
  if (Math.abs(x) + Math.abs(z) > maxDiagonal) {
    const signX = Math.sign(x) || 1
    const signZ = Math.sign(z) || 1
    const excess = Math.abs(x) + Math.abs(z) - maxDiagonal
    x -= (excess / 2) * signX
    z -= (excess / 2) * signZ
  }

  // 3. Central Altar collision (circle around [0, 0])
  const altarCollisionRadius = 0.95 + radius
  const distToAltar = Math.hypot(x, z)
  if (distToAltar < altarCollisionRadius && distToAltar > 0.001) {
    const scale = altarCollisionRadius / distToAltar
    x *= scale
    z *= scale
  }

  // 4. Four Artifact Pedestals (circles around pedestals)
  const pedestals = [
    { x: 0, z: -4.8 }, // North Pedestal
    { x: 4.8, z: 0 },  // East Pedestal
    { x: -4.8, z: 0 }, // West Pedestal
    { x: 0, z: 4.8 },  // South Pedestal
  ]
  const pedestalRadius = 0.55 + radius

  for (const ped of pedestals) {
    const dx = x - ped.x
    const dz = z - ped.z
    const dist = Math.hypot(dx, dz)
    if (dist < pedestalRadius && dist > 0.001) {
      const scale = pedestalRadius / dist
      x = ped.x + dx * scale
      z = ped.z + dz * scale
    }
  }

  return { x, z }
}

// ---------------------------------------------------------------------------
// 1. Reusable Gothic Artifact Pedestal
// ---------------------------------------------------------------------------

interface ArtifactStandProps {
  position: [number, number, number]
  title: string
  subtitle: string
  isExamined?: boolean
  children?: React.ReactNode
}

const ArtifactStand: React.FC<ArtifactStandProps> = ({
  position,
  title,
  subtitle,
  isExamined = false,
  children,
}) => {
  const [x, , z] = position

  return (
    <group position={[x, 0, z]}>
      {/* Floating 3D Title Label */}
      <Text
        position={[0, 2.1, 0]}
        fontSize={0.14}
        color={isExamined ? '#38bdf8' : '#e2e8f0'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        {title.toUpperCase()}
      </Text>
      <Text
        position={[0, 1.94, 0]}
        fontSize={0.09}
        color={isExamined ? '#94a3b8' : '#64748b'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {subtitle}
      </Text>

      {/* Heavy Stepped Base Plinth */}
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.0, 0.12, 1.0]} />
        <meshStandardMaterial color="#0c0f14" roughness={0.85} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.82, 0.06, 0.82]} />
        <meshStandardMaterial color="#141820" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Fluted Central Column */}
      <mesh position={[0, 0.52, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.55, 0.68, 0.55]} />
        <meshStandardMaterial color="#11151c" roughness={0.78} metalness={0.25} />
      </mesh>

      {/* Corner Column Buttress Strips */}
      {[-0.26, 0.26].map((ox) =>
        [-0.26, 0.26].map((oz) => (
          <mesh
            key={`strip-${ox}-${oz}`}
            position={[ox, 0.52, oz]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.08, 0.68, 0.08]} />
            <meshStandardMaterial color="#19202a" roughness={0.7} metalness={0.4} />
          </mesh>
        ))
      )}

      {/* Tabletop Slab */}
      <mesh position={[0, 0.89, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
        <meshStandardMaterial color="#1a202c" roughness={0.7} metalness={0.35} />
      </mesh>

      {/* Polished Obsidian Inlay Top */}
      <mesh position={[0, 0.925, 0]} receiveShadow>
        <boxGeometry args={[0.78, 0.01, 0.78]} />
        <meshStandardMaterial color="#08090d" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Floor Arc Indicator */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.86, 32]} />
        <meshBasicMaterial
          color={isExamined ? '#38bdf8' : '#475569'}
          transparent
          opacity={isExamined ? 0.45 : 0.2}
        />
      </mesh>

      {/* Soft inspection spot illumination */}
      <pointLight
        position={[0, 1.4, 0]}
        color="#cbd5e1"
        intensity={0.6}
        distance={2.5}
        decay={2}
      />

      {children}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 2. Physical Artifact 1: The Silver Pocket Watch (North)
// ---------------------------------------------------------------------------

const PhysicalPocketWatch: React.FC<{ isExamined?: boolean }> = ({ isExamined }) => {
  return (
    <ArtifactStand
      position={[0, 0.9, -4.8]}
      title="The Silver Pocket Watch"
      subtitle="Speculum Veritatis (North)"
      isExamined={isExamined}
    >
      <group position={[0, 0.93, 0]}>
        {/* Slanted Velvet Display Cushion */}
        <mesh position={[0, 0.04, 0]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.05, 0.38]} />
          <meshStandardMaterial color="#1e1528" roughness={0.92} metalness={0.05} />
        </mesh>

        {/* Pocket Watch Assembly (Facing player, tilted up) */}
        <group position={[0, 0.07, 0]} rotation={[-0.25, 0, 0]}>
          {/* Main Silver Casing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.024, 32]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>

          {/* Bezel Ring */}
          <mesh position={[0, 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.126, 0.01, 16, 32]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.95}
              roughness={0.12}
            />
          </mesh>

          {/* Top Winder Crown & Loop */}
          <mesh position={[0, 0, -0.15]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.025, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.03, 0.006, 12, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Enamel Dial Plate */}
          <mesh position={[0, 0.0125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.118, 32]} />
            <meshStandardMaterial color="#faf8f5" roughness={0.3} metalness={0.05} />
          </mesh>

          {/* Watch Hands pointing strictly to 11:58 */}
          {/* Hour Hand (near 12, slightly before) */}
          <mesh position={[0, 0.014, -0.028]} rotation={[-Math.PI / 2, 0, -0.08]}>
            <boxGeometry args={[0.008, 0.055, 0.002]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Minute Hand (at 58 mins, near 12) */}
          <mesh position={[0, 0.015, -0.042]} rotation={[-Math.PI / 2, 0, -0.18]}>
            <boxGeometry args={[0.006, 0.082, 0.002]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Sweep Second Hand (at 11:58 steady) */}
          <mesh position={[0, 0.016, -0.046]} rotation={[-Math.PI / 2, 0, -0.18]}>
            <boxGeometry args={[0.0025, 0.09, 0.001]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Center Pin */}
          <mesh position={[0, 0.017, 0]}>
            <sphereGeometry args={[0.006, 12, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </ArtifactStand>
  )
}

// ---------------------------------------------------------------------------
// 3. Physical Artifact 2: The Wrought-Iron Candelabra (East)
// ---------------------------------------------------------------------------

const PhysicalCandelabra: React.FC<{ isExamined?: boolean }> = ({ isExamined }) => {
  return (
    <ArtifactStand
      position={[4.8, 0.9, 0]}
      title="The Wrought-Iron Candelabra"
      subtitle="Speculum Ignis (East)"
      isExamined={isExamined}
    >
      <group position={[0, 0.93, 0]}>
        {/* Heavy Forged Iron Base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.04, 16]} />
          <meshStandardMaterial color="#13171f" roughness={0.85} metalness={0.65} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.03, 16]} />
          <meshStandardMaterial color="#181e28" roughness={0.8} metalness={0.6} />
        </mesh>

        {/* Central Stem */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.04, 0.38, 12]} />
          <meshStandardMaterial color="#1a202c" roughness={0.8} metalness={0.6} />
        </mesh>

        {/* Side Curved Branches (spanning in Z direction for east pedestal) */}
        {[-1, 1].map((dir) => (
          <group key={`cand-arm-${dir}`} position={[0, 0.26, 0]}>
            <mesh
              position={[0, 0.06, dir * 0.12]}
              rotation={[dir * 0.45, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.022, 0.022, 0.28, 8]} />
              <meshStandardMaterial color="#1a202c" roughness={0.8} metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Three Candle Holders with Cups */}
        {[
          { pos: [0, 0.44, 0] as const },
          { pos: [0, 0.38, -0.22] as const },
          { pos: [0, 0.38, 0.22] as const },
        ].map((candle, idx) => (
          <group key={`holder-${idx}`} position={candle.pos}>
            {/* Drip Tray */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.065, 0.05, 0.02, 16]} />
              <meshStandardMaterial color="#11151c" roughness={0.85} metalness={0.7} />
            </mesh>
            {/* Candle Body (Tall Off-White Beeswax) */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.032, 0.035, 0.18, 14]} />
              <meshStandardMaterial color="#eae6da" roughness={0.7} metalness={0.05} />
            </mesh>
            {/* Burnt, Cold, Blackened Wick (NO FLAME IN REALITY) */}
            <mesh position={[0, 0.205, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.03, 6]} />
              <meshStandardMaterial color="#09090b" roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>
    </ArtifactStand>
  )
}

// ---------------------------------------------------------------------------
// 4. Physical Artifact 3: The Gilded Hourglass (West)
// ---------------------------------------------------------------------------

const PhysicalHourglass: React.FC<{ isExamined?: boolean }> = ({ isExamined }) => {
  return (
    <ArtifactStand
      position={[-4.8, 0.9, 0]}
      title="The Gilded Hourglass"
      subtitle="Speculum Temporis (West)"
      isExamined={isExamined}
    >
      <group position={[0, 0.93, 0]}>
        {/* Brass Hexagonal End Plates */}
        {[-0.24, 0.24].map((oy, idx) => (
          <mesh key={`plate-${idx}`} position={[0, oy + 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.025, 6]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
        ))}

        {/* Three Fluted Brass Support Struts */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
          const sx = Math.sin(angle) * 0.11
          const sz = Math.cos(angle) * 0.11
          return (
            <mesh key={`strut-${idx}`} position={[sx, 0.24, sz]} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.46, 8]} />
              <meshStandardMaterial
                color="#b45309"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          )
        })}

        {/* Clear Glass Bulbs (Double Cone Profile) */}
        {/* Upper Bulb */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.09, 0.02, 0.16, 24]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            transmission={0.85}
            opacity={0.35}
            transparent
            roughness={0.08}
            metalness={0.1}
          />
        </mesh>
        {/* Lower Bulb */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.09, 0.16, 24]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            transmission={0.85}
            opacity={0.35}
            transparent
            roughness={0.08}
            metalness={0.1}
          />
        </mesh>

        {/* Physical Sand: Normal Downward State */}
        {/* Upper Sand (Depleted top funnel) */}
        <mesh position={[0, 0.31, 0]}>
          <coneGeometry args={[0.065, 0.09, 16]} />
          <meshStandardMaterial color="#991b1b" roughness={0.88} />
        </mesh>
        {/* Downward Sand Stream */}
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.08, 6]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        {/* Lower Sand Pile (Accumulating mound) */}
        <mesh position={[0, 0.11, 0]}>
          <coneGeometry args={[0.08, 0.07, 16]} />
          <meshStandardMaterial color="#991b1b" roughness={0.88} />
        </mesh>
      </group>
    </ArtifactStand>
  )
}

// ---------------------------------------------------------------------------
// 5. Physical Artifact 4: The Sealed Granite Arch (South)
// ---------------------------------------------------------------------------

const PhysicalSealedArch: React.FC<{ isExamined?: boolean }> = ({ isExamined }) => {
  return (
    <group>
      {/* Investigation Pedestal in front of the arch */}
      <ArtifactStand
        position={[0, 0.9, 4.8]}
        title="The Sealed Granite Arch"
        subtitle="Speculum Ianuae (South)"
        isExamined={isExamined}
      >
        {/* Plinth Inscribed Stone Tablet */}
        <group position={[0, 0.94, 0]}>
          <mesh rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.04, 0.3]} />
            <meshStandardMaterial color="#1e2430" roughness={0.9} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.022, 0]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.36, 0.24]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
        </group>
      </ArtifactStand>

      {/* Massive Impassable Sealed Granite Slab against the south wall */}
      <group position={[0, 2.0, 5.5]}>
        {/* Outer Stone Portico Frame */}
        <mesh position={[-1.4, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.0, 0.6]} />
          <meshStandardMaterial color="#0f131a" roughness={0.9} metalness={0.15} />
        </mesh>
        <mesh position={[1.4, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.0, 0.6]} />
          <meshStandardMaterial color="#0f131a" roughness={0.9} metalness={0.15} />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.5, 0.6]} />
          <meshStandardMaterial color="#131822" roughness={0.9} metalness={0.15} />
        </mesh>

        {/* Solid Impassable Granite Block (NO DOORWAY IN REALITY) */}
        <mesh position={[0, -0.1, 0.05]} receiveShadow>
          <boxGeometry args={[2.35, 3.4, 0.45]} />
          <meshStandardMaterial color="#1e2532" roughness={0.92} metalness={0.1} />
        </mesh>

        {/* Heavy Rusted Iron Cross-Braces Bolted Across the Granite */}
        {[-0.6, 0.6].map((oy, idx) => (
          <group key={`brace-${idx}`} position={[0, oy, 0.3]}>
            <mesh castShadow>
              <boxGeometry args={[2.3, 0.16, 0.04]} />
              <meshStandardMaterial
                color="#272a30"
                metalness={0.7}
                roughness={0.65}
              />
            </mesh>
            {/* Square Iron Rivets */}
            {[-0.9, -0.45, 0, 0.45, 0.9].map((rx, rIdx) => (
              <mesh key={`rivet-${rIdx}`} position={[rx, 0, 0.025]}>
                <boxGeometry args={[0.04, 0.04, 0.02]} />
                <meshStandardMaterial
                  color="#475569"
                  metalness={0.8}
                  roughness={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Vertical Iron Locking Bar */}
        <mesh position={[0, -0.1, 0.33]} castShadow>
          <boxGeometry args={[0.14, 3.1, 0.04]} />
          <meshStandardMaterial color="#22262d" metalness={0.75} roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 6. Baroque Mirror Frame & Controlled Reflection Systems
// ---------------------------------------------------------------------------

interface MirrorStructureProps {
  id: MirrorId
  position: [number, number, number]
  rotation: [number, number, number]
  latinTitle: string
  englishTitle: string
  children?: React.ReactNode
}

const BaroqueMirrorFrame: React.FC<MirrorStructureProps> = ({
  position,
  rotation,
  latinTitle,
  englishTitle,
  children,
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 3D Inscription Plaque above Mirror */}
      <group position={[0, 1.82, 0.12]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 0.28, 0.06]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.7} metalness={0.6} />
        </mesh>
        <Text
          position={[0, 0.04, 0.04]}
          fontSize={0.105}
          color="#f1f5f9"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {latinTitle.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.06, 0.04]}
          fontSize={0.065}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {englishTitle}
        </Text>
      </group>

      {/* Ornate Baroque Outer Arch Frame */}
      {/* Left Column */}
      <mesh position={[-1.02, 0, 0.08]} castShadow>
        <boxGeometry args={[0.22, 3.1, 0.2]} />
        <meshStandardMaterial color="#2d2b27" roughness={0.55} metalness={0.65} />
      </mesh>
      {/* Right Column */}
      <mesh position={[1.02, 0, 0.08]} castShadow>
        <boxGeometry args={[0.22, 3.1, 0.2]} />
        <meshStandardMaterial color="#2d2b27" roughness={0.55} metalness={0.65} />
      </mesh>
      {/* Top Arched Pediment */}
      <mesh position={[0, 1.58, 0.08]} castShadow>
        <boxGeometry args={[2.26, 0.22, 0.2]} />
        <meshStandardMaterial color="#35312a" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Bottom Plinth Ledge */}
      <mesh position={[0, -1.58, 0.08]} castShadow>
        <boxGeometry args={[2.26, 0.22, 0.2]} />
        <meshStandardMaterial color="#35312a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Inner Decorative Gilded Bezel Ring */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[1.88, 2.98, 0.04]} />
        <meshStandardMaterial color="#854d0e" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Semi-Translucent Reflective Mirror Glass */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.76, 2.86]} />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.92}
          roughness={0.12}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Light-Blocking Dark Alcove Box Behind the Mirror Frame */}
      {/* This encloses the reflection geometry completely so it doesn't bleed outside */}
      <group position={[0, 0, -1.0]}>
        {/* Back Wall */}
        <mesh position={[0, 0, -0.9]}>
          <planeGeometry args={[2.4, 3.4]} />
          <meshStandardMaterial color="#05070a" roughness={0.98} />
        </mesh>
        {/* Top & Bottom Alcove Slabs */}
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[2.4, 0.1, 1.8]} />
          <meshStandardMaterial color="#07090e" roughness={0.95} />
        </mesh>
        <mesh position={[0, -1.65, 0]}>
          <boxGeometry args={[2.4, 0.1, 1.8]} />
          <meshStandardMaterial color="#07090e" roughness={0.95} />
        </mesh>
        {/* Left & Right Alcove Walls */}
        <mesh position={[-1.15, 0, 0]}>
          <boxGeometry args={[0.1, 3.4, 1.8]} />
          <meshStandardMaterial color="#06080d" roughness={0.95} />
        </mesh>
        <mesh position={[1.15, 0, 0]}>
          <boxGeometry args={[0.1, 3.4, 1.8]} />
          <meshStandardMaterial color="#06080d" roughness={0.95} />
        </mesh>

        {/* Reflected Scene Geometry Mounted Inside Alcove */}
        {children}
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 7. Deterministic Reflection 1: North (Truth - Speculum Veritatis)
// ---------------------------------------------------------------------------

const ReflectedTruthNorth: React.FC = () => {
  return (
    <group position={[0, -0.9, -0.2]}>
      {/* Reflected Obsidian Pedestal Stand */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.65, 0.7]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.78, 0.05, 0.78]} />
        <meshStandardMaterial color="#141822" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Reflected Pocket Watch on Velvet Cushion (MATCHES PHYSICAL WATCH EXACTLY) */}
      <mesh position={[0, 0.38, 0]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.38, 0.04, 0.34]} />
        <meshStandardMaterial color="#1e1528" roughness={0.9} />
      </mesh>
      <group position={[0, 0.41, 0]} rotation={[0.25, 0, 0]}>
        {/* Silver Casing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.024, 24]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* Dial */}
        <mesh position={[0, 0.0125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.118, 24]} />
          <meshStandardMaterial color="#faf8f5" roughness={0.3} />
        </mesh>
        {/* Hands frozen at 11:58 (IDENTICAL SYNCHRONY) */}
        <mesh position={[0, 0.014, -0.028]} rotation={[-Math.PI / 2, 0, -0.08]}>
          <boxGeometry args={[0.008, 0.055, 0.002]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.015, -0.042]} rotation={[-Math.PI / 2, 0, -0.18]}>
          <boxGeometry args={[0.006, 0.082, 0.002]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.016, -0.046]} rotation={[-Math.PI / 2, 0, -0.18]}>
          <boxGeometry args={[0.0025, 0.09, 0.001]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Dim, calm silver ambient inside truth mirror */}
      <pointLight
        position={[0, 0.8, 0.2]}
        color="#e2e8f0"
        intensity={0.4}
        distance={2.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8. Deterministic Reflection 2: East (Phantom Flame - Speculum Ignis)
// ---------------------------------------------------------------------------

const ReflectedFlameEast: React.FC = () => {
  const flameLightRef = useRef<THREE.PointLight>(null!)
  const flameGroupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Dynamic flickering of phantom flames
    if (flameLightRef.current) {
      flameLightRef.current.intensity =
        1.8 + Math.sin(t * 7.5) * 0.35 + Math.cos(t * 16.0) * 0.15
    }
    if (flameGroupRef.current) {
      flameGroupRef.current.scale.y = 1.0 + Math.sin(t * 9.0) * 0.12
    }
  })

  return (
    <group position={[0, -0.9, -0.2]}>
      {/* Reflected Pedestal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.65, 0.7]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.78, 0.05, 0.78]} />
        <meshStandardMaterial color="#141822" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Reflected Candelabra */}
      <group position={[0, 0.38, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.03, 14]} />
          <meshStandardMaterial color="#11151c" roughness={0.8} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.035, 0.35, 10]} />
          <meshStandardMaterial color="#181e28" roughness={0.8} metalness={0.6} />
        </mesh>

        {/* Arms */}
        {[-1, 1].map((dir) => (
          <mesh
            key={`ref-arm-${dir}`}
            position={[dir * 0.11, 0.22, 0]}
            rotation={[0, 0, dir * 0.45]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
            <meshStandardMaterial color="#181e28" roughness={0.8} metalness={0.6} />
          </mesh>
        ))}

        {/* Three Candles with SPECTRAL VIOLET FLAMES (ONLY IN REFLECTION) */}
        <group ref={flameGroupRef}>
          {[
            { pos: [0, 0.36, 0] as const },
            { pos: [-0.2, 0.32, 0] as const },
            { pos: [0.2, 0.32, 0] as const },
          ].map((c, idx) => (
            <group key={`ref-candle-${idx}`} position={c.pos}>
              {/* Candle Body */}
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.028, 0.03, 0.16, 12]} />
                <meshStandardMaterial color="#eae6da" roughness={0.7} />
              </mesh>
              {/* Ethereal Violet Flame TearDrop */}
              <mesh position={[0, 0.22, 0]}>
                <coneGeometry args={[0.022, 0.08, 10]} />
                <meshBasicMaterial color="#c084fc" />
              </mesh>
              <mesh position={[0, 0.21, 0]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#a855f7" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Violet Phantom Light Source (Confined to mirror alcove) */}
      <pointLight
        ref={flameLightRef}
        position={[0, 0.85, 0.1]}
        color="#a855f7"
        intensity={2.0}
        distance={2.5}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 9. Deterministic Reflection 3: West (Inverted Time - Speculum Temporis)
// ---------------------------------------------------------------------------

const ReflectedTimeWest: React.FC = () => {
  const sandStreamRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Animate upward streaming sand particles
    if (sandStreamRef.current) {
      sandStreamRef.current.position.y = (t * 0.18) % 0.12
    }
  })

  return (
    <group position={[0, -0.9, -0.2]}>
      {/* Reflected Pedestal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.65, 0.7]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.78, 0.05, 0.78]} />
        <meshStandardMaterial color="#141822" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Reflected Hourglass with INVERTED GRAVITY / ENTROPY */}
      <group position={[0, 0.38, 0]}>
        {/* Brass Plates */}
        {[-0.22, 0.22].map((oy, idx) => (
          <mesh key={`ref-plate-${idx}`} position={[0, oy + 0.22, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 6]} />
            <meshStandardMaterial color="#d97706" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}

        {/* Struts */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
          <mesh
            key={`ref-strut-${idx}`}
            position={[Math.sin(angle) * 0.1, 0.22, Math.cos(angle) * 0.1]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
            <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Glass Bulbs */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 0.15, 18]} />
          <meshPhysicalMaterial
            color="#ecfeff"
            transmission={0.85}
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.02, 0.08, 0.15, 18]} />
          <meshPhysicalMaterial
            color="#ecfeff"
            transmission={0.85}
            transparent
            opacity={0.4}
            roughness={0.1}
          />
        </mesh>

        {/* Inverted Sand Physics: Upper bulb fills, lower bulb empties, stream flows UP */}
        {/* Upper Bulb Sand Mound (Growing upside-down or filling) */}
        <mesh position={[0, 0.32, 0]}>
          <coneGeometry args={[0.075, 0.08, 14]} />
          <meshStandardMaterial color="#dc2626" roughness={0.85} />
        </mesh>

        {/* Upward Streaming Particles */}
        <group ref={sandStreamRef}>
          {[-0.03, 0, 0.03].map((oy, idx) => (
            <mesh key={`particle-${idx}`} position={[0, 0.2 + oy, 0]}>
              <sphereGeometry args={[0.005, 6, 6]} />
              <meshBasicMaterial color="#f87171" />
            </mesh>
          ))}
        </group>

        {/* Lower Bulb Sand (Depleted funnel) */}
        <mesh position={[0, 0.09, 0]}>
          <coneGeometry args={[0.04, 0.05, 14]} />
          <meshStandardMaterial color="#991b1b" roughness={0.85} />
        </mesh>

        {/* Chronological Distortion Ring (faint cyan shimmer) */}
        <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.006, 12, 24]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Cold Cyan Ambient Light (Confined to mirror alcove) */}
      <pointLight
        position={[0, 0.7, 0.1]}
        color="#06b6d4"
        intensity={0.9}
        distance={2.2}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 10. Deterministic Reflection 4: South (False Door - Speculum Ianuae)
// ---------------------------------------------------------------------------

const ReflectedDoorSouth: React.FC = () => {
  return (
    <group position={[0, 0, -0.4]}>
      {/* Phantom Open Archway (NO SEALED SLAB IN REFLECTION!) */}
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.3, 3.2, 0.4]} />
        <meshStandardMaterial color="#1e2430" roughness={0.85} />
      </mesh>
      <mesh position={[0.9, 0, 0]}>
        <boxGeometry args={[0.3, 3.2, 0.4]} />
        <meshStandardMaterial color="#1e2430" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#262d3d" roughness={0.85} />
      </mesh>

      {/* Ascending Steps leading into warm illuminated escape corridor */}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((depthZ, idx) => (
        <mesh
          key={`step-${idx}`}
          position={[0, -1.2 + idx * 0.18, -depthZ]}
          receiveShadow
        >
          <boxGeometry args={[1.5, 0.18, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}

      {/* Inviting Golden Hallway Background Plane */}
      <mesh position={[0, 0.4, -0.8]}>
        <planeGeometry args={[1.6, 2.4]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.65} />
      </mesh>

      {/* Warm Golden Escape Glow (The Lethal Mirage) */}
      <pointLight
        position={[0, 0.5, -0.3]}
        color="#fbbf24"
        intensity={3.2}
        distance={3.6}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 11. Central Altar of Truth
// ---------------------------------------------------------------------------

interface CentralAltarProps {
  altarUnlocked?: boolean
}

const CentralAltar: React.FC<CentralAltarProps> = ({ altarUnlocked = false }) => {
  const [ax, , az] = ALTAR_WORLD_POS

  return (
    <group position={[ax, 0, az]}>
      {/* Octagonal Stepped Dias Base */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.8, 1.95, 0.1, 8]} />
        <meshStandardMaterial color="#0c0e14" roughness={0.85} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.45, 1.55, 0.08, 8]} />
        <meshStandardMaterial color="#121620" roughness={0.8} metalness={0.35} />
      </mesh>

      {/* Main Obsidian Monolith Block */}
      <mesh position={[0, 0.58, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#080a0e" roughness={0.35} metalness={0.5} />
      </mesh>

      {/* Carved Corner Buttresses */}
      {[-0.58, 0.58].map((cx) =>
        [-0.58, 0.58].map((cz) => (
          <mesh
            key={`altar-col-${cx}-${cz}`}
            position={[cx, 0.58, cz]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#1a202c" roughness={0.6} metalness={0.6} />
          </mesh>
        ))
      )}

      {/* Top Sacrificial Focus Slab */}
      <mesh position={[0, 1.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.36, 0.06, 1.36]} />
        <meshStandardMaterial color="#141822" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Central Circular Focus Basin */}
      <mesh position={[0, 1.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.38, 32]} />
        <meshStandardMaterial
          color={altarUnlocked ? '#38bdf8' : '#334155'}
          emissive={altarUnlocked ? '#0284c7' : '#000000'}
          emissiveIntensity={altarUnlocked ? 0.6 : 0.0}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Four Channeled Runes Running to Basin */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={`channel-${idx}`}
          position={[Math.sin(angle) * 0.48, 1.032, Math.cos(angle) * 0.48]}
          rotation={[-Math.PI / 2, 0, angle]}
        >
          <planeGeometry args={[0.04, 0.22]} />
          <meshStandardMaterial
            color={altarUnlocked ? '#38bdf8' : '#1e293b'}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Inscribed Latin Rule on South Face (Facing player spawn at [0, 1.65, 2.4]) */}
      <group position={[0, 0.6, 0.61]}>
        <Text
          position={[0, 0.18, 0]}
          fontSize={0.052}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          maxWidth={1.05}
          textAlign="center"
        >
          FOUR GLASSES DRINK THE ROOM.
        </Text>
        <Text
          position={[0, 0.08, 0]}
          fontSize={0.048}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          maxWidth={1.05}
          textAlign="center"
        >
          THREE QUENCH THEIR THIRST WITH LIES.
        </Text>
        <Text
          position={[0, -0.02, 0]}
          fontSize={0.048}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
          maxWidth={1.05}
          textAlign="center"
        >
          ONE REFLECTS ONLY WHAT IS COLD AND TRUE.
        </Text>
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.042}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          maxWidth={1.05}
          textAlign="center"
        >
          TRUST THE GLASS THAT DOES NOT INVENT, INVERT, OR INVITE.
        </Text>
      </group>

      {/* Central Dormant Downlight */}
      <pointLight
        position={[0, 2.2, 0]}
        color={altarUnlocked ? '#38bdf8' : '#64748b'}
        intensity={altarUnlocked ? 1.5 : 0.4}
        distance={4.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 12. Gothic Chamber Room Shell (Octagonal 12m x 12m x 4.2m)
// ---------------------------------------------------------------------------

const OctagonalChamberShell: React.FC = () => {
  // Tile coordinates for checkerboard floor across chamber footprint
  const floorTiles = useMemo(() => {
    const tiles: { x: number; z: number; isDark: boolean }[] = []
    const step = 1.0
    const limitX = CHAMBER_WIDTH / 2 - 0.5
    const limitZ = CHAMBER_DEPTH / 2 - 0.5

    for (let x = -limitX; x <= limitX; x += step) {
      for (let z = -limitZ; z <= limitZ; z += step) {
        // Only generate tiles inside the octagonal footprint (|x| + |z| <= 8.0)
        if (Math.abs(x) + Math.abs(z) <= 8.0) {
          const isDark = (Math.round(x) + Math.round(z)) % 2 === 0
          tiles.push({ x, z, isDark })
        }
      }
    }
    return tiles
  }, [])

  return (
    <group>
      {/* 1. Black Checkerboard Polished Marble Floor */}
      {floorTiles.map((tile, idx) => (
        <mesh
          key={`tile-${idx}`}
          position={[tile.x, 0.001, tile.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.98, 0.98]} />
          <meshStandardMaterial
            color={tile.isDark ? '#080a0e' : '#141822'}
            roughness={tile.isDark ? 0.25 : 0.35}
            metalness={tile.isDark ? 0.4 : 0.25}
          />
        </mesh>
      ))}

      {/* Floor Base Slab Underlay */}
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[CHAMBER_WIDTH + 1.0, CHAMBER_DEPTH + 1.0]} />
        <meshStandardMaterial color="#040609" roughness={0.9} />
      </mesh>

      {/* 2. Gothic High Ribbed Vault Ceiling (Height 4.2m) */}
      <mesh
        position={[0, CHAMBER_HEIGHT, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[CHAMBER_WIDTH + 1.0, CHAMBER_DEPTH + 1.0]} />
        <meshStandardMaterial color="#090b10" roughness={0.92} />
      </mesh>

      {/* Ceiling Rib Arches (Transverse & Diagonal Stone Ribs) */}
      {[-1, 1].map((dir) => (
        <group key={`rib-diag-${dir}`}>
          <mesh
            position={[0, CHAMBER_HEIGHT - 0.15, 0]}
            rotation={[0, (dir * Math.PI) / 4, 0]}
          >
            <boxGeometry args={[0.26, 0.3, 14.5]} />
            <meshStandardMaterial color="#151922" roughness={0.85} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, CHAMBER_HEIGHT - 0.12, 0]}>
        <boxGeometry args={[0.24, 0.25, 12.0]} />
        <meshStandardMaterial color="#121620" roughness={0.85} />
      </mesh>
      <mesh position={[0, CHAMBER_HEIGHT - 0.12, 0]}>
        <boxGeometry args={[12.0, 0.25, 0.24]} />
        <meshStandardMaterial color="#121620" roughness={0.85} />
      </mesh>

      {/* 3. Extinguished Gothic Chandelier at Room Center */}
      <group position={[0, 3.2, 0]}>
        {/* Support Chain ascending to ceiling */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.0, 8]} />
          <meshStandardMaterial color="#0b0d12" roughness={0.9} metalness={0.7} />
        </mesh>
        {/* Large Forged Iron Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.035, 12, 32]} />
          <meshStandardMaterial color="#131720" roughness={0.75} metalness={0.8} />
        </mesh>
        {/* Inner Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.45, 0.025, 12, 24]} />
          <meshStandardMaterial color="#131720" roughness={0.75} metalness={0.8} />
        </mesh>
        {/* 8 Extinguished, Cold Candle Stubs around Chandelier */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const angle = (idx * Math.PI) / 4
          const cx = Math.sin(angle) * 0.9
          const cz = Math.cos(angle) * 0.9
          return (
            <mesh key={`chand-candle-${idx}`} position={[cx, 0.06, cz]}>
              <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
              <meshStandardMaterial color="#d4d0c5" roughness={0.8} />
            </mesh>
          )
        })}
      </group>

      {/* 4. Cardinal Stone Walls (Width 6.0m each, Height 4.2m) */}
      {/* North Wall */}
      <mesh
        position={[0, CHAMBER_HEIGHT / 2, -6.0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[6.2, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#10141c" roughness={0.88} metalness={0.15} />
      </mesh>
      {/* South Wall */}
      <mesh
        position={[0, CHAMBER_HEIGHT / 2, 6.0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[6.2, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#10141c" roughness={0.88} metalness={0.15} />
      </mesh>
      {/* East Wall */}
      <mesh
        position={[6.0, CHAMBER_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.4, CHAMBER_HEIGHT, 6.2]} />
        <meshStandardMaterial color="#10141c" roughness={0.88} metalness={0.15} />
      </mesh>
      {/* West Wall */}
      <mesh
        position={[-6.0, CHAMBER_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.4, CHAMBER_HEIGHT, 6.2]} />
        <meshStandardMaterial color="#10141c" roughness={0.88} metalness={0.15} />
      </mesh>

      {/* 5. Corner Diagonal Walls (Chamfers at 45 degrees, Width 4.24m) */}
      {/* North-East Corner */}
      <mesh
        position={[4.5, CHAMBER_HEIGHT / 2, -4.5]}
        rotation={[0, -Math.PI / 4, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[4.4, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#0d1117" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* North-West Corner */}
      <mesh
        position={[-4.5, CHAMBER_HEIGHT / 2, -4.5]}
        rotation={[0, Math.PI / 4, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[4.4, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#0d1117" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* South-East Corner */}
      <mesh
        position={[4.5, CHAMBER_HEIGHT / 2, 4.5]}
        rotation={[0, (-3 * Math.PI) / 4, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[4.4, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#0d1117" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* South-West Corner */}
      <mesh
        position={[-4.5, CHAMBER_HEIGHT / 2, 4.5]}
        rotation={[0, (3 * Math.PI) / 4, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[4.4, CHAMBER_HEIGHT, 0.4]} />
        <meshStandardMaterial color="#0d1117" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* 6. Gothic Corner Pilasters */}
      {[
        [4.5, -4.5],
        [-4.5, -4.5],
        [4.5, 4.5],
        [-4.5, 4.5],
      ].map(([px, pz], idx) => (
        <mesh
          key={`corner-col-${idx}`}
          position={[px, CHAMBER_HEIGHT / 2, pz]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[0.45, CHAMBER_HEIGHT, 0.45]} />
          <meshStandardMaterial color="#161c26" roughness={0.8} metalness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 13. Main Arena Export: TheMirrorTrialArena
// ---------------------------------------------------------------------------

export interface TheMirrorTrialArenaProps {
  investigatedMirrorIds?: MirrorId[]
  altarUnlocked?: boolean
}

export const TheMirrorTrialArena: React.FC<TheMirrorTrialArenaProps> = ({
  investigatedMirrorIds = [],
  altarUnlocked = false,
}) => {
  const investigatedSet = useMemo(
    () => new Set(investigatedMirrorIds),
    [investigatedMirrorIds]
  )

  const northMirror = MIRROR_DEFINITIONS[0]
  const eastMirror = MIRROR_DEFINITIONS[1]
  const westMirror = MIRROR_DEFINITIONS[2]
  const southMirror = MIRROR_DEFINITIONS[3]

  return (
    <>
      {/* 1. Psychological Horror Atmosphere & Fog */}
      <color attach="background" args={['#04060a']} />
      <fog attach="fog" args={['#04060a', 3.5, 17.5]} />

      {/* 2. Restrained Gothic Lighting */}
      {/* Cold Deep Slate Ambient Light */}
      <ambientLight color="#141a26" intensity={0.42} />

      {/* Central Chandelier Moonlit Downlight */}
      <spotLight
        position={[0, CHAMBER_HEIGHT - 0.2, 0]}
        target-position={[0, 0, 0]}
        color="#38bdf8"
        intensity={1.2}
        distance={10.0}
        angle={Math.PI / 3}
        penumbra={0.8}
        decay={2}
      />

      {/* 3. Octagonal Stone Chamber Architecture */}
      <OctagonalChamberShell />

      {/* 4. Central Altar of Truth */}
      <CentralAltar altarUnlocked={altarUnlocked} />

      {/* 5. Four Physical Inspectable Artifacts */}
      <PhysicalPocketWatch isExamined={investigatedSet.has('mirror_north')} />
      <PhysicalCandelabra isExamined={investigatedSet.has('mirror_east')} />
      <PhysicalHourglass isExamined={investigatedSet.has('mirror_west')} />
      <PhysicalSealedArch isExamined={investigatedSet.has('mirror_south')} />

      {/* 6. Four Baroque Mirrors with Deterministic Deceptive Reflections */}
      {/* NORTH MIRROR — Speculum Veritatis (TRUTH) */}
      <BaroqueMirrorFrame
        id={northMirror.id}
        position={northMirror.mirrorPosition}
        rotation={northMirror.mirrorRotation}
        latinTitle={northMirror.latinTitle}
        englishTitle={northMirror.englishTitle}
      >
        <ReflectedTruthNorth />
      </BaroqueMirrorFrame>

      {/* EAST MIRROR — Speculum Ignis (PHANTOM FLAME) */}
      <BaroqueMirrorFrame
        id={eastMirror.id}
        position={eastMirror.mirrorPosition}
        rotation={eastMirror.mirrorRotation}
        latinTitle={eastMirror.latinTitle}
        englishTitle={eastMirror.englishTitle}
      >
        <ReflectedFlameEast />
      </BaroqueMirrorFrame>

      {/* WEST MIRROR — Speculum Temporis (INVERTED TIME) */}
      <BaroqueMirrorFrame
        id={westMirror.id}
        position={westMirror.mirrorPosition}
        rotation={westMirror.mirrorRotation}
        latinTitle={westMirror.latinTitle}
        englishTitle={westMirror.englishTitle}
      >
        <ReflectedTimeWest />
      </BaroqueMirrorFrame>

      {/* SOUTH MIRROR — Speculum Ianuae (FALSE DOOR) */}
      <BaroqueMirrorFrame
        id={southMirror.id}
        position={southMirror.mirrorPosition}
        rotation={southMirror.mirrorRotation}
        latinTitle={southMirror.latinTitle}
        englishTitle={southMirror.englishTitle}
      >
        <ReflectedDoorSouth />
      </BaroqueMirrorFrame>
    </>
  )
}
