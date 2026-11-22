/**
 * Game 08: WARD 13 - 3D Gameplay Coordinator
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Coordinates:
 * - 3D Arena rendering (TheWard13Arena) with dynamic doors and evidence props
 * - First-person PlayerControls with hospital corridor and locked door collision
 * - Proximity detection for evidence files and restricted sector doors
 * - E-key interaction dispatch (open/close examination)
 * - Safe pointer-lock lifecycle management
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { TheWard13Arena, constrainWard13Position } from './TheWard13Arena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheWard13Props } from './ward13Types'
import {
  INITIAL_WARD13_POS,
  INITIAL_WARD13_LOOK,
} from './ward13Types'
import {
  useWard13Store,
  ward13Store,
} from './theWard13Store'

export const TheWard13Game: React.FC<TheWard13Props> = ({
  onComplete,
}) => {
  const {
    status,
    currentRoomId,
    collectedEvidenceIds,
    unlockedRoomIds,
    currentClearanceLevel,
    resetCounter,
    isEscapePassageOpen,
    isTerminalActive,
    alarmsActive,
  } = useWard13Store()

  const statusRef = useRef(status)
  statusRef.current = status

  const unlockedRoomIdsRef = useRef(unlockedRoomIds)
  unlockedRoomIdsRef.current = unlockedRoomIds

  const isEscapePassageOpenRef = useRef(isEscapePassageOpen)
  isEscapePassageOpenRef.current = isEscapePassageOpen

  // Position constraint blocking walls, furniture, and locked security doors
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainWard13Position(
        proposed,
        current,
        radius,
        unlockedRoomIdsRef.current,
        isEscapePassageOpenRef.current
      )
    },
    []
  )

  // Activate Game 08 in store on mount and clean up on unmount
  useEffect(() => {
    ward13Store.setActive(true)
    ward13Store.initFreshRun()
    ward13Store.setOnComplete(onComplete)

    return () => {
      ward13Store.setActive(false)
    }
  }, [onComplete])

  // Release pointer lock cleanly when opening examination or non-exploring states
  useEffect(() => {
    if (status !== 'exploring') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  // Global keyboard interaction for E key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.repeat) return

      if (e.code === 'KeyE') {
        if (statusRef.current === 'exploring') {
          ward13Store.interact()
        }
      }

      if (e.code === 'KeyC' || e.code === 'Tab') {
        if (statusRef.current === 'exploring') {
          e.preventDefault()
          ward13Store.openComparisonBoard()
        }
      }

      if (e.code === 'Escape') {
        if (statusRef.current === 'comparing_evidence') {
          e.preventDefault()
          ward13Store.closeComparisonBoard()
        } else if (statusRef.current === 'terminal_input') {
          e.preventDefault()
          ward13Store.closeTerminal()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Continuous frame loop for reactive proximity tracking
  useFrame(({ camera }) => {
    if (statusRef.current === 'exploring') {
      ward13Store.updatePlayerPosition({
        x: camera.position.x,
        z: camera.position.z,
      })

      // Check if player has stepped across threshold into the maintenance escape shaft
      if (isEscapePassageOpenRef.current && camera.position.z <= -17.2) {
        ward13Store.triggerVictory()
      }
    }
  })

  return (
    <>
      {/* 1. 3D Hospital Facility Arena */}
      <TheWard13Arena
        collectedEvidenceIds={Array.from(collectedEvidenceIds)}
        currentRoomId={currentRoomId}
        unlockedRoomIds={unlockedRoomIds}
        clearanceLevel={currentClearanceLevel}
        isEscapePassageOpen={isEscapePassageOpen}
        isTerminalActive={isTerminalActive}
        alarmsActive={alarmsActive}
      />

      {/* 2. First-Person Player Navigation Controls */}
      <PlayerControls
        initialPosition={INITIAL_WARD13_POS}
        initialLookAt={INITIAL_WARD13_LOOK}
        enabled={status === 'exploring'}
        movementEnabled={status === 'exploring'}
        constrainPosition={handleConstrainPosition}
        resetTrigger={resetCounter}
      />
    </>
  )
}
