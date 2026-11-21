/**
 * Game 08: WARD 13 - Outside-Canvas DOM UI Layer
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 *
 * Coordinates:
 * - Game08Intro (Atmospheric briefing modal)
 * - Game08HUD (Top telemetry header, unlock alerts, and proximity prompts)
 * - Game08Examination (Classified document and clinical CRT modal)
 * - Game08ContradictionBoard (Interactive evidence deduction and comparison interface)
 * - Game08Revelation (Cinematic truth and identity revelation sequences)
 */

import React from 'react'
import {
  useWard13Store,
  ward13Store,
} from './theWard13Store'
import { Game08Intro } from './ui/Game08Intro'
import { Game08HUD } from './ui/Game08HUD'
import { Game08Examination } from './ui/Game08Examination'
import { Game08ContradictionBoard } from './ui/Game08ContradictionBoard'
import { Game08Revelation } from './ui/Game08Revelation'

export const TheWard13UI: React.FC = () => {
  const state = useWard13Store()

  if (!state.isActive) {
    return null
  }

  const isExploringOrExamining =
    state.status === 'exploring' ||
    state.status === 'examining' ||
    state.status === 'comparing_evidence'

  return (
    <>
      {/* 1. Atmospheric Intro Modal */}
      {state.status === 'intro' && (
        <Game08Intro onBegin={ward13Store.beginExploration} />
      )}

      {/* 2. Top Telemetry HUD, Unlock Notification & Proximity Prompts */}
      {isExploringOrExamining && !state.activeRevelation && state.status !== 'comparing_evidence' && (
        <Game08HUD
          currentRoomId={state.currentRoomId}
          collectedCount={state.collectedEvidenceIds.size}
          totalEvidence={12}
          clearanceLevel={state.currentClearanceLevel}
          resolvedContradictionsCount={state.resolvedContradictionKeys.length}
          totalContradictions={3}
          unlockNotification={state.recentUnlockNotification}
          onOpenBoard={ward13Store.openComparisonBoard}
          onDismissNotification={ward13Store.dismissUnlockNotification}
          proximity={
            state.status === 'exploring'
              ? state.proximity
              : {
                  type: null,
                  evidence: null,
                  doorMessage: null,
                  stationName: null,
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

      {/* 4. Interactive Contradiction Comparison Board */}
      {state.status === 'comparing_evidence' && !state.activeRevelation && (
        <Game08ContradictionBoard
          collectedEvidenceIds={state.collectedEvidenceIds}
          resolvedContradictionKeys={state.resolvedContradictionKeys}
          selectedEvidenceA={state.selectedEvidenceA}
          selectedEvidenceB={state.selectedEvidenceB}
          comparisonResult={state.comparisonResult}
          onSelectSlot={ward13Store.selectEvidenceForComparison}
          onClearSelection={ward13Store.clearComparisonSelection}
          onExecuteComparison={ward13Store.executeComparison}
          onLaunchRevelation={ward13Store.startRevelation}
          onClose={ward13Store.closeComparisonBoard}
        />
      )}

      {/* 5. Multi-Stage Cinematic Truth Revelation Screen */}
      {state.activeRevelation && (
        <Game08Revelation
          contradiction={state.activeRevelation.contradiction}
          stage={state.activeRevelation.stage}
          totalStages={state.activeRevelation.totalStages}
          isComplete={state.activeRevelation.isComplete}
          onAdvance={ward13Store.advanceRevelationStage}
          onComplete={ward13Store.completeRevelation}
        />
      )}
    </>
  )
}
