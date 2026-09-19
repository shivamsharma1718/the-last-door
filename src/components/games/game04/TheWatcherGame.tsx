import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { TheWatcherArena } from './TheWatcherArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import { Game04Intro } from './ui/Game04Intro'
import { Game04HUD } from './ui/Game04HUD'
import { Game04Examination } from './ui/Game04Examination'
import { Game04Failure } from './ui/Game04Failure'
import { Game04Victory, Game04VictoryCinematic } from './ui/Game04Victory'
import type {
  Game04Status,
  WatcherInvestigationObject,
  TheWatcherProps,
} from './theWatcherTypes'
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

/**
 * Top-level coordinator for Game 04: THE WATCHER.
 * Manages full game lifecycle:
 * - 'intro' -> 'exploring' <-> 'examining' (clues)
 * - 4/4 clues -> one-time dramatic environmental exit reveal sequence
 * - 'exploring' (with exit unlocked) -> 'victory_cinematic' -> 'victory' -> Game 05
 * - 'exploring' (look at watcher) -> 'watcher_alert' -> 'failing' -> 'failed' (restart)
 */
export const TheWatcherGame: React.FC<TheWatcherProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<Game04Status>('intro')
  const [activeItem, setActiveItem] = useState<WatcherInvestigationObject | null>(null)
  const [nearestItem, setNearestItem] = useState<WatcherInvestigationObject | null>(null)
  const [isNearExit, setIsNearExit] = useState<boolean>(false)
  const [examinedIds, setExaminedIds] = useState<Set<string>>(new Set())
  const [exitUnlocked, setExitUnlocked] = useState<boolean>(false)
  const [revealPhase, setRevealPhase] = useState<number>(0)
  const [resetCounter, setResetCounter] = useState<number>(0)

  const statusRef = useRef<Game04Status>('intro')
  statusRef.current = status

  const nearestItemRef = useRef<WatcherInvestigationObject | null>(null)
  nearestItemRef.current = nearestItem

  const isNearExitRef = useRef<boolean>(false)
  isNearExitRef.current = isNearExit

  const exitUnlockedRef = useRef<boolean>(false)
  exitUnlockedRef.current = exitUnlocked

  const isRevealingRef = useRef<boolean>(false)

  const activeItemRef = useRef<WatcherInvestigationObject | null>(null)
  activeItemRef.current = activeItem

  const lookDirRef = useRef<Vector3>(new Vector3())

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
      setRevealPhase(1) // Phase 1: Silence

      const t1 = setTimeout(() => {
        setRevealPhase(2) // Phase 2: Blackout
      }, 700)

      const t2 = setTimeout(() => {
        setRevealPhase(3) // Phase 3: Exit Spotlight Flare
      }, 1500)

      const t3 = setTimeout(() => {
        setRevealPhase(4) // Phase 4: Door Unlock & Active Visuals
      }, 2500)

      const t4 = setTimeout(() => {
        setRevealPhase(0)
        setExitUnlocked(true)
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

  // Alert & Failure transition timers
  useEffect(() => {
    if (status === 'watcher_alert') {
      const t1 = setTimeout(() => {
        if (statusRef.current === 'watcher_alert') {
          setStatus('failing')
          statusRef.current = 'failing'
        }
      }, 1800)
      return () => clearTimeout(t1)
    }

    if (status === 'failing') {
      const t2 = setTimeout(() => {
        if (statusRef.current === 'failing') {
          setStatus('failed')
          statusRef.current = 'failed'
        }
      }, 3200)
      return () => clearTimeout(t2)
    }
  }, [status])

  // Frame loop proximity, exit detection, and Watcher look-back detection
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestItemRef.current !== null) {
        nearestItemRef.current = null
        setNearestItem(null)
      }
      if (isNearExitRef.current) {
        isNearExitRef.current = false
        setIsNearExit(false)
      }
      return
    }

    // 1. Check proximity to investigation objects
    const item = getNearestWatcherObject(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G04
    )

    const prevItemId = nearestItemRef.current?.id || null
    const nextItemId = item?.id || null
    if (prevItemId !== nextItemId) {
      nearestItemRef.current = item
      setNearestItem(item)
    }

    // 2. Check proximity to room exit
    const nearExit = isAtExit(camera.position.z, 2.0)
    if (nearExit !== isNearExitRef.current) {
      isNearExitRef.current = nearExit
      setIsNearExit(nearExit)
    }

    // 3. Watcher look-back detection check (active throughout exploration)
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
        0.707
      )

      if (isDetected) {
        if (typeof document !== 'undefined' && document.pointerLockElement) {
          document.exitPointerLock()
        }
        setStatus('watcher_alert')
        statusRef.current = 'watcher_alert'
      }
    }
  })

  // Open examination modal for an investigation target
  const openExamination = useCallback((item: WatcherInvestigationObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    setActiveItem(item)
    activeItemRef.current = item
    setExaminedIds((prev) => new Set(prev).add(item.id))
    setStatus('examining')
    statusRef.current = 'examining'
  }, [])

  // Close examination modal and return to exploration
  const closeExamination = useCallback(() => {
    setActiveItem(null)
    activeItemRef.current = null
    setStatus('exploring')
    statusRef.current = 'exploring'
  }, [])

  // Transition from Intro to Exploration on single intentional BEGIN click
  const handleBeginExploration = useCallback(() => {
    if (statusRef.current !== 'intro') return

    // Immediately acquire pointer lock using the BEGIN click user gesture
    const canvasEl = document.querySelector('canvas')
    if (canvasEl && canvasEl.requestPointerLock) {
      try {
        canvasEl.requestPointerLock()
      } catch {
        // Ignore any browser-level permission denial
      }
    }

    setStatus('exploring')
    statusRef.current = 'exploring'
  }, [])

  // Trigger successful room exit & victory cinematic
  const triggerExitSuccess = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    setStatus('victory_cinematic')
    statusRef.current = 'victory_cinematic'
  }, [])

  // Transition from cinematic to victory card
  const handleVictoryCinematicComplete = useCallback(() => {
    if (statusRef.current === 'victory_cinematic') {
      setStatus('victory')
      statusRef.current = 'victory'
    }
  }, [])

  // Transition from victory card to Game 05
  const handleVictoryContinue = useCallback(() => {
    setStatus('next_trial')
    statusRef.current = 'next_trial'
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  // Restart only Game 04 without reloading browser
  const handleRestart = useCallback(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
    setActiveItem(null)
    activeItemRef.current = null
    setNearestItem(null)
    nearestItemRef.current = null
    setIsNearExit(false)
    isNearExitRef.current = false
    setExaminedIds(new Set())
    setExitUnlocked(false)
    exitUnlockedRef.current = false
    setIsRevealing(false)
    isRevealingRef.current = false
    setRevealPhase(0)
    setResetCounter((c) => c + 1)
    setStatus('intro')
    statusRef.current = 'intro'
  }, [])

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
              triggerExitSuccess()
            }
          } else if (nearestItemRef.current) {
            e.preventDefault()
            e.stopPropagation()
            openExamination(nearestItemRef.current)
          }
        } else if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          closeExamination()
        }
      } else if (e.code === 'Escape') {
        if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          closeExamination()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openExamination, closeExamination, triggerExitSuccess])

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

      {/* DOM-rendered UI layers mounted safely into document.body via React Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {status === 'intro' && (
              <Game04Intro onBegin={handleBeginExploration} />
            )}

            {status === 'exploring' && (
              <Game04HUD
                objectsFound={examinedIds.size}
                totalObjects={4}
                isExitUnlocked={exitUnlocked}
                isNearExit={isNearExit}
                nearestItem={nearestItem}
              />
            )}

            {status === 'examining' && activeItem && (
              <Game04Examination item={activeItem} onClose={closeExamination} />
            )}

            {(status === 'watcher_alert' || status === 'failing') && (
              <div className="game04-alert-overlay" id="game04-alert-overlay-dom">
                <div className="game04-alert-glitch-pulse" />
                <div className="game04-transition-card">
                  <p
                    className="game04-transition-text game04-fade-in"
                    style={
                      status === 'watcher_alert'
                        ? { color: '#f8fafc', textShadow: '0 0 20px rgba(255,255,255,0.8)' }
                        : {
                            color: '#38bdf8',
                            fontWeight: 700,
                            textShadow: '0 0 25px rgba(56, 189, 248, 0.7)',
                          }
                    }
                  >
                    {status === 'watcher_alert'
                      ? '“IT NOTICED YOU.”'
                      : '“YOU LOOKED DIRECTLY AT IT.”'}
                  </p>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <Game04Failure onRestart={handleRestart} />
            )}

            {status === 'victory_cinematic' && (
              <Game04VictoryCinematic
                onSequenceComplete={handleVictoryCinematicComplete}
              />
            )}

            {status === 'victory' && (
              <Game04Victory onContinue={handleVictoryContinue} />
            )}
          </>,
          document.body
        )}
    </>
  )
}
