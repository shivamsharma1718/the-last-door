import React from 'react'
import { Text } from '@react-three/drei'
import type { DrowningHallObject, ValveModel } from './drowningHallTypes'
import {
  ROOM05_WIDTH,
  ROOM05_HEIGHT,
  ROOM05_DEPTH,
  EXIT_POSITION,
  INITIAL_WATER_LEVEL,
} from './drowningHallTypes'
import { getDrowningHallObjects, getValves } from './drowningHallLogic'

/**
 * 1. Base Stand for Investigation Artifacts
 */
const ArtifactStand: React.FC<{
  position: [number, number, number]
  children?: React.ReactNode
}> = ({ position, children }) => {
  const [x, , z] = position

  return (
    <group position={[x, 0, z]}>
      {/* Heavy Base Plinth */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.95, 0.1, 0.95]} />
        <meshStandardMaterial color="#111620" roughness={0.85} metalness={0.3} />
      </mesh>
      {/* Central Support Column */}
      <mesh position={[0, 0.48, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.55, 0.76, 0.55]} />
        <meshStandardMaterial color="#18202c" roughness={0.8} metalness={0.25} />
      </mesh>
      {/* Top Tabletop Surface */}
      <mesh position={[0, 0.88, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
        <meshStandardMaterial color="#202a3a" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Floor Ring Accent */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.8, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>
      {children}
    </group>
  )
}

/**
 * 2. OBJECT 1: Pressure Gauge Model
 */
const PressureGaugeMesh: React.FC<{ item: DrowningHallObject }> = ({ item }) => {
  return (
    <ArtifactStand position={item.position}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color="#7dd3fc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Metal Mounting Bracket */}
        <mesh position={[0, 0.25, -0.05]} castShadow>
          <boxGeometry args={[0.3, 0.45, 0.1]} />
          <meshStandardMaterial color="#1e2634" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Connecting Copper Pipe */}
        <mesh position={[0, 0.08, -0.05]}>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Heavy Circular Gauge Housing */}
        <mesh position={[0, 0.42, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
          <meshStandardMaterial color="#1c2432" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Brass Bezel Ring */}
        <mesh position={[0, 0.42, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.02, 16, 32]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Dial Face Plate (White / Aged Enamel) */}
        <mesh position={[0, 0.42, 0.063]}>
          <circleGeometry args={[0.24, 32]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Gauge Center Needle Hub */}
        <mesh position={[0, 0.42, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Red Pressure Needle */}
        <mesh position={[0.06, 0.46, 0.072]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.16, 0.015, 0.005]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Red High-Pressure Warning Arc */}
        <mesh position={[0, 0.42, 0.066]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 16, 1, Math.PI / 4, Math.PI / 2]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
        </mesh>
        {/* Glass Face Reflection */}
        <mesh position={[0, 0.42, 0.08]}>
          <circleGeometry args={[0.24, 32]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Focused Local Illumination */}
        <pointLight position={[0, 0.65, 0.35]} color="#38bdf8" intensity={3.0} distance={5.0} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 3. OBJECT 2: Maintenance Log Model
 */
const MaintenanceLogMesh: React.FC<{ item: DrowningHallObject }> = ({ item }) => {
  return (
    <ArtifactStand position={item.position}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 1.9, 0]}
        fontSize={0.15}
        color="#7dd3fc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Heavy Steel Clipboard */}
        <mesh position={[0, 0.03, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.68, 0.03]} />
          <meshStandardMaterial color="#222c3c" roughness={0.6} metalness={0.6} />
        </mesh>
        {/* Aged Maintenance Paper Stack */}
        <mesh position={[0, 0.05, 0]} rotation={[-0.2, 0, 0.01]}>
          <planeGeometry args={[0.46, 0.58]} />
          <meshStandardMaterial color="#dcd2b6" roughness={0.9} />
        </mesh>
        {/* Top Heavy Steel Clip */}
        <mesh position={[0, 0.32, -0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.22, 0.07, 0.06]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Stamped Water Stains & Grid Lines */}
        <mesh position={[-0.04, 0.06, 0.04]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.34, 0.36]} />
          <meshStandardMaterial color="#475569" roughness={0.95} transparent opacity={0.5} />
        </mesh>

        {/* Soft Focused Warm Reading Light */}
        <pointLight position={[0, 0.65, 0.35]} color="#fef08a" intensity={2.8} distance={5.0} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 4. OBJECT 3: Major Industrial Control Panel Model
 */
const ControlPanelMesh: React.FC<{ item: DrowningHallObject }> = ({ item }) => {
  return (
    <ArtifactStand position={item.position}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 2.1, 0]}
        fontSize={0.15}
        color="#7dd3fc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Heavy Steel Console Cabinet Base */}
        <mesh position={[0, 0.32, -0.06]} castShadow>
          <boxGeometry args={[0.82, 0.62, 0.52]} />
          <meshStandardMaterial color="#1a2230" roughness={0.7} metalness={0.5} />
        </mesh>
        {/* Angled Upper Control Deck */}
        <mesh position={[0, 0.44, 0.12]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.76, 0.48, 0.06]} />
          <meshStandardMaterial color="#151d2a" roughness={0.65} metalness={0.6} />
        </mesh>
        {/* Header Emergency Banner Plaque */}
        <group position={[0, 0.68, 0.05]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.7, 0.1, 0.02]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.4} />
          </mesh>
          <Text
            position={[0, 0, 0.015]}
            fontSize={0.045}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.1}
          >
            EMERGENCY DRAINAGE
          </Text>
        </group>
        {/* Row of Status Indicator LEDs */}
        {[-0.24, -0.08, 0.08, 0.24].map((lx, i) => (
          <mesh
            key={`led-${i}`}
            position={[lx, 0.52, 0.14]}
            rotation={[-0.35, 0, 0]}
          >
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color={i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#38bdf8'} />
          </mesh>
        ))}
        {/* Toggle Switches and Rotary Dials */}
        {[-0.2, 0, 0.2].map((sx, i) => (
          <group key={`switch-${i}`} position={[sx, 0.38, 0.18]} rotation={[-0.35, 0, 0]}>
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
              <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.02, 0.02]}>
              <boxGeometry args={[0.012, 0.04, 0.01]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
            </mesh>
          </group>
        ))}
        {/* External Heavy Conduit Cables */}
        <mesh position={[-0.32, 0.08, -0.32]} rotation={[0.4, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.9} />
        </mesh>
        <mesh position={[0.32, 0.08, -0.32]} rotation={[0.4, -0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.9} />
        </mesh>

        {/* Industrial Orange Warning Console Light */}
        <pointLight position={[0, 0.75, 0.4]} color="#f97316" intensity={3.5} distance={6.0} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 5. OBJECT 4: Flood Marker Model
 */
const FloodMarkerMesh: React.FC<{ item: DrowningHallObject }> = ({ item }) => {
  return (
    <ArtifactStand position={item.position}>
      {/* Floating 3D Title */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color="#7dd3fc"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {item.title}
      </Text>

      <group position={[0, 0.91, 0]}>
        {/* Heavy Metal Metric Gauge Column */}
        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[0.28, 1.05, 0.08]} />
          <meshStandardMaterial color="#1e2736" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Yellow Measurement Enamel Face */}
        <mesh position={[0, 0.52, 0.042]}>
          <planeGeometry args={[0.22, 0.98]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.7} />
        </mesh>
        {/* Measurement Ticks */}
        {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.4].map((ty, i) => (
          <mesh key={`tick-${i}`} position={[0.04, 0.52 + ty, 0.045]}>
            <boxGeometry args={[0.1, 0.012, 0.002]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        ))}
        {/* Red Critical Flood Line */}
        <mesh position={[0, 0.82, 0.046]}>
          <boxGeometry args={[0.22, 0.02, 0.002]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Historical Water Stains / Grunge */}
        <mesh position={[0, 0.28, 0.044]}>
          <planeGeometry args={[0.22, 0.45]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} transparent opacity={0.65} />
        </mesh>

        {/* Cold Gauge Ambient Light */}
        <pointLight position={[0, 0.65, 0.35]} color="#38bdf8" intensity={2.8} distance={5.0} decay={2} />
      </group>
    </ArtifactStand>
  )
}

/**
 * 6. Physical Industrial Valve Assembly
 */
const ValveAssemblyMesh: React.FC<{ valve: ValveModel }> = ({ valve }) => {
  const [vx, vy, vz] = valve.position
  const isLeftWall = vx < 0

  return (
    <group position={[vx, vy, vz]}>
      {/* 3D Floating Name Label */}
      <Text
        position={[0, 0.65, 0]}
        fontSize={0.16}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        letterSpacing={0.2}
      >
        {valve.label}
      </Text>

      {/* Heavy Wall Flange Mount */}
      <mesh
        position={[isLeftWall ? -0.2 : 0.2, 0, 0]}
        rotation={[0, 0, isLeftWall ? Math.PI / 2 : -Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
        <meshStandardMaterial color="#1e2838" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Main Pipe Spindle Extension */}
      <mesh
        position={[isLeftWall ? 0.05 : -0.05, 0, 0]}
        rotation={[0, 0, isLeftWall ? Math.PI / 2 : -Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.07, 0.07, 0.42, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Valve Bonnet & Gland */}
      <mesh position={[isLeftWall ? 0.2 : -0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} metalness={0.85} />
      </mesh>

      {/* Circular Red Industrial Handwheel */}
      <group position={[isLeftWall ? 0.28 : -0.28, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Outer Wheel Rim */}
        <mesh castShadow>
          <torusGeometry args={[0.26, 0.035, 16, 24]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Center Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Cross Spokes */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle, i) => (
          <mesh key={`spoke-${i}`} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.5, 0.03, 0.02]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Embossed Valve ID Plate */}
      <group position={[0, -0.28, 0]}>
        <mesh>
          <boxGeometry args={[0.36, 0.12, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.5} />
        </mesh>
        <Text
          position={[0, 0, 0.015]}
          fontSize={0.065}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          letterSpacing={0.15}
        >
          {valve.label}
        </Text>
      </group>

      {/* Localized Valve Light */}
      <pointLight position={[0, 0.2, 0.35]} color="#f87171" intensity={2.6} distance={4.5} decay={2} />
    </group>
  )
}

/**
 * 7. Heavy Industrial Emergency Exit Blast Door
 */
const ExitDoorModel: React.FC = () => {
  const [ex, , ez] = EXIT_POSITION

  return (
    <group position={[ex, 0, ez]}>
      {/* Heavy Steel Frame Columns */}
      <mesh position={[-1.3, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.38, 3.2, 0.45]} />
        <meshStandardMaterial color="#1a2332" roughness={0.8} metalness={0.4} />
      </mesh>
      <mesh position={[1.3, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.38, 3.2, 0.45]} />
        <meshStandardMaterial color="#1a2332" roughness={0.8} metalness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.98, 0.38, 0.45]} />
        <meshStandardMaterial color="#1e2838" roughness={0.75} metalness={0.45} />
      </mesh>

      {/* Main Double Blast Door Panels */}
      <mesh position={[-0.54, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.05, 2.9, 0.16]} />
        <meshStandardMaterial color="#121924" roughness={0.7} metalness={0.65} />
      </mesh>
      <mesh position={[0.54, 1.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.05, 2.9, 0.16]} />
        <meshStandardMaterial color="#121924" roughness={0.7} metalness={0.65} />
      </mesh>

      {/* Heavy Hydraulic Locking Pistons */}
      <mesh position={[-0.9, 1.5, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.9, 1.5, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Diagonal Industrial Hazard Stripes */}
      <mesh position={[0, 2.2, 0.085]}>
        <boxGeometry args={[2.1, 0.14, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.75, 0.085]}>
        <boxGeometry args={[2.1, 0.14, 0.02]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Prominent High-Contrast LOCKED Sign Plaque */}
      <group position={[0, 3.58, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.34, 0.08]} />
          <meshStandardMaterial color="#0a0f1d" roughness={0.7} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.042]}>
          <boxGeometry args={[1.04, 0.28, 0.01]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.15}
          color="#f87171"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          fontWeight="bold"
        >
          LOCKED
        </Text>
        <pointLight position={[0, 0, 0.25]} color="#ef4444" intensity={2.0} distance={4.0} decay={2} />
      </group>

      {/* Status Warning Beacon Indicators */}
      <mesh position={[-1.3, 3.2, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[1.3, 3.2, 0.2]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  )
}

/**
 * 8. Contaminated Industrial Water Surface Plane
 * Ready for programmatic waterLevel parameter (0 to 100).
 */
const WaterSurface: React.FC<{ waterLevel?: number }> = ({
  waterLevel = INITIAL_WATER_LEVEL,
}) => {
  // Map water level percentage (0 to 100) to physical height (0.04m to 3.6m)
  const currentHeight = 0.04 + (waterLevel / 100) * 3.5

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, currentHeight, 0]}
      receiveShadow
    >
      <planeGeometry args={[ROOM05_WIDTH - 0.1, ROOM05_DEPTH - 0.1]} />
      <meshStandardMaterial
        color="#08141a"
        emissive="#040b10"
        emissiveIntensity={0.2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

/**
 * 9. Overhead Ceiling Girders, Industrial Piping & Drainage Infrastructure
 */
const IndustrialInfrastructure: React.FC = () => {
  const halfDepth = ROOM05_DEPTH / 2

  return (
    <group>
      {/* Ceiling Steel Support Girders */}
      {[-8, -4, 0, 4, 8].map((gz, i) => (
        <group key={`girder-${i}`} position={[0, ROOM05_HEIGHT - 0.15, gz]}>
          <mesh castShadow>
            <boxGeometry args={[ROOM05_WIDTH, 0.25, 0.35]} />
            <meshStandardMaterial color="#1e2736" roughness={0.7} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Large Main Overhead Drainage Pipe */}
      <mesh position={[-2.8, ROOM05_HEIGHT - 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, ROOM05_DEPTH - 2, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh position={[2.8, ROOM05_HEIGHT - 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, ROOM05_DEPTH - 2, 16]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Wall Pipe Runs */}
      <mesh
        position={[-ROOM05_WIDTH / 2 + 0.35, 2.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, ROOM05_DEPTH - 2, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh
        position={[ROOM05_WIDTH / 2 - 0.35, 2.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.08, 0.08, ROOM05_DEPTH - 2, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Floor Drainage Grate Trenches running along Left & Right aisles */}
      <mesh position={[-3.6, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, ROOM05_DEPTH - 3]} />
        <meshStandardMaterial color="#0a0f16" roughness={0.9} metalness={0.3} />
      </mesh>
      <mesh position={[3.6, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, ROOM05_DEPTH - 3]} />
        <meshStandardMaterial color="#0a0f16" roughness={0.9} metalness={0.3} />
      </mesh>

      {/* South Entrance Gate Architecture (Where the player spawned from) */}
      <group position={[0, 0, halfDepth - 0.1]}>
        <mesh position={[-1.3, 1.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 3.2, 0.3]} />
          <meshStandardMaterial color="#1a2230" roughness={0.8} metalness={0.4} />
        </mesh>
        <mesh position={[1.3, 1.6, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 3.2, 0.3]} />
          <meshStandardMaterial color="#1a2230" roughness={0.8} metalness={0.4} />
        </mesh>
        <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.95, 0.35, 0.35]} />
          <meshStandardMaterial color="#1f283a" roughness={0.75} metalness={0.45} />
        </mesh>
        {/* Sealed Entrance Airlock Door */}
        <mesh position={[-0.52, 1.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.05, 2.9, 0.12]} />
          <meshStandardMaterial color="#121822" roughness={0.7} metalness={0.6} />
        </mesh>
        <mesh position={[0.52, 1.5, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.05, 2.9, 0.12]} />
          <meshStandardMaterial color="#121822" roughness={0.7} metalness={0.6} />
        </mesh>
        <pointLight position={[0, 3.1, -0.3]} color="#38bdf8" intensity={2.8} distance={8.0} decay={2} />
      </group>
    </group>
  )
}

export interface TheDrowningHallArenaProps {
  waterLevel?: number
}

/**
 * Top-Level 3D Arena Component for Game 05: THE DROWNING HALL.
 * Enclosed water-control facility environment with concrete surfaces,
 * industrial piping, 4 investigation targets, 3 valves, emergency exit, and water surface.
 */
export const TheDrowningHallArena: React.FC<TheDrowningHallArenaProps> = ({
  waterLevel = INITIAL_WATER_LEVEL,
}) => {
  const items = getDrowningHallObjects()
  const valves = getValves()

  const halfWidth = ROOM05_WIDTH / 2
  const halfHeight = ROOM05_HEIGHT / 2
  const halfDepth = ROOM05_DEPTH / 2

  return (
    <>
      {/* 1. Atmospheric Industrial Fog & Background */}
      <color attach="background" args={['#060a10']} />
      <fog attach="fog" args={['#060a10', 8, 30]} />

      {/* 2. Controlled Industrial Lighting */}
      <ambientLight color="#1e2838" intensity={0.75} />
      <directionalLight position={[0, 4.2, 0]} color="#475569" intensity={0.6} />

      {/* Distributed Overhead Industrial Cage Downlights */}
      <pointLight position={[0, 4.2, 7.0]} color="#f8fafc" intensity={4.5} distance={14.0} decay={2} />
      <pointLight position={[0, 4.2, 2.0]} color="#e2e8f0" intensity={4.5} distance={14.0} decay={2} />
      <pointLight position={[0, 4.2, -3.0]} color="#cbd5e1" intensity={4.5} distance={14.0} decay={2} />
      <pointLight position={[0, 4.2, -8.0]} color="#94a3b8" intensity={4.5} distance={14.0} decay={2} />

      {/* 3. Fully Enclosed Industrial Chamber */}
      {/* Concrete Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM05_WIDTH, ROOM05_DEPTH]} />
        <meshStandardMaterial color="#141924" roughness={0.82} metalness={0.25} />
      </mesh>

      {/* Central Guidance Floor Strip */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, ROOM05_DEPTH - 2]} />
        <meshStandardMaterial color="#1a2332" roughness={0.7} metalness={0.35} />
      </mesh>

      {/* Floor Grid Guidelines */}
      {[-5, -2, 2, 5].map((gx, i) => (
        <mesh key={`floor-grid-x-${i}`} position={[gx, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, ROOM05_DEPTH]} />
          <meshBasicMaterial color="#334155" transparent opacity={0.45} />
        </mesh>
      ))}

      {/* Spawn Indicator Floor Ring */}
      <mesh position={[0, 0.01, 8.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.88, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>

      {/* Concrete Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM05_HEIGHT, 0]} receiveShadow>
        <planeGeometry args={[ROOM05_WIDTH, ROOM05_DEPTH]} />
        <meshStandardMaterial color="#0e131d" roughness={0.92} metalness={0.15} />
      </mesh>

      {/* North Wall (Exit End) */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <planeGeometry args={[ROOM05_WIDTH, ROOM05_HEIGHT]} />
        <meshStandardMaterial color="#161d2a" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* South Wall (Spawn End) */}
      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[ROOM05_WIDTH, ROOM05_HEIGHT]} />
        <meshStandardMaterial color="#161d2a" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* East Wall with Structural Panels */}
      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM05_DEPTH, ROOM05_HEIGHT]} />
        <meshStandardMaterial color="#161d2a" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* West Wall with Structural Panels */}
      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM05_DEPTH, ROOM05_HEIGHT]} />
        <meshStandardMaterial color="#161d2a" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* Vertical Wall Rib Pillars */}
      {[-8, -4, 0, 4, 8].map((wz, i) => (
        <React.Fragment key={`wall-ribs-${i}`}>
          <mesh position={[-halfWidth + 0.15, halfHeight, wz]} receiveShadow castShadow>
            <boxGeometry args={[0.3, ROOM05_HEIGHT, 0.45]} />
            <meshStandardMaterial color="#1e2738" roughness={0.8} metalness={0.3} />
          </mesh>
          <mesh position={[halfWidth - 0.15, halfHeight, wz]} receiveShadow castShadow>
            <boxGeometry args={[0.3, ROOM05_HEIGHT, 0.45]} />
            <meshStandardMaterial color="#1e2738" roughness={0.8} metalness={0.3} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Base Skirting Trims */}
      <mesh position={[0, 0.15, -halfDepth + 0.05]}>
        <boxGeometry args={[ROOM05_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0e121a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.15, halfDepth - 0.05]}>
        <boxGeometry args={[ROOM05_WIDTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0e121a" roughness={0.7} />
      </mesh>
      <mesh position={[halfWidth - 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM05_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0e121a" roughness={0.7} />
      </mesh>
      <mesh position={[-halfWidth + 0.05, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM05_DEPTH, 0.3, 0.08]} />
        <meshStandardMaterial color="#0e121a" roughness={0.7} />
      </mesh>

      {/* 4. Industrial Infrastructure & Piping */}
      <IndustrialInfrastructure />

      {/* 5. Water Surface Mesh */}
      <WaterSurface waterLevel={waterLevel} />

      {/* 6. Four Environmental Investigation Objects */}
      {items.map((item) => {
        if (item.id === 'pressure_gauge') {
          return <PressureGaugeMesh key={item.id} item={item} />
        }
        if (item.id === 'maintenance_log') {
          return <MaintenanceLogMesh key={item.id} item={item} />
        }
        if (item.id === 'control_panel') {
          return <ControlPanelMesh key={item.id} item={item} />
        }
        if (item.id === 'flood_marker') {
          return <FloodMarkerMesh key={item.id} item={item} />
        }
        return null
      })}

      {/* 7. Three Physical Industrial Valves */}
      {valves.map((valve) => (
        <ValveAssemblyMesh key={valve.id} valve={valve} />
      ))}

      {/* 8. Locked Industrial Emergency Exit Blast Door */}
      <ExitDoorModel />
    </>
  )
}
