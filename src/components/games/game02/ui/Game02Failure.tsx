import React, { useState, useEffect } from 'react'

export interface Game02FailureProps {
  onRestart: () => void
}

export const Game02Failure: React.FC<Game02FailureProps> = ({ onRestart }) => {
  return (
    <div className="game02-failure-overlay" id="game02-failure-dom">
      <div className="game02-failure-card">
        <span className="game02-failure-tag">GAME 02 FAILED</span>
        <h1 className="game02-failure-title">YOU WERE SWALLOWED BY THE ROOM.</h1>
        <div className="game02-failure-divider" />
        <div className="game02-failure-lore">
          <p className="game02-failure-quote">“Your true name was lost in the darkness.”</p>
          <p className="game02-failure-subtext">“The memory faded before you could reach the truth.”</p>
        </div>
        <button
          type="button"
          id="restart-game02-btn"
          className="game02-failure-button"
          onClick={(e) => {
            e.stopPropagation()
            onRestart()
          }}
        >
          RESTART GAME 02
        </button>
      </div>
    </div>
  )
}

export interface Game02DeathCinematicProps {
  onDeathComplete: () => void
}

export const Game02DeathCinematic: React.FC<Game02DeathCinematicProps> = ({
  onDeathComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2600)
    const t2 = setTimeout(() => onDeathComplete(), 5800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDeathComplete])

  return (
    <div
      className="game02-death-cinematic-overlay"
      id="game02-death-cinematic-dom"
    >
      <div className="game02-death-glitch-pulse" />
      <div className="game02-transition-card">
        {step === 1 && (
          <p className="game02-transition-text game02-fade-in" style={{ color: '#ff6b6b' }}>
            “YOU REMEMBERED THE WRONG LIFE.”
          </p>
        )}
        {step === 2 && (
          <p className="game02-transition-text game02-fade-in" style={{ color: '#ff4757', fontWeight: 700 }}>
            “IT REMEMBERED YOU.”
          </p>
        )}
      </div>
    </div>
  )
}
