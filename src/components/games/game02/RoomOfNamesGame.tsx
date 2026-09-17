import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoomOfNamesArena } from './RoomOfNamesArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type {
  Game02Status,
  IdentityOption,
  RoomOfNamesProps,
} from './roomOfNamesTypes'
import {
  ROOM02_WIDTH,
  ROOM02_DEPTH,
  INITIAL_ROOM02_POS,
  INITIAL_ROOM02_LOOK,
  INTERACTION_DISTANCE_THRESHOLD,
} from './roomOfNamesTypes'
import { getNearestIdentity, isCorrectIdentity } from './roomOfNamesLogic'

/**
 * Top-level coordinator for Game 02: THE ROOM OF NAMES.
 * Manages full trial lifecycle:
 * - 'intro' -> 'exploring' <-> 'examining'
 * - 'memory_transition' -> 'identity_decision'
 * - 'confirming' -> 'victory_cinematic' / 'victory' (on correct identity)
 * - 'confirming' -> 'failing' / 'failed' (on wrong identity with restart)
 */
export const RoomOfNamesGame: React.FC<RoomOfNamesProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<Game02Status>('intro')
  const [activeIdentity, setActiveIdentity] = useState<IdentityOption | null>(null)
  const [nearestIdentity, setNearestIdentity] = useState<IdentityOption | null>(null)
  const [examinedIds, setExaminedIds] = useState<Set<string>>(new Set())
  const [resetCounter, setResetCounter] = useState<number>(0)

  const statusRef = useRef<Game02Status>('intro')
  statusRef.current = status

  const nearestIdentityRef = useRef<IdentityOption | null>(null)
  nearestIdentityRef.current = nearestIdentity

  const activeIdentityRef = useRef<IdentityOption | null>(null)
  activeIdentityRef.current = activeIdentity

  const examinedCountRef = useRef<number>(0)
  examinedCountRef.current = examinedIds.size

  // Frame loop proximity detection when exploring or making identity decision
  useFrame(({ camera }) => {
    const isNavigationState =
      statusRef.current === 'exploring' || statusRef.current === 'identity_decision'

    if (!isNavigationState) {
      if (nearestIdentityRef.current !== null) {
        nearestIdentityRef.current = null
        setNearestIdentity(null)
      }
      return
    }

    const nearest = getNearestIdentity(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD
    )

    const prevId = nearestIdentityRef.current?.id || null
    const nextId = nearest?.id || null

    if (prevId !== nextId) {
      nearestIdentityRef.current = nearest
      setNearestIdentity(nearest)
    }
  })

  // Open examination modal for an identity station
  const openExamination = useCallback((identity: IdentityOption) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    setActiveIdentity(identity)
    activeIdentityRef.current = identity
    setExaminedIds((prev) => new Set(prev).add(identity.id))
    setStatus('examining')
    statusRef.current = 'examining'
  }, [])

  // Close examination modal and resume exploration or trigger 5/5 memory transition
  const closeExamination = useCallback(() => {
    setActiveIdentity(null)
    activeIdentityRef.current = null

    if (examinedCountRef.current >= 5) {
      setStatus('memory_transition')
      statusRef.current = 'memory_transition'
    } else {
      setStatus('exploring')
      statusRef.current = 'exploring'
    }
  }, [])

  // Open confirmation modal for choosing an identity
  const openConfirmation = useCallback((identity: IdentityOption) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    setActiveIdentity(identity)
    activeIdentityRef.current = identity
    setStatus('confirming')
    statusRef.current = 'confirming'
  }, [])

  // Cancel identity choice and return to identity_decision navigation
  const cancelConfirmation = useCallback(() => {
    setActiveIdentity(null)
    activeIdentityRef.current = null
    setStatus('identity_decision')
    statusRef.current = 'identity_decision'
  }, [])

  // Confirm identity choice and evaluate against puzzle logic
  const confirmIdentityChoice = useCallback(() => {
    const chosen = activeIdentityRef.current
    if (!chosen) return

    if (isCorrectIdentity(chosen.id)) {
      // Correct choice (ELIAS) -> trigger psychological victory cinematic
      setStatus('victory_cinematic')
      statusRef.current = 'victory_cinematic'
    } else {
      // Incorrect choice -> trigger stylized psychological death sequence
      setStatus('failing')
      statusRef.current = 'failing'
    }
  }, [])

  // Reset entire current Game 02 run on failure restart
  const restartTrial = useCallback(() => {
    setActiveIdentity(null)
    activeIdentityRef.current = null
    setNearestIdentity(null)
    nearestIdentityRef.current = null
    setExaminedIds(new Set())
    setResetCounter((prev) => prev + 1)
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
        if (statusRef.current === 'exploring' && nearestIdentityRef.current) {
          e.preventDefault()
          e.stopPropagation()
          openExamination(nearestIdentityRef.current)
        } else if (statusRef.current === 'identity_decision' && nearestIdentityRef.current) {
          e.preventDefault()
          e.stopPropagation()
          openConfirmation(nearestIdentityRef.current)
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
        } else if (statusRef.current === 'confirming') {
          e.preventDefault()
          e.stopPropagation()
          cancelConfirmation()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openExamination, openConfirmation, closeExamination, cancelConfirmation])

  // Direct DOM mounting for Game 02 Intro Screen
  useEffect(() => {
    let introEl = document.getElementById('game02-intro-overlay-dom')

    if (status === 'intro') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!introEl) {
        introEl = document.createElement('div')
        introEl.id = 'game02-intro-overlay-dom'
        introEl.className = 'game-intro-overlay'
        introEl.innerHTML = `
          <div class="game-intro-card">
            <span class="game-intro-tag" style="color: #70d6ff;">GAME 02</span>
            <h1 class="game-intro-title">THE ROOM OF NAMES</h1>
            <div class="game-intro-divider" style="background: #70d6ff;"></div>
            <div class="game-intro-lore">
              <p>“Remember who you are.”</p>
            </div>
            <button
              type="button"
              id="begin-game02-btn"
              class="game-intro-button"
              style="background: linear-gradient(135deg, #1e3c72, #2a5298); box-shadow: 0 6px 20px rgba(42, 82, 152, 0.4);"
            >
              BEGIN TRIAL
            </button>
          </div>
        `
        document.body.appendChild(introEl)

        const beginBtn = document.getElementById('begin-game02-btn')
        if (beginBtn) {
          beginBtn.onclick = (e) => {
            e.stopPropagation()
            setStatus('exploring')
            statusRef.current = 'exploring'
          }
        }
      }
    } else {
      if (introEl) introEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-intro-overlay-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Game 02 Exploration HUD & Proximity Prompt
  useEffect(() => {
    let hudEl = document.getElementById('game02-hud-dom')

    if (status === 'exploring' || status === 'identity_decision') {
      if (!hudEl) {
        hudEl = document.createElement('div')
        hudEl.id = 'game02-hud-dom'
        hudEl.className = 'game02-hud'
        document.body.appendChild(hudEl)
      }

      const isDecision = status === 'identity_decision'

      const actionText = isDecision ? 'CHOOSE' : 'EXAMINE'

      const promptHtml = nearestIdentity
        ? `
          <div class="game02-interaction-prompt" id="game02-prompt-dom">
            <div class="game02-prompt-identity">${nearestIdentity.name}</div>
            <div class="game02-prompt-action">
              <span class="key-badge">E</span> ${actionText}
            </div>
          </div>
        `
        : ''

      const counterText = isDecision
        ? `IDENTITIES EXAMINED: <strong class="game02-counter-highlight">5 / 5</strong> • <span class="game02-decision-hint">REMEMBER</span>`
        : `IDENTITIES EXAMINED: <strong class="game02-counter-highlight">${examinedIds.size} / 5</strong>`

      hudEl.innerHTML = `
        <div class="game02-hud-header">
          <span class="game02-hud-title">THE ROOM OF NAMES</span>
          <span class="game02-hud-counter">${counterText}</span>
        </div>
        ${promptHtml}
      `
    } else {
      if (hudEl) hudEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-hud-dom')
      if (el) el.remove()
    }
  }, [status, examinedIds.size, nearestIdentity])

  // Direct DOM mounting for Examination Clue Overlay Modal
  useEffect(() => {
    let examEl = document.getElementById('game02-examination-dom')

    if (status === 'examining' && activeIdentity) {
      if (!examEl) {
        examEl = document.createElement('div')
        examEl.id = 'game02-examination-dom'
        examEl.className = 'game02-examination-overlay'
        document.body.appendChild(examEl)
      }

      const cluesHtml = activeIdentity.memoryClues
        .map(
          (clue, idx) => `
            <div class="game02-exam-clue-item">
              <span class="game02-exam-clue-bullet">${idx + 1}</span>
              <p class="game02-exam-clue-text">${clue}</p>
            </div>
          `
        )
        .join('')

      examEl.innerHTML = `
        <div class="game02-examination-card">
          <div class="game02-exam-meta-bar">
            <span class="game02-exam-tag">THE ROOM OF NAMES</span>
          </div>
          <h2 class="game02-exam-identity-name">${activeIdentity.name}</h2>
          <div class="game02-exam-divider"></div>
          <div class="game02-exam-section-label">MEMORY CLUES</div>
          <div class="game02-exam-clues-list">
            ${cluesHtml}
          </div>
          <div class="game02-exam-footer">
            <button type="button" id="close-game02-exam-btn" class="game02-exam-close-button">
              CLOSE
            </button>
            <span class="game02-exam-keyhint">PRESS ESC TO CLOSE</span>
          </div>
        </div>
      `

      const closeBtn = document.getElementById('close-game02-exam-btn')
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.stopPropagation()
          closeExamination()
        }
      }
    } else {
      if (examEl) examEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-examination-dom')
      if (el) el.remove()
    }
  }, [status, activeIdentity, closeExamination])

  // Direct DOM mounting for 5/5 Memory Transition Psychological Sequence
  useEffect(() => {
    let transitionEl = document.getElementById('game02-memory-transition-dom')

    if (status === 'memory_transition') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!transitionEl) {
        transitionEl = document.createElement('div')
        transitionEl.id = 'game02-memory-transition-dom'
        transitionEl.className = 'game02-memory-transition-overlay'
        document.body.appendChild(transitionEl)
      }

      transitionEl.innerHTML = `
        <div class="game02-transition-card">
          <p class="game02-transition-text game02-fade-in">“You have seen five lives.”</p>
        </div>
      `

      const t1 = setTimeout(() => {
        if (transitionEl && statusRef.current === 'memory_transition') {
          transitionEl.innerHTML = `
            <div class="game02-transition-card">
              <p class="game02-transition-text game02-fade-in">“Only one of them was yours.”</p>
            </div>
          `
        }
      }, 2800)

      const t2 = setTimeout(() => {
        if (transitionEl && statusRef.current === 'memory_transition') {
          transitionEl.innerHTML = `
            <div class="game02-transition-card">
              <p class="game02-transition-text game02-transition-highlight game02-fade-in">“Remember.”</p>
            </div>
          `
        }
      }, 5800)

      const t3 = setTimeout(() => {
        if (statusRef.current === 'memory_transition') {
          setStatus('identity_decision')
          statusRef.current = 'identity_decision'
        }
      }, 8800)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        const el = document.getElementById('game02-memory-transition-dom')
        if (el) el.remove()
      }
    } else {
      if (transitionEl) transitionEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-memory-transition-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for In-World Identity Confirmation Modal
  useEffect(() => {
    let confirmEl = document.getElementById('game02-confirmation-dom')

    if (status === 'confirming' && activeIdentity) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!confirmEl) {
        confirmEl = document.createElement('div')
        confirmEl.id = 'game02-confirmation-dom'
        confirmEl.className = 'game02-confirmation-overlay'
        document.body.appendChild(confirmEl)
      }

      confirmEl.innerHTML = `
        <div class="game02-confirmation-card">
          <span class="game02-confirmation-tag">FINAL DECISION</span>
          <h2 class="game02-confirmation-name">“You chose ${activeIdentity.name}.”</h2>
          <div class="game02-confirmation-divider"></div>
          <p class="game02-confirmation-prompt">“Is this who you are?”</p>
          <div class="game02-confirmation-actions">
            <button type="button" id="confirm-identity-btn" class="game02-confirm-button">
              CONFIRM
            </button>
            <button type="button" id="cancel-identity-btn" class="game02-cancel-button">
              CANCEL
            </button>
          </div>
        </div>
      `

      const confirmBtn = document.getElementById('confirm-identity-btn')
      const cancelBtn = document.getElementById('cancel-identity-btn')

      if (confirmBtn) {
        confirmBtn.onclick = (e) => {
          e.stopPropagation()
          confirmIdentityChoice()
        }
      }

      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.stopPropagation()
          cancelConfirmation()
        }
      }
    } else {
      if (confirmEl) confirmEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-confirmation-dom')
      if (el) el.remove()
    }
  }, [status, activeIdentity, confirmIdentityChoice, cancelConfirmation])

  // Direct DOM mounting for Victory Cinematic Reveal Sequence
  useEffect(() => {
    let victoryCinematicEl = document.getElementById('game02-victory-cinematic-dom')

    if (status === 'victory_cinematic') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!victoryCinematicEl) {
        victoryCinematicEl = document.createElement('div')
        victoryCinematicEl.id = 'game02-victory-cinematic-dom'
        victoryCinematicEl.className = 'game02-victory-cinematic-overlay'
        document.body.appendChild(victoryCinematicEl)
      }

      victoryCinematicEl.innerHTML = `
        <div class="game02-transition-card">
          <p class="game02-transition-text game02-fade-in">“YOU REMEMBER.”</p>
        </div>
      `

      const t1 = setTimeout(() => {
        if (victoryCinematicEl && statusRef.current === 'victory_cinematic') {
          victoryCinematicEl.innerHTML = `
            <div class="game02-transition-card">
              <p class="game02-transition-text game02-fade-in">“THE NAME WAS ALWAYS THERE.”</p>
            </div>
          `
        }
      }, 2600)

      const t2 = setTimeout(() => {
        if (victoryCinematicEl && statusRef.current === 'victory_cinematic') {
          victoryCinematicEl.innerHTML = `
            <div class="game02-transition-card">
              <p class="game02-transition-text game02-victory-reveal-name game02-fade-in">“ELIAS”</p>
            </div>
          `
        }
      }, 5400)

      const t3 = setTimeout(() => {
        if (statusRef.current === 'victory_cinematic') {
          setStatus('victory')
          statusRef.current = 'victory'
        }
      }, 8400)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        const el = document.getElementById('game02-victory-cinematic-dom')
        if (el) el.remove()
      }
    } else {
      if (victoryCinematicEl) victoryCinematicEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-victory-cinematic-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Victory Screen
  useEffect(() => {
    let victoryEl = document.getElementById('game02-victory-dom')

    if (status === 'victory') {
      if (!victoryEl) {
        victoryEl = document.createElement('div')
        victoryEl.id = 'game02-victory-dom'
        victoryEl.className = 'game02-victory-overlay'
        victoryEl.innerHTML = `
          <div class="game02-victory-card">
            <span class="game02-victory-tag">GAME 02 COMPLETE</span>
            <h1 class="game02-victory-title">THE ROOM REMEMBERS YOU.</h1>
            <div class="game02-victory-divider"></div>
            <div class="game02-victory-lore">
              <p class="game02-victory-quote">“You remembered who you are.”</p>
              <p class="game02-victory-subtext">“The truth echoes in the quiet chamber... and the next threshold unlocks.”</p>
            </div>
            <button type="button" id="continue-game02-btn" class="game02-victory-button">
              CONTINUE
            </button>
          </div>
        `
        document.body.appendChild(victoryEl)

        const continueBtn = document.getElementById('continue-game02-btn')
        if (continueBtn) {
          continueBtn.onclick = (e) => {
            e.stopPropagation()
            setStatus('next_trial')
            statusRef.current = 'next_trial'
            if (onComplete) {
              onComplete()
            }
          }
        }
      }
    } else {
      if (victoryEl) victoryEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-victory-dom')
      if (el) el.remove()
    }
  }, [status, onComplete])

  // Direct DOM mounting for Failure Death Cinematic Sequence
  useEffect(() => {
    let deathCinematicEl = document.getElementById('game02-death-cinematic-dom')

    if (status === 'failing') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!deathCinematicEl) {
        deathCinematicEl = document.createElement('div')
        deathCinematicEl.id = 'game02-death-cinematic-dom'
        deathCinematicEl.className = 'game02-death-cinematic-overlay'
        document.body.appendChild(deathCinematicEl)
      }

      deathCinematicEl.innerHTML = `
        <div class="game02-death-glitch-pulse"></div>
        <div class="game02-transition-card">
          <p class="game02-transition-text game02-fade-in" style="color: #ff6b6b;">“YOU REMEMBERED THE WRONG LIFE.”</p>
        </div>
      `

      const t1 = setTimeout(() => {
        if (deathCinematicEl && statusRef.current === 'failing') {
          deathCinematicEl.innerHTML = `
            <div class="game02-death-glitch-pulse"></div>
            <div class="game02-transition-card">
              <p class="game02-transition-text game02-fade-in" style="color: #ff4757; font-weight: 700;">“IT REMEMBERED YOU.”</p>
            </div>
          `
        }
      }, 2600)

      const t2 = setTimeout(() => {
        if (statusRef.current === 'failing') {
          setStatus('failed')
          statusRef.current = 'failed'
        }
      }, 5800)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        const el = document.getElementById('game02-death-cinematic-dom')
        if (el) el.remove()
      }
    } else {
      if (deathCinematicEl) deathCinematicEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-death-cinematic-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Failure Screen
  useEffect(() => {
    let failureEl = document.getElementById('game02-failure-dom')

    if (status === 'failed') {
      if (!failureEl) {
        failureEl = document.createElement('div')
        failureEl.id = 'game02-failure-dom'
        failureEl.className = 'game02-failure-overlay'
        failureEl.innerHTML = `
          <div class="game02-failure-card">
            <span class="game02-failure-tag">GAME 02 FAILED</span>
            <h1 class="game02-failure-title">YOU WERE SWALLOWED BY THE ROOM.</h1>
            <div class="game02-failure-divider"></div>
            <div class="game02-failure-lore">
              <p class="game02-failure-quote">“Your true name was lost in the darkness.”</p>
              <p class="game02-failure-subtext">“The memory faded before you could reach the truth.”</p>
            </div>
            <button type="button" id="restart-game02-btn" class="game02-failure-button">
              RESTART GAME 02
            </button>
          </div>
        `
        document.body.appendChild(failureEl)

        const restartBtn = document.getElementById('restart-game02-btn')
        if (restartBtn) {
          restartBtn.onclick = (e) => {
            e.stopPropagation()
            restartTrial()
          }
        }
      }
    } else {
      if (failureEl) failureEl.remove()
    }

    return () => {
      const el = document.getElementById('game02-failure-dom')
      if (el) el.remove()
    }
  }, [status, restartTrial])

  const canMove = status === 'exploring' || status === 'identity_decision'

  return (
    <>
      {/* 3D Arena environment and 5 identity stations */}
      <RoomOfNamesArena
        examinedCount={examinedIds.size}
        isTransitioning={status === 'memory_transition' || status === 'victory_cinematic' || status === 'failing'}
        isDecisionReady={status === 'identity_decision' || status === 'confirming'}
      />

      {/* First-person player controls inside Game 02 room */}
      <PlayerControls
        roomWidth={ROOM02_WIDTH}
        roomDepth={ROOM02_DEPTH}
        initialPosition={INITIAL_ROOM02_POS}
        initialLookAt={INITIAL_ROOM02_LOOK}
        enabled={canMove}
        resetTrigger={resetCounter}
      />
    </>
  )
}
