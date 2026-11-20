import React from 'react'

export interface Game08IntroProps {
  onBegin: () => void
}

export const Game08Intro: React.FC<Game08IntroProps> = ({ onBegin }) => {
  const handleBeginClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBegin()
  }

  return (
    <div className="game08-intro-overlay">
      <div className="game08-intro-card">
        <span className="game08-intro-tag">GAME 08 // PSYCHOLOGICAL RESEARCH TRIAL</span>
        <h1 className="game08-intro-title">WARD 13</h1>
        <div className="game08-intro-tagline">THE EXPERIMENT WAS NEVER OVER.</div>

        <div className="game08-intro-divider" />

        <div className="game08-intro-lore">
          <p className="game08-lore-line">“The door did not lead out.”</p>
          <p className="game08-lore-line">“It led back.”</p>
          <p className="game08-lore-line">“They have been watching every game.”</p>
          <p className="game08-lore-highlight">“Welcome to Ward 13.”</p>
        </div>

        <div className="game08-intro-briefing">
          <div className="game08-briefing-title">CLINICAL INVESTIGATION DIRECTIVE</div>
          <p className="game08-briefing-text">
            Twelve classified documents and biometric telemetry logs remain scattered across the brutalist ward.
            Examine the paper trail, navigate security checkpoints, and uncover the truth behind the experiments.
          </p>
        </div>

        <button
          type="button"
          className="game08-intro-button"
          onClick={handleBeginClick}
        >
          ENTER WARD 13
        </button>

        <div className="game08-intro-controls-hint">
          [WASD] TO MOVE • [MOUSE] TO LOOK • [E] TO EXAMINE EVIDENCE • [ESC] TO RELEASE CURSOR
        </div>
      </div>
    </div>
  )
}
