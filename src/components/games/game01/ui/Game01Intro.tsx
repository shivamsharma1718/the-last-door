import React from 'react'

export interface Game01IntroProps {
  onBegin: () => void
}

export const Game01Intro: React.FC<Game01IntroProps> = ({ onBegin }) => {
  return (
    <div className="game-intro-overlay" id="game-intro-overlay-dom">
      <div className="game-intro-card">
        <span className="game-intro-tag">GAME 01</span>
        <h1 className="game-intro-title">RED LIGHT, BLACK SILENCE</h1>
        <div className="game-intro-divider" />
        <div className="game-intro-lore">
          <p>“When the light is green, you may move.”</p>
          <p>“When the light is red, you must stop.”</p>
          <p className="game-intro-warning">“If you move… something will notice.”</p>
        </div>
        <button
          type="button"
          id="begin-game01-btn"
          className="game-intro-button"
          onClick={onBegin}
        >
          BEGIN
        </button>
      </div>
    </div>
  )
}
