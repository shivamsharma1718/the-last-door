import React from 'react'
import type {
  DrowningHallObject,
  ValveModel,
  ValveId,
} from '../drowningHallTypes'
import {
  isWaterWarning,
  isWaterCritical,
  getNextExpectedValve,
} from '../drowningHallLogic'

export interface Game05HUDProps {
  objectsFound?: number
  totalObjects?: number
  waterLevel?: number
  waterActive?: boolean
  activatedValves?: ValveId[]
  isDrainageComplete?: boolean
  sequenceError?: string | null
  nearestItem?: DrowningHallObject | null
  nearestValve?: ValveModel | null
}

const VALVE_LABELS: Record<ValveId, string> = {
  valve_1: 'VALVE 1',
  valve_2: 'VALVE 2',
  valve_3: 'VALVE 3',
}

export const Game05HUD: React.FC<Game05HUDProps> = ({
  objectsFound = 0,
  totalObjects = 4,
  waterLevel = 0,
  activatedValves = [],
  isDrainageComplete = false,
  sequenceError = null,
  nearestItem = null,
  nearestValve = null,
}) => {
  const isInvestigationComplete = objectsFound >= totalObjects
  const isWarning = isWaterWarning(waterLevel)
  const isCritical = isWaterCritical(waterLevel)
  const nextExpected = getNextExpectedValve(activatedValves)
  const nextValveLabel = nextExpected ? VALVE_LABELS[nextExpected] : 'COMPLETE'

  return (
    <div className="game05-hud" id="game05-hud-dom">
      <div className="game05-hud-header">
        <span className="game05-hud-title">THE DROWNING HALL</span>

        {isDrainageComplete ? (
          <span className="game05-hud-subtitle game05-hud-drained">
            DRAINAGE SYSTEM ACTIVE • WATER LEVEL STABILIZED
          </span>
        ) : isCritical ? (
          <span className="game05-hud-subtitle game05-hud-critical">
            CRITICAL WATER LEVEL
          </span>
        ) : isWarning ? (
          <span className="game05-hud-subtitle game05-hud-warning">
            WARNING: THE WATER IS RISING.
          </span>
        ) : (
          <span className="game05-hud-subtitle">THE WATER IS RISING.</span>
        )}

        {isInvestigationComplete ? (
          <span className="game05-hud-complete">INVESTIGATION COMPLETE</span>
        ) : (
          <span className="game05-hud-counter">
            OBJECTS FOUND:{' '}
            <strong className="game05-counter-highlight">
              {objectsFound} / {totalObjects}
            </strong>
          </span>
        )}

        {/* Water Progression Gauge & Valve Objectives (Active after Investigation) */}
        {isInvestigationComplete && (
          <div className="game05-water-panel">
            <div className="game05-water-meta">
              <span className="game05-water-label">WATER LEVEL:</span>
              <span
                className={`game05-water-value ${
                  isDrainageComplete
                    ? 'game05-water-stabilized'
                    : isCritical
                    ? 'game05-water-critical-val'
                    : isWarning
                    ? 'game05-water-warning-val'
                    : ''
                }`}
              >
                {Math.floor(waterLevel)}%
              </span>
            </div>

            <div className="game05-water-bar-track">
              <div
                className={`game05-water-bar-fill ${
                  isDrainageComplete
                    ? 'game05-bar-stabilized'
                    : isCritical
                    ? 'game05-bar-critical'
                    : isWarning
                    ? 'game05-bar-warning'
                    : ''
                }`}
                style={{ width: `${Math.min(100, Math.max(0, waterLevel))}%` }}
              />
            </div>

            {/* Valve Sequence Tracker */}
            <div className="game05-valve-sequence-hud">
              {isDrainageComplete ? (
                <span className="game05-sequence-complete-text">
                  SEQUENCE COMPLETE • EMERGENCY DRAIN OPEN
                </span>
              ) : (
                <div className="game05-valve-tracker">
                  <span className="game05-valve-next-hint">
                    NEXT VALVE:{' '}
                    <strong className="game05-valve-highlight">
                      {nextValveLabel}
                    </strong>
                  </span>
                  <div className="game05-valve-steps">
                    <span
                      className={`game05-step-badge ${
                        activatedValves.includes('valve_1')
                          ? 'game05-step-active'
                          : ''
                      }`}
                    >
                      VALVE 1
                    </span>
                    <span className="game05-step-arrow">→</span>
                    <span
                      className={`game05-step-badge ${
                        activatedValves.includes('valve_3')
                          ? 'game05-step-active'
                          : ''
                      }`}
                    >
                      VALVE 3
                    </span>
                    <span className="game05-step-arrow">→</span>
                    <span
                      className={`game05-step-badge ${
                        activatedValves.includes('valve_2')
                          ? 'game05-step-active'
                          : ''
                      }`}
                    >
                      VALVE 2
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sequence Error Notification Banner */}
      {sequenceError && (
        <div className="game05-sequence-error-banner" id="game05-error-banner-dom">
          <span className="game05-error-tag">INCORRECT SEQUENCE</span>
          <span className="game05-error-text">THE VALVES MUST BE OPENED IN ORDER.</span>
        </div>
      )}

      {/* Dynamic Proximity Prompt */}
      {nearestValve && !isDrainageComplete && (
        <div className="game05-interaction-prompt" id="game05-valve-prompt-dom">
          <div className="game05-prompt-target">[{nearestValve.label}]</div>
          <div className="game05-prompt-action">
            <span className="key-badge">E</span> OPEN
          </div>
        </div>
      )}

      {!nearestValve && nearestItem && (
        <div className="game05-interaction-prompt" id="game05-prompt-dom">
          <div className="game05-prompt-target">[{nearestItem.title}]</div>
          <div className="game05-prompt-action">
            <span className="key-badge">E</span> EXAMINE
          </div>
        </div>
      )}
    </div>
  )
}
