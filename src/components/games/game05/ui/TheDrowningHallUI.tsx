import React from 'react'
import {
  useDrowningHallStore,
  drowningHallStore,
} from '../theDrowningHallStore'
import { Game05Intro } from './Game05Intro'

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
    </>
  )
}
