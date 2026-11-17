import React from 'react'
import {
  useMirrorTrialStore,
  mirrorTrialStore,
} from './theMirrorTrialStore'
import { Game07Intro } from './ui/Game07Intro'
import { Game07HUD } from './ui/Game07HUD'
import { Game07Examination } from './ui/Game07Examination'
import { Game07AltarVerdict } from './ui/Game07AltarVerdict'
import { Game07Failure } from './ui/Game07Failure'
import {
  REQUIRED_MIRRORS_COUNT,
  TOTAL_DISCREPANCIES_COUNT,
} from './mirrorTrialTypes'

export const TheMirrorTrialUI: React.FC = () => {
  const state = useMirrorTrialStore()

  if (!state.isActive) {
    return null
  }

  const isExploringOrExamining =
    state.status === 'exploring' ||
    state.status === 'examining' ||
    state.status === 'altar_ready'

  return (
    <>
      {/* 1. Atmospheric Intro Modal */}
      {state.status === 'intro' && (
        <Game07Intro onBegin={mirrorTrialStore.beginExploration} />
      )}

      {/* 2. Top HUD Header & Contextual Prompts */}
      {isExploringOrExamining && (
        <Game07HUD
          mirrorsExamined={state.examinedMirrorIds.size}
          totalMirrors={REQUIRED_MIRRORS_COUNT}
          discrepanciesFound={state.discoveredDiscrepancies.size}
          totalDiscrepancies={TOTAL_DISCREPANCIES_COUNT}
          altarUnlocked={state.altarUnlocked}
          proximity={
            state.status !== 'examining'
              ? state.proximity
              : {
                  type: null,
                  mirror: null,
                  artifact: null,
                  isNearAltar: false,
                  promptText: null,
                }
          }
        />
      )}

      {/* 3. Examination Modal: Physical vs Reflected Comparison & Inscription */}
      {state.status === 'examining' && (
        <Game07Examination
          mirror={state.activeExaminationMirror}
          isExaminingAltar={state.isExaminingAltar}
          altarUnlocked={state.altarUnlocked}
          mirrorsExaminedCount={state.examinedMirrorIds.size}
          discrepanciesCount={state.discoveredDiscrepancies.size}
          onClose={mirrorTrialStore.closeExamination}
        />
      )}

      {/* 4. Altar Verdict Interface & Decision Transition */}
      {(state.status === 'altar_verdict' ||
        state.status === 'verdict_transition') && (
        <Game07AltarVerdict
          isTransitioning={state.status === 'verdict_transition'}
          onSubmit={mirrorTrialStore.submitVerdict}
          onClose={mirrorTrialStore.closeAltarVerdict}
        />
      )}

      {/* 5. Non-Graphic Horror Screen Distortion & Blackout during Failure Cinematic */}
      {state.status === 'failure_cinematic' && (
        <div
          className="game07-failure-cinematic-overlay"
          id="game07-failure-cinematic-dom"
        >
          <div className="game07-failure-glitch-pulse" />
          <div className="game07-failure-vignette" />
        </div>
      )}

      {/* 6. Failure Screen */}
      {state.status === 'failed' && (
        <Game07Failure onRestart={mirrorTrialStore.restartTrial} />
      )}
    </>
  )
}
