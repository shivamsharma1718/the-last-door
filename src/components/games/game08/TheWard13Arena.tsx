/**
 * Game 08: WARD 13 - Complete 3D Hospital Environment
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Implements:
 * 1. Area 1: Hospital Reception / Triage Admissions (Center [0, 1.8, 10])
 * 2. Area 2: Patient Ward (Center [0, 1.8, 1])
 * 3. Area 3: Isolation Room (Center [-9, 1.6, 1])
 * 4. Area 4: Observation Room (Center [0, 1.8, -7])
 * 5. Area 5: Medical Records Archive (Center [9, 1.8, -7])
 * 6. Area 6: Ward 13 Final Exit / Decontamination Airlock (Center [0, 1.9, -14.5])
 * 7. Connecting security corridors, doorways, and physical security barrier frames.
 * 8. All 12 canonical evidence props placed at their exact coordinates.
 * 9. Custom Game 08 spatial collision constraint function.
 */

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Ward13RoomId } from './ward13Types'
import {
  WARD13_EVIDENCE,
} from './ward13Logic'

// ---------------------------------------------------------------------------
// 0. Collision & Spatial Constraint Function for PlayerControls
// ---------------------------------------------------------------------------

interface AABB {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

// Walkable floor corridors and room volumes
const WALKABLE_ZONES: AABB[] = [
  // Area 1: Hospital Reception (8m x 6m)
  { minX: -3.8, maxX: 3.8, minZ: 7.0, maxZ: 12.8 },
  // Corridor 1: Reception -> Patient Ward
  { minX: -1.3, maxX: 1.3, minZ: 4.8, maxZ: 7.2 },
  // Area 2: Patient Ward (12m x 8m)
  { minX: -5.8, maxX: 5.8, minZ: -3.0, maxZ: 5.0 },
  // Corridor 2: Patient Ward -> Isolation Room
  { minX: -7.2, maxX: -5.7, minZ: 0.0, maxZ: 2.0 },
  // Area 3: Isolation Room (6m x 6m)
  { minX: -11.8, maxX: -6.0, minZ: -1.8, maxZ: 3.8 },
  // Corridor 3: Patient Ward -> Observation Room
  { minX: -1.3, maxX: 1.3, minZ: -4.2, maxZ: -2.8 },
  // Area 4: Observation Room (10m x 6m)
  { minX: -4.8, maxX: 4.8, minZ: -9.8, maxZ: -4.0 },
  // Corridor 4: Observation Room -> Records Archive
  { minX: 4.8, maxX: 6.2, minZ: -7.7, maxZ: -6.3 },
  // Area 5: Medical Records Archive (8m x 8m)
  { minX: 5.0, maxX: 12.8, minZ: -10.8, maxZ: -3.2 },
  // Corridor 5: Observation Room -> Decon Exit
  { minX: -1.3, maxX: 1.3, minZ: -11.8, maxZ: -9.7 },
  // Area 6: Decon Exit / Airlock (7m x 6m)
  { minX: -3.3, maxX: 3.3, minZ: -17.2, maxZ: -11.5 },
]

// Solid major furniture/obstacle bounding boxes to prevent walking through
const SOLID_OBSTACLES: AABB[] = [
  // Reception Check-in Desk
  { minX: 0.8, maxX: 2.8, minZ: 9.2, maxZ: 10.4 },
  // Patient Ward Beds (East & West rows)
  { minX: 2.6, maxX: 4.4, minZ: 2.0, maxZ: 3.8 }, // Bed 07
  { minX: 2.6, maxX: 4.4, minZ: 0.2, maxZ: 1.8 },
  { minX: 2.6, maxX: 4.4, minZ: -1.8, maxZ: -0.2 },
  { minX: -4.4, maxX: -2.6, minZ: 2.0, maxZ: 3.8 },
  { minX: -4.4, maxX: -2.6, minZ: 0.2, maxZ: 1.8 },
  { minX: -4.4, maxX: -2.6, minZ: -1.8, maxZ: -0.2 },
  // Isolation Bolted Chair
  { minX: -9.4, maxX: -8.6, minZ: 0.6, maxZ: 1.4 },
  // Observation Master Console
  { minX: -3.8, maxX: 3.8, minZ: -9.8, maxZ: -8.5 },
  // Records Archive File Compactors
  { minX: 6.8, maxX: 12.5, minZ: -10.5, maxZ: -8.8 },
  // Decon Exit Central Diagnostic Terminal
  { minX: -0.7, maxX: 0.7, minZ: -14.8, maxZ: -13.8 },
]

// Locked door barrier AABBs to prevent passing into locked rooms
const LOCKED_DOOR_BARRIERS: Partial<Record<Ward13RoomId, AABB>> = {
  // Corridor 1: Reception -> Patient Ward
  patient_ward: { minX: -1.3, maxX: 1.3, minZ: 5.7, maxZ: 6.3 },
  // Corridor 2: Patient Ward -> Isolation Room
  isolation_room: { minX: -6.7, maxX: -6.3, minZ: -0.1, maxZ: 2.1 },
  // Corridor 3: Patient Ward -> Observation Room
  observation_room: { minX: -1.3, maxX: 1.3, minZ: -3.7, maxZ: -3.3 },
  // Corridor 4: Observation Room -> Records Archive
  records_archive: { minX: 5.3, maxX: 5.7, minZ: -7.7, maxZ: -6.3 },
  // Corridor 5: Observation Room -> Decon Exit
  decon_exit: { minX: -1.3, maxX: 1.3, minZ: -11.0, maxZ: -10.5 },
}

function isInsideAnyZone(x: number, z: number, radius: number): boolean {
  for (const zone of WALKABLE_ZONES) {
    if (
      x >= zone.minX + radius &&
      x <= zone.maxX - radius &&
      z >= zone.minZ + radius &&
      z <= zone.maxZ - radius
    ) {
      return true
    }
  }
  return false
}

function isInsideAnyObstacle(
  x: number,
  z: number,
  radius: number,
  unlockedRoomIds?: Ward13RoomId[]
): boolean {
  for (const obs of SOLID_OBSTACLES) {
    if (
      x >= obs.minX - radius &&
      x <= obs.maxX + radius &&
      z >= obs.minZ - radius &&
      z <= obs.maxZ + radius
    ) {
      return true
    }
  }

  if (unlockedRoomIds) {
    for (const [roomId, barrier] of Object.entries(LOCKED_DOOR_BARRIERS) as [
      Ward13RoomId,
      AABB,
    ][]) {
      if (!unlockedRoomIds.includes(roomId)) {
        if (
          x >= barrier.minX - radius &&
          x <= barrier.maxX + radius &&
          z >= barrier.minZ - radius &&
          z <= barrier.maxZ + radius
        ) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Constrains player position inside the interconnected hospital ward,
 * allowing smooth navigation through corridors while blocking wall, furniture,
 * and locked security door clipping.
 */
export function constrainWard13Position(
  proposed: { x: number; z: number },
  current: { x: number; z: number },
  radius: number = 0.35,
  unlockedRoomIds?: Ward13RoomId[]
): { x: number; z: number } {
  let { x, z } = proposed

  // Test full move
  if (isInsideAnyZone(x, z, radius) && !isInsideAnyObstacle(x, z, radius, unlockedRoomIds)) {
    return { x, z }
  }

  // Slide along X axis
  if (isInsideAnyZone(x, current.z, radius) && !isInsideAnyObstacle(x, current.z, radius, unlockedRoomIds)) {
    return { x, z: current.z }
  }

  // Slide along Z axis
  if (isInsideAnyZone(current.x, z, radius) && !isInsideAnyObstacle(current.x, z, radius, unlockedRoomIds)) {
    return { x: current.x, z }
  }

  // Block movement if both fail
  return { x: current.x, z: current.z }
}

// ---------------------------------------------------------------------------
// 1. Reusable 3D Evidence Stand & Interaction Marker
// ---------------------------------------------------------------------------

interface EvidenceStandProps {
  id: string
  title: string
  position: [number, number, number]
  category: string
  children?: React.ReactNode
}

const EvidenceStand: React.FC<EvidenceStandProps> = ({
  title,
  position,
  children,
}) => {
  const [x, y, z] = position
  const markerPulseRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (markerPulseRef.current) {
      const t = clock.getElapsedTime()
      markerPulseRef.current.position.y = 0.05 + Math.sin(t * 3.0) * 0.03
    }
  })

  return (
    <group position={[x, y, z]}>
      {/* 3D Floating Item Title */}
      <Text
        position={[0, 0.85, 0]}
        fontSize={0.095}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        maxWidth={1.4}
        textAlign="center"
      >
        {title.toUpperCase()}
      </Text>

      {/* Floating Holographic Inspection Marker */}
      <mesh ref={markerPulseRef} position={[0, 0.05, 0]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>

      {/* Ground Proximity Decal Accent */}
      <mesh position={[0, -y + 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 24]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>

      {/* Clue Physical Geometry */}
      {children}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 2. Area 1: Hospital Reception / Triage Admissions
// ---------------------------------------------------------------------------

const HospitalReceptionArea: React.FC = () => {
  return (
    <group position={[0, 0, 10.0]}>
      {/* Room Room Floor (8m x 6m): Water-damaged clinical linoleum */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8.0, 6.0]} />
        <meshStandardMaterial color="#1a2228" roughness={0.7} metalness={0.25} />
      </mesh>

      {/* Reception Ceiling (Height 3.6m) */}
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[8.0, 6.0]} />
        <meshStandardMaterial color="#0b0f14" roughness={0.9} />
      </mesh>

      {/* South Wall (Back of reception, Z = +3.0 in local) */}
      <mesh position={[0, 1.8, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* East & West Walls */}
      <mesh position={[4.0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 6.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[-4.0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 6.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* North Wall: Has central doorway (width 2.4m) leading to corridor */}
      <mesh position={[-2.6, 1.8, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[2.6, 1.8, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.8, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* Reception Check-In Counter Desk */}
      <group position={[1.8, 0, -0.2]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 1.1, 0.8]} />
          <meshStandardMaterial color="#2d3748" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.04, 0.9]} />
          <meshStandardMaterial color="#1a202c" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Shattered frosted privacy glass screen */}
        <mesh position={[0, 1.4, 0.35]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshPhysicalMaterial
            color="#94a3b8"
            transparent
            opacity={0.35}
            roughness={0.6}
            transmission={0.6}
          />
        </mesh>
      </group>

      {/* Rototag Wall Clock (Frozen at 03:17) */}
      <group position={[0, 2.5, 2.88]}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.03]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Hour Hand at 3 */}
        <mesh position={[0.07, 0, -0.04]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.12, 0.02, 0.01]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Minute Hand at ~17 mins (approx -0.35 rad) */}
        <mesh position={[0.08, -0.06, -0.04]} rotation={[0, 0, -0.55]}>
          <boxGeometry args={[0.16, 0.015, 0.01]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Abandoned Overturned Wheelchair */}
      <group position={[-2.5, 0.25, -1.5]} rotation={[0.4, 0.2, 1.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.45, 0.45, 0.4]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>

      {/* Cork Bulletin Board with Evacuation Directive 44-B */}
      <group position={[-2.4, 1.4, 1.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.04]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
      </group>

      {/* Reception Lighting: Sickly 60Hz greenish fluorescent tube */}
      <pointLight
        position={[0, 3.2, 0]}
        color="#a7f3d0"
        intensity={1.5}
        distance={9.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. Area 2: Patient Ward
// ---------------------------------------------------------------------------

const PatientWardArea: React.FC = () => {
  return (
    <group position={[0, 0, 1.0]}>
      {/* Ward Floor (12m x 8m) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12.0, 8.0]} />
        <meshStandardMaterial color="#1e2630" roughness={0.65} metalness={0.3} />
      </mesh>

      {/* Ward Ceiling (Height 3.6m) */}
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[12.0, 8.0]} />
        <meshStandardMaterial color="#080c12" roughness={0.9} />
      </mesh>

      {/* East & West Perimeter Walls with Doorway Cutouts */}
      {/* West Wall: Doorway to Isolation Room (Z in [0, 2], height 2.4m) */}
      <mesh position={[-6.0, 1.8, -2.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 3.0]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[-6.0, 1.8, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 2.0]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[-6.0, 3.0, 1.0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 1.2, 2.0]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>

      {/* East Wall: Solid partition */}
      <mesh position={[6.0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 8.0]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>

      {/* North Wall: Doorway to Observation Room (X in [-1.2, 1.2]) */}
      <mesh position={[-3.6, 1.8, -4.0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[3.6, 1.8, -4.0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, -4.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.8, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>

      {/* South Wall: Doorway from Reception (X in [-1.2, 1.2]) */}
      <mesh position={[-3.6, 1.8, 4.0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[3.6, 1.8, 4.0]} receiveShadow castShadow>
        <boxGeometry args={[4.8, 3.6, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, 4.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.8, 0.2]} />
        <meshStandardMaterial color="#131a24" roughness={0.85} />
      </mesh>

      {/* Six Clinical Hospital Beds with Leather Restraints */}
      {[
        { pos: [3.5, 0, 2.5] as const, isTargetBed: true, label: 'BED 07' },
        { pos: [3.5, 0, 0.8] as const, isTargetBed: false, label: 'BED 08' },
        { pos: [3.5, 0, -1.0] as const, isTargetBed: false, label: 'BED 09' },
        { pos: [-3.5, 0, 2.5] as const, isTargetBed: false, label: 'BED 04' },
        { pos: [-3.5, 0, 0.8] as const, isTargetBed: false, label: 'BED 05' },
        { pos: [-3.5, 0, -1.0] as const, isTargetBed: false, label: 'BED 06' },
      ].map((b, idx) => (
        <group key={`ward-bed-${idx}`} position={b.pos}>
          {/* Iron Bed Frame */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.12, 2.0]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Mattress */}
          <mesh position={[0, 0.54, 0]} receiveShadow>
            <boxGeometry args={[1.0, 0.16, 1.9]} />
            <meshStandardMaterial
              color={b.isTargetBed ? '#3e2d2d' : '#475569'}
              roughness={0.9}
            />
          </mesh>
          {/* Headboard */}
          <mesh position={[0, 0.75, 0.95]} castShadow>
            <boxGeometry args={[1.1, 0.7, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Footboard */}
          <mesh position={[0, 0.6, -0.95]} castShadow>
            <boxGeometry args={[1.1, 0.4, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Leather Restraint Straps */}
          {[-0.4, 0.2].map((sz, sIdx) => (
            <mesh key={`strap-${sIdx}`} position={[0, 0.63, sz]}>
              <boxGeometry args={[1.04, 0.03, 0.08]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} />
            </mesh>
          ))}
          {/* Vital Sign CRT Monitor on Articulating Arm */}
          <group position={[0.7, 1.35, 0.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.32, 0.32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.5} />
            </mesh>
            {/* Monitor Phosphor Screen */}
            <mesh position={[-0.191, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[0.26, 0.22]} />
              <meshBasicMaterial
                color={b.isTargetBed ? '#22c55e' : '#0369a1'}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* Medication Dispenser Trolley holding Sedation Schedule */}
      <group position={[-2.8, 0, 0.0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.9, 0.55]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.91, 0]}>
          <boxGeometry args={[0.7, 0.03, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ambient Lighting: Amber baseboard lights + phosphor glow */}
      <pointLight
        position={[0, 1.2, 0]}
        color="#38bdf8"
        intensity={1.2}
        distance={10.0}
        decay={2}
      />
      <pointLight
        position={[3.5, 1.5, 2.5]}
        color="#22c55e"
        intensity={0.8}
        distance={3.5}
        decay={2}
      />
      <ambientLight color="#0f172a" intensity={0.4} />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. Area 3: Isolation Room (Acoustic Deprivation Cell)
// ---------------------------------------------------------------------------

const IsolationRoomArea: React.FC = () => {
  return (
    <group position={[-9.0, 0, 1.0]}>
      {/* Padded Acoustic Floor (6m x 6m) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[6.0, 6.0]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.95} />
      </mesh>

      {/* Lower Ceiling (Height 3.2m) */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[6.0, 6.0]} />
        <meshStandardMaterial color="#090d14" roughness={0.98} />
      </mesh>

      {/* Quilted Vinyl Padded Walls */}
      {/* North & South Padded Walls */}
      <mesh position={[0, 1.6, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 3.2, 0.2]} />
        <meshStandardMaterial color="#2d323b" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.6, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 3.2, 0.2]} />
        <meshStandardMaterial color="#2d323b" roughness={0.92} />
      </mesh>

      {/* West Padded Wall with Scratched Runes */}
      <mesh position={[-3.0, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.2, 6.0]} />
        <meshStandardMaterial color="#2d323b" roughness={0.92} />
      </mesh>

      {/* East Wall with Heavy Reinforced Doorway (Z in [0, 2]) */}
      <mesh position={[3.0, 1.6, -1.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.2, 3.0]} />
        <meshStandardMaterial color="#1e2430" roughness={0.8} />
      </mesh>
      <mesh position={[3.0, 1.6, 2.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.2, 1.0]} />
        <meshStandardMaterial color="#1e2430" roughness={0.8} />
      </mesh>
      <mesh position={[3.0, 2.8, 0.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 0.8, 2.0]} />
        <meshStandardMaterial color="#1e2430" roughness={0.8} />
      </mesh>

      {/* Cast Iron Floor Drain under chair */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.28, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Central Bolted Metal Examination Chair */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.08, 0.65]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.95, -0.28]} castShadow>
          <boxGeometry args={[0.65, 0.9, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Armrests with Wrist Restraints */}
        {[-0.34, 0.34].map((ax, aIdx) => (
          <mesh key={`arm-${aIdx}`} position={[ax, 0.72, 0]}>
            <boxGeometry args={[0.08, 0.05, 0.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Metal Side Table holding Cassette Player & Transcript */}
      <group position={[0.2, 0, -0.2]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.85, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Harsh Recessed Sodium Spotlight directly over chair */}
      <spotLight
        position={[0, 3.1, 0]}
        target-position={[0, 0, 0]}
        color="#fbbf24"
        intensity={3.5}
        angle={Math.PI / 5}
        penumbra={0.7}
        distance={6.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 5. Area 4: Observation Room (Surveillance & Control)
// ---------------------------------------------------------------------------

const ObservationRoomArea: React.FC = () => {
  const reel1Ref = useRef<THREE.Group>(null!)
  const reel2Ref = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (reel1Ref.current) reel1Ref.current.rotation.z += delta * 1.5
    if (reel2Ref.current) reel2Ref.current.rotation.z += delta * 1.5
  })

  return (
    <group position={[0, 0, -7.0]}>
      {/* Observation Room Floor (10m x 6m) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10.0, 6.0]} />
        <meshStandardMaterial color="#141a22" roughness={0.75} metalness={0.3} />
      </mesh>

      {/* Ceiling (Height 3.6m) */}
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[10.0, 6.0]} />
        <meshStandardMaterial color="#090d14" roughness={0.9} />
      </mesh>

      {/* South Wall with One-Way Observation Window overlooking Patient Ward */}
      <mesh position={[-3.8, 1.8, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[3.8, 1.8, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      {/* Central One-Way Mirror Glass (5.2m wide) */}
      <mesh position={[0, 1.8, 3.0]}>
        <planeGeometry args={[5.2, 1.8]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.08}
          metalness={0.95}
          transmission={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* West Wall: Solid Partition */}
      <mesh position={[-5.0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 6.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* East Wall with Doorway to Records Archive (Z in [-1.0, 1.0]) */}
      <mesh position={[5.0, 1.8, -2.0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 2.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[5.0, 1.8, 2.0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 2.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[5.0, 3.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 1.2, 2.0]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* North Wall with Central Doorway to Decon Exit (X in [-1.2, 1.2]) */}
      <mesh position={[-3.2, 1.8, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[3.6, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[3.2, 1.8, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[3.6, 3.6, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.2, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.8, 0.2]} />
        <meshStandardMaterial color="#121820" roughness={0.85} />
      </mesh>

      {/* Master CCTV Surveillance Monitor Bank (6 screens) */}
      <group position={[0, 0, -1.8]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.1, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Tiered CRT Monitor Array */}
        {[-1.4, -0.5, 0.5, 1.4].map((mx, mIdx) => (
          <group key={`cctv-${mIdx}`} position={[mx, 1.35, -0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.65, 0.52, 0.45]} />
              <meshStandardMaterial color="#0f172a" roughness={0.6} />
            </mesh>
            {/* Active CRT Display Loop */}
            <mesh position={[0, 0, 0.231]}>
              <planeGeometry args={[0.54, 0.42]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.92} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Reel-to-Reel Tape Deck Console */}
      <group position={[-2.8, 0.95, -0.6]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.1, 0.6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Two Animated Spinning Tape Reels */}
        <group ref={reel1Ref} position={[-0.3, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </group>
        <group ref={reel2Ref} position={[0.3, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </group>
      </group>

      {/* Observation Desk holding Dr. Vance's Notes */}
      <group position={[3.2, 0, 0.5]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.85, 0.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      </group>

      {/* Lighting: Teal ambient glow from CCTV array */}
      <pointLight
        position={[0, 1.8, -1.2]}
        color="#0284c7"
        intensity={2.2}
        distance={7.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 6. Area 5: Medical Records Archive
// ---------------------------------------------------------------------------

const MedicalRecordsArchiveArea: React.FC = () => {
  return (
    <group position={[9.0, 0, -7.0]}>
      {/* Archive Floor (8m x 8m) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8.0, 8.0]} />
        <meshStandardMaterial color="#181e26" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Ceiling (Height 3.6m) */}
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[8.0, 8.0]} />
        <meshStandardMaterial color="#0a0e14" roughness={0.9} />
      </mesh>

      {/* Perimeter Walls */}
      {/* North & South Walls */}
      <mesh position={[0, 1.8, -4.0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.8, 4.0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 3.6, 0.2]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>
      {/* East Wall */}
      <mesh position={[4.0, 1.8, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 8.0]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>
      {/* West Wall with Doorway to Observation (Z in [-1.0, 1.0]) */}
      <mesh position={[-4.0, 1.8, -2.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 3.0]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>
      <mesh position={[-4.0, 1.8, 2.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.6, 3.0]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>
      <mesh position={[-4.0, 3.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 1.2, 2.0]} />
        <meshStandardMaterial color="#131822" roughness={0.85} />
      </mesh>

      {/* High Rolling Steel Compactor Filing Racks */}
      {[-2.5, -1.0, 0.5, 2.0].map((rz, rIdx) => (
        <group key={`compactor-${rIdx}`} position={[0.5, 0, rz]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.8, 3.1, 0.8]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Mechanical Wheel Crank on Side */}
          <mesh position={[-2.45, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Examination Desk holding Banker Lamp & Altered Staff Photo */}
      <group position={[1.5, 0, 1.0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.85, 0.9]} />
          <meshStandardMaterial color="#1f1812" roughness={0.7} />
        </mesh>
        {/* Classic Green Banker Lamp */}
        <group position={[0.6, 0.88, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.36, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} />
          </mesh>
          {/* Green Glass Shade */}
          <mesh position={[0, 0.38, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.24, 0.1, 0.14]} />
            <meshPhysicalMaterial
              color="#15803d"
              roughness={0.2}
              transmission={0.5}
              emissive="#16a34a"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Warm Lamp Downlight */}
          <pointLight
            position={[0, 0.32, 0]}
            color="#86efac"
            intensity={2.2}
            distance={3.2}
            decay={2}
          />
        </group>
      </group>

      {/* Steel Security Locker holding Pre-signed Autopsy Records */}
      <group position={[2.8, 0, 2.5]}>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 2.0, 0.6]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* Microfiche Viewer Terminal in Corner */}
      <group position={[-2.8, 0, 2.8]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.8, 1.1, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.3, 0]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[0.45, 0.35]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Overhead Lighting */}
      <pointLight
        position={[0, 3.2, 0]}
        color="#e2e8f0"
        intensity={1.2}
        distance={8.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 7. Area 6: Ward 13 Final Exit / Decontamination Airlock
// ---------------------------------------------------------------------------

const DecontaminationExitArea: React.FC = () => {
  return (
    <group position={[0, 0, -14.5]}>
      {/* Airlock Floor (7m x 6m): Brushed Stainless Steel Grate */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[7.0, 6.0]} />
        <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Ceiling (Height 3.8m) */}
      <mesh position={[0, 3.8, 0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[7.0, 6.0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* East & West Industrial Walls with Yellow Hazard Striping */}
      <mesh position={[-3.5, 1.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.8, 6.0]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[3.5, 1.9, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 3.8, 6.0]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* South Entrance Airlock Bulkhead Wall (Z = +3.0) with Doorway */}
      <mesh position={[-2.3, 1.9, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 3.8, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[2.3, 1.9, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 3.8, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.3, 3.0]} receiveShadow castShadow>
        <boxGeometry args={[2.2, 1.0, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* North Exterior Escape Bulkhead (Z = -3.0): Sealed Heavy Blast Door */}
      <mesh position={[0, 1.9, -3.0]} receiveShadow castShadow>
        <boxGeometry args={[7.0, 3.8, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Heavy Pneumatic Wheel Latch on Final Door */}
      <group position={[0, 1.8, -2.75]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.42, 0.05, 16, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.9, 0.06, 0.04]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>

      {/* Central Diagnostic Terminal Pedestal */}
      <group position={[0, 0, 0.3]}>
        {/* Steel Pedestal Base */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.45, 1.0, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Terminal Housing */}
        <mesh position={[0, 1.15, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.45]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Glowing Green Master CRT Screen */}
        <mesh position={[0, 1.2, 0.22]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.56, 0.38]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        {/* Terminal Screen Glow Light */}
        <pointLight
          position={[0, 1.3, 0.6]}
          color="#22c55e"
          intensity={2.8}
          distance={4.5}
          decay={2}
        />
      </group>

      {/* Emergency Amber Warning Beacons */}
      <pointLight
        position={[0, 3.4, 0]}
        color="#f59e0b"
        intensity={2.2}
        distance={8.0}
        decay={2}
      />
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8. Connecting Security Corridors & Transfer Hallways
// ---------------------------------------------------------------------------

const ConnectingCorridors: React.FC = () => {
  return (
    <group>
      {/* Corridor 1: Reception -> Patient Ward (Z in [5.0, 7.0], width 2.4m) */}
      <mesh position={[0, 0, 6.0]} receiveShadow>
        <planeGeometry args={[2.4, 2.0]} />
        <meshStandardMaterial color="#1a2228" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.6, 6.0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.4, 2.0]} />
        <meshStandardMaterial color="#0b0f14" roughness={0.9} />
      </mesh>
      <mesh position={[-1.2, 1.8, 6.0]}>
        <boxGeometry args={[0.1, 3.6, 2.0]} />
        <meshStandardMaterial color="#121820" />
      </mesh>
      <mesh position={[1.2, 1.8, 6.0]}>
        <boxGeometry args={[0.1, 3.6, 2.0]} />
        <meshStandardMaterial color="#121820" />
      </mesh>

      {/* Corridor 2: Patient Ward -> Isolation Room (X in [-7.2, -5.8], Z in [0, 2]) */}
      <mesh position={[-6.5, 0, 1.0]} receiveShadow>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.9} />
      </mesh>
      <mesh position={[-6.5, 3.4, 1.0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial color="#090d14" />
      </mesh>
      <mesh position={[-6.5, 1.7, 2.0]}>
        <boxGeometry args={[1.4, 3.4, 0.1]} />
        <meshStandardMaterial color="#131a24" />
      </mesh>
      <mesh position={[-6.5, 1.7, 0.0]}>
        <boxGeometry args={[1.4, 3.4, 0.1]} />
        <meshStandardMaterial color="#131a24" />
      </mesh>

      {/* Corridor 3: Patient Ward -> Observation Room (Z in [-4.0, -3.0], width 2.4m) */}
      <mesh position={[0, 0, -3.5]} receiveShadow>
        <planeGeometry args={[2.4, 1.0]} />
        <meshStandardMaterial color="#1e2630" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.6, -3.5]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.4, 1.0]} />
        <meshStandardMaterial color="#080c12" />
      </mesh>
      <mesh position={[-1.2, 1.8, -3.5]}>
        <boxGeometry args={[0.1, 3.6, 1.0]} />
        <meshStandardMaterial color="#131a24" />
      </mesh>
      <mesh position={[1.2, 1.8, -3.5]}>
        <boxGeometry args={[0.1, 3.6, 1.0]} />
        <meshStandardMaterial color="#131a24" />
      </mesh>

      {/* Corridor 4: Observation Room -> Records Archive (X in [4.8, 6.2], Z in [-7.6, -6.4]) */}
      <mesh position={[5.5, 0, -7.0]} receiveShadow>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial color="#181e26" roughness={0.75} />
      </mesh>
      <mesh position={[5.5, 3.6, -7.0]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshStandardMaterial color="#090d14" />
      </mesh>
      <mesh position={[5.5, 1.8, -6.3]}>
        <boxGeometry args={[1.4, 3.6, 0.1]} />
        <meshStandardMaterial color="#121820" />
      </mesh>
      <mesh position={[5.5, 1.8, -7.7]}>
        <boxGeometry args={[1.4, 3.6, 0.1]} />
        <meshStandardMaterial color="#121820" />
      </mesh>

      {/* Corridor 5: Observation Room -> Decon Exit (Z in [-11.5, -10.0], width 2.4m) */}
      <mesh position={[0, 0, -10.75]} receiveShadow>
        <planeGeometry args={[2.4, 1.5]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      <mesh position={[0, 3.7, -10.75]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[2.4, 1.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-1.2, 1.85, -10.75]}>
        <boxGeometry args={[0.1, 3.7, 1.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[1.2, 1.85, -10.75]}>
        <boxGeometry args={[0.1, 3.7, 1.5]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8b. Physical Security Doors with Clearance & Status Indicators
// ---------------------------------------------------------------------------

interface SecurityDoorsProps {
  unlockedRoomIds: Ward13RoomId[]
}

const SecurityDoors: React.FC<SecurityDoorsProps> = ({
  unlockedRoomIds,
}) => {
  const isPatientWardUnlocked = unlockedRoomIds.includes('patient_ward')
  const isIsolationUnlocked = unlockedRoomIds.includes('isolation_room')
  const isObservationUnlocked = unlockedRoomIds.includes('observation_room')
  const isArchiveUnlocked = unlockedRoomIds.includes('records_archive')
  const isDeconExitUnlocked = unlockedRoomIds.includes('decon_exit')

  return (
    <group>
      {/* 1. Reception -> Patient Ward Security Shutter (Corridor 1, Z = 6.0) */}
      <group position={[0, 0, 6.0]}>
        {/* Door frame */}
        <mesh position={[-1.25, 1.8, 0]}>
          <boxGeometry args={[0.2, 3.6, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[1.25, 1.8, 0]}>
          <boxGeometry args={[0.2, 3.6, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[2.7, 0.2, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Shutter Gate: Retracted up (Y=3.3) if unlocked, down (Y=1.7) if locked */}
        <mesh position={[0, isPatientWardUnlocked ? 3.3 : 1.7, 0]}>
          <boxGeometry args={[2.3, isPatientWardUnlocked ? 0.4 : 3.2, 0.1]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.8}
            roughness={0.4}
            wireframe={!isPatientWardUnlocked}
          />
        </mesh>
        {/* Status Indicator LED Panel */}
        <mesh position={[1.1, 2.0, 0.22]}>
          <boxGeometry args={[0.15, 0.3, 0.05]} />
          <meshStandardMaterial
            color={isPatientWardUnlocked ? '#22c55e' : '#ef4444'}
            emissive={isPatientWardUnlocked ? '#15803d' : '#b91c1c'}
            emissiveIntensity={1.5}
          />
        </mesh>
        <pointLight
          position={[1.1, 2.0, 0.3]}
          color={isPatientWardUnlocked ? '#22c55e' : '#ef4444'}
          intensity={0.8}
          distance={2.5}
        />
      </group>

      {/* 2. Patient Ward -> Isolation Vault Door (Corridor 2, X = -6.5, Z = 1.0) */}
      <group position={[-6.5, 0, 1.0]}>
        {/* Frame */}
        <mesh position={[0, 1.7, 1.05]}>
          <boxGeometry args={[0.4, 3.4, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.7, -1.05]}>
          <boxGeometry args={[0.4, 3.4, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Vault door panel */}
        <mesh
          position={[0, 1.7, isIsolationUnlocked ? 0.9 : 0]}
          rotation={[0, isIsolationUnlocked ? Math.PI * 0.45 : 0, 0]}
        >
          <boxGeometry args={[0.12, 3.2, 1.9]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Status Light */}
        <mesh position={[0.22, 2.0, 0.9]}>
          <boxGeometry args={[0.05, 0.2, 0.2]} />
          <meshStandardMaterial
            color={isIsolationUnlocked ? '#22c55e' : '#ef4444'}
            emissive={isIsolationUnlocked ? '#15803d' : '#b91c1c'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 3. Patient Ward -> Observation Bulkhead (Corridor 3, Z = -3.5) */}
      <group position={[0, 0, -3.5]}>
        <mesh position={[-1.25, 1.8, 0]}>
          <boxGeometry args={[0.2, 3.6, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[1.25, 1.8, 0]}>
          <boxGeometry args={[0.2, 3.6, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Sliding panels: parted if unlocked, closed at center if locked */}
        <mesh position={[isObservationUnlocked ? -1.0 : -0.55, 1.7, 0]}>
          <boxGeometry args={[1.1, 3.2, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.4} />
        </mesh>
        <mesh position={[isObservationUnlocked ? 1.0 : 0.55, 1.7, 0]}>
          <boxGeometry args={[1.1, 3.2, 0.08]} />
          <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.4} />
        </mesh>
        {/* Indicator */}
        <mesh position={[1.1, 2.0, 0.18]}>
          <boxGeometry args={[0.12, 0.25, 0.05]} />
          <meshStandardMaterial
            color={isObservationUnlocked ? '#22c55e' : '#ef4444'}
            emissive={isObservationUnlocked ? '#15803d' : '#b91c1c'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 4. Observation -> Records Archive Gate (Corridor 4, X = 5.5, Z = -7.0) */}
      <group position={[5.5, 0, -7.0]}>
        <mesh position={[0, 1.8, -0.75]}>
          <boxGeometry args={[0.3, 3.6, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.8, 0.75]}>
          <boxGeometry args={[0.3, 3.6, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {/* Sliding gate panel */}
        <mesh position={[0, 1.7, isArchiveUnlocked ? -0.65 : 0]}>
          <boxGeometry args={[0.08, 3.2, isArchiveUnlocked ? 0.3 : 1.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Indicator */}
        <mesh position={[-0.18, 2.0, -0.6]}>
          <boxGeometry args={[0.05, 0.2, 0.15]} />
          <meshStandardMaterial
            color={isArchiveUnlocked ? '#22c55e' : '#ef4444'}
            emissive={isArchiveUnlocked ? '#15803d' : '#b91c1c'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 5. Observation -> Decontamination Blast Airlock (Corridor 5, Z = -10.75) */}
      <group position={[0, 0, -10.75]}>
        <mesh position={[-1.25, 1.85, 0]}>
          <boxGeometry args={[0.2, 3.7, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[1.25, 1.85, 0]}>
          <boxGeometry args={[0.2, 3.7, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Heavy pneumatic blast door */}
        <mesh position={[0, isDeconExitUnlocked ? 3.4 : 1.7, 0]}>
          <boxGeometry args={[2.3, isDeconExitUnlocked ? 0.4 : 3.3, 0.16]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
        {/* Hazard warning stripes on door */}
        {!isDeconExitUnlocked && (
          <mesh position={[0, 1.7, 0.09]}>
            <planeGeometry args={[2.2, 0.4]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
        )}
        {/* Overhead Airlock Beacon */}
        <mesh position={[0, 3.5, 0.25]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 12]} />
          <meshStandardMaterial
            color={isDeconExitUnlocked ? '#22c55e' : '#ef4444'}
            emissive={isDeconExitUnlocked ? '#15803d' : '#b91c1c'}
            emissiveIntensity={2.0}
          />
        </mesh>
        <pointLight
          position={[0, 3.5, 0.4]}
          color={isDeconExitUnlocked ? '#22c55e' : '#ef4444'}
          intensity={1.2}
          distance={4.0}
        />
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8c. Deduction & Contradiction Analysis Terminals in 3D Space
// ---------------------------------------------------------------------------

const DEDUCTION_STATIONS_DATA: Array<{
  id: string
  name: string
  position: [number, number, number]
}> = [
  { id: 'station_reception', name: 'ADMISSIONS DEDUCTION DESK', position: [0.0, 0.85, 8.8] },
  { id: 'station_patient_ward', name: 'TELEMETRY ANALYSIS STATION', position: [0.0, 0.85, 0.8] },
  { id: 'station_observation', name: 'SURVEILLANCE ANALYSIS CONSOLE', position: [0.0, 0.85, -6.2] },
  { id: 'station_archive', name: 'ARCHIVE RECONSTRUCTION TABLE', position: [8.5, 0.85, -6.5] },
]

const DeductionStations: React.FC = () => {
  return (
    <group>
      {DEDUCTION_STATIONS_DATA.map((st) => (
        <group key={st.id} position={st.position}>
          {/* Terminal Desk Stand */}
          <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.35, 0.8, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>

          {/* Glowing CRT Monitor Housing */}
          <mesh position={[0, 0.12, 0]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.55, 0.38, 0.35]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* CRT Screen with Green Phosphor Glow */}
          <mesh position={[0, 0.13, 0.18]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.46, 0.28]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.8}
              roughness={0.2}
            />
          </mesh>

          {/* 3D Floating Label */}
          <Text
            position={[0, 0.45, 0]}
            fontSize={0.09}
            color="#34d399"
            anchorX="center"
            anchorY="middle"
          >
            [E] DEDUCTION TERMINAL
          </Text>

          {/* Ambient Terminal Illumination */}
          <pointLight
            position={[0, 0.2, 0.3]}
            color="#10b981"
            intensity={0.7}
            distance={2.8}
          />
        </group>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 9. Main Exported 3D Arena Component: TheWard13Arena
// ---------------------------------------------------------------------------

export interface TheWard13ArenaProps {
  collectedEvidenceIds?: string[]
  currentRoomId?: Ward13RoomId
  unlockedRoomIds?: Ward13RoomId[]
  clearanceLevel?: number
}

export const TheWard13Arena: React.FC<TheWard13ArenaProps> = ({
  collectedEvidenceIds = [],
  unlockedRoomIds = ['reception'],
}) => {
  const collectedSet = useMemo(
    () => new Set(collectedEvidenceIds),
    [collectedEvidenceIds]
  )

  return (
    <>
      {/* 1. Psychological Horror Atmosphere & Volumetric Fog */}
      <color attach="background" args={['#020408']} />
      <fog attach="fog" args={['#020408', 3.0, 22.0]} />

      {/* 2. Global Institutional Ambient Illumination */}
      <ambientLight color="#0b1320" intensity={0.5} />

      {/* 3. Six Hospital Floor Rooms */}
      <HospitalReceptionArea />
      <PatientWardArea />
      <IsolationRoomArea />
      <ObservationRoomArea />
      <MedicalRecordsArchiveArea />
      <DecontaminationExitArea />

      {/* 4. Interconnecting Security Corridors */}
      <ConnectingCorridors />

      {/* 4b. Security Doors with Physical State & Lights */}
      <SecurityDoors unlockedRoomIds={unlockedRoomIds} />

      {/* 4c. Deduction & Analysis Terminals */}
      <DeductionStations />

      {/* 5. Twelve Canonical Evidence Clue Props Placed in 3D Space */}
      {WARD13_EVIDENCE.map((item) => {
        const isCollected = collectedSet.has(item.id)
        return (
          <EvidenceStand
            key={item.id}
            id={item.id}
            title={item.title}
            category={item.category}
            position={item.worldPosition}
          >
            {/* Contextual 3D Representation for Item */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.32, 0.04, 0.24]} />
              <meshStandardMaterial
                color={isCollected ? '#0284c7' : '#f8fafc'}
                roughness={0.5}
                emissive={isCollected ? '#0369a1' : '#000000'}
                emissiveIntensity={isCollected ? 0.6 : 0.0}
              />
            </mesh>
          </EvidenceStand>
        )
      })}
    </>
  )
}
