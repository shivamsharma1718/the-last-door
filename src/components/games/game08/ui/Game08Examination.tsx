import React, { useEffect, useCallback } from 'react'
import type { EvidenceDefinition } from '../ward13Types'

export interface Game08ExaminationProps {
  evidence: EvidenceDefinition
  onClose: () => void
  isAlreadyCollected?: boolean
}

export const Game08Examination: React.FC<Game08ExaminationProps> = ({
  evidence,
  onClose,
  isAlreadyCollected = false,
}) => {
  const handleClose = useCallback(() => {
    // Attempt pointer lock re-acquisition on user direct interaction
    if (typeof document !== 'undefined') {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl && canvasEl.requestPointerLock) {
        try {
          canvasEl.requestPointerLock()
        } catch {
          // Ignore if blocked
        }
      }
    }
    onClose()
  }, [onClose])

  // Key listeners for Escape and KeyE to close modal safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const categoryLabelMap: Record<string, string> = {
    patient_record: 'PATIENT TELEMETRY & CLINICAL RECORD',
    experimental_memo: 'DIRECTORATE EXPERIMENTAL MEMORANDUM',
    audio_transcript: 'RECORDED SURVEILLANCE INTERROGATION',
    altered_photo: 'PHYSICAL EVIDENCE / PHOTOGRAPHIC RECORD',
    surveillance_log: 'CRUCIBLE MONITOR TELEMETRY LOG',
    terminal_record: 'PRIMARY DIAGNOSTIC SYSTEM RECORD',
  }

  const categoryDisplay = categoryLabelMap[evidence.category] || evidence.category.toUpperCase()

  return (
    <div
      className="game08-exam-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="game08-exam-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="game08-exam-header">
          <div className="game08-exam-stamp">CONFIDENTIAL MEDICAL DOSSIER</div>
          <div className="game08-exam-file-id">ITEM ID: {evidence.id.toUpperCase()}</div>
        </div>

        {/* Category & Title */}
        <div className="game08-exam-meta-block">
          <span className="game08-exam-category-tag">{categoryDisplay}</span>
          <h2 className="game08-exam-title">{evidence.title}</h2>
          <div className="game08-exam-source">
            <span className="game08-exam-source-label">LOCATION SOURCE:</span> {evidence.loreSource}
          </div>
        </div>

        <div className="game08-exam-divider" />

        {/* Clinical Document Excerpt */}
        <div className="game08-exam-body">
          <div className="game08-exam-body-label">DOCUMENT TRANSCRIPT EXCERPT:</div>
          <div className="game08-exam-excerpt-box">
            <p className="game08-exam-excerpt-text">{evidence.documentExcerpt}</p>
          </div>

          {/* Diagnostic Claim */}
          <div className="game08-exam-diagnostic-box">
            <span className="game08-exam-diagnostic-title">CLINICAL OBSERVATION:</span>
            <p className="game08-exam-diagnostic-text">{evidence.diagnosticClaim}</p>
          </div>

          {/* Cross-Trial Connection */}
          {evidence.trialConnection && (
            <div className="game08-exam-trial-connection">
              <span className="game08-exam-connection-tag">HISTORICAL RECALL:</span>{' '}
              {evidence.trialConnection}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="game08-exam-footer">
          <div className="game08-exam-status-indicator">
            <span className="game08-status-dot" />
            <span>{isAlreadyCollected ? 'RECORD CATALOGED IN DOSSIER' : 'NEW EVIDENCE ACQUIRED'}</span>
          </div>

          <button
            type="button"
            className="game08-exam-close-button"
            onClick={handleClose}
          >
            RESUME INVESTIGATION
          </button>

          <span className="game08-exam-keyhint">PRESS [E] OR [ESC] TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
