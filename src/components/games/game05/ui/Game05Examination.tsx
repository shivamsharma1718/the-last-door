import React, { useEffect } from 'react'
import type { DrowningHallObject } from '../drowningHallTypes'

export interface Game05ExaminationProps {
  item: DrowningHallObject
  onClose: () => void
}

export const Game05Examination: React.FC<Game05ExaminationProps> = ({
  item,
  onClose,
}) => {
  // Allow closing with ESC key or E key
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
    <div className="game05-examination-overlay" id="game05-examination-dom">
      <div className="game05-examination-card">
        <div className="game05-exam-meta-bar">
          <span className="game05-exam-tag">GAME 05 • INVESTIGATION</span>
        </div>

        <h2 className="game05-exam-title">{item.title}</h2>
        <div className="game05-exam-divider" />

        <div className="game05-exam-clues-list">
          {item.clues.map((clue, index) => (
            <div key={index} className="game05-exam-clue-item">
              <span className="game05-exam-clue-bullet">◈</span>
              <p className="game05-exam-clue-text">{clue}</p>
            </div>
          ))}
        </div>

        <div className="game05-exam-footer">
          <button
            type="button"
            id="close-game05-exam-btn"
            className="game05-exam-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
          <span className="game05-exam-keyhint">PRESS ESC OR E TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
