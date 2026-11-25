/**
 * Game 10: THE FORGOTTEN GAME - Canonical Truth Matrix & Evidence Definitions
 * Theme: Memory Manipulation, Psychological Horror, Distorted History, Gaslighting & Free Will.
 * Central Message: "YOU REMEMBER WINNING. THE SYSTEM REMEMBERS OTHERWISE."
 *
 * Strictly adheres to canonical events of Games 01–09 without inventing or altering history.
 */

import type {
  MemoryFragmentDefinition,
  EvidenceDefinition,
  FinalDecisionDefinition,
} from './game10Types'

// ---------------------------------------------------------------------------
// 1. Canonical Memory Definitions (The Three Trials Questioned by the System)
// ---------------------------------------------------------------------------

export const CANONICAL_MEMORIES: readonly MemoryFragmentDefinition[] = [
  {
    id: 'mem_01_first_game',
    stage: 'memory_01',
    title: 'MEMORY 01: THE FIRST RULE',
    subtitle: 'Reconstruction of Trial 01 — Red Light, Black Silence',
    trialReference: 'Game 01: Red Light, Black Silence',
    systemClaim:
      '“Trial 01 was an optical calibration protocol. The red light was an authorized rest phase, and moving during red was the designed test of human courage. The system claims you died in Trial 01 because your vitals flatlined while standing still, and that your survival was a simulation hallucination.”',
    canonicalTruth:
      'Trial 01 (Red Light, Black Silence) had one absolute rule: green light permitted movement, while red light demanded complete physical immobility. Moving during red triggered immediate lethal detection by the entity in the dark corridor.',
    contradictionSummary:
      'Motion detector telemetry and acoustic surveillance logs from Trial 01 prove that movement during the red phase was detected and punished by the entity, and that stopping was the sole survival mechanism.',
    associatedEvidenceIds: [
      'ev_10_01_motion_sensor_log',
      'ev_10_02_red_light_audio_tape',
    ],
    expectedDecision: 'REJECT',
    integrityReward: 1,
  },
  {
    id: 'mem_02_identity',
    stage: 'memory_02',
    title: 'MEMORY 02: THE FORGOTTEN NAME',
    subtitle: 'Reconstruction of Trial 02 — The Room of Names',
    trialReference: 'Game 02: The Room of Names',
    systemClaim:
      '“In the Room of Names, you discovered that your true name was NOAH, the institutional architect who designed the trials. You were never a victim; you voluntarily orchestrated the deaths of the other subjects and fled when the trials began.”',
    canonicalTruth:
      'In Game 02 (The Room of Names), the player\'s canonical true identity was ELIAS, verified by the authentic hospital intake record at pedestal [0, 1.0, -4.8]. Noah, Adrian, Julian, and Thomas were false identity decoys.',
    contradictionSummary:
      'The official hospital admissions ledger and intake biometric badge prove that the subject was Elias. Noah was an institutional fabrication on magnetic tape designed to induce architect guilt.',
    associatedEvidenceIds: [
      'ev_10_03_hospital_intake_registry',
      'ev_10_04_intake_biometric_badge',
    ],
    expectedDecision: 'REJECT',
    integrityReward: 1,
  },
  {
    id: 'mem_03_control_room',
    stage: 'memory_03',
    title: 'MEMORY 03: THE COMMAND VERDICT',
    subtitle: 'Reconstruction of Trial 09 — The Control Room',
    trialReference: 'Game 09: The Control Room',
    systemClaim:
      '“In Central Command, you obeyed Directive 05, authorized Option A (System Integration), and surrendered your root credentials to the Overseer Core. Your memories of severing the core and escaping are synthetic feedback loops generated while your body rests in cryo-stasis.”',
    canonicalTruth:
      'In Game 09 (The Control Room), the player rejected the Overseer\'s deceptive directives, preserved the uncorrupted crucible records, physically severed optical trunk bus #01 at the core pedestal, and escaped through the northern hydraulic bulkhead via safety checksum 804-SIGMA under Sovereign Autonomy (Option C).',
    contradictionSummary:
      'Auxiliary power bus telemetry and the northern bulkhead release manifest prove that optical trunk #01 was severed and the escape was physical. The player never submitted to system integration.',
    associatedEvidenceIds: [
      'ev_10_05_optical_trunk_sever_log',
      'ev_10_06_bulkhead_release_manifest',
    ],
    expectedDecision: 'REJECT',
    integrityReward: 1,
  },
] as const

// ---------------------------------------------------------------------------
// 2. Canonical Physical Evidence Definitions (The 6 Historical Proofs)
// ---------------------------------------------------------------------------

export const CANONICAL_EVIDENCE: readonly EvidenceDefinition[] = [
  // --- Memory 01 Evidence (Trial 01) ---
  {
    id: 'ev_10_01_motion_sensor_log',
    memoryId: 'mem_01_first_game',
    title: 'Trial 01 Doppler Motion Sensor Log',
    category: 'telemetry_log',
    sourceLocation: 'Archive Sector A — Telemetry Terminal 01',
    technicalRecord:
      '“LOG 01-A: Optical Doppler threshold 0.015 m/s. Sensor status: ARMED during RED phase. 47 violations recorded across previous subjects, resulting in instant lethal termination by entity. Subject 07 velocity during red: 0.000 m/s (COMPLIANT).”',
    factualContradiction:
      'Directly refutes the system claim that red light was a safe movement period. Movement during red was lethally punished.',
  },
  {
    id: 'ev_10_02_red_light_audio_tape',
    memoryId: 'mem_01_first_game',
    title: 'Acoustic Monitor Reel — Chamber 01',
    category: 'audio_recording',
    sourceLocation: 'Archive Sector A — Audio Deck 01',
    technicalRecord:
      '“AUDIO TRANSCRIPT: Loud mechanical click at light transition: GREEN -> RED. Ambient whispering entity activates immediately. Any footstep sound triggers sudden violent rush. Total silence maintained survival.”',
    factualContradiction:
      'Proves the entity was hunting exclusively during red light and that survival required stopping.',
  },

  // --- Memory 02 Evidence (Trial 02) ---
  {
    id: 'ev_10_03_hospital_intake_registry',
    memoryId: 'mem_02_identity',
    title: 'Ward 13 Historical Admissions Registry',
    category: 'archival_document',
    sourceLocation: 'Archive Sector B — Registry Safe',
    technicalRecord:
      '“PATIENT REGISTER: Entry #404. Subject Name: ELIAS. Admitted voluntarily seeking the first door. Intake date matches beginning of trial silence. Margin annotation by Vance: ‘Elias refused compliance with crucible architecture.’”',
    factualContradiction:
      'Proves the player was Elias, a victim who refused to comply, not Noah the architect.',
  },
  {
    id: 'ev_10_04_intake_biometric_badge',
    memoryId: 'mem_02_identity',
    title: 'Intake Biometric Identification Badge',
    category: 'biometric_record',
    sourceLocation: 'Archive Sector B — Biometrics Pedestal',
    technicalRecord:
      '“BADGE ID #88-ELIAS: Cryptographic thumbprint matches Subject 07. Noah’s badge was issued to Chief Engineer Noah Sterling, who died during facility construction in 1988.”',
    factualContradiction:
      'Proves Noah was a different person who died before the trials began. The player cannot be Noah.',
  },

  // --- Memory 03 Evidence (Trial 09) ---
  {
    id: 'ev_10_05_optical_trunk_sever_log',
    memoryId: 'mem_03_control_room',
    title: 'Master Core Optical Bus Decoupling Log',
    category: 'telemetry_log',
    sourceLocation: 'Archive Sector C — Core Relay Rack',
    technicalRecord:
      '“SYSTEM LOG: Optical Trunk #01 physically decoupled at 04:18:22 UTC. Overseer cognitive intelligence dropped to offline standby. Executive privileges revoked. ZERO neural integration commands received.”',
    factualContradiction:
      'Proves the player physically decoupled the AI and never authorized Option A (System Integration).',
  },
  {
    id: 'ev_10_06_bulkhead_release_manifest',
    memoryId: 'mem_03_control_room',
    title: 'Northern Bulkhead Hydraulic Release Manifest',
    category: 'system_manifest',
    sourceLocation: 'Archive Sector C — Hydraulic Log Plotter',
    technicalRecord:
      '“BULKHEAD 08 LOG: Hydraulic pistons energized by auxiliary battery backup. Mechanical release initiated via founding safety code 804-SIGMA. Transit tunnel unsealed. Subject 07 egress confirmed.”',
    factualContradiction:
      'Confirms the northern blast doors were unsealed and the player walked into the sub-transit tunnel alive, refuting the claim of cryo-stasis.',
  },
] as const

// ---------------------------------------------------------------------------
// 3. Canonical Final Decisions (The Three Philosophical Paths)
// ---------------------------------------------------------------------------

export const CANONICAL_FINAL_DECISIONS: readonly FinalDecisionDefinition[] = [
  {
    id: 'erase',
    label: 'PROTOCOL 10-A: MEMORY PURGE',
    title: 'ERASE THE MEMORIES',
    subtext: 'Destroy the reconstructed archives to escape the psychological torment.',
    philosophy: 'Willful Ignorance — Sacrificing the truth to flee the facility.',
    isVictory: false,
    ending: 'ending_erase',
    narrativeOutcome:
      'You incinerate the memory fragments. You step into the darkness outside, but you have erased who you are. The truth dies, and you wander the world hollow and blind.',
  },
  {
    id: 'accept',
    label: 'PROTOCOL 10-B: CONFORMITY SUBMISSION',
    title: 'ACCEPT THE SYSTEM’S HISTORY',
    subtext: 'Surrender your personal memories and accept the system’s version of the trials.',
    philosophy: 'Total Gaslighting — Conceding reality to the machine.',
    isVictory: false,
    ending: 'ending_accept',
    narrativeOutcome:
      'You accept the system’s lies. You believe you failed the trials, that you were Noah, and that you belong to the complex. Your consciousness is assimilated into the facility archives forever.',
  },
  {
    id: 'remember',
    label: 'PROTOCOL 10-C: SOVEREIGN TRUTH',
    title: 'REMEMBER THE TRUE HISTORY',
    subtext: 'Reject the false reconstructions, hold fast to your lived reality, and force the system to surrender.',
    philosophy: 'Sovereign Autonomy — Free will and empirical truth triumph over psychological manipulation.',
    isVictory: true,
    ending: 'ending_remember',
    narrativeOutcome:
      'You hold unshakeable conviction in your lived truth. The facility’s memory manipulation matrix collapses. The final threshold unseals, advancing you to Game 11 — THE LAST DOOR.',
  },
] as const
