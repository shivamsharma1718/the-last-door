import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TheDrowningHallArena } from './TheDrowningHallArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheDrowningHallProps } from './drowningHallTypes'
import {
  ROOM05_WIDTH,
  ROOM05_DEPTH,
  INITIAL_ROOM05_POS,
  INITIAL_ROOM05_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G05,
} from './drowningHallTypes'
import { getNearestDrowningHallObject } from './drowningHallLogic'
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
  const { status, nearestItem, resetCounter } = useDrowningHallStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const nearestItemRef = useRef(nearestItem)
  nearestItemRef.current = nearestItem

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

  // Continuous frame loop proximity check to investigation objects
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestItemRef.current !== null) {
        drowningHallStore.setNearestItem(null)
      }
      return
    }

    const item = getNearestDrowningHallObject(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G05
    )
    drowningHallStore.setNearestItem(item)
  })

  // Listen for 'KeyE' and 'Escape' keyboard interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.code === 'KeyE') {
        if (statusRef.current === 'exploring') {
          if (nearestItemRef.current) {
            e.preventDefault()
            e.stopPropagation()
            drowningHallStore.openExamination(nearestItemRef.current)
          }
        } else if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          drowningHallStore.closeExamination()
        }
      } else if (e.code === 'Escape') {
        if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          drowningHallStore.closeExamination()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* 3D Arena environment */}
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
