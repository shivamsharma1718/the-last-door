import React from 'react'
import type { MazeInvestigationObject } from '../endlessMazeTypes'

export interface Game06HUDProps {
  cluesFound?: number
  totalClues?: number
  nearestClue?: MazeInvestigationObject | null
  examinedIds?: Set<string>
}

export const Game06HUD: React.FC<Game06HUDProps> = ({
  cluesFound = 0,
  totalClues = 4,
  nearestClue = null,
  examinedIds = new Set(),
}) => {
  const isInvestigationComplete = cluesFound >= totalClues
  const isUnexaminedClueNear = Boolean(nearestClue && !examinedIds.has(nearestClue.id))

  return (
    <div className="game06-hud" id="game06-hud-dom">
      {/* Top Center HUD Header */}
      <div className="game06-hud-header">
        <span className="game06-hud-title">GAME 06 — THE ENDLESS MAZE</span>
        <span className="game06-hud-subtitle">
          Explore the corridors. Remember what changes.
        </span>

        {isInvestigationComplete ? (
          <span className="game06-hud-complete">
            INVESTIGATION COMPLETE • ALL REMNANTS DISCOVERED
          </span>
        ) : (
          <span className="game06-hud-counter">
            CLUES FOUND:{' '}
            <strong className="game06-counter-highlight">
              {cluesFound} / {totalClues}
            </strong>
          </span>
        )}
      </div>

      {/* Dynamic Bottom-Center Interaction Prompt for Unexamined Clue */}
      {isUnexaminedClueNear && nearestClue && (
        <div className="game06-interaction-prompt" id="game06-prompt-dom">
          <div className="game06-prompt-target">[{nearestClue.title}]</div>
          <div className="game06-prompt-action">
            <span className="key-badge">E</span> EXAMINE
          </div>
        </div>
      )}
    </div>
  )
}

