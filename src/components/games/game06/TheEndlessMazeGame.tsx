import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TheEndlessMazeArena } from './TheEndlessMazeArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheEndlessMazeProps } from './endlessMazeTypes'
import {
  CELL_SIZE,
  MAZE_GRID_WIDTH,
  MAZE_GRID_DEPTH,
  INITIAL_MAZE_POS,
  INITIAL_MAZE_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G06,
} from './endlessMazeTypes'
import {
  getNearestMazeClue,
  computeMazeWallAABBs,
  constrainPlayerPositionInMaze,
  evaluateShiftTrigger,
  isExitUnlocked,
  isPlayerNearExitDoor,
} from './endlessMazeLogic'
import {
  useEndlessMazeStore,
  endlessMazeStore,
} from './theEndlessMazeStore'

/**
 * 3D coordinator for Game 06: THE ENDLESS MAZE.
 * Renders Three.js arena and first-person player controls inside R3F Canvas.
 * Synchronizes gameplay state, continuous look-direction shift triggers, clue investigation, and exit escape sequence.
 */
export const TheEndlessMazeGame: React.FC<TheEndlessMazeProps> = ({
  onComplete,
}) => {
  const {
    status,
    nearestClue,
    isNearExit,
    examinedIds,
    layout,
    shiftState,
    isShifting,
    resetCounter,
  } = useEndlessMazeStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const nearestClueRef = useRef(nearestClue)
  nearestClueRef.current = nearestClue

  const isNearExitRef = useRef(isNearExit)
  isNearExitRef.current = isNearExit

  const examinedIdsRef = useRef(examinedIds)
  examinedIdsRef.current = examinedIds

  const shiftStateRef = useRef(shiftState)
  shiftStateRef.current = shiftState

  const isEscapingRef = useRef<boolean>(false)

  // Reusable 3D vector for GC-free camera look direction detection
  const lookDirVector = useMemo(() => new THREE.Vector3(), [])

  // Pre-computed wall collision bounding boxes from current active layout
  const wallAABBs = useMemo(() => computeMazeWallAABBs(layout), [layout])

  // Custom position constraint for maze corridors preventing walking through walls
  const handleConstrainPosition = useCallback(
    (
      proposed: { x: number; z: number },
      current: { x: number; z: number },
      radius: number
    ) => {
      return constrainPlayerPositionInMaze(proposed, current, radius, wallAABBs)
    },
    [wallAABBs]
  )

  // Reset escape sequence flag on run reset
  useEffect(() => {
    isEscapingRef.current = false
  }, [resetCounter])

  // Activate Game 06 in store on mount and clean up on unmount
  useEffect(() => {
    endlessMazeStore.setActive(true)
    endlessMazeStore.initFreshRun()
    endlessMazeStore.setOnComplete(onComplete)

    return () => {
      endlessMazeStore.setActive(false)
    }
  }, [onComplete])

  // Ensure pointer lock is cleanly released during non-exploring modal/cinematic states
  useEffect(() => {
    const isPlayerActive =
      status === 'exploring' || status === 'maze_shifting'

    if (!isPlayerActive) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }
    }
  }, [status])

  // Continuous frame loop for shift trigger evaluation, exit proximity, & clue detection
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestClueRef.current !== null) {
        endlessMazeStore.setNearestClue(null)
      }
      if (isNearExitRef.current) {
        endlessMazeStore.setIsNearExit(false)
      }
      return
    }

    // 1. Detect actual horizontal camera look direction
    camera.getWorldDirection(lookDirVector)
    lookDirVector.y = 0
    lookDirVector.normalize()

    // 2. Evaluate deterministic shift triggers when looking away from designated corridors
    const triggerRule = evaluateShiftTrigger(
      {
        position: { x: camera.position.x, z: camera.position.z },
        lookDirection: { x: lookDirVector.x, z: lookDirVector.z },
      },
      examinedIdsRef.current.size,
      shiftStateRef.current
    )

    if (triggerRule) {
      endlessMazeStore.triggerShift(triggerRule.id)
      return
    }

    // 3. Proximity detection for Northern Exit blast door
    const nearExit = isPlayerNearExitDoor(camera.position.x, camera.position.z, 2.6)
    endlessMazeStore.setIsNearExit(nearExit)

    // 4. Proximity detection for unexamined lore clues
    const nearest = getNearestMazeClue(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G06
    )

    if (nearest && !examinedIdsRef.current.has(nearest.id as string)) {
      endlessMazeStore.setNearestClue(nearest)
    } else {
      endlessMazeStore.setNearestClue(null)
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

      if (e.code === 'KeyE') {
        if (statusRef.current === 'exploring') {
          // Check Exit interaction first
          if (isNearExitRef.current) {
            const unlocked = isExitUnlocked(
              examinedIdsRef.current.size,
              shiftStateRef.current
            )
            if (unlocked && !isEscapingRef.current) {
              isEscapingRef.current = true
              e.preventDefault()
              e.stopPropagation()
              endlessMazeStore.triggerExitSuccess()
              return
            }
          }

          // Check Clue interaction
          if (
            nearestClueRef.current &&
            !examinedIdsRef.current.has(nearestClueRef.current.id as string)
          ) {
            e.preventDefault()
            e.stopPropagation()
            endlessMazeStore.openExamination(nearestClueRef.current)
          }
        } else if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          endlessMazeStore.closeExamination()
        }
      } else if (e.code === 'Escape') {
        if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          endlessMazeStore.closeExamination()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isExitRevealed = shiftState.activeShifts.includes('shift_exit_unseal')
  const isControlsEnabled = status === 'exploring' || status === 'maze_shifting'
  const isMovementEnabled = status === 'exploring'
  const isEscaping = status === 'victory_cinematic' || status === 'victory'

  return (
    <>
      {/* 3D Arena environment with dynamic shifted layout, horror flicker, and opening blast door */}
      <TheEndlessMazeArena
        layout={layout}
        examinedIds={examinedIds}
        isExitRevealed={isExitRevealed}
        isShifting={isShifting}
        isEscaping={isEscaping}
      />

      {/* First-person player controls constrained to maze corridors */}
      <PlayerControls
        roomWidth={MAZE_GRID_WIDTH * CELL_SIZE}
        roomDepth={MAZE_GRID_DEPTH * CELL_SIZE}
        playerRadius={0.35}
        initialPosition={INITIAL_MAZE_POS}
        initialLookAt={INITIAL_MAZE_LOOK}
        enabled={isControlsEnabled}
        movementEnabled={isMovementEnabled}
        resetTrigger={resetCounter}
        constrainPosition={handleConstrainPosition}
      />
    </>
  )
}
