import React, { useEffect, useState, useCallback, useMemo } from 'react'
import type { ContradictionPair } from '../ward13Types'

export interface Game08RevelationProps {
  contradiction: ContradictionPair
  stage: number
  totalStages: number
  isComplete: boolean
  onAdvance: () => void
  onComplete: () => void
}

export const Game08Revelation: React.FC<Game08RevelationProps> = ({
  contradiction,
  stage,
  totalStages,
  isComplete,
  onAdvance,
  onComplete,
}) => {
  const [flickerActive, setFlickerActive] = useState<boolean>(false)

  // Revelation narrative sequences per contradiction key
  const sequenceLines = useMemo(() => {
    switch (contradiction.key) {
      case 'contradiction_1_physiology':
        return [
          'THE BODY WAS NOT SLEEPING.',
          'THE RECORDS SAID IT WAS.',
          'THEY WROTE THE OUTCOME BEFORE IT HAPPENED.',
        ]
      case 'contradiction_2_autopsy_fraud':
        return [
          'THEY DECLARED YOU DEAD.',
          'BEFORE YOU HAD EVEN ESCAPED.',
          'THE AUTOPSY WAS ALREADY SIGNED.',
        ]
      case 'contradiction_3_identity_erasure':
        return [
          'PATIENT 404.',
          'THAT NAME DOES NOT BELONG TO YOU.',
          'YOU WERE NOT ADMITTED.',
          'YOU BUILT THIS PLACE.',
          'CO-DIRECTOR. PROJECT MORPHEUS.',
          'DR. VANCE ERASED YOUR IDENTITY.',
        ]
      default:
        return [contradiction.claimA, contradiction.claimB, contradiction.resolvedTruth]
    }
  }, [contradiction])

  const currentLine =
    stage <= sequenceLines.length ? sequenceLines[stage - 1] : sequenceLines[sequenceLines.length - 1]

  // Subtle screen flicker when stage advances
  useEffect(() => {
    setFlickerActive(true)
    const t = setTimeout(() => setFlickerActive(false), 300)
    return () => clearTimeout(t)
  }, [stage])

  // Timed auto-advance if user does not click
  useEffect(() => {
    if (isComplete) return

    const timer = setTimeout(() => {
      onAdvance()
    }, 3800)

    return () => clearTimeout(timer)
  }, [stage, isComplete, onAdvance])

  // Handle keyboard advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        e.preventDefault()
        e.stopPropagation()
        if (!isComplete) {
          onAdvance()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isComplete, onAdvance])

  const handleReturnToFacility = useCallback(() => {
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
    onComplete()
  }, [onComplete])

  const getVerdictLabel = () => {
    switch (contradiction.key) {
      case 'contradiction_1_physiology':
        return 'PHYSIOLOGY RECORDS: FALSIFIED'
      case 'contradiction_2_autopsy_fraud':
        return 'AUTOPSY RECORDS: PREDETERMINED'
      case 'contradiction_3_identity_erasure':
        return 'IDENTITY RECORDS: ALTERED'
      default:
        return 'RECORD CONTRADICTION RECONCILED'
    }
  }

  const getContradictionNumber = () => {
    switch (contradiction.key) {
      case 'contradiction_1_physiology':
        return '01'
      case 'contradiction_2_autopsy_fraud':
        return '02'
      case 'contradiction_3_identity_erasure':
        return '03'
      default:
        return 'XX'
    }
  }

  const getUnlockedSectorSummary = () => {
    switch (contradiction.key) {
      case 'contradiction_1_physiology':
        return 'SECTORS UNSEALED: ISOLATION CELL & OBSERVATION WING'
      case 'contradiction_2_autopsy_fraud':
        return 'SECTOR UNSEALED: MEDICAL RECORDS ARCHIVE'
      case 'contradiction_3_identity_erasure':
        return 'SECTOR UNSEALED: WARD 13 FINAL EXIT AIRLOCK'
      default:
        return 'ADDITIONAL FACILITY DOORS UNSEALED'
    }
  }

  return (
    <div
      className={`game08-revelation-overlay ${flickerActive ? 'flicker' : ''}`}
      onClick={() => {
        if (!isComplete) onAdvance()
      }}
    >
      <div className="revelation-scanlines" />
      <div className="revelation-crt-glow" />

      {!isComplete ? (
        // Multi-Stage Cinematic Text Sequence
        <div className="revelation-content">
          <div className="revelation-header-tag">
            <span>NEURAL RECONSTRUCTION // STAGE {stage} OF {totalStages}</span>
          </div>

          <div className="revelation-quote-container">
            <h1 className="revelation-quote-text">{currentLine}</h1>
          </div>

          <div className="revelation-progress-bar-container">
            <div
              className="revelation-progress-bar"
              style={{ width: `${(stage / totalStages) * 100}%` }}
            />
          </div>

          <div className="revelation-tap-hint">
            CLICK SCREEN OR PRESS [SPACE] TO ADVANCE
          </div>
        </div>
      ) : (
        // Final Summary Card after sequence completes
        <div
          className="revelation-summary-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="summary-stamp">AUDIT RESOLUTION COMPLETE</div>

          <h2 className="summary-title">
            CONTRADICTION {getContradictionNumber()} RESOLVED
          </h2>

          <div className="summary-verdict-banner">
            {getVerdictLabel()}
          </div>

          <div className="summary-divider" />

          <p className="summary-truth-text">
            “{contradiction.resolvedTruth}”
          </p>

          <div className="summary-clearance-award">
            <div className="clearance-badge">
              SECURITY CLEARANCE LEVEL {contradiction.unlockedClearance} GRANTED
            </div>
            <div className="sector-unseal-notice">
              {getUnlockedSectorSummary()}
            </div>
          </div>

          <button
            type="button"
            className="revelation-return-button"
            onClick={handleReturnToFacility}
          >
            RETURN TO FACILITY
          </button>
        </div>
      )}
    </div>
  )
}
