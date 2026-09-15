import type { DeskData, Match, MatchKind, Training } from "./types";

const FIXTURES: { date: string; opponent: string; venue: "Home" | "Away"; kickoff: string; kind: MatchKind }[] = [
  { date: "2026-09-02", opponent: "SAA", venue: "Home", kickoff: "13:30", kind: "League" },
  { date: "2026-09-08", opponent: "Makini Runda", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-09-12", opponent: "Hillcrest Tournament", venue: "Away", kickoff: "07:00", kind: "Tournament" },
  { date: "2026-09-14", opponent: "Rusinga", venue: "Home", kickoff: "13:30", kind: "League" },
  { date: "2026-09-17", opponent: "Nairobi Academy", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-09-21", opponent: "Braeside Thika", venue: "Home", kickoff: "13:30", kind: "League" },
  { date: "2026-09-26", opponent: "IPSSA Tournament @ Crawford", venue: "Away", kickoff: "07:00", kind: "Tournament" },
  { date: "2026-09-30", opponent: "Makini", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-10-01", opponent: "Oshwal", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-10-03", opponent: "Braeside Thika Tournament", venue: "Away", kickoff: "07:00", kind: "Tournament" },
  { date: "2026-10-28", opponent: "Crawford", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-11-04", opponent: "Woodcreek", venue: "Away", kickoff: "13:30", kind: "League" },
  { date: "2026-11-10", opponent: "Swaminarayan", venue: "Home", kickoff: "13:30", kind: "League" },
];

function fixtureMatch(
  id: string,
  f: (typeof FIXTURES)[number],
): Match {
  return {
    id,
    date: f.date,
    opponent: f.opponent,
    venue: f.venue,
    kickoff: f.kickoff,
    kind: f.kind,
    category: "U15",
    lineup: [],
    slotMap: {},
    ratings: {},
    goals: {},
    teamScore: null,
    opponentScore: null,
    motm: null,
  };
}

const SESSIONS: Training[] = [
  {
    id: "t-shape",
    date: "2026-08-25",
    title: "Shape + pressing triggers",
    category: "U15",
    attendance: {},
  },
  {
    id: "t-finish",
    date: "2026-08-28",
    title: "Finishing + set pieces",
    category: "U15",
    attendance: {},
  },
];

/** Fixtures and sessions only — no demo players, no Staff Select, no Pre-Season XI. */
export function emptyData(): DeskData {
  return {
    players: [],
    trainings: SESSIONS,
    matches: FIXTURES.map((f, i) => fixtureMatch(`fx-${i + 1}`, f)),
    trophies: [],
    coaches: [],
    callUps: [],
    opponentIntel: { strengths: "", weaknesses: "" },
    designPresets: [],
    meta: { seeded: false, version: 6 },
  };
}