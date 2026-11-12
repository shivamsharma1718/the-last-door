import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
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
  createInitialMazeLayout,
  getNearestMazeClue,
  computeMazeWallAABBs,
  constrainPlayerPositionInMaze,
} from './endlessMazeLogic'
import {
  useEndlessMazeStore,
  endlessMazeStore,
} from './theEndlessMazeStore'

/**
 * 3D coordinator for Game 06: THE ENDLESS MAZE.
 * Renders Three.js arena and first-person player controls inside R3F Canvas.
 * Synchronizes gameplay state, continuous proximity checks, and clue investigation with endlessMazeStore.
 */
export const TheEndlessMazeGame: React.FC<TheEndlessMazeProps> = ({
  onComplete,
}) => {
  const {
    status,
    nearestClue,
    examinedIds,
    resetCounter,
  } = useEndlessMazeStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const nearestClueRef = useRef(nearestClue)
  nearestClueRef.current = nearestClue

  const examinedIdsRef = useRef(examinedIds)
  examinedIdsRef.current = examinedIds

  // Memoize maze layout and pre-computed wall collision bounding boxes
  const mazeLayout = useMemo(() => createInitialMazeLayout(), [])
  const wallAABBs = useMemo(() => computeMazeWallAABBs(mazeLayout), [mazeLayout])

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

  // Activate Game 06 in store on mount and clean up on unmount
  useEffect(() => {
    endlessMazeStore.setActive(true)
    endlessMazeStore.initFreshRun()
    endlessMazeStore.setOnComplete(onComplete)

    return () => {
      endlessMazeStore.setActive(false)
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

  // Continuous frame loop for clue proximity checks using player/camera world position
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestClueRef.current !== null) {
        endlessMazeStore.setNearestClue(null)
      }
      return
    }

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

  const isMovementEnabled = status === 'exploring'

  return (
    <>
      {/* 3D Arena environment */}
      <TheEndlessMazeArena
        layout={mazeLayout}
        examinedIds={examinedIds}
        isExitRevealed={false}
      />

      {/* First-person player controls constrained to maze corridors */}
      <PlayerControls
        roomWidth={MAZE_GRID_WIDTH * CELL_SIZE}
        roomDepth={MAZE_GRID_DEPTH * CELL_SIZE}
        playerRadius={0.35}
        initialPosition={INITIAL_MAZE_POS}
        initialLookAt={INITIAL_MAZE_LOOK}
        enabled={isMovementEnabled}
        resetTrigger={resetCounter}
        constrainPosition={handleConstrainPosition}
      />
    </>
  )
}

