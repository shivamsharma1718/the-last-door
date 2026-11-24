/**
 * Game 09: THE CONTROL ROOM - Dedicated Lighting & Environmental Atmospherics
 * Cold War brutalist bunker lighting: cold cyan/blue CRT phosphor glow,
 * deep red industrial warning fixtures, emergency beacons, and low ambient fill.
 */

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ControlRoomLighting: React.FC = () => {
  const coreLightRef = useRef<THREE.PointLight>(null!)
  const alarmLightLeftRef = useRef<THREE.PointLight>(null!)
  const alarmLightRightRef = useRef<THREE.PointLight>(null!)
  const crtFlickerRef = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Area 7 System Core: rhythmic, cognitive pulsing light
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.3 + Math.sin(t * 2.4) * 0.4
    }

    // Subtle CRT monitor flicker in Area 3 (Surveillance)
    if (crtFlickerRef.current) {
      const flicker = (Math.sin(t * 11.0) * Math.cos(t * 7.0)) * 0.08
      crtFlickerRef.current.intensity = 0.85 + flicker
    }

    // Area 8 Bulkhead: warning emergency strobe pulse
    if (alarmLightLeftRef.current && alarmLightRightRef.current) {
      const pulse = 0.6 + Math.sin(t * 3.5) * 0.35
      alarmLightLeftRef.current.intensity = pulse
      alarmLightRightRef.current.intensity = pulse
    }
  })

  return (
    <>
      {/* Cold, suffocating bunker background color and dense atmospheric fog */}
      <color attach="background" args={['#040711']} />
      <fog attach="fog" args={['#040711', 3.5, 24.0]} />

      {/* Global low-intensity ambient fill */}
      <ambientLight color="#0a1220" intensity={0.35} />

      {/* Area 1: Entry Checkpoint (South, Z = 10.0) - Amber fluorescent tube */}
      <pointLight
        position={[0, 3.4, 10.0]}
        color="#f59e0b"
        intensity={0.8}
        distance={8.0}
        decay={2}
      />
      <pointLight
        position={[2.0, 2.2, 9.5]}
        color="#fde68a"
        intensity={0.4}
        distance={4.0}
        decay={2}
      />

      {/* Area 2: Central Command Dais (Z = 2.0) - Overhead cold surgical cyan */}
      <directionalLight
        position={[0, 4.0, 2.0]}
        target-position={[0, 0, 2.0]}
        color="#38bdf8"
        intensity={0.65}
      />
      <pointLight
        position={[0, 2.8, 2.0]}
        color="#0284c7"
        intensity={1.1}
        distance={9.0}
        decay={2}
      />

      {/* Area 3: Surveillance Bank (West, X = -8.5, Z = 2.0) - Phosphor CRT Green/Cyan */}
      <pointLight
        ref={crtFlickerRef}
        position={[-8.5, 2.6, 2.0]}
        color="#10b981"
        intensity={0.9}
        distance={8.5}
        decay={2}
      />

      {/* Area 4: Telemetry & Communications (East, X = 8.5, Z = 2.0) - Radio Cyan/Teal */}
      <pointLight
        position={[8.5, 2.6, 2.0]}
        color="#06b6d4"
        intensity={0.9}
        distance={8.5}
        decay={2}
      />

      {/* Area 5: Power Grid & Coolant (Northeast, X = 7.5, Z = -6.5) - Industrial Warning Amber */}
      <pointLight
        position={[7.5, 2.8, -6.5]}
        color="#f97316"
        intensity={1.0}
        distance={8.0}
        decay={2}
      />
      <pointLight
        position={[9.0, 1.8, -7.0]}
        color="#ef4444"
        intensity={0.6}
        distance={4.5}
        decay={2}
      />

      {/* Area 6: Logic Vault (Northwest, X = -7.5, Z = -6.5) - Fluorescent Cold White */}
      <pointLight
        position={[-7.5, 3.0, -6.5]}
        color="#cbd5e1"
        intensity={0.85}
        distance={8.0}
        decay={2}
      />
      <pointLight
        position={[-8.0, 1.8, -7.0]}
        color="#fbbf24"
        intensity={0.5}
        distance={4.0}
        decay={2}
      />

      {/* Area 7: Overseer System Core (Center North, X = 0, Z = -8.5) - Pulsing Cognitive Blue */}
      <pointLight
        ref={coreLightRef}
        position={[0, 2.2, -8.5]}
        color="#00f5ff"
        intensity={1.4}
        distance={10.5}
        decay={2}
      />
      <pointLight
        position={[0, 0.4, -8.5]}
        color="#0284c7"
        intensity={0.9}
        distance={6.0}
        decay={2}
      />

      {/* Area 8: Exit Bulkhead (Far North, X = 0, Z = -11.5) - Dual Emergency Strobes */}
      <pointLight
        ref={alarmLightLeftRef}
        position={[-2.4, 3.2, -11.4]}
        color="#dc2626"
        intensity={0.7}
        distance={6.0}
        decay={2}
      />
      <pointLight
        ref={alarmLightRightRef}
        position={[2.4, 3.2, -11.4]}
        color="#dc2626"
        intensity={0.7}
        distance={6.0}
        decay={2}
      />
    </>
  )
}
