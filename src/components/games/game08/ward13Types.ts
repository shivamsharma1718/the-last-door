/**
 * Game 08: WARD 13 - Foundational Type Definitions
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 */

export type Vector3Tuple = [number, number, number]
export type Vector2Tuple = [number, number]

// ---------------------------------------------------------------------------
// 1. Game Status State Machine
// ---------------------------------------------------------------------------

export type Game08Status =
  | 'intro'
  | 'exploring'
  | 'examining'
  | 'comparing_evidence'
  | 'terminal_input'
  | 'terminal_transition'
  | 'failure_cinematic'
  | 'failed'
  | 'victory_cinematic'
  | 'victory'
  | 'next_trial'

// ---------------------------------------------------------------------------
// 2. Room & Facility Architecture Types
// ---------------------------------------------------------------------------

export type Ward13RoomId =
  | 'reception'        // Area 1: Hospital Reception (Triage / Check-in)
  | 'patient_ward'     // Area 2: Patient Ward (Restraints & Telemetry)
  | 'isolation_room'   // Area 3: Isolation Room (Acoustic Deprivation)
  | 'observation_room' // Area 4: Observation Room (Surveillance & Control)
  | 'records_archive'  // Area 5: Medical Records Archive (Redacted Files)
  | 'decon_exit'       // Area 6: Ward 13 Final Exit (Decontamination & Terminal)

export interface Ward13RoomDefinition {
  id: Ward13RoomId
  name: string
  subtext: string
  dimensions: Vector3Tuple // [width, height, depth]
  centerPosition: Vector3Tuple
  boundingMin: Vector2Tuple // [minX, minZ]
  boundingMax: Vector2Tuple // [maxX, maxZ]
  requiredClearance: number // Clearance level 1 to 4 required to enter
  connectedRoomIds: Ward13RoomId[]
  description: string
  atmosphericDetails: string[]
}

// ---------------------------------------------------------------------------
// 3. Evidence & Investigation Types
// ---------------------------------------------------------------------------

export type EvidenceCategory =
  | 'patient_record'
  | 'surveillance_log'
  | 'audio_transcript'
  | 'altered_photo'
  | 'experimental_memo'
  | 'terminal_record'

export type EvidenceId =
  | 'evidence_intake_log'
  | 'evidence_triage_memo'
  | 'evidence_bed_chart_sigma'
  | 'evidence_sedation_schedule'
  | 'evidence_audiotape_transcript'
  | 'evidence_scratched_glyph'
  | 'evidence_surveillance_screens'
  | 'evidence_experimenter_notes'
  | 'evidence_patient_dossier_sigma'
  | 'evidence_altered_photograph'
  | 'evidence_autopsy_records'
  | 'evidence_terminal_manifest'

export interface EvidenceDefinition {
  id: EvidenceId
  title: string
  category: EvidenceCategory
  roomId: Ward13RoomId
  worldPosition: Vector3Tuple
  interactionRadius: number
  loreSource: string
  documentExcerpt: string
  diagnosticClaim: string
  targetContradictionId?: EvidenceId
  contradictionKey?: string
  contradictionDeduction?: string
  trialConnection?: string
}

// ---------------------------------------------------------------------------
// 4. Contradiction & Evidence Comparison Mechanics
// ---------------------------------------------------------------------------

export interface ContradictionPair {
  key: string
  name: string
  evidenceIdA: EvidenceId
  evidenceIdB: EvidenceId
  claimA: string
  claimB: string
  resolvedTruth: string
  unlockedClearance: number
  narrativeRevelation: string
}

// ---------------------------------------------------------------------------
// 5. Patient & Surveillance Dossiers
// ---------------------------------------------------------------------------

export interface PatientRecord {
  subjectId: string
  codename: string
  admittedDate: string
  status: 'active_trial' | 'clinical_flatline' | 'cognitive_anomaly'
  trialsCompleted: number[]
  physiologicalData: {
    restingHeartRate: number
    peakStressBPM: number
    eegPattern: string
    sedationResistance: string
  }
  investigatorNotes: string
}

export interface SurveillanceRecord {
  cameraId: string
  feedLabel: string
  targetLocation: string
  timestamp: string
  observedBehavior: string
  anomalyDetected: boolean
}

// ---------------------------------------------------------------------------
// 6. Terminal Verdict & Decision Types
// ---------------------------------------------------------------------------

export type TerminalDecisionOption =
  | 'patient_submission'    // Option A: "PATIENT 404: ACCEPT CLINICAL TERMINATION" (Fatal submission)
  | 'researcher_reclaim'    // Option B: "DIRECTOR VANCE: RECLAIM ARCHITECT IDENTITY" (Hubris delusion)
  | 'autonomous_survivor'   // Option C: "THE SURVIVOR: TERMINATE EXPERIMENT & CLAIM AUTONOMY" (Truth)

export interface TerminalOptionDefinition {
  id: TerminalDecisionOption
  label: string
  subtext: string
  isCorrect: boolean
  consequenceSummary: string
}

export interface TerminalPromptState {
  promptText: string
  options: TerminalOptionDefinition[]
}

// ---------------------------------------------------------------------------
// 7. Full Investigation & Game State
// ---------------------------------------------------------------------------

export interface Ward13InvestigationState {
  collectedEvidenceIds: EvidenceId[]
  resolvedContradictionKeys: string[]
  activeEvidenceId: EvidenceId | null
  comparedEvidenceIds: [EvidenceId, EvidenceId] | null
  currentClearanceLevel: number // 1 (Default) to 4 (Master)
  unlockedRoomIds: Ward13RoomId[]
  selectedDecision: TerminalDecisionOption | null
  isTerminalUnlocked: boolean
  identityRevealed: boolean
}

export interface Ward13GameState {
  status: Game08Status
  currentRoomId: Ward13RoomId
  investigation: Ward13InvestigationState
  sanity: number
  heartRate: number
  alarmsActive: boolean
  emergencyPowerActive: boolean
  timeElapsed: number
}

// ---------------------------------------------------------------------------
// 8. Component Props Interface
// ---------------------------------------------------------------------------

export interface TheWard13Props {
  onComplete?: () => void
  onBackToHallway?: () => void
}

export type Ward13Props = TheWard13Props

// ---------------------------------------------------------------------------
// 9. Spatial Coordinates & Level Constraints Constants
// ---------------------------------------------------------------------------

export const WARD13_TOTAL_WIDTH = 28.0
export const WARD13_TOTAL_DEPTH = 32.0
export const WARD13_CEILING_HEIGHT = 3.6

export const INITIAL_WARD13_POS: Vector3Tuple = [0, 1.65, 11.5]
export const INITIAL_WARD13_LOOK: Vector3Tuple = [0, 1.65, 0.0]

export const TERMINAL_WORLD_POS: Vector3Tuple = [0, 1.1, -14.5]

export const INTERACTION_DISTANCE_THRESHOLD_G08 = 2.2
export const TERMINAL_DISTANCE_THRESHOLD_G08 = 2.0
export const DOOR_INTERACTION_THRESHOLD_G08 = 2.4

export const REQUIRED_EVIDENCE_COUNT = 8
export const TOTAL_CONTRADICTIONS_COUNT = 3
export const MAX_CLEARANCE_LEVEL = 4

export const CORRECT_TERMINAL_DECISION: TerminalDecisionOption =
  'autonomous_survivor'
