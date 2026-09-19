import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getCurrentUserAndRole } from "@/routes/me";
import type { DeskData } from "@/lib/pitch/types";

/**
 * GET /desk  -> load the whole squad desk (players, coaches, trainings,
 *               matches, trophies, call-ups, design presets, opponent intel)
 * POST /desk -> replace the whole squad desk with the posted DeskData
 *
 * Full-replace strategy for simplicity: POST deletes each table's rows and
 * re-inserts the posted set. Fine for this app's usage (a small coaching
 * staff editing one shared desk) — not a per-row diff/patch API.
 *
 * NOTE: getSql()'s pool-based client doesn't expose multi-statement
 * transactions here, so the delete+insert pass per table is NOT atomic across
 * tables. Acceptable for this app's low write-concurrency; revisit if this
 * ever needs strict all-or-nothing guarantees.
 */

type PlayerRow = Record<string, unknown>;

function rowToPlayer(r: PlayerRow) {
  return {
    id: r.id,
    name: r.name,
    photo: r.photo,
    position: r.position,
    secondaryPositions: r.secondary_positions,
    foot: r.foot,
    number: r.number,
    age: r.age,
    height: r.height,
    captain: r.captain,
    team: r.team,
    email: r.email,
    phone: r.phone,
    guardianName: r.guardian_name,
    guardianEmail: r.guardian_email,
    guardianPhone: r.guardian_phone,
    category: r.category,
    cardDesign: r.card_design,
    cardStyle: r.card_style ?? undefined,
    baseSix: r.base_six,
    currentSix: r.current_six,
    detail: r.detail,
    gkBase: r.gk_base,
    gkCurrent: r.gk_current,
    playStyles: r.play_styles,
    playStylesPlus: r.play_styles_plus,
    weakFoot: r.weak_foot,
    skillMoves: r.skill_moves,
    history: r.history,
    createdAt: r.created_at,
  };
}

function rowToCoach(r: PlayerRow) {
  return {
    id: r.id,
    name: r.name,
    photo: r.photo,
    role: r.role,
    phone: r.phone,
    email: r.email,
    team: r.team,
    category: r.category,
    bio: r.bio,
    cardDesign: r.card_design,
    cardStyle: r.card_style ?? undefined,
    createdAt: r.created_at,
  };
}

function rowToTraining(r: PlayerRow) {
  return { id: r.id, date: r.date, title: r.title, category: r.category, attendance: r.attendance };
}

function rowToMatch(r: PlayerRow) {
  return {
    id: r.id,
    date: r.date,
    opponent: r.opponent,
    venue: r.venue,
    kickoff: r.kickoff,
    kind: r.kind,
    category: r.category,
    lineup: r.lineup,
    slotMap: r.slot_map,
    ratings: r.ratings,
    goals: r.goals,
    teamScore: r.team_score,
    opponentScore: r.opponent_score,
    motm: r.motm,
  };
}

function rowToTrophy(r: PlayerRow) {
  return {
    id: r.id,
    name: r.name,
    competition: r.competition,
    season: r.season,
    notes: r.notes,
    photo: r.photo,
    createdAt: r.created_at,
  };
}

function rowToCallUp(r: PlayerRow) {
  return {
    id: r.id,
    name: r.name,
    coachId: r.coach_id,
    category: r.category,
    date: r.date,
    entries: r.entries,
    createdAt: r.created_at,
  };
}

function rowToPreset(r: PlayerRow) {
  return { id: r.id, name: r.name, cardDesign: r.card_design, style: r.style };
}

export const Route = createFileRoute("/desk")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sql = await getSql();

          const [players, coaches, trainings, matches, trophies, callUps, designPresets, intelRows] =
            await Promise.all([
              sql`select * from players order by created_at asc`,
              sql`select * from coaches order by created_at asc`,
              sql`select * from trainings order by date asc`,
              sql`select * from matches order by date asc`,
              sql`select * from trophies order by created_at desc`,
              sql`select * from call_ups order by created_at desc`,
              sql`select * from design_presets`,
              sql`select * from opponent_intel limit 1`,
            ]);

          const desk: DeskData = {
            players: players.map(rowToPlayer) as DeskData["players"],
            coaches: coaches.map(rowToCoach) as DeskData["coaches"],
            trainings: trainings.map(rowToTraining) as DeskData["trainings"],
            matches: matches.map(rowToMatch) as DeskData["matches"],
            trophies: trophies.map(rowToTrophy) as DeskData["trophies"],
            callUps: callUps.map(rowToCallUp) as DeskData["callUps"],
            designPresets: designPresets.map(rowToPreset) as DeskData["designPresets"],
            opponentIntel: intelRows[0]
              ? { strengths: (intelRows[0] as PlayerRow).strengths as string, weaknesses: (intelRows[0] as PlayerRow).weaknesses as string }
              : { strengths: "", weaknesses: "" },
            meta: { seeded: true, version: 1 },
          };

          return new Response(JSON.stringify(desk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[desk] GET failed:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Failed to load desk" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      POST: async ({ request }) => {
        // Server-side gate: only "coach" role can write. Hiding the Save
        // button in the UI is not enough — anyone could otherwise POST to
        // this route directly and bypass a UI-only check.
        const { role } = await getCurrentUserAndRole();
        if (role !== "coach") {
          return new Response(JSON.stringify({ error: "You don't have permission to save changes." }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }

        let desk: DeskData;
        try {
          desk = (await request.json()) as DeskData;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const sql = await getSql();

          await sql`delete from players`;
          for (const p of desk.players) {
            await sql`
              insert into players (
                id, name, photo, position, secondary_positions, foot, number, age, height,
                captain, team, email, phone, guardian_name, guardian_email, guardian_phone,
                category, card_design, card_style, base_six, current_six, detail, gk_base,
                gk_current, play_styles, play_styles_plus, weak_foot, skill_moves, history, created_at
              ) values (
                ${p.id}, ${p.name}, ${p.photo}, ${p.position}, ${JSON.stringify(p.secondaryPositions)}, ${p.foot},
                ${p.number}, ${p.age}, ${p.height}, ${p.captain}, ${p.team}, ${p.email}, ${p.phone},
                ${p.guardianName}, ${p.guardianEmail}, ${p.guardianPhone}, ${p.category}, ${p.cardDesign},
                ${p.cardStyle ? JSON.stringify(p.cardStyle) : null}, ${JSON.stringify(p.baseSix)},
                ${JSON.stringify(p.currentSix)}, ${JSON.stringify(p.detail)},
                ${p.gkBase ? JSON.stringify(p.gkBase) : null}, ${p.gkCurrent ? JSON.stringify(p.gkCurrent) : null},
                ${JSON.stringify(p.playStyles)}, ${JSON.stringify(p.playStylesPlus)}, ${p.weakFoot}, ${p.skillMoves},
                ${JSON.stringify(p.history)}, ${p.createdAt}
              )
            `;
          }

          await sql`delete from coaches`;
          for (const c of desk.coaches) {
            await sql`
              insert into coaches (id, name, photo, role, phone, email, team, category, bio, card_design, card_style, created_at)
              values (
                ${c.id}, ${c.name}, ${c.photo}, ${c.role}, ${c.phone}, ${c.email}, ${c.team}, ${c.category}, ${c.bio},
                ${c.cardDesign}, ${c.cardStyle ? JSON.stringify(c.cardStyle) : null}, ${c.createdAt}
              )
            `;
          }

          await sql`delete from trainings`;
          for (const t of desk.trainings) {
            await sql`
              insert into trainings (id, date, title, category, attendance)
              values (${t.id}, ${t.date}, ${t.title}, ${t.category}, ${JSON.stringify(t.attendance)})
            `;
          }

          await sql`delete from matches`;
          for (const m of desk.matches) {
            await sql`
              insert into matches (id, date, opponent, venue, kickoff, kind, category, lineup, slot_map, ratings, goals, team_score, opponent_score, motm)
              values (
                ${m.id}, ${m.date}, ${m.opponent}, ${m.venue}, ${m.kickoff}, ${m.kind}, ${m.category},
                ${JSON.stringify(m.lineup)}, ${JSON.stringify(m.slotMap)}, ${JSON.stringify(m.ratings)},
                ${JSON.stringify(m.goals)}, ${m.teamScore}, ${m.opponentScore}, ${m.motm}
              )
            `;
          }

          await sql`delete from trophies`;
          for (const t of desk.trophies) {
            await sql`
              insert into trophies (id, name, competition, season, notes, photo, created_at)
              values (${t.id}, ${t.name}, ${t.competition}, ${t.season}, ${t.notes}, ${t.photo}, ${t.createdAt})
            `;
          }

          await sql`delete from call_ups`;
          for (const c of desk.callUps) {
            await sql`
              insert into call_ups (id, name, coach_id, category, date, entries, created_at)
              values (${c.id}, ${c.name}, ${c.coachId}, ${c.category}, ${c.date}, ${JSON.stringify(c.entries)}, ${c.createdAt})
            `;
          }

          await sql`delete from design_presets`;
          for (const p of desk.designPresets) {
            await sql`
              insert into design_presets (id, name, card_design, style)
              values (${p.id}, ${p.name}, ${p.cardDesign}, ${JSON.stringify(p.style)})
            `;
          }

          await sql`delete from opponent_intel`;
          if (desk.opponentIntel) {
            await sql`
              insert into opponent_intel (category, strengths, weaknesses)
              values ('default', ${desk.opponentIntel.strengths}, ${desk.opponentIntel.weaknesses})
            `;
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[desk] POST failed:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Failed to save desk" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});