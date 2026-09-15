  import { clamp } from "@/lib/utils";
  import { FORMAT_LIST, infoFor, layoutFormation, ratingsFor } from "./formations";
  import {
    derivePlayer,
    formDelta,
    isGoalkeeper,
    positionRating,
    roleAdjustedRating,
    suitabilityPct,
  } from "./ratings";
  import type { Match, OpponentIntel, PitchSlot, Player, PositionCode } from "./types";

  export type AssignedSlot = {
    slot: PitchSlot;
    player: Player | null;
    posRating: number;
    suitability: number;
    effective: number;
    reason: string;
  };

  export type FormationEval = {
    formation: string;
    size: 7 | 8 | 9 | 11;
    fit: number;
    attack: number;
    defence: number;
    possession: number;
    width: number;
    assignment: AssignedSlot[];
    explanation: string;
    strengths: string[];
    weaknesses: string[];
    problems: string[];
    formNotes: string[];
  };

  function tacticalScore(
    player: Player,
    pos: PositionCode,
    matches: Match[],
  ): { score: number; posRating: number; suitability: number; effective: number; formNote?: string } {
    const d = derivePlayer(player, matches);
    const posRating = roleAdjustedRating(player, pos, 1.1);
    const suitability = suitabilityPct(player, pos);
    const effective = d.effective;
    const formBoost = formDelta(d.form);
    // Position first, then form, then raw effective. A winger at centre-back gets punished quickly.
    const score = posRating * 0.45 + (suitability / 100) * 35 + effective * 0.2 + formBoost * 3;
    let formNote: string | undefined;
    if (d.form !== null && d.form >= 8.5 && d.base > effective - 1) {
      formNote = `${player.name} is in excellent form (${d.form}/10) — currently performing above base card.`;
    }
    if (d.form !== null && d.form <= 6.2) {
      formNote = `${player.name} has a higher base rating but is in poor form (${d.form}/10).`;
    }
    return { score, posRating, suitability, effective, formNote };
  }

  function assignBest(
    slots: PitchSlot[],
    players: Player[],
    matches: Match[],
  ): { assignment: AssignedSlot[]; formNotes: string[] } {
    const remaining = [...players];
    const assignment: AssignedSlot[] = [];
    const formNotes: string[] = [];

    // Scarcer slots first (GK, then unique wide roles, then rest)
    const scarcity = (pos: PositionCode) => {
      if (pos === "GK") return 0;
      if (["ST", "CF", "SS"].includes(pos)) return 1;
      if (["CB", "LCB", "RCB"].includes(pos)) return 2;
      if (["LB", "RB", "LWB", "RWB"].includes(pos)) return 3;
      if (["LW", "RW"].includes(pos)) return 4;
      return 5;
    };
    const ordered = [...slots].sort((a, b) => scarcity(a.pos) - scarcity(b.pos));

    const used = new Set<string>();
    for (const slot of ordered) {
      let best: { player: Player; meta: ReturnType<typeof tacticalScore> } | null = null;
      for (const p of remaining) {
        if (used.has(p.id)) continue;
        if (slot.pos === "GK" && !isGoalkeeper(p.position) && !p.secondaryPositions.includes("GK")) {
          // allow a GK-trained outfielder only as last resort later
        }
        if (slot.pos !== "GK" && isGoalkeeper(p.position)) continue;
        const meta = tacticalScore(p, slot.pos, matches);
        if (!best || meta.score > best.meta.score) best = { player: p, meta };
      }
      if (slot.pos === "GK" && best && !isGoalkeeper(best.player.position)) {
        const gk = remaining.find((p) => isGoalkeeper(p.position) && !used.has(p.id));
        if (gk) best = { player: gk, meta: tacticalScore(gk, "GK", matches) };
      }
      if (!best) {
        assignment.push({
          slot,
          player: null,
          posRating: 0,
          suitability: 0,
          effective: 0,
          reason: "No player available for this role.",
        });
        continue;
      }
      used.add(best.player.id);
      if (best.meta.formNote) formNotes.push(best.meta.formNote);
      const d = derivePlayer(best.player, matches);
      const reason =
        best.meta.suitability >= 80
          ? `Natural ${slot.pos} — ${best.meta.suitability}% fit, ${d.role.toLowerCase()}.`
          : `Cover at ${slot.pos} (${best.meta.suitability}% suitability) with ${d.effective} effective rating.`;
      assignment.push({
        slot,
        player: best.player,
        posRating: best.meta.posRating,
        suitability: best.meta.suitability,
        effective: best.meta.effective,
        reason,
      });
    }

    // restore original slot order
    assignment.sort((a, b) => slots.findIndex((s) => s.id === a.slot.id) - slots.findIndex((s) => s.id === b.slot.id));
    return { assignment, formNotes };
  }

  function axisScores(assignment: AssignedSlot[], formation: string) {
    const filled = assignment.filter((a) => a.player);
    const avg = (line: string) => {
      const rows = filled.filter((a) => a.slot.line === line);
      if (!rows.length) return 50;
      return rows.reduce((s, a) => s + a.posRating, 0) / rows.length;
    };
    const shape = ratingsFor(formation);
    const defP = avg("DEF");
    const midP = avg("MID");
    const fwdP = avg("FWD");
    const gk = filled.find((a) => a.slot.pos === "GK")?.posRating ?? 60;
    const defence = clamp(Math.round(defP * 0.55 + gk * 0.2 + midP * 0.15 + shape.Defending * 4), 1, 99);
    const attack = clamp(Math.round(fwdP * 0.6 + midP * 0.25 + shape.Attacking * 4), 1, 99);
    const possession = clamp(Math.round(midP * 0.55 + (filled.reduce((s, a) => s + (a.player?.currentSix.pas ?? 60), 0) / Math.max(1, filled.length)) * 0.3 + shape.Possession * 3), 1, 99);
    const width = clamp(Math.round(shape.Width * 16 + (filled.filter((a) => ["LW", "RW", "LM", "RM", "LB", "RB", "LWB", "RWB"].includes(a.slot.pos)).length >= 4 ? 8 : 0)), 1, 99);
    return { attack, defence, possession, width };
  }

  function problemsFor(assignment: AssignedSlot[], players: Player[]): string[] {
    const issues: string[] = [];
    const filled = assignment.filter((a) => a.player) as (AssignedSlot & { player: Player })[];
    const fbs = filled.filter((a) => ["LB", "RB", "LWB", "RWB"].includes(a.slot.pos));
    if (fbs.length && fbs.every((a) => a.player.currentSix.pac < 72)) {
      issues.push("Your squad lacks pace at full back — transitions the other way will hurt.");
    }
    const mids = filled.filter((a) => a.slot.line === "MID");
    if (mids.length) {
      const avgPas = mids.reduce((s, a) => s + a.player.currentSix.pas, 0) / mids.length;
      const avgDef = mids.reduce((s, a) => s + a.player.currentSix.def, 0) / mids.length;
      if (avgPas >= 80 && avgDef < 68) {
        issues.push("Your midfield has excellent passing but limited defensive strength.");
      }
      if (avgPas >= 78) {
        issues.push("You have several technically strong midfielders, making a possession-based formation more suitable.");
      }
    }
    const cbs = filled.filter((a) => ["CB", "LCB", "RCB"].includes(a.slot.pos));
    if (cbs.length && cbs.every((a) => a.player.currentSix.pac < 68) && cbs.every((a) => a.player.currentSix.def >= 78)) {
      issues.push("Your centre-backs are strong defensively but vulnerable against fast attackers.");
    }
    const wingers = filled.filter((a) => ["LW", "RW", "LM", "RM"].includes(a.slot.pos));
    if (wingers.length >= 2 && wingers.every((a) => a.suitability >= 78)) {
      issues.push("Wide players are a genuine strength — keep them high and supply early.");
    }
    const uncovered = assignment.filter((a) => !a.player);
    if (uncovered.length) {
      issues.push(`You are short ${uncovered.length} player${uncovered.length === 1 ? "" : "s"} for a complete XI in this shape.`);
    }
    const offPos = filled.filter((a) => a.suitability < 55);
    if (offPos.length) {
      issues.push(
        `${offPos.map((a) => a.player.name).join(", ")} ${offPos.length === 1 ? "is" : "are"} being asked to play well off-position.`,
      );
    }
    // depth
    const unused = players.filter((p) => !filled.some((a) => a.player.id === p.id) && !isGoalkeeper(p.position));
    if (unused.length < 3) issues.push("Thin bench — rotation and injuries will quickly change the picture.");
    return [...new Set(issues)].slice(0, 5);
  }

  function applyOpponent(evaln: FormationEval, intel: OpponentIntel): FormationEval {
    const s = intel.strengths.toLowerCase();
    const w = intel.weaknesses.toLowerCase();
    const extra: string[] = [];
    let fitAdj = 0;
    if (/fast wing|pacey wing|wingers/.test(s)) {
      extra.push("The opponent has fast wingers, so a deeper defensive line is safer than pushing both full-backs high.");
      if (evaln.formation.startsWith("3-") || evaln.formation.startsWith("2-")) fitAdj -= 6;
      if (evaln.formation.startsWith("5-") || evaln.formation.startsWith("4-")) fitAdj += 3;
    }
    if (/strong strik|target man|aerial/.test(s)) {
      extra.push("A physical striker up against you favours an extra centre-back or a compact midfield screen.");
      if (evaln.formation.startsWith("3-") || evaln.formation.startsWith("5-")) fitAdj += 4;
    }
    if (/high press|pressing/.test(s)) {
      extra.push("Against a high press, build with a back three or a double pivot so the first pass is never isolated.");
      if (evaln.formation.includes("2-3") || evaln.formation.startsWith("3-2")) fitAdj += 3;
    }
    if (/slow centre|slow cb|high line/.test(w)) {
      extra.push("Slow centre-backs in the other team reward a front three that runs in behind — 4-3-3 and 3-4-3 gain.");
      if (["4-3-3", "3-4-3", "4-2-4"].includes(evaln.formation)) fitAdj += 5;
    }
    if (/weak mid|midfield/.test(w)) {
      extra.push("A weak opposing midfield is an invitation to overload the centre (4-2-3-1, 3-5-2, 4-3-1-2).");
      if (["4-2-3-1", "3-5-2", "4-3-1-2", "4-1-4-1"].includes(evaln.formation)) fitAdj += 4;
    }
    if (/poor transition|counter/.test(w)) {
      extra.push("Poor defensive transitions at the other end reward aggressive full-backs and a high press.");
      if (["4-3-3", "3-4-3"].includes(evaln.formation)) fitAdj += 3;
    }
    return {
      ...evaln,
      fit: clamp(evaln.fit + fitAdj, 1, 99),
      explanation: extra.length ? `${evaln.explanation} ${extra.join(" ")}` : evaln.explanation,
      problems: [...evaln.problems, ...extra].slice(0, 6),
    };
  }

  function explain(evaln: Omit<FormationEval, "explanation">, info: ReturnType<typeof infoFor>): string {
    const names = evaln.assignment.filter((a) => a.player).map((a) => a.player!.name);
    const wingers = evaln.assignment.filter((a) => a.player && ["LW", "RW", "LM", "RM"].includes(a.slot.pos));
    const dm = evaln.assignment.find((a) => a.player && ["CDM", "LDM", "RDM"].includes(a.slot.pos));
    const cbs = evaln.assignment.filter((a) => a.player && ["CB", "LCB", "RCB"].includes(a.slot.pos));
    const bits: string[] = [];
    bits.push(
      `${evaln.formation} is recommended based on the player data you entered — it is an analytical suggestion, not a guarantee of match success.`,
    );
    if (wingers.length >= 2 && wingers.every((a) => a.suitability >= 75)) {
      bits.push(
        `Your squad has ${wingers.length} strong wide players (${wingers.map((a) => a.player!.name).join(" and ")}).`,
      );
    }
    if (dm && dm.effective >= 80) {
      bits.push(`${dm.player!.name} is a high-rated defensive midfielder who can screen the back line.`);
    }
    if (cbs.length && cbs.every((a) => (a.player?.currentSix.pas ?? 0) >= 74)) {
      bits.push("Your centre-backs pass well enough to build from the back.");
    }
    bits.push(info.bestFor);
    if (names.length) bits.push(`Best available XI uses ${names.slice(0, 3).join(", ")} as the spine.`);
    return bits.join(" ");
  }

  export function evaluateFormation(
    size: 7 | 8 | 9 | 11,
    formation: string,
    players: Player[],
    matches: Match[],
    intel?: OpponentIntel,
  ): FormationEval {
    const slots = layoutFormation(formation, "own");
    const { assignment, formNotes } = assignBest(slots, players, matches);
    const axes = axisScores(assignment, formation);
    const filled = assignment.filter((a) => a.player);
    const avgSuit = filled.length ? filled.reduce((s, a) => s + a.suitability, 0) / filled.length : 40;
    const avgEff = filled.length ? filled.reduce((s, a) => s + a.effective, 0) / filled.length : 50;
    const balance = 100 - Math.abs(axes.attack - axes.defence) * 0.4;
    const depth = clamp(players.length / (size + 4), 0, 1) * 8;
    const fit = clamp(
      Math.round(avgSuit * 0.35 + avgEff * 0.25 + (axes.attack + axes.defence + axes.possession) / 15 + balance * 0.15 + depth),
      1,
      99,
    );
    const info = infoFor(size, formation);
    const problems = problemsFor(assignment, players);
    const base: FormationEval = {
      formation,
      size,
      fit,
      ...axes,
      assignment,
      explanation: "",
      strengths: info.adv,
      weaknesses: info.dis,
      problems,
      formNotes: [...new Set(formNotes)].slice(0, 4),
    };
    base.explanation = explain(base, info);
    return intel && (intel.strengths || intel.weaknesses) ? applyOpponent(base, intel) : base;
  }

  export function rankFormations(
    size: 7 | 8 | 9 | 11,
    players: Player[],
    matches: Match[],
    intel?: OpponentIntel,
  ): FormationEval[] {
    return FORMAT_LIST[size]
      .map((f) => evaluateFormation(size, f, players, matches, intel))
      .sort((a, b) => b.fit - a.fit);
  }

  export function slotMapFromEval(evaln: FormationEval): Record<string, string> {
    const map: Record<string, string> = {};
    for (const a of evaln.assignment) {
      if (a.player) map[a.slot.id] = a.player.id;
    }
    return map;
  }
