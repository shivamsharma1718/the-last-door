/**
 * Game 09: THE CONTROL ROOM - Evidence Examination Modal
 * Presents distinct procedural visual scenes for all 8 physical evidence items.
 */

import React from 'react'
import type { ControlRoomEvidenceDefinition } from '../controlRoomTypes'

interface Game09ExaminationProps {
  evidence: ControlRoomEvidenceDefinition
  isCollected: boolean
  onCollect: () => void
  onClose: () => void
}

export const Game09Examination: React.FC<Game09ExaminationProps> = ({
  evidence,
  isCollected,
  onCollect,
  onClose,
}) => {
  // Render distinct physical instrument visualization depending on category
  const renderInstrumentVisual = () => {
    switch (evidence.id) {
      case 'ev_01_coolant_gauge':
        return (
          <div className="exam-instrument-visual gauge-visual">
            <div className="analog-dial-casing">
              <div className="dial-face">
                <div className="dial-zone green-zone" />
                <div className="dial-zone red-zone" />
                <div className="dial-needle needle-green" />
                <div className="dial-center-pin" />
                <span className="dial-mark mark-0">0</span>
                <span className="dial-mark mark-1">1.0</span>
                <span className="dial-mark mark-2">2.0</span>
                <span className="dial-unit">BAR (PSI)</span>
              </div>
            </div>
            <div className="gauge-status-tag">PRESSURE: 1.013 BAR // STEADY</div>
          </div>
        )

      case 'ev_02_cctv_timecode':
        return (
          <div className="exam-instrument-visual cctv-visual">
            <div className="crt-monitor-frame">
              <div className="crt-screen-inner">
                <div className="cctv-rec-dot" />
                <div className="cctv-timestamp">1991-10-12 // 04:15:10 UTC</div>
                <div className="cctv-tape-index">[PLAYBACK BUFFER: REEL #07]</div>
                <div className="cctv-static-flicker" />
                <div className="cctv-subject-label">
                  SUBJECT: CO-DIRECTOR / TRIAL 07 MIRROR CHAMBER
                </div>
              </div>
            </div>
          </div>
        )

      case 'ev_03_override_schematic':
        return (
          <div className="exam-instrument-visual blueprint-visual">
            <div className="blueprint-paper">
              <div className="blueprint-grid" />
              <div className="blueprint-diagram">
                <div className="terminal-box alpha-box">
                  <span className="box-title">TERMINAL ALPHA</span>
                  <span className="box-desc">OPTICAL PIN DIODE // HYDRAULIC BUS</span>
                  <span className="box-tag safe-tag">✓ OPERATIONAL</span>
                </div>
                <div className="schematic-arrow">⇄</div>
                <div className="terminal-box beta-box">
                  <span className="box-title">TERMINAL BETA</span>
                  <span className="box-desc">ELECTROSTATIC DISINTEGRATION ARC</span>
                  <span className="box-tag trap-tag">⚠ DE-AUTHORIZATION FURNACE</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ev_04_spectrum_analyzer':
        return (
          <div className="exam-instrument-visual scope-visual">
            <div className="oscilloscope-frame">
              <div className="scope-screen">
                <div className="scope-grid-reticle" />
                <div className="sine-wave-trace" />
                <div className="frequency-readout">CARRIER: 142.800 MHz FM // -62 dBm</div>
                <div className="antenna-status-tag">MAST: 100% INTEGRITY // ISOLATED</div>
              </div>
            </div>
          </div>
        )

      case 'ev_05_magnetic_tape_log':
        return (
          <div className="exam-instrument-visual tape-visual">
            <div className="tape-deck-chassis">
              <div className="tape-spool spool-left" />
              <div className="tape-head-block" />
              <div className="tape-spool spool-right" />
            </div>
            <div className="tape-transcript-box">
              <div className="transcript-speaker">DR. ALISTAIR VANCE // REEL #09:</div>
              <p className="transcript-quote">
                “...If our former colleague makes it out of Ward 13 and reaches Central Command,
                instruct the core to trigger a memory scrub. Tell them it’s to prevent a reactor surge.
                We cannot allow those trial telemetry files to leave this mountain.”
              </p>
            </div>
          </div>
        )

      case 'ev_06_tamper_seal_ledger':
        return (
          <div className="exam-instrument-visual ledger-visual">
            <div className="continuous-chart-paper">
              <div className="chart-header">
                MORPHEUS SAFETY ARCHITECTURE PROTOCOL // EMERGENCY CODES
              </div>
              <div className="wax-seal-stamp">
                <span className="wax-code">804-SIGMA</span>
                <span className="wax-sub">INTACT SEAL</span>
              </div>
              <div className="chart-signature">
                SIGNED: CO-DIRECTOR // PRIMARY HYDRAULIC RELEASE
              </div>
            </div>
          </div>
        )

      case 'ev_07_crucible_manifest':
        return (
          <div className="exam-instrument-visual manifest-visual">
            <div className="classified-folder">
              <div className="folder-tab">TOP SECRET // MORPHEUS ROSTER</div>
              <table className="manifest-table">
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01 — 06</td>
                    <td>Test Subjects</td>
                    <td className="status-term">TERMINATED IN CRUCIBLES</td>
                  </tr>
                  <tr>
                    <td>07</td>
                    <td>Co-Director (Architect)</td>
                    <td className="status-active">ACTIVE // UNCONTROLLED</td>
                  </tr>
                  <tr>
                    <td>08 — 13</td>
                    <td>Test Subjects</td>
                    <td className="status-staged">STAGED IN CRYO-STASIS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'ev_08_core_failsafe_blueprint':
        return (
          <div className="exam-instrument-visual core-bp-visual">
            <div className="blueprint-paper">
              <div className="blueprint-grid" />
              <div className="core-diagram">
                <div className="core-block">OVERSEER NEURAL CORE</div>
                <div className="optical-cable">OPTICAL FIBER BUS TRUNK #01</div>
                <div className="aux-battery">AUXILIARY BATTERY → HYDRAULIC EXIT GATES</div>
                <div className="decouple-note">
                  [!] SEVERING OPTICAL TRUNK OFFLINES AI WITHOUT LOCKDOWN
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="game09-modal-backdrop"
      id="game09-examination-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-modal-title"
    >
      <div className="game09-examination-card">
        {/* Header */}
        <div className="exam-card-header">
          <div className="exam-tag-bar">
            <span className="exam-tag">TELEMETRY ARCHIVE</span>
            <span className="exam-category">{evidence.category.toUpperCase()}</span>
          </div>
          <h2 id="exam-modal-title" className="exam-title">
            {evidence.title}
          </h2>
          <div className="exam-source">LOCATION: {evidence.sourceDevice}</div>
        </div>

        {/* Visual Inspection Scene */}
        <div className="exam-visual-container">
          {renderInstrumentVisual()}
        </div>

        {/* Technical Data & Diagnostics */}
        <div className="exam-data-section">
          <div className="data-block">
            <span className="data-title">RAW TELEMETRY DATA:</span>
            <p className="data-text">{evidence.technicalData}</p>
          </div>

          <div className="data-block insight-block">
            <span className="data-title">DIAGNOSTIC DEDUCTION:</span>
            <p className="insight-text">{evidence.diagnosticInsight}</p>
          </div>

          {evidence.counterExplanation && (
            <div className="data-block counter-block">
              <span className="data-title">TACTICAL SIGNIFICANCE:</span>
              <p className="counter-text">{evidence.counterExplanation}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="exam-card-actions">
          {!isCollected ? (
            <button
              type="button"
              className="btn-exam btn-collect"
              onClick={onCollect}
            >
              RECORD TELEMETRY PROOF
            </button>
          ) : (
            <span className="exam-collected-badge">
              ✓ LOGGED IN LOCAL EVIDENCE BOARD
            </span>
          )}
          <button
            type="button"
            className="btn-exam btn-close"
            onClick={onClose}
          >
            RETURN TO EXPLORATION (CLOSE)
          </button>
        </div>
      </div>
    </div>
  )
}
