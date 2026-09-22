import React from 'react'
import { useWatcherStore, watcherStore } from '../theWatcherStore'
import { Game04Intro } from './Game04Intro'
import { Game04HUD } from './Game04HUD'
import { Game04Examination } from './Game04Examination'
import { Game04Alert } from './Game04Alert'
import { Game04Failure } from './Game04Failure'
import { Game04Victory, Game04VictoryCinematic } from './Game04Victory'

export const TheWatcherUI: React.FC = () => {
  const state = useWatcherStore()

  if (!state.isActive) {
    return null
  }

  return (
    <>
      {state.status === 'intro' && (
        <Game04Intro onBegin={watcherStore.beginExploration} />
      )}

      {state.status === 'exploring' && (
        <Game04HUD
          objectsFound={state.examinedIds.size}
          totalObjects={4}
          isExitUnlocked={state.exitUnlocked}
          isNearExit={state.isNearExit}
          nearestItem={state.nearestItem}
        />
      )}

      {state.status === 'examining' && state.activeItem && (
        <Game04Examination
          item={state.activeItem}
          onClose={watcherStore.closeExamination}
        />
      )}

      {(state.status === 'watcher_alert' || state.status === 'failing') && (
        <Game04Alert
          status={state.status}
          onFailing={watcherStore.triggerFailing}
          onFailed={watcherStore.triggerFailed}
        />
      )}

      {state.status === 'failed' && (
        <Game04Failure onRestart={watcherStore.restart} />
      )}

      {state.status === 'victory_cinematic' && (
        <Game04VictoryCinematic
          onSequenceComplete={watcherStore.triggerVictory}
        />
      )}

      {state.status === 'victory' && (
        <Game04Victory onContinue={watcherStore.continueNextTrial} />
      )}
    </>
  )
}
