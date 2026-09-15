import React, { useEffect, useRef, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

interface PlayerControlsProps {
  selector?: string
  roomWidth?: number
  roomDepth?: number
  playerRadius?: number
  onPositionChange?: (pos: { x: number; z: number }) => void
}

interface KeyState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  sprint: boolean
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  selector,
  roomWidth = 4.8,
  roomDepth = 14,
  playerRadius = 0.35,
  onPositionChange,
}) => {
  const { camera } = useThree()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null)

  // Track keyboard state in a ref to avoid unnecessary re-renders
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  })

  // Pre-allocated vectors for garbage-collection-free frame loop calculations
  const vectors = useMemo(
    () => ({
      forward: new THREE.Vector3(),
      side: new THREE.Vector3(),
      move: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
    }),
    []
  )

  // Initial camera placement facing down the hall towards the door
  useEffect(() => {
    camera.position.set(0, 1.65, 5.2)
    camera.lookAt(new THREE.Vector3(0, 1.4, -6.95))
    onPositionChange?.({ x: 0, z: 5.2 })
  }, [camera, onPositionChange])

  // Register and clean up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Movement loop
  useFrame((_, delta) => {
    // Only allow movement if pointer lock is active (if controls ref is available)
    if (controlsRef.current && !controlsRef.current.isLocked) {
      return
    }

    // Clamp delta to prevent erratic teleportation on frame drops / tab switches
    const clampedDelta = Math.min(delta, 0.1)

    // Calculate movement speeds (m/s)
    const walkSpeed = 2.6
    const sprintSpeed = 4.8
    const currentSpeed = keys.current.sprint ? sprintSpeed : walkSpeed

    // 1. Get horizontal forward direction vector (ignoring pitch tilt)
    camera.getWorldDirection(vectors.forward)
    vectors.forward.y = 0
    vectors.forward.normalize()

    // 2. Calculate horizontal strafe vector (cross forward with up)
    vectors.side.crossVectors(vectors.forward, vectors.up).normalize()

    // 3. Reset and accumulate movement vector
    vectors.move.set(0, 0, 0)
    if (keys.current.forward) vectors.move.add(vectors.forward)
    if (keys.current.backward) vectors.move.sub(vectors.forward)
    if (keys.current.right) vectors.move.add(vectors.side)
    if (keys.current.left) vectors.move.sub(vectors.side)

    // 4. Normalize movement vector to avoid faster diagonal movement
    if (vectors.move.lengthSq() > 0) {
      vectors.move.normalize()

      // 5. Calculate proposed displacement
      const displacementX = vectors.move.x * currentSpeed * clampedDelta
      const displacementZ = vectors.move.z * currentSpeed * clampedDelta

      const nextX = camera.position.x + displacementX
      const nextZ = camera.position.z + displacementZ

      // 6. Collision boundaries (AABB room bounds with player radius and door margin)
      const minX = -roomWidth / 2 + playerRadius
      const maxX = roomWidth / 2 - playerRadius
      const minZ = -roomDepth / 2 + playerRadius + 0.15 // Offset to prevent passing through door
      const maxZ = roomDepth / 2 - playerRadius

      // 7. Clamp position within boundaries
      camera.position.x = Math.max(minX, Math.min(maxX, nextX))
      camera.position.z = Math.max(minZ, Math.min(maxZ, nextZ))
    }

    // Ensure camera height stays fixed at eye level
    camera.position.y = 1.65

    // Expose horizontal position to Scene for interaction checks
    onPositionChange?.({ x: camera.position.x, z: camera.position.z })
  })

  return <PointerLockControls ref={controlsRef} selector={selector} />
}
