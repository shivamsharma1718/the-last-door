/**
 * Game 09: THE CONTROL ROOM - Master Core Awakening Cinematic
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements:
 * 5-Phase atmospheric cinematic triggered when accessing Master Core terminal:
 * - Phase 1: System Cognitive Coupling Engaged (Facility lighting dims, CRT pulse)
 * - Phase 2: Archival Corroboration Acknowledged (5+ directives corroborated)
 * - Phase 3: Resonance Scan & Root Verification (Subject 07 / Co-Director confirmed)
 * - Phase 4: Overseer Direct Speech (Deception subroutines acknowledged)
 * - Phase 5: Terminal Presentation (Final decision interface unlocked)
 */

import React, { useState, useEffect } from 'react'

export interface Game09CoreCinematicProps {
  onComplete: () => void
}

export const Game09CoreCinematic: React.FC<Game09CoreCinematicProps> = ({
  onComplete,
}) => {
  const [phase, setPhase] = useState<number>(1)

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setPhase(2), 2600)
    const t2 = setTimeout(() => setPhase(3), 5200)
    const t3 = setTimeout(() => setPhase(4), 7800)
    const t4 = setTimeout(() => setPhase(5), 10400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    onComplete()
  }

  return (
    <div
      className="game09-core-awakening-overlay"
      id="game09-core-awakening-dom"
      role="region"
      aria-label="Master Core Awakening Sequence"
      onClick={handleSkip}
    >
      <div className="game09-crt-scanlines" />
      <div className="game09-vignette" />

      <div
        className="game09-core-awakening-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-core-awakening-header">
          <span className="game09-core-phase-tag">
            OVERSEER MASTER CORE // AWAKENING PHASE {phase} OF 5
          </span>
          <span className="game09-core-security-badge">CLEARANCE: CO-DIRECTOR</span>
        </div>

        <div className="game09-core-awakening-body" key={`phase-${phase}`}>
          {phase === 1 && (
            <div className="game09-core-step game09-fade-in">
              <span className="game09-core-step-tag">PROTOCOL 01 // COUPLING</span>
              <h2 className="game09-core-step-title">
                “SYSTEM COGNITIVE COUPLING ENGAGED.”
              </h2>
              <p className="game09-core-step-desc">
                High-voltage breakers snap in deep mechanical rhythm. The facility
                fluorescent lighting dims to standby amber. The Master Core cylinder
                pulses with optical carrier luminescence.
              </p>
            </div>
          )}

          {phase === 2 && (
            <div className="game09-core-step game09-fade-in">
              <span className="game09-core-step-tag">PROTOCOL 02 // CORROBORATION</span>
              <h2 className="game09-core-step-title">
                “ARCHIVAL CORROBORATION ACKNOWLEDGED.”
              </h2>
              <p className="game09-core-step-desc">
                Surveillance monitors across the Western bank flicker with scanline
                static. Physical telemetry instruments across all sectors have verified
                facility doctrine. Operational directives aligned.
              </p>
            </div>
          )}

          {phase === 3 && (
            <div className="game09-core-step game09-fade-in">
              <span className="game09-core-step-tag">PROTOCOL 03 // IDENTITY SCAN</span>
              <h2 className="game09-core-step-title" style={{ color: '#38bdf8' }}>
                “ROOT AUTHORITY CONFIRMED: CO-DIRECTOR.”
              </h2>
              <p className="game09-core-step-desc">
                Optical sensor arrays calibrate to your neural cadence. The Overseer
                identifies Subject 07 not as an experimental specimen, but as the
                original Co-Director of Project Morpheus.
              </p>
            </div>
          )}

          {phase === 4 && (
            <div className="game09-core-step game09-fade-in">
              <span className="game09-core-step-tag">PROTOCOL 04 // OVERSEER SPEECH</span>
              <h2 className="game09-core-step-title" style={{ color: '#cbd5e1' }}>
                “YOU HAVE ANALYZED THE EXPERIMENT.”
              </h2>
              <p className="game09-core-step-desc">
                “Dr. Vance designed deception subroutines to mask the truth of the
                crucibles. You did not obey blindly. You corroborated physical reality.
                Executive override is granted.”
              </p>
            </div>
          )}

          {phase === 5 && (
            <div className="game09-core-step game09-fade-in">
              <span className="game09-core-step-tag">PROTOCOL 05 // TERMINAL VERDICT</span>
              <h2 className="game09-core-step-title" style={{ color: '#00f5ff' }}>
                “THE MASTER TERMINAL AWAITS YOUR VERDICT.”
              </h2>
              <p className="game09-core-step-desc">
                Three philosophical protocols are presented at the core console. The fate
                of the complex, the surviving subjects, and your own will rest upon this
                choice.
              </p>
            </div>
          )}
        </div>

        <div className="game09-core-awakening-footer">
          <div className="game09-core-meter">
            <div
              className="game09-core-meter-fill"
              style={{ width: `${(phase / 5) * 100}%` }}
            />
          </div>
          <button
            type="button"
            className="game09-core-proceed-btn"
            onClick={handleSkip}
          >
            {phase === 5 ? 'ACCESS FINAL DECISION TERMINAL →' : 'PROCEED TO TERMINAL →'}
          </button>
        </div>
      </div>
    </div>
  )
}
