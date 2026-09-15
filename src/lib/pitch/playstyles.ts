import type { PositionCode } from "./types";

export type PlayStyleCategory =
  | "scoring"
  | "passing"
  | "ball_control"
  | "defending"
  | "physical"
  | "goalkeeping";

export const PLAYSTYLE_CATEGORY_LABELS: Record<PlayStyleCategory, string> = {
  scoring: "Scoring",
  passing: "Passing",
  ball_control: "Ball Control",
  defending: "Defending",
  physical: "Physical",
  goalkeeping: "Goalkeeping",
};

/** Category accent colors — used as a subtle tint behind each badge so categories read at a glance. */
export const PLAYSTYLE_CATEGORY_COLORS: Record<PlayStyleCategory, string> = {
  scoring: "#ff6b6b",
  passing: "#5fa8ff",
  ball_control: "#6bdc9d",
  defending: "#b98bff",
  physical: "#ffb15f",
  goalkeeping: "#5fe0e0",
};

/**
 * Lucide icon name for each style — kept as a plain string here (not a component)
 * so this file has zero React/UI dependencies. player-card.tsx maps these
 * names to actual icon components. Every id below maps to a DIFFERENT icon,
 * even within the same category, so no two styles ever look identical.
 */
export type PlayStyleDef = {
  id: string;
  name: string;
  category: PlayStyleCategory;
  /** Short effect description, normal tier. */
  effect: string;
  /** Short effect description, elite "+" tier. */
  effectPlus: string;
  /** Lucide icon name, unique per style. */
  icon: string;
  /** Optional — if set, only these positions can equip it (e.g. goalkeeping styles). Undefined = any position. */
  positions?: PositionCode[];
};

export const PLAYSTYLES: PlayStyleDef[] = [
  // Scoring
  { id: "acrobatic", name: "Acrobatic", category: "scoring", icon: "RotateCw", effect: "Better volleys and acrobatic finishes.", effectPlus: "Elite volley accuracy with advanced acrobatic finishes." },
  { id: "chip_shot", name: "Chip Shot", category: "scoring", icon: "ArrowUpRight", effect: "Faster, more accurate chip shots.", effectPlus: "Much faster, highly accurate chip shots." },
  { id: "dead_ball", name: "Dead Ball", category: "scoring", icon: "Target", effect: "Better free kicks and set pieces.", effectPlus: "Elite set-piece accuracy and control." },
  { id: "finesse_shot", name: "Finesse Shot", category: "scoring", icon: "Wand2", effect: "Faster finesse shots with more curve.", effectPlus: "Maximum curve and exceptional finesse accuracy." },
  { id: "gamechanger", name: "Gamechanger", category: "scoring", icon: "Sparkles", effect: "Improved flair finishing, unlocks trivela shots.", effectPlus: "Greatly enhanced creative finishing consistency." },
  { id: "low_driven_shot", name: "Low Driven Shot", category: "scoring", icon: "Zap", effect: "More effective, accurate low driven shots.", effectPlus: "Significantly enhanced low driven finishing." },
  { id: "power_shot", name: "Power Shot", category: "scoring", icon: "Rocket", effect: "Faster power shots.", effectPlus: "Major increase in power shot speed." },
  { id: "power_header", name: "Power Header", category: "scoring", icon: "Flame", effect: "More powerful, accurate headers.", effectPlus: "Elite heading power and accuracy." },
  { id: "precision_header", name: "Precision Header", category: "scoring", icon: "Crosshair", effect: "Better header accuracy and control.", effectPlus: "Much greater heading accuracy and consistency." },
  { id: "trivela", name: "Trivela", category: "scoring", icon: "Shuffle", effect: "Improved outside-foot shots.", effectPlus: "Significantly improved trivela consistency." },

  // Passing
  { id: "incisive_pass", name: "Incisive Pass", category: "passing", icon: "Send", effect: "More accurate through balls and precision passes.", effectPlus: "Even more dangerous, accurate through balls." },
  { id: "inventive", name: "Inventive", category: "passing", icon: "Lightbulb", effect: "Improved fancy and trivela passes.", effectPlus: "Greatly improved fancy/trivela pass accuracy." },
  { id: "long_ball_pass", name: "Long Ball Pass", category: "passing", icon: "Navigation", effect: "More accurate, faster lofted passes.", effectPlus: "Extremely accurate, hard-to-intercept long balls." },
  { id: "pinged_pass", name: "Pinged Pass", category: "passing", icon: "Radio", effect: "Faster passes, cleaner reception.", effectPlus: "Much faster passes with excellent reception." },
  { id: "tiki_taka", name: "Tiki Taka", category: "passing", icon: "Repeat", effect: "Better first-time and short passing.", effectPlus: "Elite accuracy on difficult short passes." },
  { id: "whipped_pass", name: "Whipped Pass", category: "passing", icon: "Wind", effect: "More accurate, curved crosses.", effectPlus: "Powerful, driven crosses with great accuracy." },

  // Ball Control
  { id: "first_touch", name: "First Touch", category: "ball_control", icon: "Feather", effect: "Cleaner traps, faster transition to dribble.", effectPlus: "Excellent first touches, near-instant transitions." },
  { id: "press_proven", name: "Press Proven", category: "ball_control", icon: "ShieldCheck", effect: "Better ball control under pressure.", effectPlus: "Elite shielding and control when pressed." },
  { id: "rapid", name: "Rapid", category: "ball_control", icon: "Gauge", effect: "Faster dribbling and sprinting on the ball.", effectPlus: "Significantly faster ball carrying." },
  { id: "technical", name: "Technical", category: "ball_control", icon: "Compass", effect: "Faster controlled sprint, precise turns.", effectPlus: "Elite controlled sprint speed and turning." },
  { id: "trickster", name: "Trickster", category: "ball_control", icon: "Wand", effect: "Access to advanced skill moves.", effectPlus: "More advanced, consistent skill moves." },

  // Defending
  { id: "aerial_fortress", name: "Aerial Fortress", category: "defending", icon: "Mountain", effect: "Better aerial ability and defensive heading.", effectPlus: "Elite aerial dominance." },
  { id: "anticipate", name: "Anticipate", category: "defending", icon: "Eye", effect: "Better standing tackles, keeps ball after winning it.", effectPlus: "Elite standing tackles and ball retention." },
  { id: "block", name: "Block", category: "defending", icon: "Square", effect: "Better reach and success blocking shots/passes.", effectPlus: "Elite reach and block success rate." },
  { id: "intercept", name: "Intercept", category: "defending", icon: "Radar", effect: "Better interception reach and retention.", effectPlus: "Elite interception reach and retention." },
  { id: "jockey", name: "Jockey", category: "defending", icon: "Move", effect: "Faster sprint jockeying and transitions.", effectPlus: "Much faster, more responsive jockeying." },
  { id: "slide_tackle", name: "Slide Tackle", category: "defending", icon: "Slash", effect: "Improved, more reliable slide tackles.", effectPlus: "Stronger, highly consistent slide tackles." },

  // Physical
  { id: "bruiser", name: "Bruiser", category: "physical", icon: "Dumbbell", effect: "Greater strength in physical challenges.", effectPlus: "Elite physical tackling strength." },
  { id: "enforcer", name: "Enforcer", category: "physical", icon: "ShieldAlert", effect: "Stronger shielding and shoulder challenges.", effectPlus: "Elite shielding and shoulder-challenge strength." },
  { id: "long_throw", name: "Long Throw", category: "physical", icon: "MoveDiagonal", effect: "Throw-ins travel farther.", effectPlus: "Maximum-distance throw-ins." },
  { id: "quick_step", name: "Quick Step", category: "physical", icon: "TrendingUp", effect: "Faster acceleration on explosive sprints.", effectPlus: "Significantly faster acceleration." },
  { id: "relentless", name: "Relentless", category: "physical", icon: "Infinity", effect: "Less fatigue, better recovery.", effectPlus: "Greatly reduced fatigue, excellent recovery." },

  // Goalkeeping (position-restricted to GK)
  { id: "cross_claimer", name: "Cross Claimer", category: "goalkeeping", icon: "Hand", effect: "Aggressively claims crosses, stronger punches.", effectPlus: "Elite cross claiming and punching power.", positions: ["GK"] },
  { id: "deflector", name: "Deflector", category: "goalkeeping", icon: "Shield", effect: "Pushes dangerous shots away safely.", effectPlus: "Excellent deflections and safer save outcomes.", positions: ["GK"] },
  { id: "far_reach", name: "Far Reach", category: "goalkeeping", icon: "Ruler", effect: "Reaches long-distance shots better.", effectPlus: "Elite diving reach.", positions: ["GK"] },
  { id: "far_throw", name: "Far Throw", category: "goalkeeping", icon: "Plane", effect: "Throws the ball much farther.", effectPlus: "Maximum-distance distribution.", positions: ["GK"] },
  { id: "footwork", name: "Footwork", category: "goalkeeping", icon: "Footprints", effect: "Uses feet more often to make saves.", effectPlus: "Excellent foot saves, especially low shots.", positions: ["GK"] },
  { id: "quick_reflexes", name: "Quick Reflexes", category: "goalkeeping", icon: "Activity", effect: "Faster reflex saves and reactions.", effectPlus: "Elite reflexes and reaction speed.", positions: ["GK"] },
  { id: "rush_out", name: "Rush Out", category: "goalkeeping", icon: "Flag", effect: "More aggressive coming off the line for 1v1s.", effectPlus: "Elite rushing decisions and close-shot reactions.", positions: ["GK"] },
];

export const PLAYSTYLE_MAP: Record<string, PlayStyleDef> = Object.fromEntries(
  PLAYSTYLES.map((p) => [p.id, p]),
);

export function playStyleById(id: string): PlayStyleDef | undefined {
  return PLAYSTYLE_MAP[id];
}

/** Caps, matching the "0-7 normal / 0-3 elite" rule so no player can equip everything. */
export const MAX_PLAYSTYLES = 7;
export const MAX_PLAYSTYLES_PLUS = 3;

/**
 * Realistic, capped OVR bonus from PlayStyles.
 *
 * `playStylesPlus` is a subset — a style upgraded to "+" should NOT also be
 * counted as a normal-tier bonus, it's the elite version of the same style.
 *
 * Bonus math: +1 OVR per normal style (up to 7), +2 OVR per "+" style (up to 3),
 * but the COMBINED total is hard-capped at +6 — so even a fully loaded card
 * gets a believable nudge, never a +20 swing. Tune MAX_TOTAL_BONUS below if
 * you want cards to feel stronger or weaker.
 */
const MAX_TOTAL_BONUS = 6;

export function computePlayStyleBonus(
  playStyles: string[] = [],
  playStylesPlus: string[] = [],
): number {
  const normalOnly = playStyles.filter((id) => !playStylesPlus.includes(id));
  const normalBonus = Math.min(normalOnly.length, MAX_PLAYSTYLES) * 1;
  const plusBonus = Math.min(playStylesPlus.length, MAX_PLAYSTYLES_PLUS) * 2;
  return Math.min(normalBonus + plusBonus, MAX_TOTAL_BONUS);
}

/** All distinct style ids currently active on a player (normal + plus, deduped). */
export function allActivePlayStyles(playStyles: string[] = [], playStylesPlus: string[] = []): string[] {
  return Array.from(new Set([...playStyles, ...playStylesPlus]));
}