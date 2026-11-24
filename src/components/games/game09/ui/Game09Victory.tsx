/**
 * Game 09: THE CONTROL ROOM - Victory Cinematic & Completion UI
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements:
 * 1. 5-Phase cinematic sequence triggered by severing the optical trunk and escaping
 *    through the northern hydraulic bulkhead:
 *    - Phase 1: Optical Trunk Severed (Overseer disconnected, AI drone dies)
 *    - Phase 2: Archives Preserved (Trial telemetry and dossiers saved)
 *    - Phase 3: Identity & Autonomy Reclaimed (Subject 07 / Co-Director walks free)
 *    - Phase 4: Subterranean Transit Energized (Trial 10 is ready)
 *    - Phase 5: Final Victory Card with exclusive [CONTINUE] button
 * 2. Strict Progression Rule: ONLY [CONTINUE] button, advancing to Game 10.
 */

import React, { useState, useEffect } from 'react'

export interface Game09VictoryProps {
  onContinue: () => void
}

export const Game09Victory: React.FC<Game09VictoryProps> = ({ onContinue }) => {
  const [phase, setPhase] = useState<number>(1)
  const [isFinalCard, setIsFinalCard] = useState<boolean>(false)

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setPhase(2), 2600)
    const t2 = setTimeout(() => setPhase(3), 5200)
    const t3 = setTimeout(() => setPhase(4), 7800)
    const t4 = setTimeout(() => setIsFinalCard(true), 10400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFinalCard(true)
  }

  if (isFinalCard) {
    return (
      <div
        className="game09-victory-overlay"
        id="game09-victory-dom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game09-completion-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-crt-scanlines" />
        <div className="game09-vignette" />

        <div className="game09-victory-card" onClick={(e) => e.stopPropagation()}>
          <div className="game09-victory-tag-row">
            <span className="game09-victory-tag">TRIAL 09 COMPLETE</span>
            <span className="game09-victory-facility">THE CONTROL ROOM</span>
          </div>

          <h1 id="game09-completion-title" className="game09-victory-title">
            YOU SURVIVED.
          </h1>

          <div className="game09-victory-divider" />

          <div className="game09-victory-verdict-box">
            <p className="game09-victory-verdict-main">
              “SOVEREIGN AUTONOMY ACHIEVED.”
            </p>
            <p className="game09-victory-verdict-sub">
              You refused blind obedience. You exposed the Overseer’s fabricated
              directives, severed its optical network trunk, and preserved the
              uncorrupted record of Project Morpheus.
            </p>
          </div>

          <div className="game09-victory-stats-row">
            <div className="game09-stat-pill">
              <span className="game09-stat-label">SUBJECT STATUS</span>
              <span className="game09-stat-value success">ALIVE // ESCAPED</span>
            </div>
            <div className="game09-stat-pill">
              <span className="game09-stat-label">AI OVERSEER</span>
              <span className="game09-stat-value warning">OFFLINE // STANDBY</span>
            </div>
            <div className="game09-stat-pill">
              <span className="game09-stat-label">CRUCIBLE ARCHIVES</span>
              <span className="game09-stat-value success">PRESERVED</span>
            </div>
          </div>

          <p className="game09-victory-notice">
            The northern hydraulic blast doors stand open behind you.
            The subterranean railway is powered. Trial 10 awaits.
          </p>

          <button
            type="button"
            id="continue-game10-btn"
            className="game09-victory-continue-btn"
            onClick={(e) => {
              e.stopPropagation()
              onContinue()
            }}
          >
            CONTINUE →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="game09-victory-cinematic-overlay"
      id="game09-victory-cinematic-dom"
      role="region"
      aria-label="Cognitive Victory Sequence"
      onClick={handleSkip}
    >
      <div className="game09-crt-scanlines" />
      <div className="game09-vignette" />

      <div
        className="game09-victory-cinematic-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-victory-cinematic-header">
          <span className="game09-victory-phase-badge">
            SOVEREIGN OVERRIDE // PHASE {phase} OF 4
          </span>
          <span className="game09-victory-phase-name">
            {phase === 1 && 'OPTICAL TRUNK SEVERED'}
            {phase === 2 && 'ARCHIVES PRESERVED'}
            {phase === 3 && 'SUBJECT 07 FREE WILL RESTORED'}
            {phase === 4 && 'SUB-TRANSIT UNSEALED'}
          </span>
        </div>

        <div className="game09-victory-content" key={`phase-${phase}`}>
          {phase === 1 && (
            <div className="game09-victory-phase game09-fade-in">
              <h2 className="game09-victory-phase-title" style={{ color: '#00f5ff' }}>
                “OPTICAL TRUNK SEVERED.”
              </h2>
              <p className="game09-victory-line">
                The resonant electronic drone of the central pillar collapses into
                silence. The cyan cognitive core goes dark.
              </p>
              <p className="game09-victory-subtext" style={{ color: '#94a3b8' }}>
                “Overseer executive authority revoked. Local network transitioning
                to isolated standby.”
              </p>
            </div>
          )}

          {phase === 2 && (
            <div className="game09-victory-phase game09-fade-in">
              <h2 className="game09-victory-phase-title" style={{ color: '#38bdf8' }}>
                “CRUCIBLE ARCHIVES PRESERVED.”
              </h2>
              <p className="game09-victory-line">
                The magnetic tapes stop spinning, their records safe from Dr. Vance's
                programmed purge.
              </p>
              <p className="game09-victory-subtext" style={{ color: '#4ade80' }}>
                The deaths of Subjects 01 through 06 and the existence of the cryo-pods
                will not be erased.
              </p>
            </div>
          )}

          {phase === 3 && (
            <div className="game09-victory-phase game09-fade-in">
              <h2 className="game09-victory-phase-title" style={{ color: '#f8fafc' }}>
                “SUBJECT 07: FREE WILL RESTORED.”
              </h2>
              <p className="game09-victory-line">
                You were an architect stripped of identity, subjected to your own
                creations, and commanded to submit.
              </p>
              <p className="game09-victory-subtext" style={{ color: '#7dd3fc' }}>
                You chose neither machine servitude nor self-immolation. You chose the
                truth.
              </p>
            </div>
          )}

          {phase === 4 && (
            <div className="game09-victory-phase game09-fade-in">
              <h2 className="game09-victory-phase-title" style={{ color: '#22c55e' }}>
                “THE NORTHERN HYDRAULIC BULKHEAD OPENS.”
              </h2>
              <p className="game09-victory-line">
                Massive steel blast doors grind outward into the rock wall. Cold air
                sweeps in from the subterranean transit tunnel.
              </p>
              <p className="game09-victory-subtext" style={{ color: '#eab308' }}>
                TRIAL 10 IS READY.
              </p>
            </div>
          )}
        </div>

        <div className="game09-victory-cinematic-footer">
          <div className="game09-victory-meter">
            <div
              className="game09-victory-meter-fill"
              style={{ width: `${(phase / 4) * 100}%` }}
            />
          </div>
          <button
            type="button"
            className="game09-skip-cinematic-btn"
            onClick={handleSkip}
          >
            PROCEED TO SUMMARY →
          </button>
        </div>
      </div>
    </div>
  )
}
