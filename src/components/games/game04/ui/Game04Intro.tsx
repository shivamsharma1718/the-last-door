import React from 'react'

export interface Game04IntroProps {
  onBegin: () => void
}

export const Game04Intro: React.FC<Game04IntroProps> = ({ onBegin }) => {
  return (
    <div
      className="game-intro-overlay"
      id="game04-intro-overlay-dom"
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
        <span className="game-intro-tag" style={{ color: '#38bdf8' }}>
          GAME 04
        </span>
        <h1 className="game-intro-title">THE WATCHER</h1>
        <div className="game-intro-divider" style={{ background: '#38bdf8' }} />
        <div className="game-intro-lore">
          <p className="game04-intro-line-1">“It can see you.”</p>
          <p className="game04-intro-line-2">“You cannot see it.”</p>
          <p className="game-intro-warning game04-intro-line-3">
            “When it looks at you, do not look back.”
          </p>
        </div>
        <button
          type="button"
          id="begin-game04-btn"
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
