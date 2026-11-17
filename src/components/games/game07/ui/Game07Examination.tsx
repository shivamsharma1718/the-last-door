import React, { useEffect } from 'react'
import type { MirrorDefinition } from '../mirrorTrialTypes'

export interface Game07ExaminationProps {
  mirror: MirrorDefinition | null
  isExaminingAltar?: boolean
  altarUnlocked?: boolean
  mirrorsExaminedCount?: number
  discrepanciesCount?: number
  onClose: () => void
}

export const Game07Examination: React.FC<Game07ExaminationProps> = ({
  mirror,
  isExaminingAltar = false,
  altarUnlocked = false,
  mirrorsExaminedCount = 0,
  discrepanciesCount = 0,
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

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Re-engage pointer lock on canvas if possible
    const canvasEl = document.querySelector('canvas')
    if (canvasEl && canvasEl.requestPointerLock) {
      try {
        canvasEl.requestPointerLock()
      } catch {
        // Ignore browser restriction if any
      }
    }
    onClose()
  }

  // 1. Altar Inscription Modal
  if (isExaminingAltar) {
    return (
      <div
        className="game07-examination-overlay"
        id="game07-examination-dom"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="game07-examination-card game07-altar-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="game07-exam-meta-bar">
            <span className="game07-exam-tag" style={{ color: '#38bdf8' }}>
              GAME 07 • CENTRAL SANCTUM
            </span>
          </div>

          <h2 className="game07-exam-title">THE ALTAR OF TRUTH</h2>
          <div className="game07-exam-divider" />

          <div className="game07-altar-inscription-panel">
            <div className="game07-altar-verse">
              <p>“Four glasses drink the room.”</p>
              <p>“Three quench their thirst with lies.”</p>
              <p>“One reflects only what is cold and true.”</p>
              <p className="game07-altar-rule">
                “Trust the glass that does not invent, invert, or invite.”
              </p>
            </div>
          </div>

          <div className="game07-altar-status-panel">
            <div className="game07-status-badge">
              <span className="game07-status-label">STATUS:</span>
              <strong
                className="game07-status-val"
                style={{ color: altarUnlocked ? '#38bdf8' : '#f59e0b' }}
              >
                {altarUnlocked
                  ? 'AWAKENED • AWAITING FINAL VERDICT'
                  : 'DORMANT • INVESTIGATION INCOMPLETE'}
              </strong>
            </div>

            <p className="game07-altar-lore-text">
              {altarUnlocked
                ? 'All four mirrors have been cataloged. You now hold the observations needed to determine which glass reflects unbroken reality.'
                : 'The obsidian plinth is dormant. You must thoroughly investigate all four mirrors and their artifacts before the threshold will open.'}
            </p>

            <div className="game07-altar-stats-row">
              <span>Mirrors Examined: <strong>{mirrorsExaminedCount} / 4</strong></span>
              <span>Discrepancies Noted: <strong>{discrepanciesCount} / 3</strong></span>
            </div>
          </div>

          <div className="game07-exam-footer">
            <button
              type="button"
              id="close-game07-altar-btn"
              className="game07-exam-close-button"
              onClick={handleClose}
            >
              CLOSE
            </button>
            <span className="game07-exam-keyhint">PRESS ESC OR E TO RETURN</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. Mirror & Physical Artifact Investigation Modal
  if (!mirror) return null

  return (
    <div
      className="game07-examination-overlay"
      id="game07-examination-dom"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="game07-examination-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game07-exam-meta-bar">
          <span className="game07-exam-tag">
            GAME 07 • {mirror.direction.toUpperCase()} WALL
          </span>
          <span className="game07-exam-latin-pill">
            {mirror.latinTitle}
          </span>
        </div>

        <h2 className="game07-exam-title">{mirror.englishTitle}</h2>
        <div className="game07-exam-divider" />

        {/* Inscription Quote */}
        <div className="game07-exam-inscription">
          <span className="game07-inscription-icon">📜</span>
          <p className="game07-inscription-text">
            “{mirror.inscription}”
          </p>
        </div>

        {/* Side-by-Side Comparison: Reality vs. Reflection */}
        <div className="game07-exam-comparison-grid">
          {/* Left Column: Physical Reality */}
          <div className="game07-exam-column game07-column-reality">
            <div className="game07-column-header">
              <span className="game07-col-badge reality-badge">PHYSICAL REALITY</span>
              <h3 className="game07-col-title">{mirror.artifact.name}</h3>
            </div>
            <div className="game07-column-body">
              <div className="game07-evidence-block">
                <span className="game07-evidence-label">Artifact Inspection</span>
                <p className="game07-evidence-desc">{mirror.artifact.realDescription}</p>
              </div>
              <div className="game07-evidence-block">
                <span className="game07-evidence-label">Chamber Environment</span>
                <p className="game07-evidence-desc">{mirror.realityDescription}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Mirror Reflection */}
          <div className="game07-exam-column game07-column-reflection">
            <div className="game07-column-header">
              <span className="game07-col-badge reflection-badge">MIRROR REFLECTION</span>
              <h3 className="game07-col-title">Behind the Glass</h3>
            </div>
            <div className="game07-column-body">
              <div className="game07-evidence-block">
                <span className="game07-evidence-label">Reflected Appearance</span>
                <p className="game07-evidence-desc">{mirror.artifact.reflectedDescription}</p>
              </div>
              <div className="game07-evidence-block">
                <span className="game07-evidence-label">Glass Behavior</span>
                <p className="game07-evidence-desc">{mirror.reflectionDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clue Observations List */}
        <div className="game07-exam-clues-section">
          <h4 className="game07-clues-title">OBSERVATIONS & ANOMALIES</h4>
          <div className="game07-exam-clues-list">
            {mirror.clues.map((clue, idx) => (
              <div key={idx} className="game07-exam-clue-item">
                <span className="game07-exam-clue-bullet">◈</span>
                <div className="game07-clue-content">
                  <strong className="game07-clue-item-title">{clue.title}:</strong>{' '}
                  <span className="game07-exam-clue-text">{clue.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game07-exam-footer">
          <button
            type="button"
            id="close-game07-exam-btn"
            className="game07-exam-close-button"
            onClick={handleClose}
          >
            CLOSE
          </button>
          <span className="game07-exam-keyhint">PRESS ESC OR E TO RESUME EXPLORATION</span>
        </div>
      </div>
    </div>
  )
}
