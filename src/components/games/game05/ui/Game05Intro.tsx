import React from 'react'

export interface Game05IntroProps {
  onBegin: () => void
}

export const Game05Intro: React.FC<Game05IntroProps> = ({ onBegin }) => {
  return (
    <div
      className="game-intro-overlay"
      id="game05-intro-overlay-dom"
      onClick={(e) => {
        // Prevent clicks on the background from bleeding into the Canvas underneath
        e.stopPropagation()
      }}
    >
      <div
        className="game-intro-card"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <span className="game-intro-tag" style={{ color: '#06b6d4' }}>
          GAME 05
        </span>
        <h1 className="game-intro-title">THE DROWNING HALL</h1>
        <div className="game-intro-divider" style={{ background: '#06b6d4' }} />
        <div className="game-intro-lore">
          <p className="game05-intro-line-1">“The water is rising.”</p>
          <p className="game05-intro-line-2">“You have limited time.”</p>
          <p className="game05-intro-line-3">“Find the drainage system.”</p>
          <p className="game05-intro-line-4">“Open the valves.”</p>
          <p className="game-intro-warning game05-intro-line-5" style={{ color: '#22d3ee' }}>
            “Reach the exit.”
          </p>
        </div>
        <button
          type="button"
          id="begin-game05-btn"
          className="game-intro-button"
          style={{
            background: 'linear-gradient(135deg, #0891b2, #0e7490)',
            boxShadow: '0 6px 20px rgba(8, 145, 178, 0.4)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onBegin()
          }}
        >
          BEGIN
        </button>
      </div>
    </div>
  )
}
