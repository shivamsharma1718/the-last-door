import React, { useState, useEffect } from 'react'

export interface Game02VictoryProps {
  onContinue: () => void
}

export const Game02Victory: React.FC<Game02VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game02-victory-overlay" id="game02-victory-dom">
      <div className="game02-victory-card">
        <span className="game02-victory-tag">GAME 02 COMPLETE</span>
        <h1 className="game02-victory-title">THE ROOM REMEMBERS YOU.</h1>
        <div className="game02-victory-divider" />
        <div className="game02-victory-lore">
          <p className="game02-victory-quote">“You remembered who you are.”</p>
          <p className="game02-victory-subtext">“The truth echoes in the quiet chamber... and the next threshold unlocks.”</p>
        </div>
        <button
          type="button"
          id="continue-game02-btn"
          className="game02-victory-button"
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

export interface Game02VictoryCinematicProps {
  onSequenceComplete: () => void
}

export const Game02VictoryCinematic: React.FC<Game02VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2600)
    const t2 = setTimeout(() => setStep(3), 5400)
    const t3 = setTimeout(() => onSequenceComplete(), 8400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game02-victory-cinematic-overlay"
      id="game02-victory-cinematic-dom"
    >
      <div className="game02-transition-card">
        {step === 1 && (
          <p className="game02-transition-text game02-fade-in">
            “YOU REMEMBER.”
          </p>
        )}
        {step === 2 && (
          <p className="game02-transition-text game02-fade-in">
            “THE NAME WAS ALWAYS THERE.”
          </p>
        )}
        {step === 3 && (
          <p className="game02-transition-text game02-victory-reveal-name game02-fade-in">
            “ELIAS”
          </p>
        )}
      </div>
    </div>
  )
}
