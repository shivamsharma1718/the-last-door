import React from 'react'

export const Lights: React.FC = () => {
  // Hanging light position
  const fixtureX = 0
  const fixtureY = 2.7
  const fixtureZ = -1.0 // Slightly forward towards the door
  const ceilingY = 3.4

  const cordLength = ceilingY - (fixtureY + 0.25)
  const cordCenterY = ceilingY - cordLength / 2

  return (
    <group>
      {/* Rich cool ambient fill light for visible environment depth */}
      <ambientLight color="#1e2535" intensity={0.75} />

      {/* Hanging Light Fixture */}
      <group position={[fixtureX, fixtureY, fixtureZ]}>
        {/* Electrical Cord */}
        <mesh position={[0, cordCenterY - fixtureY, 0]}>
          <cylinderGeometry args={[0.006, 0.006, cordLength, 8]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.9} />
        </mesh>

        {/* Ceiling Mount Rose */}
        <mesh position={[0, ceilingY - fixtureY, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#181a20" roughness={0.8} />
        </mesh>

        {/* Metal Lamp Shade / Socket */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.18, 0.14, 16]} />
          <meshStandardMaterial color="#22262c" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Exposed Bulb */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#fff2cc"
            emissive="#ffdf80"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Main Point Light casting shadows */}
        <pointLight
          position={[0, 0.05, 0]}
          color="#ffdf99"
          intensity={24}
          distance={18}
          decay={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
          shadow-camera-near={0.1}
          shadow-camera-far={18}
        />
      </group>

      {/* Cool directional rim light illuminating the far door and hallway */}
      <spotLight
        position={[0, 3.2, 4]}
        target-position={[0, 1.2, -6.94]}
        color="#3d4f6d"
        intensity={6.0}
        distance={16}
        angle={Math.PI / 4}
        penumbra={0.7}
        decay={1.6}
      />

      {/* Subtle door bounce light at the far end */}
      <pointLight
        position={[0, 1.2, -5.5]}
        color="#2c3748"
        intensity={4.0}
        distance={6}
        decay={2}
      />
    </group>
  )
}
