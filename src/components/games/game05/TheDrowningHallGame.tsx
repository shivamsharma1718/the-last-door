import React, { useEffect } from 'react'
import { TheDrowningHallArena } from './TheDrowningHallArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheDrowningHallProps } from './drowningHallTypes'
import {
  ROOM05_WIDTH,
  ROOM05_DEPTH,
  INITIAL_ROOM05_POS,
  INITIAL_ROOM05_LOOK,
} from './drowningHallTypes'
import {
  useDrowningHallStore,
  drowningHallStore,
} from './theDrowningHallStore'

/**
 * 3D coordinator for Game 05: THE DROWNING HALL.
 * Renders Three.js arena and first-person player controls inside R3F Canvas.
 * Synchronizes gameplay state and interactions with drowningHallStore.
 */
export const TheDrowningHallGame: React.FC<TheDrowningHallProps> = ({
  onComplete,
}) => {
  const { status, resetCounter } = useDrowningHallStore()

  // Activate Game 05 in store on mount
  useEffect(() => {
    drowningHallStore.setActive(true)
    drowningHallStore.setOnComplete(onComplete)

    return () => {
      drowningHallStore.setActive(false)
    }
  }, [onComplete])

  // Ensure pointer lock is cleanly released whenever entering non-exploring states
  useEffect(() => {
    if (status !== 'exploring') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  return (
    <>
      {/* 3D Arena environment (Step 2 Arena with initial water level) */}
      <TheDrowningHallArena waterLevel={0} />

      {/* First-person player controls inside Game 05 room */}
      <PlayerControls
        roomWidth={ROOM05_WIDTH}
        roomDepth={ROOM05_DEPTH}
        initialPosition={INITIAL_ROOM05_POS}
        initialLookAt={INITIAL_ROOM05_LOOK}
        enabled={status === 'exploring'}
        resetTrigger={resetCounter}
      />
    </>
  )
}
