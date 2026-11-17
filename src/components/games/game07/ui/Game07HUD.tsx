import React from 'react'
import type { ProximityState } from '../theMirrorTrialStore'

export interface Game07HUDProps {
  mirrorsExamined?: number
  totalMirrors?: number
  discrepanciesFound?: number
  totalDiscrepancies?: number
  altarUnlocked?: boolean
  proximity: ProximityState
}

export const Game07HUD: React.FC<Game07HUDProps> = ({
  mirrorsExamined = 0,
  totalMirrors = 4,
  discrepanciesFound = 0,
  totalDiscrepancies = 3,
  altarUnlocked = false,
  proximity,
}) => {
  const isInvestigationComplete = mirrorsExamined >= totalMirrors

  let targetLabel = ''
  if (proximity.type === 'altar') {
    targetLabel = 'CENTRAL ALTAR'
  } else if (proximity.type === 'mirror' && proximity.mirror) {
    targetLabel = proximity.mirror.latinTitle.toUpperCase()
  } else if (proximity.type === 'artifact' && proximity.artifact) {
    targetLabel = proximity.artifact.name.toUpperCase()
  }

  return (
    <div className="game07-hud" id="game07-hud-dom">
      {/* Top Center HUD Header */}
      <div className="game07-hud-header">
        <span className="game07-hud-title">GAME 07 — THE MIRROR TRIAL</span>

        {altarUnlocked ? (
          <span
            className="game07-hud-subtitle"
            style={{ color: '#38bdf8', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}
          >
            ALL MIRRORS WITNESSED • CENTRAL ALTAR AWAKENED
          </span>
        ) : (
          <span className="game07-hud-subtitle">
            Objective: Find the mirror that reflects reality.
          </span>
        )}

        <div className="game07-hud-counters-row">
          <span className="game07-hud-counter">
            MIRRORS EXAMINED:{' '}
            <strong className="game07-counter-highlight">
              {mirrorsExamined} / {totalMirrors}
            </strong>
          </span>

          <span className="game07-hud-counter-divider">•</span>

          <span className="game07-hud-counter">
            DISCREPANCIES IDENTIFIED:{' '}
            <strong
              className="game07-counter-highlight"
              style={{ color: discrepanciesFound > 0 ? '#c084fc' : '#94a3b8' }}
            >
              {discrepanciesFound} / {totalDiscrepancies}
            </strong>
          </span>
        </div>

        {isInvestigationComplete && (
          <span className="game07-hud-complete">
            INVESTIGATION COMPLETE • WITNESS THE ALTAR OF TRUTH
          </span>
        )}
      </div>

      {/* Context-Sensitive Interaction Prompt */}
      {proximity.promptText && targetLabel && (
        <div className="game07-interaction-prompt" id="game07-prompt-dom">
          <div className="game07-prompt-target">
            [{targetLabel}]
          </div>
          <div className="game07-prompt-action">
            <span className="key-badge">E</span> {proximity.promptText}
          </div>
        </div>
      )}
    </div>
  )
}
