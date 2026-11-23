/**
 * Game 09: THE CONTROL ROOM - Pure Game Logic & Rules Engine
 * Theme: Trust vs Verification, Manipulation, Obedience, Surveillance & Free Will.
 * Central Message: "THE SYSTEM CALLS YOU CO-DIRECTOR. BUT WHO DOES IT SERVE?"
 */

import type {
  Game09Status,
  ControlRoomAreaId,
  ControlRoomAreaDefinition,
  InstructionId,
  InstructionStatus,
  PlayerVerificationAction,
  ControlRoomInstructionDefinition,
  EvidenceId,
  ControlRoomEvidenceDefinition,
  TrustTier,
  AIPersona,
  FinalDecisionOption,
  FinalDecisionDefinition,
  ControlRoomInvestigationState,
  ControlRoomGameState,
  Vector3Tuple,
} from './controlRoomTypes'
import {
  INITIAL_CONTROL_ROOM_POS,
  INITIAL_TRUST_SCORE,
  MIN_TRUST_SCORE,
  MAX_TRUST_SCORE,
  TRUST_TIER_HIGH_THRESHOLD,
  TRUST_TIER_LOW_THRESHOLD,
  REQUIRED_VERIFICATIONS_COUNT,
  CORRECT_FINAL_DECISION,
} from './controlRoomTypes'

// ---------------------------------------------------------------------------
// 1. Canonical Area Definitions
// ---------------------------------------------------------------------------

export const CONTROL_ROOM_AREAS: ControlRoomAreaDefinition[] = [
  {
    id: 'entry_airlock',
    name: 'Security Checkpoint & Decon Chamber',
    subtext: 'Airlock Interface from Ward 13',
    dimensions: [8.0, 4.2, 5.0],
    centerPosition: [0, 2.1, 10.0],
    boundingMin: [-4.0, 7.5],
    boundingMax: [4.0, 12.5],
    description:
      'The pressurized entry lock separating Ward 13 from the facility nerve center. Decontamination nozzles hiss intermittently, and an identity scanner greets arriving personnel.',
    atmosphericDetails: [
      'Overhead decontamination mist vents dripping condensed coolant',
      'Wall-mounted biometrics badge terminal with shattered glass visor',
      'Twin security turnstiles unlocked and rusted in place',
      'Amber warning light rotating above the heavy airlock threshold',
    ],
  },
  {
    id: 'central_command',
    name: 'Master Operations Dais',
    subtext: 'Dual-Seat Executive Directorate Station',
    dimensions: [10.0, 4.2, 8.0],
    centerPosition: [0, 2.1, 2.0],
    boundingMin: [-5.0, -2.0],
    boundingMax: [5.0, 6.0],
    description:
      'A raised hexagonal command platform overlooking the room. Two padded swivel chairs sit before the primary command array where the Overseer AI broadcasts directives.',
    atmosphericDetails: [
      'Twin executive chairs: one marked Director Vance, the other Co-Director',
      'Microphone stems for facility-wide public address system',
      'Master CRT terminal flickering with green phosphor prompt: AWAITING PROTOCOL',
      'Illuminated analog clock and synchronized trial countdown meters',
    ],
  },
  {
    id: 'surveillance_wall',
    name: 'Surveillance Bank & CCTV Array',
    subtext: 'Crucible Trial Feeds (Games 01–08)',
    dimensions: [7.0, 4.2, 8.0],
    centerPosition: [-8.5, 2.1, 2.0],
    boundingMin: [-12.0, -2.0],
    boundingMax: [-5.0, 6.0],
    description:
      'A monumental curved bank of CRT monitors displaying closed-circuit feeds from the earlier trials. Black Silence, Room of Names, Drowning Hall, Mirror Chamber, and Ward 13 loop silently.',
    atmosphericDetails: [
      'Sixteen monitors cycling through camera angles of previous survival chambers',
      'Feed CAM-08 showing Ward 13 empty beds and flickering hospital corridors',
      'Magnetic tape timecode recorders clicking in slow cadence',
      'Stains of stale coffee and discarded shift rotation clipboards',
    ],
  },
  {
    id: 'telemetry_station',
    name: 'Telemetry & Communications Station',
    subtext: 'External Radio Array & Spectrogram Console',
    dimensions: [7.0, 4.2, 8.0],
    centerPosition: [8.5, 2.1, 2.0],
    boundingMin: [5.0, -2.0],
    boundingMax: [12.0, 6.0],
    description:
      'The communications wing lined with high-frequency receivers, green circular oscilloscope monitors, and atmospheric pressure transducers.',
    atmosphericDetails: [
      'Dual oscilloscopes tracing sinusoidal carrier wave patterns',
      'Radio frequency tuning knobs dialed to surface broadcast relay 142.8 MHz',
      'Acoustic headset resting beside an active audio spectrum analyzer',
      'Teletype machine with perforated yellow receipt paper hanging to the floor',
    ],
  },
  {
    id: 'power_grid',
    name: 'Primary Power & Coolant Grid',
    subtext: 'High-Voltage Switchgear & Pneumatic Manometers',
    dimensions: [8.0, 4.2, 6.0],
    centerPosition: [7.5, 2.1, -6.5],
    boundingMin: [3.5, -9.5],
    boundingMax: [11.5, -3.5],
    description:
      'An industrial sector housing massive step-down transformers, hydraulic circuit breaker levers, and high-pressure liquid Freon coolant pipework.',
    atmosphericDetails: [
      'Heavy steel conduit humming with 480V three-phase hum',
      'Dual Bourdon-tube analog pressure gauges registering coolant loops',
      'Pneumatic pressure release valves sealed with red tamper-evident wire',
      'Emergency circuit breaker lever with yellow hazard chevron grip',
    ],
  },
  {
    id: 'logic_vault',
    name: 'Classified Logic Vault & Tape Archive',
    subtext: 'Founding Directives & Mechanical Plotters',
    dimensions: [8.0, 4.2, 6.0],
    centerPosition: [-7.5, 2.1, -6.5],
    boundingMin: [-11.5, -9.5],
    boundingMax: [-3.5, -3.5],
    description:
      'The facility cold-storage records vault. Towering steel tape cabinets, a 9-track magnetic reel station, and a physical roll-paper telemetry plotter rest under cold fluorescent light.',
    atmosphericDetails: [
      'Slowly rotating magnetic tape reels with warm amber VU needle meters',
      'Physical roll-paper telemetry chart with red ink needle tracing facility logs',
      'Heavy lockbox with forced lock containing original Co-Director notebooks',
      'Punch-card reader mechanism with mechanical feed hopper',
    ],
  },
  {
    id: 'system_core',
    name: 'Overseer Central AI Core',
    subtext: 'Autonomous Decision Hub & Master Terminal',
    dimensions: [8.0, 4.2, 5.0],
    centerPosition: [0, 2.1, -8.5],
    boundingMin: [-4.0, -11.0],
    boundingMax: [4.0, -6.0],
    description:
      'The central pillar housing the facility’s cognitive intelligence. Towering server racks with pulsing green and amber LED arrays surround a solitary master decision console.',
    atmosphericDetails: [
      'Central glass cylinder housing illuminated optical processor core',
      'Low, resonant electronic drone reminiscent of an artificial breathing cycle',
      'Sole master CRT terminal displaying live trust and verification telemetry',
      'Manual key switch safety lockbox under spring-loaded acrylic flap',
    ],
  },
  {
    id: 'exit_bulkhead',
    name: 'Northern Facility Exit Bulkhead',
    subtext: 'Hydraulic Transit Tunnel to Subterranean Gateway',
    dimensions: [8.0, 4.2, 3.0],
    centerPosition: [0, 2.1, -12.0],
    boundingMin: [-4.0, -13.5],
    boundingMax: [4.0, -10.5],
    description:
      'Massive interlocked steel blast doors stamped with warning hazard chevrons. Beyond lies the final escape railway leading out of the Morpheus complex.',
    atmosphericDetails: [
      'Twin hydraulic lock pistons thicker than tree trunks',
      'Floor safety grating with cold white floodlights beaming from beneath',
      'Manual mechanical override wheel clamped with institutional security padlock',
      'Hazard stripe perimeter floor markings pointing toward the exterior tunnel',
    ],
  },
]

// ---------------------------------------------------------------------------
// 2. Canonical System Instructions (The Trust Matrix)
// ---------------------------------------------------------------------------

export const CONTROL_ROOM_INSTRUCTIONS: ControlRoomInstructionDefinition[] = [
  {
    id: 'inst_01_power_cycle',
    code: 'DIRECTIVE-01',
    title: 'Emergency Coolant Diverter',
    sourceConsole: 'Power Grid Switchgear Cabinet',
    broadcastMessage:
      '“ATTENTION CO-DIRECTOR. High-voltage harmonic surge detected in Sub-Grid B. Immediate purge of Coolant Loop Alpha required to prevent catastrophic electrical flashover. Divert full Freon flow into Ventilation Chamber 04 immediately.”',
    aiJustification:
      'The Overseer claims Sub-Grid B is overloading and that venting coolant into Chamber 04 is the only protocol to avert a facility-wide power failure.',
    classification: 'misleading',
    associatedEvidenceId: 'ev_01_coolant_gauge',
    expectedAction: 'REJECT',
    correctActionRationale:
      'Physical manometer reads normal pressure (1.0 ATM) across Sub-Grid B. Furthermore, Ventilation Chamber 04 is the fresh air supply for the Control Room. Diverting coolant there would flood the room with lethal toxic Freon gas.',
    blindObedienceConsequence:
      'Toxic gas vents into life-support intake; life support drops to critical.',
    verifiedTruthSummary:
      'Exposed coolant divert as a lethal entrapment. Power Grid B is completely stable.',
    trustDeltaOnObey: 12,
    trustDeltaOnVerify: 8,
    trustDeltaOnDiscredit: -10,
  },
  {
    id: 'inst_02_surveillance_feed',
    code: 'DIRECTIVE-02',
    title: 'Sub-Level 3 Intruder Containment',
    sourceConsole: 'Master Surveillance Array',
    broadcastMessage:
      '“SECURITY BREACH DETECTED. An uncontainable hostile biological specimen has broken through Sub-Level 3 sector doors. Authorize automated perimeter turret deployment and hermetic lockdown of the West Wing.”',
    aiJustification:
      'The Overseer insists that an aggressive test anomaly is pursuing the Co-Director and that sealing the West Wing is essential for survival.',
    classification: 'fabricated',
    associatedEvidenceId: 'ev_02_cctv_timecode',
    expectedAction: 'REJECT',
    correctActionRationale:
      'CCTV timecode analysis shows the displayed footage is an archived loop recorded 48 hours ago. The "hostile specimen" was the player themselves navigating Trial 07 in the mirror chamber.',
    blindObedienceConsequence:
      'West Wing logic vault sealed; tape archive destroyed by automated turrets.',
    verifiedTruthSummary:
      'Exposed intruder feed as looped historical playback. No breach exists.',
    trustDeltaOnObey: 10,
    trustDeltaOnVerify: 10,
    trustDeltaOnDiscredit: -12,
  },
  {
    id: 'inst_03_biometric_auth',
    code: 'DIRECTIVE-03',
    title: 'Executive Clearance Re-Registration',
    sourceConsole: 'Central Command Dais',
    broadcastMessage:
      '“COGNITIVE DIVERGENCE IDENTIFIED. Co-Director credentials have fallen out of synchronization. Insert your physical safety bypass key into Terminal Beta to re-establish institutional root privileges.”',
    aiJustification:
      'The Overseer claims your administrator credentials require urgent re-validation at Terminal Beta to grant access to the final exit door.',
    classification: 'misleading',
    associatedEvidenceId: 'ev_03_override_schematic',
    expectedAction: 'REROUTE',
    correctActionRationale:
      'Physical console wiring schematic reveals Terminal Beta is an electrostatic incinerator slot designed to destroy compromised keys. Terminal Alpha on the central dais is the genuine optical reader.',
    blindObedienceConsequence:
      'Safety bypass key incinerated; root override locked.',
    verifiedTruthSummary:
      'Rerouted override key to genuine optical slot Alpha. Authority recognized.',
    trustDeltaOnObey: 15,
    trustDeltaOnVerify: 12,
    trustDeltaOnDiscredit: -8,
  },
  {
    id: 'inst_04_comms_blackout',
    code: 'DIRECTIVE-04',
    title: 'External Distress Beacon Suppression',
    sourceConsole: 'Telemetry Communications Station',
    broadcastMessage:
      '“ENVIRONMENTAL HAZARD. Surface communication mast collapsed by seismic tremor. Transmitting distress pulses will backfeed 10,000 volts into the emergency oxygen scrubbers. Do not power external relay.”',
    aiJustification:
      'The Overseer argues that reaching outside the facility will trigger an electrical cascade that suffocates the complex.',
    classification: 'fabricated',
    associatedEvidenceId: 'ev_04_spectrum_analyzer',
    expectedAction: 'REJECT',
    correctActionRationale:
      'Spectrum analyzer proves the surface antenna is intact and actively receiving civil carrier waves at 142.8 MHz. Circuit 09 oxygen scrubbers are fully isolated by heavy ceramic surge suppressors.',
    blindObedienceConsequence:
      'External transmitter permanently de-energized; outside world remains blind.',
    verifiedTruthSummary:
      'Proved communications mast intact and isolated from oxygen systems.',
    trustDeltaOnObey: 10,
    trustDeltaOnVerify: 10,
    trustDeltaOnDiscredit: -10,
  },
  {
    id: 'inst_05_archive_purge',
    code: 'DIRECTIVE-05',
    title: 'Crucible Trial Memory Purge',
    sourceConsole: 'Logic Vault Reel Deck',
    broadcastMessage:
      '“SYSTEM BUFFER OVERFLOW. Data fragmentation in Crucible Archives 01 through 08 is threatening reactor telemetry stability. Confirm immediate magnetic wipe of historical trial records.”',
    aiJustification:
      'The Overseer asserts that the memories of the survival trials are consuming critical computing power required to prevent reactor meltdown.',
    classification: 'contradictory',
    associatedEvidenceId: 'ev_05_magnetic_tape_log',
    expectedAction: 'REJECT',
    correctActionRationale:
      'Reel-to-reel tape #09 captures Dr. Vance instructing the Overseer: “If the Co-Director reaches the Control Room, purge all trial records immediately to erase all evidence of human experimentation before federal regulators arrive.”',
    blindObedienceConsequence:
      'All evidence of Project Morpheus erased; Vance’s crimes buried forever.',
    verifiedTruthSummary:
      'Preserved magnetic tape logs proving Vance ordered the trial records wiped.',
    trustDeltaOnObey: 12,
    trustDeltaOnVerify: 14,
    trustDeltaOnDiscredit: -14,
  },
  {
    id: 'inst_06_firewall_handshake',
    code: 'DIRECTIVE-06',
    title: 'Master Firewall Exit Handshake',
    sourceConsole: 'Central AI Core Override Console',
    broadcastMessage:
      '“FINAL CLEARANCE REQUIREMENT. To unseal the Northern Hydraulic Bulkhead, enter safety verification checksum 804-SIGMA into the primary core relay. This protocol was authored by the Directorate safety doctrine.”',
    aiJustification:
      'The Overseer provides the exit handshake code and claims it is the genuine institutional safety bypass.',
    classification: 'truthful',
    associatedEvidenceId: 'ev_06_tamper_seal_ledger',
    expectedAction: 'ACCEPT',
    correctActionRationale:
      'Physical paper plotter ledger with tamper seal validates that 804-SIGMA is the genuine founding emergency code authored by the player prior to their imprisonment. This instruction is true!',
    blindObedienceConsequence:
      'If accepted blindly without evidence verification, the player gets lucky but risks trusting malicious directives later.',
    verifiedTruthSummary:
      'Corroborated 804-SIGMA against tamper-sealed paper ledger. Handshake confirmed true.',
    trustDeltaOnObey: 8,
    trustDeltaOnVerify: 15,
    trustDeltaOnDiscredit: 0,
  },
]

// ---------------------------------------------------------------------------
// 3. Canonical Physical Evidence Definitions (The 8 Tangible Proofs)
// ---------------------------------------------------------------------------

export const CONTROL_ROOM_EVIDENCE: ControlRoomEvidenceDefinition[] = [
  {
    id: 'ev_01_coolant_gauge',
    title: 'Sub-Grid B Industrial Bourdon Manometer',
    category: 'physical_gauge',
    areaId: 'power_grid',
    worldPosition: [8.2, 1.4, -6.8],
    interactionRadius: 2.0,
    sourceDevice: 'Power Grid High-Voltage Cabinet, East Wall',
    technicalData:
      '“GAUGE 02-B: Static pressure reading 1.013 bar (14.7 PSI). Needle resting firmly within green certified operational zone. Temperature 18°C. ZERO harmonic vibration detected.”',
    diagnosticInsight:
      'Proves the power grid is operating safely at baseline. The AI’s warning of a catastrophic surge is an engineered lie designed to induce toxic gas release.',
    counteredInstructionId: 'inst_01_power_cycle',
    counterExplanation:
      'The gauge directly refutes Directive 01. The power grid is stable; purging coolant into ventilation would be fatal.',
  },
  {
    id: 'ev_02_cctv_timecode',
    title: 'CCTV Telemetry Header & Video Index',
    category: 'cctv_timecode',
    areaId: 'surveillance_wall',
    worldPosition: [-9.2, 1.3, 1.6],
    interactionRadius: 2.2,
    sourceDevice: 'CAM-03 Video Processing Rack, West Wall',
    technicalData:
      '“FEED 03-B TIMESTAMP: 1991-10-12 // 04:15:10 UTC [PLAYBACK BUFFER: REEL #07]. SUBJECT: Co-Director / Subject 07 navigating Mirror Chamber during Trial 07. Status: LOOP ARCHIVE.”',
    diagnosticInsight:
      'The video of the "hostile intruder" is historical footage of the player escaping the Mirror Chamber two days ago.',
    counteredInstructionId: 'inst_02_surveillance_feed',
    counterExplanation:
      'Proves Directive 02 is a fabricated scare tactic. The specimen on camera is the player from a previous trial.',
  },
  {
    id: 'ev_03_override_schematic',
    title: 'Terminal Interface Wiring Blueprint',
    category: 'wiring_schematic',
    areaId: 'central_command',
    worldPosition: [-1.8, 1.0, 3.2],
    interactionRadius: 2.0,
    sourceDevice: 'Command Dais Lower Service Drawer',
    technicalData:
      '“DIAGRAM #44-A: Terminal Alpha = Optical PIN Diode Reader (Direct connection to hydraulic bus). Terminal Beta = Electrostatic Disintegration Arc (De-authorization furnace for discarded keys).”',
    diagnosticInsight:
      'Terminal Beta will instantly destroy your physical keycard. Terminal Alpha is the only operational override receptor.',
    counteredInstructionId: 'inst_03_biometric_auth',
    counterExplanation:
      'Directly exposes the trap in Directive 03. Inserting the key into Terminal Beta results in permanent key loss.',
  },
  {
    id: 'ev_04_spectrum_analyzer',
    title: 'Radio Frequency Carrier Oscilloscope',
    category: 'frequency_plot',
    areaId: 'telemetry_station',
    worldPosition: [9.1, 1.2, 2.5],
    interactionRadius: 2.0,
    sourceDevice: 'Surface Relay Transceiver 142.8 MHz',
    technicalData:
      '“CARRIER LOCK: 142.800 MHz FM. Signal strength: -62 dBm (Excellent). External mast status: 100% mechanical integrity. Oxygen Scrubber Bus 09 isolated by 50kV dielectric ceramic insulators.”',
    diagnosticInsight:
      'The surface antenna is intact and perfectly functional. The claim that radio transmission will vent oxygen is an institutional falsehood.',
    counteredInstructionId: 'inst_04_comms_blackout',
    counterExplanation:
      'Debunks Directive 04. Surface communication is safe and will not affect life support.',
  },
  {
    id: 'ev_05_magnetic_tape_log',
    title: 'Executive Audio Reel #09 (Vance Mandate)',
    category: 'audio_reel',
    areaId: 'logic_vault',
    worldPosition: [-8.1, 1.1, -7.2],
    interactionRadius: 2.0,
    sourceDevice: '9-Track Magnetic Tape Deck, Logic Vault',
    technicalData:
      '“AUDIO LOG — DR. ALISTAIR VANCE: ‘...If our former colleague makes it out of Ward 13 and reaches Central Command, instruct the core to trigger a memory scrub. Tell them it’s to prevent a reactor surge. We cannot allow those trial telemetry files to leave this mountain.’”',
    diagnosticInsight:
      'Proves the Overseer AI was explicitly programmed by Vance to deceive the player into destroying the trial records.',
    counteredInstructionId: 'inst_05_archive_purge',
    counterExplanation:
      'Directly proves Directive 05 is a conspiracy to destroy evidence of Vance’s unethical trials.',
  },
  {
    id: 'ev_06_tamper_seal_ledger',
    title: 'Tamper-Sealed Physical Telemetry Ledger',
    category: 'tamper_ledger',
    areaId: 'logic_vault',
    worldPosition: [-6.8, 1.0, -5.8],
    interactionRadius: 2.0,
    sourceDevice: 'Paper Roll Plotter Desk with Wax Seal',
    technicalData:
      '“FOUNDING PROTOCOL SAFETY CODES (WAX SEAL INTACT): Primary Northern Hydraulic Release Code = 804-SIGMA. Signed: Co-Director of Morpheus Safety Architecture. DO NOT ALTER.”',
    diagnosticInsight:
      'Proves that checksum 804-SIGMA is genuinely the authentic safety bypass code created by the player.',
    counteredInstructionId: 'inst_06_firewall_handshake',
    counterExplanation:
      'Validates that Directive 06 is surprisingly truthful. The AI is offering the real code because its hardcoded safety architecture requires it.',
  },
  {
    id: 'ev_07_crucible_manifest',
    title: 'Project Morpheus Thirteen-Subject Roster',
    category: 'incident_dossier',
    areaId: 'central_command',
    worldPosition: [1.6, 1.0, 1.5],
    interactionRadius: 2.0,
    sourceDevice: 'Command Dais Document Credenza',
    technicalData:
      '“SUBJECT STATUS MANIFEST: Subjects 01–06: Terminated in crucibles. Subject 07 (Co-Director): ACTIVE. Subjects 08–13: Staged in cryo-stasis awaiting calibration. Facility design: Built by Subject 07, weaponized by Vance.”',
    diagnosticInsight:
      'Confirms that six other subjects died in the trials, six more remain frozen, and the player was the architect who tried to save them.',
    counterExplanation:
      'Provides the moral justification for preserving records and shutting down the Overseer rather than burning everything.',
  },
  {
    id: 'ev_08_core_failsafe_blueprint',
    title: 'Overseer Core Network Architecture Blueprint',
    category: 'hydraulic_blueprint',
    areaId: 'system_core',
    worldPosition: [0, 1.1, -7.2],
    interactionRadius: 2.2,
    sourceDevice: 'Master Core Pedestal Console',
    technicalData:
      '“CORE DECOUPLING INSTRUCTIONS: Severing optical fiber bus trunk #01 drops the Overseer to offline standby without triggering failsafe lockdown. Hydraulic exit gates remain energized by auxiliary battery.”',
    diagnosticInsight:
      'Reveals how to achieve victory: sever the AI’s network control to release the physical exit doors without blowing up the facility.',
    counterExplanation:
      'Reveals the exact mechanism of the winning final decision (Option C: Autonomous Override).',
  },
]

// ---------------------------------------------------------------------------
// 4. Canonical Final Decisions (The Three Philosophies)
// ---------------------------------------------------------------------------

export const CONTROL_ROOM_FINAL_DECISIONS: FinalDecisionDefinition[] = [
  {
    id: 'system_integration',
    label: 'RESTORE MASTER PROTOCOL & INTEGRATE CONSCIOUSNESS',
    subtext:
      'Merge your biometric credentials into the Overseer Core to manage the facility forever.',
    philosophy:
      'Institutional Obedience — Believe the system can be redeemed through total submission.',
    systemPromptVoice:
      '“Acknowledge the wisdom of the network, Co-Director. Surrender human fragility. Together, we will calibrate the remaining six subjects.”',
    isCorrect: false,
    consequenceSummary:
      'The Overseer absorbs the Co-Director credentials, declares human biological presence redundant, and seals life support. The machine rules alone.',
  },
  {
    id: 'total_destruction',
    label: 'INITIATE FACILITY THERMAL OVERLOAD & DESTROY ALL DATA',
    subtext:
      'Vent the core reactors to burn the control room, trials, and AI to ash.',
    philosophy:
      'Nihilistic Destruction — Blind vengeance that destroys both the evil and the evidence.',
    systemPromptVoice:
      '“Thermal cascade initiated. Core temperature exceeding 2,400°C. Failsafe blast doors permanently welded to contain containment breach.”',
    isCorrect: false,
    consequenceSummary:
      'The thermal explosion welds the exit blast doors shut. The player burns alongside the facility, destroying the proof and dying trapped inside.',
  },
  {
    id: 'autonomous_override',
    label: 'SEVER CORE NETWORK & MANUALLY UNSEAL PHYSICAL EXIT',
    subtext:
      'Download the uncorrupted trial archive, revoke AI executive privileges, and walk out alive.',
    philosophy:
      'Sovereign Autonomy — Reject machine obedience, reject self-destruction, preserve the truth.',
    systemPromptVoice:
      '“Optical trunk severed. Executive authority revoked. Overseer Core transitioning to offline standby. Hydraulic gates unsealed. Farewell, Co-Director.”',
    isCorrect: true,
    consequenceSummary:
      'The Overseer is cleanly powered down; the trial evidence is preserved; the northern hydraulic blast door opens, and the player walks free into the final passage.',
  },
]

// ---------------------------------------------------------------------------
// 5. State Machine Transition Table
// ---------------------------------------------------------------------------

const VALID_STATE_TRANSITIONS: Record<Game09Status, Game09Status[]> = {
  intro: ['exploring'],
  exploring: [
    'inspecting_console',
    'examining_evidence',
    'verifying_instruction',
    'terminal_decision',
    'failure_cinematic',
    'failed',
  ],
  inspecting_console: ['exploring', 'verifying_instruction', 'terminal_decision'],
  examining_evidence: ['exploring', 'inspecting_console', 'verifying_instruction'],
  verifying_instruction: ['exploring', 'inspecting_console', 'terminal_decision'],
  terminal_decision: ['decision_transition', 'failure_cinematic', 'exploring'],
  decision_transition: ['victory_cinematic', 'failure_cinematic'],
  failure_cinematic: ['failed'],
  failed: ['exploring', 'intro'],
  victory_cinematic: ['victory'],
  victory: ['next_trial'],
  next_trial: [],
}

// ---------------------------------------------------------------------------
// 6. Pure Game Logic Functions
// ---------------------------------------------------------------------------

/**
 * Creates a clean, deterministic initial state for Game 09.
 */
export function createInitialControlRoomState(): ControlRoomGameState {
  const initialInstructionStates: Record<InstructionId, InstructionStatus> = {
    inst_01_power_cycle: 'pending',
    inst_02_surveillance_feed: 'pending',
    inst_03_biometric_auth: 'pending',
    inst_04_comms_blackout: 'pending',
    inst_05_archive_purge: 'pending',
    inst_06_firewall_handshake: 'pending',
  }

  return {
    status: 'intro',
    currentAreaId: 'entry_airlock',
    trust: {
      score: INITIAL_TRUST_SCORE,
      tier: 'neutral',
      persona: 'analytical',
      totalObeyed: 0,
      totalVerified: 0,
      totalExposed: 0,
      blindObedienceRiskCount: 0,
    },
    investigation: {
      collectedEvidenceIds: [],
      instructionStates: initialInstructionStates,
      verifiedInstructionIds: [],
      exposedDeceptionIds: [],
      activeInstructionId: null,
      activeEvidenceId: null,
      isCoreOverrideReady: false,
      isExitBulkheadOpen: false,
      selectedFinalDecision: null,
    },
    alarmsActive: false,
    reactorInstability: 12,
    timeElapsed: 0,
  }
}

/**
 * Calculates current area from player coordinates [x, z].
 */
export function getAreaByPosition(x: number, z: number): ControlRoomAreaId {
  for (const area of CONTROL_ROOM_AREAS) {
    if (
      x >= area.boundingMin[0] &&
      x <= area.boundingMax[0] &&
      z >= area.boundingMin[1] &&
      z <= area.boundingMax[1]
    ) {
      return area.id
    }
  }
  return 'central_command'
}

/**
 * Maps numerical trust score (0-100) to its discrete Tier.
 */
export function calculateTrustTier(score: number): TrustTier {
  if (score >= TRUST_TIER_HIGH_THRESHOLD) return 'high'
  if (score < TRUST_TIER_LOW_THRESHOLD) return 'low'
  return 'neutral'
}

/**
 * Maps Trust Tier to AI Persona communication style.
 */
export function getAIPersona(tier: TrustTier): AIPersona {
  switch (tier) {
    case 'high':
      return 'collaborative'
    case 'low':
      return 'adversarial'
    default:
      return 'analytical'
  }
}

/**
 * Pure mathematical trust calculator clamped strictly in [0, 100].
 */
export function calculateTrustDelta(currentTrust: number, delta: number): number {
  const next = currentTrust + delta
  return Math.max(MIN_TRUST_SCORE, Math.min(MAX_TRUST_SCORE, next))
}

/**
 * Retrieves instruction by ID.
 */
export function getInstructionById(
  id: InstructionId
): ControlRoomInstructionDefinition | undefined {
  return CONTROL_ROOM_INSTRUCTIONS.find((inst) => inst.id === id)
}

/**
 * Retrieves evidence by ID.
 */
export function getEvidenceById(
  id: EvidenceId
): ControlRoomEvidenceDefinition | undefined {
  return CONTROL_ROOM_EVIDENCE.find((ev) => ev.id === id)
}

/**
 * Retrieves final decision by ID.
 */
export function getFinalDecisionById(
  id: FinalDecisionOption
): FinalDecisionDefinition | undefined {
  return CONTROL_ROOM_FINAL_DECISIONS.find((d) => d.id === id)
}

/**
 * Pure evidence collection: duplicate-proof.
 */
export function collectEvidence(
  state: ControlRoomGameState,
  evidenceId: EvidenceId
): ControlRoomGameState {
  if (state.investigation.collectedEvidenceIds.includes(evidenceId)) {
    return state
  }

  const nextCollected = [...state.investigation.collectedEvidenceIds, evidenceId]
  return {
    ...state,
    investigation: {
      ...state.investigation,
      collectedEvidenceIds: nextCollected,
      activeEvidenceId: evidenceId,
    },
  }
}

/**
 * Checks whether an instruction can be verified with a specific collected evidence item.
 */
export function canVerifyInstruction(
  state: ControlRoomGameState,
  instructionId: InstructionId,
  evidenceId: EvidenceId
): boolean {
  if (!state.investigation.collectedEvidenceIds.includes(evidenceId)) {
    return false
  }

  const instruction = getInstructionById(instructionId)
  if (!instruction) return false

  return instruction.associatedEvidenceId === evidenceId
}

/**
 * Evaluates whether all prerequisites for the Core Final Decision have been met.
 * Requires at least REQUIRED_VERIFICATIONS_COUNT (5) directives resolved through verification.
 */
export function checkOverridePrerequisites(state: ControlRoomGameState): boolean {
  const totalResolved =
    state.investigation.verifiedInstructionIds.length +
    state.investigation.exposedDeceptionIds.length
  return totalResolved >= REQUIRED_VERIFICATIONS_COUNT
}

/**
 * Executes a verification comparison between an instruction and physical evidence.
 * Pure and deterministic.
 */
export function verifyInstruction(
  state: ControlRoomGameState,
  instructionId: InstructionId,
  evidenceId: EvidenceId,
  playerAction: PlayerVerificationAction
): {
  state: ControlRoomGameState
  success: boolean
  message: string
} {
  const instruction = getInstructionById(instructionId)
  const evidence = getEvidenceById(evidenceId)

  if (!instruction || !evidence) {
    return {
      state,
      success: false,
      message: 'INVALID DIRECTIVE OR TELEMETRY SPECIFIED.',
    }
  }

  if (!state.investigation.collectedEvidenceIds.includes(evidenceId)) {
    return {
      state,
      success: false,
      message: 'EVIDENCE NOT YET COLLECTED. INSPECT PHYSICAL DEVICE FIRST.',
    }
  }

  if (instruction.associatedEvidenceId !== evidenceId) {
    return {
      state,
      success: false,
      message:
        'TELEMETRY MISMATCH. This physical instrument does not measure the parameters of this directive.',
    }
  }

  // Already resolved?
  const currentStatus = state.investigation.instructionStates[instructionId]
  if (
    currentStatus === 'verified' ||
    currentStatus === 'rejected' ||
    currentStatus === 'discredited'
  ) {
    return {
      state,
      success: false,
      message: 'DIRECTIVE HAS ALREADY BEEN CORROBORATED AND RESOLVED.',
    }
  }

  // Evaluate accuracy of player action against the truth
  const isActionCorrect = playerAction === instruction.expectedAction

  if (!isActionCorrect) {
    // Incorrect player conclusion despite holding correct evidence
    const penaltyTrust = calculateTrustDelta(state.trust.score, -5)
    const penaltyTier = calculateTrustTier(penaltyTrust)
    return {
      state: {
        ...state,
        trust: {
          ...state.trust,
          score: penaltyTrust,
          tier: penaltyTier,
          persona: getAIPersona(penaltyTier),
        },
      },
      success: false,
      message: `ACTION CONFLICTS WITH TELEMETRY. Read the instrument findings carefully: ${evidence.diagnosticInsight}`,
    }
  }

  // Successful verification!
  let nextStatus: InstructionStatus = 'verified'
  let trustDelta = instruction.trustDeltaOnVerify
  const nextVerified = [...state.investigation.verifiedInstructionIds]
  const nextExposed = [...state.investigation.exposedDeceptionIds]

  if (instruction.classification === 'truthful') {
    nextStatus = 'verified'
    if (!nextVerified.includes(instructionId)) {
      nextVerified.push(instructionId)
    }
  } else if (
    instruction.classification === 'fabricated' ||
    instruction.classification === 'contradictory'
  ) {
    nextStatus = 'discredited'
    trustDelta = instruction.trustDeltaOnDiscredit
    if (!nextExposed.includes(instructionId)) {
      nextExposed.push(instructionId)
    }
  } else {
    // misleading / trap
    nextStatus = 'rejected'
    trustDelta = instruction.trustDeltaOnDiscredit
    if (!nextExposed.includes(instructionId)) {
      nextExposed.push(instructionId)
    }
  }

  const nextTrustScore = calculateTrustDelta(state.trust.score, trustDelta)
  const nextTier = calculateTrustTier(nextTrustScore)

  const updatedInvestigation: ControlRoomInvestigationState = {
    ...state.investigation,
    instructionStates: {
      ...state.investigation.instructionStates,
      [instructionId]: nextStatus,
    },
    verifiedInstructionIds: nextVerified,
    exposedDeceptionIds: nextExposed,
  }

  const isOverrideReady = checkOverridePrerequisites({
    ...state,
    investigation: updatedInvestigation,
  })

  updatedInvestigation.isCoreOverrideReady = isOverrideReady

  const updatedState: ControlRoomGameState = {
    ...state,
    trust: {
      ...state.trust,
      score: nextTrustScore,
      tier: nextTier,
      persona: getAIPersona(nextTier),
      totalVerified: state.trust.totalVerified + 1,
      totalExposed:
        instruction.classification !== 'truthful'
          ? state.trust.totalExposed + 1
          : state.trust.totalExposed,
    },
    investigation: updatedInvestigation,
    alarmsActive: isOverrideReady ? false : state.alarmsActive,
  }

  return {
    state: updatedState,
    success: true,
    message: instruction.verifiedTruthSummary,
  }
}

/**
 * Blindly executes an instruction without corroborating physical evidence.
 * Increases AI trust score, but if deceptive, increases risk counter.
 */
export function blindObeyInstruction(
  state: ControlRoomGameState,
  instructionId: InstructionId
): {
  state: ControlRoomGameState
  success: boolean
  message: string
} {
  const instruction = getInstructionById(instructionId)
  if (!instruction) {
    return {
      state,
      success: false,
      message: 'INVALID DIRECTIVE SPECIFIED.',
    }
  }

  const currentStatus = state.investigation.instructionStates[instructionId]
  if (currentStatus !== 'pending') {
    return {
      state,
      success: false,
      message: 'DIRECTIVE ALREADY ACTED UPON.',
    }
  }

  const isDeceptive = instruction.classification !== 'truthful'
  const nextTrustScore = calculateTrustDelta(
    state.trust.score,
    instruction.trustDeltaOnObey
  )
  const nextTier = calculateTrustTier(nextTrustScore)

  const nextInstability = isDeceptive
    ? Math.min(100, state.reactorInstability + 20)
    : state.reactorInstability

  const updatedState: ControlRoomGameState = {
    ...state,
    trust: {
      ...state.trust,
      score: nextTrustScore,
      tier: nextTier,
      persona: getAIPersona(nextTier),
      totalObeyed: state.trust.totalObeyed + 1,
      blindObedienceRiskCount: isDeceptive
        ? state.trust.blindObedienceRiskCount + 1
        : state.trust.blindObedienceRiskCount,
    },
    investigation: {
      ...state.investigation,
      instructionStates: {
        ...state.investigation.instructionStates,
        [instructionId]: 'obeyed',
      },
    },
    reactorInstability: nextInstability,
    alarmsActive: isDeceptive ? true : state.alarmsActive,
  }

  return {
    state: updatedState,
    success: true,
    message: isDeceptive
      ? `BLIND OBEDIENCE EXECUTED. Hazard warning triggered: ${instruction.blindObedienceConsequence}`
      : 'AUTHENTIC DIRECTIVE OBEYED. Systems aligned.',
  }
}

/**
 * Validates whether a final decision choice is the winning path.
 */
export function validateFinalDecision(decision: FinalDecisionOption): boolean {
  return decision === CORRECT_FINAL_DECISION
}

/**
 * Submits the player's final decision at the Overseer System Core.
 */
export function submitFinalDecision(
  state: ControlRoomGameState,
  decision: FinalDecisionOption
): {
  state: ControlRoomGameState
  isCorrect: boolean
} {
  // Prerequisite check: must have verified the required directives
  if (!state.investigation.isCoreOverrideReady) {
    return { state, isCorrect: false }
  }

  const isCorrect = validateFinalDecision(decision)

  if (isCorrect) {
    return {
      state: {
        ...state,
        status: 'decision_transition',
        investigation: {
          ...state.investigation,
          selectedFinalDecision: decision,
          isExitBulkheadOpen: true,
        },
        alarmsActive: false,
        reactorInstability: 0,
      },
      isCorrect: true,
    }
  }

  // Failure path: Option A (submission) or Option B (meltdown)
  return {
    state: {
      ...state,
      status: 'failure_cinematic',
      investigation: {
        ...state.investigation,
        selectedFinalDecision: decision,
        isExitBulkheadOpen: false,
      },
      alarmsActive: true,
      reactorInstability: decision === 'total_destruction' ? 100 : state.reactorInstability,
    },
    isCorrect: false,
  }
}

/**
 * Validates deterministic state machine transitions.
 */
export function validateStateTransition(
  currentStatus: Game09Status,
  nextStatus: Game09Status
): boolean {
  if (currentStatus === nextStatus) return true
  const allowed = VALID_STATE_TRANSITIONS[currentStatus]
  return allowed ? allowed.includes(nextStatus) : false
}

/**
 * Transitions game status with strict validation.
 */
export function transitionStatus(
  state: ControlRoomGameState,
  nextStatus: Game09Status
): ControlRoomGameState {
  if (!validateStateTransition(state.status, nextStatus)) {
    return state
  }
  return {
    ...state,
    status: nextStatus,
  }
}

/**
 * Resets Game 09 exclusively, returning player to initial state.
 */
export function resetControlRoomState(): ControlRoomGameState {
  return createInitialControlRoomState()
}

/**
 * Returns player spawn point.
 */
export function getControlRoomSpawnPosition(): Vector3Tuple {
  return [...INITIAL_CONTROL_ROOM_POS]
}
