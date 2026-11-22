/**
 * Game 08: WARD 13 - Victory Cinematic & Completion UI
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Implements:
 * 1. Game08VictoryCinematic: 3-Phase cinematic revelation after Autonomous Survivor verdict:
 *    - Phase 1 (TERMINATION): Final decision accepted, autonomy acknowledged, Morpheus terminated.
 *    - Phase 2 (SYSTEM COLLAPSE): Records deleted, experiment is over, CRT screens dark, bulkheads release.
 *    - Phase 3 (DECONTAMINATION): No more tests, no more identities, exterior unsealed, cold exterior light.
 * 2. Physical Escape Phase: Unlocks exterior maintenance corridor in 3D Arena for player to walk through.
 * 3. Game08Victory: Final Completion Screen with exclusive [CONTINUE] progression button.
 */

import React, { useState, useEffect } from 'react'

export interface Game08VictoryCinematicProps {
  onSequenceComplete: () => void
}

/**
 * 3-Phase atmospheric cinematic triggered by the Autonomous Survivor verdict.
 */
export const Game08VictoryCinematic: React.FC<Game08VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [phase, setPhase] = useState<number>(1)

  useEffect(() => {
    // Release pointer lock on entering cinematic
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setPhase(2), 2800)
    const t2 = setTimeout(() => setPhase(3), 5800)
    const t3 = setTimeout(() => onSequenceComplete(), 8800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onSequenceComplete])

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSequenceComplete()
  }

  return (
    <div
      className="game08-victory-cinematic-overlay"
      id="game08-victory-cinematic-dom"
      role="region"
      aria-label="Cognitive Emancipation Cinematic"
      onClick={handleSkip}
    >
      <div className="game08-victory-cinematic-card" onClick={(e) => e.stopPropagation()}>
        <div className="game08-victory-cinematic-header">
          <span className="game08-victory-tag">PHASE {phase} OF 3</span>
          <span className="game08-victory-phase-name">
            {phase === 1 && 'TERMINATION AUTHORIZED'}
            {phase === 2 && 'SYSTEM COLLAPSE'}
            {phase === 3 && 'DECONTAMINATION UNSEAL'}
          </span>
        </div>

        <div className="game08-victory-content" key={`phase-${phase}`}>
          {phase === 1 && (
            <div className="game08-victory-phase game08-fade-in">
              <h2 className="game08-victory-title" style={{ color: '#38bdf8' }}>
                “FINAL DECISION ACCEPTED.”
              </h2>
              <div className="game08-victory-subtext-group">
                <p className="game08-victory-line">“AUTONOMY ACKNOWLEDGED.”</p>
                <p className="game08-victory-line" style={{ color: '#4ade80' }}>
                  “PROJECT MORPHEUS TERMINATION AUTHORIZED.”
                </p>
              </div>
            </div>
          )}

          {phase === 2 && (
            <div className="game08-victory-phase game08-fade-in">
              <h2 className="game08-victory-title" style={{ color: '#e2e8f0' }}>
                “THE RECORDS ARE DELETED.”
              </h2>
              <div className="game08-victory-subtext-group">
                <p className="game08-victory-line" style={{ color: '#cbd5e1' }}>
                  “THE EXPERIMENT IS OVER.”
                </p>
                <p className="game08-victory-note">
                  CRT monitors collapse into horizontal scanlines. Hostile red emergency strobes power down.
                  Pneumatic locks disengage throughout Ward 13.
                </p>
              </div>
            </div>
          )}

          {phase === 3 && (
            <div className="game08-victory-phase game08-fade-in">
              <h2 className="game08-victory-title" style={{ color: '#f8fafc', fontWeight: 800 }}>
                “NO MORE TESTS. NO MORE IDENTITIES. NO MORE RULES.”
              </h2>
              <div className="game08-victory-subtext-group">
                <p className="game08-victory-line" style={{ color: '#7dd3fc' }}>
                  The exterior decontamination blast doors slide apart.
                </p>
                <p className="game08-victory-note">
                  Cold white daylight streams into the airlock. Step into the maintenance shaft to escape.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="game08-victory-pulse-bar" />
        <button type="button" className="game08-skip-cinematic-btn" onClick={handleSkip}>
          PROCEED TO ESCAPE SHAFT →
        </button>
      </div>
    </div>
  )
}

export interface Game08VictoryProps {
  onContinue: () => void
}

/**
 * Completion screen for Game 08: WARD 13.
 * Strictly adheres to rule: ONLY [CONTINUE] button. No replay, no restart, no main-menu.
 */
export const Game08Victory: React.FC<Game08VictoryProps> = ({ onContinue }) => {
  useEffect(() => {
    // Release pointer lock on completion screen
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  return (
    <div
      className="game08-victory-overlay"
      id="game08-victory-dom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game08-completion-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="game08-victory-card" onClick={(e) => e.stopPropagation()}>
        <div className="game08-victory-tag-row">
          <span className="game08-victory-tag-badge">GAME 08 COMPLETE</span>
          <span className="game08-victory-location">WARD 13</span>
        </div>

        <h1 id="game08-completion-title" className="game08-victory-main-title">
          THE EXPERIMENT IS OVER.
        </h1>

        <div className="game08-victory-divider" />

        <div className="game08-victory-lore-box">
          <p className="game08-victory-quote-main">
            “YOU ARE NO LONGER THEIR SUBJECT.”
          </p>
          <p className="game08-victory-quote-sub">
            You rejected the patient’s false sedation and the creator’s cruel authority.
            You survived the crucible with your mind intact.
          </p>
          <p className="game08-victory-next-cue">
            THE NEXT ROOM IS WAITING.
          </p>
        </div>

        {/* Single Progression Action Only */}
        <button
          type="button"
          id="continue-game08-btn"
          className="game08-victory-button"
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
