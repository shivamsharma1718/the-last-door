/**
 * Game 08: WARD 13 - Outside-Canvas DOM UI Layer
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Coordinates:
 * - Game08Intro (Atmospheric briefing modal)
 * - Game08HUD (Top telemetry header and proximity prompts)
 * - Game08Examination (Classified document and clinical CRT modal)
 */

import React from 'react'
import {
  useWard13Store,
  ward13Store,
} from './theWard13Store'
import { Game08Intro } from './ui/Game08Intro'
import { Game08HUD } from './ui/Game08HUD'
import { Game08Examination } from './ui/Game08Examination'

export const TheWard13UI: React.FC = () => {
  const state = useWard13Store()

  if (!state.isActive) {
    return null
  }

  const isExploringOrExamining =
    state.status === 'exploring' || state.status === 'examining'

  return (
    <>
      {/* 1. Atmospheric Intro Modal */}
      {state.status === 'intro' && (
        <Game08Intro onBegin={ward13Store.beginExploration} />
      )}

      {/* 2. Top Telemetry HUD & Proximity Interaction Prompts */}
      {isExploringOrExamining && (
        <Game08HUD
          currentRoomId={state.currentRoomId}
          collectedCount={state.collectedEvidenceIds.size}
          totalEvidence={12}
          clearanceLevel={state.currentClearanceLevel}
          resolvedContradictionsCount={state.resolvedContradictionKeys.length}
          totalContradictions={3}
          proximity={
            state.status !== 'examining'
              ? state.proximity
              : {
                  type: null,
                  evidence: null,
                  doorMessage: null,
                  promptText: null,
                }
          }
        />
      )}

      {/* 3. Classified Examination Modal */}
      {state.status === 'examining' && state.activeEvidence && (
        <Game08Examination
          evidence={state.activeEvidence}
          isAlreadyCollected={state.collectedEvidenceIds.has(state.activeEvidence.id)}
          onClose={ward13Store.closeExamination}
        />
      )}
    </>
  )
}
