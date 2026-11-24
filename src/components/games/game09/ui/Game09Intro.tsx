/**
 * Game 09: THE CONTROL ROOM - 7-Phase Atmospheric Cinematic Intro
 * Outside Canvas DOM Overlay
 */

import React, { useState, useEffect } from 'react'

interface Game09IntroProps {
  onBegin: () => void
}

const INTRO_PHASES = [
  'THE MAINTENANCE SHAFT ENDS HERE.',
  'YOU RECOGNIZE THIS ROOM.',
  'YOU BUILT THE SYSTEM THAT WATCHES IT.',
  'THE SYSTEM IS STILL RUNNING.',
  '/// CARRIER SYNCHRONIZED /// CRT OSCILLATION RESTORED',
  'WELCOME BACK, CO-DIRECTOR.',
  'THE OVERSEER IS WAITING.',
]

export const Game09Intro: React.FC<Game09IntroProps> = ({ onBegin }) => {
  const [phaseIndex, setPhaseIndex] = useState<number>(0)
  const [showTitleCard, setShowTitleCard] = useState<boolean>(false)

  // Ensure pointer lock is released during intro
  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  // Auto-advance phases
  useEffect(() => {
    if (phaseIndex < INTRO_PHASES.length - 1) {
      const timer = setTimeout(() => {
        setPhaseIndex((prev) => prev + 1)
      }, 1600)
      return () => clearTimeout(timer)
    } else if (phaseIndex === INTRO_PHASES.length - 1 && !showTitleCard) {
      const timer = setTimeout(() => {
        setShowTitleCard(true)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [phaseIndex, showTitleCard])

  const handleSkipOrNext = () => {
    if (!showTitleCard) {
      setShowTitleCard(true)
    }
  }

  return (
    <div
      className="game09-intro-overlay"
      id="game09-intro-dom"
      role="region"
      aria-label="Game 09 Introduction"
      onClick={handleSkipOrNext}
    >
      <div className="game09-crt-scanlines" />
      <div className="game09-vignette" />

      {!showTitleCard ? (
        <div className="game09-intro-phase-container">
          <div className="game09-intro-phase-badge">
            TERMINAL LINK: 0{phaseIndex + 1} / 0{INTRO_PHASES.length}
          </div>
          <h2
            key={phaseIndex}
            className={`game09-intro-phase-text ${
              phaseIndex === 4 ? 'game09-glitch-text' : ''
            }`}
          >
            {INTRO_PHASES[phaseIndex]}
          </h2>
          <div className="game09-intro-skip-prompt">
            Click anywhere to skip sequence
          </div>
        </div>
      ) : (
        <div
          className="game09-intro-card"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="game09-intro-tag">TRIAL 09</span>
          <h1 className="game09-intro-title">THE CONTROL ROOM</h1>
          <div className="game09-intro-divider" />
          <div className="game09-intro-lore">
            <p className="game09-intro-quote">
              “THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?”
            </p>
            <p className="game09-intro-subtext">
              The Overseer AI is active, broadcasting operational directives across the complex.
              Some directives are vital safety protocols. Others are engineered traps.
            </p>
            <p className="game09-intro-warning">
              TRUST NOTHING WITHOUT VERIFICATION.
            </p>
          </div>
          <button
            type="button"
            id="begin-game09-btn"
            className="game09-intro-button"
            onClick={onBegin}
          >
            INITIALIZE OPERATIONS
          </button>
        </div>
      )}
    </div>
  )
}
