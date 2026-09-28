import React from 'react'
import type { DrowningHallObject } from '../drowningHallTypes'

export interface Game05HUDProps {
  objectsFound?: number
  totalObjects?: number
  nearestItem?: DrowningHallObject | null
}

export const Game05HUD: React.FC<Game05HUDProps> = ({
  objectsFound = 0,
  totalObjects = 4,
  nearestItem = null,
}) => {
  const isInvestigationComplete = objectsFound >= totalObjects

  return (
    <div className="game05-hud" id="game05-hud-dom">
      <div className="game05-hud-header">
        <span className="game05-hud-title">THE DROWNING HALL</span>
        <span className="game05-hud-subtitle">THE WATER IS RISING.</span>
        
        {isInvestigationComplete ? (
          <span className="game05-hud-complete">
            INVESTIGATION COMPLETE
          </span>
        ) : (
          <span className="game05-hud-counter">
            OBJECTS FOUND:{' '}
            <strong className="game05-counter-highlight">
              {objectsFound} / {totalObjects}
            </strong>
          </span>
        )}
      </div>

      {nearestItem && (
        <div className="game05-interaction-prompt" id="game05-prompt-dom">
          <div className="game05-prompt-target">[{nearestItem.title}]</div>
          <div className="game05-prompt-action">
            <span className="key-badge">E</span> EXAMINE
          </div>
        </div>
      )}
    </div>
  )
}
