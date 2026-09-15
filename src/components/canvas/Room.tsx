import React from 'react'

interface RoomProps {
  width?: number
  height?: number
  depth?: number
}

export const Room: React.FC<RoomProps> = ({
  width = 5,
  height = 3.5,
  depth = 14,
}) => {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2

  // Dark grunge horror color palette
  const floorColor = '#101014'
  const wallColor = '#16161b'
  const ceilingColor = '#0b0b0e'
  const skirtingColor = '#08080a'

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
          roughness={0.88}
          metalness={0.12}
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
          roughness={0.95}
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
          roughness={0.85}
          metalness={0.1}
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
          roughness={0.85}
          metalness={0.1}
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
          roughness={0.9}
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
          roughness={0.9}
          metalness={0.08}
        />
      </mesh>

      {/* Skirting boards / Baseboards along the walls for environmental depth */}
      {/* Left Baseboard */}
      <mesh position={[-halfWidth + 0.03, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.06, 0.16, depth]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.9} />
      </mesh>

      {/* Right Baseboard */}
      <mesh position={[halfWidth - 0.03, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.06, 0.16, depth]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.9} />
      </mesh>

      {/* Far Baseboard (Left of door) */}
      <mesh position={[-halfWidth / 2 - 0.5, 0.08, -halfDepth + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[halfWidth - 1, 0.16, 0.06]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.9} />
      </mesh>

      {/* Far Baseboard (Right of door) */}
      <mesh position={[halfWidth / 2 + 0.5, 0.08, -halfDepth + 0.03]} receiveShadow castShadow>
        <boxGeometry args={[halfWidth - 1, 0.16, 0.06]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.9} />
      </mesh>
    </group>
  )
}
