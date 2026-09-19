import React, { useEffect } from 'react'
import type { WatcherInvestigationObject } from '../theWatcherTypes'

export interface Game04ExaminationProps {
  item: WatcherInvestigationObject
  onClose: () => void
}

export const Game04Examination: React.FC<Game04ExaminationProps> = ({
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
    <div className="game04-examination-overlay" id="game04-examination-dom">
      <div className="game04-examination-card">
        <div className="game04-exam-meta-bar">
          <span className="game04-exam-tag">THE WATCHER • CLUE</span>
        </div>

        <h2 className="game04-exam-title">{item.title}</h2>
        <div className="game04-exam-divider" />

        <div className="game04-exam-clues-list">
          {item.clues.map((clue, index) => (
            <div key={index} className="game04-exam-clue-item">
              <span className="game04-exam-clue-bullet">◈</span>
              <p className="game04-exam-clue-text">{clue}</p>
            </div>
          ))}
        </div>

        <div className="game04-exam-footer">
          <button
            type="button"
            id="close-game04-exam-btn"
            className="game04-exam-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
          <span className="game04-exam-keyhint">PRESS ESC OR E TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
