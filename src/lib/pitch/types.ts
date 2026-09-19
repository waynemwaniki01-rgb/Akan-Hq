export const CATEGORIES = ["U15"] as const;
export type Category = (typeof CATEGORIES)[number];

export const POSITIONS = [
  "GK", "SW", "CB", "LCB", "RCB", "LB", "RB", "LWB", "RWB",
  "CDM", "LDM", "RDM", "CM", "LCM", "RCM", "CAM", "LAM", "RAM",
  "LM", "RM", "LW", "RW", "LF", "RF", "CF", "ST", "SS",
] as const;
export type PositionCode = (typeof POSITIONS)[number];

export const POSITION_LABELS: Record<PositionCode, string> = {
  GK: "Goalkeeper", SW: "Sweeper", CB: "Centre Back", LCB: "Left Centre Back",
  RCB: "Right Centre Back", LB: "Left Back", RB: "Right Back", LWB: "Left Wing Back",
  RWB: "Right Wing Back", CDM: "Defensive Midfielder", LDM: "Left Defensive Mid",
  RDM: "Right Defensive Mid", CM: "Central Midfielder", LCM: "Left Central Mid",
  RCM: "Right Central Mid", CAM: "Attacking Midfielder", LAM: "Left Attacking Mid",
  RAM: "Right Attacking Mid", LM: "Left Midfielder", RM: "Right Midfielder",
  LW: "Left Winger", RW: "Right Winger", LF: "Left Forward", RF: "Right Forward",
  CF: "Centre Forward", ST: "Striker", SS: "Second Striker",
};

export const SIX_KEYS = ["pac", "sho", "pas", "dri", "def", "phy"] as const;
export type SixKey = (typeof SIX_KEYS)[number];

export const SIX_LABELS: Record<SixKey, string> = {
  pac: "PAC", sho: "SHO", pas: "PAS", dri: "DRI", def: "DEF", phy: "PHY",
};

export const GK_KEYS = ["div", "han", "kic", "ref", "spd", "pos"] as const;
export type GkKey = (typeof GK_KEYS)[number];

export const GK_LABELS: Record<GkKey, string> = {
  div: "DIV", han: "HAN", kic: "KIC", ref: "REF", spd: "SPD", pos: "POS",
};

export type OutfieldSix = Record<SixKey, number>;
export type GkSix = Record<GkKey, number>;

export type OutfieldDetail = {
  acceleration: number;
  sprintSpeed: number;
  finishing: number;
  shotPower: number;
  longShots: number;
  volleys: number;
  attackingPosition: number;
  shortPassing: number;
  longPassing: number;
  vision: number;
  crossing: number;
  curve: number;
  fkAccuracy: number;
  dribbling: number;
  ballControl: number;
  agility: number;
  balance: number;
  reactions: number;
  defensiveAwareness: number;
  standingTackle: number;
  slidingTackle: number;
  interceptions: number;
  headingAccuracy: number;
  strength: number;
  stamina: number;
  aggression: number;
  jumping: number;
};

export const DETAIL_GROUPS: { title: string; keys: (keyof OutfieldDetail)[] }[] = [
  { title: "Pace", keys: ["acceleration", "sprintSpeed"] },
  { title: "Shooting", keys: ["finishing", "shotPower", "longShots", "volleys", "attackingPosition"] },
  { title: "Passing", keys: ["shortPassing", "longPassing", "vision", "crossing", "curve", "fkAccuracy"] },
  { title: "Dribbling", keys: ["dribbling", "ballControl", "agility", "balance", "reactions"] },
  { title: "Defending", keys: ["defensiveAwareness", "standingTackle", "slidingTackle", "interceptions", "headingAccuracy"] },
  { title: "Physical", keys: ["strength", "stamina", "aggression", "jumping"] },
];

export const DETAIL_LABELS: Record<keyof OutfieldDetail, string> = {
  acceleration: "Acceleration", sprintSpeed: "Sprint Speed", finishing: "Finishing",
  shotPower: "Shot Power", longShots: "Long Shots", volleys: "Volleys",
  attackingPosition: "Positioning", shortPassing: "Short Passing", longPassing: "Long Passing",
  vision: "Vision", crossing: "Crossing", curve: "Curve", fkAccuracy: "Free Kick Accuracy",
  dribbling: "Dribbling", ballControl: "Ball Control", agility: "Agility", balance: "Balance",
  reactions: "Reactions", defensiveAwareness: "Defensive Awareness", standingTackle: "Standing Tackle",
  slidingTackle: "Sliding Tackle", interceptions: "Interceptions", headingAccuracy: "Heading Accuracy",
  strength: "Strength", stamina: "Stamina", aggression: "Aggression", jumping: "Jumping",
};

export const CARD_DESIGNS = ["auto", "core", "elite", "prime", "apex", "legacy", "iconic"] as const;
export type CardDesign = (typeof CARD_DESIGNS)[number];

export const CARD_DESIGN_LABELS: Record<CardDesign, string> = {
  auto: "Auto — by overall",
  core: "Core — graphite chassis",
  elite: "Elite — command cyan",
  prime: "Prime — copper strike",
  apex: "Apex — violet voltage",
  legacy: "Legacy — ceremonial plate",
  iconic: "Iconic — sovereign crimson",
};

export type Rarity = "bronze" | "silver" | "gold" | "elite" | "world" | "legendary";

/** Shared 1–5 star rating used for weak foot and skill moves. */
export type StarRating = 1 | 2 | 3 | 4 | 5;

export type AttrVizStyle = "bars" | "radial" | "segmented" | "angular" | "minimal" | "analytical";
export type PhotoFrame = "face" | "full-body";
export type CardVariant =
  | "concept" | "bronze" | "silver" | "gold" | "toty" | "showdown" | "fantasy" | "hero"
  | "flashback" | "foundations" | "champions" | "europa" | "rttk" | "icon" | "hall-of-fame"
  | "big-time" | "show-time" | "prism" | "hologram" | "chrome" | "cyber" | "glitch" | "eclipse"
  | "crystal" | "manga" | "lava" | "aurora" | "circuit" | "relic" | "dimension" | "cosmic"
  | "street" | "quantum" | "royal" | "phantom" | "velocity" | "floral" | "heritage" | "titan";

/** Complete visual configuration. Templates ≠ players. */
export type CardStyle = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  border: string;
  text: string;
  attrColor: string;
  ratingColor: string;
  highlight: string;
  generatedBackground?: string;
  glowColor: string;
  metallic: string;
  photoTint: string;
  borderWidth: number;
  borderOpacity: number;
  glowIntensity: number;
  shadowIntensity: number;
  highlightIntensity: number;
  photoScale: number;
  photoX: number;
  photoY: number;
  photoRotate: number;
  photoBrightness: number;
  photoContrast: number;
  photoSaturate: number;
  photoOpacity: number;
  photoBlur: number;
  photoFrame: PhotoFrame;
  variant: CardVariant;
  nameSize: number;
  letterSpacing: number;
  nameCase: "upper" | "title";
  attrViz: AttrVizStyle;
  showTactical: boolean;
  showGrid: boolean;
  gridColor?: string;
  patternOpacity: number;
  ovrScale: number;
  formScale: number;
  backgroundPattern: "grid" | "dots" | "diagonal" | "hex" | "none";
  playstyleScale: number;
};

export type DesignPreset = {
  id: string;
  name: string;
  cardDesign: CardDesign;
  style: CardStyle;
};

export type AttrHistoryEntry = {
  id: string;
  at: string;
  attr: string;
  from: number;
  to: number;
  reason: string;
};

export type Player = {
  id: string;
  name: string;
  photo: string | null;
  position: PositionCode;
  secondaryPositions: PositionCode[];
  foot: "Left" | "Right" | "Both";
  number: string;
  age: number;
  height: number;
  captain: boolean;
  team: string;
  /** Player's own contact email — used to send call-up notices. */
  email: string;
  /** Player's own contact phone number. */
  phone: string;
  /** Parent/guardian name — optional secondary contact. */
  guardianName: string;
  /** Parent/guardian email — call-ups can be sent here too. */
  guardianEmail: string;
  /** Parent/guardian phone number. */
  guardianPhone: string;
  category: string;
  cardDesign: CardDesign;
  cardStyle?: CardStyle;
  baseSix: OutfieldSix;
  currentSix: OutfieldSix;
  detail: OutfieldDetail;
  gkBase: GkSix | null;
  gkCurrent: GkSix | null;
  /** Normal-tier PlayStyle ids equipped (see lib/pitch/playstyles.ts). Max 7 — enforced in the form UI. */
  playStyles: string[];
  /** Elite "+" tier PlayStyle ids — a subset that upgrades a style already in `playStyles`. Max 3. */
  playStylesPlus: string[];
  /** 1–5 star weak foot rating. */
  weakFoot: StarRating;
  /** 1–5 star skill moves rating. */
  skillMoves: StarRating;
  history: AttrHistoryEntry[];
  createdAt: string;
  /** Whether this player is on the active roster — off-roster players are hidden from call-up building by default. */
  onRoster?: boolean;
};

export type Training = {
  id: string;
  date: string;
  title: string;
  category: string;
  attendance: Record<string, boolean>;
};

export type MatchKind = "League" | "Tournament" | "Friendly";

export type Match = {
  id: string;
  date: string;
  opponent: string;
  venue: "Home" | "Away";
  kickoff: string;
  kind: MatchKind;
  category: string;
  lineup: string[];
  slotMap: Record<string, string>;
  ratings: Record<string, number>;
  goals: Record<string, number>;
  teamScore: number | null;
  opponentScore: number | null;
  motm: string | null;
};

export type PitchSlot = {
  id: string;
  pos: PositionCode;
  x: number;
  y: number;
  line: string;
};

/**
 * A single slot's freeform, user-dragged position on the Board view
 * (eFootball-style). Keyed by slot id in the store's `slotOverrides`
 * map — when present for a slot, it overrides that slot's default
 * `x`/`y`/`pos` from `layoutFormation()`. `pos` is recomputed live from
 * the drop point via `positionFromPoint()` in `lib/pitch/formations.ts`,
 * so a card dragged to a new area of the pitch gets a believable label
 * (and therefore a believable roleAdjustedRating) instead of keeping
 * whatever position it started the drag with.
 */
export type SlotOverride = {
  x: number;
  y: number;
  pos: PositionCode;
};

export type SequencePhase = {
  own: PitchSlot[];
  opp: PitchSlot[];
  ball: { x: number; y: number };
  note: string;
};

export type OpponentIntel = {
  strengths: string;
  weaknesses: string;
};

export type TrophyEntry = {
  id: string;
  name: string;
  competition: string;
  season: string;
  notes: string;
  photo: string | null;
  createdAt: string;
};

export type CoachRole = "Head Coach" | "Assistant Coach" | "Goalkeeping Coach" | "Fitness Coach" | "Scout";

export type Coach = {
  id: string;
  name: string;
  photo: string | null;
  role: CoachRole;
  phone: string;
  email: string;
  team: string;
  category: string;
  bio: string;
  /** Same chassis-template system used for player cards. */
  cardDesign: CardDesign;
  /** Full visual style override — colors, framing, etc. Same system as players. */
  cardStyle?: CardStyle;
  createdAt: string;
};

export type CallUpStatus = "called" | "not-selected";

export type CallUpEntry = {
  playerId: string;
  status: CallUpStatus;
  overrides?: Partial<OutfieldSix>;
  note?: string;
};

export type CallUp = {
  id: string;
  name: string;
  coachId: string;
  category: string;
  date: string;
  entries: CallUpEntry[];
  createdAt: string;
};

export type DeskData = {
  players: Player[];
  trainings: Training[];
  matches: Match[];
  trophies: TrophyEntry[];
  coaches: Coach[];
  callUps: CallUp[];
  opponentIntel: OpponentIntel;
  designPresets: DesignPreset[];
  meta: { seeded: boolean; version: number };
};

// ── Tactical sequences (Simulate view) ──────────────────────────────────
// Used by src/components/pitch/tactiq-views.tsx to build and play back
// phase-by-phase attacking/defending combinations on the board.

export type PhaseEventKind = "shot" | "goal" | "save" | "block";

export type PhaseEvent = {
  kind: PhaseEventKind;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export type TacticalPhase = {
  id: string;
  own: PitchSlot[];
  opp: PitchSlot[];
  ball: { x: number; y: number };
  note: string;
  event: PhaseEvent | null;
};

export type TacticalSequence = {
  id: string;
  name: string;
  phases: TacticalPhase[];
};