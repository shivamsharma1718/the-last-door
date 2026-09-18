import React from 'react'

export interface Game03HUDProps {
  cluesCount?: number
  totalClues?: number
}

export const Game03HUD: React.FC<Game03HUDProps> = ({
  cluesCount = 0,
  totalClues = 4,
}) => {
  return (
    <div className="game03-hud" id="game03-hud-dom">
      <div className="game03-hud-header">
        <span className="game03-hud-title">THREE DOORS</span>
        <span className="game03-hud-objective">
          Discover which door is telling the truth.
        </span>
        <span className="game03-hud-counter">
          CLUES DISCOVERED:{' '}
          <strong className="game03-counter-highlight">
            {cluesCount} / {totalClues}
          </strong>
        </span>
      </div>
    </div>
  )
}
