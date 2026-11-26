/**
 * Game 10: THE FORGOTTEN GAME - Atmospheric 3D Lighting & Fog
 * Theme: Psychological Horror, Memory Manipulation, Distorted History.
 *
 * Restrained brutalist lighting setup:
 * - Oppressive cold void background and dense depth fog (#02050b).
 * - Cold cyan/white architectural light strips along the Hall of Mirrors.
 * - Subtle red and green thematic lighting in Memory Wing 01 (Observation).
 * - Sterile clinical pale-cyan illumination in Memory Wing 02 (Archival).
 * - Industrial amber and optical pulse in Memory Wing 03 (Command Verdict).
 * - Cognitive pulsing cyan core light and crimson diagnostic accents in the Memory Core Chamber.
 */

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ForgottenGameLighting: React.FC = () => {
  const coreLightRef = useRef<THREE.PointLight>(null!)
  const wing01BeaconRef = useRef<THREE.PointLight>(null!)
  const opticalPulseRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Memory Core Chamber: cognitive pulsing rhythm of the suspended core
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.35 + Math.sin(t * 2.2) * 0.35
    }

    // Wing 01 (The First Rule): subtle observation cycle pulse
    if (wing01BeaconRef.current) {
      wing01BeaconRef.current.intensity = 0.5 + Math.sin(t * 1.8) * 0.2
    }

    // Wing 03 (Command Verdict): severed optical trunk flickering telemetry
    if (opticalPulseRef.current) {
      const flicker = (Math.sin(t * 9.5) * Math.cos(t * 6.2)) * 0.08
      opticalPulseRef.current.intensity = 0.55 + flicker
    }
  })

  return (
    <group name="forgotten-game-lighting">
      {/* Cold, oppressive void background and depth fog */}
      <color attach="background" args={['#02050b']} />
      <fog attach="fog" args={['#02050b', 3.5, 28.0]} />

      {/* Global low-intensity brutalist ambient fill */}
      <ambientLight color="#0a1220" intensity={0.32} />

      {/* ===================================================================
          1. HALL OF DISTORTED MIRRORS (Z = 22.0 to -4.0)
          =================================================================== */}
      {/* South Entrance Sealed Blast Door Warning Light (Z = 21.0) */}
      <pointLight
        position={[0, 3.2, 21.0]}
        color="#ef4444"
        intensity={0.45}
        distance={6.0}
        decay={2}
      />

      {/* Corridor Overhead Downlights (Cyan/White architectural illumination) */}
      <pointLight
        position={[0, 3.8, 16.0]}
        color="#38bdf8"
        intensity={0.7}
        distance={7.5}
        decay={2}
      />
      <pointLight
        position={[0, 3.8, 10.0]}
        color="#38bdf8"
        intensity={0.65}
        distance={7.5}
        decay={2}
      />
      <pointLight
        position={[0, 3.8, 4.0]}
        color="#38bdf8"
        intensity={0.65}
        distance={7.5}
        decay={2}
      />
      <pointLight
        position={[0, 3.8, -1.0]}
        color="#38bdf8"
        intensity={0.7}
        distance={7.5}
        decay={2}
      />

      {/* Directional Corridor Fill */}
      <directionalLight
        position={[0, 5.0, 10.0]}
        color="#1e293b"
        intensity={0.35}
      />

      {/* ===================================================================
          2. MEMORY WING 01 — THE FIRST RULE (Observation Sector, West)
          =================================================================== */}
      {/* Connector Portal Lamp */}
      <pointLight
        position={[-3.5, 3.0, 10.0]}
        color="#10b981"
        intensity={0.4}
        distance={5.0}
        decay={2}
      />
      {/* Main Chamber Ambient Observation Green */}
      <pointLight
        position={[-14.0, 3.2, 10.0]}
        color="#10b981"
        intensity={0.65}
        distance={8.5}
        decay={2}
      />
      {/* Aperture Warning Beacon (Pulsing Red / Vigilance) */}
      <pointLight
        ref={wing01BeaconRef}
        position={[-17.2, 2.5, 10.0]}
        color="#ef4444"
        intensity={0.5}
        distance={6.0}
        decay={2}
      />

      {/* ===================================================================
          3. MEMORY WING 02 — THE FORGOTTEN NAME (Hospital Registry, East)
          =================================================================== */}
      {/* Connector Portal Lamp */}
      <pointLight
        position={[3.5, 3.0, 2.0]}
        color="#e0f2fe"
        intensity={0.4}
        distance={5.0}
        decay={2}
      />
      {/* Main Chamber Sterile Clinical Pale-Cyan */}
      <pointLight
        position={[14.0, 3.2, 2.0]}
        color="#e0f2fe"
        intensity={0.75}
        distance={8.5}
        decay={2}
      />
      {/* Filing Monolith Focus Light */}
      <pointLight
        position={[16.5, 2.2, 2.0]}
        color="#38bdf8"
        intensity={0.45}
        distance={5.5}
        decay={2}
      />

      {/* ===================================================================
          4. MEMORY WING 03 — THE COMMAND VERDICT (Optical Relay, West)
          =================================================================== */}
      {/* Connector Portal Lamp */}
      <pointLight
        position={[-3.5, 3.0, 0.0]}
        color="#f59e0b"
        intensity={0.4}
        distance={5.0}
        decay={2}
      />
      {/* Main Chamber Industrial Amber Warning */}
      <pointLight
        position={[-14.0, 3.2, 0.0]}
        color="#f59e0b"
        intensity={0.7}
        distance={8.5}
        decay={2}
      />
      {/* Severed Optical Trunk Bus Glow (Pulsing Cyan) */}
      <pointLight
        ref={opticalPulseRef}
        position={[-17.0, 2.2, 0.0]}
        color="#06b6d4"
        intensity={0.55}
        distance={5.5}
        decay={2}
      />

      {/* ===================================================================
          5. MEMORY CORE CHAMBER (Terminal Sanctuary, North)
          =================================================================== */}
      {/* Grand Chamber Overhead Directional Wash */}
      <directionalLight
        position={[0, 7.0, -16.0]}
        color="#0284c7"
        intensity={0.45}
      />

      {/* Central Suspended Memory Core Cognitive Point Light */}
      <pointLight
        ref={coreLightRef}
        position={[0, 3.2, -16.0]}
        color="#06b6d4"
        intensity={1.4}
        distance={18.0}
        decay={2}
      />

      {/* Dais Floor Glow */}
      <pointLight
        position={[0, 0.4, -16.0]}
        color="#0284c7"
        intensity={0.6}
        distance={6.0}
        decay={2}
      />

      {/* Four Support Pillar Diagnostic Crimson Accent Fixtures */}
      <pointLight
        position={[-6.8, 3.0, -21.8]}
        color="#dc2626"
        intensity={0.35}
        distance={5.0}
        decay={2}
      />
      <pointLight
        position={[6.8, 3.0, -21.8]}
        color="#dc2626"
        intensity={0.35}
        distance={5.0}
        decay={2}
      />
      <pointLight
        position={[-6.8, 3.0, -10.2]}
        color="#dc2626"
        intensity={0.35}
        distance={5.0}
        decay={2}
      />
      <pointLight
        position={[6.8, 3.0, -10.2]}
        color="#dc2626"
        intensity={0.35}
        distance={5.0}
        decay={2}
      />
    </group>
  )
}
