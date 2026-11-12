import React, { useEffect } from 'react'
import type { MazeInvestigationObject } from '../endlessMazeTypes'

export interface Game06ExaminationProps {
  item: MazeInvestigationObject
  onClose: () => void
}

export const Game06Examination: React.FC<Game06ExaminationProps> = ({
  item,
  onClose,
}) => {
  // Allow closing with ESC key or E key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="game06-examination-overlay"
      id="game06-examination-dom"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div
        className="game06-examination-card"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="game06-exam-meta-bar">
          <span className="game06-exam-tag">GAME 06 • INVESTIGATION</span>
        </div>

        <h2 className="game06-exam-title">{item.title}</h2>
        <div className="game06-exam-divider" />

        <div className="game06-exam-clues-list">
          {item.clues.map((clue, index) => (
            <div key={index} className="game06-exam-clue-item">
              <span className="game06-exam-clue-bullet">◈</span>
              <p className="game06-exam-clue-text">{clue}</p>
            </div>
          ))}
        </div>

        <div className="game06-exam-footer">
          <button
            type="button"
            id="close-game06-exam-btn"
            className="game06-exam-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
          <span className="game06-exam-keyhint">PRESS ESC OR E TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}

