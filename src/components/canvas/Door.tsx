import React from 'react'

interface DoorProps {
  position?: [number, number, number]
}

export const Door: React.FC<DoorProps> = ({
  position = [0, 0, -6.94],
}) => {
  const doorWidth = 1.3
  const doorHeight = 2.4
  const doorThickness = 0.06

  const frameWidth = 0.12
  const frameDepth = 0.12

  // Horror color palette for the door
  const doorColor = '#211712' // Dark weathered wood
  const panelInset = '#16100d'
  const frameColor = '#120f0d'
  const handleColor = '#8a7a58' // Tarnished old brass
  const keyholeColor = '#050505'

  return (
    <group position={position}>
      {/* Outer Door Frame - Left Jamb */}
      <mesh
        position={[-(doorWidth / 2 + frameWidth / 2), (doorHeight + frameWidth) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, doorHeight + frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Outer Door Frame - Right Jamb */}
      <mesh
        position={[doorWidth / 2 + frameWidth / 2, (doorHeight + frameWidth) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, doorHeight + frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Outer Door Frame - Top Lintel */}
      <mesh
        position={[0, doorHeight + frameWidth / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[doorWidth + frameWidth * 2, frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Main Door Slab */}
      <mesh
        position={[0, doorHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
        <meshStandardMaterial
          color={doorColor}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative Door Panels (Top and Bottom Insets) */}
      {/* Top Panel Inset */}
      <mesh position={[0, doorHeight * 0.72, doorThickness / 2 + 0.005]} receiveShadow>
        <boxGeometry args={[doorWidth * 0.72, doorHeight * 0.36, 0.01]} />
        <meshStandardMaterial color={panelInset} roughness={0.85} />
      </mesh>

      {/* Bottom Panel Inset */}
      <mesh position={[0, doorHeight * 0.28, doorThickness / 2 + 0.005]} receiveShadow>
        <boxGeometry args={[doorWidth * 0.72, doorHeight * 0.36, 0.01]} />
        <meshStandardMaterial color={panelInset} roughness={0.85} />
      </mesh>

      {/* Door Handle Assembly */}
      {/* Backplate */}
      <mesh
        position={[doorWidth * 0.38, 1.05, doorThickness / 2 + 0.008]}
        castShadow
      >
        <boxGeometry args={[0.06, 0.18, 0.008]} />
        <meshStandardMaterial color={handleColor} roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Lever Handle */}
      <mesh
        position={[doorWidth * 0.38 - 0.03, 1.08, doorThickness / 2 + 0.03]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.09, 0.02, 0.02]} />
        <meshStandardMaterial color={handleColor} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Lever Axle */}
      <mesh
        position={[doorWidth * 0.38, 1.08, doorThickness / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />
        <meshStandardMaterial color={handleColor} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Keyhole */}
      <mesh position={[doorWidth * 0.38, 0.98, doorThickness / 2 + 0.013]}>
        <planeGeometry args={[0.015, 0.03]} />
        <meshBasicMaterial color={keyholeColor} />
      </mesh>

      {/* Subtle under-door crack shadow/light trim */}
      <mesh position={[0, 0.005, 0.02]} receiveShadow>
        <planeGeometry args={[doorWidth, 0.01]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  )
}
