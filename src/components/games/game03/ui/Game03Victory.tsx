import React, { useState, useEffect } from 'react'

export interface Game03VictoryProps {
  onContinue: () => void
}

export const Game03Victory: React.FC<Game03VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game03-victory-overlay" id="game03-victory-dom">
      <div className="game03-victory-card">
        <span className="game03-victory-tag">GAME 03 COMPLETE</span>
        <h1 className="game03-victory-title">THE ROOM COULD NOT CONVINCE YOU.</h1>
        <div className="game03-victory-divider" />
        <div className="game03-victory-lore">
          <p className="game03-victory-quote">“You chose the one that asked nothing from you.”</p>
          <p className="game03-victory-subtext">“The truth was silent... and the next corridor reveals itself.”</p>
        </div>
        <button
          type="button"
          id="continue-game03-btn"
          className="game03-victory-button"
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

export interface Game03VictoryCinematicProps {
  onSequenceComplete: () => void
}

export const Game03VictoryCinematic: React.FC<Game03VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2800)
    const t2 = setTimeout(() => setStep(3), 5800)
    const t3 = setTimeout(() => setStep(4), 8800)
    const t4 = setTimeout(() => onSequenceComplete(), 11800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game03-victory-cinematic-overlay"
      id="game03-victory-cinematic-dom"
    >
      <div className="game03-transition-card">
        {step === 1 && (
          <p className="game03-transition-text game03-fade-in">
            “You didn't choose the door that promised safety.”
          </p>
        )}
        {step === 2 && (
          <p className="game03-transition-text game03-fade-in">
            “You chose the one that asked nothing from you.”
          </p>
        )}
        {step === 3 && (
          <p className="game03-transition-text game03-fade-in">
            “Perhaps that is why you survived.”
          </p>
        )}
        {step === 4 && (
          <p className="game03-transition-text game03-victory-reveal-highlight game03-fade-in">
            “THE ROOM COULD NOT CONVINCE YOU.”
          </p>
        )}
      </div>
    </div>
  )
}
