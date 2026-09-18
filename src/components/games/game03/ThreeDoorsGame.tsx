import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { ThreeDoorsArena } from './ThreeDoorsArena'
import { PlayerControls } from '../../canvas/PlayerControls'
import type {
  Game03Status,
  DoorOption,
  InvestigationObject,
  ThreeDoorsProps,
} from './threeDoorsTypes'
import {
  ROOM03_WIDTH,
  ROOM03_DEPTH,
  INITIAL_ROOM03_POS,
  INITIAL_ROOM03_LOOK,
  INTERACTION_DISTANCE_THRESHOLD_G03,
} from './threeDoorsTypes'
import {
  getNearestDoor,
  getNearestInvestigationObject,
  isCorrectDoor,
} from './threeDoorsLogic'

/**
 * Top-level coordinator for Game 03: THREE DOORS.
 * Manages game lifecycle:
 * - 'intro' -> 'exploring' <-> 'examining' (clues)
 * - 'exploring' <-> 'door_confirmation' (door inscription)
 * - 'door_confirmation' -> 'confirming' (choice locked in)
 * - 'confirming' -> 'victory_cinematic' -> 'victory' (DOOR III)
 * - 'confirming' -> 'failing' -> 'failed' (DOOR I or DOOR II)
 */
export const ThreeDoorsGame: React.FC<ThreeDoorsProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<Game03Status>('intro')
  const [activeItem, setActiveItem] = useState<InvestigationObject | null>(null)
  const [activeDoor, setActiveDoor] = useState<DoorOption | null>(null)
  const [nearestItem, setNearestItem] = useState<InvestigationObject | null>(null)
  const [nearestDoor, setNearestDoor] = useState<DoorOption | null>(null)
  const [examinedIds, setExaminedIds] = useState<Set<string>>(new Set())
  const [selectedDoor, setSelectedDoor] = useState<DoorOption | null>(null)
  const [resetCounter, setResetCounter] = useState<number>(0)

  const statusRef = useRef<Game03Status>('intro')
  statusRef.current = status

  const nearestItemRef = useRef<InvestigationObject | null>(null)
  nearestItemRef.current = nearestItem

  const nearestDoorRef = useRef<DoorOption | null>(null)
  nearestDoorRef.current = nearestDoor

  const activeItemRef = useRef<InvestigationObject | null>(null)
  activeItemRef.current = activeItem

  const activeDoorRef = useRef<DoorOption | null>(null)
  activeDoorRef.current = activeDoor

  const selectedDoorRef = useRef<DoorOption | null>(null)
  selectedDoorRef.current = selectedDoor

  // Frame loop proximity detection for both investigation objects and doors
  useFrame(({ camera }) => {
    if (statusRef.current !== 'exploring') {
      if (nearestItemRef.current !== null) {
        nearestItemRef.current = null
        setNearestItem(null)
      }
      if (nearestDoorRef.current !== null) {
        nearestDoorRef.current = null
        setNearestDoor(null)
      }
      return
    }

    const item = getNearestInvestigationObject(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G03
    )

    const door = getNearestDoor(
      camera.position.x,
      camera.position.z,
      INTERACTION_DISTANCE_THRESHOLD_G03
    )

    // Update nearest item
    const prevItemId = nearestItemRef.current?.id || null
    const nextItemId = item?.id || null
    if (prevItemId !== nextItemId) {
      nearestItemRef.current = item
      setNearestItem(item)
    }

    // Update nearest door
    const prevDoorId = nearestDoorRef.current?.id || null
    const nextDoorId = door?.id || null
    if (prevDoorId !== nextDoorId) {
      nearestDoorRef.current = door
      setNearestDoor(door)
    }
  })

  // Open examination modal for a clue target
  const openClueExamination = useCallback((item: InvestigationObject) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    setActiveItem(item)
    activeItemRef.current = item
    setExaminedIds((prev) => new Set(prev).add(item.id))
    setStatus('examining')
    statusRef.current = 'examining'
  }, [])

  // Close clue examination modal and resume exploration
  const closeClueExamination = useCallback(() => {
    setActiveItem(null)
    activeItemRef.current = null
    setStatus('exploring')
    statusRef.current = 'exploring'
  }, [])

  // Open door examination modal
  const openDoorExamination = useCallback((door: DoorOption) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    setActiveDoor(door)
    activeDoorRef.current = door
    setStatus('door_confirmation')
    statusRef.current = 'door_confirmation'
  }, [])

  // Close door examination modal and resume exploration
  const closeDoorExamination = useCallback(() => {
    setActiveDoor(null)
    activeDoorRef.current = null
    setStatus('exploring')
    statusRef.current = 'exploring'
  }, [])

  // Transition from door examination to choice confirmation
  const handleProceedToChoiceConfirmation = useCallback(() => {
    const door = activeDoorRef.current
    if (!door) return

    setSelectedDoor(door)
    selectedDoorRef.current = door
    setStatus('confirming')
    statusRef.current = 'confirming'
  }, [])

  // Cancel door choice confirmation and return to exploration
  const handleCancelDoorChoice = useCallback(() => {
    setSelectedDoor(null)
    selectedDoorRef.current = null
    setActiveDoor(null)
    activeDoorRef.current = null
    setStatus('exploring')
    statusRef.current = 'exploring'
  }, [])

  // Confirm door choice and evaluate consequence
  const handleConfirmDoorChoice = useCallback(() => {
    const door = selectedDoorRef.current
    if (!door) return

    if (isCorrectDoor(door.id)) {
      // Correct choice (DOOR III - QUIET DOOR) -> victory cinematic sequence
      setStatus('victory_cinematic')
      statusRef.current = 'victory_cinematic'
    } else {
      // Incorrect choice (DOOR I or DOOR II) -> stylized psychological failure sequence
      setStatus('failing')
      statusRef.current = 'failing'
    }
  }, [])

  // Reset entire current Game 03 run on failure restart
  const restartTrial = useCallback(() => {
    setSelectedDoor(null)
    selectedDoorRef.current = null
    setActiveDoor(null)
    activeDoorRef.current = null
    setActiveItem(null)
    activeItemRef.current = null
    setNearestDoor(null)
    nearestDoorRef.current = null
    setNearestItem(null)
    nearestItemRef.current = null
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
        if (statusRef.current === 'exploring') {
          if (nearestDoorRef.current) {
            e.preventDefault()
            e.stopPropagation()
            openDoorExamination(nearestDoorRef.current)
          } else if (nearestItemRef.current) {
            e.preventDefault()
            e.stopPropagation()
            openClueExamination(nearestItemRef.current)
          }
        } else if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          closeClueExamination()
        } else if (statusRef.current === 'door_confirmation') {
          e.preventDefault()
          e.stopPropagation()
          closeDoorExamination()
        }
      } else if (e.code === 'Escape') {
        if (statusRef.current === 'examining') {
          e.preventDefault()
          e.stopPropagation()
          closeClueExamination()
        } else if (statusRef.current === 'door_confirmation') {
          e.preventDefault()
          e.stopPropagation()
          closeDoorExamination()
        } else if (statusRef.current === 'confirming') {
          e.preventDefault()
          e.stopPropagation()
          handleCancelDoorChoice()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    openClueExamination,
    closeClueExamination,
    openDoorExamination,
    closeDoorExamination,
    handleCancelDoorChoice,
  ])

  // Direct DOM mounting for Game 03 Intro Screen
  useEffect(() => {
    let introEl = document.getElementById('game03-intro-overlay-dom')

    if (status === 'intro') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!introEl) {
        introEl = document.createElement('div')
        introEl.id = 'game03-intro-overlay-dom'
        introEl.className = 'game-intro-overlay'
        introEl.innerHTML = `
          <div class="game-intro-card">
            <span class="game-intro-tag" style="color: #e0a96d;">GAME 03</span>
            <h1 class="game-intro-title">THREE DOORS</h1>
            <div class="game-intro-divider" style="background: #e0a96d;"></div>
            <div class="game-intro-lore">
              <p class="game03-intro-line-1">“One will let you leave.”</p>
              <p class="game03-intro-line-2">“Two will not.”</p>
              <p class="game-intro-warning game03-intro-line-3">“You may ask the room three questions.”</p>
            </div>
            <button
              type="button"
              id="begin-game03-btn"
              class="game-intro-button"
              style="background: linear-gradient(135deg, #8b5a2b, #5c3818); box-shadow: 0 6px 20px rgba(139, 90, 43, 0.4);"
            >
              BEGIN
            </button>
          </div>
        `
        document.body.appendChild(introEl)

        const beginBtn = document.getElementById('begin-game03-btn')
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
      const el = document.getElementById('game03-intro-overlay-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Game 03 Exploration HUD & Proximity Prompts
  useEffect(() => {
    let hudEl = document.getElementById('game03-hud-dom')

    if (status === 'exploring') {
      if (!hudEl) {
        hudEl = document.createElement('div')
        hudEl.id = 'game03-hud-dom'
        hudEl.className = 'game03-hud'
        document.body.appendChild(hudEl)
      }

      let promptHtml = ''
      if (nearestDoor) {
        promptHtml = `
          <div class="game03-interaction-prompt" id="game03-prompt-dom">
            <div class="game03-prompt-target">[${nearestDoor.doorNumber}]</div>
            <div class="game03-prompt-action">
              <span class="key-badge">E</span> EXAMINE
            </div>
          </div>
        `
      } else if (nearestItem) {
        promptHtml = `
          <div class="game03-interaction-prompt" id="game03-prompt-dom">
            <div class="game03-prompt-target">[${nearestItem.name}]</div>
            <div class="game03-prompt-action">
              <span class="key-badge">E</span> EXAMINE
            </div>
          </div>
        `
      }

      const waitingHint = examinedIds.size >= 4
        ? ` • <span class="game03-waiting-hint">THE ROOM IS WAITING.</span>`
        : ''

      hudEl.innerHTML = `
        <div class="game03-hud-header">
          <span class="game03-hud-title">THREE DOORS</span>
          <span class="game03-hud-objective">Discover which door is telling the truth.</span>
          <span class="game03-hud-counter">
            CLUES DISCOVERED: <strong class="game03-counter-highlight">${examinedIds.size} / 4</strong>${waitingHint}
          </span>
        </div>
        ${promptHtml}
      `
    } else {
      if (hudEl) hudEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-hud-dom')
      if (el) el.remove()
    }
  }, [status, examinedIds.size, nearestItem, nearestDoor])

  // Direct DOM mounting for Clue Examination Modal
  useEffect(() => {
    let examEl = document.getElementById('game03-examination-dom')

    if (status === 'examining' && activeItem) {
      if (!examEl) {
        examEl = document.createElement('div')
        examEl.id = 'game03-examination-dom'
        examEl.className = 'game03-examination-overlay'
        document.body.appendChild(examEl)
      }

      const cluesHtml = activeItem.clues
        .map(
          (clue) => `
            <div class="game03-exam-clue-item">
              <span class="game03-exam-clue-bullet">◈</span>
              <p className="game03-exam-clue-text">${clue}</p>
            </div>
          `
        )
        .join('')

      examEl.innerHTML = `
        <div class="game03-examination-card">
          <div class="game03-exam-meta-bar">
            <span class="game03-exam-tag">THREE DOORS • CLUE</span>
          </div>
          <h2 class="game03-exam-title">${activeItem.name}</h2>
          <div class="game03-exam-divider"></div>
          <div class="game03-exam-clues-list">
            ${cluesHtml}
          </div>
          <div class="game03-exam-footer">
            <button type="button" id="close-game03-exam-btn" class="game03-exam-close-button">
              CLOSE
            </button>
            <span class="game03-exam-keyhint">PRESS ESC TO CLOSE</span>
          </div>
        </div>
      `

      const closeBtn = document.getElementById('close-game03-exam-btn')
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.stopPropagation()
          closeClueExamination()
        }
      }
    } else {
      if (examEl) examEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-examination-dom')
      if (el) el.remove()
    }
  }, [status, activeItem, closeClueExamination])

  // Direct DOM mounting for Door Examination Modal
  useEffect(() => {
    let doorExamEl = document.getElementById('game03-door-exam-dom')

    if (status === 'door_confirmation' && activeDoor) {
      if (!doorExamEl) {
        doorExamEl = document.createElement('div')
        doorExamEl.id = 'game03-door-exam-dom'
        doorExamEl.className = 'game03-door-exam-overlay'
        document.body.appendChild(doorExamEl)
      }

      const allCluesFound = examinedIds.size >= 4

      const noticeHtml = !allCluesFound
        ? `
          <div class="game03-door-locked-notice">
            <p class="game03-door-locked-text">“THE ROOM HAS NOT SHOWN YOU EVERYTHING.”</p>
          </div>
        `
        : `
          <div class="game03-door-unlocked-notice">
            <p class="game03-door-unlocked-text">“The four clues have been discovered. The threshold is open for decision.”</p>
          </div>
        `

      const chooseBtnHtml = allCluesFound
        ? `
          <button type="button" id="choose-door-btn" class="game03-choose-door-button">
            CHOOSE THIS DOOR
          </button>
        `
        : ''

      doorExamEl.innerHTML = `
        <div class="game03-door-exam-card">
          <div class="game03-exam-meta-bar">
            <span class="game03-exam-tag">DOOR EXAMINATION</span>
          </div>
          <span class="game03-door-exam-number">${activeDoor.doorNumber}</span>
          <h2 class="game03-door-exam-title">${activeDoor.name}</h2>
          <div class="game03-door-exam-divider"></div>
          <div class="game03-door-exam-statement-box">
            <span class="game03-door-statement-label">INSCRIPTION</span>
            <p class="game03-door-exam-statement">${activeDoor.statement}</p>
          </div>
          ${noticeHtml}
          <div class="game03-door-exam-actions">
            ${chooseBtnHtml}
            <button type="button" id="close-door-exam-btn" class="game03-door-close-button">
              CLOSE
            </button>
          </div>
          <span class="game03-exam-keyhint">PRESS ESC TO CLOSE</span>
        </div>
      `

      const chooseBtn = document.getElementById('choose-door-btn')
      if (chooseBtn) {
        chooseBtn.onclick = (e) => {
          e.stopPropagation()
          handleProceedToChoiceConfirmation()
        }
      }

      const closeBtn = document.getElementById('close-door-exam-btn')
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.stopPropagation()
          closeDoorExamination()
        }
      }
    } else {
      if (doorExamEl) doorExamEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-door-exam-dom')
      if (el) el.remove()
    }
  }, [
    status,
    activeDoor,
    examinedIds.size,
    handleProceedToChoiceConfirmation,
    closeDoorExamination,
  ])

  // Direct DOM mounting for Door Choice Confirmation Modal
  useEffect(() => {
    let confirmEl = document.getElementById('game03-door-confirmation-dom')

    if (status === 'confirming' && selectedDoor) {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!confirmEl) {
        confirmEl = document.createElement('div')
        confirmEl.id = 'game03-door-confirmation-dom'
        confirmEl.className = 'game03-door-confirmation-overlay'
        document.body.appendChild(confirmEl)
      }

      confirmEl.innerHTML = `
        <div class="game03-door-confirmation-card">
          <span class="game03-door-confirmation-tag">YOU CHOSE</span>
          <div class="game03-door-confirmation-number">${selectedDoor.doorNumber}</div>
          <h2 class="game03-door-confirmation-name">${selectedDoor.name}</h2>
          <div class="game03-door-confirmation-divider"></div>
          <p class="game03-door-confirmation-prompt">“Is this your decision?”</p>
          <div class="game03-door-confirmation-actions">
            <button type="button" id="confirm-door-choice-btn" class="game03-confirm-choice-button">
              CONFIRM
            </button>
            <button type="button" id="cancel-door-choice-btn" class="game03-cancel-choice-button">
              CANCEL
            </button>
          </div>
        </div>
      `

      const confirmBtn = document.getElementById('confirm-door-choice-btn')
      const cancelBtn = document.getElementById('cancel-door-choice-btn')

      if (confirmBtn) {
        confirmBtn.onclick = (e) => {
          e.stopPropagation()
          handleConfirmDoorChoice()
        }
      }

      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.stopPropagation()
          handleCancelDoorChoice()
        }
      }
    } else {
      if (confirmEl) confirmEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-door-confirmation-dom')
      if (el) el.remove()
    }
  }, [
    status,
    selectedDoor,
    handleConfirmDoorChoice,
    handleCancelDoorChoice,
  ])

  // Direct DOM mounting for Victory Cinematic Reveal Sequence
  useEffect(() => {
    let victoryCinematicEl = document.getElementById('game03-victory-cinematic-dom')

    if (status === 'victory_cinematic') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!victoryCinematicEl) {
        victoryCinematicEl = document.createElement('div')
        victoryCinematicEl.id = 'game03-victory-cinematic-dom'
        victoryCinematicEl.className = 'game03-victory-cinematic-overlay'
        document.body.appendChild(victoryCinematicEl)
      }

      victoryCinematicEl.innerHTML = `
        <div class="game03-transition-card">
          <p class="game03-transition-text game03-fade-in">“You didn't choose the door that promised safety.”</p>
        </div>
      `

      const t1 = setTimeout(() => {
        if (victoryCinematicEl && statusRef.current === 'victory_cinematic') {
          victoryCinematicEl.innerHTML = `
            <div class="game03-transition-card">
              <p class="game03-transition-text game03-fade-in">“You chose the one that asked nothing from you.”</p>
            </div>
          `
        }
      }, 2800)

      const t2 = setTimeout(() => {
        if (victoryCinematicEl && statusRef.current === 'victory_cinematic') {
          victoryCinematicEl.innerHTML = `
            <div class="game03-transition-card">
              <p class="game03-transition-text game03-fade-in">“Perhaps that is why you survived.”</p>
            </div>
          `
        }
      }, 5800)

      const t3 = setTimeout(() => {
        if (victoryCinematicEl && statusRef.current === 'victory_cinematic') {
          victoryCinematicEl.innerHTML = `
            <div class="game03-transition-card">
              <p class="game03-transition-text game03-victory-reveal-highlight game03-fade-in">“THE ROOM COULD NOT CONVINCE YOU.”</p>
            </div>
          `
        }
      }, 8800)

      const t4 = setTimeout(() => {
        if (statusRef.current === 'victory_cinematic') {
          setStatus('victory')
          statusRef.current = 'victory'
        }
      }, 11800)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        clearTimeout(t4)
        const el = document.getElementById('game03-victory-cinematic-dom')
        if (el) el.remove()
      }
    } else {
      if (victoryCinematicEl) victoryCinematicEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-victory-cinematic-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Victory Screen
  useEffect(() => {
    let victoryEl = document.getElementById('game03-victory-dom')

    if (status === 'victory') {
      if (!victoryEl) {
        victoryEl = document.createElement('div')
        victoryEl.id = 'game03-victory-dom'
        victoryEl.className = 'game03-victory-overlay'
        victoryEl.innerHTML = `
          <div class="game03-victory-card">
            <span class="game03-victory-tag">GAME 03 COMPLETE</span>
            <h1 class="game03-victory-title">THE ROOM COULD NOT CONVINCE YOU.</h1>
            <div class="game03-victory-divider"></div>
            <div class="game03-victory-lore">
              <p class="game03-victory-quote">“You chose the one that asked nothing from you.”</p>
              <p class="game03-victory-subtext">“The truth was silent... and the next corridor reveals itself.”</p>
            </div>
            <button type="button" id="continue-game03-btn" class="game03-victory-button">
              CONTINUE
            </button>
          </div>
        `
        document.body.appendChild(victoryEl)

        const continueBtn = document.getElementById('continue-game03-btn')
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
      const el = document.getElementById('game03-victory-dom')
      if (el) el.remove()
    }
  }, [status, onComplete])

  // Direct DOM mounting for Failure Death Cinematic Sequence
  useEffect(() => {
    let deathCinematicEl = document.getElementById('game03-death-cinematic-dom')

    if (status === 'failing') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      if (!deathCinematicEl) {
        deathCinematicEl = document.createElement('div')
        deathCinematicEl.id = 'game03-death-cinematic-dom'
        deathCinematicEl.className = 'game03-death-cinematic-overlay'
        document.body.appendChild(deathCinematicEl)
      }

      deathCinematicEl.innerHTML = `
        <div class="game03-death-glitch-pulse"></div>
        <div class="game03-transition-card">
          <p class="game03-transition-text game03-fade-in" style="color: #ff7b7b;">“You believed me.”</p>
        </div>
      `

      const t1 = setTimeout(() => {
        if (deathCinematicEl && statusRef.current === 'failing') {
          deathCinematicEl.innerHTML = `
            <div class="game03-death-glitch-pulse"></div>
            <div class="game03-transition-card">
              <p class="game03-transition-text game03-fade-in" style="color: #ff4d4d; font-weight: 600;">“That was your mistake.”</p>
            </div>
          `
        }
      }, 2600)

      const t2 = setTimeout(() => {
        if (deathCinematicEl && statusRef.current === 'failing') {
          deathCinematicEl.innerHTML = `
            <div class="game03-death-glitch-pulse"></div>
            <div class="game03-transition-card">
              <p class="game03-transition-text game03-fade-in" style="color: #e63946; font-weight: 700; letter-spacing: 0.18em;">“YOU CHOSE WHAT YOU WERE TOLD TO TRUST.”</p>
            </div>
          `
        }
      }, 5400)

      const t3 = setTimeout(() => {
        if (statusRef.current === 'failing') {
          setStatus('failed')
          statusRef.current = 'failed'
        }
      }, 8600)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        const el = document.getElementById('game03-death-cinematic-dom')
        if (el) el.remove()
      }
    } else {
      if (deathCinematicEl) deathCinematicEl.remove()
    }

    return () => {
      const el = document.getElementById('game03-death-cinematic-dom')
      if (el) el.remove()
    }
  }, [status])

  // Direct DOM mounting for Failure Screen
  useEffect(() => {
    let failureEl = document.getElementById('game03-failure-dom')

    if (status === 'failed') {
      if (!failureEl) {
        failureEl = document.createElement('div')
        failureEl.id = 'game03-failure-dom'
        failureEl.className = 'game03-failure-overlay'
        failureEl.innerHTML = `
          <div class="game03-failure-card">
            <span class="game03-failure-tag">GAME 03 FAILED</span>
            <h1 class="game03-failure-title">THE ROOM DID NOT LIE.</h1>
            <div class="game03-failure-divider"></div>
            <div class="game03-failure-lore">
              <p class="game03-failure-quote">“YOU SIMPLY BELIEVED IT.”</p>
              <p class="game03-failure-subtext">“The doors only answered what they were asked. The silence held the exit.”</p>
            </div>
            <button type="button" id="restart-game03-btn" class="game03-failure-button">
              RESTART GAME 03
            </button>
          </div>
        `
        document.body.appendChild(failureEl)

        const restartBtn = document.getElementById('restart-game03-btn')
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
      const el = document.getElementById('game03-failure-dom')
      if (el) el.remove()
    }
  }, [status, restartTrial])

  return (
    <>
      {/* 3D Arena environment, doors, items, and central plinth */}
      <ThreeDoorsArena />

      {/* First-person player controls inside Game 03 room */}
      <PlayerControls
        roomWidth={ROOM03_WIDTH}
        roomDepth={ROOM03_DEPTH}
        initialPosition={INITIAL_ROOM03_POS}
        initialLookAt={INITIAL_ROOM03_LOOK}
        enabled={status === 'exploring'}
        resetTrigger={resetCounter}
      />
    </>
  )
}
