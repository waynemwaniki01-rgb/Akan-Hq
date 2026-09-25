/**
 * One background-music track per app section. Add a new entry here
 * whenever a new section needs its own track — the id must match
 * whatever string your section switcher uses to identify the active
 * section (e.g. "login", "home", "card", "board", "simulate",
 * "possession", "compare").
 *
 * Board, Simulate, Possession, and Compare all share one track
 * ("workspace.mp3") since they're treated as one continuous session
 * rather than needing separate music per tab.
 */
export const SECTION_MUSIC: Record<string, string> = {
  login: "/audio/login.mp3",
  home: "/audio/home.mp3",
  card: "/audio/card-section.mp3",
  board: "/audio/workspace.mp3",
  simulate: "/audio/workspace.mp3",
  possession: "/audio/workspace.mp3",
  compare: "/audio/workspace.mp3",
};