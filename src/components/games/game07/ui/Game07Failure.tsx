import React from 'react'

export interface Game07FailureProps {
  onRestart: () => void
}

export const Game07Failure: React.FC<Game07FailureProps> = ({ onRestart }) => {
  return (
    <div
      className="game07-failure-overlay"
      id="game07-failure-dom"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="game07-failure-card"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="game07-failure-tag">GAME 07 FAILED</span>
        <h1 className="game07-failure-title">THE TRUTH WAS IN FRONT OF YOU.</h1>
        <div className="game07-failure-divider" />

        <div className="game07-failure-lore">
          <p className="game07-failure-quote">“THE REFLECTION WAS NEVER YOURS.”</p>
          <p className="game07-failure-quote">“YOU TRUSTED WHAT YOU WANTED TO SEE.”</p>
          <p className="game07-failure-quote" style={{ color: '#ef4444' }}>
            “THE MIRROR REMEMBERS.”
          </p>
        </div>

        <button
          type="button"
          id="restart-game07-btn"
          className="game07-failure-button"
          onClick={(e) => {
            e.stopPropagation()
            onRestart()
          }}
        >
          RESTART TRIAL
        </button>
      </div>
    </div>
  )
}
