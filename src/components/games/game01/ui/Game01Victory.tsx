import React from 'react'

export interface Game01VictoryProps {
  onContinue: () => void
}

export const Game01Victory: React.FC<Game01VictoryProps> = ({ onContinue }) => {
  return (
    <div className="game-victory-overlay" id="game01-victory-dom">
      <div className="game-victory-card">
        <span className="victory-tag">GAME 01 COMPLETE</span>
        <h1 className="victory-title">
          YOU SURVIVED<br />THE FIRST RULE.
        </h1>
        <div className="victory-divider" />
        <div className="victory-lore">
          <p>“You survived the first rule.”</p>
          <p className="victory-subtext">“But something was watching.”</p>
        </div>
        <button
          type="button"
          id="continue-game01-btn"
          className="victory-continue-button"
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  )
}

export interface Game01NextTrialProps {
  onReplay: () => void
}

export const Game01NextTrial: React.FC<Game01NextTrialProps> = ({ onReplay }) => {
  return (
    <div className="game-next-trial-overlay" id="game01-next-trial-dom">
      <div className="game-next-trial-card">
        <span className="next-trial-tag">TRIAL CONCLUDED</span>
        <h1 className="next-trial-title">THE NEXT TRIAL AWAITS.</h1>
        <div className="next-trial-divider" />
        <div className="next-trial-lore">
          <p>The door ahead slowly unlocks in the darkness...</p>
        </div>
        <button
          type="button"
          id="replay-game01-btn"
          className="next-trial-button"
          onClick={onReplay}
        >
          REPLAY GAME 01
        </button>
      </div>
    </div>
  )
}
