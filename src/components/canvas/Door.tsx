import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DoorProps {
  position?: [number, number, number]
  isOpen?: boolean
}

export const Door: React.FC<DoorProps> = ({
  position = [0, 0, -6.94],
  isOpen = false,
}) => {
  const pivotRef = useRef<THREE.Group>(null)

  const doorWidth = 1.3
  const doorHeight = 2.4
  const doorThickness = 0.06

  const frameWidth = 0.12
  const frameDepth = 0.12

  // Visible horror color palette for the door
  const doorColor = '#34261f' // Weathered dark wood
  const panelInset = '#231914'
  const frameColor = '#1c1714'
  const handleColor = '#cca658' // Tarnished brass
  const keyholeColor = '#050505'

  // Smooth door opening animation
  useFrame((_, delta) => {
    if (!pivotRef.current) return

    // Swing open ~88 degrees inward when triggered
    const targetRotation = isOpen ? -Math.PI * 0.48 : 0
    const clampedDelta = Math.min(delta, 0.1)

    pivotRef.current.rotation.y = THREE.MathUtils.lerp(
      pivotRef.current.rotation.y,
      targetRotation,
      clampedDelta * 2.2
    )
  })

  return (
    <group position={position}>
      {/* Outer Door Frame - Left Jamb (Static) */}
      <mesh
        position={[-(doorWidth / 2 + frameWidth / 2), (doorHeight + frameWidth) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, doorHeight + frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Outer Door Frame - Right Jamb (Static) */}
      <mesh
        position={[doorWidth / 2 + frameWidth / 2, (doorHeight + frameWidth) / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[frameWidth, doorHeight + frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Outer Door Frame - Top Lintel (Static) */}
      <mesh
        position={[0, doorHeight + frameWidth / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[doorWidth + frameWidth * 2, frameWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.75} metalness={0.2} />
      </mesh>

      {/* Subtle under-door crack shadow/light trim (Static) */}
      <mesh position={[0, 0.005, 0.02]} receiveShadow>
        <planeGeometry args={[doorWidth, 0.01]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Hinge Pivot Group (Rotates along the left door edge) */}
      <group ref={pivotRef} position={[-doorWidth / 2, 0, 0]}>
        {/* Main Door Slab (Shifted by half door width relative to hinge pivot) */}
        <mesh
          position={[doorWidth / 2, doorHeight / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
          <meshStandardMaterial
            color={doorColor}
            roughness={0.68}
            metalness={0.12}
          />
        </mesh>

        {/* Decorative Door Panels (Top and Bottom Insets) */}
        {/* Top Panel Inset */}
        <mesh position={[doorWidth / 2, doorHeight * 0.72, doorThickness / 2 + 0.005]} receiveShadow>
          <boxGeometry args={[doorWidth * 0.72, doorHeight * 0.36, 0.01]} />
          <meshStandardMaterial color={panelInset} roughness={0.8} />
        </mesh>

        {/* Bottom Panel Inset */}
        <mesh position={[doorWidth / 2, doorHeight * 0.28, doorThickness / 2 + 0.005]} receiveShadow>
          <boxGeometry args={[doorWidth * 0.72, doorHeight * 0.36, 0.01]} />
          <meshStandardMaterial color={panelInset} roughness={0.8} />
        </mesh>

        {/* Door Handle Assembly */}
        {/* Backplate */}
        <mesh
          position={[doorWidth / 2 + doorWidth * 0.38, 1.05, doorThickness / 2 + 0.008]}
          castShadow
        >
          <boxGeometry args={[0.06, 0.18, 0.008]} />
          <meshStandardMaterial color={handleColor} roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Lever Handle */}
        <mesh
          position={[doorWidth / 2 + doorWidth * 0.38 - 0.03, 1.08, doorThickness / 2 + 0.03]}
          castShadow
        >
          <boxGeometry args={[0.09, 0.02, 0.02]} />
          <meshStandardMaterial color={handleColor} roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Lever Axle */}
        <mesh
          position={[doorWidth / 2 + doorWidth * 0.38, 1.08, doorThickness / 2 + 0.018]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />
          <meshStandardMaterial color={handleColor} roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Keyhole */}
        <mesh position={[doorWidth / 2 + doorWidth * 0.38, 0.98, doorThickness / 2 + 0.013]}>
          <planeGeometry args={[0.015, 0.03]} />
          <meshBasicMaterial color={keyholeColor} />
        </mesh>
      </group>
    </group>
  )
}
