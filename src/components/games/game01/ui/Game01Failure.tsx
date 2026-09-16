import React from 'react'

export interface Game01FailureProps {
  onRestart: () => void
}

export const Game01Failure: React.FC<Game01FailureProps> = ({ onRestart }) => {
  return (
    <div className="game-failure-overlay" id="game01-failure-dom">
      <div className="game-failure-card">
        <span className="failure-tag">TRIAL FAILED</span>
        <h1 className="failure-title">
          YOU MOVED.<br />
          THE ROOM REMEMBERED.
        </h1>
        <div className="failure-divider" />
        <div className="failure-lore">
          <p>“The light was red. You were not supposed to move.”</p>
        </div>
        <button
          type="button"
          id="restart-game01-btn"
          className="failure-restart-button"
          onClick={onRestart}
        >
          RESTART GAME
        </button>
      </div>
    </div>
  )
}
