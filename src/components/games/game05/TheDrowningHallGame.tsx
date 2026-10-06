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
  WATER_RISE_RATE,
} from './drowningHallTypes'
import {
  getNearestDrowningHallObject,
  getNearestValve,
} from './drowningHallLogic'
import {
  useDrowningHallStore,
  drowningHallStore,
} from './theDrowningHallStore'

/**
 * 3D coordinator for Game 05: THE DROWNING HALL.
 * Renders Three.js arena and first-person player controls inside R3F Canvas.
 * Synchronizes gameplay state, water progression, and valve interactions with drowningHallStore.
 */
export const TheDrowningHallGame: React.FC<TheDrowningHallProps> = ({
  onComplete,
}) => {
  const {
    status,
    nearestItem,
    nearestValve,
    waterLevel,
    activatedValves,
    isDrainageComplete,
    resetCounter,
  } = useDrowningHallStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const nearestItemRef = useRef(nearestItem)
  nearestItemRef.current = nearestItem

  const nearestValveRef = useRef(nearestValve)
  nearestValveRef.current = nearestValve

  const isDrainageCompleteRef = useRef(isDrainageComplete)
  isDrainageCompleteRef.current = isDrainageComplete

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
    const isPlayerActive =
      status === 'exploring' ||
      status === 'water_warning' ||
      status === 'water_critical'

    if (!isPlayerActive) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  // Continuous frame loop for water progression & proximity checks
  useFrame(({ camera }, delta) => {
    // 1. Water Progression Update
    drowningHallStore.updateWaterLevel(delta * WATER_RISE_RATE)

    const isExplorationActive =
      statusRef.current === 'exploring' ||
      statusRef.current === 'water_warning' ||
      statusRef.current === 'water_critical'

    if (!isExplorationActive) {
      if (nearestItemRef.current !== null) {
        drowningHallStore.setNearestItem(null)
      }
      if (nearestValveRef.current !== null) {
        drowningHallStore.setNearestValve(null)
      }
      return
    }

    // 2. Proximity Detection for Investigation Objects & Valves
    const nearestObj = getNearestDrowningHallObject(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G05
    )

    const nearestValveObj = !isDrainageCompleteRef.current
      ? getNearestValve(
          camera.position.x,
          camera.position.z,
          INTERACTION_DISTANCE_THRESHOLD_G05
        )
      : null

    // Determine nearest interaction target
    if (nearestObj && nearestValveObj) {
      const dxObj = camera.position.x - nearestObj.position[0]
      const dzObj = camera.position.z - nearestObj.position[2]
      const distObj = dxObj * dxObj + dzObj * dzObj

      const dxValve = camera.position.x - nearestValveObj.position[0]
      const dzValve = camera.position.z - nearestValveObj.position[2]
      const distValve = dxValve * dxValve + dzValve * dzValve

      if (distValve < distObj) {
        drowningHallStore.setNearestValve(nearestValveObj)
        drowningHallStore.setNearestItem(null)
      } else {
        drowningHallStore.setNearestItem(nearestObj)
        drowningHallStore.setNearestValve(null)
      }
    } else if (nearestValveObj) {
      drowningHallStore.setNearestValve(nearestValveObj)
      drowningHallStore.setNearestItem(null)
    } else if (nearestObj) {
      drowningHallStore.setNearestItem(nearestObj)
      drowningHallStore.setNearestValve(null)
    } else {
      drowningHallStore.setNearestItem(null)
      drowningHallStore.setNearestValve(null)
    }
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

      const isExplorationActive =
        statusRef.current === 'exploring' ||
        statusRef.current === 'water_warning' ||
        statusRef.current === 'water_critical'

      if (e.code === 'KeyE') {
        if (isExplorationActive) {
          if (nearestValveRef.current && !isDrainageCompleteRef.current) {
            e.preventDefault()
            e.stopPropagation()
            drowningHallStore.interactValve(nearestValveRef.current.id)
          } else if (nearestItemRef.current) {
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

  const isMovementEnabled =
    status === 'exploring' ||
    status === 'water_warning' ||
    status === 'water_critical'

  return (
    <>
      {/* 3D Arena environment with rising water and valve feedback */}
      <TheDrowningHallArena
        waterLevel={waterLevel}
        activatedValves={activatedValves}
      />

      {/* First-person player controls inside Game 05 room */}
      <PlayerControls
        roomWidth={ROOM05_WIDTH}
        roomDepth={ROOM05_DEPTH}
        initialPosition={INITIAL_ROOM05_POS}
        initialLookAt={INITIAL_ROOM05_LOOK}
        enabled={isMovementEnabled}
        resetTrigger={resetCounter}
      />
    </>
  )
}
