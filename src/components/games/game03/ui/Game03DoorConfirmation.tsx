import React, { useEffect } from 'react'
import type { DoorOption } from '../threeDoorsTypes'

export interface Game03DoorConfirmationProps {
  door: DoorOption
  onConfirm: () => void
  onCancel: () => void
}

export const Game03DoorConfirmation: React.FC<Game03DoorConfirmationProps> = ({
  door,
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
      className="game03-door-confirmation-overlay"
      id="game03-door-confirmation-dom"
    >
      <div className="game03-door-confirmation-card">
        <span className="game03-door-confirmation-tag">YOU CHOSE</span>
        <div className="game03-door-confirmation-number">{door.doorNumber}</div>
        <h2 className="game03-door-confirmation-name">{door.name}</h2>
        <div className="game03-door-confirmation-divider" />
        <p className="game03-door-confirmation-prompt">“Is this your decision?”</p>

        <div className="game03-door-confirmation-actions">
          <button
            type="button"
            id="confirm-door-choice-btn"
            className="game03-confirm-choice-button"
            onClick={(e) => {
              e.stopPropagation()
              onConfirm()
            }}
          >
            CONFIRM
          </button>
          <button
            type="button"
            id="cancel-door-choice-btn"
            className="game03-cancel-choice-button"
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
