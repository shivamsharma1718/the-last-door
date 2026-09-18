import React, { useEffect } from 'react'
import type { InvestigationObject } from '../threeDoorsTypes'

export interface Game03ExaminationProps {
  item: InvestigationObject
  onClose: () => void
}

export const Game03Examination: React.FC<Game03ExaminationProps> = ({
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
    <div className="game03-examination-overlay" id="game03-examination-dom">
      <div className="game03-examination-card">
        <div className="game03-exam-meta-bar">
          <span className="game03-exam-tag">THREE DOORS • CLUE</span>
        </div>

        <h2 className="game03-exam-title">{item.name}</h2>
        <div className="game03-exam-divider" />

        <div className="game03-exam-clues-list">
          {item.clues.map((clue, index) => (
            <div key={index} className="game03-exam-clue-item">
              <span className="game03-exam-clue-bullet">◈</span>
              <p className="game03-exam-clue-text">{clue}</p>
            </div>
          ))}
        </div>

        <div className="game03-exam-footer">
          <button
            type="button"
            id="close-game03-exam-btn"
            className="game03-exam-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
          <span className="game03-exam-keyhint">PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
