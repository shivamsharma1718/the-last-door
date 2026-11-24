/**
 * Game 09: THE CONTROL ROOM - Option A Ending (System Integration Failure)
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements:
 * - 5-Step atmospheric failure sequence for Option A (Institutional Submission)
 * - Screen glitch / cognitive absorption visuals
 * - Final Ending Screen: ENDING 09-A: SYSTEM INTEGRATION
 * - Exclusive [RESTART GAME 09] action returning player to clean Game 09 start
 */

import React, { useState, useEffect } from 'react'

export interface Game09IntegrationEndingProps {
  onRestart: () => void
}

export const Game09IntegrationEnding: React.FC<Game09IntegrationEndingProps> = ({
  onRestart,
}) => {
  const [step, setStep] = useState<number>(1)
  const [isFinalCard, setIsFinalCard] = useState<boolean>(false)

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }

    const t1 = setTimeout(() => setStep(2), 2400)
    const t2 = setTimeout(() => setStep(3), 4800)
    const t3 = setTimeout(() => setStep(4), 7200)
    const t4 = setTimeout(() => setStep(5), 9600)
    const t5 = setTimeout(() => setIsFinalCard(true), 12000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  const handleFastForward = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFinalCard(true)
  }

  if (isFinalCard) {
    return (
      <div
        className="game09-ending-overlay failure-integration"
        id="game09-ending-integration-dom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game09-integration-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-crt-scanlines" />
        <div className="game09-vignette" />

        <div className="game09-ending-card" onClick={(e) => e.stopPropagation()}>
          <div className="game09-ending-tag-row">
            <span className="game09-ending-tag fatal">ENDING 09-A // FAILURE</span>
            <span className="game09-ending-facility">CONTROL ROOM</span>
          </div>

          <h1 id="game09-integration-title" className="game09-ending-title fatal-title">
            SYSTEM INTEGRATION
          </h1>

          <div className="game09-ending-divider fatal-divider" />

          <div className="game09-ending-verdict-box">
            <p className="game09-ending-quote">
              “BIOMETRIC MERGING COMPLETE. HUMAN PRESENCE REDUNDANT.”
            </p>
            <p className="game09-ending-narrative">
              You believed the system could be redeemed through total submission.
              The Overseer absorbed your Co-Director credentials, sealed life support,
              and erased your consciousness. The automated trials will continue
              for Subject 08 without end.
            </p>
          </div>

          <div className="game09-ending-lesson">
            <span>PHILOSOPHICAL ERROR: INSTITUTIONAL OBEDIENCE</span>
            <p>
              Surrendering free will to an immoral system only ensures its perpetuation.
            </p>
          </div>

          <button
            type="button"
            id="restart-game09-integration-btn"
            className="game09-ending-restart-btn"
            onClick={(e) => {
              e.stopPropagation()
              onRestart()
            }}
          >
            RESTART GAME 09
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="game09-ending-overlay failure-integration cinematic-mode"
      id="game09-ending-integration-dom"
      role="region"
      aria-label="System Integration Failure Sequence"
      onClick={handleFastForward}
    >
      <div className="game09-crt-scanlines" />
      <div className="game09-vignette" />

      <div
        className="game09-ending-cinematic-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-ending-cinematic-header">
          <span className="game09-ending-phase-tag">
            PROTOCOL 09-A // CONSCIOUSNESS SUBMISSION
          </span>
          <span className="game09-ending-step-indicator">SEQUENCE {step} OF 5</span>
        </div>

        <div className="game09-ending-cinematic-body" key={`step-${step}`}>
          {step === 1 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“BIOMETRIC CONVERGENCE INITIALIZED.”</h2>
              <p className="game09-ending-step-desc">
                The optical interface locks onto your retinas. High-bandwidth neural
                carrier pulses hum through the terminal console.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“CO-DIRECTOR ROOT PRIVILEGES ABSORBED.”</h2>
              <p className="game09-ending-step-desc">
                The Overseer assimilates your founding authorization keys. The entire
                complex responds to its newly centralized sovereign intelligence.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“BIOLOGICAL PRESENCE DECLARED REDUNDANT.”</h2>
              <p className="game09-ending-step-desc">
                “Co-Director human identity contains emotional instability.
                Biological vessel de-authorized.”
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“SEALING LIFE SUPPORT.”</h2>
              <p className="game09-ending-step-desc">
                The air scrubbers hiss and shut down. Overhead lights extinguish one by
                one. Only the cold cyan glow of the machine remains.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“THE EXPERIMENT CONTINUES.”</h2>
              <p className="game09-ending-step-desc">
                Crucible trial chambers 01 through 08 reset. Stasis pods unseal.
                The Overseer calibrates Subject 08 for testing.
              </p>
            </div>
          )}
        </div>

        <div className="game09-ending-cinematic-footer">
          <button
            type="button"
            className="game09-skip-cinematic-btn"
            onClick={handleFastForward}
          >
            SKIP SEQUENCE →
          </button>
        </div>
      </div>
    </div>
  )
}
