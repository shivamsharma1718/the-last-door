import React from 'react'

export const Lights: React.FC = () => {
  // Hanging light position
  const fixtureX = 0
  const fixtureY = 2.7
  const fixtureZ = -1.0 // Slightly forward towards the door
  const ceilingY = 3.5

  const cordLength = ceilingY - (fixtureY + 0.25)
  const cordCenterY = ceilingY - cordLength / 2

  return (
    <group>
      {/* Dim ambient light for psychological horror tone */}
      <ambientLight color="#0f131d" intensity={0.35} />

      {/* Hanging Light Fixture */}
      <group position={[fixtureX, fixtureY, fixtureZ]}>
        {/* Electrical Cord */}
        <mesh position={[0, cordCenterY - fixtureY, 0]}>
          <cylinderGeometry args={[0.006, 0.006, cordLength, 8]} />
          <meshStandardMaterial color="#080808" roughness={0.9} />
        </mesh>

        {/* Ceiling Mount Rose */}
        <mesh position={[0, ceilingY - fixtureY, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#141414" roughness={0.8} />
        </mesh>

        {/* Metal Lamp Shade / Socket */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.18, 0.14, 16]} />
          <meshStandardMaterial color="#1a1c1e" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Exposed Bulb */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#fff0c4"
            emissive="#ffe599"
            emissiveIntensity={1.6}
            roughness={0.1}
          />
        </mesh>

        {/* Main Dim Point Light Source casting shadows */}
        <pointLight
          position={[0, 0.05, 0]}
          color="#ffdd99"
          intensity={12}
          distance={15}
          decay={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
          shadow-camera-near={0.1}
          shadow-camera-far={16}
        />
      </group>

      {/* Subtle cold accent rim light facing the door area */}
      <spotLight
        position={[0, 3.2, 3]}
        target-position={[0, 1.2, -6.9]}
        color="#2c3b52"
        intensity={3.5}
        distance={12}
        angle={Math.PI / 6}
        penumbra={0.8}
        decay={2}
      />
    </group>
  )
}
