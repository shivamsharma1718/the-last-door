/**
 * Game 09: THE CONTROL ROOM - 3D Gameplay Coordinator
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Coordinates:
 * - 3D Arena rendering (TheControlRoomArena) with all 8 areas and evidence props
 * - First-person PlayerControls with brutalist bunker collision constraints
 * - Spawns player at Area 1 Entry Checkpoint [0, 1.65, 10.0] facing North toward Dais [0, 1.65, 2.0]
 * - Frame loop player proximity detection for evidence, directive consoles, and master core
 * - E-key, Tab, and Escape interaction handling
 * - Safe pointer-lock lifecycle management
 */

import React, { useCallback, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TheControlRoomArena, constrainControlRoomPosition } from './TheControlRoomArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheControlRoomProps } from './controlRoomTypes'
import {
  INITIAL_CONTROL_ROOM_POS,
  INITIAL_CONTROL_ROOM_LOOK,
  CONTROL_ROOM_TOTAL_WIDTH,
  CONTROL_ROOM_TOTAL_DEPTH,
} from './controlRoomTypes'
import {
  useControlRoomStore,
  controlRoomStore,
} from './theControlRoomStore'

export const TheControlRoomGame: React.FC<TheControlRoomProps> = ({
  onComplete,
}) => {
  const { status, resetCounter, isEvidenceBoardOpen } = useControlRoomStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const isEvidenceBoardOpenRef = useRef(isEvidenceBoardOpen)
  isEvidenceBoardOpenRef.current = isEvidenceBoardOpen

  // Activate Game 09 in store on mount and clean up on unmount
  useEffect(() => {
    controlRoomStore.setActive(true)
    controlRoomStore.initFreshRun()
    controlRoomStore.setOnComplete(onComplete)

    return () => {
      controlRoomStore.setActive(false)
    }
  }, [onComplete])

  // Release pointer lock cleanly when opening examination, directive panel, board, or non-exploring states
  useEffect(() => {
    if (status !== 'exploring' || isEvidenceBoardOpen) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status, isEvidenceBoardOpen])

  // Sliding collision constraint preventing player from clipping walls or obstacles
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainControlRoomPosition(proposed, current, radius)
    },
    []
  )

  // Global keyboard interaction for E, TAB, B, and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.repeat) return

      // Interact with nearest world target
      if (e.code === 'KeyE') {
        if (statusRef.current === 'exploring' && !isEvidenceBoardOpenRef.current) {
          controlRoomStore.interact()
        }
      }

      // Evidence Board Toggle
      if (e.code === 'Tab' || e.code === 'KeyB') {
        if (statusRef.current === 'exploring') {
          e.preventDefault()
          if (isEvidenceBoardOpenRef.current) {
            controlRoomStore.closeEvidenceBoard()
          } else {
            controlRoomStore.openEvidenceBoard()
          }
        }
      }

      // Escape close
      if (e.code === 'Escape') {
        if (isEvidenceBoardOpenRef.current) {
          e.preventDefault()
          controlRoomStore.closeEvidenceBoard()
        } else if (statusRef.current === 'examining_evidence') {
          e.preventDefault()
          controlRoomStore.closeExamination()
        } else if (statusRef.current === 'verifying_instruction') {
          e.preventDefault()
          controlRoomStore.closeDirectivePanel()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Continuous frame loop for player proximity calculation
  useFrame(({ camera }) => {
    if (statusRef.current === 'exploring') {
      controlRoomStore.updatePlayerPosition({
        x: camera.position.x,
        z: camera.position.z,
      })
    }
  })

  const isMovementAllowed = status === 'exploring' && !isEvidenceBoardOpen

  return (
    <>
      {/* 3D Physical Brutalist Control Room Environment */}
      <TheControlRoomArena />

      {/* First-person Look & Movement Controls */}
      <PlayerControls
        roomWidth={CONTROL_ROOM_TOTAL_WIDTH}
        roomDepth={CONTROL_ROOM_TOTAL_DEPTH}
        initialPosition={INITIAL_CONTROL_ROOM_POS}
        initialLookAt={INITIAL_CONTROL_ROOM_LOOK}
        playerRadius={0.35}
        enabled={isMovementAllowed}
        movementEnabled={isMovementAllowed}
        constrainPosition={handleConstrainPosition}
        resetTrigger={resetCounter}
      />
    </>
  )
}
