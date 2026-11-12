import React from 'react'
import type { MazeInvestigationObject } from '../endlessMazeTypes'

export interface Game06HUDProps {
  cluesFound?: number
  totalClues?: number
  nearestClue?: MazeInvestigationObject | null
  isNearExit?: boolean
  isExitUnlocked?: boolean
  examinedIds?: Set<string>
  shiftNotice?: string | null
}

export const Game06HUD: React.FC<Game06HUDProps> = ({
  cluesFound = 0,
  totalClues = 4,
  nearestClue = null,
  isNearExit = false,
  isExitUnlocked = false,
  examinedIds = new Set(),
  shiftNotice = null,
}) => {
  const isInvestigationComplete = cluesFound >= totalClues
  const isUnexaminedClueNear = Boolean(nearestClue && !examinedIds.has(nearestClue.id))

  return (
    <div className="game06-hud" id="game06-hud-dom">
      {/* Top Center HUD Header */}
      <div className="game06-hud-header">
        <span className="game06-hud-title">GAME 06 — THE ENDLESS MAZE</span>
        {isExitUnlocked ? (
          <span
            className="game06-hud-subtitle"
            style={{ color: '#38bdf8', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}
          >
            EXIT BLAST DOOR UNSEALED • PROCEED TO THRESHOLD
          </span>
        ) : (
          <span className="game06-hud-subtitle">
            Explore the corridors. Remember what changes.
          </span>
        )}

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

      {/* Atmospheric Labyrinth Shift Notification Banner */}
      {shiftNotice && (
        <div className="game06-shift-notice-banner" id="game06-shift-notice-dom">
          <div className="game06-shift-icon">◈</div>
          <div className="game06-shift-body">
            <span className="game06-shift-title">LABYRINTH REALIGNMENT</span>
            <span className="game06-shift-desc">{shiftNotice}</span>
          </div>
        </div>
      )}

      {/* Priority 1: Northern Exit Interaction Prompt */}
      {isNearExit && (
        isExitUnlocked ? (
          <div className="game06-interaction-prompt" id="game06-exit-prompt-dom">
            <div className="game06-prompt-target" style={{ color: '#38bdf8' }}>
              [EXIT UNSEALED]
            </div>
            <div className="game06-prompt-action">
              <span className="key-badge">E</span> ESCAPE
            </div>
          </div>
        ) : (
          <div
            className="game06-interaction-prompt game06-prompt-locked"
            id="game06-exit-prompt-dom"
          >
            <div className="game06-prompt-target" style={{ color: '#ef4444' }}>
              [EXIT SEALED]
            </div>
            <div
              className="game06-prompt-action"
              style={{ color: '#94a3b8', fontSize: '0.85rem' }}
            >
              INVESTIGATE ALL CORRIDORS
            </div>
          </div>
        )
      )}

      {/* Priority 2: Lore Artifact Examination Prompt */}
      {!isNearExit && isUnexaminedClueNear && nearestClue && (
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
