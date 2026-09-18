import React, { useState, useEffect } from 'react'

export interface Game03FailureProps {
  onRestart: () => void
}

export const Game03Failure: React.FC<Game03FailureProps> = ({ onRestart }) => {
  return (
    <div className="game03-failure-overlay" id="game03-failure-dom">
      <div className="game03-failure-card">
        <span className="game03-failure-tag">GAME 03 FAILED</span>
        <h1 className="game03-failure-title">THE ROOM DID NOT LIE.</h1>
        <div className="game03-failure-divider" />
        <div className="game03-failure-lore">
          <p className="game03-failure-quote">“YOU SIMPLY BELIEVED IT.”</p>
          <p className="game03-failure-subtext">“The doors only answered what they were asked. The silence held the exit.”</p>
        </div>
        <button
          type="button"
          id="restart-game03-btn"
          className="game03-failure-button"
          onClick={(e) => {
            e.stopPropagation()
            onRestart()
          }}
        >
          RESTART GAME 03
        </button>
      </div>
    </div>
  )
}

export interface Game03DeathCinematicProps {
  onDeathComplete: () => void
}

export const Game03DeathCinematic: React.FC<Game03DeathCinematicProps> = ({
  onDeathComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2600)
    const t2 = setTimeout(() => setStep(3), 5400)
    const t3 = setTimeout(() => onDeathComplete(), 8600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDeathComplete])

  return (
    <div
      className="game03-death-cinematic-overlay"
      id="game03-death-cinematic-dom"
    >
      <div className="game03-death-glitch-pulse" />
      <div className="game03-transition-card">
        {step === 1 && (
          <p className="game03-transition-text game03-fade-in" style={{ color: '#ff7b7b' }}>
            “You believed me.”
          </p>
        )}
        {step === 2 && (
          <p className="game03-transition-text game03-fade-in" style={{ color: '#ff4d4d', fontWeight: 600 }}>
            “That was your mistake.”
          </p>
        )}
        {step === 3 && (
          <p className="game03-transition-text game03-fade-in" style={{ color: '#e63946', fontWeight: 700, letterSpacing: '0.18em' }}>
            “YOU CHOSE WHAT YOU WERE TOLD TO TRUST.”
          </p>
        )}
      </div>
    </div>
  )
}
