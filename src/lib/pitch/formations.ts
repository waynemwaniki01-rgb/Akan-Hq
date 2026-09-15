import type { PitchSlot, PositionCode } from "./types";

export const FORMAT_LIST: Record<7 | 8 | 9 | 11, string[]> = {
  7: ["3-2-1", "2-3-1", "3-1-2", "2-2-2", "1-3-2"],
  8: ["3-3-1", "3-2-2", "2-3-2", "2-2-3", "4-2-1"],
  9: ["3-3-2", "3-2-3", "4-3-1", "4-2-2", "2-3-3"],
  11: [
    "4-4-2",
    "4-3-3",
    "4-2-3-1",
    "3-5-2",
    "3-4-3",
    "5-3-2",
    "5-4-1",
    "4-5-1",
    "4-2-2-2",
    "4-1-4-1",
    "4-3-1-2",
    "4-3-2-1",
    "4-2-4",
    "3-4-2-1",
    "3-4-1-2",
    "4-1-3-2",
    "3-2-4-1",
    "3-2-2-3",
    "3-1-4-2",
    "3-3-3-1",
    "2-3-5",
  ],
};

export const OPPONENT_DEFAULT: Record<7 | 8 | 9 | 11, string> = {
  7: "2-3-1",
  8: "3-3-1",
  9: "3-3-2",
  11: "4-4-2",
};

export const FORMAT_EMPHASIS: Record<7 | 8 | 9 | 11, string[]> = {
  7: ["Quick transitions", "Small spaces", "Compactness", "1-v-1 situations", "Width", "Short passing combinations"],
  8: ["Midfield structure", "Width", "Defensive transitions", "Overloads"],
  9: ["More defined positional roles", "Midfield control", "Wide attacking play", "Defensive organisation"],
  11: ["Full tactical structures", "Pressing systems", "Build-up patterns", "Defensive blocks", "Transitions", "Positional rotations"],
};

export type FormationInfo = {
  adv: string[];
  dis: string[];
  bestFor: string;
  requires: string;
  key: string;
};

const INFO: Record<string, FormationInfo> = {
  "7:3-2-1": { adv: ["Very balanced with a strong defensive base.", "Two midfielders support both boxes and control the centre."], dis: ["Can lack width out wide.", "The lone striker becomes isolated between defensive lines."], bestFor: "Teams wanting defensive solidity without giving up a central presence.", requires: "Disciplined, high-work-rate central midfielders.", key: "Central midfielders, lone striker" },
  "7:2-3-1": { adv: ["Excellent midfield control with passing triangles.", "Good attacking support behind the striker."], dis: ["Only two defenders — vulnerable to counters.", "Wide areas can be exposed in transition."], bestFor: "Possession-based teams that want to dominate the middle third.", requires: "Two disciplined centre-backs comfortable defending space.", key: "Central midfield three" },
  "7:3-1-2": { adv: ["Strong defensive base of three.", "Two attackers give a real goal threat.", "The pivot screens the back line."], dis: ["Narrow — wide areas are thin.", "The lone pivot can be overloaded and isolated."], bestFor: "Counter-attacking teams looking to spring two strikers in behind.", requires: "A tireless, tactically aware defensive midfielder.", key: "Defensive midfielder, front two" },
  "7:2-2-2": { adv: ["Balanced and easy to coach.", "Natural passing triangles in every third."], dis: ["Can lack width.", "Midfield pair can be outnumbered centrally."], bestFor: "Younger or developing squads learning shape.", requires: "Players who understand rotation and cover.", key: "Central midfield pair" },
  "7:1-3-2": { adv: ["Extremely strong in midfield and attack.", "Ideal for dominating possession."], dis: ["Only one recognised defender.", "Extremely exposed to the counter-attack."], bestFor: "Teams facing weaker opposition who want to press and dominate the ball.", requires: "Excellent, fast defensive recovery from midfield.", key: "Lone sweeper, front two" },
  "8:3-3-1": { adv: ["Excellent balance across the pitch.", "Three defenders give real security.", "The striker always has midfield support."], dis: ["Lone striker can be isolated.", "Wide midfielders must track back consistently."], bestFor: "Teams wanting control without sacrificing defensive shape.", requires: "Box-to-box wide midfielders.", key: "Wide midfielders, lone striker" },
  "8:3-2-2": { adv: ["Balanced attack and defence.", "Two forwards combine well together."], dis: ["Can lack width.", "Midfield pair can be outnumbered."], bestFor: "Teams that want a compact, hard-to-break-down block that still attacks in twos.", requires: "Two centrally strong midfielders covering the whole width.", key: "Central midfield pair" },
  "8:2-3-2": { adv: ["Strong midfield presence.", "Two forwards create good attacking options."], dis: ["Only two defenders.", "Space appears behind the midfield line."], bestFor: "Possession-first teams willing to defend higher up.", requires: "A back two comfortable defending in open space.", key: "Central midfield three" },
  "8:2-2-3": { adv: ["Very attacking — three forwards create constant pressure.", "Good for teams looking to dominate territory."], dis: ["Midfield becomes exposed.", "Large gaps open between defence and attack."], bestFor: "Chasing a game or facing a weaker opponent.", requires: "Attackers who track back the moment the ball is lost.", key: "Front three" },
  "8:4-2-1": { adv: ["Strong defensive structure.", "Two holding midfielders shield the back four."], dis: ["Can become too defensive.", "The striker is often isolated."], bestFor: "Protecting a lead or facing a stronger attacking side.", requires: "A striker who can hold the ball up alone.", key: "Holding midfield pair" },
  "9:3-3-2": { adv: ["Very balanced with real defensive stability.", "Three midfielders control the centre.", "Two strikers give attacking options."], dis: ["Wide areas can be exposed.", "Midfielders carry heavy defensive responsibility."], bestFor: "All-round teams wanting control in every phase.", requires: "Versatile midfielders who can defend and create.", key: "Central midfield three" },
  "9:3-2-3": { adv: ["Excellent attacking width.", "Three attackers create constant problems for a back line."], dis: ["Midfield can be bypassed.", "Space opens between midfield and defence."], bestFor: "Front-foot teams looking to overwhelm a back three or four.", requires: "Wide attackers who track back defensively.", key: "Front three" },
  "9:4-3-1": { adv: ["Strong defensive foundation of four.", "Three midfielders provide control.", "The attacking midfielder links play to the striker."], dis: ["The striker can become isolated.", "Lacks natural width."], bestFor: "Teams building patiently through a number 10.", requires: "A creative attacking midfielder.", key: "Attacking midfielder, striker" },
  "9:4-2-2": { adv: ["Strong defensive structure.", "Two holding midfielders protect the back four."], dis: ["Can become narrow.", "Struggles against a three-man midfield."], bestFor: "Facing possession-heavy opposition.", requires: "Disciplined double pivot.", key: "Double pivot" },
  "9:2-3-3": { adv: ["Extremely attacking with constant pressure up front.", "Three midfielders provide good passing options."], dis: ["Only two defenders — very vulnerable to counters.", "Needs excellent defensive transition."], bestFor: "Chasing games against deeper defences.", requires: "Fast recovery runs from the front three.", key: "Front three, central midfield three" },
  "11:4-4-2": { adv: ["Simple, balanced, and easy to organise.", "Two strikers support each other centrally."], dis: ["Can be outnumbered in central midfield.", "Wingers must track back or full-backs are exposed."], bestFor: "Teams prioritising a clear, well-drilled defensive block.", requires: "Disciplined banks of four.", key: "Central midfield pair, front two" },
  "11:4-3-3": { adv: ["Excellent natural width from the front three.", "Three central midfielders control possession and pressing."], dis: ["Space appears behind advancing full-backs.", "Wingers must contribute defensively or midfield is overloaded."], bestFor: "Teams that want to press high and dominate the ball.", requires: "Wingers who track back and full-backs who overlap intelligently.", key: "Full-backs, central midfield three" },
  "11:4-2-3-1": { adv: ["Strong protection in front of the back four.", "The attacking three create constant chance-creation."], dis: ["The lone striker can be isolated.", "Can drop too deep and become passive."], bestFor: "Balanced teams wanting control without losing defensive solidity.", requires: "A creative number 10 and a striker comfortable playing alone.", key: "Double pivot, number 10" },
  "11:3-5-2": { adv: ["Numerical superiority in midfield.", "Wing-backs provide width without sacrificing a back three.", "Two strikers support each other."], dis: ["Huge space behind the wing-backs.", "Wing-backs face enormous physical demand."], bestFor: "Teams with elite, high-endurance wing-backs.", key: "Wing-backs", requires: "Wing-backs who can defend and attack a full flank alone." },
  "11:3-4-3": { adv: ["Three attackers stretch any back line.", "Strong pressing triggers from a front three."], dis: ["Space behind the wing-backs.", "Centre-backs can be exposed 3-v-3 in behind."], bestFor: "Aggressive, front-foot teams committed to pressing.", requires: "Elite defensive organisation and recovery pace.", key: "Wing-backs, front three" },
  "11:5-3-2": { adv: ["Very strong defensive structure.", "Central midfield three controls the middle.", "Two strikers threaten on the counter."], dis: ["Can become overly defensive.", "Wing-backs pinned deep, limiting attacking outlets."], bestFor: "Protecting a lead or facing a stronger opponent.", requires: "Central midfielders who can both defend and spring counters.", key: "Central midfield three" },
  "11:5-4-1": { adv: ["Extremely difficult to play through centrally.", "Excellent for protecting a result."], dis: ["The lone striker is isolated.", "Very limited attacking threat and low territorial control."], bestFor: "Underdogs needing to frustrate a stronger side.", requires: "Total defensive discipline from every outfield player.", key: "Back five" },
  "11:4-5-1": { adv: ["Dominant central midfield presence.", "Very compact and hard to break down."], dis: ["The lone striker is often isolated.", "Can become too defensive and cede attacking territory."], bestFor: "Away trips against stronger, possession-based sides.", requires: "Midfielders willing to make late forward runs to support the striker.", key: "Central midfield five" },
  "11:4-2-2-2": { adv: ["Two strikers plus two attacking midfielders overload the centre.", "Double pivot protects the back four."], dis: ["Often lacks natural width.", "Full-backs must provide almost all the width alone."], bestFor: "Teams building through combination play in central zones.", requires: "Full-backs comfortable being the primary width outlet.", key: "Full-backs, double pivot" },
  "11:4-1-4-1": { adv: ["Excellent central coverage across the midfield four.", "The holding midfielder screens the back line."], dis: ["The lone striker becomes isolated.", "Huge responsibility falls on the single holding midfielder."], bestFor: "Structured pressing teams defending as a block of five.", requires: "An elite, high-workrate defensive midfielder.", key: "Holding midfielder" },
  "11:4-3-1-2": { adv: ["Strong central midfield control.", "The number 10 links play between midfield and two strikers."], dis: ["Very narrow — fullbacks provide almost all width.", "Vulnerable against teams that attack down the flanks."], bestFor: "Teams building centrally with two strikers up top.", requires: "Full-backs who bomb forward relentlessly.", key: "Number 10, full-backs" },
  "11:4-3-2-1": { adv: ["Strong central midfield with layered attacking support.", "Good for patient possession football."], dis: ["Naturally narrow with limited width.", "The lone striker can be isolated."], bestFor: "Possession-dominant teams happy to work the ball centrally.", requires: "Fluid, rotating attacking midfielders.", key: "Attacking midfield three" },
  "11:4-2-4": { adv: ["Huge attacking numbers can overwhelm a defence.", "Four attackers stretch play horizontally and vertically."], dis: ["Only two central midfielders — usually dominated there.", "Extremely exposed on the counter-attack."], bestFor: "Must-win situations chasing a result late in games.", requires: "Two midfielders capable of covering the whole pitch.", key: "Central midfield pair" },
  "11:3-4-2-1": { adv: ["Strong central midfield platform.", "Two attacking midfielders support a central striker."], dis: ["Wing-backs must cover huge amounts of space.", "Vulnerable on the flanks in transition."], bestFor: "Teams building with a central focal point and layered support.", requires: "Wing-backs with excellent stamina and recovery speed.", key: "Wing-backs, attacking midfield pair" },
  "11:3-4-1-2": { adv: ["Two strikers give a strong central threat.", "The number 10 connects midfield to attack."], dis: ["Width depends entirely on the wing-backs.", "Wide defensive spaces open when they push forward."], bestFor: "Teams wanting two out-and-out strikers plus central creativity.", requires: "A creative number 10 and disciplined wing-backs.", key: "Number 10" },
  "11:4-1-3-2": { adv: ["Two strikers offer a direct goal threat.", "The holding midfielder shields a back four.", "Three attacking midfielders create combinations."], dis: ["Wide areas can be exposed in behind full-backs.", "The lone pivot carries huge defensive responsibility."], bestFor: "Teams wanting a direct front two backed by central creativity.", requires: "A dominant, mobile defensive midfielder.", key: "Holding midfielder, front two" },
  "11:3-2-4-1": { adv: ["Excellent possession structure with five players occupying attacking zones.", "Strong build-up shape from the back three."], dis: ["Requires exceptional positional discipline.", "Exposed during rapid transitions if the double pivot is bypassed."], bestFor: "Elite possession teams building through the thirds with intent.", requires: "A double pivot capable of screening the whole back three.", key: "Double pivot" },
  "11:3-2-2-3": { adv: ["Strong attacking structure with layered passing triangles.", "Excellent for coordinated pressing."], dis: ["Space can appear beside the double pivot.", "Requires highly intelligent, constant player movement."], bestFor: "Technically elite teams that press and build with patience.", requires: "Intelligent rotation between all attacking-midfield players.", key: "Double pivot, attacking midfield pair" },
  "11:3-1-4-2": { adv: ["Two strikers plus four midfielders give huge central presence.", "The lone pivot protects a back three."], dis: ["The single defensive midfielder can be overwhelmed.", "Space can open directly behind the midfield line."], bestFor: "Teams dominating midfield numerically against a back four.", requires: "An exceptional lone defensive midfielder.", key: "Defensive midfielder" },
  "11:3-3-3-1": { adv: ["Many attacking options across three advanced lines.", "Strong for aggressive, coordinated pressing."], dis: ["Extremely complex to organise.", "Vulnerable during transitions if discipline slips."], bestFor: "Elite, tactically sophisticated squads.", requires: "Total positional discipline and game intelligence.", key: "Every line — total rotation" },
  "11:2-3-5": { adv: ["Massive attacking presence creating overloads in the final third.", "Historically the foundation of attacking football."], dis: ["Almost no defensive protection.", "Modern opponents can counter into huge open space."], bestFor: "Demonstrating football history, or facing a vastly weaker side.", requires: "A back two supremely confident defending in isolation.", key: "Back two" },
};

export function infoFor(size: number, formation: string): FormationInfo {
  return (
    INFO[`${size}:${formation}`] || {
      adv: ["Balanced shape."],
      dis: ["Can be exploited if players lose discipline."],
      bestFor: "General use.",
      requires: "Good positional awareness.",
      key: "—",
    }
  );
}

function linspace(a: number, b: number, n: number) {
  if (n <= 1) return [a];
  const arr: number[] = [];
  for (let i = 0; i < n; i++) arr.push(a + ((b - a) * i) / (n - 1));
  return arr;
}

function xsFor(count: number): number[] {
  if (count <= 1) return [50];
  if (count === 2) return [34, 66];
  if (count === 3) return [20, 50, 80];
  if (count === 4) return [12, 36, 64, 88];
  if (count === 5) return [10, 30, 50, 70, 90];
  return linspace(10, 90, count);
}

function labelLine(count: number, lineIndex: number, totalLines: number): PositionCode[] {
  const isLast = lineIndex === totalLines - 1;
  const isFirst = lineIndex === 0;
  if (isFirst) {
    if (count === 1) return ["CB"];
    if (count === 2) return ["LCB", "RCB"];
    if (count === 3) return ["LCB", "CB", "RCB"];
    if (count === 4) return ["LB", "LCB", "RCB", "RB"];
    if (count === 5) return ["LWB", "LCB", "CB", "RCB", "RWB"];
    return Array.from({ length: count }, (_, i) =>
      i === 0 ? "LB" : i === count - 1 ? "RB" : "CB",
    ) as PositionCode[];
  }
  if (isLast) {
    if (count === 1) return ["ST"];
    if (count === 2) return ["ST", "ST"];
    if (count === 3) return ["LW", "ST", "RW"];
    if (count === 4) return ["LW", "CF", "CF", "RW"];
    if (count === 5) return ["LW", "LF", "ST", "RF", "RW"];
    return Array.from({ length: count }, () => "ST") as PositionCode[];
  }
  const midIndex = lineIndex;
  const midCount = totalLines - 2;
  const t = midCount <= 1 ? 0.5 : (midIndex - 1) / (midCount - 1);
  if (t < 0.34) {
    if (count === 1) return ["CDM"];
    if (count === 2) return ["LDM", "RDM"];
    if (count === 3) return ["LCM", "CDM", "RCM"];
    if (count === 4) return ["LM", "LCM", "RCM", "RM"];
    return ["LM", "LCM", "CDM", "RCM", "RM"].slice(0, count) as PositionCode[];
  }
  if (t > 0.66) {
    if (count === 1) return ["CAM"];
    if (count === 2) return ["LAM", "RAM"];
    if (count === 3) return ["LAM", "CAM", "RAM"];
    if (count === 4) return ["LM", "LAM", "RAM", "RM"];
    return ["LW", "LAM", "CAM", "RAM", "RW"].slice(0, count) as PositionCode[];
  }
  if (count === 1) return ["CM"];
  if (count === 2) return ["LCM", "RCM"];
  if (count === 3) return ["LCM", "CM", "RCM"];
  if (count === 4) return ["LM", "LCM", "RCM", "RM"];
  return ["LM", "LCM", "CM", "RCM", "RM"].slice(0, count) as PositionCode[];
}

export function layoutFormation(formationStr: string, side: "own" | "opp"): PitchSlot[] {
  const lines = formationStr.split("-").map(Number);
  const gkY = side === "own" ? 92 : 8;
  const yFrom = side === "own" ? 68 : 28;
  const yTo = side === "own" ? 16 : 46;
  const ys = linspace(yFrom, yTo, lines.length);
  const slots: PitchSlot[] = [{ id: "gk", pos: "GK", x: 50, y: gkY, line: "GK" }];
  lines.forEach((count, i) => {
    const labels = labelLine(count, i, lines.length);
    const xs = xsFor(count);
    for (let j = 0; j < count; j++) {
      slots.push({
        id: `l${i}p${j}`,
        pos: labels[j] ?? "CM",
        x: xs[j] ?? 50,
        y: ys[i] ?? 50,
        line: i === 0 ? "DEF" : i === lines.length - 1 ? "FWD" : "MID",
      });
    }
  });
  if (side === "opp") {
    return slots.map((s) => ({ ...s, x: 100 - s.x }));
  }
  return slots;
}

export function cloneSlots(slots: PitchSlot[]): PitchSlot[] {
  return slots.map((s) => ({ ...s }));
}

export function ratingsFor(formationStr: string) {
  const lines = formationStr.split("-").map(Number);
  const def = lines[0] ?? 4;
  const fwd = lines[lines.length - 1] ?? 2;
  const midTotal = lines.slice(1, -1).reduce((a, b) => a + b, 0);
  const n = lines.length;
  const clamp5 = (v: number) => Math.max(1, Math.min(5, Math.round(v)));
  return {
    Attacking: clamp5(fwd * 1.4 + midTotal * 0.25),
    Defending: clamp5(def * 1.05 + (n >= 4 ? 0.6 : 0)),
    Possession: clamp5(midTotal * 0.9 + 0.5),
    Pressing: clamp5((def + midTotal) * 0.5),
    Counter: clamp5(fwd * 1.1 + (def <= 3 ? 0.8 : 0)),
    Width: clamp5((def >= 4 ? 3.6 : 2.4) + (n >= 4 ? 0.8 : 0)),
    Central: clamp5(midTotal * 1.0 + 0.4),
  };
}

/**
 * NEW — eFootball-style freeform positioning.
 *
 * Converts a raw pitch coordinate (x/y as percentages, "own" side
 * orientation where low y = near the opponent's goal, high y = near
 * your own goal) into the closest sensible PositionCode. This is a
 * zone-based heuristic, not an exact science — it's what lets a card
 * dragged to open grass get a believable label (and therefore a
 * believable roleAdjustedRating) instead of staying stuck with
 * whatever position it started the drag with.
 */
export function positionFromPoint(x: number, y: number): PositionCode {
  const xBand = x < 25 ? "L" : x > 75 ? "R" : x < 42 ? "LC" : x > 58 ? "RC" : "C";

  if (y >= 85) return "GK";

  if (y >= 62) {
    if (xBand === "L") return "LB";
    if (xBand === "R") return "RB";
    if (xBand === "LC") return "LCB";
    if (xBand === "RC") return "RCB";
    return "CB";
  }

  if (y >= 45) {
    if (xBand === "L") return "LDM";
    if (xBand === "R") return "RDM";
    return "CDM";
  }

  if (y >= 30) {
    if (xBand === "L") return "LM";
    if (xBand === "R") return "RM";
    if (xBand === "LC") return "LCM";
    if (xBand === "RC") return "RCM";
    return "CM";
  }

  if (y >= 18) {
    if (xBand === "L") return "LW";
    if (xBand === "R") return "RW";
    if (xBand === "LC") return "LAM";
    if (xBand === "RC") return "RAM";
    return "CAM";
  }

  if (xBand === "L") return "LW";
  if (xBand === "R") return "RW";
  return "ST";
}