import React, { useEffect } from 'react'
import type { IdentityOption, ObjectType } from '../roomOfNamesTypes'

export interface Game02ExaminationProps {
  identity: IdentityOption
  onClose: () => void
}

interface ThemeMeta {
  category: string
  icon: string
  accentColor: string
  flavor: string
}

function getObjectTheme(type: ObjectType | string): ThemeMeta {
  switch (type) {
    case 'photograph':
      return {
        category: 'MEMORABILIA • PHOTOGRAPH',
        icon: '◈',
        accentColor: '#e0a96d',
        flavor: 'A faded monochrome portrait from an unfamiliar past.',
      }
    case 'desk':
      return {
        category: 'ARCHIVES • STUDY DESK',
        icon: '✉',
        accentColor: '#70c1b3',
        flavor: 'Scattered correspondence and hastily written manuscripts.',
      }
    case 'hospital_record':
      return {
        category: 'ADMISSION • INTAKE RECORD',
        icon: '✚',
        accentColor: '#70d6ff',
        flavor: 'Clinical observations and marginalized patient intake files.',
      }
    case 'old_tape':
      return {
        category: 'RECORDING • MAGNETIC TAPE',
        icon: '◉',
        accentColor: '#ff9f43',
        flavor: 'Static-laced audio transcript captured on vintage reel-to-reel.',
      }
    case 'mirror':
      return {
        category: 'REFLECTION • ANTIQUE MIRROR',
        icon: '✧',
        accentColor: '#9b59b6',
        flavor: 'Distorted antique glass capturing a lingering silhouette.',
      }
    default:
      return {
        category: 'ARTIFACT • MEMORY VESSEL',
        icon: '◈',
        accentColor: '#70d6ff',
        flavor: 'An object tied to a forgotten identity.',
      }
  }
}

export const Game02Examination: React.FC<Game02ExaminationProps> = ({
  identity,
  onClose,
}) => {
  const theme = getObjectTheme(identity.objectType)

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
    <div className="game02-examination-overlay" id="game02-examination-dom">
      <div
        className="game02-examination-card"
        style={{
          borderTop: `2px solid ${theme.accentColor}`,
        }}
      >
        <div className="game02-exam-meta-bar">
          <span className="game02-exam-tag" style={{ color: theme.accentColor }}>
            {theme.icon} {theme.category}
          </span>
        </div>

        <h2 className="game02-exam-identity-name">{identity.name}</h2>
        <p className="game02-exam-flavor">{theme.flavor}</p>
        <div
          className="game02-exam-divider"
          style={{ background: theme.accentColor }}
        />

        <div className="game02-exam-section-label">MEMORY CLUES</div>

        <div className="game02-exam-clues-list">
          {identity.memoryClues.map((clue, index) => (
            <div
              key={index}
              className="game02-exam-clue-item"
              style={{
                borderLeftColor: theme.accentColor,
              }}
            >
              <span
                className="game02-exam-clue-bullet"
                style={{ color: theme.accentColor }}
              >
                {index + 1}
              </span>
              <p className="game02-exam-clue-text">{clue}</p>
            </div>
          ))}
        </div>

        <div className="game02-exam-footer">
          <button
            type="button"
            id="close-game02-exam-btn"
            className="game02-exam-close-button"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            CLOSE
          </button>
          <span className="game02-exam-keyhint">PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
