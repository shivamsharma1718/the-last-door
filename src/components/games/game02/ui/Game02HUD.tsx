import React from 'react'
import type { IdentityOption } from '../roomOfNamesTypes'

export interface Game02HUDProps {
  examinedCount: number
  totalIdentities?: number
  nearestIdentity?: IdentityOption | null
}

export const Game02HUD: React.FC<Game02HUDProps> = ({
  examinedCount,
  totalIdentities = 5,
  nearestIdentity = null,
}) => {
  return (
    <div className="game02-hud" id="game02-hud-dom">
      {/* Top-level subtle trial tracker */}
      <div className="game02-hud-header">
        <span className="game02-hud-title">THE ROOM OF NAMES</span>
        <span className="game02-hud-counter">
          IDENTITIES EXAMINED:{' '}
          <strong className="game02-counter-highlight">
            {examinedCount} / {totalIdentities}
          </strong>
        </span>
      </div>

      {/* Proximity Interaction Prompt */}
      {nearestIdentity && (
        <div className="game02-interaction-prompt" id="game02-prompt-dom">
          <div className="game02-prompt-identity">{nearestIdentity.name}</div>
          <div className="game02-prompt-action">
            <span className="key-badge">E</span> PRESS E TO EXAMINE
          </div>
        </div>
      )}
    </div>
  )
}
