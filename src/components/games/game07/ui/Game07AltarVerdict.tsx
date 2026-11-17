import React, { useState } from 'react'
import type { MirrorId } from '../mirrorTrialTypes'

export interface Game07AltarVerdictProps {
  isTransitioning?: boolean
  onSubmit: (choice: MirrorId) => void
  onClose: () => void
}

interface MirrorOption {
  id: MirrorId
  label: string
  subtitle: string
}

const MIRROR_OPTIONS: MirrorOption[] = [
  {
    id: 'mirror_north',
    label: 'NORTH — SPECULUM VERITATIS',
    subtitle: 'The North Wall Glass',
  },
  {
    id: 'mirror_east',
    label: 'EAST — SPECULUM IGNIS',
    subtitle: 'The East Wall Glass',
  },
  {
    id: 'mirror_west',
    label: 'WEST — SPECULUM TEMPORIS',
    subtitle: 'The West Wall Glass',
  },
  {
    id: 'mirror_south',
    label: 'SOUTH — SPECULUM IANUAE',
    subtitle: 'The South Wall Glass',
  },
]

export const Game07AltarVerdict: React.FC<Game07AltarVerdictProps> = ({
  isTransitioning = false,
  onSubmit,
  onClose,
}) => {
  const [selectedMirror, setSelectedMirror] = useState<MirrorId | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // 1. Correct Choice Atmospheric Decision Sequence (Verdict Transition)
  if (isTransitioning) {
    return (
      <div
        className="game07-verdict-overlay"
        id="game07-verdict-transition-dom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game07-verdict-transition-card">
          <span className="game07-verdict-tag" style={{ color: '#38bdf8' }}>
            VERDICT CONFIRMED
          </span>
          <div className="game07-verdict-divider" />
          <div className="game07-verdict-transition-lore">
            <p className="game07-verdict-line game07-verdict-line-1">
              “THE GLASS DOES NOT LIE.”
            </p>
            <p className="game07-verdict-line game07-verdict-line-2">
              “IT ONLY SHOWS WHAT IS THERE.”
            </p>
            <p className="game07-verdict-line game07-verdict-line-3" style={{ color: '#7dd3fc' }}>
              “YOU CHOSE WHAT WAS REAL.”
            </p>
          </div>
          <div className="game07-verdict-pulse-indicator" />
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedMirror || isSubmitting) return

    setIsSubmitting(true)
    onSubmit(selectedMirror)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSubmitting) return
    onClose()
  }

  // 2. Main Altar Verdict Selection Interface
  return (
    <div
      className="game07-verdict-overlay"
      id="game07-verdict-dom"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="game07-verdict-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="game07-verdict-meta-bar">
          <span className="game07-verdict-tag">GAME 07 • THE ALTAR OF TRUTH</span>
        </div>

        <h2 className="game07-verdict-title">THE VERDICT OF THE SPECULA</h2>
        <div className="game07-verdict-divider" />

        {/* Sacred Altar Verse */}
        <div className="game07-verdict-inscription">
          <p>“Four glasses drink the room.”</p>
          <p>“Three quench their thirst with lies.”</p>
          <p>“One reflects only what is cold and true.”</p>
          <p className="game07-verdict-rule">
            “Trust the glass that does not invent, invert, or invite.”
          </p>
        </div>

        {/* Warning Banner */}
        <div className="game07-verdict-warning">
          <span className="game07-warning-icon">⚠</span>
          <p className="game07-warning-text">
            Choose the single mirror that reflects reality without deception. Your decision is final.
          </p>
        </div>

        {/* Four Unmarked Selectable Choices */}
        <div className="game07-verdict-options">
          {MIRROR_OPTIONS.map((opt) => {
            const isSelected = selectedMirror === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                className={`game07-verdict-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isSubmitting) {
                    setSelectedMirror(opt.id)
                  }
                }}
                disabled={isSubmitting}
              >
                <div className="game07-option-indicator">
                  <span className="game07-option-dot" />
                </div>
                <div className="game07-option-content">
                  <span className="game07-option-label">{opt.label}</span>
                  <span className="game07-option-subtitle">{opt.subtitle}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div className="game07-verdict-footer">
          <button
            type="button"
            className="game07-verdict-cancel-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            STEP BACK
          </button>

          <button
            type="button"
            id="submit-game07-verdict-btn"
            className="game07-verdict-submit-btn"
            onClick={handleSubmit}
            disabled={!selectedMirror || isSubmitting}
          >
            {isSubmitting ? 'OFFERING VERDICT...' : 'PRESENT VERDICT'}
          </button>
        </div>
      </div>
    </div>
  )
}
