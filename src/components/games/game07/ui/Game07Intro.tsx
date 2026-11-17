import React from 'react'

export interface Game07IntroProps {
  onBegin: () => void
}

export const Game07Intro: React.FC<Game07IntroProps> = ({ onBegin }) => {
  return (
    <div
      className="game-intro-overlay"
      id="game07-intro-overlay-dom"
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
          GAME 07
        </span>
        <h1 className="game-intro-title">THE HALL OF SPECULA</h1>
        <div className="game-intro-divider" style={{ background: '#38bdf8' }} />
        <div className="game-intro-lore">
          <p className="game07-intro-line-1">“Four glasses drink the room.”</p>
          <p className="game07-intro-line-2">“Three quench their thirst with lies.”</p>
          <p className="game07-intro-line-3">“One reflects only what is cold and true.”</p>
          <p
            className="game-intro-warning game07-intro-line-4"
            style={{ color: '#7dd3fc' }}
          >
            “Look carefully. Reality does not always answer.”
          </p>
        </div>
        <button
          type="button"
          id="begin-game07-btn"
          className="game-intro-button"
          style={{
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation()
            // Direct user gesture requesting pointer lock
            const canvasEl = document.querySelector('canvas')
            if (canvasEl && canvasEl.requestPointerLock) {
              try {
                canvasEl.requestPointerLock()
              } catch {
                // Ignore browser restriction if any
              }
            }
            onBegin()
          }}
        >
          BEGIN
        </button>
      </div>
    </div>
  )
}
