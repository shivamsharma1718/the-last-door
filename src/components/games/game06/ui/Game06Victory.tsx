import React, { useState, useEffect } from 'react'

export interface Game06VictoryProps {
  onContinue: () => void
}

export const Game06Victory: React.FC<Game06VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game06-victory-overlay" id="game06-victory-dom">
      <div className="game06-victory-card">
        <span className="game06-victory-tag">GAME 06 COMPLETE</span>
        <h1 className="game06-victory-title">THE ENDLESS MAZE</h1>
        <div className="game06-victory-divider" />
        <div className="game06-victory-lore">
          <p className="game06-victory-quote">“THE PATH WAS NEVER THE SAME TWICE.”</p>
          <p className="game06-victory-subtext">
            “You unsealed the northern blast door and stepped across the final threshold.”
          </p>
        </div>
        <button
          type="button"
          id="continue-game06-btn"
          className="game06-victory-button"
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

export interface Game06VictoryCinematicProps {
  onSequenceComplete: () => void
}

export const Game06VictoryCinematic: React.FC<Game06VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2000)
    const t2 = setTimeout(() => setStep(3), 4000)
    const t3 = setTimeout(() => setStep(4), 6000)
    const t4 = setTimeout(() => onSequenceComplete(), 8200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game06-victory-cinematic-overlay"
      id="game06-victory-cinematic-dom"
    >
      <div className="game06-transition-card">
        {step === 1 && (
          <p
            className="game06-transition-text game06-fade-in"
            style={{ color: '#38bdf8', letterSpacing: '0.22em' }}
          >
            “YOU FOUND THE WAY OUT.”
          </p>
        )}
        {step === 2 && (
          <p
            className="game06-transition-text game06-fade-in"
            style={{ color: '#94a3b8', letterSpacing: '0.22em' }}
          >
            “BUT YOU WERE NEVER LOST.”
          </p>
        )}
        {step === 3 && (
          <p
            className="game06-transition-text game06-fade-in"
            style={{ color: '#f87171', letterSpacing: '0.24em' }}
          >
            “YOU WERE BEING LED.”
          </p>
        )}
        {step === 4 && (
          <p
            className="game06-transition-text game06-fade-in"
            style={{ color: '#f8fafc', fontWeight: 700, letterSpacing: '0.26em' }}
          >
            “THE MAZE REMEMBERS YOU.”
          </p>
        )}
      </div>
    </div>
  )
}

