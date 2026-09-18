import React, { useEffect } from 'react'
import type { DoorOption } from '../threeDoorsTypes'

export interface Game03DoorExaminationProps {
  door: DoorOption
  allCluesFound: boolean
  onChoose: () => void
  onClose: () => void
}

export const Game03DoorExamination: React.FC<Game03DoorExaminationProps> = ({
  door,
  allCluesFound,
  onChoose,
  onClose,
}) => {
  // Allow closing with ESC key or E key (if not choosing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="game03-door-exam-overlay" id="game03-door-exam-dom">
      <div className="game03-door-exam-card">
        <div className="game03-exam-meta-bar">
          <span className="game03-exam-tag">DOOR EXAMINATION</span>
        </div>

        <span className="game03-door-exam-number">{door.doorNumber}</span>
        <h2 className="game03-door-exam-title">{door.name}</h2>
        <div className="game03-door-exam-divider" />

        <div className="game03-door-exam-statement-box">
          <span className="game03-door-statement-label">INSCRIPTION</span>
          <p className="game03-door-exam-statement">{door.statement}</p>
        </div>

        {!allCluesFound ? (
          <div className="game03-door-locked-notice">
            <p className="game03-door-locked-text">
              “THE ROOM HAS NOT SHOWN YOU EVERYTHING.”
            </p>
          </div>
        ) : (
          <div className="game03-door-unlocked-notice">
            <p className="game03-door-unlocked-text">
              “The four clues have been discovered. The threshold is open for decision.”
            </p>
          </div>
        )}

        <div className="game03-door-exam-actions">
          {allCluesFound && (
            <button
              type="button"
              id="choose-door-btn"
              className="game03-choose-door-button"
              onClick={(e) => {
                e.stopPropagation()
                onChoose()
              }}
            >
              CHOOSE THIS DOOR
            </button>
          )}

          <button
            type="button"
            id="close-door-exam-btn"
            className="game03-door-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
        </div>

        <span className="game03-exam-keyhint">PRESS ESC TO CLOSE</span>
      </div>
    </div>
  )
}
