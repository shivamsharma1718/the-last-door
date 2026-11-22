/**
 * Game 08: WARD 13 - Final Identity Diagnostic Terminal UI
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Implements:
 * - Diagnostic Terminal Modal outside Canvas
 * - Three Canonical Choices:
 *   - Option A (Patient Submission): PATIENT 404 — SUBMIT TO CLINICAL TERMINATION
 *   - Option B (Researcher Reclaim): CO-DIRECTOR — RECLAIM ARCHITECTURAL AUTHORITY
 *   - Option C (Autonomous Survivor): THE SURVIVOR — TERMINATE THE EXPERIMENT & CLAIM AUTONOMY
 * - Uniform styling: Correct choice is NOT revealed visually through badges, colors, or highlights.
 * - Single choice submission per attempt with confirm workflow.
 * - Safe pointer-lock handling.
 */

import React, { useState, useEffect } from 'react'
import type { TerminalDecisionOption } from '../ward13Types'

export interface Game08DiagnosticTerminalProps {
  onSubmit: (decision: TerminalDecisionOption) => void
  onClose: () => void
}

interface TerminalOptionItem {
  id: TerminalDecisionOption
  badge: string
  title: string
  action: string
  quote: string
  subtext: string
}

const TERMINAL_OPTIONS: TerminalOptionItem[] = [
  {
    id: 'patient_submission',
    badge: 'RECORD A // INTAKE DOSSIER',
    title: 'PATIENT 404',
    action: 'SUBMIT TO CLINICAL TERMINATION',
    quote: '“You were a subject. You were always a subject.”',
    subtext: 'Accept the hospital’s diagnosis. Yield to terminal conditioning.',
  },
  {
    id: 'researcher_reclaim',
    badge: 'RECORD B // FOUNDER ARCHIVE',
    title: 'CO-DIRECTOR',
    action: 'RECLAIM ARCHITECTURAL AUTHORITY',
    quote: '“You built the system. You can control it again.”',
    subtext: 'Demand executive administrative restoration. Take control of Project Morpheus.',
  },
  {
    id: 'autonomous_survivor',
    badge: 'RECORD C // UNREGISTERED PHENOMENON',
    title: 'THE SURVIVOR',
    action: 'TERMINATE THE EXPERIMENT & CLAIM AUTONOMY',
    quote: '“I am not your patient. I am not your creator. I am free.”',
    subtext: 'Reject both fabricated victimhood and institutional cruelty. End the trials.',
  },
]

export const Game08DiagnosticTerminal: React.FC<Game08DiagnosticTerminalProps> = ({
  onSubmit,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<TerminalDecisionOption | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Release pointer lock on opening terminal
  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedOption || isSubmitting) return

    setIsSubmitting(true)
    onSubmit(selectedOption)
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSubmitting) return
    onClose()
  }

  return (
    <div
      className="game08-terminal-overlay"
      id="game08-terminal-dom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game08-terminal-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="game08-terminal-card" onClick={(e) => e.stopPropagation()}>
        {/* Terminal Header & CRT Banner */}
        <div className="game08-terminal-header">
          <div className="game08-terminal-brand">
            <span className="game08-terminal-dot" />
            <span className="game08-terminal-sys">PROJECT MORPHEUS // PRIMARY DIAGNOSTIC CONSOLE</span>
          </div>
          <span className="game08-terminal-clearance">CLEARANCE: MASTER OVERRIDE</span>
        </div>

        <h1 id="game08-terminal-title" className="game08-terminal-title">
          FINAL IDENTITY VERIFICATION
        </h1>

        <div className="game08-terminal-divider" />

        {/* Clinical Terminal Prompt & Inscription */}
        <div className="game08-terminal-prompt-box">
          <div className="game08-terminal-status-row">
            <span className="game08-terminal-status-tag">IDENTITY CONFLICT DETECTED</span>
            <span className="game08-terminal-status-sub">THREE RECORDS REMAIN IN BUFFER</span>
          </div>
          <p className="game08-terminal-instruction">
            The facility requires cognitive reconciliation to terminate master quarantine.
            Declare who you believe you are. Your assertion is immutable.
          </p>
        </div>

        {/* Three Uniformly-Styled Options */}
        <div className="game08-terminal-options-grid">
          {TERMINAL_OPTIONS.map((opt) => {
            const isSelected = selectedOption === opt.id

            return (
              <button
                key={opt.id}
                type="button"
                className={`game08-terminal-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isSubmitting) {
                    setSelectedOption(opt.id)
                  }
                }}
                disabled={isSubmitting}
              >
                <div className="game08-terminal-option-header">
                  <span className="game08-terminal-option-badge">{opt.badge}</span>
                  <div className="game08-terminal-radio">
                    <span className="game08-terminal-radio-inner" />
                  </div>
                </div>

                <div className="game08-terminal-option-body">
                  <h2 className="game08-terminal-option-title">{opt.title}</h2>
                  <h3 className="game08-terminal-option-action">{opt.action}</h3>
                  <p className="game08-terminal-option-quote">{opt.quote}</p>
                  <p className="game08-terminal-option-subtext">{opt.subtext}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Confirmation Footer */}
        <div className="game08-terminal-footer">
          <button
            type="button"
            className="game08-terminal-cancel-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            DISENGAGE TERMINAL
          </button>

          <button
            type="button"
            id="submit-game08-decision-btn"
            className="game08-terminal-submit-btn"
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? 'PROCESSING COGNITIVE ASSERTION...' : 'CONFIRM IDENTITY ASSERTION'}
          </button>
        </div>
      </div>
    </div>
  )
}
