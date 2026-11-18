/**
 * Game 07: THE MIRROR TRIAL - Victory Cinematic & Completion UI
 * Theme: Reality vs Deception, Perception, and Psychological Horror.
 *
 * Implements:
 * 1. Game07VictoryCinematic: 4-phase revelation sequence after correct North verdict:
 *    - Phase 1: THE MIRROR FALLS SILENT.
 *    - Phase 2: NOTHING WAS HIDDEN.
 *    - Phase 3: THE WALL WAS NEVER A WALL.
 *    - Phase 4: YOU HAVE SEEN WHAT IS REAL.
 * 2. Game07EscapeCinematic: Final 3-phase escape sequence when passing beyond the glass:
 *    - Phase 1: THE GLASS CLOSES BEHIND YOU.
 *    - Phase 2: THE ROOM FORGETS YOUR FACE.
 *    - Phase 3: BUT SOMETHING REMEMBERS.
 * 3. Game07Victory: Final completion screen with single CONTINUE progression action.
 */

import React, { useState, useEffect } from 'react'

export interface Game07VictoryCinematicProps {
  onSequenceComplete: () => void
}

/**
 * 4-Phase atmospheric cinematic after submitting the true North mirror verdict.
 */
export const Game07VictoryCinematic: React.FC<Game07VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [phase, setPhase] = useState<number>(1)

  useEffect(() => {
    // Release pointer lock on entering cinematic
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setPhase(2), 2800)
    const t2 = setTimeout(() => setPhase(3), 5600)
    const t3 = setTimeout(() => setPhase(4), 8400)
    const t4 = setTimeout(() => onSequenceComplete(), 11200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game07-victory-cinematic-overlay"
      id="game07-victory-cinematic-dom"
      role="region"
      aria-label="Victory Revelation Cinematic"
    >
      <div className="game07-transition-card">
        <span className="game07-transition-tag">PHASE {phase} OF 4</span>

        <div className="game07-transition-content" key={`phase-${phase}`}>
          {phase === 1 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#38bdf8' }}>
                “THE MIRROR FALLS SILENT.”
              </h2>
              <p className="game07-cinematic-subtext">
                The chamber becomes completely quiet. The crimson distortion disappears.
              </p>
            </div>
          )}

          {phase === 2 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#e2e8f0' }}>
                “NOTHING WAS HIDDEN.”
              </h2>
              <p className="game07-cinematic-subtext">
                The four mirrors become transparent or dark. Speculum Veritatis remains illuminated with calm cyan light.
              </p>
            </div>
          )}

          {phase === 3 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#38bdf8' }}>
                “THE WALL WAS NEVER A WALL.”
              </h2>
              <p className="game07-cinematic-subtext">
                A hidden passage unseals behind the glass of Speculum Veritatis. The stone recedes.
              </p>
            </div>
          )}

          {phase === 4 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#f8fafc', fontWeight: 700 }}>
                “YOU HAVE SEEN WHAT IS REAL.”
              </h2>
              <p className="game07-cinematic-subtext">
                The northern passage illuminates. Step forward into the threshold.
              </p>
            </div>
          )}
        </div>

        <div className="game07-transition-pulse-bar" />
      </div>
    </div>
  )
}

export interface Game07EscapeCinematicProps {
  onSequenceComplete: () => void
}

/**
 * 3-Phase escape sequence when player interacts with the opened passage.
 */
export const Game07EscapeCinematic: React.FC<Game07EscapeCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    // Release pointer lock on entering escape sequence
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setStep(2), 2400)
    const t2 = setTimeout(() => setStep(3), 4800)
    const t3 = setTimeout(() => onSequenceComplete(), 7200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game07-escape-cinematic-overlay"
      id="game07-escape-cinematic-dom"
      role="region"
      aria-label="Passage Escape Sequence"
    >
      <div className="game07-transition-card">
        <div className="game07-transition-content" key={`escape-step-${step}`}>
          {step === 1 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#94a3b8' }}>
                “THE GLASS CLOSES BEHIND YOU.”
              </h2>
            </div>
          )}

          {step === 2 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#cbd5e1' }}>
                “THE ROOM FORGETS YOUR FACE.”
              </h2>
            </div>
          )}

          {step === 3 && (
            <div className="game07-cinematic-phase game07-fade-in">
              <h2 className="game07-cinematic-title" style={{ color: '#f8fafc', letterSpacing: '0.22em' }}>
                “BUT SOMETHING REMEMBERS.”
              </h2>
            </div>
          )}
        </div>

        <div className="game07-transition-pulse-bar" />
      </div>
    </div>
  )
}

export interface Game07VictoryProps {
  onContinue: () => void
}

/**
 * Completion screen for Game 07: The Mirror Trial.
 * Only presents the CONTINUE button to progress to Game 08. No replay, no restart.
 */
export const Game07Victory: React.FC<Game07VictoryProps> = ({ onContinue }) => {
  useEffect(() => {
    // Release pointer lock on completion screen
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  return (
    <div
      className="game07-victory-overlay"
      id="game07-victory-dom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game07-victory-title"
    >
      <div className="game07-victory-card">
        <span className="game07-victory-tag">GAME 07 COMPLETE</span>
        <h1 id="game07-victory-title" className="game07-victory-title">
          THE MIRROR TRIAL
        </h1>
        <div className="game07-victory-divider" />

        <div className="game07-victory-lore">
          <p className="game07-victory-quote">
            “THE MIRROR SHOWED YOU THE TRUTH.”
          </p>
          <p className="game07-victory-subtext">
            “THE TRUTH WAS YOUR WAY OUT.”
          </p>
        </div>

        <button
          type="button"
          id="continue-game07-btn"
          className="game07-victory-button"
          onClick={(e) => {
            e.stopPropagation()
            onContinue()
          }}
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}
