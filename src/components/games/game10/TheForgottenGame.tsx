/**
 * Game 10: THE FORGOTTEN GAME - 3D Gameplay & Navigation Coordinator
 * Theme: Memory Manipulation, Psychological Horror, Distorted History.
 *
 * Coordinates:
 * - 3D Environment Arena rendering (TheForgottenGameArena)
 * - First-person PlayerControls with sliding AABB collision boundaries
 * - Continuous frame-loop player camera position tracking and area classification
 * - Atmospheric location feedback banner (TheForgottenGameUI)
 * - Safe lifecycle management and reset triggers
 */

import React, { useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { TheForgottenGameArena, constrainForgottenGamePosition } from './TheForgottenGameArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import {
  INITIAL_GAME10_POS,
  INITIAL_GAME10_LOOK,
  GAME10_TOTAL_WIDTH,
  GAME10_TOTAL_DEPTH,
} from './game10Types'
import {
  useForgottenGameStore,
  forgottenGameStore,
} from './forgottenGameStore'
import { TheForgottenGameUI } from './TheForgottenGameUI'

export interface TheForgottenGameProps {
  onComplete?: () => void
}

export const TheForgottenGame: React.FC<TheForgottenGameProps> = ({
  onComplete,
}) => {
  const { resetCounter, interactionStatus, proximity } = useForgottenGameStore()

  // Activate Game 10 store on mount and clean up on unmount
  useEffect(() => {
    forgottenGameStore.setActive(true)
    forgottenGameStore.initFreshRun()
    forgottenGameStore.setOnComplete(onComplete)

    return () => {
      forgottenGameStore.setActive(false)
    }
  }, [onComplete])

  // Keyboard interaction handler (KeyE to investigate, Escape to close inspection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        if (interactionStatus === 'exploring' && proximity.promptText) {
          if (typeof document !== 'undefined' && document.pointerLockElement) {
            document.exitPointerLock?.()
          }
          forgottenGameStore.interact()
        }
      } else if (e.code === 'Escape') {
        if (interactionStatus === 'inspecting') {
          forgottenGameStore.closeInspection()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [interactionStatus, proximity.promptText])

  // Sliding AABB collision constraint preventing player from clipping walls or obstacles
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainForgottenGamePosition(proposed, current, radius)
    },
    []
  )

  // Continuous frame loop for player position and area tracking (active during exploration)
  useFrame(({ camera }) => {
    if (interactionStatus === 'exploring') {
      forgottenGameStore.updatePlayerPosition({
        x: camera.position.x,
        z: camera.position.z,
      })
    }
  })

  return (
    <group name="the-forgotten-game">
      {/* 3D Physical Brutalist Environment Arena */}
      <TheForgottenGameArena />

      {/* First-person Look & Movement Controls */}
      <PlayerControls
        roomWidth={GAME10_TOTAL_WIDTH}
        roomDepth={GAME10_TOTAL_DEPTH}
        initialPosition={INITIAL_GAME10_POS}
        initialLookAt={INITIAL_GAME10_LOOK}
        playerRadius={0.35}
        enabled={interactionStatus === 'exploring'}
        movementEnabled={interactionStatus === 'exploring'}
        constrainPosition={handleConstrainPosition}
        resetTrigger={resetCounter}
      />

      {/* Exploration HUD & Location Banner Overlay */}
      <TheForgottenGameUI />
    </group>
  )
}
