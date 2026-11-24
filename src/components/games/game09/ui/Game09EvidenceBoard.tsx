/**
 * Game 09: THE CONTROL ROOM - Evidence Dossier Board
 * Comprehensive review board displaying all 8 physical evidence records.
 */

import React from 'react'
import type { EvidenceId } from '../controlRoomTypes'
import { CONTROL_ROOM_EVIDENCE } from '../controlRoomLogic'

interface Game09EvidenceBoardProps {
  collectedEvidenceIds: Set<EvidenceId>
  onSelectEvidence: (id: EvidenceId) => void
  onClose: () => void
}

export const Game09EvidenceBoard: React.FC<Game09EvidenceBoardProps> = ({
  collectedEvidenceIds,
  onSelectEvidence,
  onClose,
}) => {
  return (
    <div
      className="game09-modal-backdrop"
      id="game09-evidence-board-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-title"
    >
      <div className="game09-evidence-board-card">
        {/* Header */}
        <div className="board-header">
          <div className="board-brand">
            <span className="brand-tag">PROJECT MORPHEUS</span>
            <h2 id="board-title" className="brand-title">
              PHYSICAL TELEMETRY DOSSIER
            </h2>
          </div>
          <div className="board-progress-pill">
            COLLECTED: {collectedEvidenceIds.size} / {CONTROL_ROOM_EVIDENCE.length}
          </div>
          <button
            type="button"
            className="board-close-btn"
            onClick={onClose}
            aria-label="Close Evidence Board"
          >
            ×
          </button>
        </div>

        {/* 8-Slot Evidence Grid */}
        <div className="board-grid">
          {CONTROL_ROOM_EVIDENCE.map((ev, index) => {
            const isCollected = collectedEvidenceIds.has(ev.id)
            return (
              <div
                key={ev.id}
                className={`board-slot ${isCollected ? 'slot-collected' : 'slot-locked'}`}
                onClick={() => {
                  if (isCollected) {
                    onSelectEvidence(ev.id)
                  }
                }}
              >
                <div className="slot-index">PROOF 0{index + 1}</div>
                {isCollected ? (
                  <div className="slot-content">
                    <span className="slot-category">{ev.category.toUpperCase()}</span>
                    <h3 className="slot-title">{ev.title}</h3>
                    <p className="slot-device">{ev.sourceDevice}</p>
                    <span className="slot-inspect-prompt">Click to Inspect Telemetry</span>
                  </div>
                ) : (
                  <div className="slot-locked-content">
                    <div className="lock-icon">🔒</div>
                    <span className="locked-label">UNCOLLECTED TELEMETRY</span>
                    <span className="locked-location-hint">SECTOR: {ev.areaId.toUpperCase()}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="board-footer">
          <span className="footer-lore">
            NOTE: All physical proofs must be corroborated at their corresponding sector console.
          </span>
          <button
            type="button"
            className="btn-board-close"
            onClick={onClose}
          >
            RETURN TO EXPLORATION (CLOSE)
          </button>
        </div>
      </div>
    </div>
  )
}
