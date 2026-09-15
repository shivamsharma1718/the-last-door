import React, { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Room } from './Room'
import { Door } from './Door'
import { Lights } from './Lights'
import { PlayerControls } from './PlayerControls'

interface SceneProps {
  isDoorOpen?: boolean
  onNearDoorChange?: (isNear: boolean) => void
  onDoorOpen?: () => void
}

export const Scene: React.FC<SceneProps> = ({
  isDoorOpen: propIsDoorOpen,
  onNearDoorChange,
  onDoorOpen,
}) => {
  const roomWidth = 4.8
  const roomHeight = 3.4
  const roomDepth = 14

  const doorZ = -6.94
  const doorX = 0
  const interactionThreshold = 2.6

  // Local state for self-contained reliable interaction
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false)
  const isDoorOpen = propIsDoorOpen !== undefined ? propIsDoorOpen : internalIsOpen

  const isDoorOpenRef = useRef<boolean>(isDoorOpen)
  isDoorOpenRef.current = isDoorOpen

  const isNearRef = useRef<boolean>(false)

  // Initialize and mount direct DOM HUD prompt element
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

  // Continuously check player distance to door on every render frame
  useFrame(({ camera }) => {
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
      if (isNear && !isDoorOpenRef.current) {
        promptEl.style.display = 'inline-flex'
      } else {
        promptEl.style.display = 'none'
      }
    }
  })

  // Listen for 'KeyE' interaction safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDoorOpen])

  return (
    <>
      {/* Psychological horror background & atmospheric fog */}
      <color attach="background" args={['#080a0f']} />
      <fog attach="fog" args={['#080a0f', 4, 20]} />

      {/* Lighting & Fixture */}
      <Lights />

      {/* Hallway / Room Geometry */}
      <Room width={roomWidth} height={roomHeight} depth={roomDepth} />

      {/* The Target Door at the far end */}
      <Door position={[doorX, 0, doorZ]} isOpen={isDoorOpen} />

      {/* First-person Look & Movement Controls */}
      <PlayerControls roomWidth={roomWidth} roomDepth={roomDepth} />
    </>
  )
}
