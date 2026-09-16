import React, { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Room } from '../components/canvas/Room'
import { Door } from '../components/canvas/Door'
import { Lights } from '../components/canvas/Lights'
import { PlayerControls } from '../components/canvas/PlayerControls'
import { RedLightGame } from '../components/games/game01/RedLightGame'

export interface SceneProps {
  isDoorOpen?: boolean
  onNearDoorChange?: (isNear: boolean) => void
  onDoorOpen?: () => void
}

export type GameStage = 'hallway' | 'intro' | 'game01'

export const Scene: React.FC<SceneProps> = ({
  isDoorOpen: propIsDoorOpen,
  onNearDoorChange,
  onDoorOpen,
}) => {
  const [stage, setStage] = useState<GameStage>('hallway')

  // Hallway dimensions
  const roomWidth = 4.8
  const roomHeight = 3.4
  const roomDepth = 14

  const doorZ = -6.94
  const doorX = 0
  const interactionThreshold = 2.6

  // Local state for hallway door interaction
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false)
  const isDoorOpen = propIsDoorOpen !== undefined ? propIsDoorOpen : internalIsOpen

  const isDoorOpenRef = useRef<boolean>(isDoorOpen)
  isDoorOpenRef.current = isDoorOpen

  const isNearRef = useRef<boolean>(false)

  // Initialize and mount direct DOM HUD prompt element for the hallway
  useEffect(() => {
    let promptEl = document.getElementById('interaction-prompt-hud')
    if (!promptEl) {
      promptEl = document.createElement('div')
      promptEl.id = 'interaction-prompt-hud'
      promptEl.innerHTML = '<span class="key-badge">E</span> Press E to open'
      document.body.appendChild(promptEl)
    }

    return () => {
      const el = document.getElementById('interaction-prompt-hud')
      if (el) el.remove()
    }
  }, [])

  // Manage Game 01 Intro Screen DOM overlay and unlock mouse cursor
  useEffect(() => {
    if (stage === 'intro') {
      // 1. Immediately unlock mouse cursor from canvas
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock()
      }

      // 2. Hide hallway prompt
      const promptEl = document.getElementById('interaction-prompt-hud')
      if (promptEl) promptEl.style.display = 'none'

      // 3. Mount Intro overlay
      let introEl = document.getElementById('game-intro-overlay-dom')
      if (!introEl) {
        introEl = document.createElement('div')
        introEl.id = 'game-intro-overlay-dom'
        introEl.className = 'game-intro-overlay'
        introEl.innerHTML = `
          <div class="game-intro-card">
            <span class="game-intro-tag">GAME 01</span>
            <h1 class="game-intro-title">RED LIGHT, BLACK SILENCE</h1>
            <div class="game-intro-divider"></div>
            <div class="game-intro-lore">
              <p>“When the light is green, you may move.”</p>
              <p>“When the light is red, you must stop.”</p>
              <p class="game-intro-warning">“If you move… something will notice.”</p>
            </div>
            <button type="button" id="begin-game01-btn" class="game-intro-button">
              BEGIN
            </button>
          </div>
        `
        document.body.appendChild(introEl)

        const beginBtn = document.getElementById('begin-game01-btn')
        if (beginBtn) {
          beginBtn.onclick = (e) => {
            e.stopPropagation()
            setStage('game01')
          }
        }
      }
    } else {
      const introEl = document.getElementById('game-intro-overlay-dom')
      if (introEl) introEl.remove()
    }

    return () => {
      const introEl = document.getElementById('game-intro-overlay-dom')
      if (introEl) introEl.remove()
    }
  }, [stage])

  // Check player distance to the hallway door in every render frame (while in hallway)
  useFrame(({ camera }) => {
    if (stage !== 'hallway') return

    const dx = camera.position.x - doorX
    const dz = camera.position.z - doorZ
    const distance = Math.sqrt(dx * dx + dz * dz)

    const isNear = distance <= interactionThreshold

    if (isNear !== isNearRef.current) {
      isNearRef.current = isNear
      onNearDoorChange?.(isNear)
    }

    // Direct DOM prompt display update
    const promptEl = document.getElementById('interaction-prompt-hud')
    if (promptEl) {
      if (isNear && !isDoorOpenRef.current && stage === 'hallway') {
        promptEl.style.display = 'inline-flex'
      } else {
        promptEl.style.display = 'none'
      }
    }
  })

  // Listen for 'KeyE' interaction safely in the hallway
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage !== 'hallway') return

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.code === 'KeyE') {
        if (isNearRef.current && !isDoorOpenRef.current) {
          setInternalIsOpen(true)
          onDoorOpen?.()
          const promptEl = document.getElementById('interaction-prompt-hud')
          if (promptEl) promptEl.style.display = 'none'

          // Transition to Game 01 story intro shortly after opening the first door
          setTimeout(() => {
            setStage('intro')
          }, 1200)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [stage, onDoorOpen])

  // If in Game 01 arena
  if (stage === 'game01') {
    return <RedLightGame />
  }

  return (
    <>
      {/* Psychological horror background & atmospheric fog */}
      <color attach="background" args={['#080a0f']} />
      <fog attach="fog" args={['#080a0f', 4, 20]} />

      {/* Hallway Lighting & Fixture */}
      <Lights />

      {/* Hallway / Room Geometry */}
      <Room width={roomWidth} height={roomHeight} depth={roomDepth} />

      {/* The Target Door at the far end */}
      <Door position={[doorX, 0, doorZ]} isOpen={isDoorOpen} />

      {/* First-person Look & Movement Controls */}
      <PlayerControls roomWidth={roomWidth} roomDepth={roomDepth} enabled={stage === 'hallway'} />
    </>
  )
}
