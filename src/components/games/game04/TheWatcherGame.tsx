import React, { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { TheWatcherArena } from './TheWatcherArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type { TheWatcherProps } from './theWatcherTypes'
import {
  ROOM04_WIDTH,
  ROOM04_DEPTH,
  INITIAL_ROOM04_POS,
  INITIAL_ROOM04_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G04,
  WATCHER_POSITION,
} from './theWatcherTypes'
import {
  getNearestWatcherObject,
  isLookingAtWatcher,
  getWatcher,
  isAtExit,
} from './theWatcherLogic'
import { watcherStore, useWatcherStore } from './theWatcherStore'

/**
 * 3D coordinator for Game 04: THE WATCHER.
 * Renders Three.js arena and first-person player controls inside R3F Canvas.
 * Synchronizes gameplay state and interactions with watcherStore.
 */
export const TheWatcherGame: React.FC<TheWatcherProps> = ({ onComplete }) => {
  const {
    status,
    nearestItem,
    isNearExit,
    examinedIds,
    exitUnlocked,
    revealPhase,
    resetCounter,
  } = useWatcherStore()

  const statusRef = useRef(status)
  statusRef.current = status

  const nearestItemRef = useRef(nearestItem)
  nearestItemRef.current = nearestItem

  const isNearExitRef = useRef(isNearExit)
  isNearExitRef.current = isNearExit

  const exitUnlockedRef = useRef(exitUnlocked)
  exitUnlockedRef.current = exitUnlocked

  const isRevealingRef = useRef<boolean>(false)
  const lookDirRef = useRef<Vector3>(new Vector3())

  // Activate Game 04 in store on mount
  useEffect(() => {
    watcherStore.setActive(true)
    watcherStore.setOnComplete(onComplete)

    return () => {
      watcherStore.setActive(false)
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

  // Trigger one-time environmental exit reveal when 4/4 clues are discovered
  useEffect(() => {
    if (examinedIds.size === 4 && !exitUnlockedRef.current && !isRevealingRef.current) {
      isRevealingRef.current = true
      watcherStore.setRevealPhase(1) // Phase 1: Silence

      const t1 = setTimeout(() => {
        watcherStore.setRevealPhase(2) // Phase 2: Blackout
      }, 700)

      const t2 = setTimeout(() => {
        watcherStore.setRevealPhase(3) // Phase 3: Exit Spotlight Flare
      }, 1500)

      const t3 = setTimeout(() => {
        watcherStore.setRevealPhase(4) // Phase 4: Door Unlock & Active Visuals
      }, 2500)

      const t4 = setTimeout(() => {
        watcherStore.setRevealPhase(0)
        watcherStore.setExitUnlocked(true)
        exitUnlockedRef.current = true
        isRevealingRef.current = false
      }, 3500)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
      }
    }
  }, [examinedIds.size])

  // Frame loop proximity, exit detection, and Watcher look-back detection
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestItemRef.current !== null) {
        watcherStore.setNearestItem(null)
      }
      if (isNearExitRef.current) {
        watcherStore.setIsNearExit(false)
      }
      return
    }

    // 1. Check proximity to investigation objects
    const item = getNearestWatcherObject(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G04
    )
    watcherStore.setNearestItem(item)

    // 2. Check proximity to room exit
    const nearExit = isAtExit(camera.position.z, 2.0)
    watcherStore.setIsNearExit(nearExit)

    // 3. Watcher look-back detection check (active during exploration before exit unlock)
    if (!exitUnlockedRef.current && !isRevealingRef.current) {
      const watcher = getWatcher()
      const dx = camera.position.x - WATCHER_POSITION[0]
      const dy = camera.position.y - WATCHER_POSITION[1]
      const dz = camera.position.z - WATCHER_POSITION[2]
      const distToWatcher = Math.sqrt(dx * dx + dy * dy + dz * dz)

      if (distToWatcher <= watcher.detectionRange) {
        camera.getWorldDirection(lookDirRef.current)

        const isDetected = isLookingAtWatcher(
          [camera.position.x, camera.position.y, camera.position.z],
          [lookDirRef.current.x, lookDirRef.current.y, lookDirRef.current.z],
          WATCHER_POSITION,
          0.88
        )

        if (isDetected) {
          watcherStore.triggerWatcherAlert()
        }
      }
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
          if (isNearExitRef.current) {
            if (exitUnlockedRef.current) {
              e.preventDefault()
              e.stopPropagation()
              watcherStore.triggerExitSuccess()
            }
          } else if (nearestItemRef.current) {
            e.preventDefault()
            e.stopPropagation()
            watcherStore.openExamination(nearestItemRef.current)
          }
        } else if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          watcherStore.closeExamination()
        }
      } else if (e.code === 'Escape') {
        if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          watcherStore.closeExamination()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* 3D Arena environment with dynamic alert lighting response & exit reveal */}
      <TheWatcherArena
        isAlert={status === 'watcher_alert' || status === 'failing'}
        isExitUnlocked={exitUnlocked}
        revealPhase={revealPhase}
        examinedIds={examinedIds}
      />

      {/* First-person player controls inside Game 04 room */}
      <PlayerControls
        roomWidth={ROOM04_WIDTH}
        roomDepth={ROOM04_DEPTH}
        initialPosition={INITIAL_ROOM04_POS}
        initialLookAt={INITIAL_ROOM04_LOOK}
        enabled={status === 'exploring'}
        resetTrigger={resetCounter}
      />
    </>
  )
}
