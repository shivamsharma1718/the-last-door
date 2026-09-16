import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlayerControls } from '../../canvas/PlayerControls'
import { RedLightArena } from './RedLightArena'
import type {
  GameStatus,
  LightPhase,
  RedLightGameProps,
} from './redLightTypes'
import {
  INITIAL_ARENA_POS,
  INITIAL_ARENA_LOOK,
  ARENA_WIDTH,
  ARENA_DEPTH,
  EXIT_Z,
} from './redLightTypes'
import {
  GREEN_PHASE_DURATION,
  RED_PHASE_DURATION,
  MOVEMENT_DETECTION_THRESHOLD,
  calculateDistanceToExit,
  isAtExit,
} from './redLightLogic'

export const RedLightGame: React.FC<RedLightGameProps> = () => {
  // Game loop & victory/failure states
  const [status, setStatus] = useState<GameStatus>('playing')
  const [phase, setPhase] = useState<LightPhase>('GREEN')
  const [warningCount, setWarningCount] = useState<number>(0)
  const [movementWarning, setMovementWarning] = useState<boolean>(false)
  const [distanceToExit, setDistanceToExit] = useState<number>(42)
  const [resetCounter, setResetCounter] = useState<number>(0)

  const phaseRef = useRef<LightPhase>('GREEN')
  phaseRef.current = phase

  const statusRef = useRef<GameStatus>('playing')
  statusRef.current = status

  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deathSequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const victoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPosRef = useRef<{ x: number; z: number } | null>(null)
  const distanceToExitRef = useRef<number>(42)

  // Start / restart the alternating Green / Red phase timer loop
  const startPhaseLoop = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current)
    }

    const scheduleNext = () => {
      if (statusRef.current !== 'playing') return

      const isCurrentlyGreen = phaseRef.current === 'GREEN'
      const duration = isCurrentlyGreen ? GREEN_PHASE_DURATION : RED_PHASE_DURATION

      phaseTimerRef.current = setTimeout(() => {
        if (statusRef.current !== 'playing') return
        const nextPhase = isCurrentlyGreen ? 'RED' : 'GREEN'
        setPhase(nextPhase)
        scheduleNext()
      }, duration)
    }

    scheduleNext()
  }, [])

  useEffect(() => {
    startPhaseLoop()
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
      if (deathSequenceTimeoutRef.current) clearTimeout(deathSequenceTimeoutRef.current)
      if (victoryTimeoutRef.current) clearTimeout(victoryTimeoutRef.current)
    }
  }, [startPhaseLoop])

  // Trigger psychological-horror death sequence on first confirmed movement during RED LIGHT
  const triggerFailureSequence = useCallback(() => {
    if (statusRef.current !== 'playing') return

    // 1. Immediately freeze gameplay and stop light timer
    setStatus('failing')
    statusRef.current = 'failing'
    setWarningCount((prev) => prev + 1)
    setMovementWarning(true)

    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current)
    }

    // 2. Immediately unlock mouse cursor from canvas
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    // 3. Play 1.5-second cinematic death distortion sequence before showing failure overlay
    if (deathSequenceTimeoutRef.current) {
      clearTimeout(deathSequenceTimeoutRef.current)
    }

    deathSequenceTimeoutRef.current = setTimeout(() => {
      setStatus('failed')
      statusRef.current = 'failed'
      setMovementWarning(false)
    }, 1500)
  }, [])

  // Trigger victory sequence when player reaches within 1.5m of the exit
  const triggerVictorySequence = useCallback(() => {
    if (statusRef.current !== 'playing') return

    // 1. Freeze gameplay and stop light timer
    setStatus('victory_cinematic')
    statusRef.current = 'victory_cinematic'
    setMovementWarning(false)

    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current)
    }

    // 2. Immediately unlock mouse cursor from canvas
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    // 3. Short cinematic fade transition before showing Game 01 Complete overlay
    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current)
    }

    victoryTimeoutRef.current = setTimeout(() => {
      setStatus('victory')
      statusRef.current = 'victory'
    }, 1000)
  }, [])

  // Real-time frame loop: distance calculation, camera shake during failure, and red light movement detection
  useFrame(({ camera }) => {
    // Apply camera tremor/distortion during the failing cinematic sequence
    if (statusRef.current === 'failing') {
      const shakeAmount = 0.04
      camera.position.x += (Math.random() - 0.5) * shakeAmount
      camera.position.y += (Math.random() - 0.5) * shakeAmount
      return
    }

    if (statusRef.current !== 'playing') return

    // 1. Calculate live distance to exit
    const dist = calculateDistanceToExit(camera.position.z, EXIT_Z)
    if (dist !== distanceToExitRef.current) {
      distanceToExitRef.current = dist
      setDistanceToExit(dist)
    }

    // 2. Check victory condition (approx 1.5m or less to exit)
    if (isAtExit(camera.position.z, EXIT_Z)) {
      triggerVictorySequence()
      return
    }

    // 3. Detect actual physical player movement during RED LIGHT (ignoring mouse-look rotation)
    if (prevPosRef.current) {
      const dx = camera.position.x - prevPosRef.current.x
      const dz = camera.position.z - prevPosRef.current.z
      const displacement = Math.sqrt(dx * dx + dz * dz)

      // If player displaced horizontally by more than threshold while light is RED -> instant failure!
      if (displacement > MOVEMENT_DETECTION_THRESHOLD && phaseRef.current === 'RED') {
        triggerFailureSequence()
        return
      }
    }

    prevPosRef.current = { x: camera.position.x, z: camera.position.z }
  })

  // Restart Handler (Cleanly resets Game 01 without page reload)
  const handleRestart = useCallback(() => {
    if (deathSequenceTimeoutRef.current) {
      clearTimeout(deathSequenceTimeoutRef.current)
    }
    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current)
    }

    // Clean up failure, distortion, victory, and next-trial DOM elements
    const flashEl = document.getElementById('game01-distortion-flash')
    if (flashEl) flashEl.remove()
    const failEl = document.getElementById('game01-failure-dom')
    if (failEl) failEl.remove()
    const victoryFadeEl = document.getElementById('game01-victory-fade')
    if (victoryFadeEl) victoryFadeEl.remove()
    const victoryEl = document.getElementById('game01-victory-dom')
    if (victoryEl) victoryEl.remove()
    const nextTrialEl = document.getElementById('game01-next-trial-dom')
    if (nextTrialEl) nextTrialEl.remove()

    setStatus('playing')
    statusRef.current = 'playing'
    setPhase('GREEN')
    phaseRef.current = 'GREEN'
    setWarningCount(0)
    setMovementWarning(false)
    setDistanceToExit(42)
    distanceToExitRef.current = 42
    prevPosRef.current = null

    setResetCounter((prev) => prev + 1)
    startPhaseLoop()
  }, [startPhaseLoop])

  // Direct DOM mounting for the Game 01 HUD
  useEffect(() => {
    let hudEl = document.getElementById('game01-hud-dom')
    if (status === 'playing') {
      if (!hudEl) {
        hudEl = document.createElement('div')
        hudEl.id = 'game01-hud-dom'
        hudEl.className = 'game01-hud'
        document.body.appendChild(hudEl)
      }

      const isGreen = phase === 'GREEN'
      hudEl.innerHTML = `
        <div class="game01-header">
          <span class="game01-title">GAME 01 • RED LIGHT, BLACK SILENCE</span>
          <div class="game01-phase-badge ${isGreen ? 'green-phase' : 'red-phase'}">
            <span class="phase-dot"></span>
            ${isGreen ? 'GREEN LIGHT — MOVE' : 'RED LIGHT — STOP'}
          </div>
        </div>

        ${
          movementWarning
            ? '<div class="movement-warning-alert">⚠️ MOVEMENT DETECTED! SOMETHING IS WATCHING!</div>'
            : ''
        }

        <div class="game01-bottom-info">
          <div class="game01-stat">
            <span class="stat-label">WARNINGS:</span>
            <span class="stat-value ${warningCount > 0 ? 'has-warnings' : ''}">${warningCount}</span>
          </div>

          <div class="game01-objective">
            ${
              distanceToExit <= 5
                ? '<span class="game01-exit-prompt">🚪 [ EXIT REACHABLE ]</span>'
                : 'Reach the exit. Stop when the light turns red.'
            }
          </div>

          <div class="game01-stat">
            <span class="stat-label">DISTANCE:</span>
            <span class="stat-value">${distanceToExit}m</span>
          </div>
        </div>
      `
    } else {
      if (hudEl) hudEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-hud-dom')
      if (el) el.remove()
    }
  }, [status, phase, warningCount, movementWarning, distanceToExit])

  // Direct DOM mounting for Death Sequence Distortion Flash
  useEffect(() => {
    let flashEl = document.getElementById('game01-distortion-flash')
    if (status === 'failing') {
      if (!flashEl) {
        flashEl = document.createElement('div')
        flashEl.id = 'game01-distortion-flash'
        flashEl.className = 'failure-distortion-flash'
        document.body.appendChild(flashEl)
      }
    } else {
      if (flashEl) flashEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-distortion-flash')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Failure Overlay
  useEffect(() => {
    let failEl = document.getElementById('game01-failure-dom')
    if (status === 'failed') {
      if (!failEl) {
        failEl = document.createElement('div')
        failEl.id = 'game01-failure-dom'
        failEl.className = 'game-failure-overlay'
        failEl.innerHTML = `
          <div class="game-failure-card">
            <span class="failure-tag">TRIAL FAILED</span>
            <h1 class="failure-title">
              YOU MOVED.<br />
              THE ROOM REMEMBERED.
            </h1>
            <div class="failure-divider"></div>
            <div class="failure-lore">
              <p>“The light was red. You were not supposed to move.”</p>
            </div>
            <button type="button" id="restart-game01-btn" class="failure-restart-button">
              RESTART GAME
            </button>
          </div>
        `
        document.body.appendChild(failEl)

        const restartBtn = document.getElementById('restart-game01-btn')
        if (restartBtn) {
          restartBtn.onclick = (e) => {
            e.stopPropagation()
            handleRestart()
          }
        }
      }
    } else {
      if (failEl) failEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-failure-dom')
      if (el) el.remove()
    }
  }, [status, handleRestart])

  // Direct DOM mounting for Victory Cinematic Fade
  useEffect(() => {
    let fadeEl = document.getElementById('game01-victory-fade')
    if (status === 'victory_cinematic') {
      if (!fadeEl) {
        fadeEl = document.createElement('div')
        fadeEl.id = 'game01-victory-fade'
        fadeEl.className = 'victory-fade-cinematic'
        document.body.appendChild(fadeEl)
      }
    } else {
      if (fadeEl) fadeEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-victory-fade')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Game 01 Victory Overlay
  useEffect(() => {
    let victoryEl = document.getElementById('game01-victory-dom')
    if (status === 'victory') {
      if (!victoryEl) {
        victoryEl = document.createElement('div')
        victoryEl.id = 'game01-victory-dom'
        victoryEl.className = 'game-victory-overlay'
        victoryEl.innerHTML = `
          <div class="game-victory-card">
            <span class="victory-tag">GAME 01 COMPLETE</span>
            <h1 class="victory-title">
              YOU SURVIVED<br />THE FIRST RULE.
            </h1>
            <div class="victory-divider"></div>
            <div class="victory-lore">
              <p>“You survived the first rule.”</p>
              <p class="victory-subtext">“But something was watching.”</p>
            </div>
            <button type="button" id="continue-game01-btn" class="victory-continue-button">
              CONTINUE
            </button>
          </div>
        `
        document.body.appendChild(victoryEl)

        const continueBtn = document.getElementById('continue-game01-btn')
        if (continueBtn) {
          continueBtn.onclick = (e) => {
            e.stopPropagation()
            setStatus('next_trial')
            statusRef.current = 'next_trial'
          }
        }
      }
    } else {
      if (victoryEl) victoryEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-victory-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Next Trial Placeholder Screen
  useEffect(() => {
    let nextTrialEl = document.getElementById('game01-next-trial-dom')
    if (status === 'next_trial') {
      if (!nextTrialEl) {
        nextTrialEl = document.createElement('div')
        nextTrialEl.id = 'game01-next-trial-dom'
        nextTrialEl.className = 'game-next-trial-overlay'
        nextTrialEl.innerHTML = `
          <div class="game-next-trial-card">
            <span class="next-trial-tag">TRIAL CONCLUDED</span>
            <h1 class="next-trial-title">THE NEXT TRIAL AWAITS.</h1>
            <div class="next-trial-divider"></div>
            <div class="next-trial-lore">
              <p>The door ahead slowly unlocks in the darkness...</p>
            </div>
            <button type="button" id="replay-game01-btn" class="next-trial-button">
              REPLAY GAME 01
            </button>
          </div>
        `
        document.body.appendChild(nextTrialEl)

        const replayBtn = document.getElementById('replay-game01-btn')
        if (replayBtn) {
          replayBtn.onclick = (e) => {
            e.stopPropagation()
            handleRestart()
          }
        }
      }
    } else {
      if (nextTrialEl) nextTrialEl.remove()
    }

    return () => {
      const el = document.getElementById('game01-next-trial-dom')
      if (el) el.remove()
    }
  }, [status, handleRestart])

  return (
    <>
      {/* 3D Arena environment and lights */}
      <RedLightArena status={status} phase={phase} />

      {/* Arena Player Controls */}
      <PlayerControls
        roomWidth={ARENA_WIDTH}
        roomDepth={ARENA_DEPTH}
        initialPosition={INITIAL_ARENA_POS}
        initialLookAt={INITIAL_ARENA_LOOK}
        enabled={status === 'playing'}
        resetTrigger={resetCounter}
      />
    </>
  )
}
