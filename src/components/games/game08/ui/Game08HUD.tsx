import React from 'react'
import type { Ward13RoomId } from '../ward13Types'
import { getRoomById } from '../ward13Logic'
import type { Ward13ProximityState } from '../theWard13Store'

export interface Game08HUDProps {
  currentRoomId: Ward13RoomId
  collectedCount: number
  totalEvidence?: number
  clearanceLevel: number
  resolvedContradictionsCount: number
  totalContradictions?: number
  proximity: Ward13ProximityState
}

export const Game08HUD: React.FC<Game08HUDProps> = ({
  currentRoomId,
  collectedCount,
  totalEvidence = 12,
  clearanceLevel,
  resolvedContradictionsCount,
  totalContradictions = 3,
  proximity,
}) => {
  const room = getRoomById(currentRoomId)
  const roomName = room ? room.name.toUpperCase() : 'WARD 13'
  const roomSubtext = room ? room.subtext.toUpperCase() : 'UNKNOWN SECTOR'

  return (
    <div className="game08-hud" id="game08-hud-dom">
      {/* Top Center Institutional Header */}
      <div className="game08-hud-header">
        <div className="game08-hud-top-bar">
          <span className="game08-hud-tag">PROJECT MORPHEUS</span>
          <span className="game08-hud-separator">//</span>
          <span className="game08-hud-facility">FACILITY SECTOR: WARD 13</span>
        </div>

        <div className="game08-hud-room-display">
          <h2 className="game08-hud-room-name">{roomName}</h2>
          <span className="game08-hud-room-subtext">{roomSubtext}</span>
        </div>

        <div className="game08-hud-telemetry-row">
          <div className="game08-telemetry-item">
            <span className="game08-telemetry-label">EVIDENCE:</span>
            <span className="game08-telemetry-value">
              <strong>{collectedCount}</strong> / {totalEvidence}
            </span>
          </div>

          <span className="game08-telemetry-divider">|</span>

          <div className="game08-telemetry-item">
            <span className="game08-telemetry-label">CLEARANCE:</span>
            <span
              className="game08-telemetry-value"
              style={{
                color: clearanceLevel >= 3 ? '#38bdf8' : clearanceLevel >= 2 ? '#22c55e' : '#f59e0b',
              }}
            >
              LEVEL {clearanceLevel}
            </span>
          </div>

          <span className="game08-telemetry-divider">|</span>

          <div className="game08-telemetry-item">
            <span className="game08-telemetry-label">CONTRADICTIONS:</span>
            <span className="game08-telemetry-value">
              {resolvedContradictionsCount} / {totalContradictions}
            </span>
          </div>
        </div>
      </div>

      {/* Center Proximity Interaction Prompt */}
      {proximity.promptText && (
        <div
          className={`game08-interaction-prompt ${
            proximity.type === 'locked_door' ? 'prompt-locked' : 'prompt-evidence'
          }`}
        >
          <div className="game08-prompt-badge">
            {proximity.type === 'locked_door' ? 'SECURITY ALERT' : 'INVESTIGATE'}
          </div>
          <div className="game08-prompt-text">{proximity.promptText}</div>
        </div>
      )}
    </div>
  )
}
