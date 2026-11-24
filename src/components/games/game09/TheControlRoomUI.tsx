/**
 * Game 09: THE CONTROL ROOM - Root Outside-Canvas DOM UI Coordinator
 * Mounts outside Canvas in App.tsx.
 *
 * Coordinates:
 * - Game09Intro (Cinematic atmospheric 7-phase intro)
 * - Game09HUD (Telemetry bar, directive status sidebar, proximity prompt)
 * - Game09OverseerDialogue (Dynamic broadcast subtitle overlay)
 * - Game09DirectivePanel (Console inspection & verification decision modal)
 * - Game09Examination (Detailed 8-instrument physical telemetry inspection modal)
 * - Game09EvidenceBoard (Comprehensive 8-slot evidence dossier board)
 * - Game09CoreAccessMessage (Core unlocked notification banner)
 */

import React from 'react'
import {
  useControlRoomStore,
  controlRoomStore,
} from './theControlRoomStore'
import { Game09Intro } from './ui/Game09Intro'
import { Game09HUD } from './ui/Game09HUD'
import { Game09OverseerDialogue } from './ui/Game09OverseerDialogue'
import { Game09DirectivePanel } from './ui/Game09DirectivePanel'
import { Game09Examination } from './ui/Game09Examination'
import { Game09EvidenceBoard } from './ui/Game09EvidenceBoard'
import { Game09CoreAccessMessage } from './ui/Game09CoreAccessMessage'
import { Game09CoreCinematic } from './ui/Game09CoreCinematic'
import { Game09FinalDecision } from './ui/Game09FinalDecision'
import { Game09IntegrationEnding } from './ui/Game09IntegrationEnding'
import { Game09OverloadEnding } from './ui/Game09OverloadEnding'
import { Game09Victory } from './ui/Game09Victory'
import { TOTAL_INSTRUCTIONS_COUNT } from './controlRoomTypes'
import { CONTROL_ROOM_EVIDENCE } from './controlRoomLogic'

export const TheControlRoomUI: React.FC = () => {
  const state = useControlRoomStore()

  if (!state.isActive) {
    return null
  }

  const isExploringOrActive =
    state.status === 'exploring' ||
    state.status === 'examining_evidence' ||
    state.status === 'verifying_instruction'

  return (
    <>
      {/* 1. Cinematic 7-Phase Atmospheric Intro */}
      {state.status === 'intro' && (
        <Game09Intro onBegin={controlRoomStore.beginExploration} />
      )}

      {/* 2. Top Telemetry Bar & Directive Sidebar HUD */}
      {isExploringOrActive && (
        <Game09HUD
          trust={state.trust}
          collectedEvidenceCount={state.collectedEvidenceIds.size}
          totalEvidenceCount={CONTROL_ROOM_EVIDENCE.length}
          verifiedDirectivesCount={controlRoomStore.getResolvedDirectivesCount()}
          totalDirectivesCount={TOTAL_INSTRUCTIONS_COUNT}
          instructionStates={state.instructionStates}
          collectedEvidenceIds={state.collectedEvidenceIds}
          proximity={
            state.status === 'exploring'
              ? state.proximity
              : {
                  type: null,
                  evidence: null,
                  instruction: null,
                  distance: 999,
                  promptText: null,
                }
          }
          onOpenEvidenceBoard={controlRoomStore.openEvidenceBoard}
        />
      )}

      {/* 3. Dynamic Overseer Dialogue Broadcast Overlay */}
      {isExploringOrActive && (
        <Game09OverseerDialogue
          dialogue={state.overseerDialogue}
          onDismiss={() => {}}
        />
      )}

      {/* 4. Core Access Available Notification Banner */}
      {state.isCoreMessageVisible && (
        <Game09CoreAccessMessage
          onDismiss={controlRoomStore.dismissCoreMessage}
        />
      )}

      {/* 5. Physical Evidence Examination Modal */}
      {state.status === 'examining_evidence' && state.activeEvidence && (
        <Game09Examination
          evidence={state.activeEvidence}
          isCollected={state.collectedEvidenceIds.has(state.activeEvidence.id)}
          onCollect={controlRoomStore.collectCurrentEvidence}
          onClose={controlRoomStore.closeExamination}
        />
      )}

      {/* 6. Directive Inspection & Decision Panel */}
      {state.status === 'verifying_instruction' && state.activeInstruction && (
        <Game09DirectivePanel
          instruction={state.activeInstruction}
          instructionStatus={
            state.instructionStates[state.activeInstruction.id] || 'pending'
          }
          collectedEvidenceIds={state.collectedEvidenceIds}
          lastResolutionSummary={state.lastResolutionSummary}
          onVerify={controlRoomStore.verifyCurrentDirective}
          onBlindObey={controlRoomStore.blindObeyCurrentDirective}
          onClose={controlRoomStore.closeDirectivePanel}
        />
      )}

      {/* 7. Comprehensive Evidence Dossier Board */}
      {state.isEvidenceBoardOpen && (
        <Game09EvidenceBoard
          collectedEvidenceIds={state.collectedEvidenceIds}
          onSelectEvidence={controlRoomStore.openEvidenceFromBoard}
          onClose={controlRoomStore.closeEvidenceBoard}
        />
      )}

      {/* 8. Master Core Awakening Sequence */}
      {state.coreState === 'awakening' && (
        <Game09CoreCinematic
          onComplete={controlRoomStore.openFinalDecisionModal}
        />
      )}

      {/* 9. Final Decision Terminal Modal */}
      {state.coreState === 'decision_open' && (
        <Game09FinalDecision
          onConfirm={controlRoomStore.confirmFinalDecision}
          onClose={controlRoomStore.closeFinalDecisionModal}
        />
      )}

      {/* 10. Option A Ending: System Integration (Failure) */}
      {state.coreState === 'ending_a' && (
        <Game09IntegrationEnding onRestart={controlRoomStore.resetGame} />
      )}

      {/* 11. Option B Ending: Thermal Overload (Failure) */}
      {state.coreState === 'ending_b' && (
        <Game09OverloadEnding onRestart={controlRoomStore.resetGame} />
      )}

      {/* 12. Option C Ending: Canonical Victory Sequence */}
      {state.coreState === 'victory' && (
        <Game09Victory onContinue={controlRoomStore.proceedToGame10} />
      )}
    </>
  )
}
