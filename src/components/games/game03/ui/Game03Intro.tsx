import React from 'react'

export interface Game03IntroProps {
  onBegin: () => void
}

export const Game03Intro: React.FC<Game03IntroProps> = ({ onBegin }) => {
  return (
    <div className="game-intro-overlay" id="game03-intro-overlay-dom">
      <div className="game-intro-card">
        <span className="game-intro-tag" style={{ color: '#e0a96d' }}>
          GAME 03
        </span>
        <h1 className="game-intro-title">THREE DOORS</h1>
        <div className="game-intro-divider" style={{ background: '#e0a96d' }} />
        <div className="game-intro-lore">
          <p className="game03-intro-line-1">“One will let you leave.”</p>
          <p className="game03-intro-line-2">“Two will not.”</p>
          <p className="game-intro-warning game03-intro-line-3">“You may ask the room three questions.”</p>
        </div>
        <button
          type="button"
          id="begin-game03-btn"
          className="game-intro-button"
          style={{
            background: 'linear-gradient(135deg, #8b5a2b, #5c3818)',
            boxShadow: '0 6px 20px rgba(139, 90, 43, 0.4)',
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
