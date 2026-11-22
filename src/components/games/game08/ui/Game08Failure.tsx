/**
 * Game 08: WARD 13 - Failure Cinematic & Restart Screen
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Implements:
 * - Multi-phase cinematic sequence tailored to the chosen erroneous identity:
 *   - Option A: Patient Submission (Fatal sedation flatline, identity surrender)
 *   - Option B: Researcher Reclaim (Institutional lockdown, architect caged)
 * - Non-graphic psychological horror
 * - Final failure card with exclusive [RESTART GAME 08] button
 * - Clean reset of Game 08 state without browser reload or resetting previous games
 */

import React, { useState, useEffect } from 'react'
import type { TerminalDecisionOption } from '../ward13Types'

export interface Game08FailureProps {
  failedDecision: TerminalDecisionOption | null
  onRestart: () => void
}

export const Game08Failure: React.FC<Game08FailureProps> = ({
  failedDecision,
  onRestart,
}) => {
  const isOptionA = failedDecision === 'patient_submission'
  const maxSteps = isOptionA ? 5 : 5
  const [step, setStep] = useState<number>(1)
  const [isFinalCard, setIsFinalCard] = useState<boolean>(false)

  // Release pointer lock on mounting failure overlay
  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setStep(2), 2200)
    const t2 = setTimeout(() => setStep(3), 4400)
    const t3 = setTimeout(() => setStep(4), 6600)
    const t4 = setTimeout(() => setStep(5), 8800)
    const t5 = setTimeout(() => setIsFinalCard(true), 11200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [maxSteps])

  // Allow clicking to advance directly to final card if user wishes
  const handleFastForward = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFinalCard(true)
  }

  // Final Failure Card Screen
  if (isFinalCard) {
    return (
      <div
        className="game08-failure-overlay"
        id="game08-failure-dom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game08-failure-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game08-failure-card" onClick={(e) => e.stopPropagation()}>
          <div className="game08-failure-tag-row">
            <span className="game08-failure-tag">GAME 08 FAILED</span>
            <span className="game08-failure-facility">WARD 13</span>
          </div>

          <h1 id="game08-failure-title" className="game08-failure-title">
            SUBJECT FAILED.
          </h1>

          <div className="game08-failure-divider" />

          <div className="game08-failure-verdict-box">
            {isOptionA ? (
              <>
                <p className="game08-failure-verdict-main">
                  “THE NAME WAS NEVER YOURS.”
                </p>
                <p className="game08-failure-verdict-sub">
                  You surrendered to the hospital’s fabrication. You accepted Patient 404’s cage.
                </p>
              </>
            ) : (
              <>
                <p className="game08-failure-verdict-main">
                  “THE ARCHITECT BECAME THE PRISONER.”
                </p>
                <p className="game08-failure-verdict-sub">
                  You sought to master the machine that destroyed you. The facility buried its creator.
                </p>
              </>
            )}
          </div>

          <p className="game08-failure-experiment-notice">
            The experiment continues.
          </p>

          <button
            type="button"
            id="restart-game08-btn"
            className="game08-failure-button"
            onClick={(e) => {
              e.stopPropagation()
              onRestart()
            }}
          >
            RESTART GAME 08
          </button>
        </div>
      </div>
    )
  }

  // Narrative Cinematic Sequence
  return (
    <div
      className={`game08-failure-overlay ${isOptionA ? 'failure-sedation' : 'failure-lockdown'}`}
      id="game08-failure-dom"
      role="region"
      aria-label="Clinical Failure Sequence"
      onClick={handleFastForward}
    >
      <div className="game08-failure-cinematic-card" onClick={(e) => e.stopPropagation()}>
        <div className="game08-failure-cinematic-header">
          <span className="game08-failure-phase-tag">
            {isOptionA ? 'PROTOCOL // TERMINAL SEDATION' : 'PROTOCOL // PERMANENT QUARANTINE'}
          </span>
          <span className="game08-failure-step-indicator">SEQUENCE {step} OF 5</span>
        </div>

        <div className="game08-failure-body" key={`fail-step-${step}`}>
          {isOptionA ? (
            /* Option A: Patient Submission Narrative */
            <>
              {step === 1 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline">“IDENTITY ACCEPTED.”</h2>
                  <p className="game08-failure-subline">
                    The admissions database logs your submission. Patient 404 registered.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline">“PATIENT 404 CONFIRMED.”</h2>
                  <p className="game08-failure-subline">
                    Telemetry monitors spike in synchronization with Bed 07.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline" style={{ color: '#ef4444' }}>
                    “CLINICAL TERMINATION INITIATED.”
                  </h2>
                  <p className="game08-failure-subline">
                    Automated IV lines open. Red clinical lighting floods the terminal chamber.
                  </p>
                </div>
              )}
              {step === 4 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline" style={{ color: '#ef4444' }}>
                    “THEY WERE WAITING FOR YOU.”
                  </h2>
                  <p className="game08-failure-subline">
                    The records room fills with acoustic static. Heart rate slows.
                  </p>
                </div>
              )}
              {step === 5 && (
                <div className="game08-failure-step game08-fade-in">
                  <div className="game08-ecg-flatline-visual">
                    <div className="game08-ecg-pulse-line" />
                    <span className="game08-ecg-bpm">00 BPM // FLATLINE</span>
                  </div>
                  <h2 className="game08-failure-headline" style={{ color: '#94a3b8' }}>
                    “COGNITIVE FLATLINE DETECTED.”
                  </h2>
                </div>
              )}
            </>
          ) : (
            /* Option B: Researcher Reclaim Narrative */
            <>
              {step === 1 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline">“AUTHORITY RECOGNIZED.”</h2>
                  <p className="game08-failure-subline">
                    Founding executive credentials authenticated by Master Terminal.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline">“PROJECT MORPHEUS REACTIVATED.”</h2>
                  <p className="game08-failure-subline">
                    Observation console banks illuminate. The cameras re-engage.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline" style={{ color: '#ef4444' }}>
                    “FACILITY LOCKDOWN INITIATED.”
                  </h2>
                  <p className="game08-failure-subline">
                    Emergency bulkheads clamp shut across all five sectors. Red klaxons howl.
                  </p>
                </div>
              )}
              {step === 4 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline" style={{ color: '#ef4444' }}>
                    “YOU BUILT THE CAGE.”
                  </h2>
                  <p className="game08-failure-subline">
                    The pneumatic latches weld. The safety overrides are overwritten.
                  </p>
                </div>
              )}
              {step === 5 && (
                <div className="game08-failure-step game08-fade-in">
                  <h2 className="game08-failure-headline" style={{ color: '#ef4444' }}>
                    “YOU NEVER LEFT IT.”
                  </h2>
                  <p className="game08-failure-subline">
                    The facility seals its creator inside forever.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ambient progress indicator */}
        <div className="game08-failure-progress-bar" />
        <button
          type="button"
          className="game08-skip-cinematic-btn"
          onClick={handleFastForward}
        >
          SKIP TO RESTART →
        </button>
      </div>
    </div>
  )
}
