/**
 * Game 10: THE FORGOTTEN GAME - Foundational Type Definitions
 * Theme: Memory Manipulation, Psychological Horror, Distorted History, Gaslighting & Free Will.
 * Central Message: "YOU REMEMBER WINNING. THE SYSTEM REMEMBERS OTHERWISE."
 */

// ---------------------------------------------------------------------------
// 1. Stage Progression State Machine
// ---------------------------------------------------------------------------

export type Game10Stage =
  | 'initialization'     // Stage 0: Entry into the archive facility
  | 'memory_01'          // Stage 1: Memory 01 (The First Game - Game 01)
  | 'memory_02'          // Stage 2: Memory 02 (The Identity - Game 02)
  | 'memory_03'          // Stage 3: Memory 03 (The Control Room - Game 09)
  | 'judgment_unlocked'  // Stage 4: All 3 memories finalized, Judgment Chamber unsealed
  | 'final_decision'     // Stage 5: Final Judgment terminal selection
  | 'ending'             // Stage 6: Outcome narrative resolution

// ---------------------------------------------------------------------------
// 2. Canonical Memory Identifiers & Status
// ---------------------------------------------------------------------------

export type MemoryId =
  | 'mem_01_first_game'     // Trial 01: Red Light, Black Silence
  | 'mem_02_identity'       // Trial 02: The Room of Names
  | 'mem_03_control_room'   // Trial 09: The Control Room

export type MemoryStatus =
  | 'locked'       // Awaiting prior memory completion
  | 'active'       // Currently under active investigation
  | 'evaluating'   // Sufficient evidence gathered, decision pending
  | 'completed'    // Decision evaluated and finalized (immutable)

// ---------------------------------------------------------------------------
// 3. Evidence Identifiers & Classifications
// ---------------------------------------------------------------------------

export type EvidenceId =
  // Memory 01 Evidence
  | 'ev_10_01_motion_sensor_log'       // Trial 01 optical Doppler motion detector logs
  | 'ev_10_02_red_light_audio_tape'    // Acoustic recording of the entity stalking on red
  // Memory 02 Evidence
  | 'ev_10_03_hospital_intake_registry'// Ward 13 original patient admissions registry
  | 'ev_10_04_intake_biometric_badge'  // Biometric authentication badge of Elias
  // Memory 03 Evidence
  | 'ev_10_05_optical_trunk_sever_log' // Control Room auxiliary bus decoupling telemetry
  | 'ev_10_06_bulkhead_release_manifest'// Hydraulic northern door checksum release log

export type EvidenceCategory =
  | 'telemetry_log'
  | 'audio_recording'
  | 'archival_document'
  | 'biometric_record'
  | 'system_manifest'

export interface EvidenceDefinition {
  id: EvidenceId
  memoryId: MemoryId
  title: string
  category: EvidenceCategory
  sourceLocation: string
  technicalRecord: string
  factualContradiction: string
}

// ---------------------------------------------------------------------------
// 4. Memory Decision & Truth Matrix Interface
// ---------------------------------------------------------------------------

export type PlayerDecision =
  | 'ACCEPT'   // Believe the system's reconstructed claim
  | 'REJECT'   // Refuse the system's reconstruction based on evidence

export interface MemoryFragmentDefinition {
  id: MemoryId
  stage: Game10Stage
  title: string
  subtitle: string
  trialReference: string
  systemClaim: string
  canonicalTruth: string
  contradictionSummary: string
  associatedEvidenceIds: EvidenceId[]
  expectedDecision: PlayerDecision
  integrityReward: number
}

// ---------------------------------------------------------------------------
// 5. Memory State (Per-Fragment Tracking)
// ---------------------------------------------------------------------------

export interface MemoryState {
  id: MemoryId
  status: MemoryStatus
  discoveredEvidenceIds: EvidenceId[]
  verifiedEvidenceIds: EvidenceId[]
  isSufficientEvidenceGathered: boolean
  playerDecision: PlayerDecision | null
  isDecisionCorrect: boolean | null
  isCompleted: boolean
}

// ---------------------------------------------------------------------------
// 6. Final Decision & Ending Types
// ---------------------------------------------------------------------------

export type FinalDecisionChoice =
  | 'erase'      // Option A: Destroy memories -> Failure Ending
  | 'accept'     // Option B: Accept system history -> Failure Ending
  | 'remember'   // Option C: Sovereign truth -> Victory (Unlocks Game 11)

export type Game10Ending =
  | 'ending_erase'     // Failure A: Escapes blind and hollow
  | 'ending_accept'    // Failure B: Absorbed into system manipulation
  | 'ending_remember'  // Victory: Emancipated, advances to Game 11

export interface FinalDecisionDefinition {
  id: FinalDecisionChoice
  label: string
  title: string
  subtext: string
  philosophy: string
  isVictory: boolean
  ending: Game10Ending
  narrativeOutcome: string
}

// ---------------------------------------------------------------------------
// 7. Full Game 10 State Interface
// ---------------------------------------------------------------------------

export interface Game10State {
  currentStage: Game10Stage
  currentMemoryId: MemoryId | null
  memories: Record<MemoryId, MemoryState>
  discoveredEvidenceIds: Set<EvidenceId>
  verifiedEvidenceIds: Set<EvidenceId>
  memoryIntegrity: number // 0 to 3
  selectedFinalChoice: FinalDecisionChoice | null
  finalDecision: FinalDecisionChoice | null
  isFinalDecisionConfirmed: boolean
  ending: Game10Ending | null
  isGameCompleted: boolean
  resetCounter: number
}

// ---------------------------------------------------------------------------
// 8. Canonical Constants
// ---------------------------------------------------------------------------

export const INITIAL_INTEGRITY = 0
export const MAX_INTEGRITY = 3
export const MIN_INTEGRITY = 0

export const TOTAL_MEMORIES = 3
export const REQUIRED_EVIDENCE_PER_MEMORY = 2

export const CORRECT_FINAL_DECISION: FinalDecisionChoice = 'remember'
