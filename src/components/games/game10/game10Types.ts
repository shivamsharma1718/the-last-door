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

// ---------------------------------------------------------------------------
// 9. 3D Spatial Environment Types & Canonical Coordinates (Step 2.1)
// ---------------------------------------------------------------------------

export type Game10AreaId =
  | 'hall_of_mirrors'        // Starting Corridor (Z = -4.0 to 22.0)
  | 'wing_01_first_rule'     // Memory Wing 01: Observation Sector (Game 01 reference, West)
  | 'wing_02_forgotten_name'  // Memory Wing 02: Hospital Registry Sector (Game 02 reference, East)
  | 'wing_03_command_verdict' // Memory Wing 03: Industrial Core Relay Sector (Game 09 reference, West)
  | 'memory_core_chamber'    // Terminal Grand Chamber: The Suspended Core (North, Z <= -4.0)

export interface Game10AreaDefinition {
  id: Game10AreaId
  title: string
  subtitle: string
  themeReference: string
  bounds: {
    minX: number
    maxX: number
    minZ: number
    maxZ: number
  }
  waypoint: [number, number] // Walkable navigation center [X, Z]
}

export const INITIAL_GAME10_POS: [number, number, number] = [0, 1.65, 18.0]
export const INITIAL_GAME10_LOOK: [number, number, number] = [0, 1.65, 0.0]

export const GAME10_TOTAL_WIDTH = 46.0  // X spans from -23.0 to 23.0
export const GAME10_TOTAL_DEPTH = 52.0  // Z spans from -29.0 to 23.0
export const GAME10_CEILING_HEIGHT_HALL = 4.5
export const GAME10_CEILING_HEIGHT_CORE = 6.5

export const GAME10_AREAS: readonly Game10AreaDefinition[] = [
  {
    id: 'hall_of_mirrors',
    title: 'THE HALL OF DISTORTED MIRRORS',
    subtitle: 'Brutalist Entry Gallery & Reflection Corridor',
    themeReference: 'Starting Zone — Memory Distortion',
    bounds: { minX: -3.0, maxX: 3.0, minZ: -4.0, maxZ: 22.0 },
    waypoint: [0, 12.0],
  },
  {
    id: 'wing_01_first_rule',
    title: 'WING 01: THE FIRST RULE',
    subtitle: 'Observation Gallery & Doppler Telemetry Sector',
    themeReference: 'Game 01: Red Light, Black Silence',
    bounds: { minX: -18.0, maxX: -3.0, minZ: 6.0, maxZ: 14.0 },
    waypoint: [-14.0, 10.0],
  },
  {
    id: 'wing_02_forgotten_name',
    title: 'WING 02: THE FORGOTTEN NAME',
    subtitle: 'Clinical Admissions Archive & Identity Registry',
    themeReference: 'Game 02: The Room of Names',
    bounds: { minX: 3.0, maxX: 18.0, minZ: -2.0, maxZ: 6.0 },
    waypoint: [14.0, 2.0],
  },
  {
    id: 'wing_03_command_verdict',
    title: 'WING 03: THE COMMAND VERDICT',
    subtitle: 'Industrial Optical Trunk Relay & Hydraulic Vault',
    themeReference: 'Game 09: The Control Room',
    bounds: { minX: -18.0, maxX: -3.0, minZ: -4.0, maxZ: 4.0 },
    waypoint: [-14.0, 0.0],
  },
  {
    id: 'memory_core_chamber',
    title: 'THE MEMORY CORE CHAMBER',
    subtitle: 'Terminal Sanctuary of the Suspended Memory Matrix',
    themeReference: 'The Final Judgment Core',
    bounds: { minX: -10.0, maxX: 10.0, minZ: -28.0, maxZ: -4.0 },
    waypoint: [0, -10.0],
  },
] as const

// ---------------------------------------------------------------------------
// 10. Investigation Objects & Proximity Interaction Types (Step 2.3)
// ---------------------------------------------------------------------------

export interface Game10InteractableObject {
  id: string
  name: string
  areaId: Game10AreaId
  worldPosition: [number, number, number]
  interactionRadius: number
  isInteractable: boolean
  title: string
  description: string
  hint?: string
}

export interface Game10ProximityState {
  targetId: string | null
  targetName: string | null
  distance: number
  promptText: string | null
  activeObject: Game10InteractableObject | null
}

export type Game10InteractionStatus = 'exploring' | 'inspecting'
