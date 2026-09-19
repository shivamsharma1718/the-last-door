import React from 'react'
import type { WatcherInvestigationObject } from '../theWatcherTypes'

export interface Game04HUDProps {
  objectsFound?: number
  totalObjects?: number
  isExitUnlocked?: boolean
  isNearExit?: boolean
  nearestItem?: WatcherInvestigationObject | null
}

export const Game04HUD: React.FC<Game04HUDProps> = ({
  objectsFound = 0,
  totalObjects = 4,
  isExitUnlocked = false,
  isNearExit = false,
  nearestItem = null,
}) => {
  return (
    <div className="game04-hud" id="game04-hud-dom">
      <div className="game04-hud-header">
        <span className="game04-hud-title">THE WATCHER</span>
        <span className={`game04-hud-presence ${isExitUnlocked ? 'game04-hud-unlocked' : ''}`}>
          {isExitUnlocked ? 'EXIT UNLOCKED' : '“Something is watching.”'}
        </span>
        <span className="game04-hud-objective">
          {isExitUnlocked ? 'Reach the door.' : 'OBJECTIVE: Reach the exit without looking back.'}
        </span>
        <span className="game04-hud-counter">
          OBJECTS FOUND:{' '}
          <strong className="game04-counter-highlight">
            {objectsFound} / {totalObjects}
          </strong>
        </span>
      </div>

      {isNearExit && (
        isExitUnlocked ? (
          <div className="game04-interaction-prompt" id="game04-exit-prompt-dom">
            <div className="game04-prompt-target" style={{ color: '#38bdf8' }}>[EXIT]</div>
            <div className="game04-prompt-action">
              <span className="key-badge">E</span> LEAVE
            </div>
          </div>
        ) : (
          <div className="game04-interaction-prompt game04-prompt-locked" id="game04-exit-prompt-dom">
            <div className="game04-prompt-target" style={{ color: '#ef4444' }}>[EXIT SEALED]</div>
            <div className="game04-prompt-action" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              DISCOVER ALL CLUES
            </div>
          </div>
        )
      )}

      {!isNearExit && nearestItem && (
        <div className="game04-interaction-prompt" id="game04-prompt-dom">
          <div className="game04-prompt-target">[{nearestItem.title}]</div>
          <div className="game04-prompt-action">
            <span className="key-badge">E</span> EXAMINE
          </div>
        </div>
      )}
    </div>
  )
}
