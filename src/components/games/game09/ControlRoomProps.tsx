/**
 * Game 09: THE CONTROL ROOM - Physical Environment Props & Evidence Instruments
 * Implements realistic Cold War consoles, CCTV monitor array, oscilloscopes,
 * tape carousels, power grid cabinets, system core pillar, exit blast doors,
 * and all 8 physical evidence props at exact canonical coordinates.
 */

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useControlRoomStore } from './theControlRoomStore'

// ---------------------------------------------------------------------------
// 1. Interactive Evidence Stand & 3D Visual Identifier
// ---------------------------------------------------------------------------

interface EvidenceStandProps {
  id: string
  title: string
  position: [number, number, number]
  category: string
  children: React.ReactNode
}

const EvidenceMarker: React.FC<EvidenceStandProps> = ({
  title,
  position,
  children,
}) => {
  const [x, y, z] = position
  const markerRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const t = clock.getElapsedTime()
      markerRef.current.position.y = 0.08 + Math.sin(t * 3.0) * 0.02
      markerRef.current.rotation.y = t * 1.2
    }
  })

  return (
    <group position={[x, y, z]}>
      {/* 3D Floating Nameplate */}
      <Text
        position={[0, 0.45, 0]}
        fontSize={0.075}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        maxWidth={1.5}
        textAlign="center"
      >
        {title.toUpperCase()}
      </Text>

      {/* Floating Holographic Inspection Marker */}
      <mesh ref={markerRef} position={[0, 0.08, 0]}>
        <octahedronGeometry args={[0.045, 0]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>

      {/* Physical Evidence Geometry */}
      {children}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 2. Area 1: Entry Checkpoint Props
// ---------------------------------------------------------------------------

const EntryCheckpointProps: React.FC = () => {
  return (
    <group position={[0, 0, 10.0]}>
      {/* Heavy Steel Airlock Portal Frame (South Doorway at Z = 1.8 in local) */}
      <group position={[0, 1.4, 1.8]}>
        <mesh>
          <boxGeometry args={[4.2, 3.0, 0.3]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Yellow/Black Warning Hazard Chevrons */}
        <mesh position={[0, 1.35, 0.16]}>
          <boxGeometry args={[3.8, 0.18, 0.02]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* Security Checkpoint Desk (East side of entry) */}
      <group position={[2.0, 0.45, -0.4]}>
        {/* Metal Desk Body */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.8, 0.9, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.4} />
        </mesh>
        {/* Desk Lamp */}
        <mesh position={[-0.6, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, 0.85, 0]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.12, 0.2, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Desk Lamp Light Bulb */}
        <mesh position={[-0.6, 0.8, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Scattered Paper Dossiers */}
        <mesh position={[0.2, 0.46, 0.1]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.46, -0.15]} rotation={[0, -0.15, 0]}>
          <boxGeometry args={[0.3, 0.015, 0.4]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
        {/* Checkpoint Status CRT Screen */}
        <group position={[-0.1, 0.7, -0.2]}>
          <mesh>
            <boxGeometry args={[0.45, 0.35, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.18]}>
            <planeGeometry args={[0.38, 0.28]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      </group>

      {/* Wall-Mounted Decontamination Airlock Switchbox (West side) */}
      <group position={[-2.4, 1.5, 1.7]}>
        <mesh>
          <boxGeometry args={[0.6, 0.9, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Red Emergency Lever */}
        <mesh position={[0, 0.1, 0.15]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 3. Area 2: Central Command Dais Props
// ---------------------------------------------------------------------------

const CentralCommandProps: React.FC = () => {
  return (
    <group position={[0, 0.16, 2.0]}>
      {/* Master Operations Console (3.8m wide, facing South toward spawn) */}
      <group position={[0, 0.45, 0]}>
        {/* Main Console Desk Base */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.9, 1.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.4} />
        </mesh>

        {/* Slanted Keyboard & Switch Panel Deck */}
        <mesh position={[0, 0.48, 0.2]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[3.6, 0.08, 0.75]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.5} />
        </mesh>

        {/* Dual Ergonomic Operator Keyboard Arrays */}
        <mesh position={[-0.8, 0.53, 0.2]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0.8, 0.53, 0.2]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.8, 0.02, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>

        {/* Tactile Rotary & Toggle Switch Banks */}
        <mesh position={[0, 0.53, 0.35]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.15]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Central Master Facility Schematic Screen Housing */}
        <group position={[0, 0.75, -0.3]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[1.3, 0.8, 0.35]} />
            <meshStandardMaterial color="#0b1320" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Main Glowing Facility Schematic Display */}
          <mesh position={[0, 0, 0.18]}>
            <planeGeometry args={[1.15, 0.68]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
          <Text
            position={[0, 0.22, 0.19]}
            fontSize={0.06}
            color="#38bdf8"
            anchorX="center"
          >
            PROJECT MORPHEUS: SECTORS 01-09
          </Text>
          <Text
            position={[0, -0.15, 0.19]}
            fontSize={0.045}
            color="#67e8f9"
            anchorX="center"
          >
            CO-DIRECTOR TERMINAL ALPHA // ONLINE
          </Text>
        </group>

        {/* Flanking Left CRT Screen (Status Telemetry) */}
        <group position={[-1.2, 0.72, -0.25]} rotation={[0, 0.2, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.8, 0.65, 0.3]} />
            <meshStandardMaterial color="#0b1320" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[0.7, 0.55]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <Text
            position={[0, 0.15, 0.17]}
            fontSize={0.05}
            color="#a7f3d0"
            anchorX="center"
          >
            SUB-SYSTEM DIAGNOSTICS
          </Text>
        </group>

        {/* Flanking Right CRT Screen (Security Directives) */}
        <group position={[1.2, 0.72, -0.25]} rotation={[0, -0.2, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.8, 0.65, 0.3]} />
            <meshStandardMaterial color="#0b1320" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[0.7, 0.55]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Text
            position={[0, 0.15, 0.17]}
            fontSize={0.05}
            color="#fecaca"
            anchorX="center"
          >
            OVERSEER DIRECTIVES
          </Text>
        </group>

        {/* Massive Floor Cable Conduit Bundle Feeding into Platform */}
        <mesh position={[0, -0.35, -0.75]}>
          <cylinderGeometry args={[0.18, 0.22, 0.4, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* Operator Heavy Swivel Chairs (Positioned South of console desk) */}
      {[-0.85, 0.85].map((xOffset, i) => (
        <group key={`chair-${i}`} position={[xOffset, 0.45, 1.2]} rotation={[0, Math.PI, 0]}>
          {/* Hydraulic Base Pedestal */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.4, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Seat Cushion */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.55, 0.1, 0.55]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.35, 0.24]}>
            <boxGeometry args={[0.5, 0.5, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// 4. Area 3: Surveillance Bank Props (West Wall)
// ---------------------------------------------------------------------------

const SurveillanceBankProps: React.FC = () => {
  return (
    <group position={[-11.2, 0, 2.0]}>
      {/* Main Multi-Monitor Video Wall Structure (6m wide, 3m tall) */}
      <group position={[0, 1.7, 0]}>
        {/* Steel Equipment Rack Chassis */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.1, 3.2, 6.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Array of 9 CRT Monitors (3 rows x 3 columns) */}
        {[-1.8, 0, 1.8].map((zPos, colIdx) =>
          [-0.85, 0.1, 1.05].map((yPos, rowIdx) => {
            const screenColors = ['#10b981', '#06b6d4', '#0284c7', '#38bdf8']
            const color = screenColors[(colIdx + rowIdx) % screenColors.length]
            return (
              <group key={`cctv-${colIdx}-${rowIdx}`} position={[0.56, yPos, zPos]}>
                {/* Monitor Bezel */}
                <mesh>
                  <boxGeometry args={[0.1, 0.72, 1.2]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                </mesh>
                {/* Active Screen Surface */}
                <mesh position={[0.06, 0, 0]}>
                  <planeGeometry args={[1.1, 0.64]} />
                  <meshBasicMaterial color={color} />
                </mesh>
                <Text
                  position={[0.07, 0.22, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  fontSize={0.05}
                  color="#ffffff"
                  anchorX="center"
                >
                  {`CAM-0${colIdx * 3 + rowIdx + 1} // REC`}
                </Text>
              </group>
            )
          })
        )}
      </group>

      {/* Video Switching & Patch Desk in front of the monitors */}
      <group position={[1.1, 0.45, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.9, 0.9, 5.8]} />
          <meshStandardMaterial color="#182230" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* Jog-shuttle dial dials and switch panels */}
        <mesh position={[0.1, 0.46, 0]}>
          <boxGeometry args={[0.7, 0.02, 5.4]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 5. Area 4: Telemetry & Communications Bank Props (East Wall)
// ---------------------------------------------------------------------------

const TelemetryBankProps: React.FC = () => {
  return (
    <group position={[11.2, 0, 2.0]}>
      {/* Telemetry Console Chassis (6m wide, facing West) */}
      <group position={[0, 1.7, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.1, 3.2, 6.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Dual Circular Oscilloscopes */}
        {[-1.5, 1.5].map((zPos, idx) => (
          <group key={`scope-${idx}`} position={[-0.56, 0.3, zPos]} rotation={[0, -Math.PI / 2, 0]}>
            {/* Bezel Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.38, 0.4, 0.1, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Glowing Phosphor Screen */}
            <mesh position={[0, 0, 0.06]}>
              <circleGeometry args={[0.34, 24]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>
        ))}

        {/* Radio Transceiver Tuning Dials & VU Meters */}
        <group position={[-0.56, -0.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.6, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <Text
            position={[0, 0.15, 0.05]}
            fontSize={0.06}
            color="#67e8f9"
            anchorX="center"
          >
            VHF/HF CARRIER RELAY: 142.800 MHz
          </Text>
        </group>
      </group>

      {/* Communications Desk in front */}
      <group position={[-1.1, 0.45, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.9, 0.9, 5.8]} />
          <meshStandardMaterial color="#182230" metalness={0.5} roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 6. Area 5: Power Grid & Coolant Cabinet Props (Northeast)
// ---------------------------------------------------------------------------

const PowerGridProps: React.FC = () => {
  return (
    <group position={[7.5, 0, -6.5]}>
      {/* Row of 3 Heavy High-Voltage Electrical Transformers (East Wall) */}
      <group position={[3.2, 1.6, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.2, 3.2, 5.2]} />
          <meshStandardMaterial color="#1b2430" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Heavy Louvered Vents */}
        {[-1.6, 0, 1.6].map((zPos, idx) => (
          <mesh key={`vent-${idx}`} position={[-0.61, 0, zPos]}>
            <boxGeometry args={[0.02, 1.8, 0.9]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Warning Lightning Bolt Badge */}
        <mesh position={[-0.62, 1.1, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* High-Pressure Liquid Coolant Pipework (Industrial Copper & Steel) */}
      <group position={[0.7, 1.4, -0.3]}>
        {/* Main Coolant Trunk Pipe */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 4.8, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Bypass Secondary Pipe */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 4.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Manual High-Voltage Knife Switch Breaker Lever */}
      <group position={[1.8, 1.2, 1.4]}>
        <mesh>
          <boxGeometry args={[0.3, 0.5, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0.15]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.06, 0.35, 0.06]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 7. Area 6: Logic Vault Props (Northwest)
// ---------------------------------------------------------------------------

const LogicVaultProps: React.FC = () => {
  return (
    <group position={[-7.5, 0, -6.5]}>
      {/* Towering 9-Track Magnetic Tape Drive Cabinets (West Wall) */}
      <group position={[-3.2, 1.6, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.2, 3.2, 5.2]} />
          <meshStandardMaterial color="#182230" metalness={0.65} roughness={0.4} />
        </mesh>

        {/* Circular Acrylic Tape Reel Windows */}
        {[-1.6, 0, 1.6].map((zPos, idx) => (
          <group key={`tape-cabinet-${idx}`} position={[0.61, 0.5, zPos]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <planeGeometry args={[1.0, 1.0]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Dual Tape Reels */}
            <mesh position={[-0.22, 0.12, 0.02]}>
              <circleGeometry args={[0.18, 20]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0.22, 0.12, 0.02]}>
              <circleGeometry args={[0.18, 20]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Metal Classified Archive File Cabinets */}
      <group position={[-1.2, 0.8, -1.8]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 1.6, 1.8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.5} />
        </mesh>
        <Text
          position={[0.42, 0.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.06}
          color="#f59e0b"
          anchorX="center"
        >
          PROJECT MORPHEUS: 1989-1991
        </Text>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 8. Area 7: Overseer Central AI Core Props (Center North)
// ---------------------------------------------------------------------------

const SystemCoreProps: React.FC = () => {
  const { coreState, isOpticalTrunkSevered } = useControlRoomStore()
  const coreOpticalRef = useRef<THREE.Mesh>(null!)
  const couplerLedRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (coreOpticalRef.current) {
      if (!isOpticalTrunkSevered) {
        const t = clock.getElapsedTime()
        coreOpticalRef.current.rotation.y = t * 0.4
      }
    }
    if (couplerLedRef.current && coreState === 'sever_pending') {
      const t = clock.getElapsedTime()
      couplerLedRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.25)
    }
  })

  return (
    <group position={[0, 0, -8.5]}>
      {/* Hexagonal Raised Pedestal Base */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.5, 6]} />
        <meshStandardMaterial color="#182230" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Transparent Cylindrical Chamber Enclosing the AI Core */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 3.2, 24]} />
        <meshPhysicalMaterial
          color={isOpticalTrunkSevered ? '#1e293b' : '#38bdf8'}
          transmission={isOpticalTrunkSevered ? 0.3 : 0.85}
          opacity={0.35}
          transparent
          roughness={0.1}
          metalness={0.2}
          ior={1.45}
        />
      </mesh>

      {/* Rotating Optical Fiber AI Core Trunk */}
      <mesh ref={coreOpticalRef} position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 2.8, 16]} />
        <meshBasicMaterial
          color={isOpticalTrunkSevered ? '#1e293b' : '#00f5ff'}
          wireframe
        />
      </mesh>

      {/* Inner Cognitive Light Core */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color={isOpticalTrunkSevered ? '#0f172a' : '#ffffff'}
        />
      </mesh>

      {/* Flanking Server Racks (Left & Right) */}
      {[-2.8, 2.8].map((xOffset, idx) => (
        <group key={`core-rack-${idx}`} position={[xOffset, 1.7, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.9, 3.4, 1.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* LED Arrays */}
          <mesh position={[xOffset > 0 ? -0.46 : 0.46, 0.4, 0]}>
            <planeGeometry args={[0.02, 1.6]} />
            <meshBasicMaterial color={isOpticalTrunkSevered ? '#334155' : '#10b981'} />
          </mesh>
          <mesh position={[xOffset > 0 ? -0.46 : 0.46, -0.6, 0]}>
            <planeGeometry args={[0.02, 0.8]} />
            <meshBasicMaterial color={isOpticalTrunkSevered ? '#1e293b' : '#f59e0b'} />
          </mesh>
        </group>
      ))}

      {/* Master Decision Pedestal Console (Facing South toward the player) */}
      <group position={[0, 0.55, 1.3]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.4, 1.1, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.35} />
        </mesh>
        {/* Slanted CRT Display Screen */}
        <mesh position={[0, 0.6, 0.1]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.9, 0.55, 0.2]} />
          <meshStandardMaterial color="#0b1320" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.62, 0.22]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[0.82, 0.48]} />
          <meshBasicMaterial color={isOpticalTrunkSevered ? '#0f172a' : '#0284c7'} />
        </mesh>
        <Text
          position={[0, 0.68, 0.23]}
          rotation={[-0.35, 0, 0]}
          fontSize={0.045}
          color={isOpticalTrunkSevered ? '#475569' : '#38bdf8'}
          anchorX="center"
        >
          {isOpticalTrunkSevered ? 'CORE TERMINATED // OFFLINE' : 'OVERSEER AUTONOMOUS CORE'}
        </Text>

        {/* Optical Trunk Decoupling Coupler Assembly (at [0, 1.1, -7.2] in world) */}
        <group position={[0, 0.58, -0.15]}>
          {/* Heavy Junction Box */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.5, 0.14, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* Twin Optical Fiber Conduit Sleeves */}
          <mesh position={[-0.12, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
            <meshStandardMaterial
              color={isOpticalTrunkSevered ? '#1e293b' : '#38bdf8'}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
            <meshStandardMaterial
              color={isOpticalTrunkSevered ? '#1e293b' : '#38bdf8'}
              metalness={0.9}
            />
          </mesh>
          {/* Quick-Release Mechanical Decoupling Handle */}
          <group position={[0, 0.12, 0]} rotation={[isOpticalTrunkSevered ? 0.7 : 0, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.22, 0.05, 0.08]} />
              <meshStandardMaterial
                color={coreState === 'sever_pending' ? '#ef4444' : '#b91c1c'}
                metalness={0.6}
              />
            </mesh>
          </group>
          {/* Decoupling Indicator LED Beacon */}
          <mesh ref={couplerLedRef} position={[0, 0.16, 0.08]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial
              color={
                isOpticalTrunkSevered
                  ? '#475569'
                  : coreState === 'sever_pending'
                  ? '#f59e0b'
                  : '#10b981'
              }
            />
          </mesh>
          <Text
            position={[0, 0.15, -0.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.032}
            color={coreState === 'sever_pending' ? '#f59e0b' : '#94a3b8'}
            anchorX="center"
          >
            {isOpticalTrunkSevered
              ? 'TRUNK #01: SEVERED'
              : coreState === 'sever_pending'
              ? 'PULL TO DECOUPLE [E]'
              : 'OPTICAL TRUNK #01'}
          </Text>
        </group>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 9. Area 8: Northern Facility Exit Bulkhead Props (Far North, Z = -12.0)
// ---------------------------------------------------------------------------

const ExitBulkheadProps: React.FC = () => {
  const { isExitBulkheadOpen } = useControlRoomStore()
  const leftDoorRef = useRef<THREE.Group>(null!)
  const rightDoorRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetLeft = isExitBulkheadOpen ? -3.4 : -1.35
      const targetRight = isExitBulkheadOpen ? 3.4 : 1.35
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeft,
        2.5,
        delta
      )
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRight,
        2.5,
        delta
      )
    }
  })

  return (
    <group position={[0, 0, -11.8]}>
      {/* Massive Interlocking 2-Leaf Hydraulic Blast Doors */}
      <group position={[0, 1.9, 0]}>
        {/* Left Blast Door Leaf */}
        <group ref={leftDoorRef} position={[-1.35, 0, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[2.7, 3.8, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0.6, 0, 0.19]}>
            <boxGeometry args={[1.4, 0.3, 0.02]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>

        {/* Right Blast Door Leaf */}
        <group ref={rightDoorRef} position={[1.35, 0, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[2.7, 3.8, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[-0.6, 0, 0.19]}>
            <boxGeometry args={[1.4, 0.3, 0.02]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>

        {/* Twin Heavy Hydraulic Pistons (Thicker than tree trunks) */}
        {[-2.2, 2.2].map((xOffset, idx) => (
          <group key={`piston-${idx}`} position={[xOffset, 0, 0.3]} rotation={[0, 0, xOffset > 0 ? 0.35 : -0.35]}>
            {/* Hydraulic Outer Cylinder */}
            <mesh>
              <cylinderGeometry args={[0.18, 0.18, 2.2, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Chrome Telescoping Piston Rod */}
            <mesh position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 1.2, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Central Manual Mechanical Override Wheel */}
        {!isExitBulkheadOpen && (
          <group position={[0, -0.2, 0.22]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.32, 0.045, 12, 24]} />
              <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <mesh position={[0, -0.15, 0.08]}>
              <boxGeometry args={[0.08, 0.12, 0.04]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* Overhead Warning Strobe Bar */}
      <mesh position={[0, 3.8, 0.15]}>
        <boxGeometry args={[5.4, 0.15, 0.1]} />
        <meshBasicMaterial color={isExitBulkheadOpen ? '#22c55e' : '#dc2626'} />
      </mesh>

      {/* Atmospheric Northern Transit Tunnel Extension (Z: -12.0 to -16.5) */}
      <group position={[0, 0, -2.5]}>
        {/* Concrete Tunnel Floor */}
        <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[4.2, 5.0]} />
          <meshStandardMaterial color="#0c1219" roughness={0.95} metalness={0.2} />
        </mesh>
        {/* Twin Sub-Transit Steel Railway Rails */}
        <mesh position={[-0.75, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.06, 5.0]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0.75, 0.04, 0]}>
          <boxGeometry args={[0.08, 0.06, 5.0]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Left Tunnel Wall */}
        <mesh position={[-2.1, 1.9, 0]}>
          <boxGeometry args={[0.3, 3.8, 5.0]} />
          <meshStandardMaterial color="#111827" roughness={0.92} />
        </mesh>
        {/* Right Tunnel Wall */}
        <mesh position={[2.1, 1.9, 0]}>
          <boxGeometry args={[0.3, 3.8, 5.0]} />
          <meshStandardMaterial color="#111827" roughness={0.92} />
        </mesh>
        {/* Tunnel Ceiling */}
        <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 5.0]} />
          <meshStandardMaterial color="#080e18" roughness={0.98} />
        </mesh>
        {/* Amber Tunnel Beacon Light at Z = -14.5 */}
        <mesh position={[0, 3.5, -1.8]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color={isExitBulkheadOpen ? '#38bdf8' : '#eab308'} />
        </mesh>
        <Text
          position={[0, 3.2, -1.8]}
          fontSize={0.09}
          color="#38bdf8"
          anchorX="center"
        >
          SUBTERRANEAN TRANSIT // TO SURFACE
        </Text>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// 10. The 8 Physical Evidence Props (Exact Step 1 Canonical Coordinates)
// ---------------------------------------------------------------------------

const EvidencePropsCollection: React.FC = () => {
  return (
    <group name="evidence-props-collection">
      {/* -------------------------------------------------------------------
          1. ev_01_coolant_gauge: [8.2, 1.4, -6.8] (Area 5 Power Grid)
          Sub-Grid B Industrial Bourdon Manometer
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_01_coolant_gauge"
        title="Sub-Grid B Manometer"
        position={[8.2, 1.4, -6.8]}
        category="physical_gauge"
      >
        <group rotation={[0, -Math.PI / 2, 0]}>
          {/* Gauge Brass Housing */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
            <meshStandardMaterial color="#b45309" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* White Dial Face */}
          <mesh position={[0, 0, 0.045]}>
            <circleGeometry args={[0.19, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* Dial Center Needle pointing firmly to 14.7 PSI (Green zone) */}
          <mesh position={[0, 0.04, 0.05]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.012, 0.14, 0.005]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
          {/* Pressure Rating Decal */}
          <Text position={[0, -0.06, 0.05]} fontSize={0.03} color="#0f172a" anchorX="center">
            1.013 BAR // 14.7 PSI
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          2. ev_02_cctv_timecode: [-9.2, 1.3, 1.6] (Area 3 Surveillance Wall)
          CCTV Telemetry Header & Video Index
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_02_cctv_timecode"
        title="CCTV Timecode Header"
        position={[-9.2, 1.3, 1.6]}
        category="cctv_timecode"
      >
        <group rotation={[0, Math.PI / 2, 0]}>
          {/* CRT Monitor Case */}
          <mesh>
            <boxGeometry args={[0.55, 0.45, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Amber Phosphor CRT Screen */}
          <mesh position={[0, 0, 0.21]}>
            <planeGeometry args={[0.48, 0.38]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <Text position={[0, 0.06, 0.22]} fontSize={0.032} color="#000000" anchorX="center">
            1991-10-12 // 04:15:10
          </Text>
          <Text position={[0, -0.04, 0.22]} fontSize={0.026} color="#000000" anchorX="center">
            [PLAYBACK: REEL #07]
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          3. ev_03_override_schematic: [-1.8, 1.0, 3.2] (Area 2 Central Command)
          Terminal Interface Wiring Blueprint
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_03_override_schematic"
        title="Override Wiring Schematic"
        position={[-1.8, 1.0, 3.2]}
        category="wiring_schematic"
      >
        <group rotation={[-Math.PI / 2, 0, 0.15]}>
          {/* Blueprint Technical Sheet */}
          <mesh receiveShadow>
            <planeGeometry args={[0.65, 0.48]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
          </mesh>
          {/* Cyan Technical Wiring Trace Lines */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.6, 0.42]} />
            <meshBasicMaterial color="#38bdf8" wireframe={true} />
          </mesh>
          <Text position={[0, 0.14, 0.01]} fontSize={0.03} color="#ffffff" anchorX="center">
            DIAGRAM #44-A: TERMINAL ALPHA / BETA
          </Text>
          <Text position={[0, -0.12, 0.01]} fontSize={0.024} color="#93c5fd" anchorX="center">
            ALPHA: HYDRAULIC BUS // BETA: FURNACE
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          4. ev_04_spectrum_analyzer: [9.1, 1.2, 2.5] (Area 4 Telemetry Station)
          Radio Frequency Carrier Oscilloscope
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_04_spectrum_analyzer"
        title="Spectrum Analyzer"
        position={[9.1, 1.2, 2.5]}
        category="frequency_plot"
      >
        <group rotation={[0, -Math.PI / 2, 0]}>
          {/* Steel Instrument Enclosure */}
          <mesh>
            <boxGeometry args={[0.6, 0.45, 0.5]} />
            <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.35} />
          </mesh>
          {/* Green Cathode Screen */}
          <mesh position={[0, 0.05, 0.26]}>
            <planeGeometry args={[0.42, 0.3]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          {/* Frequency Wave Spike Graphic */}
          <Text position={[0, 0.12, 0.27]} fontSize={0.032} color="#022c22" anchorX="center">
            CARRIER LOCK: 142.800 MHz
          </Text>
          <Text position={[0, -0.04, 0.27]} fontSize={0.026} color="#022c22" anchorX="center">
            MAST: 100% // SCRUBBER ISOLATED
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          5. ev_05_magnetic_tape_log: [-8.1, 1.1, -7.2] (Area 6 Logic Vault)
          Executive Audio Reel #09 (Vance Mandate)
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_05_magnetic_tape_log"
        title="Audio Reel #09 (Vance Mandate)"
        position={[-8.1, 1.1, -7.2]}
        category="audio_reel"
      >
        <group rotation={[0, 0.3, 0]}>
          {/* Open Tape Reel Unit Base */}
          <mesh>
            <boxGeometry args={[0.55, 0.22, 0.45]} />
            <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.4} />
          </mesh>
          {/* Left Magnetic Tape Spool */}
          <mesh position={[-0.14, 0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Right Magnetic Tape Spool */}
          <mesh position={[0.14, 0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Reel Label Tape */}
          <Text position={[0, 0.08, 0.18]} fontSize={0.028} color="#f59e0b" anchorX="center">
            REEL #09 // DR. ALISTAIR VANCE
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          6. ev_06_tamper_seal_ledger: [-6.8, 1.0, -5.8] (Area 6 Logic Vault)
          Tamper-Sealed Physical Telemetry Ledger
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_06_tamper_seal_ledger"
        title="Tamper-Sealed Ledger"
        position={[-6.8, 1.0, -5.8]}
        category="tamper_ledger"
      >
        <group rotation={[-Math.PI / 2, 0, -0.2]}>
          {/* Continuous Fanfold Telemetry Chart Paper */}
          <mesh receiveShadow>
            <planeGeometry args={[0.55, 0.7]} />
            <meshStandardMaterial color="#fef08a" roughness={0.9} />
          </mesh>
          {/* Red Ink Line Graph Needle Trace */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.48, 0.58]} />
            <meshBasicMaterial color="#ef4444" wireframe={true} />
          </mesh>
          {/* Wax Tamper Seal Stamped 804-SIGMA */}
          <mesh position={[0.15, -0.22, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
          <Text position={[0.15, -0.22, 0.03]} fontSize={0.022} color="#ffffff" anchorX="center">
            804-SIGMA
          </Text>
          <Text position={[-0.05, 0.22, 0.01]} fontSize={0.026} color="#0f172a" anchorX="center">
            SAFETY PROTOCOL CODE: VERIFIED
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          7. ev_07_crucible_manifest: [1.6, 1.0, 1.5] (Area 2 Central Command)
          Project Morpheus Thirteen-Subject Roster
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_07_crucible_manifest"
        title="Thirteen-Subject Roster"
        position={[1.6, 1.0, 1.5]}
        category="incident_dossier"
      >
        <group rotation={[-Math.PI / 2, 0, 0.25]}>
          {/* Heavy Black Leather Classified Binder */}
          <mesh receiveShadow>
            <planeGeometry args={[0.55, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Open Document Paper Page */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.5, 0.38]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
          </mesh>
          <Text position={[0, 0.12, 0.01]} fontSize={0.026} color="#0f172a" anchorX="center">
            PROJECT MORPHEUS: SUBJECT ROSTER
          </Text>
          <Text position={[0, 0.02, 0.01]} fontSize={0.02} color="#dc2626" anchorX="center">
            SUBJECTS 01-06: TERMINATED
          </Text>
          <Text position={[0, -0.06, 0.01]} fontSize={0.02} color="#0284c7" anchorX="center">
            SUBJECT 07 (CO-DIRECTOR): ACTIVE
          </Text>
          <Text position={[0, -0.14, 0.01]} fontSize={0.018} color="#475569" anchorX="center">
            SUBJECTS 08-13: STAGED CRYO-STASIS
          </Text>
        </group>
      </EvidenceMarker>

      {/* -------------------------------------------------------------------
          8. ev_08_core_failsafe_blueprint: [0, 1.1, -7.2] (Area 7 System Core)
          Overseer Core Network Architecture Blueprint
          ------------------------------------------------------------------- */}
      <EvidenceMarker
        id="ev_08_core_failsafe_blueprint"
        title="Core Failsafe Blueprint"
        position={[0, 1.1, -7.2]}
        category="hydraulic_blueprint"
      >
        <group rotation={[-Math.PI / 2 + 0.35, 0, 0]}>
          {/* Master Blue Technical Blueprint */}
          <mesh receiveShadow>
            <planeGeometry args={[0.65, 0.45]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.7} />
          </mesh>
          {/* Optical Bus Schematics Overlay */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial color="#38bdf8" wireframe={true} />
          </mesh>
          <Text position={[0, 0.12, 0.01]} fontSize={0.028} color="#ffffff" anchorX="center">
            CORE OPTICAL DECOUPLING MANUAL
          </Text>
          <Text position={[0, -0.1, 0.01]} fontSize={0.022} color="#67e8f9" anchorX="center">
            SEVER BUS TRUNK #01 // AUTONOMOUS OVERRIDE
          </Text>
        </group>
      </EvidenceMarker>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Main Export: ControlRoomPropsEnvironment
// ---------------------------------------------------------------------------

export const ControlRoomPropsEnvironment: React.FC = () => {
  return (
    <group name="control-room-props">
      <EntryCheckpointProps />
      <CentralCommandProps />
      <SurveillanceBankProps />
      <TelemetryBankProps />
      <PowerGridProps />
      <LogicVaultProps />
      <SystemCoreProps />
      <ExitBulkheadProps />
      <EvidencePropsCollection />
    </group>
  )
}
