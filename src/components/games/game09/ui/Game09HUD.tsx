/**
 * Game 09: THE CONTROL ROOM - HUD & Telemetry Status Overlay
 * Outside Canvas HUD displaying Trust score, Persona protocol, Directives status,
 * Evidence count, and dynamic proximity interaction prompt.
 */

import React, { useState } from 'react'
import type { TrustState } from '../controlRoomTypes'
import type { ControlRoomProximityState } from '../theControlRoomStore'
import { CONTROL_ROOM_INSTRUCTIONS } from '../controlRoomLogic'

interface Game09HUDProps {
  trust: TrustState
  collectedEvidenceCount: number
  totalEvidenceCount: number
  verifiedDirectivesCount: number
  totalDirectivesCount: number
  instructionStates: Record<string, string>
  collectedEvidenceIds: Set<string>
  proximity: ControlRoomProximityState
  onOpenEvidenceBoard: () => void
}

export const Game09HUD: React.FC<Game09HUDProps> = ({
  trust,
  collectedEvidenceCount,
  totalEvidenceCount,
  verifiedDirectivesCount,
  totalDirectivesCount,
  instructionStates,
  collectedEvidenceIds,
  proximity,
  onOpenEvidenceBoard,
}) => {
  const [isDirectiveListExpanded, setIsDirectiveListExpanded] = useState<boolean>(true)

  const isCollaborative = trust.tier === 'high'
  const isAdversarial = trust.tier === 'low'
  const trustColorClass = isCollaborative
    ? 'hud-trust-collaborative'
    : isAdversarial
    ? 'hud-trust-adversarial'
    : 'hud-trust-analytical'

  return (
    <div className="game09-hud-container" id="game09-hud-root">
      {/* 1. TOP TELEMETRY BAR */}
      <header className="game09-hud-header">
        <div className="game09-hud-brand">
          <span className="game09-hud-tag">FACILITY 09</span>
          <span className="game09-hud-title">CENTRAL CONTROL</span>
        </div>

        {/* Trust Readout */}
        <div className={`game09-hud-stat-pill ${trustColorClass}`}>
          <span className="stat-label">OVERSEER TRUST</span>
          <span className="stat-value">{trust.score} / 100</span>
          <span className="stat-badge">
            {trust.tier === 'high'
              ? 'COLLABORATIVE'
              : trust.tier === 'low'
              ? 'ADVERSARIAL'
              : 'ANALYTICAL'}
          </span>
        </div>

        {/* Directives Verified Progress */}
        <div className="game09-hud-stat-pill">
          <span className="stat-label">DIRECTIVES VERIFIED</span>
          <span className="stat-value">
            {verifiedDirectivesCount} / {totalDirectivesCount}
          </span>
          {verifiedDirectivesCount >= 5 && (
            <span className="stat-badge badge-active">CORE READY</span>
          )}
        </div>

        {/* Evidence Discovered Progress */}
        <div className="game09-hud-stat-pill">
          <span className="stat-label">TELEMETRY PROOFS</span>
          <span className="stat-value">
            {collectedEvidenceCount} / {totalEvidenceCount}
          </span>
        </div>

        {/* Evidence Board Trigger */}
        <button
          type="button"
          className="game09-hud-board-btn"
          onClick={onOpenEvidenceBoard}
          title="Open Evidence Dossier (TAB)"
        >
          <span className="key-cap">TAB</span>
          <span>EVIDENCE BOARD</span>
        </button>
      </header>

      {/* 2. DIRECTIVE SIDEBAR STATUS LIST */}
      <aside className="game09-hud-directives-sidebar">
        <div
          className="game09-directives-header"
          onClick={() => setIsDirectiveListExpanded(!isDirectiveListExpanded)}
        >
          <span className="sidebar-title">OPERATIONAL DIRECTIVES</span>
          <span className="sidebar-toggle">
            {isDirectiveListExpanded ? '▼' : '▲'}
          </span>
        </div>

        {isDirectiveListExpanded && (
          <div className="game09-directives-list">
            {CONTROL_ROOM_INSTRUCTIONS.map((inst) => {
              const state = instructionStates[inst.id] || 'pending'
              const isResolved =
                state === 'verified' ||
                state === 'rejected' ||
                state === 'discredited' ||
                state === 'obeyed'
              const hasEvidence = collectedEvidenceIds.has(inst.associatedEvidenceId)

              let badgeText = 'UNVERIFIED'
              let badgeClass = 'status-pending'

              if (isResolved) {
                badgeText = 'RESOLVED'
                badgeClass = 'status-resolved'
              } else if (hasEvidence) {
                badgeText = 'EVIDENCE FOUND'
                badgeClass = 'status-evidence-ready'
              }

              return (
                <div key={inst.id} className={`game09-directive-item ${badgeClass}`}>
                  <div className="directive-item-code">{inst.code}</div>
                  <div className="directive-item-info">
                    <span className="directive-item-title">{inst.title}</span>
                    <span className="directive-item-source">{inst.sourceConsole}</span>
                  </div>
                  <span className="directive-item-badge">{badgeText}</span>
                </div>
              )
            })}
          </div>
        )}
      </aside>

      {/* 3. BOTTOM CENTER PROXIMITY INTERACTION PROMPT */}
      {proximity.promptText && (
        <div className="game09-hud-proximity-prompt" role="alert">
          <span className="prompt-key">E</span>
          <span className="prompt-label">{proximity.promptText}</span>
        </div>
      )}
    </div>
  )
}
