import React from 'react'

export interface Game02IntroProps {
  onBegin: () => void
}

export const Game02Intro: React.FC<Game02IntroProps> = ({ onBegin }) => {
  return (
    <div className="game-intro-overlay" id="game02-intro-overlay-dom">
      <div className="game-intro-card">
        <span className="game-intro-tag" style={{ color: '#70d6ff' }}>
          GAME 02
        </span>
        <h1 className="game-intro-title">THE ROOM OF NAMES</h1>
        <div className="game-intro-divider" style={{ background: '#70d6ff' }} />
        <div className="game-intro-lore">
          <p>“Remember who you are.”</p>
        </div>
        <button
          type="button"
          id="begin-game02-btn"
          className="game-intro-button"
          style={{
            background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
            boxShadow: '0 6px 20px rgba(42, 82, 152, 0.4)',
          }}
          onClick={onBegin}
        >
          BEGIN TRIAL
        </button>
      </div>
    </div>
  )
}
