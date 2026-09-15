import React from 'react'

interface RoomProps {
  width?: number
  height?: number
  depth?: number
}

export const Room: React.FC<RoomProps> = ({
  width = 4.8,
  height = 3.4,
  depth = 14,
}) => {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2

  // Refined atmospheric horror color palette with visible contrast
  const floorColor = '#1d2028'
  const wallColor = '#242732'
  const ceilingColor = '#181a22'
  const skirtingColor = '#13141a'

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.78}
          metalness={0.15}
        />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={ceilingColor}
          roughness={0.92}
          metalness={0.05}
        />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-halfWidth, halfHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[halfWidth, halfHeight, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      {/* Back Wall (Behind Player) */}
      <mesh
        position={[0, halfHeight, halfDepth]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Far Wall (Surrounding the Door at the end) */}
      <mesh
        position={[0, halfHeight, -halfDepth]}
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={wallColor}
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>

      {/* Skirting boards / Baseboards along the walls for environmental depth */}
      {/* Left Baseboard */}
      <mesh position={[-halfWidth + 0.03, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.06, 0.16, depth]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.88} />
      </mesh>

      {/* Right Baseboard */}
      <mesh position={[halfWidth - 0.03, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.06, 0.16, depth]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.88} />
      </mesh>

      {/* Far Baseboard (Left of door) */}
      <mesh position={[-halfWidth / 2 - 0.5, 0.08, -halfDepth + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[halfWidth - 1, 0.16, 0.06]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.88} />
      </mesh>

      {/* Far Baseboard (Right of door) */}
      <mesh position={[halfWidth / 2 + 0.5, 0.08, -halfDepth + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[halfWidth - 1, 0.16, 0.06]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.88} />
      </mesh>
    </group>
  )
}
