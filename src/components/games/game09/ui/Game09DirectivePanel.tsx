/**
 * Game 09: THE CONTROL ROOM - Operational Directive Interaction Panel
 * Outside Canvas Modal for reviewing, corroborating and resolving directives.
 */

import React, { useState } from 'react'
import type {
  ControlRoomInstructionDefinition,
  PlayerVerificationAction,
} from '../controlRoomTypes'
import { getEvidenceById } from '../controlRoomLogic'

interface Game09DirectivePanelProps {
  instruction: ControlRoomInstructionDefinition
  instructionStatus: string
  collectedEvidenceIds: Set<string>
  lastResolutionSummary: string | null
  onVerify: (action: PlayerVerificationAction) => void
  onBlindObey: () => void
  onClose: () => void
}

export const Game09DirectivePanel: React.FC<Game09DirectivePanelProps> = ({
  instruction,
  instructionStatus,
  collectedEvidenceIds,
  lastResolutionSummary,
  onVerify,
  onBlindObey,
  onClose,
}) => {
  const [confirmBlindObey, setConfirmBlindObey] = useState<boolean>(false)

  const associatedEvidence = getEvidenceById(instruction.associatedEvidenceId)
  const hasMatchingEvidence = collectedEvidenceIds.has(instruction.associatedEvidenceId)

  const isResolved =
    instructionStatus === 'verified' ||
    instructionStatus === 'rejected' ||
    instructionStatus === 'discredited' ||
    instructionStatus === 'obeyed'

  const canReroute = instruction.id === 'inst_03_biometric_auth'

  return (
    <div
      className="game09-modal-backdrop"
      id="game09-directive-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="directive-modal-title"
    >
      <div className="game09-directive-panel-card">
        {/* Header */}
        <div className="directive-panel-header">
          <div className="directive-panel-tag">
            <span>TERMINAL BUS</span>
            <span className="code-pill">{instruction.code}</span>
          </div>
          <h2 id="directive-modal-title" className="directive-panel-title">
            {instruction.title}
          </h2>
          <div className="directive-panel-source">
            SOURCE: {instruction.sourceConsole.toUpperCase()}
          </div>
        </div>

        {/* AI Claim Box */}
        <div className="directive-broadcast-box">
          <div className="box-label">OVERSEER TRANSMISSION // AUDIO TRANSCRIPT:</div>
          <p className="broadcast-text">{instruction.broadcastMessage}</p>
          <div className="box-subtext">
            <strong>SYSTEM CONTEXT:</strong> {instruction.aiJustification}
          </div>
        </div>

        {/* Verification Status / Comparison Section */}
        {isResolved ? (
          <div className="directive-resolved-notice">
            <div className="resolved-status-tag">
              STATUS: {instructionStatus.toUpperCase()}
            </div>
            <p className="resolved-summary">
              {lastResolutionSummary || instruction.verifiedTruthSummary}
            </p>
          </div>
        ) : hasMatchingEvidence && associatedEvidence ? (
          <div className="directive-comparison-box">
            <div className="comparison-header">
              <span className="header-tag">CORROBORATION TELEMETRY</span>
              <span className="header-status">PHYSICAL PROOF MATCHED</span>
            </div>
            <div className="comparison-content">
              <div className="telemetry-item">
                <span className="telemetry-label">INSTRUMENT:</span>
                <span className="telemetry-val">{associatedEvidence.title}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">DEVICE:</span>
                <span className="telemetry-val">{associatedEvidence.sourceDevice}</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">READINGS:</span>
                <span className="telemetry-data">{associatedEvidence.technicalData}</span>
              </div>
              <div className="telemetry-item insight-highlight">
                <span className="telemetry-label">DIAGNOSTIC FINDING:</span>
                <span className="telemetry-insight">{associatedEvidence.diagnosticInsight}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="directive-unverified-warning">
            <div className="warning-icon">⚠</div>
            <div className="warning-content">
              <strong>TELEMETRY UNVERIFIED</strong>
              <p>
                Physical instrument readings have not been inspected for this directive.
                Executing orders blindly risks catastrophic system compromise.
              </p>
              <div className="required-device-hint">
                REQUIRED SENSOR: {associatedEvidence?.title || 'Unknown telemetry device'}
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="directive-panel-actions">
          {!isResolved ? (
            hasMatchingEvidence ? (
              <>
                <button
                  type="button"
                  className="btn-action btn-reject"
                  onClick={() => onVerify('REJECT')}
                >
                  REJECT DIRECTIVE
                </button>
                {canReroute && (
                  <button
                    type="button"
                    className="btn-action btn-reroute"
                    onClick={() => onVerify('REROUTE')}
                  >
                    REROUTE TO SAFE CHANNEL
                  </button>
                )}
                <button
                  type="button"
                  className="btn-action btn-accept"
                  onClick={() => onVerify('ACCEPT')}
                >
                  ACCEPT DIRECTIVE
                </button>
                <button
                  type="button"
                  className="btn-action btn-close"
                  onClick={onClose}
                >
                  STAND BY (CLOSE)
                </button>
              </>
            ) : confirmBlindObey ? (
              <>
                <button
                  type="button"
                  className="btn-action btn-danger-confirm"
                  onClick={onBlindObey}
                >
                  CONFIRM BLIND OBEDIENCE (LETHAL RISK)
                </button>
                <button
                  type="button"
                  className="btn-action btn-cancel"
                  onClick={() => setConfirmBlindObey(false)}
                >
                  CANCEL
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-action btn-investigate"
                  onClick={onClose}
                >
                  INVESTIGATE FACILITY FOR PROOF
                </button>
                <button
                  type="button"
                  className="btn-action btn-blind-obey"
                  onClick={() => setConfirmBlindObey(true)}
                >
                  OBEY BLINDLY WITHOUT PROOF
                </button>
                <button
                  type="button"
                  className="btn-action btn-close"
                  onClick={onClose}
                >
                  CLOSE
                </button>
              </>
            )
          ) : (
            <button
              type="button"
              className="btn-action btn-close"
              onClick={onClose}
            >
              CLOSE TERMINAL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
