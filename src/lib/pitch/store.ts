import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";
import { clamp, uid } from "@/lib/utils";
import { emptyData } from "./seed";
import { spreadDetail } from "./ratings";
import { positionFromPoint } from "./formations";
import type {
  CardDesign,
  CardStyle,
  Coach,
  CoachRole,
  CallUp,
  CallUpEntry,
  DesignPreset,
  DeskData,
  GkSix,
  Match,
  MatchKind,
  OpponentIntel,
  OutfieldSix,
  Player,
  PositionCode,
  SlotOverride,
  StarRating,
  Training,
} from "./types";
 
export type Mode = "squad" | "tactiq" | "advisor";
export type SquadTab = "home" | "players" | "coaches" | "training" | "matches" | "calendar" | "legacy";
export type TactiqTab = "board" | "simulate" | "possession" | "compare";
export type FormatSize = 7 | 8 | 9 | 11;
 
type SyncState = "idle" | "loading" | "saving" | "error";
 
type PitchStore = DeskData & {
  loaded: boolean;
  mode: Mode;
  squadTab: SquadTab;
  tactiqTab: TactiqTab;
  category: string;
  formatSize: FormatSize;
  formation: string;
  compareA: string;
  compareB: string;
  slotMap: Record<string, string>;
  /** Freeform drag overrides for the Board view — see positionFromPoint in formations.ts. */
  slotOverrides: Record<string, SlotOverride>;
  selectedPlayerId: string | null;
  reducedMotion: boolean;
  /** Server sync status — "idle" | "loading" | "saving" | "error". */
  syncState: SyncState;
  /** Human-readable message for the last sync error, if any. */
  syncError: string | null;
  setMode: (m: Mode) => void;
  setSquadTab: (t: SquadTab) => void;
  setTactiqTab: (t: TactiqTab) => void;
  setCategory: (c: string) => void;
  setFormat: (size: FormatSize, formation: string) => void;
  setCompare: (a: string, b: string) => void;
  setSlotMap: (map: Record<string, string>) => void;
  assignSlot: (slotId: string, playerId: string | null) => void;
  swapSlots: (a: string, b: string) => void;
  /** Freely reposition a slot on the board; recomputes its position label from the drop point. */
  setSlotOverride: (slotId: string, x: number, y: number) => void;
  /** Snap the board back to the current formation's default layout. */
  clearSlotOverrides: () => void;
  setSelectedPlayer: (id: string | null) => void;
  setReducedMotion: (v: boolean) => void;
  addPlayer: (p: Omit<Player, "id" | "createdAt" | "history">) => string;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  removePlayer: (id: string) => void;
  duplicatePlayer: (id: string) => string | null;
  setPlayerPhoto: (id: string, photo: string | null) => void;
  adjustAttribute: (id: string, attr: string, value: number, reason: string) => void;
  addTraining: (date: string, title: string) => void;
  removeTraining: (id: string) => void;
  toggleAttendance: (trainingId: string, playerId: string) => void;
  addMatch: (m: { date: string; opponent: string; venue: "Home" | "Away"; kickoff: string; kind: MatchKind }) => void;
  removeMatch: (id: string) => void;
  updateMatch: (id: string, patch: Partial<Match>) => void;
  addTrophy: (t: { name: string; competition: string; season: string; notes: string; photo?: string | null }) => void;
  removeTrophy: (id: string) => void;
  setIntel: (intel: OpponentIntel) => void;
  savePreset: (name: string, cardDesign: CardDesign, style: CardStyle) => string;
  updatePreset: (id: string, patch: Partial<DesignPreset>) => void;
  duplicatePreset: (id: string) => string | null;
  removePreset: (id: string) => void;
  addCoach: (c: {
    name: string;
    photo: string | null;
    role: CoachRole;
    phone: string;
    email: string;
    team: string;
    bio: string;
    cardDesign: CardDesign;
    cardStyle?: CardStyle;
  }) => string;
  updateCoach: (id: string, patch: Partial<Coach>) => void;
  removeCoach: (id: string) => void;
  trainingCountForPlayer: (playerId: string) => number;
  createCallUp: (name: string, coachId: string, playerIds: string[]) => string;
  duplicateCallUpAsNew: (id: string, name: string) => string | null;
  updateCallUpEntry: (callUpId: string, playerId: string, patch: Partial<CallUpEntry>) => void;
  removeCallUp: (id: string) => void;
  resetDesk: () => void;
  /** Pull the whole desk from the server (GET /api/desk) and replace local state with it. */
  loadFromServer: () => Promise<void>;
  /** Push the whole desk to the server (POST /api/desk). */
  saveToServer: () => Promise<void>;
};
 
const STORAGE_KEY = "pitchhq-os-v2";
 
function persistSlice(s: PitchStore): DeskData {
  return {
    players: s.players,
    trainings: s.trainings,
    matches: s.matches,
    trophies: s.trophies,
    coaches: s.coaches,
    callUps: s.callUps,
    opponentIntel: s.opponentIntel,
    designPresets: s.designPresets,
    meta: s.meta,
  };
}
 
const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const fromIdb = await idbGet<string>(name);
    if (fromIdb != null) return fromIdb;
    try {
      const legacy = localStorage.getItem(name);
      if (legacy != null) {
        await idbSet(name, legacy);
        localStorage.removeItem(name);
        return legacy;
      }
    } catch {
      // localStorage can throw in some private-browsing modes — safe to ignore.
    }
    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await idbDel(name);
  },
};
 
export const usePitchStore = create<PitchStore>()(
  persist(
    (set, get) => ({
      ...emptyData(),
      loaded: false,
      mode: "squad",
      squadTab: "home",
      tactiqTab: "board",
      category: "U15",
      formatSize: 11,
      formation: "4-3-3",
      compareA: "4-3-3",
      compareB: "4-2-3-1",
      slotMap: {},
      slotOverrides: {},
      selectedPlayerId: null,
      reducedMotion: false,
      syncState: "idle",
      syncError: null,
      setMode: (mode) => set({ mode }),
      setSquadTab: (squadTab) => set({ squadTab, mode: "squad" }),
      setTactiqTab: (tactiqTab) => set({ tactiqTab, mode: "tactiq" }),
      setCategory: (category) => set({ category }),
      setFormat: (formatSize, formation) => set({ formatSize, formation, slotOverrides: {} }),
      setCompare: (compareA, compareB) => set({ compareA, compareB }),
      setSlotMap: (slotMap) => set({ slotMap }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      assignSlot: (slotId, playerId) =>
        set((s) => {
          const slotMap = { ...s.slotMap };
          if (!playerId) delete slotMap[slotId];
          else {
            for (const [k, v] of Object.entries(slotMap)) {
              if (v === playerId) delete slotMap[k];
            }
            slotMap[slotId] = playerId;
          }
          return { slotMap };
        }),
      swapSlots: (a, b) =>
        set((s) => {
          const slotMap = { ...s.slotMap };
          const pa = slotMap[a];
          const pb = slotMap[b];
          if (pa) slotMap[b] = pa;
          else delete slotMap[b];
          if (pb) slotMap[a] = pb;
          else delete slotMap[a];
          return { slotMap };
        }),
      setSlotOverride: (slotId, x, y) =>
        set((s) => {
          const cx = clamp(x, 4, 96);
          const cy = clamp(y, 6, 94);
          const pos: PositionCode = slotId === "gk" ? "GK" : positionFromPoint(cx, cy);
          return { slotOverrides: { ...s.slotOverrides, [slotId]: { x: cx, y: cy, pos } } };
        }),
      clearSlotOverrides: () => set({ slotOverrides: {} }),
      setSelectedPlayer: (selectedPlayerId) => set({ selectedPlayerId }),
      addPlayer: (p) => {
        const id = uid();
        const player: Player = {
          ...p,
          id,
          createdAt: new Date().toISOString(),
          history: [],
        };
        set((s) => ({ players: [...s.players, player] }));
        return id;
      },
      updatePlayer: (id, patch) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removePlayer: (id) =>
        set((s) => ({
          players: s.players.filter((p) => p.id !== id),
          trainings: s.trainings.map((t) => {
            const attendance = { ...t.attendance };
            delete attendance[id];
            return { ...t, attendance };
          }),
          matches: s.matches.map((m) => {
            const ratings = { ...m.ratings };
            const goals = { ...m.goals };
            delete ratings[id];
            delete goals[id];
            const slotMap = { ...m.slotMap };
            for (const [k, v] of Object.entries(slotMap)) if (v === id) delete slotMap[k];
            return {
              ...m,
              ratings,
              goals,
              slotMap,
              lineup: m.lineup.filter((x) => x !== id),
              motm: m.motm === id ? null : m.motm,
            };
          }),
          slotMap: Object.fromEntries(Object.entries(s.slotMap).filter(([, v]) => v !== id)),
          selectedPlayerId: s.selectedPlayerId === id ? null : s.selectedPlayerId,
        })),
      duplicatePlayer: (id) => {
        const src = get().players.find((p) => p.id === id);
        if (!src) return null;
        return get().addPlayer({
          name: `${src.name} (copy)`,
          photo: src.photo,
          position: src.position,
          secondaryPositions: [...src.secondaryPositions],
          foot: src.foot,
          number: src.number,
          age: src.age,
          height: src.height,
          captain: false,
          team: src.team,
          email: src.email,
          phone: src.phone,
          guardianName: src.guardianName,
          guardianEmail: src.guardianEmail,
          guardianPhone: src.guardianPhone,
          category: src.category,
          cardDesign: src.cardDesign,
          cardStyle: src.cardStyle ? { ...src.cardStyle } : undefined,
          baseSix: { ...src.baseSix },
          currentSix: { ...src.currentSix },
          detail: { ...src.detail },
          gkBase: src.gkBase ? { ...src.gkBase } : null,
          gkCurrent: src.gkCurrent ? { ...src.gkCurrent } : null,
          playStyles: [...src.playStyles],
          playStylesPlus: [...src.playStylesPlus],
          weakFoot: src.weakFoot,
          skillMoves: src.skillMoves,
        });
      },
      setPlayerPhoto: (id, photo) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, photo } : p)),
        })),
      adjustAttribute: (id, attr, value, reason) =>
        set((s) => ({
          players: s.players.map((p) => {
            if (p.id !== id) return p;
            const sixKeys = ["pac", "sho", "pas", "dri", "def", "phy"] as const;
            const gkKeys = ["div", "han", "kic", "ref", "spd", "pos"] as const;
            let from = 0;
            const next: Player = { ...p, currentSix: { ...p.currentSix }, detail: { ...p.detail } };
            if ((sixKeys as readonly string[]).includes(attr)) {
              const k = attr as keyof OutfieldSix;
              from = p.currentSix[k];
              next.currentSix = { ...p.currentSix, [k]: value };
              next.detail = spreadDetail(next.currentSix);
            } else if ((gkKeys as readonly string[]).includes(attr) && p.gkCurrent) {
              const k = attr as keyof GkSix;
              from = p.gkCurrent[k];
              next.gkCurrent = { ...p.gkCurrent, [k]: value };
            } else if (attr in p.detail) {
              const k = attr as keyof typeof p.detail;
              from = p.detail[k];
              next.detail = { ...p.detail, [k]: value };
            } else {
              return p;
            }
            next.history = [
              ...p.history,
              {
                id: uid(),
                at: new Date().toISOString(),
                attr: attr.toUpperCase(),
                from,
                to: value,
                reason,
              },
            ];
            return next;
          }),
        })),
      addTraining: (date, title) =>
        set((s) => ({
          trainings: [
            ...s.trainings,
            { id: uid(), date, title: title || "Training", category: s.category, attendance: {} },
          ],
        })),
      removeTraining: (id) => set((s) => ({ trainings: s.trainings.filter((t) => t.id !== id) })),
      toggleAttendance: (trainingId, playerId) =>
        set((s) => ({
          trainings: s.trainings.map((t) =>
            t.id === trainingId
              ? { ...t, attendance: { ...t.attendance, [playerId]: !t.attendance?.[playerId] } }
              : t,
          ),
        })),
      addMatch: (m) =>
        set((s) => ({
          matches: [
            ...s.matches,
            {
              id: uid(),
              ...m,
              category: s.category,
              lineup: [],
              slotMap: {},
              ratings: {},
              goals: {},
              teamScore: null,
              opponentScore: null,
              motm: null,
            },
          ],
        })),
      removeMatch: (id) => set((s) => ({ matches: s.matches.filter((m) => m.id !== id) })),
      updateMatch: (id, patch) =>
        set((s) => ({
          matches: s.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      addTrophy: (t) =>
        set((s) => ({
          trophies: [
            {
              id: uid(),
              name: t.name.trim() || "Untitled trophy",
              competition: t.competition.trim() || "Tournament",
              season: t.season.trim() || "Season",
              notes: t.notes.trim() || "Academy achievement",
              photo: t.photo ?? null,
              createdAt: new Date().toISOString(),
            },
            ...s.trophies,
          ],
        })),
      removeTrophy: (id) => set((s) => ({ trophies: s.trophies.filter((t) => t.id !== id) })),
      setIntel: (opponentIntel) => set({ opponentIntel }),
      savePreset: (name, cardDesign, style) => {
        const id = uid();
        set((s) => ({
          designPresets: [...s.designPresets, { id, name: name.trim() || "Untitled", cardDesign, style: { ...style } }],
        }));
        return id;
      },
      updatePreset: (id, patch) =>
        set((s) => ({
          designPresets: s.designPresets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      duplicatePreset: (id) => {
        const src = get().designPresets.find((p) => p.id === id);
        if (!src) return null;
        return get().savePreset(`${src.name} copy`, src.cardDesign, src.style);
      },
      removePreset: (id) => set((s) => ({ designPresets: s.designPresets.filter((p) => p.id !== id) })),
      addCoach: (c) => {
        const id = uid();
        const coach: Coach = {
          ...c,
          id,
          // Guard against ever writing an empty/invalid cardDesign — mirrors
          // the defensive fallback now used when reading it in CoachCard.
          cardDesign: c.cardDesign ?? "auto",
          category: get().category,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ coaches: [...s.coaches, coach] }));
        return id;
      },
      updateCoach: (id, patch) =>
        set((s) => ({ coaches: s.coaches.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeCoach: (id) =>
        set((s) => ({
          coaches: s.coaches.filter((c) => c.id !== id),
          callUps: s.callUps.filter((cu) => cu.coachId !== id),
        })),
      trainingCountForPlayer: (playerId) => {
        const { trainings, category } = get();
        return trainings.filter((t) => t.category === category && t.attendance?.[playerId]).length;
      },
      createCallUp: (name, coachId, playerIds) => {
        const id = uid();
        const entries: CallUpEntry[] = get()
          .players.filter((p) => p.category === get().category)
          .map((p) => ({ playerId: p.id, status: playerIds.includes(p.id) ? "called" : "not-selected" }));
        const callUp: CallUp = {
          id,
          name: name.trim() || "Untitled call-up",
          coachId,
          category: get().category,
          date: new Date().toISOString().slice(0, 10),
          entries,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ callUps: [callUp, ...s.callUps] }));
        return id;
      },
      duplicateCallUpAsNew: (id, name) => {
        const src = get().callUps.find((c) => c.id === id);
        if (!src) return null;
        const newId = uid();
        set((s) => ({
          callUps: [
            {
              ...src,
              id: newId,
              name: name.trim() || `${src.name} copy`,
              date: new Date().toISOString().slice(0, 10),
              createdAt: new Date().toISOString(),
              entries: src.entries.map((e) => ({ ...e })),
            },
            ...s.callUps,
          ],
        }));
        return newId;
      },
      updateCallUpEntry: (callUpId, playerId, patch) =>
        set((s) => ({
          callUps: s.callUps.map((cu) =>
            cu.id === callUpId
              ? { ...cu, entries: cu.entries.map((e) => (e.playerId === playerId ? { ...e, ...patch } : e)) }
              : cu,
          ),
        })),
      removeCallUp: (id) => set((s) => ({ callUps: s.callUps.filter((c) => c.id !== id) })),
      resetDesk: () =>
        set({
          ...emptyData(),
          slotMap: {},
          slotOverrides: {},
          selectedPlayerId: null,
          formation: "4-3-3",
          formatSize: 11,
        }),
 
      // ── Server sync ─────────────────────────────────────────────────────
      // Full-replace sync against /api/desk (see src/routes/api/desk.ts).
      // Board/UI state (mode, tabs, slotMap, formation, etc.) stays
      // local-only — only the DeskData slice (players, coaches, trainings,
      // matches, trophies, callUps, designPresets, opponentIntel)
      // round-trips to the server, scoped per signed-in user.
      loadFromServer: async () => {
        set({ syncState: "loading", syncError: null });
        try {
          const res = await fetch("/api/desk");
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? `Server responded ${res.status}`);
          }
          const desk = (await res.json()) as DeskData | null;
          // `null` means this user has never saved a desk yet — keep
          // whatever's already in local state instead of wiping it out.
          if (desk) set({ ...desk, syncState: "idle" });
          else set({ syncState: "idle" });
        } catch (err) {
          set({
            syncState: "error",
            syncError: err instanceof Error ? err.message : "Failed to load from server",
          });
        }
      },
      saveToServer: async () => {
        set({ syncState: "saving", syncError: null });
        try {
          const desk = persistSlice(get());
          const res = await fetch("/api/desk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(desk),
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? `Server responded ${res.status}`);
          }
          set({ syncState: "idle" });
        } catch (err) {
          set({
            syncState: "error",
            syncError: err instanceof Error ? err.message : "Failed to save to server",
          });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (s) => ({
        ...persistSlice(s),
        mode: s.mode,
        squadTab: s.squadTab,
        tactiqTab: s.tactiqTab,
        category: s.category,
        formatSize: s.formatSize,
        formation: s.formation,
        compareA: s.compareA,
        compareB: s.compareB,
        slotMap: s.slotMap,
        slotOverrides: s.slotOverrides,
        reducedMotion: s.reducedMotion,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loaded = true;
          if (!state.designPresets) state.designPresets = [];
          if (!state.slotOverrides) state.slotOverrides = {};
          if (!state.coaches) state.coaches = [];
          if (!state.callUps) state.callUps = [];
          // Backfill cardDesign for any coach saved before the card-design
          // feature existed. Without this, CoachCard reads
          // TIER_META[undefined].layers and crashes.
          state.coaches = state.coaches.map((c) => ({
            ...c,
            cardDesign: c.cardDesign ?? "auto",
          }));
        }
      },
    },
  ),
);
 
export function useHydrated() {
  return usePitchStore((s) => s.loaded);
}
 
export function useCategoryPlayers(): Player[] {
  const players = usePitchStore((s) => s.players);
  const category = usePitchStore((s) => s.category);
  return players.filter((p) => p.category === category);
}
 
export function withMatchDefaults(
  m: Partial<Match> & Pick<Match, "id" | "date" | "opponent" | "venue" | "kickoff" | "category">,
): Match {
  return {
    lineup: [],
    slotMap: {},
    ratings: {},
    goals: {},
    teamScore: null,
    opponentScore: null,
    motm: null,
    kind: "League",
    ...m,
  };
}
 
export type PlayerDraft = {
  name: string;
  photo: string | null;
  position: PositionCode;
  secondaryPositions: PositionCode[];
  foot: Player["foot"];
  weakFoot: StarRating;
  skillMoves: StarRating;
  number: string;
  age: number;
  height: number;
  captain: boolean;
  team: string;
  email: string;
  phone: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  cardDesign: CardDesign;
  cardStyle?: CardStyle;
  currentSix: OutfieldSix;
  gkCurrent: GkSix | null;
  playStyles?: string[];
  playStylesPlus?: string[];
};
 
export function draftToPlayer(d: PlayerDraft, category: string): Omit<Player, "id" | "createdAt" | "history"> {
  return {
    name: d.name.trim(),
    photo: d.photo,
    position: d.position,
    secondaryPositions: d.secondaryPositions,
    foot: d.foot,
    weakFoot: d.weakFoot,
    skillMoves: d.skillMoves,
    number: d.number,
    age: d.age,
    height: d.height,
    captain: d.captain,
    team: d.team,
    email: d.email,
    phone: d.phone,
    guardianName: d.guardianName,
    guardianEmail: d.guardianEmail,
    guardianPhone: d.guardianPhone,
    category,
    cardDesign: d.cardDesign,
    cardStyle: d.cardStyle,
    baseSix: { ...d.currentSix },
    currentSix: { ...d.currentSix },
    detail: spreadDetail(d.currentSix),
    gkBase: d.gkCurrent ? { ...d.gkCurrent } : null,
    gkCurrent: d.gkCurrent ? { ...d.gkCurrent } : null,
    playStyles: d.playStyles ?? [],
    playStylesPlus: d.playStylesPlus ?? [],
  };
}