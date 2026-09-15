import type { PitchSlot, SequencePhase } from "./types";
import { cloneSlots, type FormationInfo } from "./formations";

function pickNearest(list: PitchSlot[], targetX: number, fallback: PitchSlot) {
  if (!list.length) return fallback;
  return list.reduce((a, b) => (Math.abs(a.x - targetX) < Math.abs(b.x - targetX) ? a : b));
}
function pickWidest(list: PitchSlot[], fallback: PitchSlot) {
  if (!list.length) return fallback;
  return list.reduce((a, b) => (Math.abs(b.x - 50) > Math.abs(a.x - 50) ? b : a));
}

export function buildAdvantageSequence(own: PitchSlot[], opp: PitchSlot[], info: FormationInfo): SequencePhase[] {
  const base = cloneSlots(own);
  const gk = base.find((s) => s.id === "gk") ?? base[0];
  const def = base.filter((s) => s.line === "DEF");
  const midish = base.filter((s) => s.line === "MID");
  const fwd = base.filter((s) => s.line === "FWD");
  const nearCB = pickNearest(def, 38, gk);
  const centralMid = midish.length ? pickNearest(midish, 50, nearCB) : nearCB;
  const wideAttacker = pickWidest([...fwd, ...midish], centralMid);
  const side = wideAttacker.x < 50 ? -1 : 1;
  const flankDefs = def.filter((s) => Math.sign(s.x - 50) === side || def.length === 1);
  const fullback = flankDefs.length ? pickWidest(flankDefs, def[0] ?? gk) : null;
  const striker = fwd.length ? pickNearest(fwd, 50, centralMid) : centralMid;

  const phases: SequencePhase[] = [];
  phases.push({
    own: cloneSlots(base),
    opp: cloneSlots(opp),
    ball: { x: gk.x, y: gk.y },
    note: "Kick-off shape — the goalkeeper starts the build-up from the back.",
  });
  phases.push({
    own: cloneSlots(base),
    opp: cloneSlots(opp),
    ball: { x: nearCB.x, y: nearCB.y },
    note: "The ball is played to the nearest centre-back to begin the phase of play.",
  });
  phases.push({
    own: cloneSlots(base),
    opp: cloneSlots(opp),
    ball: { x: centralMid.x, y: centralMid.y },
    note: "A central midfielder drops between the lines to receive on the half-turn.",
  });

  const p3 = cloneSlots(base);
  if (fullback) {
    const fb = p3.find((s) => s.id === fullback.id);
    if (fb) fb.y -= 16;
  }
  phases.push({
    own: p3,
    opp: cloneSlots(opp),
    ball: { x: wideAttacker.x, y: wideAttacker.y },
    note: "Play is switched to the wide player, who holds the width and pins the opposing full-back.",
  });

  const p4 = cloneSlots(p3);
  if (fullback) {
    const fb = p4.find((s) => s.id === fullback.id);
    if (fb) {
      fb.y -= 14;
      fb.x += side * 5;
    }
  }
  const wa4 = p4.find((s) => s.id === wideAttacker.id);
  if (wa4) {
    wa4.x -= side * 12;
    wa4.y -= 5;
  }
  const ballAt4 = fullback ? p4.find((s) => s.id === fullback.id) ?? wa4 : wa4;
  phases.push({
    own: p4,
    opp: cloneSlots(opp),
    ball: { x: ballAt4?.x ?? 50, y: ballAt4?.y ?? 40 },
    note: "The full-back overlaps into the space the winger just vacated — a 2-v-1 out wide.",
  });

  const p5 = cloneSlots(p4);
  const st5 = p5.find((s) => s.id === striker.id);
  if (st5) st5.y -= 3;
  phases.push({
    own: p5,
    opp: cloneSlots(opp),
    ball: { x: st5?.x ?? 50, y: st5?.y ?? 20 },
    note: `ADVANTAGE — ${info.adv[0]}`,
  });

  return phases;
}

export function buildDisadvantageSequence(own: PitchSlot[], opp: PitchSlot[], info: FormationInfo): SequencePhase[] {
  const base = cloneSlots(own);
  const def = base.filter((s) => s.line === "DEF");
  const wideDef = def.length ? pickWidest(def, base[0]) : base[0];
  const side = wideDef.x < 50 ? -1 : 1;
  const oppFwd = opp.filter((s) => s.line === "FWD");
  const runner = oppFwd.length ? pickWidest(oppFwd, opp[opp.length - 1] ?? opp[0]) : opp[opp.length - 1] ?? opp[0];

  const phases: SequencePhase[] = [];
  const p0 = cloneSlots(base);
  const wd0 = p0.find((s) => s.id === wideDef.id);
  if (wd0) wd0.y -= 20;
  phases.push({
    own: p0,
    opp: cloneSlots(opp),
    ball: { x: wd0?.x ?? 50, y: (wd0?.y ?? 70) - 6 },
    note: "Possession is lost high up the pitch — the advanced defender is caught out of position.",
  });

  const opp1 = cloneSlots(opp);
  const r1 = opp1.find((s) => s.id === runner.id);
  if (r1) r1.y += 22;
  phases.push({
    own: cloneSlots(p0),
    opp: opp1,
    ball: { x: r1?.x ?? 50, y: r1?.y ?? 40 },
    note: "The opponent immediately plays into the channel — their runner sprints into the vacated space.",
  });

  const p2 = cloneSlots(p0);
  p2.filter((s) => s.line === "DEF" && s.id !== wideDef.id).forEach((c) => {
    c.x += side * 7;
  });
  const opp2 = cloneSlots(opp1);
  const r2 = opp2.find((s) => s.id === runner.id);
  if (r2) r2.y += 18;
  phases.push({
    own: p2,
    opp: opp2,
    ball: { x: r2?.x ?? 50, y: r2?.y ?? 50 },
    note: "The back line has to shift across urgently — but the runner already has a head start.",
  });

  const opp3 = cloneSlots(opp2);
  const r3 = opp3.find((s) => s.id === runner.id);
  if (r3) r3.y += 12;
  phases.push({
    own: cloneSlots(p2),
    opp: opp3,
    ball: { x: r3?.x ?? 50, y: r3?.y ?? 60 },
    note: `DISADVANTAGE — ${info.dis[0]}`,
  });

  return phases;
}

export function buildPossessionMorph(own: PitchSlot[]) {
  const base = cloneSlots(own);
  const def = base.filter((s) => s.line === "DEF");
  const maxAbs = Math.max(1, ...def.map((s) => Math.abs(s.x - 50)));
  const inPoss = base.map((s) => {
    if (s.id === "gk") return { ...s };
    if (s.line === "DEF") {
      const wide = Math.abs(s.x - 50) > maxAbs * 0.5;
      return { ...s, y: wide ? s.y - 24 : s.y - 4 };
    }
    if (s.line === "FWD") return { ...s, x: 50 + (s.x - 50) * 1.15, y: s.y - 2 };
    return { ...s, y: s.y - 5 };
  });
  const outPoss = base.map((s) => {
    if (s.id === "gk") return { ...s };
    if (s.line === "DEF") return { ...s, y: Math.min(90, s.y + 3) };
    if (s.line === "FWD") return { ...s, y: s.y + 20, x: 50 + (s.x - 50) * 0.5 };
    return { ...s, y: s.y + 6, x: 50 + (s.x - 50) * 0.8 };
  });
  return { base, inPoss, outPoss };
}
