import React from 'react'

export interface Game05FailureProps {
  onRestart: () => void
}

export const Game05Failure: React.FC<Game05FailureProps> = ({ onRestart }) => {
  return (
    <div className="game05-failure-overlay" id="game05-failure-dom">
      <div className="game05-failure-card">
        <span className="game05-failure-tag">GAME 05 FAILED</span>
        <h1 className="game05-failure-title">THE CHAMBER HAS FLOODED.</h1>
        <div className="game05-failure-divider" />
        <div className="game05-failure-lore">
          <p className="game05-failure-quote">“THE DRAINAGE SYSTEM WAS NOT ACTIVATED IN TIME.”</p>
          <p className="game05-failure-subtext">“The facility submerged beneath the contaminated floodwaters.”</p>
        </div>
        <button
          type="button"
          id="restart-game05-btn"
          className="game05-failure-button"
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
