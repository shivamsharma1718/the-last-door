/**
 * Game 08: WARD 13 - Pure Game Logic & Rules Engine
 * Theme: Psychological Horror, Investigation, Identity Manipulation & Clinical Experimentation.
 * Central Message: "THE EXPERIMENT WAS NEVER OVER."
 */

import type {
  Game08Status,
  Ward13RoomId,
  Ward13RoomDefinition,
  EvidenceId,
  EvidenceDefinition,
  ContradictionPair,
  PatientRecord,
  SurveillanceRecord,
  TerminalDecisionOption,
  TerminalOptionDefinition,
  TerminalPromptState,
  Ward13GameState,
  Vector3Tuple,
} from './ward13Types'
import {
  INITIAL_WARD13_POS,
  REQUIRED_EVIDENCE_COUNT,
  TOTAL_CONTRADICTIONS_COUNT,
  MAX_CLEARANCE_LEVEL,
  CORRECT_TERMINAL_DECISION,
} from './ward13Types'

// ---------------------------------------------------------------------------
// 1. Canonical Room Definitions
// ---------------------------------------------------------------------------

export const WARD13_ROOMS: Ward13RoomDefinition[] = [
  {
    id: 'reception',
    name: 'Hospital Reception',
    subtext: 'Triage & Admissions',
    dimensions: [8.0, 3.6, 6.0],
    centerPosition: [0, 1.8, 10.0],
    boundingMin: [-4.0, 7.0],
    boundingMax: [4.0, 13.0],
    requiredClearance: 1,
    connectedRoomIds: ['patient_ward'],
    description:
      'The reception area of Ward 13. Water-stained ceiling tiles, shattered frosted glass partitions, and abandoned intake forms litter the linoleum floor. An eerie green cathode-ray terminal flickers on the admissions counter.',
    atmosphericDetails: [
      'Overturned wheeled stretcher near admissions counter',
      'Rototag wall clock frozen immutably at 03:17',
      'Damp low fog hugging the perimeter baseboards',
      'Flickering 60Hz greenish fluorescent fixture',
    ],
  },
  {
    id: 'patient_ward',
    name: 'Patient Ward',
    subtext: 'Clinical Restraints & Telemetry',
    dimensions: [12.0, 3.6, 8.0],
    centerPosition: [0, 1.8, 1.0],
    boundingMin: [-6.0, -3.0],
    boundingMax: [6.0, 5.0],
    requiredClearance: 1,
    connectedRoomIds: ['reception', 'isolation_room', 'observation_room'],
    description:
      'A long clinical ward with six iron hospital beds flanked by rusted privacy curtains. Heavy leather restraints are strapped to three beds. Oscilloscope heart monitors on swinging arms continue to emit rhythmic, hollow vital sign pulses.',
    atmosphericDetails: [
      'Six iron hospital beds, bed 07 heavily stained with telemetry wires',
      'Darkened saline bags hanging on rolling chrome IV poles',
      'Faint blue CRT phosphor glow reflecting on cracked tile floor',
      'Crash cart with defibrillator paddles resting beside Bed 07',
    ],
  },
  {
    id: 'isolation_room',
    name: 'Isolation Room',
    subtext: 'Acoustic & Sensory Deprivation',
    dimensions: [6.0, 3.2, 6.0],
    centerPosition: [-9.0, 1.6, 1.0],
    boundingMin: [-12.0, -2.0],
    boundingMax: [-6.0, 4.0],
    requiredClearance: 2,
    connectedRoomIds: ['patient_ward'],
    description:
      'An acoustic isolation cell lined with stained quilted vinyl padding. An ominous metal chair is bolted to the central floor drain. The room absorbs sound completely, suffocating ambient echoes in oppressive silence.',
    atmosphericDetails: [
      'Heavy reinforced vault door with narrow double-glazed view slot',
      'Single recessed downward sodium lamp casting stark shadow cone',
      'Scratched tally marks and glyphs carved deep into vinyl padding',
      'Intercom speaker hanging from frayed wiring above the doorway',
    ],
  },
  {
    id: 'observation_room',
    name: 'Observation Room',
    subtext: 'Surveillance & Remote Control',
    dimensions: [10.0, 3.6, 6.0],
    centerPosition: [0, 1.8, -7.0],
    boundingMin: [-5.0, -10.0],
    boundingMax: [5.0, -4.0],
    requiredClearance: 2,
    connectedRoomIds: ['patient_ward', 'records_archive'],
    description:
      'A surveillance station fitted with multi-tiered CRT monitor banks and magnetic reel-to-reel tape decks. A massive one-way mirror overlooks the Patient Ward. The screens continuously loop camera feeds from the previous trials.',
    atmosphericDetails: [
      'Eight CCTV monitors showing trials: hallway, maze, and mirror alcove',
      'Slowly revolving reel-to-reel audio tape decks with warm amber VU meters',
      'Rack-mounted servers humming behind perforated steel enclosures',
      'Swivel operator chairs knocked backward in haste',
    ],
  },
  {
    id: 'records_archive',
    name: 'Medical Records Archive',
    subtext: 'Classified Dossiers & Redacted Files',
    dimensions: [8.0, 3.6, 8.0],
    centerPosition: [9.0, 1.8, -7.0],
    boundingMin: [5.0, -11.0],
    boundingMax: [13.0, -3.0],
    requiredClearance: 3,
    connectedRoomIds: ['observation_room', 'decon_exit'],
    description:
      'Compactor filing racks and banker boxes overflowing with clinical dossiers. A green banker lamp illuminates a desk covered in shredded documents and chemically altered employee identification photographs.',
    atmosphericDetails: [
      'Heavy rolling steel file compactors with crank handles',
      'Microfiche projection viewer humming softly in the corner',
      'Shredded document reassembly light tray',
      'Steel security lockbox forced open with crowbar marks',
    ],
  },
  {
    id: 'decon_exit',
    name: 'Ward 13 Final Exit',
    subtext: 'Decontamination Airlock & Diagnostic Console',
    dimensions: [7.0, 3.8, 6.0],
    centerPosition: [0, 1.9, -14.5],
    boundingMin: [-3.5, -17.5],
    boundingMax: [3.5, -11.5],
    requiredClearance: 4,
    connectedRoomIds: ['records_archive'],
    description:
      'An industrial stainless-steel decontamination chamber sealed by twin pneumatic blast doors with hazard stripes. In the center stands the Primary Diagnostic Terminal, awaiting the final cognitive assertion to unlock the exterior shaft.',
    atmosphericDetails: [
      'Overhead decontamination misting nozzles and ceiling exhaust grills',
      'Central pedestal housing the glowing green CRT diagnostic terminal',
      'Interlocking blast door wheel latches with yellow caution chevrons',
      'Emergency decontamination purge levers behind sealed glass',
    ],
  },
]

// ---------------------------------------------------------------------------
// 2. Canonical Evidence Definitions (12 Detailed Clinical Clues)
// ---------------------------------------------------------------------------

export const WARD13_EVIDENCE: EvidenceDefinition[] = [
  // --- Area 1: Reception ---
  {
    id: 'evidence_intake_log',
    title: 'Project Morpheus Intake Ledger',
    category: 'patient_record',
    roomId: 'reception',
    worldPosition: [1.8, 0.9, 9.8],
    interactionRadius: 2.0,
    loreSource: 'Admissions Desk Ledger, Reception',
    documentExcerpt:
      '“ADMISSIONS LEDGER — PROJECT MORPHEUS. Subject 01: Terminated (Auditory panic). Subject 02: Terminated (Linguistic identity collapse). Subject 03: Terminated (Choice paralysis). ... Subject 07: ACTIVE. Designated Patient 404 (Sigma). Neural tenacity exceeds expected parameters.”',
    diagnosticClaim:
      'Thirteen subjects were systematically brought to Ward 13 to undergo staged stress experiments. Only Subject 07 survived all early phases.',
    trialConnection: 'Referencing Trials 01-03 (Games 01-03).',
  },
  {
    id: 'evidence_triage_memo',
    title: 'Directive 44-B: Emergency Relocation Memo',
    category: 'experimental_memo',
    roomId: 'reception',
    worldPosition: [-2.4, 1.4, 11.2],
    interactionRadius: 2.0,
    loreSource: 'Triage Bulletin Board, Reception',
    documentExcerpt:
      '“MEMORANDUM: IMMEDIATE EVACUATION ORDER. To all Ward 13 clinical staff. Subject 07 has demonstrated cross-trial recall. The subject is recognizing the room architecture and reconstructing memory anchors. Quarantine the ward immediately. Leave telemetry automated.”',
    diagnosticClaim:
      'The clinical staff fled Ward 13 in panic because Subject 07 began remembering that the trials were artificial constructs rather than reality.',
    trialConnection: 'The beginning of Subject 07’s conscious awakening.',
  },

  // --- Area 2: Patient Ward ---
  {
    id: 'evidence_bed_chart_sigma',
    title: 'Bed 07 Vital Telemetry Chart',
    category: 'patient_record',
    roomId: 'patient_ward',
    worldPosition: [3.2, 0.85, 2.5],
    interactionRadius: 2.0,
    loreSource: 'Bed 07 Clipboard Chart, Patient Ward',
    documentExcerpt:
      '“PATIENT CHART: BED 07. Clinical Status at 03:17: Deep comatose state. Cortical activity flat. Reflex suppression total. Subject physically unmoving in restraints during hydraulic surge simulation.”',
    diagnosticClaim:
      'The official hospital chart claims Subject 07 was in an unconscious comatose state with zero cortical activity at 03:17.',
    targetContradictionId: 'evidence_sedation_schedule',
    contradictionKey: 'contradiction_1_physiology',
    contradictionDeduction:
      'The bed chart is a falsified medical cover-up. Subject 07 was never comatose; real biometric monitors show hyper-alert neural exertion.',
    trialConnection: 'Directly references the water surge from The Drowning Hall (Game 05).',
  },
  {
    id: 'evidence_sedation_schedule',
    title: 'Neuro-Chemical Dispensation Log',
    category: 'patient_record',
    roomId: 'patient_ward',
    worldPosition: [-2.8, 0.85, 0.0],
    interactionRadius: 2.0,
    loreSource: 'Medicine Dispenser Trolley, Patient Ward',
    documentExcerpt:
      '“PHARMACY LOG: Haloperidol / Lorazepam stopped 48 hours prior to Trial 05. Actual telemetry shows acute tachycardia (182 BPM) at 03:17. Subject physically manipulated hydraulic valves and navigated shifting maze corridors under full consciousness.”',
    diagnosticClaim:
      'Sedatives were discontinued 48 hours earlier. The subject was fully awake, heart rate spiked to 182 BPM, and physical exertion was recorded.',
    targetContradictionId: 'evidence_bed_chart_sigma',
    contradictionKey: 'contradiction_1_physiology',
    contradictionDeduction:
      'Proves the comatose diagnosis on the bed chart was fabricated to hide that the subject was awake and physically solving the crucibles.',
    trialConnection: 'Validates conscious navigation in Game 05 and Game 06.',
  },

  // --- Area 3: Isolation Room ---
  {
    id: 'evidence_audiotape_transcript',
    title: 'Interrogation Tape Transcript #14',
    category: 'audio_transcript',
    roomId: 'isolation_room',
    worldPosition: [-8.8, 0.85, 0.8],
    interactionRadius: 2.0,
    loreSource: 'Cassette Player Table, Isolation Room',
    documentExcerpt:
      '“INTERVIEW RECORDING — DR. VANCE: ‘You claim you were trapped in a stone hallway with water rising to your neck?’ / SUBJECT 07: ‘It was real. I turned the three rusted valves. You locked the gate.’ / DR. VANCE: ‘It was water vapor and acoustic projection. You were strapped to Bed 07 the entire night.’ / SUBJECT 07: ‘Then why are my hands still bruised from the iron wheels?’”',
    diagnosticClaim:
      'Dr. Vance attempted to convince Subject 07 that their survival struggles were mere sedative-induced hallucinations, despite physical injuries.',
    trialConnection: 'The valve puzzle from The Drowning Hall (Game 05).',
  },
  {
    id: 'evidence_scratched_glyph',
    title: 'Acoustic Wall Inscriptions',
    category: 'altered_photo',
    roomId: 'isolation_room',
    worldPosition: [-11.8, 1.6, 2.2],
    interactionRadius: 1.8,
    loreSource: 'Carved Padded Wall, Isolation Room',
    documentExcerpt:
      '“Etched into the acoustic foam with a fingernail: ‘THEY GAVE US NAMES SO THEY COULD WATCH US FORGET THEM. 11:58. SPECULUM VERITATIS. THE NORTH GLASS WAS THE ONLY EXIT.’ Beneath the text, the exact runic glyphs from the Room of Names are carved in sequence.”',
    diagnosticClaim:
      'Subject 07 successfully retained cross-trial puzzle solutions and the 11:58 pocket watch synchrony from the Mirror Trial.',
    trialConnection: 'Connects Room of Names (Game 02) and Speculum Veritatis (Game 07).',
  },

  // --- Area 4: Observation Room ---
  {
    id: 'evidence_surveillance_screens',
    title: 'Crucible Telemetry Surveillance Playback',
    category: 'surveillance_log',
    roomId: 'observation_room',
    worldPosition: [0, 1.1, -8.8],
    interactionRadius: 2.2,
    loreSource: 'Master CCTV Monitor Array, Observation Room',
    documentExcerpt:
      '“CAMERA FEED 07 — SPECULAR CHAMBER: Real-time surveillance footage shows Subject 07 standing in front of the North mirror. The mirror frame slides sideways, revealing the northern passageway. The subject steps through and enters the service shaft alive at 04:22.”',
    diagnosticClaim:
      'Surveillance footage indisputably proves Subject 07 stepped through the North mirror passage and survived Trial 07 alive.',
    targetContradictionId: 'evidence_autopsy_records',
    contradictionKey: 'contradiction_2_autopsy_fraud',
    contradictionDeduction:
      'The autopsy record certifying Subject 07 died of specular cardiac arrest was a fabricated administrative cover-up.',
    trialConnection: 'The North mirror passage revelation from The Mirror Trial (Game 07).',
  },
  {
    id: 'evidence_experimenter_notes',
    title: 'Dr. Vance’s Research Journal',
    category: 'experimental_memo',
    roomId: 'observation_room',
    worldPosition: [3.2, 0.85, -6.5],
    interactionRadius: 2.0,
    loreSource: 'Observation Console Desk',
    documentExcerpt:
      '“DR. VANCE NOTES: ‘Subject 07 was supposed to succumb during the specular trial. The crimson flame and inverted sand should have induced psychological shock. But the subject identified Speculum Veritatis immediately. As if the subject already knew the rules. As if the subject wrote them.’”',
    diagnosticClaim:
      'The lead experimenter realized that Subject 07 understood the mechanical rules of the trials because Subject 07 had an intimate understanding of the facility design.',
    trialConnection: 'Explains why the player was able to beat Games 01-07.',
  },

  // --- Area 5: Records Archive ---
  {
    id: 'evidence_patient_dossier_sigma',
    title: 'Classified Dossier: Patient 404 (Sigma)',
    category: 'patient_record',
    roomId: 'records_archive',
    worldPosition: [7.5, 1.2, -8.5],
    interactionRadius: 2.0,
    loreSource: 'Locked File Compactor Rack A, Archive',
    documentExcerpt:
      '“DOSSIER #404: Inmate John Doe. Admitted following violent dissociative episode. Selected as involuntary test subject for Project Morpheus survival calibrators. Criminal history: fabricated. Family history: redacted. Real background: CLASSIFIED BY ORDER OF DIRECTOR VANCE.”',
    diagnosticClaim:
      'The official patient dossier claims Subject 07 was a random criminal inmate with a fabricated background.',
    targetContradictionId: 'evidence_altered_photograph',
    contradictionKey: 'contradiction_3_identity_erasure',
    contradictionDeduction:
      'Exposes that the criminal inmate identity was a total fabrication to erase Subject 07’s true status as the co-founding medical director.',
    trialConnection: 'The theme of identity erasure from Room of Names (Game 02).',
  },
  {
    id: 'evidence_altered_photograph',
    title: 'Scraped Ward 13 Staff Portrait (1991)',
    category: 'altered_photo',
    roomId: 'records_archive',
    worldPosition: [10.5, 0.85, -6.0],
    interactionRadius: 2.0,
    loreSource: 'Archive Examination Desk under Banker Lamp',
    documentExcerpt:
      '“A framed black-and-white photograph of the Ward 13 founding research team. Dr. Alistair Vance stands on the left. The figure standing on the right has their face deliberately gouged out with a scalpel. But on their vest pocket hangs the exact ornate silver pocket watch from the North Mirror—frozen at 11:58. The plaque reads: ‘Co-Director: Project Morpheus Safety Oversight.’”',
    diagnosticClaim:
      'The co-director of Ward 13 wore the silver pocket watch from Game 07. The face was obliterated to prevent the subject from recognizing themselves.',
    targetContradictionId: 'evidence_patient_dossier_sigma',
    contradictionKey: 'contradiction_3_identity_erasure',
    contradictionDeduction:
      'The player is the co-director who built the safety override escape hatches into Games 01–07 before being betrayed and imprisoned by Vance.',
    trialConnection: 'The silver pocket watch at 11:58 from Game 07.',
  },
  {
    id: 'evidence_autopsy_records',
    title: 'Pre-Signed Autopsy Certificate #07',
    category: 'patient_record',
    roomId: 'records_archive',
    worldPosition: [11.8, 1.1, -4.5],
    interactionRadius: 2.0,
    loreSource: 'Steel Security Locker, Archive',
    documentExcerpt:
      '“OFFICIAL CORONER CERTIFICATE: Subject 07. Cause of Death: Specular Cardiac Arrest in Mirror Chamber. Time of Death: 04:15. Signed by Dr. A. Vance. DATE OF CERTIFICATION: 24 HOURS BEFORE TRIAL 07 WAS INITIATED.”',
    diagnosticClaim:
      'Subject 07’s death certificate was signed and certified a full day before the Mirror Trial even took place.',
    targetContradictionId: 'evidence_surveillance_screens',
    contradictionKey: 'contradiction_2_autopsy_fraud',
    contradictionDeduction:
      'Proves the trial was a rigged execution rather than a scientific test. Vance never intended Subject 07 to survive.',
    trialConnection: 'The death traps of The Mirror Trial (Game 07).',
  },

  // --- Area 6: Decon Exit Terminal ---
  {
    id: 'evidence_terminal_manifest',
    title: 'Master Decontamination Diagnostic Manifest',
    category: 'terminal_record',
    roomId: 'decon_exit',
    worldPosition: [0, 1.1, -14.2],
    interactionRadius: 2.2,
    loreSource: 'Central Diagnostic Terminal, Ward 13 Exit',
    documentExcerpt:
      '“SYSTEM PROMPT: COGNITIVE OVERRIDE REQUIRES RECONCILIATION OF THREE INSTITUTIONAL CONTRADICTIONS: 1. Physiology vs Bed Chart. 2. Autopsy Fraud vs Surveillance. 3. Identity Erasure vs Photographic Record. RESOLVE ALL THREE TO UNLOCK EXIT BULKHEAD.”',
    diagnosticClaim:
      'The exit terminal requires the cognitive synthesis of all three contradictions before it will allow the survivor to override the facility.',
    trialConnection: 'The ultimate synthesis of Game 08.',
  },
]

// ---------------------------------------------------------------------------
// 3. Contradiction Pairs (The 3 Core Deductions)
// ---------------------------------------------------------------------------

export const WARD13_CONTRADICTIONS: ContradictionPair[] = [
  {
    key: 'contradiction_1_physiology',
    name: 'The Coma Fallacy',
    evidenceIdA: 'evidence_bed_chart_sigma',
    evidenceIdB: 'evidence_sedation_schedule',
    claimA: 'Bed chart certifies Subject 07 was comatose and brain-dead at 03:17.',
    claimB: 'Pharmacy log proves sedatives were stopped 48h prior, heart rate hit 182 BPM, and subject was physically running.',
    resolvedTruth:
      'Subject 07 was never comatose in bed. The physical body was actively forced into real architectural hazard chambers beneath Ward 13.',
    unlockedClearance: 2,
    narrativeRevelation:
      'Your physical body endured the actual trials. You were not hallucinating.',
  },
  {
    key: 'contradiction_2_autopsy_fraud',
    name: 'The Pre-Determined Autopsy',
    evidenceIdA: 'evidence_surveillance_screens',
    evidenceIdB: 'evidence_autopsy_records',
    claimA: 'Live surveillance shows Subject 07 unsealing the North mirror and walking through alive.',
    claimB: 'Coroner report certifies Subject 07 died of heart failure 24 hours prior to the trial.',
    resolvedTruth:
      'The autopsy was pre-signed before the trial began. Dr. Vance rigged the trials to execute you, but your perception outsmarted the lethal mirror illusion.',
    unlockedClearance: 3,
    narrativeRevelation:
      'The experimenters intended your execution. You survived because you saw through their illusions.',
  },
  {
    key: 'contradiction_3_identity_erasure',
    name: 'The Architect’s Erasure',
    evidenceIdA: 'evidence_patient_dossier_sigma',
    evidenceIdB: 'evidence_altered_photograph',
    claimA: 'Classified dossier brands you as an expendable, violent convict named Patient 404.',
    claimB: 'Staff photo reveals you were the co-director who wore the 11:58 pocket watch and designed the safety escape hatches.',
    resolvedTruth:
      'You are not Patient 404. You were the co-director of Project Morpheus who attempted to halt the experiments. Vance silenced you by making you a subject in your own crucible.',
    unlockedClearance: 4,
    narrativeRevelation:
      'You were the architect who built the escape paths into every trial. You saved yourself.',
  },
]

// ---------------------------------------------------------------------------
// 3b. Canonical Dossier & Surveillance Logs
// ---------------------------------------------------------------------------

export const PATIENT_RECORD_SIGMA: PatientRecord = {
  subjectId: 'Patient 404',
  codename: 'Subject Sigma / Subject 07',
  admittedDate: '1991-10-14',
  status: 'cognitive_anomaly',
  trialsCompleted: [1, 2, 3, 4, 5, 6, 7],
  physiologicalData: {
    restingHeartRate: 72,
    peakStressBPM: 182,
    eegPattern: 'Persistent beta-wave coherence during panic induction',
    sedationResistance: 'Acute neuro-chemical tolerance observed',
  },
  investigatorNotes:
    'Subject 07 consistently anticipates procedural traps. Unusually high survival resilience across all crucible iterations.',
}

export const CANONICAL_SURVEILLANCE_LOGS: SurveillanceRecord[] = [
  {
    cameraId: 'CAM-01',
    feedLabel: 'Crucible 01 (Black Silence)',
    targetLocation: 'Acoustic Hallway',
    timestamp: '01:14:22',
    observedBehavior: 'Subject achieved absolute motor suppression during red cycle.',
    anomalyDetected: false,
  },
  {
    cameraId: 'CAM-05',
    feedLabel: 'Crucible 05 (Drowning Hall)',
    targetLocation: 'Hydraulic Chamber',
    timestamp: '03:17:40',
    observedBehavior: 'Subject turned pressure valves in sequential synchrony despite rising water.',
    anomalyDetected: false,
  },
  {
    cameraId: 'CAM-07',
    feedLabel: 'Crucible 07 (Specular Chamber)',
    targetLocation: 'Mirror Rotunda',
    timestamp: '04:15:10',
    observedBehavior: 'Subject bypassed deceptive reflections and unsealed Speculum Veritatis.',
    anomalyDetected: true,
  },
]

export function getPatientRecordSigma(): PatientRecord {
  return PATIENT_RECORD_SIGMA
}

export function getSurveillanceLogs(): SurveillanceRecord[] {
  return CANONICAL_SURVEILLANCE_LOGS
}

// ---------------------------------------------------------------------------
// 4. Canonical Terminal Options (The Final Identity Verdict)
// ---------------------------------------------------------------------------

export const WARD13_TERMINAL_OPTIONS: TerminalOptionDefinition[] = [
  {
    id: 'patient_submission',
    label: 'PATIENT 404 — SUBMIT TO CLINICAL TERMINATION',
    subtext: 'Accept the hospital’s record. Believe that you are a broken inmate who died in the ward.',
    isCorrect: false,
    consequenceSummary:
      'Subject yields to clinical conditioning. Neuro-chemical purge initiated. Cognitive flatline.',
  },
  {
    id: 'researcher_reclaim',
    label: 'CO-DIRECTOR — RECLAIM ARCHITECTURAL AUTHORITY',
    subtext: 'Demand restoration of your research credentials and take control of the Morpheus apparatus.',
    isCorrect: false,
    consequenceSummary:
      'Hubris detected. The Morpheus protocol identifies researcher presence and seals the facility to bury the evidence.',
  },
  {
    id: 'autonomous_survivor',
    label: 'THE SURVIVOR — TERMINATE EXPERIMENT & CLAIM AUTONOMY',
    subtext: 'Reject both the patient’s cage and the doctor’s cruelty. Declare the experiment permanently over.',
    isCorrect: true,
    consequenceSummary:
      'Autonomy acknowledged. Cognitive emancipation verified. Decontamination bulkhead unsealed.',
  },
]

export const WARD13_TERMINAL_PROMPT: TerminalPromptState = {
  promptText:
    'AWAITING COGNITIVE ASSERTION. IDENTIFY YOURSELF TO TERMINATE FACILITY LOCKDOWN:',
  options: WARD13_TERMINAL_OPTIONS,
}

// ---------------------------------------------------------------------------
// 5. State Machine Transition Table
// ---------------------------------------------------------------------------

const VALID_STATE_TRANSITIONS: Record<Game08Status, Game08Status[]> = {
  intro: ['exploring'],
  exploring: [
    'examining',
    'comparing_evidence',
    'terminal_input',
    'failure_cinematic',
    'failed',
  ],
  examining: ['exploring', 'comparing_evidence', 'terminal_input'],
  comparing_evidence: ['exploring', 'examining', 'terminal_input'],
  terminal_input: [
    'terminal_transition',
    'failure_cinematic',
    'exploring',
  ],
  terminal_transition: ['victory_cinematic'],
  failure_cinematic: ['failed'],
  failed: ['intro', 'exploring'],
  victory_cinematic: ['victory'],
  victory: ['next_trial'],
  next_trial: [],
}

// ---------------------------------------------------------------------------
// 6. Pure State Factory Functions
// ---------------------------------------------------------------------------

/**
 * Creates the initial state for Game 08: Ward 13.
 */
export function createInitialWard13State(): Ward13GameState {
  return {
    status: 'intro',
    currentRoomId: 'reception',
    investigation: {
      collectedEvidenceIds: [],
      resolvedContradictionKeys: [],
      activeEvidenceId: null,
      comparedEvidenceIds: null,
      currentClearanceLevel: 1,
      unlockedRoomIds: ['reception'],
      selectedDecision: null,
      isTerminalUnlocked: false,
      identityRevealed: false,
    },
    sanity: 100,
    heartRate: 72,
    alarmsActive: false,
    emergencyPowerActive: true,
    timeElapsed: 0,
  }
}

/**
 * Cleanly resets state back to starting exploration conditions.
 */
export function createResetWard13State(): Ward13GameState {
  const initial = createInitialWard13State()
  return {
    ...initial,
    status: 'exploring',
  }
}

// ---------------------------------------------------------------------------
// 7. Pure Room & Navigation Queries
// ---------------------------------------------------------------------------

export function getRoomDefinitions(): Ward13RoomDefinition[] {
  return WARD13_ROOMS
}

export function getRoomById(id: Ward13RoomId): Ward13RoomDefinition | undefined {
  return WARD13_ROOMS.find((room) => room.id === id)
}

/**
 * Finds which room a given (x, z) coordinate is located within.
 */
export function getRoomByPosition(x: number, z: number): Ward13RoomId {
  for (const room of WARD13_ROOMS) {
    const [minX, minZ] = room.boundingMin
    const [maxX, maxZ] = room.boundingMax
    if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
      return room.id
    }
  }
  return 'patient_ward' // Default fallback to central hub
}

/**
 * Checks if a room is currently unlocked for the player.
 */
export function isRoomUnlocked(
  state: Ward13GameState,
  roomId: Ward13RoomId
): boolean {
  return state.investigation.unlockedRoomIds.includes(roomId)
}

/**
 * Checks whether the player's clearance level permits access to a target room.
 */
export function canAccessRoom(
  clearanceLevel: number,
  roomId: Ward13RoomId
): boolean {
  const room = getRoomById(roomId)
  if (!room) return false
  return clearanceLevel >= room.requiredClearance
}

// ---------------------------------------------------------------------------
// 8. Pure Evidence Queries & Collection
// ---------------------------------------------------------------------------

export function getAllEvidence(): EvidenceDefinition[] {
  return WARD13_EVIDENCE
}

export function getEvidenceById(id: string): EvidenceDefinition | undefined {
  return WARD13_EVIDENCE.find((item) => item.id === id)
}

export function getEvidenceForRoom(roomId: Ward13RoomId): EvidenceDefinition[] {
  return WARD13_EVIDENCE.filter((item) => item.roomId === roomId)
}

/**
 * Adds an evidence item to the collected list without duplicates. Pure function.
 */
export function collectEvidence(
  state: Ward13GameState,
  evidenceId: EvidenceId
): Ward13GameState {
  const def = getEvidenceById(evidenceId)
  if (!def) return state

  if (state.investigation.collectedEvidenceIds.includes(evidenceId)) {
    return {
      ...state,
      investigation: {
        ...state.investigation,
        activeEvidenceId: evidenceId,
      },
    }
  }

  const updatedCollected = [
    ...state.investigation.collectedEvidenceIds,
    evidenceId,
  ]

  // Unlock Patient Ward once both Reception intake records are investigated
  const hasBothReception =
    updatedCollected.includes('evidence_intake_log') &&
    updatedCollected.includes('evidence_triage_memo')

  const updatedUnlockedRooms = [...state.investigation.unlockedRoomIds]
  if (hasBothReception && !updatedUnlockedRooms.includes('patient_ward')) {
    updatedUnlockedRooms.push('patient_ward')
  }

  return {
    ...state,
    investigation: {
      ...state.investigation,
      collectedEvidenceIds: updatedCollected,
      unlockedRoomIds: updatedUnlockedRooms,
      activeEvidenceId: evidenceId,
    },
  }
}

// ---------------------------------------------------------------------------
// 9. Pure Contradiction & Evidence Comparison Mechanics
// ---------------------------------------------------------------------------

export function getAllContradictions(): ContradictionPair[] {
  return WARD13_CONTRADICTIONS
}

export function getContradictionByKey(
  key: string
): ContradictionPair | undefined {
  return WARD13_CONTRADICTIONS.find((pair) => pair.key === key)
}

/**
 * Compares two evidence items to determine if they form a valid contradiction pair.
 * Order-independent pure function.
 */
export function compareEvidence(
  evidenceIdA: EvidenceId,
  evidenceIdB: EvidenceId
): ContradictionPair | null {
  if (evidenceIdA === evidenceIdB) return null

  for (const pair of WARD13_CONTRADICTIONS) {
    const match =
      (pair.evidenceIdA === evidenceIdA && pair.evidenceIdB === evidenceIdB) ||
      (pair.evidenceIdA === evidenceIdB && pair.evidenceIdB === evidenceIdA)
    if (match) {
      return pair
    }
  }
  return null
}

/**
 * Resolves a contradiction, advancing clearance level and unlocking new rooms.
 */
export function resolveContradiction(
  state: Ward13GameState,
  contradictionKey: string
): Ward13GameState {
  const pair = getContradictionByKey(contradictionKey)
  if (!pair) return state

  if (state.investigation.resolvedContradictionKeys.includes(contradictionKey)) {
    return state
  }

  const updatedKeys = [
    ...state.investigation.resolvedContradictionKeys,
    contradictionKey,
  ]

  const newClearance = Math.min(
    MAX_CLEARANCE_LEVEL,
    Math.max(state.investigation.currentClearanceLevel, pair.unlockedClearance)
  )

  // Dynamically compute all unlocked rooms based on new clearance
  const newUnlockedRooms = WARD13_ROOMS.filter(
    (room) => room.requiredClearance <= newClearance
  ).map((room) => room.id)

  const allContradictionsFound = updatedKeys.length >= TOTAL_CONTRADICTIONS_COUNT

  return {
    ...state,
    investigation: {
      ...state.investigation,
      resolvedContradictionKeys: updatedKeys,
      currentClearanceLevel: newClearance,
      unlockedRoomIds: newUnlockedRooms,
      isTerminalUnlocked: allContradictionsFound,
      identityRevealed:
        allContradictionsFound || contradictionKey === 'contradiction_3_identity_erasure',
    },
    heartRate: Math.min(130, state.heartRate + 12),
  }
}

/**
 * Summarizes the current evidence and contradiction progress.
 */
export function calculateEvidenceProgress(state: Ward13GameState): {
  collectedCount: number
  requiredCount: number
  resolvedContradictionsCount: number
  totalContradictionsCount: number
  clearanceLevel: number
  maxClearanceLevel: number
  isReadyForTerminal: boolean
} {
  const collectedCount = state.investigation.collectedEvidenceIds.length
  const resolvedCount = state.investigation.resolvedContradictionKeys.length

  return {
    collectedCount,
    requiredCount: REQUIRED_EVIDENCE_COUNT,
    resolvedContradictionsCount: resolvedCount,
    totalContradictionsCount: TOTAL_CONTRADICTIONS_COUNT,
    clearanceLevel: state.investigation.currentClearanceLevel,
    maxClearanceLevel: MAX_CLEARANCE_LEVEL,
    isReadyForTerminal: resolvedCount >= TOTAL_CONTRADICTIONS_COUNT,
  }
}

export function hasDiscoveredAllContradictions(state: Ward13GameState): boolean {
  return (
    state.investigation.resolvedContradictionKeys.length >=
    TOTAL_CONTRADICTIONS_COUNT
  )
}

// ---------------------------------------------------------------------------
// 10. Pure Terminal Verdict & Decision Validation
// ---------------------------------------------------------------------------

export function getTerminalOptions(): TerminalOptionDefinition[] {
  return WARD13_TERMINAL_OPTIONS
}

export function getTerminalPrompt(): TerminalPromptState {
  return WARD13_TERMINAL_PROMPT
}

export function validateFinalDecision(decision: TerminalDecisionOption): boolean {
  return decision === CORRECT_TERMINAL_DECISION
}

/**
 * Submits the player's final cognitive identity verdict at the exit terminal.
 */
export function submitTerminalDecision(
  state: Ward13GameState,
  decision: TerminalDecisionOption
): {
  state: Ward13GameState
  isCorrect: boolean
} {
  if (!state.investigation.isTerminalUnlocked) {
    return { state, isCorrect: false }
  }

  const isCorrect = validateFinalDecision(decision)

  if (isCorrect) {
    return {
      state: {
        ...state,
        status: 'terminal_transition',
        investigation: {
          ...state.investigation,
          selectedDecision: decision,
        },
      },
      isCorrect: true,
    }
  }

  // Failure path: fatal submission or arrogance delusion
  return {
    state: {
      ...state,
      status: 'failure_cinematic',
      investigation: {
        ...state.investigation,
        selectedDecision: decision,
      },
      alarmsActive: true,
      heartRate: 0, // Flatline
      sanity: 0,
    },
    isCorrect: false,
  }
}

// ---------------------------------------------------------------------------
// 11. Pure State Machine Transition Engine
// ---------------------------------------------------------------------------

export function validateStateTransition(
  currentStatus: Game08Status,
  nextStatus: Game08Status
): boolean {
  if (currentStatus === nextStatus) return true
  const allowed = VALID_STATE_TRANSITIONS[currentStatus]
  return allowed ? allowed.includes(nextStatus) : false
}

export function transitionStatus(
  state: Ward13GameState,
  nextStatus: Game08Status
): Ward13GameState {
  if (!validateStateTransition(state.status, nextStatus)) {
    return state
  }
  return {
    ...state,
    status: nextStatus,
  }
}

// ---------------------------------------------------------------------------
// 12. Spatial Proximity Calculation Functions
// ---------------------------------------------------------------------------

export function calculateDistance(
  x1: number,
  z1: number,
  x2: number,
  z2: number
): number {
  const dx = x1 - x2
  const dz = z1 - z2
  return Math.hypot(dx, dz)
}

/**
 * Finds the nearest interactable evidence to the player's coordinates within threshold.
 */
export function getNearestEvidence(
  playerX: number,
  playerZ: number,
  threshold: number = 2.2
): EvidenceDefinition | null {
  let nearest: EvidenceDefinition | null = null
  let minDistance = Infinity

  for (const item of WARD13_EVIDENCE) {
    const dist = calculateDistance(
      playerX,
      playerZ,
      item.worldPosition[0],
      item.worldPosition[2]
    )
    if (dist <= threshold && dist < minDistance) {
      minDistance = dist
      nearest = item
    }
  }

  return nearest
}

/**
 * Returns player spawn position.
 */
export function getPlayerSpawnPosition(): Vector3Tuple {
  return [...INITIAL_WARD13_POS]
}
