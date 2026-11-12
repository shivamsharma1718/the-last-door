import React from 'react'

export interface Game06IntroProps {
  onBegin: () => void
}

export const Game06Intro: React.FC<Game06IntroProps> = ({ onBegin }) => {
  return (
    <div
      className="game-intro-overlay"
      id="game06-intro-overlay-dom"
      onClick={(e) => {
        // Prevent background clicks from bleeding into Canvas
        e.stopPropagation()
      }}
    >
      <div
        className="game-intro-card"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <span className="game-intro-tag" style={{ color: '#38bdf8' }}>
          GAME 06
        </span>
        <h1 className="game-intro-title">THE ENDLESS MAZE</h1>
        <div className="game-intro-divider" style={{ background: '#38bdf8' }} />
        <div className="game-intro-lore">
          <p className="game06-intro-line-1">“Every corridor leads somewhere.”</p>
          <p className="game06-intro-line-2">“Not every corridor leads to the same place twice.”</p>
          <p className="game06-intro-line-3">“Remember the path.”</p>
          <p className="game-intro-warning game06-intro-line-4" style={{ color: '#7dd3fc' }}>
            “Do not trust it.”
          </p>
        </div>
        <button
          type="button"
          id="begin-game06-btn"
          className="game-intro-button"
          style={{
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)',
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

