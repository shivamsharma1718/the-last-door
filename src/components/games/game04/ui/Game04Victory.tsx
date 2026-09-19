import React, { useState, useEffect } from 'react'

export interface Game04VictoryProps {
  onContinue: () => void
}

export const Game04Victory: React.FC<Game04VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game04-victory-overlay" id="game04-victory-dom">
      <div className="game04-victory-card">
        <span className="game04-victory-tag">GAME 04 COMPLETE</span>
        <h1 className="game04-victory-title">THE WATCHER COULD SEE YOU.</h1>
        <div className="game04-victory-divider" />
        <div className="game04-victory-lore">
          <p className="game04-victory-quote">“YOU SURVIVED BY NOT LOOKING BACK.”</p>
          <p className="game04-victory-subtext">“The observation window goes dark. The way forward opens.”</p>
        </div>
        <button
          type="button"
          id="continue-game04-btn"
          className="game04-victory-button"
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

export interface Game04VictoryCinematicProps {
  onSequenceComplete: () => void
}

export const Game04VictoryCinematic: React.FC<Game04VictoryCinematicProps> = ({
  onSequenceComplete,
}) => {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 2000)
    const t2 = setTimeout(() => onSequenceComplete(), 4200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onSequenceComplete])

  return (
    <div
      className="game04-victory-cinematic-overlay"
      id="game04-victory-cinematic-dom"
    >
      <div className="game04-transition-card">
        {step === 1 && (
          <p className="game04-transition-text game04-fade-in" style={{ color: '#38bdf8', letterSpacing: '0.2em' }}>
            “THE WATCHER LOOKED AWAY.”
          </p>
        )}
        {step === 2 && (
          <p className="game04-transition-text game04-fade-in" style={{ color: '#f8fafc', fontWeight: 700, letterSpacing: '0.22em' }}>
            “YOU DID NOT.”
          </p>
        )}
      </div>
    </div>
  )
}
