/**
 * Game 10: THE FORGOTTEN GAME - Reactive Game Store
 * Theme: Memory Manipulation, Psychological Horror, Distorted History, Gaslighting & Free Will.
 * Central Message: "YOU REMEMBER WINNING. THE SYSTEM REMEMBERS OTHERWISE."
 *
 * Implements useSyncExternalStore pattern for clean reactivity outside Canvas.
 * Manages:
 * - Stage progression state machine (Stages 0–6)
 * - Memory investigation, evidence discovery and verification
 * - Memory decision evaluation and integrity scoring
 * - Final judgment unlocked, selection and immutable confirmation
 * - Safe reset strictly isolated to Game 10
 */

import { useSyncExternalStore } from 'react'
import type {
  MemoryId,
  EvidenceId,
  PlayerDecision,
  FinalDecisionChoice,
  Game10Ending,
  Game10State,
  Game10AreaId,
  Game10InteractableObject,
  Game10ProximityState,
  Game10InteractionStatus,
} from './game10Types'
import { INITIAL_GAME10_POS } from './game10Types'
import { getForgottenGameArea } from './TheForgottenGameArena'
import { findNearestInteractable } from './interactions/game10InteractionRegistry'
import {
  createInitialGame10State,
  discoverEvidence,
  verifyEvidence,
  evaluateMemoryDecision,
  isFinalJudgmentUnlocked,
  enterFinalDecision,
  selectFinalDecision,
  cancelFinalDecisionSelection,
  confirmFinalDecision,
  resetGame10State,
} from './forgottenGameLogic'

// ---------------------------------------------------------------------------
// 1. Store State Interface
// ---------------------------------------------------------------------------

export interface ForgottenGameStoreState extends Game10State {
  isActive: boolean
  lastMessage: string | null
  currentAreaId: Game10AreaId
  playerPosition: { x: number; z: number }
  interactionStatus: Game10InteractionStatus
  proximity: Game10ProximityState
  inspectingObject: Game10InteractableObject | null
}

// ---------------------------------------------------------------------------
// 2. Store Implementation
// ---------------------------------------------------------------------------

class ForgottenGameStore {
  private state: ForgottenGameStoreState
  private listeners: Set<() => void> = new Set()
  private onCompleteCallback?: () => void

  constructor() {
    this.state = this.buildInitialState()
  }

  private buildInitialState(): ForgottenGameStoreState {
    const base = createInitialGame10State()
    return {
      ...base,
      isActive: false,
      lastMessage: null,
      currentAreaId: 'hall_of_mirrors',
      playerPosition: { x: INITIAL_GAME10_POS[0], z: INITIAL_GAME10_POS[2] },
      interactionStatus: 'exploring',
      proximity: {
        targetId: null,
        targetName: null,
        distance: Infinity,
        promptText: null,
        activeObject: null,
      },
      inspectingObject: null,
    }
  }

  // --- External Store Subscription Hooks ---
  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public getSnapshot = (): ForgottenGameStoreState => {
    return this.state
  }

  private emitChange(): void {
    this.listeners.forEach((listener) => listener())
  }

  // --- Lifecycle Management ---
  public setActive(active: boolean): void {
    if (this.state.isActive === active) return
    this.state = {
      ...this.state,
      isActive: active,
    }
    this.emitChange()
  }

  public setOnComplete(cb?: () => void): void {
    this.onCompleteCallback = cb
  }

  public initFreshRun(): void {
    const base = this.buildInitialState()
    this.state = {
      ...base,
      isActive: true,
      currentAreaId: 'hall_of_mirrors',
      playerPosition: { x: INITIAL_GAME10_POS[0], z: INITIAL_GAME10_POS[2] },
      interactionStatus: 'exploring',
      proximity: {
        targetId: null,
        targetName: null,
        distance: Infinity,
        promptText: null,
        activeObject: null,
      },
      inspectingObject: null,
    }
    this.emitChange()
  }

  // --- Spatial Navigation, Area Classification & Proximity ---
  public updatePlayerPosition(pos: { x: number; z: number }): void {
    const area = getForgottenGameArea(pos.x, pos.z)
    const posChanged =
      this.state.playerPosition.x !== pos.x || this.state.playerPosition.z !== pos.z
    const areaChanged = this.state.currentAreaId !== area

    let proximityChanged = false
    let nextProximity = this.state.proximity

    if (this.state.interactionStatus === 'exploring') {
      const { nearest, distance } = findNearestInteractable(pos)
      if (nearest) {
        if (
          this.state.proximity.targetId !== nearest.id ||
          Math.abs(this.state.proximity.distance - distance) > 0.001
        ) {
          nextProximity = {
            targetId: nearest.id,
            targetName: nearest.name,
            distance,
            promptText: `[E] Investigate — ${nearest.name}`,
            activeObject: nearest,
          }
          proximityChanged = true
        }
      } else {
        if (this.state.proximity.targetId !== null) {
          nextProximity = {
            targetId: null,
            targetName: null,
            distance: Infinity,
            promptText: null,
            activeObject: null,
          }
          proximityChanged = true
        }
      }
    }

    if (!posChanged && !areaChanged && !proximityChanged) {
      return
    }

    this.state = {
      ...this.state,
      playerPosition: pos,
      currentAreaId: area,
      proximity: nextProximity,
    }
    this.emitChange()
  }

  // --- Evidence Discovery & Verification ---
  public discoverEvidence(evidenceId: EvidenceId): boolean {
    const result = discoverEvidence(this.state, evidenceId)
    if (!result.isNew || result.state === this.state) {
      return false
    }
    this.state = {
      ...this.state,
      ...result.state,
    }
    this.emitChange()
    return true
  }

  public verifyEvidence(evidenceId: EvidenceId): { success: boolean; message: string } {
    const result = verifyEvidence(this.state, evidenceId)
    if (!result.success || result.state === this.state) {
      return { success: false, message: result.message }
    }
    this.state = {
      ...this.state,
      ...result.state,
      lastMessage: result.message,
    }
    this.emitChange()
    return { success: true, message: result.message }
  }

  // --- Memory Decision Evaluation ---
  public submitMemoryDecision(
    memoryId: MemoryId,
    decision: PlayerDecision
  ): { success: boolean; isCorrect: boolean; message: string } {
    const result = evaluateMemoryDecision(this.state, memoryId, decision)
    if (!result.success || result.state === this.state) {
      return { success: false, isCorrect: false, message: result.message }
    }
    this.state = {
      ...this.state,
      ...result.state,
      lastMessage: result.message,
    }
    this.emitChange()
    return { success: true, isCorrect: result.isCorrect, message: result.message }
  }

  // --- Final Judgment & Decisions ---
  public unlockFinalJudgment(): boolean {
    if (!isFinalJudgmentUnlocked(this.state)) return false
    if (this.state.currentStage === 'judgment_unlocked') return true
    this.state = {
      ...this.state,
      currentStage: 'judgment_unlocked',
    }
    this.emitChange()
    return true
  }

  public enterFinalDecision(): boolean {
    const next = enterFinalDecision(this.state)
    if (next === this.state || next.currentStage === this.state.currentStage) return false
    this.state = {
      ...this.state,
      ...next,
    }
    this.emitChange()
    return true
  }

  public selectFinalDecision(choice: FinalDecisionChoice): boolean {
    const next = selectFinalDecision(this.state, choice)
    if (next === this.state || next.selectedFinalChoice === this.state.selectedFinalChoice) {
      return false
    }
    this.state = {
      ...this.state,
      ...next,
    }
    this.emitChange()
    return true
  }

  public cancelFinalDecision(): boolean {
    const next = cancelFinalDecisionSelection(this.state)
    if (
      next === this.state ||
      (this.state.selectedFinalChoice === null && this.state.finalDecision === null)
    ) {
      return false
    }
    this.state = {
      ...this.state,
      ...next,
    }
    this.emitChange()
    return true
  }

  public confirmFinalDecision(choice: FinalDecisionChoice): {
    success: boolean
    ending: Game10Ending
    isVictory: boolean
    message: string
  } {
    const result = confirmFinalDecision(this.state, choice)
    if (!result.success || result.state === this.state) {
      return {
        success: false,
        ending: result.ending,
        isVictory: result.isVictory,
        message: result.message,
      }
    }
    this.state = {
      ...this.state,
      ...result.state,
      lastMessage: result.message,
    }
    this.emitChange()
    return {
      success: true,
      ending: result.ending,
      isVictory: result.isVictory,
      message: result.message,
    }
  }

  // --- Investigation & Interactions (Step 2.3) ---
  public interact(): boolean {
    if (this.state.interactionStatus !== 'exploring' || !this.state.proximity.activeObject) {
      return false
    }

    this.state = {
      ...this.state,
      interactionStatus: 'inspecting',
      inspectingObject: this.state.proximity.activeObject,
    }
    this.emitChange()
    return true
  }

  public closeInspection(): boolean {
    if (this.state.interactionStatus !== 'inspecting') {
      return false
    }

    const { nearest, distance } = findNearestInteractable(this.state.playerPosition)
    const nextProximity: Game10ProximityState = nearest
      ? {
          targetId: nearest.id,
          targetName: nearest.name,
          distance,
          promptText: `[E] Investigate — ${nearest.name}`,
          activeObject: nearest,
        }
      : {
          targetId: null,
          targetName: null,
          distance: Infinity,
          promptText: null,
          activeObject: null,
        }

    this.state = {
      ...this.state,
      interactionStatus: 'exploring',
      inspectingObject: null,
      proximity: nextProximity,
    }
    this.emitChange()
    return true
  }

  // --- Progression to Game 11 ---
  public proceedToGame11 = (): void => {
    if (this.onCompleteCallback) {
      this.onCompleteCallback()
    }
  }

  // --- Clean Reset ---
  public resetGame = (): void => {
    const base = resetGame10State(this.state)
    this.state = {
      ...base,
      isActive: true,
      lastMessage: null,
      currentAreaId: 'hall_of_mirrors',
      playerPosition: { x: INITIAL_GAME10_POS[0], z: INITIAL_GAME10_POS[2] },
      interactionStatus: 'exploring',
      proximity: {
        targetId: null,
        targetName: null,
        distance: Infinity,
        promptText: null,
        activeObject: null,
      },
      inspectingObject: null,
    }
    this.emitChange()
  }
}

export const forgottenGameStore = new ForgottenGameStore()

export function useForgottenGameStore(): ForgottenGameStoreState {
  return useSyncExternalStore(
    forgottenGameStore.subscribe,
    forgottenGameStore.getSnapshot
  )
}
