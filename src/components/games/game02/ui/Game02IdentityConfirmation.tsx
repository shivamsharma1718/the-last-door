import React, { useEffect } from 'react'
import type { IdentityOption } from '../roomOfNamesTypes'

export interface Game02IdentityConfirmationProps {
  identity: IdentityOption
  onConfirm: () => void
  onCancel: () => void
}

export const Game02IdentityConfirmation: React.FC<Game02IdentityConfirmationProps> = ({
  identity,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.stopPropagation()
        onCancel()
      } else if (e.code === 'Enter') {
        e.stopPropagation()
        onConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onConfirm, onCancel])

  return (
    <div
      className="game02-confirmation-overlay"
      id="game02-confirmation-dom"
    >
      <div className="game02-confirmation-card">
        <span className="game02-confirmation-tag">FINAL DECISION</span>
        <h2 className="game02-confirmation-name">“You chose {identity.name}.”</h2>
        <div className="game02-confirmation-divider" />
        <p className="game02-confirmation-prompt">“Is this who you are?”</p>

        <div className="game02-confirmation-actions">
          <button
            type="button"
            id="confirm-identity-btn"
            className="game02-confirm-button"
            onClick={(e) => {
              e.stopPropagation()
              onConfirm()
            }}
          >
            CONFIRM
          </button>
          <button
            type="button"
            id="cancel-identity-btn"
            className="game02-cancel-button"
            onClick={(e) => {
              e.stopPropagation()
              onCancel()
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
