/**
 * Game 09: THE CONTROL ROOM - Option B Ending (Thermal Overload Failure)
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements:
 * - 5-Step atmospheric failure sequence for Option B (Nihilistic Destruction)
 * - Screen heat wash / emergency alarms / blast door welding
 * - Final Ending Screen: ENDING 09-B: THERMAL OVERLOAD
 * - Exclusive [RESTART GAME 09] action returning player to clean Game 09 start
 */

import React, { useState, useEffect } from 'react'

export interface Game09OverloadEndingProps {
  onRestart: () => void
}

export const Game09OverloadEnding: React.FC<Game09OverloadEndingProps> = ({
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
        className="game09-ending-overlay failure-overload"
        id="game09-ending-overload-dom"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game09-overload-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game09-crt-scanlines" />
        <div className="game09-vignette" />

        <div className="game09-ending-card" onClick={(e) => e.stopPropagation()}>
          <div className="game09-ending-tag-row">
            <span className="game09-ending-tag fatal">ENDING 09-B // FAILURE</span>
            <span className="game09-ending-facility">CONTROL ROOM</span>
          </div>

          <h1 id="game09-overload-title" className="game09-ending-title fatal-title">
            THERMAL OVERLOAD
          </h1>

          <div className="game09-ending-divider fatal-divider" />

          <div className="game09-ending-verdict-box">
            <p className="game09-ending-quote">
              “CONTAINMENT COMPROMISED. HYDRAULIC GATES WELDED.”
            </p>
            <p className="game09-ending-narrative">
              In your desire for vengeance, you triggered the self-destruction of the
              complex. The reactor explosion consumed Dr. Vance’s research, but also
              destroyed the truth, incinerated the surviving subjects in cryo-stasis,
              and sealed you inside the burning molten bunker.
            </p>
          </div>

          <div className="game09-ending-lesson">
            <span>PHILOSOPHICAL ERROR: NIHILISTIC DESTRUCTION</span>
            <p>
              Destroying the world to punish evil also destroys the victims and the proof.
            </p>
          </div>

          <button
            type="button"
            id="restart-game09-overload-btn"
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
      className="game09-ending-overlay failure-overload cinematic-mode"
      id="game09-ending-overload-dom"
      role="region"
      aria-label="Thermal Overload Failure Sequence"
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
            PROTOCOL 09-B // THERMAL PURGE
          </span>
          <span className="game09-ending-step-indicator">SEQUENCE {step} OF 5</span>
        </div>

        <div className="game09-ending-cinematic-body" key={`step-${step}`}>
          {step === 1 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“COOLANT PURGE ENGAGED.”</h2>
              <p className="game09-ending-step-desc">
                High-pressure valves rupture in Area 5. Liquid Freon vents into the
                empty sub-corridors. The reactor hum spikes into a deafening shriek.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“REACTOR INSTABILITY: 100%.”</h2>
              <p className="game09-ending-step-desc">
                Core temperature exceeds 2,400°C. Red emergency beacons spin madly.
                The concrete floor vibrates under seismic thermal expansion.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“CONTAINMENT BLAST DOORS WELDED.”</h2>
              <p className="game09-ending-step-desc">
                Thermal failsafes engage automatically. The northern hydraulic exit
                bulkhead melts and fuses shut. All egress points are permanently sealed.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“ARCHIVES INCINERATED.”</h2>
              <p className="game09-ending-step-desc">
                The tape reels in the Logic Vault burst into flames. The CRT monitor
                glass shatters outward. Every scrap of evidence is reduced to ash.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="game09-ending-step game09-fade-in">
              <h2 className="game09-ending-step-headline">“THE COMPLEX BURNS IN SILENCE.”</h2>
              <p className="game09-ending-step-desc">
                The underground bunker collapses into a molten furnace.
                Nobody escapes. The truth is lost forever.
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
