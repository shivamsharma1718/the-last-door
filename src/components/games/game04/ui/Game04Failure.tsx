import React from 'react'

export interface Game04FailureProps {
  onRestart: () => void
}

export const Game04Failure: React.FC<Game04FailureProps> = ({ onRestart }) => {
  return (
    <div className="game04-failure-overlay" id="game04-failure-dom">
      <div className="game04-failure-card">
        <span className="game04-failure-tag">GAME 04 FAILED</span>
        <h1 className="game04-failure-title">YOU LOOKED DIRECTLY AT IT.</h1>
        <div className="game04-failure-divider" />
        <div className="game04-failure-lore">
          <p className="game04-failure-quote">“THE WATCHER NOTICED YOU.”</p>
          <p className="game04-failure-subtext">“When the unseen presence watches, you must never turn your gaze to meet it.”</p>
        </div>
        <button
          type="button"
          id="restart-game04-btn"
          className="game04-failure-button"
          onClick={(e) => {
            e.stopPropagation()
            onRestart()
          }}
        >
          RESTART GAME 04
        </button>
      </div>
    </div>
  )
}
