import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Dumbbell,
  LayoutGrid,
  Sparkles,
  Trophy,
  UserCog,
  Users,
  Zap,
} from "lucide-react";
import { Modal } from "./modal";
import { PlayerProfile } from "./player-profile";
import { HomeView, PlayersView, TrainingView, MatchesView, CalendarView, LegacyCabinetView } from "./squad-views";
import { CoachesView } from "./coaches-view";
import { BoardView, SimulateView, PossessionView, CompareView } from "./tactiq-views";
import { AdvisorView, SlotPicker } from "./advisor-view";
import { EmailPasswordForm, SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { canEditRoster, useRole } from "@/lib/auth/use-role";
import { CATEGORIES, type PitchSlot } from "@/lib/pitch/types";
import { usePitchStore } from "@/lib/pitch/store";
import { rankFormations, slotMapFromEval } from "@/lib/pitch/ai";
import { cn } from "@/lib/utils";

function Crest({ size = 42 }: { size?: number }) {
  return (
    <img
      src="/akan-hq-logo.svg"
      alt="AGA KHAN ACADEMY crest"
      width={size}
      height={size}
      className="block rounded-full object-contain shadow-[0_0_0_1px_rgba(252,236,188,0.55),0_10px_30px_rgba(3,10,7,0.65)]"
      draggable={false}
    />
  );
}

export function AppShell() {
  const loaded = usePitchStore((s) => s.loaded);
  const mode = usePitchStore((s) => s.mode);
  const setMode = usePitchStore((s) => s.setMode);
  const squadTab = usePitchStore((s) => s.squadTab);
  const setSquadTab = usePitchStore((s) => s.setSquadTab);
  const tactiqTab = usePitchStore((s) => s.tactiqTab);
  const setTactiqTab = usePitchStore((s) => s.setTactiqTab);
  const category = usePitchStore((s) => s.category);
  const setCategory = usePitchStore((s) => s.setCategory);
  const playersAll = usePitchStore((s) => s.players);
  const coachesAll = usePitchStore((s) => s.coaches);
  const selectedId = usePitchStore((s) => s.selectedPlayerId);
  const setSelectedPlayer = usePitchStore((s) => s.setSelectedPlayer);
  const reducedMotion = usePitchStore((s) => s.reducedMotion);
  const setReducedMotion = usePitchStore((s) => s.setReducedMotion);
  const syncState = usePitchStore((s) => s.syncState);
  const syncError = usePitchStore((s) => s.syncError);
  const saveToServer = usePitchStore((s) => s.saveToServer);
  const { role } = useRole();
  const canEdit = canEditRoster(role);
  const [pickSlot, setPickSlot] = useState<PitchSlot | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  // Dismissible banner state — separate from syncState so a user can close
  // a stale error without it reappearing until the next real sync event.
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const saveDesk = () => {
    void saveToServer();
  };

  useEffect(() => {
    const unsub = usePitchStore.persist.onFinishHydration(() => {
      usePitchStore.setState({ loaded: true });
    });
    if (usePitchStore.persist.hasHydrated()) usePitchStore.setState({ loaded: true });
    return unsub;
  }, []);

  // Once local (IndexedDB) hydration is done, pull the latest shared desk
  // from the server so this browser sees data saved from any other device.
  // The local copy still renders immediately above — this just refreshes it.
  useEffect(() => {
    if (!loaded) return;
    setBannerDismissed(false);
    void usePitchStore.getState().loadFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const st = usePitchStore.getState();
    if (Object.keys(st.slotMap).length > 0) return;
    const squad = st.players.filter((p) => p.category === st.category);
    const best = rankFormations(st.formatSize, squad, st.matches)[0];
    if (best) st.setSlotMap(slotMapFromEval(best));
  }, [loaded]);

  const players = useMemo(
    () => playersAll.filter((p) => p.category === category),
    [playersAll, category],
  );

  const selected = playersAll.find((p) => p.id === selectedId) ?? null;

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
        Loading desk…
      </div>
    );
  }

  // Visible whenever a server load/save is in flight or has just failed —
  // this used to be silent (only visible via DevTools Network tab), which
  // made it look like data had vanished when really the fetch just never
  // happened or errored out.
  const showBanner = !bannerDismissed && (syncState === "loading" || syncState === "saving" || syncState === "error");

  return (
    <>
      {/* Squad view is public — anyone with the link can look at cards, the
          roster, matches, etc. without signing in. Sign-in is only needed to
          edit, and that control lives in the header below (SignInPanel). */}
      <div className="min-h-screen bg-bg text-fg">
          {showBanner && (
            <div
              className={cn(
                "px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em]",
                syncState === "error" ? "bg-red-900/80 text-red-100" : "bg-accent/20 text-accent",
              )}
            >
              {syncState === "loading" && "Loading your saved data from the server…"}
              {syncState === "saving" && "Saving to the server…"}
              {syncState === "error" && (
                <span className="flex items-center justify-center gap-3">
                  Sync failed: {syncError ?? "unknown error"}
                  <button
                    type="button"
                    className="rounded-full border border-current px-2 py-0.5 normal-case tracking-normal"
                    onClick={() => void usePitchStore.getState().loadFromServer()}
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-current px-2 py-0.5 normal-case tracking-normal"
                    onClick={() => setBannerDismissed(true)}
                  >
                    Dismiss
                  </button>
                </span>
              )}
            </div>
          )}
          <header className="border-b border-line bg-surface/90">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#0e1513] p-1.5 ring-1 ring-[#dfe8df]/15 shadow-[0_8px_30px_rgba(0,0,0,0.38)]">
                  <Crest size={74} />
                </div>
                <div>
                  <div className="font-display text-[1.7rem] font-semibold leading-none tracking-[0.2em] text-[#f3f5f2] uppercase">
                    AGA KHAN
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4b66a]">
                    <span className="h-px w-5 bg-[#d4b66a]/70" />
                    Football Academy
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex overflow-hidden rounded-full border border-line bg-[#0d1412] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  {(
                    [
                      ["squad", "Squad"],
                      ["tactiq", "Tactics"],
                      ["advisor", "Insights"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setMode(id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                        mode === id ? "bg-accent text-accent-fg shadow-[0_0_18px_rgba(122,169,135,0.18)]" : "text-muted hover:text-fg",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 rounded-full border border-line bg-[#101814] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c} squad
                    </option>
                  ))}
                </select>
                {canEdit && (
                  <button
                    type="button"
                    onClick={saveDesk}
                    disabled={syncState === "saving"}
                    className="h-9 rounded-full border border-[#a7b6a7]/30 bg-[#142019] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#e4ece5] disabled:cursor-wait disabled:opacity-60"
                    title={syncError ?? "Save current changes to the shared database"}
                  >
                    {syncState === "saving" ? "Saving…" : syncState === "error" ? "Retry save" : "Save"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={cn(
                    "h-9 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-[0.12em]",
                    reducedMotion ? "border-accent/60 bg-accent/10 text-accent" : "border-line bg-[#101814] text-muted",
                  )}
                  title="Reduce motion"
                >
                  {reducedMotion ? "Motion off" : "Motion on"}
                </button>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <button
                    type="button"
                    onClick={() => setSignInOpen(true)}
                    className="h-9 rounded-full border border-line bg-[#101814] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-fg"
                  >
                    Sign in
                  </button>
                </SignedOut>
              </div>
            </div>
            {mode === "squad" && (
              <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pt-1">
                {(
                  [
                    ["home", "Home", Zap],
                    ["players", "My Cards", Users],
                    ["coaches", "Coaches", UserCog],
                    ["training", "Training", Dumbbell],
                    ["matches", "Matches", Trophy],
                    ["calendar", "Calendar", CalendarDays],
                    ["legacy", "Legacy", Trophy],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setSquadTab(id)}
                    className={cn(
                      "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      squadTab === id ? "border-accent text-accent" : "border-transparent text-subtle hover:text-fg",
                    )}
                  >
                    <Icon className="size-3.5" /> {label}
                  </button>
                ))}
              </nav>
            )}
            {mode === "tactiq" && (
              <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pt-1">
                {(
                  [
                    ["board", "Board", LayoutGrid],
                    ["simulate", "Simulate", Zap],
                    ["possession", "In possession", Users],
                    ["compare", "Compare", Trophy],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setTactiqTab(id)}
                    className={cn(
                      "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      tactiqTab === id ? "border-accent text-accent" : "border-transparent text-subtle hover:text-fg",
                    )}
                  >
                    <Icon className="size-3.5" /> {label}
                  </button>
                ))}
              </nav>
            )}
            {mode === "advisor" && (
              <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                <Sparkles className="size-3.5 text-accent" />
                Tactical Lab — formation intelligence, evidence, and recommendations grounded in squad data.
              </nav>
            )}
          </header>
          <main className="mx-auto max-w-6xl px-4 py-4 pb-16">
            {mode === "squad" && squadTab === "home" && (
              <HomeView players={players} onOpenPlayer={(p) => setSelectedPlayer(p.id)} />
            )}
            {mode === "squad" && squadTab === "players" && (
              <PlayersView players={players} onOpenPlayer={(p) => setSelectedPlayer(p.id)} />
            )}
            {mode === "squad" && squadTab === "coaches" && <CoachesView players={players} />}
            {mode === "squad" && squadTab === "training" && <TrainingView players={players} />}
            {mode === "squad" && squadTab === "matches" && (
              <MatchesView players={players} onOpenPlayer={(p) => setSelectedPlayer(p.id)} />
            )}
            {mode === "squad" && squadTab === "calendar" && <CalendarView />}
            {mode === "squad" && squadTab === "legacy" && <LegacyCabinetView />}
            {mode === "tactiq" && tactiqTab === "board" && (
              <BoardView
                players={players}
                onOpenPlayer={(p) => setSelectedPlayer(p.id)}
                onPickForSlot={setPickSlot}
              />
            )}
            {mode === "tactiq" && tactiqTab === "simulate" && (
              <SimulateView players={players} onOpenPlayer={(p) => setSelectedPlayer(p.id)} />
            )}
            {mode === "tactiq" && tactiqTab === "possession" && <PossessionView players={players} />}
            {mode === "tactiq" && tactiqTab === "compare" && <CompareView />}
            {mode === "advisor" && (
              <AdvisorView players={players} onOpenPlayer={(p) => setSelectedPlayer(p.id)} onUsed={() => {}} />
            )}
          </main>
          <footer className="border-t border-line py-3 text-center text-[11px] text-subtle">
            MADE BY WAYNE LTD COMPANY
          </footer>
          <Modal open={!!selected} onClose={() => setSelectedPlayer(null)} wide>
            {selected && <PlayerProfile player={selected} onClose={() => setSelectedPlayer(null)} />}
          </Modal>
        <Modal open={!!pickSlot} onClose={() => setPickSlot(null)}>
          {pickSlot && <SlotPicker slot={pickSlot} players={players} onClose={() => setPickSlot(null)} />}
        </Modal>
        <Modal open={signInOpen} onClose={() => setSignInOpen(false)}>
          <div className="flex flex-col items-center gap-4 p-2">
            <EmailPasswordForm />
          </div>
        </Modal>
      </div>
    </>
  );
}