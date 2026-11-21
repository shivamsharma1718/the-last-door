import React, { useEffect, useCallback } from 'react'
import type {
  EvidenceId,
} from '../ward13Types'
import {
  WARD13_EVIDENCE,
  getEvidenceById,
} from '../ward13Logic'
import type { ComparisonResultState } from '../theWard13Store'

export interface Game08ContradictionBoardProps {
  collectedEvidenceIds: Set<EvidenceId>
  resolvedContradictionKeys: string[]
  selectedEvidenceA: EvidenceId | null
  selectedEvidenceB: EvidenceId | null
  comparisonResult: ComparisonResultState | null
  onSelectSlot: (slot: 'A' | 'B', id: EvidenceId) => void
  onClearSelection: () => void
  onExecuteComparison: () => void
  onLaunchRevelation: (contradictionKey: string) => void
  onClose: () => void
}

export const Game08ContradictionBoard: React.FC<Game08ContradictionBoardProps> = ({
  collectedEvidenceIds,
  resolvedContradictionKeys,
  selectedEvidenceA,
  selectedEvidenceB,
  comparisonResult,
  onSelectSlot,
  onClearSelection,
  onExecuteComparison,
  onLaunchRevelation,
  onClose,
}) => {
  const handleClose = useCallback(() => {
    if (typeof document !== 'undefined') {
      const canvasEl = document.querySelector('canvas')
      if (canvasEl && canvasEl.requestPointerLock) {
        try {
          canvasEl.requestPointerLock()
        } catch {
          // Ignore
        }
      }
    }
    onClose()
  }, [onClose])

  // Key listeners for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const docA = selectedEvidenceA ? getEvidenceById(selectedEvidenceA) : null
  const docB = selectedEvidenceB ? getEvidenceById(selectedEvidenceB) : null

  const canCompare =
    selectedEvidenceA !== null &&
    selectedEvidenceB !== null &&
    selectedEvidenceA !== selectedEvidenceB

  const categoryBadgeClass = (category: string) => {
    switch (category) {
      case 'patient_record':
        return 'cat-patient'
      case 'surveillance_log':
        return 'cat-surveillance'
      case 'audio_transcript':
        return 'cat-audio'
      case 'altered_photo':
        return 'cat-photo'
      case 'experimental_memo':
        return 'cat-memo'
      case 'terminal_record':
        return 'cat-terminal'
      default:
        return 'cat-default'
    }
  }

  const categoryDisplay = (category: string) => {
    switch (category) {
      case 'patient_record':
        return 'OFFICIAL CLINICAL RECORD'
      case 'surveillance_log':
        return 'SURVEILLANCE CCTV PLAYBACK'
      case 'audio_transcript':
        return 'INTERVIEW AUDIO TRANSCRIPT'
      case 'altered_photo':
        return 'FORENSIC PHOTOGRAPHIC EVIDENCE'
      case 'experimental_memo':
        return 'DIRECTORATE RESEARCH MEMO'
      case 'terminal_record':
        return 'FACILITY DIAGNOSTIC MANIFEST'
      default:
        return category.toUpperCase()
    }
  }

  return (
    <div
      className="game08-board-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="game08-board-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="game08-board-header">
          <div className="game08-board-title-group">
            <span className="game08-board-tag">PROJECT MORPHEUS // CLINICAL AUDIT</span>
            <h1 className="game08-board-title">DEDUCTION & CONTRADICTION BOARD</h1>
            <p className="game08-board-subtitle">
              CROSS-EXAMINE RECOVERED DOCUMENTS TO EXPOSE SYSTEMIC DATA FALSIFICATIONS
            </p>
          </div>

          <div className="game08-board-status-group">
            <div className="game08-board-stat">
              <span className="stat-label">RECORDS COLLECTED:</span>
              <span className="stat-val">
                <strong>{collectedEvidenceIds.size}</strong> / 12
              </span>
            </div>
            <div className="game08-board-stat">
              <span className="stat-label">CONTRADICTIONS RECONCILED:</span>
              <span className="stat-val highlight">
                <strong>{resolvedContradictionKeys.length}</strong> / 3
              </span>
            </div>
            <button
              type="button"
              className="game08-board-close-btn"
              onClick={handleClose}
            >
              ✕ CLOSE [ESC]
            </button>
          </div>
        </div>

        {/* Main Work Area: Left Dossier List, Right Comparison Workspace */}
        <div className="game08-board-workspace">
          {/* Left: Recovered Evidence Dossier */}
          <div className="game08-dossier-panel">
            <div className="game08-panel-header">
              <span className="panel-title">RECOVERED ARCHIVAL RECORDS</span>
              <span className="panel-count">{collectedEvidenceIds.size} AVAILABLE</span>
            </div>

            <div className="game08-dossier-list">
              {WARD13_EVIDENCE.map((item) => {
                const isCollected = collectedEvidenceIds.has(item.id)
                const isSelectedA = selectedEvidenceA === item.id
                const isSelectedB = selectedEvidenceB === item.id

                if (!isCollected) {
                  return (
                    <div key={item.id} className="game08-dossier-item locked">
                      <div className="locked-badge">RESTRICTED // UNCOLLECTED</div>
                      <div className="locked-title">CLASSIFIED ARCHIVE RECORD</div>
                      <div className="locked-sub">Search Ward 13 rooms to recover this file.</div>
                    </div>
                  )
                }

                return (
                  <div
                    key={item.id}
                    className={`game08-dossier-item ${
                      isSelectedA ? 'selected-a' : isSelectedB ? 'selected-b' : ''
                    }`}
                  >
                    <div className="dossier-item-top">
                      <span className={`category-pill ${categoryBadgeClass(item.category)}`}>
                        {categoryDisplay(item.category)}
                      </span>
                      {isSelectedA && <span className="slot-badge badge-a">SLOT A</span>}
                      {isSelectedB && <span className="slot-badge badge-b">SLOT B</span>}
                    </div>

                    <h4 className="dossier-item-title">{item.title}</h4>
                    <p className="dossier-item-source">{item.loreSource}</p>

                    <div className="dossier-item-actions">
                      <button
                        type="button"
                        className={`slot-assign-btn btn-a ${isSelectedA ? 'active' : ''}`}
                        onClick={() => onSelectSlot('A', item.id)}
                      >
                        {isSelectedA ? '✓ IN SLOT A' : 'SET AS DOC A'}
                      </button>
                      <button
                        type="button"
                        className={`slot-assign-btn btn-b ${isSelectedB ? 'active' : ''}`}
                        onClick={() => onSelectSlot('B', item.id)}
                      >
                        {isSelectedB ? '✓ IN SLOT B' : 'SET AS DOC B'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Side-by-Side Comparison Workspace */}
          <div className="game08-comparison-panel">
            <div className="game08-panel-header">
              <span className="panel-title">CROSS-DOCUMENT COMPARISON DOCK</span>
              <button
                type="button"
                className="clear-selection-btn"
                onClick={onClearSelection}
                disabled={!selectedEvidenceA && !selectedEvidenceB}
              >
                RESET SELECTION
              </button>
            </div>

            {/* Side-by-Side Comparison Slots */}
            <div className="game08-comparison-slots">
              {/* Slot A */}
              <div className={`comparison-slot slot-a ${docA ? 'occupied' : 'empty'}`}>
                <div className="slot-header">
                  <span className="slot-title">DOCUMENT A</span>
                  {docA && (
                    <button
                      type="button"
                      className="slot-remove-btn"
                      onClick={() => onSelectSlot('A', null as unknown as EvidenceId)}
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                {docA ? (
                  <div className="slot-content">
                    <span className={`category-pill ${categoryBadgeClass(docA.category)}`}>
                      {categoryDisplay(docA.category)}
                    </span>
                    <h3 className="slot-doc-title">{docA.title}</h3>
                    <div className="slot-doc-source">
                      <strong>SOURCE:</strong> {docA.loreSource}
                    </div>
                    <div className="slot-doc-excerpt">
                      <span className="excerpt-label">RECORD EXCERPT:</span>
                      <p>{docA.documentExcerpt}</p>
                    </div>
                    <div className="slot-doc-claim">
                      <span className="claim-label">DOCUMENTED CLAIM:</span>
                      <p>{docA.diagnosticClaim}</p>
                    </div>
                  </div>
                ) : (
                  <div className="slot-empty-prompt">
                    <div className="empty-icon">📁</div>
                    <p className="empty-text">Select Document A from the dossier on the left</p>
                  </div>
                )}
              </div>

              {/* Center Divider / VS */}
              <div className="comparison-divider-bar">
                <span className="vs-badge">VS</span>
              </div>

              {/* Slot B */}
              <div className={`comparison-slot slot-b ${docB ? 'occupied' : 'empty'}`}>
                <div className="slot-header">
                  <span className="slot-title">DOCUMENT B</span>
                  {docB && (
                    <button
                      type="button"
                      className="slot-remove-btn"
                      onClick={() => onSelectSlot('B', null as unknown as EvidenceId)}
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                {docB ? (
                  <div className="slot-content">
                    <span className={`category-pill ${categoryBadgeClass(docB.category)}`}>
                      {categoryDisplay(docB.category)}
                    </span>
                    <h3 className="slot-doc-title">{docB.title}</h3>
                    <div className="slot-doc-source">
                      <strong>SOURCE:</strong> {docB.loreSource}
                    </div>
                    <div className="slot-doc-excerpt">
                      <span className="excerpt-label">RECORD EXCERPT:</span>
                      <p>{docB.documentExcerpt}</p>
                    </div>
                    <div className="slot-doc-claim">
                      <span className="claim-label">DOCUMENTED CLAIM:</span>
                      <p>{docB.diagnosticClaim}</p>
                    </div>
                  </div>
                ) : (
                  <div className="slot-empty-prompt">
                    <div className="empty-icon">📁</div>
                    <p className="empty-text">Select Document B from the dossier on the left</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="comparison-action-bar">
              <button
                type="button"
                className={`compare-execute-btn ${canCompare ? 'ready' : 'disabled'}`}
                disabled={!canCompare}
                onClick={onExecuteComparison}
              >
                COMPARE SELECTED DOCUMENTS
              </button>
            </div>

            {/* Results / Feedback Section */}
            <div className="comparison-results-area">
              {comparisonResult ? (
                comparisonResult.isMatch && comparisonResult.pair ? (
                  <div className="result-card success-card">
                    <div className="result-header">
                      <span className="result-badge success-badge">
                        CRITICAL CONTRADICTION DETECTED
                      </span>
                      <span className="result-name">{comparisonResult.pair.name}</span>
                    </div>

                    <div className="result-comparison-claims">
                      <div className="claim-box claim-a">
                        <span className="claim-origin">CLAIM A (OFFICIAL):</span>
                        <p>{comparisonResult.pair.claimA}</p>
                      </div>
                      <div className="claim-box claim-b">
                        <span className="claim-origin">CLAIM B (DISCREPANCY):</span>
                        <p>{comparisonResult.pair.claimB}</p>
                      </div>
                    </div>

                    <div className="result-deduction">
                      <span className="deduction-label">VERIFIED INSTITUTIONAL TRUTH:</span>
                      <p>{comparisonResult.pair.resolvedTruth}</p>
                    </div>

                    <button
                      type="button"
                      className="initiate-synthesis-btn"
                      onClick={() =>
                        onLaunchRevelation(comparisonResult.pair!.key)
                      }
                    >
                      INITIATE COGNITIVE SYNTHESIS
                    </button>
                  </div>
                ) : (
                  <div className="result-card failure-card">
                    <div className="result-header">
                      <span className="result-badge failure-badge">ANALYSIS INCONCLUSIVE</span>
                    </div>
                    <p className="failure-message">{comparisonResult.message}</p>
                  </div>
                )
              ) : (
                <div className="result-card idle-card">
                  <p className="idle-instruction">
                    Assign two contrasting documents to Slot A and Slot B, then select
                    <strong> COMPARE SELECTED DOCUMENTS</strong> to test for institutional discrepancies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
