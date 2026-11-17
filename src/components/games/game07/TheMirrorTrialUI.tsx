import React from 'react'
import {
  useMirrorTrialStore,
  mirrorTrialStore,
} from './theMirrorTrialStore'
import { Game07Intro } from './ui/Game07Intro'
import { Game07HUD } from './ui/Game07HUD'
import { Game07Examination } from './ui/Game07Examination'
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
    </>
  )
}
