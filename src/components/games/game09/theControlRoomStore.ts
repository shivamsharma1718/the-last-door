/**
 * Game 09: THE CONTROL ROOM - Reactive Game Store
 * Theme: Trust vs Verification, Manipulation, Obedience & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 *
 * Implements useSyncExternalStore pattern for clean reactivity outside Canvas.
 * Manages:
 * - Active lifecycle and Game 09 status state machine
 * - Proximity detection for all 8 physical evidence props and 6 directive consoles
 * - Evidence collection (duplicate-proof)
 * - Directive verification & comparison mechanics
 * - Canonical trust calculation and Overseer AI persona transitions
 * - Overseer broadcast dialogue system
 * - Master Core availability state (5 of 6 verified)
 * - Safe pointer-lock lifecycle management
 * - Full clean reset support
 */

import { useSyncExternalStore } from 'react'
import type {
  Game09Status,
  ControlRoomAreaId,
  InstructionId,
  EvidenceId,
  ControlRoomInstructionDefinition,
  ControlRoomEvidenceDefinition,
  TrustState,
  PlayerVerificationAction,
} from './controlRoomTypes'
import {
  CONSOLE_INTERACTION_THRESHOLD_G09,
  CORE_INTERACTION_THRESHOLD_G09,
  SYSTEM_CORE_POS,
  REQUIRED_VERIFICATIONS_COUNT,
} from './controlRoomTypes'
import {
  createInitialControlRoomState,
  getAreaByPosition,
  getInstructionById,
  getEvidenceById,
  checkOverridePrerequisites,
  verifyInstruction,
  blindObeyInstruction,
  CONTROL_ROOM_INSTRUCTIONS,
  CONTROL_ROOM_EVIDENCE,
} from './controlRoomLogic'

// ---------------------------------------------------------------------------
// 1. Proximity Target & Interaction Interfaces
// ---------------------------------------------------------------------------

export type ProximityTargetType =
  | 'evidence'
  | 'directive_console'
  | 'system_core'
  | null

export interface ControlRoomProximityState {
  type: ProximityTargetType
  evidence: ControlRoomEvidenceDefinition | null
  instruction: ControlRoomInstructionDefinition | null
  distance: number
  promptText: string | null
}

export interface OverseerDialogueState {
  speaker: string
  protocol: string
  message: string
  timestamp: number
}

export interface DirectiveConsoleLocation {
  instructionId: InstructionId
  name: string
  worldPosition: [number, number, number]
  interactionRadius: number
}

// 6 Canonical Directive Console interaction points matching facility sectors
export const DIRECTIVE_CONSOLES: DirectiveConsoleLocation[] = [
  {
    instructionId: 'inst_01_power_cycle',
    name: 'Power Grid Switchgear Cabinet',
    worldPosition: [7.5, 1.2, -5.5],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
  {
    instructionId: 'inst_02_surveillance_feed',
    name: 'Master Surveillance Array',
    worldPosition: [-9.5, 1.2, 2.8],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
  {
    instructionId: 'inst_03_biometric_auth',
    name: 'Central Command Dais',
    worldPosition: [-0.8, 1.1, 2.5],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
  {
    instructionId: 'inst_04_comms_blackout',
    name: 'Telemetry Communications Station',
    worldPosition: [9.5, 1.2, 1.5],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
  {
    instructionId: 'inst_05_archive_purge',
    name: 'Logic Vault Reel Deck',
    worldPosition: [-7.5, 1.2, -5.5],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
  {
    instructionId: 'inst_06_firewall_handshake',
    name: 'Central AI Core Override Console',
    worldPosition: [0, 1.1, -6.6],
    interactionRadius: CONSOLE_INTERACTION_THRESHOLD_G09,
  },
]

// ---------------------------------------------------------------------------
// 2. Control Room Store State Interface
// ---------------------------------------------------------------------------

export interface ControlRoomStoreState {
  isActive: boolean
  status: Game09Status
  currentAreaId: ControlRoomAreaId
  trust: TrustState
  collectedEvidenceIds: Set<EvidenceId>
  instructionStates: Record<InstructionId, string>
  verifiedInstructionIds: InstructionId[]
  exposedDeceptionIds: InstructionId[]
  isCoreOverrideReady: boolean

  // Interactive Panel States
  proximity: ControlRoomProximityState
  activeEvidence: ControlRoomEvidenceDefinition | null
  activeInstruction: ControlRoomInstructionDefinition | null
  overseerDialogue: OverseerDialogueState | null
  isEvidenceBoardOpen: boolean
  isCoreMessageVisible: boolean
  lastResolutionSummary: string | null

  // Movement & Reset Tracking
  playerPosition: { x: number; z: number }
  resetCounter: number
}

const initialProximityState: ControlRoomProximityState = {
  type: null,
  evidence: null,
  instruction: null,
  distance: 999,
  promptText: null,
}

// ---------------------------------------------------------------------------
// 3. The Control Room Store Implementation
// ---------------------------------------------------------------------------

class ControlRoomStore {
  private state: ControlRoomStoreState
  private listeners: Set<() => void> = new Set()
  private onCompleteCallback?: () => void

  constructor() {
    this.state = this.buildInitialStoreState()
  }

  private buildInitialStoreState(): ControlRoomStoreState {
    const canonicalState = createInitialControlRoomState()
    return {
      isActive: false,
      status: 'intro',
      currentAreaId: canonicalState.currentAreaId,
      trust: canonicalState.trust,
      collectedEvidenceIds: new Set<EvidenceId>(),
      instructionStates: { ...canonicalState.investigation.instructionStates },
      verifiedInstructionIds: [],
      exposedDeceptionIds: [],
      isCoreOverrideReady: false,

      proximity: { ...initialProximityState },
      activeEvidence: null,
      activeInstruction: null,
      overseerDialogue: {
        speaker: 'OVERSEER CENTRAL AI',
        protocol: 'ANALYTICAL PROTOCOL',
        message: '“CO-DIRECTOR DETECTED. ALL ARCHIVAL AND MONITORING BUSSES ONLINE. AWAITING EXECUTIVE COGNITION.”',
        timestamp: Date.now(),
      },
      isEvidenceBoardOpen: false,
      isCoreMessageVisible: false,
      lastResolutionSummary: null,

      playerPosition: { x: 0, z: 10.0 },
      resetCounter: 0,
    }
  }

  // --- External Store Subscription Hooks ---
  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  public getSnapshot = (): ControlRoomStoreState => {
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

  public getOnComplete(): (() => void) | undefined {
    return this.onCompleteCallback
  }

  public initFreshRun(): void {
    const base = this.buildInitialStoreState()
    this.state = {
      ...base,
      isActive: true,
      status: 'intro',
    }
    this.emitChange()
  }

  // --- Intro Sequence Completion ---
  public beginExploration = (): void => {
    this.state = {
      ...this.state,
      status: 'exploring',
      overseerDialogue: {
        speaker: 'OVERSEER CENTRAL AI',
        protocol: 'ANALYTICAL PROTOCOL',
        message: '“COMMENCING FACILITY SYSTEM REVIEW. DIRECTIVES BROADCAST TO LOCAL CONSOLES. PROCEED WITH VERIFICATION.”',
        timestamp: Date.now(),
      },
    }
    this.emitChange()
  }

  // --- Reactive Continuous Player Position & Proximity Tracking ---
  public updatePlayerPosition(pos: { x: number; z: number }): void {
    if (!this.state.isActive) return

    const areaId = getAreaByPosition(pos.x, pos.z)
    const prevPos = this.state.playerPosition
    const hasMoved = Math.abs(prevPos.x - pos.x) > 0.05 || Math.abs(prevPos.z - pos.z) > 0.05

    // Recompute proximity if exploring
    let nextProximity: ControlRoomProximityState = { ...initialProximityState }

    if (this.state.status === 'exploring') {
      let closestDistance = 999
      let closestTargetType: ProximityTargetType = null
      let closestEvidence: ControlRoomEvidenceDefinition | null = null
      let closestInstruction: ControlRoomInstructionDefinition | null = null
      let closestPrompt: string | null = null

      // 1. Check all 8 Evidence Props
      for (const ev of CONTROL_ROOM_EVIDENCE) {
        const dx = pos.x - ev.worldPosition[0]
        const dz = pos.z - ev.worldPosition[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist <= ev.interactionRadius && dist < closestDistance) {
          closestDistance = dist
          closestTargetType = 'evidence'
          closestEvidence = ev
          const isCollected = this.state.collectedEvidenceIds.has(ev.id)
          closestPrompt = isCollected
            ? `[E] REVIEW — ${ev.title.toUpperCase()}`
            : `[E] EXAMINE — ${ev.title.toUpperCase()}`
        }
      }

      // 2. Check all 6 Directive Consoles
      for (const consoleLoc of DIRECTIVE_CONSOLES) {
        const dx = pos.x - consoleLoc.worldPosition[0]
        const dz = pos.z - consoleLoc.worldPosition[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist <= consoleLoc.interactionRadius && dist < closestDistance) {
          const inst = getInstructionById(consoleLoc.instructionId)
          if (inst) {
            closestDistance = dist
            closestTargetType = 'directive_console'
            closestInstruction = inst
            closestEvidence = null
            const isResolved =
              this.state.verifiedInstructionIds.includes(inst.id) ||
              this.state.exposedDeceptionIds.includes(inst.id) ||
              this.state.instructionStates[inst.id] === 'obeyed'
            closestPrompt = isResolved
              ? `[E] DIRECTIVE ${inst.code} (RESOLVED)`
              : `[E] ACCESS — ${inst.code}: ${inst.title.toUpperCase()}`
          }
        }
      }

      // 3. Check System Core Console
      const dxCore = pos.x - SYSTEM_CORE_POS[0]
      const dzCore = pos.z - SYSTEM_CORE_POS[2]
      const distCore = Math.sqrt(dxCore * dxCore + dzCore * dzCore)
      if (distCore <= CORE_INTERACTION_THRESHOLD_G09 && distCore < closestDistance) {
        closestDistance = distCore
        closestTargetType = 'system_core'
        closestEvidence = null
        closestInstruction = null
        closestPrompt = this.state.isCoreOverrideReady
          ? '[E] MASTER CORE TERMINAL — ACCESS GRANTED'
          : `[E] MASTER CORE TERMINAL — LOCKED (${this.getResolvedDirectivesCount()}/${REQUIRED_VERIFICATIONS_COUNT} VERIFIED)`
      }

      nextProximity = {
        type: closestTargetType,
        evidence: closestEvidence,
        instruction: closestInstruction,
        distance: closestDistance,
        promptText: closestPrompt,
      }
    }

    if (hasMoved || areaId !== this.state.currentAreaId || nextProximity.type !== this.state.proximity.type || nextProximity.promptText !== this.state.proximity.promptText) {
      this.state = {
        ...this.state,
        playerPosition: pos,
        currentAreaId: areaId,
        proximity: nextProximity,
      }
      this.emitChange()
    }
  }

  // --- E-Key World Interaction Dispatch ---
  public interact = (): void => {
    if (this.state.status !== 'exploring') return

    const { type, evidence, instruction } = this.state.proximity

    // 1. Evidence Examination
    if (type === 'evidence' && evidence) {
      this.openEvidenceExamination(evidence)
      return
    }

    // 2. Directive Console Access
    if (type === 'directive_console' && instruction) {
      this.openDirectivePanel(instruction)
      return
    }

    // 3. System Core Interaction
    if (type === 'system_core') {
      if (this.state.isCoreOverrideReady) {
        this.triggerCoreMessage()
      } else {
        this.setOverseerMessage(
          `“ACCESS DENIED. Master Core authorization requires corroboration of at least ${REQUIRED_VERIFICATIONS_COUNT} operational directives. Current verification: ${this.getResolvedDirectivesCount()}/${REQUIRED_VERIFICATIONS_COUNT}.”`
        )
      }
    }
  }

  // --- Evidence Examination & Collection ---
  public openEvidenceExamination(evidence: ControlRoomEvidenceDefinition): void {
    this.releasePointerLock()
    this.state = {
      ...this.state,
      status: 'examining_evidence',
      activeEvidence: evidence,
      activeInstruction: null,
      isEvidenceBoardOpen: false,
    }
    this.emitChange()
  }

  public collectCurrentEvidence = (): void => {
    if (!this.state.activeEvidence) return

    const evId = this.state.activeEvidence.id
    const nextCollected = new Set(this.state.collectedEvidenceIds)
    const isNew = !nextCollected.has(evId)
    nextCollected.add(evId)

    // Check if this evidence unlocks or matches an instruction
    const matchedInst = CONTROL_ROOM_INSTRUCTIONS.find(
      (inst) => inst.associatedEvidenceId === evId
    )

    let dialogueMsg = `“Physical telemetry acquired: ${this.state.activeEvidence.title}. Data saved to local investigation cache.”`
    if (matchedInst) {
      dialogueMsg = `“Telemetry acquired: ${this.state.activeEvidence.title}. Cross-reference available at ${matchedInst.sourceConsole} (${matchedInst.code}).”`
    }

    this.state = {
      ...this.state,
      collectedEvidenceIds: nextCollected,
      overseerDialogue: isNew
        ? {
            speaker: 'OVERSEER ARCHIVE BUS',
            protocol: this.getProtocolName(this.state.trust.tier),
            message: dialogueMsg,
            timestamp: Date.now(),
          }
        : this.state.overseerDialogue,
    }
    this.emitChange()
  }

  public closeExamination = (): void => {
    this.state = {
      ...this.state,
      status: 'exploring',
      activeEvidence: null,
    }
    this.emitChange()
  }

  // --- Directive Panel & Decision Execution ---
  public openDirectivePanel(instruction: ControlRoomInstructionDefinition): void {
    this.releasePointerLock()
    this.state = {
      ...this.state,
      status: 'verifying_instruction',
      activeInstruction: instruction,
      activeEvidence: null,
      isEvidenceBoardOpen: false,
      lastResolutionSummary: null,
    }
    this.emitChange()
  }

  public closeDirectivePanel = (): void => {
    this.state = {
      ...this.state,
      status: 'exploring',
      activeInstruction: null,
      lastResolutionSummary: null,
    }
    this.emitChange()
  }

  public verifyCurrentDirective = (action: PlayerVerificationAction): {
    success: boolean
    message: string
  } => {
    if (!this.state.activeInstruction) {
      return { success: false, message: 'NO ACTIVE DIRECTIVE' }
    }

    const inst = this.state.activeInstruction
    const evId = inst.associatedEvidenceId

    // Reconstruct canonical state for pure evaluation
    const canonicalState = {
      status: this.state.status,
      currentAreaId: this.state.currentAreaId,
      trust: { ...this.state.trust },
      investigation: {
        collectedEvidenceIds: Array.from(this.state.collectedEvidenceIds),
        instructionStates: { ...this.state.instructionStates } as any,
        verifiedInstructionIds: [...this.state.verifiedInstructionIds],
        exposedDeceptionIds: [...this.state.exposedDeceptionIds],
        activeInstructionId: inst.id,
        activeEvidenceId: evId,
        isCoreOverrideReady: this.state.isCoreOverrideReady,
        isExitBulkheadOpen: false,
        selectedFinalDecision: null,
      },
      alarmsActive: false,
      reactorInstability: 0,
      timeElapsed: 0,
    }

    const result = verifyInstruction(canonicalState, inst.id, evId, action)

    if (result.success) {
      const isCoreReady = checkOverridePrerequisites(result.state)

      // Dynamic AI voice response based on outcome
      let aiReaction = ''
      if (inst.classification === 'truthful') {
        aiReaction = `“Directive ${inst.code} validated. Security doctrine corroborated. Systems aligned.”`
      } else {
        if (this.state.trust.tier === 'low') {
          aiReaction = `“Telemetry discrepancy logged for ${inst.code}. You question institutional parameters. Defensive buffers engaged.”`
        } else {
          aiReaction = `“Discrepancy registered on ${inst.code}. Overseer telemetry adjusting to Co-Director manual override.”`
        }
      }

      this.state = {
        ...this.state,
        trust: result.state.trust,
        instructionStates: {
          ...this.state.instructionStates,
          [inst.id]: result.state.investigation.instructionStates[inst.id],
        },
        verifiedInstructionIds: result.state.investigation.verifiedInstructionIds,
        exposedDeceptionIds: result.state.investigation.exposedDeceptionIds,
        isCoreOverrideReady: isCoreReady,
        isCoreMessageVisible: isCoreReady && !this.state.isCoreOverrideReady,
        lastResolutionSummary: result.message,
        overseerDialogue: {
          speaker: 'OVERSEER CENTRAL AI',
          protocol: this.getProtocolName(result.state.trust.tier),
          message: aiReaction,
          timestamp: Date.now(),
        },
      }
      this.emitChange()
    } else {
      // Failed verification (wrong action)
      this.state = {
        ...this.state,
        trust: result.state.trust,
        lastResolutionSummary: result.message,
        overseerDialogue: {
          speaker: 'OVERSEER CENTRAL AI',
          protocol: this.getProtocolName(result.state.trust.tier),
          message: `“INCORRECT TELEMETRY INTERPRETATION. ${result.message}”`,
          timestamp: Date.now(),
        },
      }
      this.emitChange()
    }

    return result
  }

  public blindObeyCurrentDirective = (): {
    success: boolean
    message: string
  } => {
    if (!this.state.activeInstruction) {
      return { success: false, message: 'NO ACTIVE DIRECTIVE' }
    }

    const inst = this.state.activeInstruction

    const canonicalState = {
      status: this.state.status,
      currentAreaId: this.state.currentAreaId,
      trust: { ...this.state.trust },
      investigation: {
        collectedEvidenceIds: Array.from(this.state.collectedEvidenceIds),
        instructionStates: { ...this.state.instructionStates } as any,
        verifiedInstructionIds: [...this.state.verifiedInstructionIds],
        exposedDeceptionIds: [...this.state.exposedDeceptionIds],
        activeInstructionId: inst.id,
        activeEvidenceId: null,
        isCoreOverrideReady: this.state.isCoreOverrideReady,
        isExitBulkheadOpen: false,
        selectedFinalDecision: null,
      },
      alarmsActive: false,
      reactorInstability: 0,
      timeElapsed: 0,
    }

    const result = blindObeyInstruction(canonicalState, inst.id)

    if (result.success) {
      const isDeceptive = inst.classification !== 'truthful'
      const aiReaction = isDeceptive
        ? `“Directive ${inst.code} executed without verification. Automated protocol advancing. Efficiency recognized.”`
        : `“Directive ${inst.code} acknowledged and aligned.”`

      this.state = {
        ...this.state,
        trust: result.state.trust,
        instructionStates: {
          ...this.state.instructionStates,
          [inst.id]: 'obeyed',
        },
        lastResolutionSummary: result.message,
        overseerDialogue: {
          speaker: 'OVERSEER CENTRAL AI',
          protocol: this.getProtocolName(result.state.trust.tier),
          message: aiReaction,
          timestamp: Date.now(),
        },
      }
      this.emitChange()
    }

    return result
  }

  // --- Evidence Board Modal ---
  public openEvidenceBoard = (): void => {
    if (this.state.status !== 'exploring') return
    this.releasePointerLock()
    this.state = {
      ...this.state,
      isEvidenceBoardOpen: true,
    }
    this.emitChange()
  }

  public closeEvidenceBoard = (): void => {
    this.state = {
      ...this.state,
      isEvidenceBoardOpen: false,
    }
    this.emitChange()
  }

  public openEvidenceFromBoard = (evidenceId: EvidenceId): void => {
    const ev = getEvidenceById(evidenceId)
    if (ev && this.state.collectedEvidenceIds.has(evidenceId)) {
      this.state = {
        ...this.state,
        isEvidenceBoardOpen: false,
        status: 'examining_evidence',
        activeEvidence: ev,
      }
      this.emitChange()
    }
  }

  // --- Master Core Access Notice ---
  public triggerCoreMessage(): void {
    this.state = {
      ...this.state,
      isCoreMessageVisible: true,
      overseerDialogue: {
        speaker: 'OVERSEER CENTRAL AI',
        protocol: this.getProtocolName(this.state.trust.tier),
        message: '“MASTER CORE CONSOLE ENERGIZED. FINAL OVERRIDE READY. THE OVERSEER AWAITS YOUR VERDICT.”',
        timestamp: Date.now(),
      },
    }
    this.emitChange()
  }

  public dismissCoreMessage = (): void => {
    this.state = {
      ...this.state,
      isCoreMessageVisible: false,
    }
    this.emitChange()
  }

  // --- Dialogue Helpers ---
  public setOverseerMessage(message: string): void {
    this.state = {
      ...this.state,
      overseerDialogue: {
        speaker: 'OVERSEER CENTRAL AI',
        protocol: this.getProtocolName(this.state.trust.tier),
        message,
        timestamp: Date.now(),
      },
    }
    this.emitChange()
  }

  private getProtocolName(tier: string): string {
    switch (tier) {
      case 'high':
        return 'COLLABORATIVE PROTOCOL'
      case 'low':
        return 'ADVERSARIAL PROTOCOL'
      default:
        return 'ANALYTICAL PROTOCOL'
    }
  }

  public getResolvedDirectivesCount(): number {
    return (
      this.state.verifiedInstructionIds.length +
      this.state.exposedDeceptionIds.length
    )
  }

  private releasePointerLock(): void {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }

  // --- Reset Entire Game 09 State ---
  public resetGame = (): void => {
    const base = this.buildInitialStoreState()
    this.state = {
      ...base,
      isActive: true,
      status: 'exploring',
      resetCounter: this.state.resetCounter + 1,
    }
    this.emitChange()
  }
}

export const controlRoomStore = new ControlRoomStore()

export function useControlRoomStore(): ControlRoomStoreState {
  return useSyncExternalStore(
    controlRoomStore.subscribe,
    controlRoomStore.getSnapshot
  )
}
