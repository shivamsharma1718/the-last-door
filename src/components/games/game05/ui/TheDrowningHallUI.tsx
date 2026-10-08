import React from 'react'
import {
  useDrowningHallStore,
  drowningHallStore,
} from '../theDrowningHallStore'
import { Game05Intro } from './Game05Intro'
import { Game05HUD } from './Game05HUD'
import { Game05Examination } from './Game05Examination'
import { Game05Failure } from './Game05Failure'
import { Game05Victory, Game05VictoryCinematic } from './Game05Victory'

export const TheDrowningHallUI: React.FC = () => {
  const state = useDrowningHallStore()

  if (!state.isActive) {
    return null
  }

  const isExploringOrExamining =
    state.status === 'exploring' ||
    state.status === 'water_warning' ||
    state.status === 'water_critical' ||
    state.status === 'examining'

  return (
    <>
      {state.status === 'intro' && (
        <Game05Intro onBegin={drowningHallStore.beginExploration} />
      )}

      {isExploringOrExamining && (
        <Game05HUD
          objectsFound={state.examinedIds.size}
          totalObjects={4}
          waterLevel={state.waterLevel}
          waterActive={state.waterActive}
          activatedValves={state.activatedValves}
          isDrainageComplete={state.isDrainageComplete}
          isNearExit={state.isNearExit}
          sequenceError={state.sequenceError}
          nearestItem={state.status !== 'examining' ? state.nearestItem : null}
          nearestValve={state.status !== 'examining' ? state.nearestValve : null}
        />
      )}

      {state.status === 'examining' && state.activeItem && (
        <Game05Examination
          item={state.activeItem}
          onClose={drowningHallStore.closeExamination}
        />
      )}

      {(state.status === 'failing' || state.status === 'failed') && (
        <Game05Failure onRestart={drowningHallStore.restart} />
      )}

      {state.status === 'victory_cinematic' && (
        <Game05VictoryCinematic
          onSequenceComplete={drowningHallStore.triggerVictory}
        />
      )}

      {state.status === 'victory' && (
        <Game05Victory onContinue={drowningHallStore.continueNextTrial} />
      )}
    </>
  )
}
