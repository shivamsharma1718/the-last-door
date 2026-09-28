import React from 'react'
import {
  useDrowningHallStore,
  drowningHallStore,
} from '../theDrowningHallStore'
import { Game05Intro } from './Game05Intro'
import { Game05HUD } from './Game05HUD'
import { Game05Examination } from './Game05Examination'

export const TheDrowningHallUI: React.FC = () => {
  const state = useDrowningHallStore()

  if (!state.isActive) {
    return null
  }

  return (
    <>
      {state.status === 'intro' && (
        <Game05Intro onBegin={drowningHallStore.beginExploration} />
      )}

      {(state.status === 'exploring' || state.status === 'examining') && (
        <Game05HUD
          objectsFound={state.examinedIds.size}
          totalObjects={4}
          nearestItem={state.status === 'exploring' ? state.nearestItem : null}
        />
      )}

      {state.status === 'examining' && state.activeItem && (
        <Game05Examination
          item={state.activeItem}
          onClose={drowningHallStore.closeExamination}
        />
      )}
    </>
  )
}
