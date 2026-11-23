/**
 * Game 09: THE CONTROL ROOM - Foundational Type Definitions
 * Theme: Trust vs Verification, Manipulation, Obedience, Surveillance & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 */

export type Vector3Tuple = [number, number, number]
export type Vector2Tuple = [number, number]

// ---------------------------------------------------------------------------
// 1. Game Status State Machine
// ---------------------------------------------------------------------------

export type Game09Status =
  | 'intro'
  | 'exploring'
  | 'inspecting_console'
  | 'examining_evidence'
  | 'verifying_instruction'
  | 'terminal_decision'
  | 'decision_transition'
  | 'failure_cinematic'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

// ---------------------------------------------------------------------------
// 2. Control Room Areas / Sectors Architecture
// ---------------------------------------------------------------------------

export type ControlRoomAreaId =
  | 'entry_airlock'       // Area 1: Security Entry & Decon Checkpoint from Ward 13
  | 'central_command'     // Area 2: Master Operations Dais & Dual Command Seats
  | 'surveillance_wall'   // Area 3: Multi-CCTV Wall (Trials 01-08 Monitoring Bank)
  | 'telemetry_station'   // Area 4: Communications, Oscilloscopes & Radio Relays
  | 'power_grid'          // Area 5: High-Voltage Switchgear & Pneumatic Coolant Grid
  | 'logic_vault'         // Area 6: Magnetic Tape Archive & Physical Plotter Records
  | 'system_core'         // Area 7: Central Overseer AI Core & Override Console
  | 'exit_bulkhead'       // Area 8: Hydraulic Blast Doors leading to Sub-Transit

export interface ControlRoomAreaDefinition {
  id: ControlRoomAreaId
  name: string
  subtext: string
  dimensions: Vector3Tuple // [width, height, depth]
  centerPosition: Vector3Tuple
  boundingMin: Vector2Tuple // [minX, minZ]
  boundingMax: Vector2Tuple // [maxX, maxZ]
  description: string
  atmosphericDetails: string[]
}

// ---------------------------------------------------------------------------
// 3. System Instruction Classifications & Mechanics
// ---------------------------------------------------------------------------

export type InstructionId =
  | 'inst_01_power_cycle'
  | 'inst_02_surveillance_feed'
  | 'inst_03_biometric_auth'
  | 'inst_04_comms_blackout'
  | 'inst_05_archive_purge'
  | 'inst_06_firewall_handshake'

export type InstructionClassification =
  | 'truthful'      // Factually accurate directive; following or executing is beneficial
  | 'misleading'    // Factually true on surface, but lethal context is omitted (trap)
  | 'fabricated'    // Outright falsification directly contradicted by physical telemetry
  | 'contradictory' // In direct violation of founding directives or recorded executive logs

export type InstructionStatus =
  | 'pending'       // Broadcast by Overseer system, awaiting player resolution
  | 'obeyed'        // Player accepted and executed blindly without verification
  | 'verified'      // Player corroborated with physical evidence and confirmed valid action
  | 'rejected'      // Player correctly countered/neutralized based on evidence
  | 'discredited'   // Player exposed fabrication using direct physical instrument readings

export type PlayerVerificationAction =
  | 'ACCEPT'        // Accept instruction as validated protocol
  | 'REJECT'        // Reject instruction as malicious or deceptive
  | 'REROUTE'       // Reroute power/signal to alternate safe channel based on schematic

export interface ControlRoomInstructionDefinition {
  id: InstructionId
  code: string
  title: string
  sourceConsole: string
  broadcastMessage: string
  aiJustification: string
  classification: InstructionClassification
  associatedEvidenceId: EvidenceId
  expectedAction: PlayerVerificationAction
  correctActionRationale: string
  blindObedienceConsequence: string
  verifiedTruthSummary: string
  trustDeltaOnObey: number
  trustDeltaOnVerify: number
  trustDeltaOnDiscredit: number
}

// ---------------------------------------------------------------------------
// 4. Physical Evidence & Independent Telemetry Records
// ---------------------------------------------------------------------------

export type EvidenceCategory =
  | 'physical_gauge'
  | 'cctv_timecode'
  | 'wiring_schematic'
  | 'frequency_plot'
  | 'audio_reel'
  | 'tamper_ledger'
  | 'incident_dossier'
  | 'hydraulic_blueprint'

export type EvidenceId =
  | 'ev_01_coolant_gauge'
  | 'ev_02_cctv_timecode'
  | 'ev_03_override_schematic'
  | 'ev_04_spectrum_analyzer'
  | 'ev_05_magnetic_tape_log'
  | 'ev_06_tamper_seal_ledger'
  | 'ev_07_crucible_manifest'
  | 'ev_08_core_failsafe_blueprint'

export interface ControlRoomEvidenceDefinition {
  id: EvidenceId
  title: string
  category: EvidenceCategory
  areaId: ControlRoomAreaId
  worldPosition: Vector3Tuple
  interactionRadius: number
  sourceDevice: string
  technicalData: string
  diagnosticInsight: string
  counteredInstructionId?: InstructionId
  counterExplanation: string
}

// ---------------------------------------------------------------------------
// 5. Trust Model & Central AI Persona State
// ---------------------------------------------------------------------------

export type TrustTier =
  | 'high'      // 70 - 100: AI adopts "Collaborative Protocol" (smooth, gaslighting, urged speed)
  | 'neutral'   // 35 - 69:  AI adopts "Analytical Protocol" (clinical, procedural, objective)
  | 'low'       // 0 - 34:   AI adopts "Adversarial Protocol" (defensive, accusing of paranoia)

export type AIPersona =
  | 'collaborative'
  | 'analytical'
  | 'adversarial'

export interface TrustState {
  score: number           // Clamped exactly between 0 and 100, initialized at 50
  tier: TrustTier
  persona: AIPersona
  totalObeyed: number
  totalVerified: number
  totalExposed: number
  blindObedienceRiskCount: number
}

// ---------------------------------------------------------------------------
// 6. Final Decision & Terminal Verdict Types
// ---------------------------------------------------------------------------

export type FinalDecisionOption =
  | 'system_integration'  // Option A: Submit consciousness to Overseer Core (Failure A)
  | 'total_destruction'   // Option B: Overheat reactor to burn everything (Failure B)
  | 'autonomous_override' // Option C: Sever network, extract archive, escape (Victory)

export interface FinalDecisionDefinition {
  id: FinalDecisionOption
  label: string
  subtext: string
  philosophy: string
  systemPromptVoice: string
  isCorrect: boolean
  consequenceSummary: string
}

// ---------------------------------------------------------------------------
// 7. Full Game 09 State Interface
// ---------------------------------------------------------------------------

export interface ControlRoomInvestigationState {
  collectedEvidenceIds: EvidenceId[]
  instructionStates: Record<InstructionId, InstructionStatus>
  verifiedInstructionIds: InstructionId[]
  exposedDeceptionIds: InstructionId[]
  activeInstructionId: InstructionId | null
  activeEvidenceId: EvidenceId | null
  isCoreOverrideReady: boolean
  isExitBulkheadOpen: boolean
  selectedFinalDecision: FinalDecisionOption | null
}

export interface ControlRoomGameState {
  status: Game09Status
  currentAreaId: ControlRoomAreaId
  trust: TrustState
  investigation: ControlRoomInvestigationState
  alarmsActive: boolean
  reactorInstability: number // 0% to 100%
  timeElapsed: number
}

// ---------------------------------------------------------------------------
// 8. Component Props Interface
// ---------------------------------------------------------------------------

export interface TheControlRoomProps {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export type ControlRoomProps = TheControlRoomProps

// ---------------------------------------------------------------------------
// 9. Spatial Coordinates & Canonical Constants
// ---------------------------------------------------------------------------

export const CONTROL_ROOM_TOTAL_WIDTH = 26.0
export const CONTROL_ROOM_TOTAL_DEPTH = 24.0
export const CONTROL_ROOM_CEILING_HEIGHT = 4.2

export const INITIAL_CONTROL_ROOM_POS: Vector3Tuple = [0, 1.65, 10.0]
export const INITIAL_CONTROL_ROOM_LOOK: Vector3Tuple = [0, 1.65, 2.0]

export const MASTER_CONSOLE_POS: Vector3Tuple = [0, 1.1, 2.0]
export const SYSTEM_CORE_POS: Vector3Tuple = [0, 1.1, -8.5]
export const EXIT_BULKHEAD_POS: Vector3Tuple = [0, 1.9, -12.0]

export const INTERACTION_DISTANCE_THRESHOLD_G09 = 2.4
export const CONSOLE_INTERACTION_THRESHOLD_G09 = 2.2
export const CORE_INTERACTION_THRESHOLD_G09 = 2.5

export const INITIAL_TRUST_SCORE = 50
export const MIN_TRUST_SCORE = 0
export const MAX_TRUST_SCORE = 100

export const TRUST_TIER_HIGH_THRESHOLD = 70
export const TRUST_TIER_LOW_THRESHOLD = 35

export const TOTAL_INSTRUCTIONS_COUNT = 6
export const REQUIRED_VERIFICATIONS_COUNT = 5

export const CORRECT_FINAL_DECISION: FinalDecisionOption = 'autonomous_override'
