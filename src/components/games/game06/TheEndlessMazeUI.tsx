import React from 'react'
import {
  useEndlessMazeStore,
  endlessMazeStore,
} from './theEndlessMazeStore'
import { Game06Intro } from './ui/Game06Intro'
import { Game06HUD } from './ui/Game06HUD'
import { Game06Examination } from './ui/Game06Examination'
import { REQUIRED_CLUES_COUNT_G06 } from './endlessMazeTypes'

export const TheEndlessMazeUI: React.FC = () => {
  const state = useEndlessMazeStore()

  if (!state.isActive) {
    return null
  }

  const isExploringOrExamining =
    state.status === 'exploring' ||
    state.status === 'examining' ||
    state.status === 'maze_shifting'

  return (
    <>
      {state.status === 'intro' && (
        <Game06Intro onBegin={endlessMazeStore.beginExploration} />
      )}

      {isExploringOrExamining && (
        <Game06HUD
          cluesFound={state.examinedIds.size}
          totalClues={REQUIRED_CLUES_COUNT_G06}
          nearestClue={
            state.status !== 'examining' && state.status !== 'maze_shifting'
              ? state.nearestClue
              : null
          }
          examinedIds={state.examinedIds}
          shiftNotice={state.shiftNotice}
        />
      )}

      {/* Subtle Horror Vignette & Flicker Overlay during Labyrinth Shifting */}
      {state.isShifting && (
        <div className="game06-shift-flicker-overlay" />
      )}

      {state.status === 'examining' && state.activeClue && (
        <Game06Examination
          item={state.activeClue}
          onClose={endlessMazeStore.closeExamination}
        />
      )}
    </>
  )
}
