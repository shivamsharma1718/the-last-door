import React, { useState, useEffect } from 'react'

export interface Game05VictoryProps {
  onContinue: () => void
}

export const Game05Victory: React.FC<Game05VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game05-victory-overlay" id="game05-victory-dom">
      <div className="game05-victory-card">
        <span className="game05-victory-tag">GAME 05 COMPLETE</span>
        <h1 className="game05-victory-title">THE DROWNING HALL</h1>
        <div className="game05-victory-divider" />
        <div className="game05-victory-lore">
          <p className="game05-victory-quote">“YOU SURVIVED THE RISING WATERS.”</p>
          <p className="game05-victory-subtext">“The industrial floodgates yielded to the drainage sequence. The air is cold, but clear.”</p>
        </div>
        <button
          type="button"
          id="continue-game05-btn"
          className="game05-victory-button"
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

export interface Game05VictoryCinematicProps {
  onSequenceComplete: () => void
}

export const Game05VictoryCinematic: React.FC<Game05VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 1700)
    const t2 = setTimeout(() => setStep(3), 3400)
    const t3 = setTimeout(() => setStep(4), 5100)
    const t4 = setTimeout(() => onSequenceComplete(), 6800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game05-victory-cinematic-overlay"
      id="game05-victory-cinematic-dom"
    >
      <div className="game05-transition-card">
        {step === 1 && (
          <p
            className="game05-transition-text game05-fade-in"
            style={{ color: '#38bdf8', letterSpacing: '0.2em' }}
          >
            “THE WATER STOPS.”
          </p>
        )}
        {step === 2 && (
          <p
            className="game05-transition-text game05-fade-in"
            style={{ color: '#94a3b8', letterSpacing: '0.22em' }}
          >
            “THE MACHINERY FALLS SILENT.”
          </p>
        )}
        {step === 3 && (
          <p
            className="game05-transition-text game05-fade-in"
            style={{ color: '#4ade80', letterSpacing: '0.22em' }}
          >
            “THE DOOR UNLOCKS.”
          </p>
        )}
        {step === 4 && (
          <p
            className="game05-transition-text game05-fade-in"
            style={{ color: '#f8fafc', fontWeight: 700, letterSpacing: '0.24em' }}
          >
            “YOU MADE IT OUT.”
          </p>
        )}
      </div>
    </div>
  )
}
