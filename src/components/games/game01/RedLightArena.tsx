import type { GameStatus, LightPhase } from './redLightTypes'
import {
  ARENA_WIDTH,
  ARENA_HEIGHT,
  ARENA_DEPTH,
  EXIT_Z,
} from './redLightTypes'

interface RedLightArenaProps {
  status: GameStatus
  phase: LightPhase
}

export const RedLightArena: React.FC<RedLightArenaProps> = ({ status, phase }) => {
  const halfWidth = ARENA_WIDTH / 2
  const halfHeight = ARENA_HEIGHT / 2
  const halfDepth = ARENA_DEPTH / 2

  const isVictory =
    status === 'victory_cinematic' || status === 'victory' || status === 'next_trial'
  const isGreen = phase === 'GREEN' || isVictory
  const lightColor =
    status === 'failing' ? '#ff0022' : isVictory ? '#00ff88' : isGreen ? '#00ff66' : '#ff1122'
  const lightIntensity =
    status === 'failing' ? 65 : isVictory ? 40 : isGreen ? 35 : 45

  return (
    <>
      {/* Cold dark arena fog */}
      <color attach="background" args={['#06080d']} />
      <fog attach="fog" args={['#06080d', 6, 42]} />

      {/* Ambient fill light ensuring the arena is clearly visible */}
      <ambientLight color="#242c3d" intensity={status === 'failing' ? 0.35 : 0.85} />

      {/* Arena Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_WIDTH, ARENA_DEPTH]} />
        <meshStandardMaterial
          color="#1e222c"
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, ARENA_HEIGHT, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_WIDTH, ARENA_DEPTH]} />
        <meshStandardMaterial
          color="#161820"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-halfWidth, halfHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_DEPTH, ARENA_HEIGHT]} />
        <meshStandardMaterial
          color="#252a38"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[halfWidth, halfHeight, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_DEPTH, ARENA_HEIGHT]} />
        <meshStandardMaterial
          color="#252a38"
          roughness={0.82}
          metalness={0.08}
        />
      </mesh>

      {/* Back Wall (Behind Player Spawn) */}
      <mesh
        position={[0, halfHeight, halfDepth]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_WIDTH, ARENA_HEIGHT]} />
        <meshStandardMaterial
          color="#1c1e28"
          roughness={0.9}
        />
      </mesh>

      {/* Far Wall (Exit End) */}
      <mesh
        position={[0, halfHeight, -halfDepth]}
        receiveShadow
      >
        <planeGeometry args={[ARENA_WIDTH, ARENA_HEIGHT]} />
        <meshStandardMaterial
          color="#1c1e28"
          roughness={0.9}
        />
      </mesh>

      {/* Floor Guidance Markers / Lines */}
      {[-15, -7.5, 0, 7.5, 15].map((zPos, idx) => (
        <mesh
          key={idx}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, zPos]}
          receiveShadow
        >
          <planeGeometry args={[ARENA_WIDTH * 0.7, 0.25]} />
          <meshBasicMaterial
            color={status === 'failing' ? '#ff0033' : isGreen ? '#00ff66' : '#ff2233'}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Side Hallway Lights for atmosphere & depth */}
      {[-12, 0, 12].map((zPos, idx) => (
        <group key={idx} position={[0, 3.8, zPos]}>
          <pointLight
            color="#2a3548"
            intensity={4.5}
            distance={14}
            decay={2}
          />
        </group>
      ))}

      {/* THE GIANT SURVEILLANCE BEACON AT FAR END */}
      <group position={[0, 2.8, EXIT_Z]}>
        {/* Metal Beacon Housing */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.9, 0.8, 24]} />
          <meshStandardMaterial color="#111216" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Glow Lens */}
        <mesh position={[0, 0, 0.42]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color={lightColor}
            emissive={lightColor}
            emissiveIntensity={status === 'failing' ? 5.5 : isGreen ? 3.0 : 4.0}
            roughness={0.1}
          />
        </mesh>

        {/* High-intensity Phase Spotlight aimed down the arena */}
        <spotLight
          position={[0, 0, 0.6]}
          target-position={[0, 1.2, 5]}
          color={lightColor}
          intensity={lightIntensity}
          distance={46}
          angle={Math.PI / 3}
          penumbra={0.6}
          decay={1.4}
        />

        {/* Local Omni light around the beacon */}
        <pointLight
          position={[0, 0, 0.5]}
          color={lightColor}
          intensity={status === 'failing' ? 28 : isGreen ? 14 : 20}
          distance={12}
          decay={2}
        />
      </group>

      {/* Exit Marker Gate at Far End */}
      <group position={[0, 0, EXIT_Z]}>
        <mesh position={[-1.2, 1.4, 0.1]}>
          <boxGeometry args={[0.15, 2.8, 0.15]} />
          <meshStandardMaterial color="#3d4452" />
        </mesh>
        <mesh position={[1.2, 1.4, 0.1]}>
          <boxGeometry args={[0.15, 2.8, 0.15]} />
          <meshStandardMaterial color="#3d4452" />
        </mesh>
        <mesh position={[0, 2.8, 0.1]}>
          <boxGeometry args={[2.55, 0.15, 0.15]} />
          <meshStandardMaterial color="#3d4452" />
        </mesh>
      </group>

      {/* Psychological Horror Silhouette looming in the beacon light on failure */}
      {(status === 'failing' || status === 'failed') && (
        <group position={[0, 0, EXIT_Z + 2.5]}>
          <mesh position={[0, 1.4, 0]}>
            <capsuleGeometry args={[0.32, 1.2, 8, 16]} />
            <meshBasicMaterial color="#020305" />
          </mesh>
          <mesh position={[0, 2.25, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#020305" />
          </mesh>
        </group>
      )}
    </>
  )
}
