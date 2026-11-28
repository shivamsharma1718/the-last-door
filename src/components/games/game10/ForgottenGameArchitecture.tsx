/**
 * Game 10: THE FORGOTTEN GAME - Complete 3D Brutalist Architecture
 * Spatial layout:
 * 1. Area A: Hall of Distorted Mirrors (Starting Zone, Z = 22.0 to -4.0, X in [-3.0, 3.0])
 * 2. Area B1: Memory Wing 01 — The First Rule (West, Observation Sector, X in [-18.0, -3.0], Z in [6.0, 14.0])
 * 3. Area B2: Memory Wing 02 — The Forgotten Name (East, Clinical Archive, X in [3.0, 18.0], Z in [-2.0, 6.0])
 * 4. Area B3: Memory Wing 03 — The Command Verdict (West, Industrial Relay, X in [-18.0, -3.0], Z in [-10.0, -2.0])
 * 5. Area C: Memory Core Chamber (North, Terminal Sanctuary, X in [-10.0, 10.0], Z in [-28.0, -4.0])
 */

import React from 'react'

export const ForgottenGameArchitecture: React.FC = () => {
  return (
    <group name="forgotten-game-architecture">
      {/* ===================================================================
          1. GROUND SURFACES & FLOORS
          =================================================================== */}

      {/* Primary Subfloor Slab spanning entire facility footprint */}
      <mesh position={[0, -0.02, -3.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[46.0, 52.0]} />
        <meshStandardMaterial color="#0c1017" roughness={0.92} metalness={0.1} />
      </mesh>

      {/* Hall of Distorted Mirrors Floor (6m wide x 26m long, Z in [-4, 22]) */}
      <mesh position={[0, 0.0, 9.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.0, 26.0]} />
        <meshStandardMaterial color="#141a24" roughness={0.84} metalness={0.16} />
      </mesh>

      {/* Central Polished Floor Runner Inlay in Hallway */}
      <mesh position={[0, 0.005, 9.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.2, 25.6]} />
        <meshStandardMaterial color="#0e141e" roughness={0.65} metalness={0.35} />
      </mesh>

      {/* Wing 01 Corridor & Chamber Floor (West, Z in [6, 14]) */}
      <mesh position={[-10.5, 0.0, 10.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.0, 8.0]} />
        <meshStandardMaterial color="#131c17" roughness={0.86} metalness={0.14} />
      </mesh>

      {/* Wing 02 Corridor & Chamber Floor (East, Z in [-2, 6]) */}
      <mesh position={[10.5, 0.0, 2.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.0, 8.0]} />
        <meshStandardMaterial color="#161e28" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Wing 03 Corridor & Chamber Floor (West, Z in [-4, 4]) */}
      <mesh position={[-10.5, 0.0, 0.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.0, 8.0]} />
        <meshStandardMaterial color="#1a1c17" roughness={0.88} metalness={0.18} />
      </mesh>

      {/* Memory Core Chamber Floor (20m wide x 24m deep, Z in [-28, -4]) */}
      <mesh position={[0, 0.0, -16.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20.0, 24.0]} />
        <meshStandardMaterial color="#111620" roughness={0.82} metalness={0.22} />
      </mesh>

      {/* Core Chamber Perimeter Dark Border Trim */}
      <mesh position={[0, 0.006, -16.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.4, 9.8, 4]} />
        <meshBasicMaterial color="#0c121c" />
      </mesh>

      {/* Memory Core Center Elevated Circular Dais (Radius 2.4m, height 0.16m at [0, 0, -16]) */}
      <group position={[0, 0.08, -16.0]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[2.4, 2.6, 0.16, 32]} />
          <meshStandardMaterial color="#1c2432" roughness={0.65} metalness={0.4} />
        </mesh>
        {/* Outer Steel Dais Bevel */}
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[2.42, 2.42, 0.02, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Concentric Cyan Floor Ring Inlay */}
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.9, 2.05, 32]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* ===================================================================
          2. HALL OF DISTORTED MIRRORS (Corridor Architecture)
          =================================================================== */}

      {/* South Wall (Z = 22.0, Sealed Blast Portal) */}
      <mesh position={[0, 2.25, 22.0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 4.5, 0.4]} />
        <meshStandardMaterial color="#131922" roughness={0.92} metalness={0.1} />
      </mesh>
      {/* South Sealed Airlock Frame & Warning Plate */}
      <mesh position={[0, 1.8, 21.8]}>
        <boxGeometry args={[2.8, 3.4, 0.08]} />
        <meshStandardMaterial color="#090d14" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0, 3.65, 21.78]}>
        <boxGeometry args={[1.4, 0.12, 0.04]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* East Wall of Hall of Mirrors (X = 3.0, with opening for Wing 02 at Z in [0.5, 3.5]) */}
      {/* South Segment: Z in [3.5, 22.0] (length 18.5m) */}
      <mesh position={[3.0, 2.25, 12.75]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.5, 18.5]} />
        <meshStandardMaterial color="#161d28" roughness={0.9} metalness={0.12} />
      </mesh>
      {/* North Segment: Z in [-4.0, 0.5] (length 4.5m) */}
      <mesh position={[3.0, 2.25, -1.75]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.5, 4.5]} />
        <meshStandardMaterial color="#161d28" roughness={0.9} metalness={0.12} />
      </mesh>
      {/* Transom lintel over Wing 02 doorway (Z in [0.5, 3.5], Y in [3.2, 4.5]) */}
      <mesh position={[3.0, 3.85, 2.0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.3, 3.0]} />
        <meshStandardMaterial color="#131822" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* Wing 02 Architectural Portal Threshold Plate & Sector Indicator */}
      <mesh position={[3.0, 0.01, 2.0]} receiveShadow>
        <boxGeometry args={[0.3, 0.015, 3.0]} />
        <meshStandardMaterial color="#0b111a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[2.95, 3.25, 2.0]}>
        <boxGeometry args={[0.02, 0.1, 2.0]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* West Wall of Hall of Mirrors (X = -3.0, with openings for Wing 01 and Wing 03) */}
      {/* South Segment: Z in [11.5, 22.0] (length 10.5m) */}
      <mesh position={[-3.0, 2.25, 16.75]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.5, 10.5]} />
        <meshStandardMaterial color="#161d28" roughness={0.9} metalness={0.12} />
      </mesh>
      {/* Middle Segment between Wing 01 and Wing 03: Z in [1.5, 8.5] (length 7.0m) */}
      <mesh position={[-3.0, 2.25, 5.0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.5, 7.0]} />
        <meshStandardMaterial color="#161d28" roughness={0.9} metalness={0.12} />
      </mesh>
      {/* North Segment between Wing 03 and Core Chamber: Z in [-4.0, -1.5] (length 2.5m) */}
      <mesh position={[-3.0, 2.25, -2.75]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 4.5, 2.5]} />
        <meshStandardMaterial color="#161d28" roughness={0.9} metalness={0.12} />
      </mesh>
      {/* Transom lintel over Wing 01 doorway (Z in [8.5, 11.5], Y in [3.2, 4.5]) */}
      <mesh position={[-3.0, 3.85, 10.0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.3, 3.0]} />
        <meshStandardMaterial color="#131822" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* Wing 01 Architectural Portal Threshold Plate & Sector Indicator */}
      <mesh position={[-3.0, 0.01, 10.0]} receiveShadow>
        <boxGeometry args={[0.3, 0.015, 3.0]} />
        <meshStandardMaterial color="#0b111a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-2.95, 3.25, 10.0]}>
        <boxGeometry args={[0.02, 0.1, 2.0]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* Transom lintel over Wing 03 doorway (Z in [-1.5, 1.5], Y in [3.2, 4.5]) */}
      <mesh position={[-3.0, 3.85, 0.0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 1.3, 3.0]} />
        <meshStandardMaterial color="#131822" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* Wing 03 Architectural Portal Threshold Plate & Sector Indicator */}
      <mesh position={[-3.0, 0.01, 0.0]} receiveShadow>
        <boxGeometry args={[0.3, 0.015, 3.0]} />
        <meshStandardMaterial color="#0b111a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-2.95, 3.25, 0.0]}>
        <boxGeometry args={[0.02, 0.1, 2.0]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Ceiling of Hall of Mirrors (4.5m height) */}
      <mesh position={[0, 4.5, 9.0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.0, 26.0]} />
        <meshStandardMaterial color="#0e131c" roughness={0.95} metalness={0.08} />
      </mesh>

      {/* Brutalist Transverse Ceiling Rib Beams along Corridor */}
      {[20.0, 16.0, 12.0, 8.0, 4.0, 0.0].map((zPos) => (
        <group key={`hall-rib-${zPos}`} position={[0, 4.25, zPos]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[6.0, 0.5, 0.4]} />
            <meshStandardMaterial color="#131924" roughness={0.92} metalness={0.12} />
          </mesh>
          {/* Recessed cyan light strip along underside of rib */}
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[4.8, 0.03, 0.06]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* ===================================================================
          3. DISTORTED MIRROR PANELS (Carefully Placed with Angular Distortion)
          =================================================================== */}

      {/* West Wall Mirror Set (X = -2.8) */}
      {/* Mirror 01 (Z = 18.0) - Tilted 2.5 degrees along Y */}
      <group position={[-2.8, 2.0, 18.0]} rotation={[0, 0.045, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.045, 0, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0b1019" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* Mirror 02 (Z = 14.5) - Slightly canted vertically (X tilt) */}
      <group position={[-2.8, 2.0, 14.5]} rotation={[0.035, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.045, 0, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0c121d" roughness={0.07} metalness={0.95} />
        </mesh>
      </group>

      {/* Mirror 03 (Z = 5.5) - Segmented double panel with center fracture line */}
      <group position={[-2.8, 2.0, 5.5]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 2.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.045, 0, -0.6]} rotation={[0, -0.04, 0]}>
          <planeGeometry args={[1.1, 2.48]} />
          <meshStandardMaterial color="#090f18" roughness={0.06} metalness={0.96} />
        </mesh>
        <mesh position={[0.045, 0, 0.6]} rotation={[0, 0.04, 0]}>
          <planeGeometry args={[1.1, 2.48]} />
          <meshStandardMaterial color="#090f18" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* Mirror 04 (Z = -1.5) - Dark obsidian mirror */}
      <group position={[-2.8, 2.0, -1.5]} rotation={[0, -0.035, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.045, 0, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0b1019" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* East Wall Mirror Set (X = 2.8) */}
      {/* Mirror 05 (Z = 18.0) - Tilted -2.5 degrees along Y */}
      <group position={[2.8, 2.0, 18.0]} rotation={[0, -0.045, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-0.045, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0b1019" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* Mirror 06 (Z = 14.5) - Canted vertically */}
      <group position={[2.8, 2.0, 14.5]} rotation={[-0.035, 0, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-0.045, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0c121d" roughness={0.07} metalness={0.95} />
        </mesh>
      </group>

      {/* Mirror 07 (Z = 8.0) - Monolithic dark mirror */}
      <group position={[2.8, 2.0, 8.0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 2.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-0.045, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.08, 2.48]} />
          <meshStandardMaterial color="#090f18" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* Mirror 08 (Z = -1.5) - Slightly tilted */}
      <group position={[2.8, 2.0, -1.5]} rotation={[0, 0.035, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.08, 2.6, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-0.045, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.68, 2.48]} />
          <meshStandardMaterial color="#0b1019" roughness={0.06} metalness={0.96} />
        </mesh>
      </group>

      {/* ===================================================================
          4. MEMORY WING 01 — THE FIRST RULE (Observation Sector, West)
          =================================================================== */}
      <group name="wing-01-the-first-rule">
        {/* Connector Corridor Walls (X in [-10, -3], width 3m, Z in [8.5, 11.5]) */}
        <mesh position={[-6.5, 2.1, 11.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        <mesh position={[-6.5, 2.1, 8.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        <mesh position={[-6.5, 4.2, 10.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.0, 3.0]} />
          <meshStandardMaterial color="#0e131a" roughness={0.95} />
        </mesh>

        {/* Wing 01 Main Chamber Walls (X in [-18, -10], Z in [6, 14]) */}
        {/* North Wall (Z = 14.0) */}
        <mesh position={[-14.0, 2.1, 14.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        {/* South Wall (Z = 6.0) */}
        <mesh position={[-14.0, 2.1, 6.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        {/* East Wall partition segments (X = -10.0, outside corridor opening) */}
        <mesh position={[-10.0, 2.1, 12.75]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        <mesh position={[-10.0, 2.1, 7.25]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        {/* West Wall with Observation Aperture (X = -18.0) */}
        <mesh position={[-18.0, 0.8, 10.0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 1.6, 8.0]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        <mesh position={[-18.0, 3.5, 10.0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 1.4, 8.0]} />
          <meshStandardMaterial color="#141a22" roughness={0.9} />
        </mesh>
        {/* Observation Slit Aperture Dark Glazing Frame */}
        <mesh position={[-17.9, 2.0, 10.0]}>
          <boxGeometry args={[0.1, 1.0, 5.0]} />
          <meshStandardMaterial color="#05080c" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Thematic Red/Green Observation Warning Fixtures above aperture */}
        <mesh position={[-17.75, 2.7, 9.0]}>
          <boxGeometry args={[0.08, 0.2, 0.4]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[-17.75, 2.7, 11.0]}>
          <boxGeometry args={[0.08, 0.2, 0.4]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Thematic Observation Dais Bench in Wing 01 */}
        <mesh position={[-14.0, 0.45, 12.8]} receiveShadow castShadow>
          <boxGeometry args={[3.6, 0.9, 1.2]} />
          <meshStandardMaterial color="#1b2430" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Physical Investigation Object: Observation Log Terminal (obj_w01_observation_log) */}
        <group position={[-16.0, 0, 10.0]} name="obj_w01_observation_log">
          {/* Heavy brutalist pedestal */}
          <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.8, 0.9, 0.8]} />
            <meshStandardMaterial color="#1b222d" roughness={0.85} metalness={0.2} />
          </mesh>
          {/* Pedestal footing trim */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#0f151e" roughness={0.9} metalness={0.4} />
          </mesh>
          {/* CRT Terminal Housing */}
          <mesh position={[0, 1.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.65, 0.45, 0.55]} />
            <meshStandardMaterial color="#263140" roughness={0.7} metalness={0.35} />
          </mesh>
          {/* Green CRT Phosphor Screen (Facing East toward chamber center) */}
          <mesh position={[0.33, 1.15, 0]}>
            <boxGeometry args={[0.02, 0.32, 0.42]} />
            <meshStandardMaterial
              color="#059669"
              emissive="#10b981"
              emissiveIntensity={0.65}
              roughness={0.2}
            />
          </mesh>
          {/* Status Indicator LED */}
          <mesh position={[0.33, 1.34, -0.15]}>
            <boxGeometry args={[0.02, 0.04, 0.04]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* Cable Conduit Bundle */}
          <mesh position={[-0.25, 0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
        {/* Ceiling of Wing 01 Chamber */}
        <mesh position={[-14.0, 4.2, 10.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.0, 8.0]} />
          <meshStandardMaterial color="#0d1218" roughness={0.95} />
        </mesh>
      </group>

      {/* ===================================================================
          5. MEMORY WING 02 — THE FORGOTTEN NAME (Hospital Registry, East)
          =================================================================== */}
      <group name="wing-02-the-forgotten-name">
        {/* Connector Corridor Walls (X in [3, 10], Z in [0.5, 3.5]) */}
        <mesh position={[6.5, 2.1, 3.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#161e27" roughness={0.9} />
        </mesh>
        <mesh position={[6.5, 2.1, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#161e27" roughness={0.9} />
        </mesh>
        <mesh position={[6.5, 4.2, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.0, 3.0]} />
          <meshStandardMaterial color="#0e131b" roughness={0.95} />
        </mesh>

        {/* Wing 02 Main Chamber Walls (X in [10, 18], Z in [-2, 6]) */}
        {/* North Wall (Z = 6.0) */}
        <mesh position={[14.0, 2.1, 6.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#18202b" roughness={0.9} />
        </mesh>
        {/* South Wall (Z = -2.0) */}
        <mesh position={[14.0, 2.1, -2.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#18202b" roughness={0.9} />
        </mesh>
        {/* West Wall partition segments (X = 10.0) */}
        <mesh position={[10.0, 2.1, 4.75]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#18202b" roughness={0.9} />
        </mesh>
        <mesh position={[10.0, 2.1, -0.75]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#18202b" roughness={0.9} />
        </mesh>
        {/* East Wall (X = 18.0) with Archival Filing Recesses */}
        <mesh position={[18.0, 2.1, 2.0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 8.0]} />
          <meshStandardMaterial color="#18202b" roughness={0.9} />
        </mesh>

        {/* Clinical Archive Filing Monoliths along East Wall */}
        <mesh position={[17.4, 1.8, 3.5]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 3.4, 2.2]} />
          <meshStandardMaterial color="#1e2837" roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[17.4, 1.8, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 3.4, 2.2]} />
          <meshStandardMaterial color="#1e2837" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Clinical Registry Counter in Wing 02 */}
        <mesh position={[14.0, 0.45, -0.8]} receiveShadow castShadow>
          <boxGeometry args={[3.6, 0.9, 1.2]} />
          <meshStandardMaterial color="#222c3c" roughness={0.65} metalness={0.35} />
        </mesh>

        {/* Physical Investigation Object: Admissions Registry Ledger (obj_w02_admissions_ledger) */}
        <group position={[14.0, 0, -0.8]} name="obj_w02_admissions_ledger">
          {/* Steel mounting bracket atop counter */}
          <mesh position={[0, 0.95, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.7, 0.1, 0.5]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} />
          </mesh>
          {/* Microfiche Reader / Registry Monitor Housing */}
          <mesh position={[0, 1.18, 0]} rotation={[-0.1, 0, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.55, 0.36, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.4} />
          </mesh>
          {/* Pale Cyan Clinical CRT Screen (Facing North toward chamber center) */}
          <mesh position={[0, 1.2, 0.2]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.44, 0.26, 0.02]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.6}
              roughness={0.25}
            />
          </mesh>
          {/* Bound Metal Admissions Ledger beside reader */}
          <mesh position={[-0.55, 0.96, 0]} rotation={[0, 0.15, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.32, 0.06, 0.44]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Medical Index Label Strip */}
          <mesh position={[0, 0.96, 0.26]}>
            <boxGeometry args={[0.3, 0.02, 0.04]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
        {/* Sterile White/Cyan Light Strip in Wing 02 */}
        <mesh position={[14.0, 4.15, 2.0]}>
          <boxGeometry args={[5.0, 0.04, 0.08]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        {/* Ceiling of Wing 02 Chamber */}
        <mesh position={[14.0, 4.2, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.0, 8.0]} />
          <meshStandardMaterial color="#0e131b" roughness={0.95} />
        </mesh>
      </group>

      {/* ===================================================================
          6. MEMORY WING 03 — THE COMMAND VERDICT (Optical Relay, West)
          =================================================================== */}
      <group name="wing-03-the-command-verdict">
        {/* Connector Corridor Walls (X in [-10, -3], Z in [-1.5, 1.5]) */}
        <mesh position={[-6.5, 2.1, 1.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#161c22" roughness={0.9} />
        </mesh>
        <mesh position={[-6.5, 2.1, -1.5]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#161c22" roughness={0.9} />
        </mesh>
        <mesh position={[-6.5, 4.2, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.0, 3.0]} />
          <meshStandardMaterial color="#0d1117" roughness={0.95} />
        </mesh>

        {/* Wing 03 Main Chamber Walls (X in [-18, -10], Z in [-4, 4]) */}
        {/* North Wall (Z = -4.0, flush with Core Chamber boundary) */}
        <mesh position={[-14.0, 2.1, -4.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        {/* South Wall (Z = 4.0) */}
        <mesh position={[-14.0, 2.1, 4.0]} receiveShadow castShadow>
          <boxGeometry args={[8.0, 4.2, 0.4]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        {/* East Wall partition segments (X = -10.0, outside corridor opening Z in [-1.5, 1.5]) */}
        <mesh position={[-10.0, 2.1, 2.75]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        <mesh position={[-10.0, 2.1, -2.75]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 2.5]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>
        {/* West Wall (X = -18.0) */}
        <mesh position={[-18.0, 2.1, 0.0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 4.2, 8.0]} />
          <meshStandardMaterial color="#151b22" roughness={0.9} />
        </mesh>

        {/* Industrial Cable Tray Ladders running across ceiling */}
        <mesh position={[-14.0, 3.8, 0.0]} receiveShadow castShadow>
          <boxGeometry args={[6.5, 0.14, 0.6]} />
          <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Industrial Conduit Server Rack Monolith */}
        <mesh position={[-17.3, 1.8, 0.0]} receiveShadow castShadow>
          <boxGeometry args={[0.9, 3.4, 3.2]} />
          <meshStandardMaterial color="#1a202c" metalness={0.65} roughness={0.45} />
        </mesh>
        {/* Decoupled Optical Bus Junction Box with pulsing cyan indicator */}
        <mesh position={[-16.7, 1.4, 0.0]}>
          <boxGeometry args={[0.2, 0.5, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-16.58, 1.4, 0.0]}>
          <boxGeometry args={[0.02, 0.08, 0.4]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>

        {/* Physical Investigation Object: Decoupled Optical Relay (obj_w03_optical_relay) */}
        <group position={[-16.0, 0, 0.0]} name="obj_w03_optical_relay">
          {/* Heavy industrial pedestal */}
          <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.85, 0.9, 0.75]} />
            <meshStandardMaterial color="#1a202c" roughness={0.8} metalness={0.3} />
          </mesh>
          {/* Footing plate */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[0.95, 0.1, 0.85]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Relay Diagnostic Head Housing */}
          <mesh position={[0, 1.12, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.7, 0.45, 0.6]} />
            <meshStandardMaterial color="#2d3748" roughness={0.65} metalness={0.4} />
          </mesh>
          {/* Amber Diagnostic CRT Screen (Facing East toward chamber center) */}
          <mesh position={[0.36, 1.18, 0]}>
            <boxGeometry args={[0.02, 0.28, 0.46]} />
            <meshStandardMaterial
              color="#b45309"
              emissive="#f59e0b"
              emissiveIntensity={0.65}
              roughness={0.2}
            />
          </mesh>
          {/* Optical fiber junction gland */}
          <mesh position={[-0.2, 1.38, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.4} />
          </mesh>
          {/* Industrial Warning Label */}
          <mesh position={[0.36, 0.85, 0]}>
            <boxGeometry args={[0.01, 0.08, 0.35]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
        {/* Industrial Yellow/Black Hazard Border Line */}
        <mesh position={[-14.0, 0.012, -3.0]}>
          <boxGeometry args={[6.0, 0.01, 0.12]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        {/* Ceiling of Wing 03 Chamber */}
        <mesh position={[-14.0, 4.2, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.0, 8.0]} />
          <meshStandardMaterial color="#0d1117" roughness={0.95} />
        </mesh>
      </group>

      {/* ===================================================================
          7. MEMORY CORE CHAMBER (Grand Destination Sanctuary, North)
          =================================================================== */}
      <group name="memory-core-chamber">
        {/* North Wall (Z = -28.0, 20m wide x 6.5m high) */}
        <mesh position={[0, 3.25, -28.0]} receiveShadow castShadow>
          <boxGeometry args={[20.0, 6.5, 0.5]} />
          <meshStandardMaterial color="#111722" roughness={0.9} metalness={0.12} />
        </mesh>
        {/* East Wall (X = 10.0, 24m deep x 6.5m high) */}
        <mesh position={[10.0, 3.25, -16.0]} receiveShadow castShadow>
          <boxGeometry args={[0.5, 6.5, 24.0]} />
          <meshStandardMaterial color="#111722" roughness={0.9} metalness={0.12} />
        </mesh>
        {/* West Wall (X = -10.0, 24m deep x 6.5m high) */}
        <mesh position={[-10.0, 3.25, -16.0]} receiveShadow castShadow>
          <boxGeometry args={[0.5, 6.5, 24.0]} />
          <meshStandardMaterial color="#111722" roughness={0.9} metalness={0.12} />
        </mesh>
        {/* South Wall Portals (Z = -4.0, opening in center for Hallway X in [-3, 3]) */}
        <mesh position={[-6.5, 3.25, -4.0]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 6.5, 0.5]} />
          <meshStandardMaterial color="#111722" roughness={0.9} metalness={0.12} />
        </mesh>
        <mesh position={[6.5, 3.25, -4.0]} receiveShadow castShadow>
          <boxGeometry args={[7.0, 6.5, 0.5]} />
          <meshStandardMaterial color="#111722" roughness={0.9} metalness={0.12} />
        </mesh>
        {/* Transom lintel over entry archway (Y in [4.5, 6.5]) */}
        <mesh position={[0, 5.5, -4.0]} receiveShadow castShadow>
          <boxGeometry args={[6.0, 2.0, 0.5]} />
          <meshStandardMaterial color="#0e131b" roughness={0.92} metalness={0.15} />
        </mesh>
        {/* Core Chamber Grand Architectural Portal Threshold Plate & Sector Indicator */}
        <mesh position={[0, 0.01, -4.0]} receiveShadow>
          <boxGeometry args={[6.0, 0.015, 0.4]} />
          <meshStandardMaterial color="#090e17" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, 4.45, -3.95]}>
          <boxGeometry args={[5.0, 0.08, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>

        {/* Grand High Brutalist Ceiling (Y = 6.5m) */}
        <mesh position={[0, 6.5, -16.0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20.0, 24.0]} />
          <meshStandardMaterial color="#0a0e16" roughness={0.95} metalness={0.08} />
        </mesh>

        {/* Massive Exposed Concrete Roof Trusses in Core Chamber */}
        {[-22.0, -16.0, -10.0].map((zPos) => (
          <group key={`core-truss-${zPos}`} position={[0, 6.1, zPos]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[20.0, 0.8, 0.6]} />
              <meshStandardMaterial color="#151c27" roughness={0.9} metalness={0.15} />
            </mesh>
            {/* Recessed Cyan Ceiling Strip */}
            <mesh position={[0, -0.39, 0]}>
              <boxGeometry args={[16.0, 0.04, 0.08]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
          </group>
        ))}

        {/* Four Grand Structural Concrete Support Pillars (1.2m x 1.2m x 6.5m) */}
        {[
          { id: 'pillar-nw', pos: [-7.0, 3.25, -22.0] as const },
          { id: 'pillar-ne', pos: [7.0, 3.25, -22.0] as const },
          { id: 'pillar-sw', pos: [-7.0, 3.25, -10.0] as const },
          { id: 'pillar-se', pos: [7.0, 3.25, -10.0] as const },
        ].map(({ id, pos }) => (
          <group key={id} position={pos}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[1.2, 6.5, 1.2]} />
              <meshStandardMaterial color="#1a222f" roughness={0.88} metalness={0.18} />
            </mesh>
            {/* Dark gunmetal column base collar */}
            <mesh position={[0, -3.1, 0]}>
              <boxGeometry args={[1.35, 0.3, 1.35]} />
              <meshStandardMaterial color="#0f172a" metalness={0.65} roughness={0.4} />
            </mesh>
            {/* Crimson Diagnostic Status Indicator Light Strip */}
            <mesh position={[0, -0.2, 0.61]}>
              <boxGeometry args={[0.08, 0.6, 0.02]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        ))}

        {/* ===================================================================
            8. SUSPENDED ABSTRACT MEMORY CORE CENTERPIECE
            =================================================================== */}
        <group position={[0, 3.2, -16.0]}>
          {/* Inner Glowing Cognitive Core Prism */}
          <mesh castShadow>
            <octahedronGeometry args={[1.0, 0]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0284c7"
              emissiveIntensity={0.6}
              roughness={0.15}
              metalness={0.8}
            />
          </mesh>

          {/* Outer Layered Polyhedral Gunmetal Frame */}
          <mesh castShadow>
            <dodecahedronGeometry args={[1.45, 0]} />
            <meshStandardMaterial
              color="#0f172a"
              wireframe
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>

          {/* Intersecting Nested Gyroscopic Chrome Rings */}
          <mesh rotation={[0.4, 0.2, 0]}>
            <torusGeometry args={[1.7, 0.05, 16, 48]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh rotation={[-0.4, 0.8, 0.5]}>
            <torusGeometry args={[1.9, 0.05, 16, 48]} />
            <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Vertical Heavy Conduit Suspension Cables anchoring Core to Ceiling */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.8, 1.8, 0.8]}>
            <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0.8, 1.8, -0.8]}>
            <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[-0.8, 1.8, -0.8]}>
            <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0.8, 1.8, 0.8]}>
            <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
