/**
 * Game 09: THE CONTROL ROOM - Complete Brutalist Bunker Architecture
 * 26.0m x 4.2m x 24.0m underground Cold War command facility.
 * Concrete walls with stains and cracks, steel support structures,
 * overhead cable ladders, industrial conduits, and structural columns.
 */

import React from 'react'

export const ControlRoomArchitecture: React.FC = () => {
  return (
    <group name="control-room-architecture">
      {/* ===================================================================
          1. MAIN FLOOR & GROUND SURFACES
          =================================================================== */}
      {/* Primary Concrete Subfloor (26m x 24m) */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26.0, 24.0]} />
        <meshStandardMaterial
          color="#151b24"
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* Main Hall Concrete Floor Slabs (Sectioned for brutalist realism) */}
      <mesh position={[0, 0.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25.6, 23.6]} />
        <meshStandardMaterial
          color="#1c2430"
          roughness={0.82}
          metalness={0.18}
        />
      </mesh>

      {/* Center Runway Tile Inlay (From Entry Checkpoint Z=11 to Core Z=-8) */}
      <mesh position={[0, 0.01, 1.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.2, 20.0]} />
        <meshStandardMaterial
          color="#131922"
          roughness={0.75}
          metalness={0.28}
        />
      </mesh>

      {/* Area 2: Elevated Central Command Dais Platform (6.6m x 5.4m x 0.16m) */}
      <group position={[0, 0.08, 2.0]}>
        {/* Main Platform Deck */}
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.6, 0.16, 5.4]} />
          <meshStandardMaterial
            color="#222c3a"
            roughness={0.65}
            metalness={0.4}
          />
        </mesh>
        {/* Steel Perimeter Curb */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[6.7, 0.04, 5.5]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* South Access Ramp Bevel */}
        <mesh position={[0, -0.04, 2.85]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[3.0, 0.06, 0.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* North Access Ramp Bevel */}
        <mesh position={[0, -0.04, -2.85]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[3.0, 0.06, 0.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Hazard Border Stripes: Area 5 Power Grid (Northeast floor) */}
      <mesh position={[7.5, 0.012, -6.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.2, 5.4]} />
        <meshStandardMaterial color="#18202c" roughness={0.9} />
      </mesh>
      <mesh position={[7.5, 0.014, -3.8]}>
        <boxGeometry args={[7.2, 0.01, 0.12]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh position={[3.9, 0.014, -6.5]}>
        <boxGeometry args={[0.12, 0.01, 5.4]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* Hazard Perimeter Ring: Area 7 System Core (Center North) */}
      <mesh position={[0, 0.012, -8.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.0, 32]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.65} />
      </mesh>

      {/* ===================================================================
          2. OUTER BRUTALIST WALLS & ENCLOSURE (4.2m Height)
          =================================================================== */}
      {/* South Wall (Z = +12.0) with Entry Portal Framed Alcove */}
      <mesh position={[-7.5, 2.1, 12.0]} receiveShadow castShadow>
        <boxGeometry args={[11.0, 4.2, 0.4]} />
        <meshStandardMaterial color="#19212c" roughness={0.92} metalness={0.1} />
      </mesh>
      <mesh position={[7.5, 2.1, 12.0]} receiveShadow castShadow>
        <boxGeometry args={[11.0, 4.2, 0.4]} />
        <meshStandardMaterial color="#19212c" roughness={0.92} metalness={0.1} />
      </mesh>
      {/* Entry Airlock Transom Header above doorway (Opening: 4m wide x 2.8m high) */}
      <mesh position={[0, 3.5, 12.0]} receiveShadow castShadow>
        <boxGeometry args={[4.0, 1.4, 0.4]} />
        <meshStandardMaterial color="#151b24" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* Sealed Airlock South Door Frame (at Z = 12.1) */}
      <mesh position={[0, 1.4, 12.1]}>
        <boxGeometry args={[3.8, 2.8, 0.1]} />
        <meshStandardMaterial color="#0b1017" metalness={0.65} roughness={0.45} />
      </mesh>

      {/* North Wall (Z = -12.0) with Exit Bulkhead Recess */}
      <mesh position={[-8.5, 2.1, -12.0]} receiveShadow castShadow>
        <boxGeometry args={[9.0, 4.2, 0.4]} />
        <meshStandardMaterial color="#19212c" roughness={0.92} metalness={0.1} />
      </mesh>
      <mesh position={[8.5, 2.1, -12.0]} receiveShadow castShadow>
        <boxGeometry args={[9.0, 4.2, 0.4]} />
        <meshStandardMaterial color="#19212c" roughness={0.92} metalness={0.1} />
      </mesh>
      {/* North Bulkhead Portal Header */}
      <mesh position={[0, 3.7, -12.0]} receiveShadow castShadow>
        <boxGeometry args={[8.0, 1.0, 0.4]} />
        <meshStandardMaterial color="#151b24" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* West Wall (X = -13.0, 24m long, 4.2m high) */}
      <mesh position={[-13.0, 2.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.2, 24.0]} />
        <meshStandardMaterial color="#17202b" roughness={0.94} metalness={0.1} />
      </mesh>

      {/* East Wall (X = +13.0, 24m long, 4.2m high) */}
      <mesh position={[13.0, 2.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.2, 24.0]} />
        <meshStandardMaterial color="#17202b" roughness={0.94} metalness={0.1} />
      </mesh>

      {/* Architectural Reinforcement Pilasters on East & West Walls */}
      {[-8.0, -3.0, 2.0, 7.0].map((zPos, idx) => (
        <React.Fragment key={`pilaster-${idx}`}>
          <mesh position={[-12.8, 2.1, zPos]}>
            <boxGeometry args={[0.3, 4.2, 0.7]} />
            <meshStandardMaterial color="#212b38" roughness={0.85} metalness={0.2} />
          </mesh>
          <mesh position={[12.8, 2.1, zPos]}>
            <boxGeometry args={[0.3, 4.2, 0.7]} />
            <meshStandardMaterial color="#212b38" roughness={0.85} metalness={0.2} />
          </mesh>
        </React.Fragment>
      ))}

      {/* ===================================================================
          3. REINFORCED CEILING & OVERHEAD STRUCTURAL BEAMS (Y = 4.2m)
          =================================================================== */}
      {/* Concrete Ceiling Slab */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26.0, 24.0]} />
        <meshStandardMaterial color="#0c1219" roughness={0.95} />
      </mesh>

      {/* Longitudinal Main Steel I-Beams (Running along Z at X = -4.5 and X = +4.5) */}
      <mesh position={[-4.5, 3.95, 0]}>
        <boxGeometry args={[0.35, 0.45, 24.0]} />
        <meshStandardMaterial color="#1e2734" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[4.5, 3.95, 0]}>
        <boxGeometry args={[0.35, 0.45, 24.0]} />
        <meshStandardMaterial color="#1e2734" metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Transverse Cross-Girders (Running along X at Z = -8.5, -4.5, 2.0, 7.5) */}
      {[-8.5, -4.5, 2.0, 7.5].map((zPos, idx) => (
        <mesh key={`cross-girder-${idx}`} position={[0, 4.0, zPos]}>
          <boxGeometry args={[26.0, 0.35, 0.35]} />
          <meshStandardMaterial color="#222d3d" metalness={0.65} roughness={0.4} />
        </mesh>
      ))}

      {/* Overhead Steel Cable Ladders / Trays */}
      <group position={[0, 3.7, 0]}>
        {/* Main Central Cable Tray running North-South */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.1, 22.0]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} wireframe={false} />
        </mesh>
        {/* Heavy Black Industrial Cables running along the tray */}
        <mesh position={[-0.15, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 22.0, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0.15, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 22.0, 8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 22.0, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>

      {/* Overhead Ventilation Trunk Duct (Over West and East banks) */}
      <mesh position={[-8.5, 3.8, 0]}>
        <boxGeometry args={[1.2, 0.6, 22.0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[8.5, 3.8, 0]}>
        <boxGeometry args={[1.2, 0.6, 22.0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* ===================================================================
          4. FOUR PRIMARY STRUCTURAL SUPPORT COLUMNS (0.8m x 4.2m x 0.8m)
          =================================================================== */}
      {/* Column SW: [-4.5, 2.1, 4.5] */}
      <group position={[-4.5, 2.1, 4.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 4.2, 0.8]} />
          <meshStandardMaterial color="#1b2430" roughness={0.88} metalness={0.15} />
        </mesh>
        {/* Steel Column Base Ring */}
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.95]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Column SE: [4.5, 2.1, 4.5] */}
      <group position={[4.5, 2.1, 4.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 4.2, 0.8]} />
          <meshStandardMaterial color="#1b2430" roughness={0.88} metalness={0.15} />
        </mesh>
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.95]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Column NW: [-4.5, 2.1, -4.5] */}
      <group position={[-4.5, 2.1, -4.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 4.2, 0.8]} />
          <meshStandardMaterial color="#1b2430" roughness={0.88} metalness={0.15} />
        </mesh>
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.95]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Column NE: [4.5, 2.1, -4.5] */}
      <group position={[4.5, 2.1, -4.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 4.2, 0.8]} />
          <meshStandardMaterial color="#1b2430" roughness={0.88} metalness={0.15} />
        </mesh>
        <mesh position={[0, -2.0, 0]}>
          <boxGeometry args={[0.95, 0.2, 0.95]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* ===================================================================
          5. LOW INDUSTRIAL DIVIDERS & GUARDRAILS
          =================================================================== */}
      {/* South Airlock Partition Walls separating Entry Checkpoint from flanks */}
      <mesh position={[-7.5, 1.4, 7.5]} receiveShadow castShadow>
        <boxGeometry args={[9.0, 2.8, 0.25]} />
        <meshStandardMaterial color="#1c2532" roughness={0.88} metalness={0.2} />
      </mesh>
      <mesh position={[7.5, 1.4, 7.5]} receiveShadow castShadow>
        <boxGeometry args={[9.0, 2.8, 0.25]} />
        <meshStandardMaterial color="#1c2532" roughness={0.88} metalness={0.2} />
      </mesh>
      {/* Stenciled Warning Text Bar on partitions */}
      <mesh position={[-5.0, 2.2, 7.37]}>
        <boxGeometry args={[3.2, 0.15, 0.02]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>
      <mesh position={[5.0, 2.2, 7.37]}>
        <boxGeometry args={[3.2, 0.15, 0.02]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* North Exit Bulkhead Floor Safety Trench Grate (Z = -10.5 to -12.0) */}
      <mesh position={[0, 0.015, -11.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.0, 1.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} wireframe={true} />
      </mesh>
    </group>
  )
}
