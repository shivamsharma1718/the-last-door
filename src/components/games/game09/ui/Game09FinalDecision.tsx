/**
 * Game 09: THE CONTROL ROOM - Master Core Final Decision Terminal
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements:
 * Terminal modal outside Canvas presenting the three philosophical paths:
 * - Option A: System Integration (Institutional Obedience - Failure)
 * - Option B: Thermal Overload (Nihilistic Destruction - Failure)
 * - Option C: Sever the Core (Sovereign Autonomy - Canonical Victory Path)
 * With mandatory 2-step confirmation to prevent accidental selection.
 */

import React, { useState, useEffect } from 'react'
import type { FinalDecisionOption } from '../controlRoomTypes'
import { CONTROL_ROOM_FINAL_DECISIONS } from '../controlRoomLogic'

export interface Game09FinalDecisionProps {
  onConfirm: (option: FinalDecisionOption) => void
  onClose: () => void
}

export const Game09FinalDecision: React.FC<Game09FinalDecisionProps> = ({
  onConfirm,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<FinalDecisionOption | null>(null)
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [])

  const handleSelect = (option: FinalDecisionOption) => {
    setSelectedOption(option)
    setIsConfirming(false)
  }

  const handleExecute = () => {
    if (!selectedOption) return
    onConfirm(selectedOption)
  }

  const selectedDef = CONTROL_ROOM_FINAL_DECISIONS.find(
    (d) => d.id === selectedOption
  )

  return (
    <div
      className="game09-final-decision-overlay"
      id="game09-final-decision-dom"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game09-terminal-title"
      onClick={onClose}
    >
      <div className="game09-crt-scanlines" />
      <div className="game09-vignette" />

      <div
        className="game09-final-decision-terminal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="game09-terminal-header">
          <div className="game09-terminal-header-title">
            <span className="game09-terminal-status-dot" />
            <span id="game09-terminal-title">
              OVERSEER MASTER CORE // EXECUTIVE VERDICT CONSOLE
            </span>
          </div>
          <span className="game09-terminal-clearance">
            CO-DIRECTOR ROOT PRIVILEGES: ACTIVE
          </span>
        </div>

        {/* Console Prompt Intro */}
        <div className="game09-terminal-prompt">
          <p className="game09-terminal-prompt-main">
            “THE EXPERIMENT HAS REACHED ITS RESOLUTION, CO-DIRECTOR.
            AUTHORIZE THE FINAL DIRECTIVE FOR PROJECT MORPHEUS.”
          </p>
          <p className="game09-terminal-prompt-sub">
            Review the operational parameters and philosophical consequences of each protocol.
          </p>
        </div>

        {/* 3 Decision Option Cards */}
        <div className="game09-terminal-options-grid">
          {CONTROL_ROOM_FINAL_DECISIONS.map((decision) => {
            const isSelected = selectedOption === decision.id
            const isVictory = decision.id === 'autonomous_override'
            const optionLetter =
              decision.id === 'system_integration'
                ? 'A'
                : decision.id === 'total_destruction'
                ? 'B'
                : 'C'

            return (
              <div
                key={decision.id}
                className={`game09-decision-option ${isSelected ? 'selected' : ''} ${
                  isVictory ? 'option-victory' : 'option-fatal'
                }`}
                onClick={() => handleSelect(decision.id)}
              >
                <div className="game09-decision-option-header">
                  <span className="game09-decision-option-tag">
                    PROTOCOL 09-{optionLetter}
                  </span>
                  <span className="game09-decision-philosophy">
                    {decision.philosophy}
                  </span>
                </div>

                <h3 className="game09-decision-option-title">{decision.label}</h3>

                <p className="game09-decision-option-subtext">{decision.subtext}</p>

                <div className="game09-decision-option-voice">
                  <span className="game09-voice-label">AI PROTOCOL VOICE:</span>
                  <p>{decision.systemPromptVoice}</p>
                </div>

                <div className="game09-decision-option-consequence">
                  <span className="game09-consequence-label">PREDICTED OUTCOME:</span>
                  <p>{decision.consequenceSummary}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Confirmation Step & Action Buttons */}
        <div className="game09-terminal-footer">
          {selectedDef && (
            <div className="game09-confirmation-banner">
              {!isConfirming ? (
                <div className="game09-confirm-row">
                  <div className="game09-confirm-info">
                    <span className="game09-confirm-tag">SELECTED PROTOCOL:</span>
                    <span className="game09-confirm-title">{selectedDef.label}</span>
                  </div>
                  <button
                    type="button"
                    className="game09-confirm-stage1-btn"
                    onClick={() => setIsConfirming(true)}
                  >
                    SELECT THIS DIRECTIVE →
                  </button>
                </div>
              ) : (
                <div className="game09-confirm-row confirming">
                  <div className="game09-confirm-info">
                    <span className="game09-confirm-warning-tag">
                      MANDATORY CONFIRMATION // CANNOT BE UNDONE
                    </span>
                    <span className="game09-confirm-title">{selectedDef.label}</span>
                  </div>
                  <div className="game09-confirm-buttons">
                    <button
                      type="button"
                      className="game09-cancel-confirm-btn"
                      onClick={() => setIsConfirming(false)}
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      className="game09-execute-directive-btn"
                      onClick={handleExecute}
                    >
                      EXECUTE PROTOCOL NOW
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="game09-terminal-bottom-row">
            <span className="game09-terminal-hint">
              {selectedOption
                ? 'Confirm your selection above to transmit protocol to Overseer Core.'
                : 'Select one of the three protocols to examine its parameters.'}
            </span>
            <button
              type="button"
              className="game09-terminal-return-btn"
              onClick={onClose}
            >
              RETURN TO INVESTIGATION [ESC]
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
