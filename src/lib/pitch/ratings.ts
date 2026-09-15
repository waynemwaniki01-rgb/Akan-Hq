import { clamp } from "@/lib/utils";
import type {
  GkSix,
  OutfieldDetail,
  OutfieldSix,
  Player,
  PositionCode,
  Rarity,
  SixKey,
} from "./types";
import { POSITIONS } from "./types";
import { normalizeCardDesign, tierForOvr, type CardTier } from "./card-system";
import { computePlayStyleBonus } from "./playstyles";

/** Position-dependent OVR weights. Easy to retune. */
export const OVR_WEIGHTS: Record<PositionCode, Record<SixKey, number>> = {
  GK: { pac: 0.1, sho: 0, pas: 0.15, dri: 0.05, def: 0.35, phy: 0.35 },
  SW: { pac: 0.12, sho: 0, pas: 0.22, dri: 0.06, def: 0.38, phy: 0.22 },
  CB: { pac: 0.1, sho: 0, pas: 0.2, dri: 0.05, def: 0.4, phy: 0.25 },
  LCB: { pac: 0.1, sho: 0, pas: 0.2, dri: 0.05, def: 0.4, phy: 0.25 },
  RCB: { pac: 0.1, sho: 0, pas: 0.2, dri: 0.05, def: 0.4, phy: 0.25 },
  LB: { pac: 0.2, sho: 0.05, pas: 0.2, dri: 0.15, def: 0.3, phy: 0.1 },
  RB: { pac: 0.2, sho: 0.05, pas: 0.2, dri: 0.15, def: 0.3, phy: 0.1 },
  LWB: { pac: 0.25, sho: 0.08, pas: 0.2, dri: 0.2, def: 0.17, phy: 0.1 },
  RWB: { pac: 0.25, sho: 0.08, pas: 0.2, dri: 0.2, def: 0.17, phy: 0.1 },
  CDM: { pac: 0.1, sho: 0.08, pas: 0.22, dri: 0.12, def: 0.28, phy: 0.2 },
  LDM: { pac: 0.1, sho: 0.08, pas: 0.22, dri: 0.12, def: 0.28, phy: 0.2 },
  RDM: { pac: 0.1, sho: 0.08, pas: 0.22, dri: 0.12, def: 0.28, phy: 0.2 },
  CM: { pac: 0.1, sho: 0.1, pas: 0.3, dri: 0.2, def: 0.15, phy: 0.15 },
  LCM: { pac: 0.1, sho: 0.1, pas: 0.3, dri: 0.2, def: 0.15, phy: 0.15 },
  RCM: { pac: 0.1, sho: 0.1, pas: 0.3, dri: 0.2, def: 0.15, phy: 0.15 },
  CAM: { pac: 0.12, sho: 0.22, pas: 0.28, dri: 0.28, def: 0.02, phy: 0.08 },
  LAM: { pac: 0.18, sho: 0.2, pas: 0.24, dri: 0.28, def: 0.02, phy: 0.08 },
  RAM: { pac: 0.18, sho: 0.2, pas: 0.24, dri: 0.28, def: 0.02, phy: 0.08 },
  LM: { pac: 0.22, sho: 0.12, pas: 0.22, dri: 0.28, def: 0.08, phy: 0.08 },
  RM: { pac: 0.22, sho: 0.12, pas: 0.22, dri: 0.28, def: 0.08, phy: 0.08 },
  LW: { pac: 0.25, sho: 0.2, pas: 0.15, dri: 0.3, def: 0.05, phy: 0.05 },
  RW: { pac: 0.25, sho: 0.2, pas: 0.15, dri: 0.3, def: 0.05, phy: 0.05 },
  LF: { pac: 0.2, sho: 0.3, pas: 0.15, dri: 0.25, def: 0.02, phy: 0.08 },
  RF: { pac: 0.2, sho: 0.3, pas: 0.15, dri: 0.25, def: 0.02, phy: 0.08 },
  CF: { pac: 0.18, sho: 0.38, pas: 0.12, dri: 0.18, def: 0, phy: 0.14 },
  ST: { pac: 0.2, sho: 0.4, pas: 0.1, dri: 0.2, def: 0, phy: 0.1 },
  SS: { pac: 0.18, sho: 0.32, pas: 0.18, dri: 0.24, def: 0, phy: 0.08 },
};

export const GK_OVR_WEIGHTS: Record<keyof GkSix, number> = {
  div: 0.2,
  han: 0.2,
  kic: 0.1,
  ref: 0.25,
  spd: 0.1,
  pos: 0.15,
};

export const POSITION_GROUPS: Record<string, PositionCode[]> = {
  GK: ["GK"],
  CB: ["SW", "CB", "LCB", "RCB"],
  FB: ["LB", "RB", "LWB", "RWB"],
  DM: ["CDM", "LDM", "RDM"],
  CM: ["CM", "LCM", "RCM"],
  AM: ["CAM", "LAM", "RAM"],
  WM: ["LM", "RM", "LWB", "RWB"],
  W: ["LW", "RW", "LF", "RF", "LM", "RM"],
  ST: ["ST", "CF", "SS", "LF", "RF"],
};

function groupOf(pos: PositionCode): string {
  if (pos === "GK") return "GK";
  if (["SW", "CB", "LCB", "RCB"].includes(pos)) return "CB";
  if (["LB", "RB"].includes(pos)) return "FB";
  if (["LWB", "RWB"].includes(pos)) return "WB";
  if (["CDM", "LDM", "RDM"].includes(pos)) return "DM";
  if (["CM", "LCM", "RCM"].includes(pos)) return "CM";
  if (["CAM", "LAM", "RAM"].includes(pos)) return "AM";
  if (["LM", "RM"].includes(pos)) return "WM";
  if (["LW", "RW", "LF", "RF"].includes(pos)) return "W";
  return "ST";
}

const AFFINITY: Record<string, Record<string, number>> = {
  GK: { GK: 1, CB: 0.25, FB: 0.15, WB: 0.1, DM: 0.1, CM: 0.05, AM: 0.02, WM: 0.02, W: 0.02, ST: 0.02 },
  CB: { GK: 0.2, CB: 1, FB: 0.7, WB: 0.5, DM: 0.75, CM: 0.45, AM: 0.2, WM: 0.25, W: 0.15, ST: 0.12 },
  FB: { GK: 0.1, CB: 0.65, FB: 1, WB: 0.9, DM: 0.5, CM: 0.45, AM: 0.3, WM: 0.7, W: 0.55, ST: 0.2 },
  WB: { GK: 0.08, CB: 0.4, FB: 0.85, WB: 1, DM: 0.4, CM: 0.5, AM: 0.45, WM: 0.85, W: 0.75, ST: 0.3 },
  DM: { GK: 0.1, CB: 0.7, FB: 0.5, WB: 0.4, DM: 1, CM: 0.85, AM: 0.5, WM: 0.4, W: 0.25, ST: 0.2 },
  CM: { GK: 0.05, CB: 0.4, FB: 0.45, WB: 0.5, DM: 0.8, CM: 1, AM: 0.8, WM: 0.65, W: 0.45, ST: 0.35 },
  AM: { GK: 0.02, CB: 0.2, FB: 0.3, WB: 0.4, DM: 0.4, CM: 0.75, AM: 1, WM: 0.7, W: 0.7, ST: 0.65 },
  WM: { GK: 0.02, CB: 0.2, FB: 0.65, WB: 0.8, DM: 0.35, CM: 0.6, AM: 0.7, WM: 1, W: 0.9, ST: 0.5 },
  W: { GK: 0.02, CB: 0.12, FB: 0.5, WB: 0.7, DM: 0.2, CM: 0.4, AM: 0.7, WM: 0.85, W: 1, ST: 0.7 },
  ST: { GK: 0.02, CB: 0.12, FB: 0.2, WB: 0.3, DM: 0.18, CM: 0.35, AM: 0.65, WM: 0.5, W: 0.7, ST: 1 },
};

export function emptySix(): OutfieldSix {
  return { pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70 };
}

export function emptyGk(): GkSix {
  return { div: 70, han: 70, kic: 70, ref: 70, spd: 70, pos: 70 };
}

export function spreadDetail(six: OutfieldSix): OutfieldDetail {
  const j = (n: number, d: number) => clamp(Math.round(n + d), 1, 99);
  return {
    acceleration: j(six.pac, 2),
    sprintSpeed: j(six.pac, -1),
    finishing: j(six.sho, 1),
    shotPower: j(six.sho, 0),
    longShots: j(six.sho, -3),
    volleys: j(six.sho, -4),
    attackingPosition: j(six.sho, 2),
    shortPassing: j(six.pas, 2),
    longPassing: j(six.pas, -1),
    vision: j(six.pas, 1),
    crossing: j(six.pas, -2),
    curve: j(six.pas, -3),
    fkAccuracy: j(six.pas, -4),
    dribbling: j(six.dri, 1),
    ballControl: j(six.dri, 2),
    agility: j(six.dri, 0),
    balance: j(six.dri, -1),
    reactions: j(six.dri, 1),
    defensiveAwareness: j(six.def, 2),
    standingTackle: j(six.def, 1),
    slidingTackle: j(six.def, -2),
    interceptions: j(six.def, 0),
    headingAccuracy: j(six.def, -1),
    strength: j(six.phy, 1),
    stamina: j(six.phy, 2),
    aggression: j(six.phy, 0),
    jumping: j(six.phy, -1),
  };
}

export function ovrFromSix(six: OutfieldSix, pos: PositionCode): number {
  const w = OVR_WEIGHTS[pos];
  const raw =
    six.pac * w.pac +
    six.sho * w.sho +
    six.pas * w.pas +
    six.dri * w.dri +
    six.def * w.def +
    six.phy * w.phy;
  return clamp(Math.round(raw), 1, 99);
}

export function ovrFromGk(gk: GkSix): number {
  const raw =
    gk.div * GK_OVR_WEIGHTS.div +
    gk.han * GK_OVR_WEIGHTS.han +
    gk.kic * GK_OVR_WEIGHTS.kic +
    gk.ref * GK_OVR_WEIGHTS.ref +
    gk.spd * GK_OVR_WEIGHTS.spd +
    gk.pos * GK_OVR_WEIGHTS.pos;
  return clamp(Math.round(raw), 1, 99);
}

export function isGoalkeeper(pos: PositionCode) {
  return pos === "GK";
}

/**
 * Small, capped OVR nudge from weak foot / skill moves — only 5-star ratings
 * matter, +1 OVR each, max +2 total. Kept tiny on purpose so a 5★/5★ card
 * isn't a different player, just a slightly more complete one.
 */
export function starBonus(weakFoot: number, skillMoves: number): number {
  const wf = weakFoot >= 5 ? 1 : 0;
  const sm = skillMoves >= 5 ? 1 : 0;
  return wf + sm;
}

export function baseOvr(player: Player): number {
  if (isGoalkeeper(player.position) && player.gkBase) return ovrFromGk(player.gkBase);
  const raw = ovrFromSix(player.baseSix, player.position);
  return clamp(raw + starBonus(player.weakFoot, player.skillMoves), 1, 99);
}

/**
 * Current OVR. Stat-based rating + star bonus + a small, capped PlayStyle
 * bonus (see computePlayStyleBonus in ./playstyles — up to +6 total,
 * scaled down further per position below). PlayStyles are a *developed*
 * trait, so this bonus lives here (not in baseOvr, which represents the
 * player's raw stat floor before traits are factored in).
 *
 * The bonus is scaled by how relevant PlayStyles are to the position —
 * a GK's PlayStyles are all goalkeeping-specific and matter fully, but
 * an outfield player's PlayStyles matter a bit less to a pure stat-based
 * OVR than his actual six attributes do, so outfield gets 75% of the
 * capped bonus. This keeps the nudge believable rather than making
 * PlayStyles a backdoor way to inflate OVR.
 */
export function playStyleOvrBonus(player: Player): number {
  const raw = computePlayStyleBonus(player.playStyles, player.playStylesPlus);
  const scale = isGoalkeeper(player.position) ? 1 : 0.75;
  return Math.round(raw * scale);
}

export function currentOvr(player: Player): number {
  const base = isGoalkeeper(player.position) && player.gkCurrent
    ? ovrFromGk(player.gkCurrent)
    : ovrFromSix(player.currentSix, player.position);
  const bonus = starBonus(player.weakFoot, player.skillMoves) + playStyleOvrBonus(player);
  return clamp(base + bonus, 1, 99);
}

export function positionRating(player: Player, pos: PositionCode): number {
  if (pos === "GK") {
    if (player.gkCurrent) return ovrFromGk(player.gkCurrent);
    return ovrFromSix(player.currentSix, "GK");
  }
  return ovrFromSix(player.currentSix, pos);
}

export function suitabilityPct(player: Player, pos: PositionCode): number {
  const rating = positionRating(player, pos);
  const a = AFFINITY[groupOf(player.position)]?.[groupOf(pos)] ?? 0.3;
  const secondary = player.secondaryPositions.includes(pos) ? 6 : 0;
  const preferred = player.position === pos ? 4 : 0;
  const mismatchPenalty = Math.max(0, (1 - a) * 42);
  const raw = 50 + 50 * (rating / 99) * a + secondary + preferred - mismatchPenalty;
  return clamp(Math.round(raw), 12, 99);
}

/**
 * How much the displayed OVR should drop when a player is placed at `pos`.
 * - Their actual listed position: NO penalty — positionRating already
 *   reflects their real stats recalculated for that position, so there's
 *   nothing to punish.
 * - A position they've listed as a secondary position (genuinely can play
 *   there): a light penalty only, capped low, since they're a real option
 *   there, not a stretch.
 * - Anywhere else: the full penalty, scaled by how unfamiliar the position
 *   group is (via suitabilityPct/AFFINITY).
 */
export function roleAdjustedRating(player: Player, pos: PositionCode, precision = 1): number {
  const base = positionRating(player, pos);

  if (pos === player.position) return clamp(base, 1, 99);

  const fit = suitabilityPct(player, pos);
  const isSecondary = player.secondaryPositions.includes(pos);
  const maxPenalty = isSecondary ? 12 : 36;
  const rate = isSecondary ? 0.15 : 0.38;

  const penalty = clamp((100 - fit) * (rate * precision), 0, maxPenalty);
  return clamp(Math.round(base - penalty), 1, 99);
}

export function allSuitability(player: Player) {
  return POSITIONS.map((pos) => ({
    pos,
    rating: positionRating(player, pos),
    pct: suitabilityPct(player, pos),
  })).sort((a, b) => b.pct - a.pct);
}

export function rarityFor(ovr: number): Rarity {
  if (ovr >= 95) return "legendary";
  if (ovr >= 90) return "world";
  if (ovr >= 85) return "elite";
  if (ovr >= 80) return "gold";
  if (ovr >= 75) return "silver";
  return "bronze";
}

export const RARITY_LABELS: Record<Rarity, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  elite: "Elite",
  world: "World class",
  legendary: "Legendary",
};

export function resolvedDesign(player: Player, ovr: number): CardTier {
  const design = normalizeCardDesign(player.cardDesign);
  if (design !== "auto") return design;
  return tierForOvr(ovr);
}

/** Recent match ratings (1–10) → form 0–10. */
export function formFromRatings(ratings: number[]): number | null {
  if (!ratings.length) return null;
  const last = ratings.slice(-5);
  const avg = last.reduce((a, b) => a + b, 0) / last.length;
  return Math.round(avg * 10) / 10;
}

/** Form 8.5 → +2; form 5.5 → −2. Permanent card is untouched. */
export function formDelta(form: number | null): number {
  if (form === null) return 0;
  return clamp(Math.round((form - 7) * 0.8), -2, 2);
}

export function effectiveOvr(player: Player, form: number | null): number {
  return clamp(currentOvr(player) + formDelta(form), 1, 99);
}

export function recommendRole(player: Player): string {
  const s = player.currentSix;
  const pos = player.position;
  if (pos === "GK") {
    if ((player.gkCurrent?.kic ?? 0) >= 80) return "Sweeper keeper";
    return "Shot stopper";
  }
  if (["CB", "LCB", "RCB", "SW"].includes(pos)) {
    if (s.pas >= 80 && s.dri >= 70) return "Ball-playing CB";
    if (s.pac >= 78) return "Cover";
    return "Stopper";
  }
  if (["LB", "RB"].includes(pos)) {
    if (s.dri >= 78 && s.pac >= 80) return "Attacking full-back";
    return "Defensive full-back";
  }
  if (["LWB", "RWB"].includes(pos)) {
    return s.dri >= 78 ? "Wing-back invert" : "Traditional wing-back";
  }
  if (["CDM", "LDM", "RDM"].includes(pos)) {
    if (s.pas >= 82 && s.dri >= 75) return "Deep-lying playmaker";
    if (s.def >= 82) return "Ball winner";
    return "Anchor";
  }
  if (["CM", "LCM", "RCM"].includes(pos)) {
    if (s.phy >= 80 && s.def >= 72) return "Box-to-box";
    if (s.pas >= 84) return "Playmaker";
    return "Mezzala";
  }
  if (["CAM", "LAM", "RAM"].includes(pos)) {
    if (s.sho >= 80) return "Shadow striker";
    return "Classic 10";
  }
  if (["LW", "RW", "LM", "RM", "LF", "RF"].includes(pos)) {
    if (s.sho >= 78 && s.dri >= 80) return "Inside forward";
    if (s.pas >= 78) return "Inverted winger";
    return "Traditional winger";
  }
  if (s.phy >= 82 && s.sho >= 78) return "Target man";
  if (s.pac >= 84) return "Advanced forward";
  return "Pressing forward";
}

export function playerStrengths(player: Player): string[] {
  const s = player.currentSix;
  const out: string[] = [];
  if (isGoalkeeper(player.position) && player.gkCurrent) {
    const g = player.gkCurrent;
    if (g.ref >= 80) out.push("Elite reflexes");
    if (g.div >= 80) out.push("Strong diving range");
    if (g.kic >= 78) out.push("Distributes over distance");
    if (g.han >= 80) out.push("Commands the box");
  } else {
    if (s.pac >= 82) out.push("Recovers and stretches with pace");
    if (s.sho >= 82) out.push("Clinical in the box");
    if (s.pas >= 82) out.push("Progresses play through the lines");
    if (s.dri >= 82) out.push("Beats a man in tight spaces");
    if (s.def >= 82) out.push("Reads danger early");
    if (s.phy >= 82) out.push("Wins duels and holds the line");
  }
  if (player.captain) out.push("On-pitch leader");
  if (!out.length) out.push("Balanced, coachable profile");
  return out.slice(0, 4);
}

export function playerWeaknesses(player: Player): string[] {
  const s = player.currentSix;
  const out: string[] = [];
  if (isGoalkeeper(player.position) && player.gkCurrent) {
    const g = player.gkCurrent;
    if (g.spd < 60) out.push("Vulnerable in one-v-ones outside the box");
    if (g.kic < 65) out.push("Limited range on distribution");
  } else {
    if (s.pac < 62) out.push("Lacks recovery pace");
    if (s.sho < 55 && !["CB", "LCB", "RCB", "GK", "CDM"].includes(player.position))
      out.push("Needs a better end product");
    if (s.def < 55 && ["CB", "CDM", "LB", "RB"].includes(player.position))
      out.push("Can be exposed defensively");
    if (s.phy < 60) out.push("Loses physical duels against stronger sides");
    if (s.pas < 60) out.push("Build-up can stall on the ball");
  }
  if (!out.length) out.push("No glaring hole — keep developing the weaker foot and decision speed");
  return out.slice(0, 3);
}

export type MatchLite = { ratings?: Record<string, number>; motm?: string | null; goals?: Record<string, number> };

export function ratingsForPlayer(playerId: string, matches: MatchLite[]): number[] {
  return matches
    .filter((m) => typeof m.ratings?.[playerId] === "number")
    .map((m) => m.ratings![playerId]!);
}

/**
 * On-form aura eligibility. Requires a real sample of recent match ratings —
 * never guessed. Needs at least 3 rated appearances AND a genuinely
 * exceptional recent average before the card is allowed to show it.
 */
const ON_FORM_MIN_RATINGS = 3;
const ON_FORM_THRESHOLD = 8.5;

export function isOnForm(form: number | null, ratingsCount: number): boolean {
  return ratingsCount >= ON_FORM_MIN_RATINGS && form !== null && form >= ON_FORM_THRESHOLD;
}

export function derivePlayer(player: Player, matches: MatchLite[]) {
  const ratings = ratingsForPlayer(player.id, matches);
  const form = formFromRatings(ratings);
  const ovr = currentOvr(player);
  const base = baseOvr(player);
  const effective = effectiveOvr(player, form);
  const avgRating = ratings.length
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;
  const goals = matches.reduce((s, m) => s + (m.goals?.[player.id] || 0), 0);
  const motm = matches.filter((m) => m.motm === player.id).length;
  return {
    ovr,
    base,
    effective,
    form,
    formDelta: formDelta(form),
    onForm: isOnForm(form, ratings.length),
    rarity: rarityFor(ovr),
    design: resolvedDesign(player, ovr),
    role: recommendRole(player),
    strengths: playerStrengths(player),
    weaknesses: playerWeaknesses(player),
    suitability: allSuitability(player),
    avgRating,
    ratingsCount: ratings.length,
    goals,
    motm,
  };
}