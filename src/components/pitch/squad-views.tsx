import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CalendarDays,
  Check,
  Flame,
  Plus,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "./player-card";
import { PlayerForm } from "./player-form";
import { Modal } from "./modal";
import { formatDateLong, formatKickoff } from "@/lib/utils";
import { derivePlayer } from "@/lib/pitch/ratings";
import { usePitchStore } from "@/lib/pitch/store";
import type { Match, Player, PositionCode } from "@/lib/pitch/types";
import { POSITIONS } from "@/lib/pitch/types";
import { resolveAcademyQuery } from "@/lib/pitch/academy-assistant";
import { canEditRoster, useRole } from "@/lib/auth/use-role";

function matchDateTime(m: Match) {
  return new Date(`${m.date}T${m.kickoff || "13:30"}:00`);
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-3 text-center">
      <div className="font-display text-2xl text-accent tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted">{label}</div>
    </div>
  );
}

export function HomeView({ players, onOpenPlayer }: { players: Player[]; onOpenPlayer: (p: Player) => void }) {
  const matches = usePitchStore((s) => s.matches);
  const trainings = usePitchStore((s) => s.trainings);
  const category = usePitchStore((s) => s.category);
  const [now, setNow] = useState(() => new Date());
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantResult, setAssistantResult] = useState(() =>
    resolveAcademyQuery("where would you like to visit?"),
  );
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);
  const upcoming = useMemo(
    () =>
      matches
        .filter((m) => m.category === category && matchDateTime(m) > now)
        .sort((a, b) => matchDateTime(a).getTime() - matchDateTime(b).getTime()),
    [matches, category, now],
  );
  const next = upcoming[0];
  const countdown = useMemo(() => {
    if (!next) return null;
    let diff = Math.max(0, matchDateTime(next).getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    return { days, hours, mins };
  }, [next, now]);

  const ranked = useMemo(
    () =>
      players
        .map((p) => ({ p, d: derivePlayer(p, matches) }))
        .sort((a, b) => b.d.effective - a.d.effective),
    [players, matches],
  );

  const monthKey = now.toISOString().slice(0, 7);
  const monthMatches = matches.filter((m) => m.category === category && m.date.slice(0, 7) === monthKey);
  const motmCounts: Record<string, number> = {};
  monthMatches.forEach((m) => {
    if (m.motm) motmCounts[m.motm] = (motmCounts[m.motm] || 0) + 1;
  });
  const topMotm = Object.entries(motmCounts).sort((a, b) => b[1] - a[1])[0];
  const goalCounts: Record<string, number> = {};
  matches.forEach((m) => {
    Object.entries(m.goals || {}).forEach(([id, g]) => {
      goalCounts[id] = (goalCounts[id] || 0) + (g || 0);
    });
  });
  const topScorer = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0];
  const motmPlayer = players.find((p) => p.id === topMotm?.[0]);
  const scorerPlayer = players.find((p) => p.id === topScorer?.[0]);

  const pastTrainings = trainings.filter((t) => t.category === category && new Date(t.date) <= now);
  const rated = matches.filter((m) => m.category === category && Object.keys(m.ratings || {}).length > 0).length;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="grid gap-4 p-4 md:grid-cols-[1.7fr_1fr] md:p-6">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              Welcome to the Aga Khan Squad Hub
            </div>
            <div>
              <h1 className="font-display text-4xl leading-none tracking-[0.04em] text-fg md:text-5xl">
                Academy performance, squad direction, and match preparation.
              </h1>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted md:text-[15px]">
              A clear home for player tracking, tactical planning, training progress, and next-match preparation across the academy programme.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => usePitchStore.getState().setMode("tactiq")}
                className="rounded-full bg-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg"
              >
                Visit tactics
              </button>
              <button
                type="button"
                onClick={() => usePitchStore.getState().setMode("squad")}
                className="rounded-full border border-line bg-[#121c19] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg"
              >
                View squad
              </button>
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-[#0d1513] p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted">Ask the academy assistant</div>
            <div className="space-y-2 text-sm text-muted">
              <div className="rounded-[12px] bg-[#131f1b] px-3 py-2">“Where do I visit the tactics board?”</div>
              <div className="rounded-[12px] bg-[#131f1b] px-3 py-2">“Who is the next best player for midfield?”</div>
              <div className="rounded-[12px] bg-[#131f1b] px-3 py-2">“Can you help me find the right squad area?”</div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="sr-only" htmlFor="academy-question">Ask a question</label>
              <input
                id="academy-question"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAssistantResult(resolveAcademyQuery(assistantInput));
                  }
                }}
                placeholder="Where would you like to visit?"
                className="w-full rounded-[12px] border border-line bg-[#101813] px-3 py-2 text-sm text-fg placeholder:text-subtle"
              />
              <button
                type="button"
                onClick={() => setAssistantResult(resolveAcademyQuery(assistantInput || "where would you like to visit?"))}
                className="w-full rounded-full bg-accent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg"
              >
                Ask the assistant
              </button>
            </div>

            <div className="mt-4 rounded-[12px] border border-accent/30 bg-accent/5 p-3 text-[12px] leading-6 text-[#dfece2]">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Reply</div>
              <div>{assistantResult.answer}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[16px] border border-line bg-surface p-4">
        {next && countdown ? (
          <>
            <div className="text-[11px] uppercase tracking-wider text-muted">
              Next {next.kind === "Tournament" ? "tournament" : "match"}
            </div>
            <div className="font-display text-2xl">
              vs {next.opponent}{" "}
              <span className="ml-1 rounded-full bg-elevated px-2 py-0.5 text-xs text-muted">{next.venue}</span>
            </div>
            <div className="mb-3 text-sm text-muted">
              {formatDateLong(next.date)} · {formatKickoff(next.kickoff)}
            </div>
            <div className="flex gap-2">
              {[
                ["DAYS", countdown.days],
                ["HRS", countdown.hours],
                ["MIN", countdown.mins],
              ].map(([l, v]) => (
                <div key={l} className="flex-1 rounded-[12px] bg-elevated py-2 text-center">
                  <div className="font-display text-3xl tabular-nums text-accent">{String(v).padStart(2, "0")}</div>
                  <div className="text-[10px] tracking-widest text-muted">{l}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted">No upcoming matches scheduled.</div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "Academy overview", value: "Squad hub", desc: "Tracking and home view for the whole programme." },
          { label: "Player planning", value: "Profiles", desc: "Review cards, ratings, and development details." },
          { label: "System direction", value: "Tactics", desc: "Formation comparisons and match preparation." },
        ].map((item) => (
          <div key={item.label} className="rounded-[16px] border border-line bg-surface p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{item.label}</div>
            <div className="mt-2 font-display text-2xl text-fg">{item.value}</div>
            <div className="mt-1 text-sm text-muted">{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Squad" value={players.length} />
        <Stat label="Rated matches" value={rated} />
        <Stat label="Trainings" value={pastTrainings.length} />
        <Stat label="Fixtures left" value={upcoming.length} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted">
            <Award className="size-4 text-accent" /> Man of the month
          </div>
          {motmPlayer ? (
            <button className="flex items-center gap-2" onClick={() => onOpenPlayer(motmPlayer)}>
              <PlayerCard player={motmPlayer} matches={matches} size="tiny" />
              <div>
                <div className="font-semibold">{motmPlayer.name}</div>
                <div className="text-xs text-accent">{topMotm[1]} MOTM</div>
              </div>
            </button>
          ) : (
            <div className="text-sm text-subtle">No MOTM picked this month.</div>
          )}
        </div>
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted">
            <Trophy className="size-4 text-gold" /> Top scorer
          </div>
          {scorerPlayer ? (
            <button className="flex items-center gap-2" onClick={() => onOpenPlayer(scorerPlayer)}>
              <PlayerCard player={scorerPlayer} matches={matches} size="tiny" />
              <div>
                <div className="font-semibold">{scorerPlayer.name}</div>
                <div className="text-xs text-gold">{topScorer[1]} goals</div>
              </div>
            </button>
          ) : (
            <div className="text-sm text-subtle">No goals logged yet.</div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 font-display text-lg tracking-wide">Top form right now</div>
        <div className="space-y-2">
          {ranked.length === 0 && (
            <div className="rounded-[14px] border border-dashed border-line p-4 text-sm text-muted">
              No player cards yet.
            </div>
          )}
          {ranked.slice(0, 5).map(({ p, d }, i) => (
            <button
              key={p.id}
              onClick={() => onOpenPlayer(p)}
              className="flex w-full items-center gap-3 rounded-[14px] border border-line bg-surface px-3 py-2 text-left"
            >
              <span className="w-4 font-display text-muted">{i + 1}</span>
              <PlayerCard player={p} matches={matches} size="tiny" />
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.position} · {d.role}
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Flame className="size-3.5" />
                <span className="font-display text-lg tabular-nums">{d.effective}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlayersView({
  players,
  onOpenPlayer,
}: {
  players: Player[];
  onOpenPlayer: (p: Player) => void;
}) {
  const matches = usePitchStore((s) => s.matches);
  const removePlayer = usePitchStore((s) => s.removePlayer);
  const duplicatePlayer = usePitchStore((s) => s.duplicatePlayer);
  const updatePlayer = usePitchStore((s) => s.updatePlayer);
  // Signed-out visitors (and pending/player roles) get canEdit = false, so
  // create / edit / duplicate / rename / delete are all hidden for them.
  const { role } = useRole();
  const canEdit = canEditRoster(role);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState<"ALL" | PositionCode>("ALL");
  const [sort, setSort] = useState<"ovr" | "form" | "pac" | "def" | "pas" | "name">("ovr");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Player | null>(null);
  const [rename, setRename] = useState<Player | null>(null);
  const [renameVal, setRenameVal] = useState("");

  const list = useMemo(() => {
    let rows = players.map((p) => ({ p, d: derivePlayer(p, matches) }));
    if (pos !== "ALL") rows = rows.filter((r) => r.p.position === pos || r.p.secondaryPositions.includes(pos));
    if (q.trim()) {
      const n = q.toLowerCase();
      rows = rows.filter((r) => r.p.name.toLowerCase().includes(n) || r.p.number.includes(n));
    }
    rows.sort((a, b) => {
      if (sort === "name") return a.p.name.localeCompare(b.p.name);
      if (sort === "form") return (b.d.form ?? 0) - (a.d.form ?? 0);
      if (sort === "pac") return b.p.currentSix.pac - a.p.currentSix.pac;
      if (sort === "def") return b.p.currentSix.def - a.p.currentSix.def;
      if (sort === "pas") return b.p.currentSix.pas - a.p.currentSix.pas;
      return b.d.ovr - a.d.ovr;
    });
    return rows;
  }, [players, matches, q, pos, sort]);

  const isEmpty = players.length === 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-wide">My Cards</h2>
          <p className="text-xs text-muted">
            {canEdit
              ? "Only cards you create and save appear here. Nothing is generated automatically."
              : "Tap a card to see the full player profile."}
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Create player card
          </Button>
        )}
      </div>

      {!isEmpty && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[160px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cards"
              className="h-10 w-full rounded-[10px] border border-line bg-elevated pl-8 pr-3 text-sm"
            />
          </div>
          <select
            value={pos}
            onChange={(e) => setPos(e.target.value as typeof pos)}
            className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
          >
            <option value="ALL">All positions</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
          >
            <option value="ovr">Sort: OVR</option>
            <option value="form">Sort: form</option>
            <option value="pac">Sort: PAC</option>
            <option value="pas">Sort: PAS</option>
            <option value="def">Sort: DEF</option>
            <option value="name">Sort: name</option>
          </select>
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-surface px-6 py-16 text-center">
          <div className="font-display text-2xl tracking-wide">No player cards yet</div>
          {canEdit ? (
            <>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Create your first player card. Design the chassis, set attributes, then press SAVE CARD.
              </p>
              <Button className="mt-6" onClick={() => setCreating(true)}>
                <Plus className="size-4" /> Create player card
              </Button>
            </>
          ) : (
            <p className="mt-2 max-w-sm text-sm text-muted">Player cards will appear here once the coaches add them.</p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 pt-4 sm:grid-cols-3 lg:grid-cols-4">
            {list.map(({ p }) => (
              <div key={p.id} className="group relative flex flex-col items-center">
                <PlayerCard player={p} matches={matches} size="full" onClick={() => onOpenPlayer(p)} />
                {canEdit && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePlayer(p.id)}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRename(p);
                        setRenameVal(p.name);
                      }}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(p)}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-warn hover:bg-warn/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {list.length === 0 && (
            <div className="rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted">
              No cards match your filters.
            </div>
          )}
        </>
      )}

      <Modal open={canEdit && creating} onClose={() => setCreating(false)} wide>
        <PlayerForm
          onClose={() => setCreating(false)}
          onCreated={() => setCreating(false)}
        />
      </Modal>
      <Modal open={canEdit && !!editing} onClose={() => setEditing(null)} wide>
        {editing && (
          <PlayerForm existing={editing} onClose={() => setEditing(null)} onCreated={() => setEditing(null)} />
        )}
      </Modal>
      <Modal open={canEdit && !!confirmDelete} onClose={() => setConfirmDelete(null)}>
        {confirmDelete && (
          <div className="p-5">
            <div className="font-display text-xl">Delete card?</div>
            <p className="mt-2 text-sm text-muted">
              Remove <strong className="text-fg">{confirmDelete.name}</strong> permanently. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  removePlayer(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={canEdit && !!rename} onClose={() => setRename(null)}>
        {rename && (
          <div className="p-5">
            <div className="font-display text-xl">Rename card</div>
            <input
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              className="mt-3 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRename(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (renameVal.trim()) updatePlayer(rename.id, { name: renameVal.trim() });
                  setRename(null);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function TrainingView({ players }: { players: Player[] }) {
  const trainings = usePitchStore((s) => s.trainings);
  const category = usePitchStore((s) => s.category);
  const addTraining = usePitchStore((s) => s.addTraining);
  const removeTraining = usePitchStore((s) => s.removeTraining);
  const toggleAttendance = usePitchStore((s) => s.toggleAttendance);
  const { role } = useRole();
  const canEdit = canEditRoster(role);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("Training");
  const [open, setOpen] = useState<string | null>(null);
  const list = trainings.filter((t) => t.category === category).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-3">
      {canEdit && (
        <div className="flex flex-wrap gap-2 rounded-[14px] border border-line bg-surface p-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 min-w-[140px] flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm"
          />
          <Button
            onClick={() => {
              addTraining(date, title);
              setTitle("Training");
            }}
          >
            <Plus className="size-4" /> Log session
          </Button>
        </div>
      )}
      {list.length === 0 && !canEdit && (
        <div className="rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted">
          No training sessions logged yet.
        </div>
      )}
      {list.map((t) => {
        const present = players.filter((p) => t.attendance?.[p.id]).length;
        return (
          <div key={t.id} className="rounded-[14px] border border-line bg-surface">
            {/* This row is a <div role="button"> instead of a <button> because it
                contains a nested delete <button>, and a button inside a button is
                invalid HTML. */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpen(open === t.id ? null : t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(open === t.id ? null : t.id);
                }
              }}
              className="flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left"
            >
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-muted">
                  {formatDateLong(t.date)} · {present}/{players.length} present
                </div>
              </div>
              {canEdit && (
                <button
                  type="button"
                  className="text-subtle hover:text-warn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTraining(t.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            {open === t.id && (
              <div className="grid grid-cols-1 gap-1 border-t border-line p-2 sm:grid-cols-2">
                {players.map((p) => {
                  const on = !!t.attendance?.[p.id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => toggleAttendance(t.id, p.id)}
                      className={
                        canEdit
                          ? "flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-left hover:bg-elevated"
                          : "flex cursor-default items-center gap-2 rounded-[10px] px-2 py-1.5 text-left"
                      }
                    >
                      <span
                        className={
                          on
                            ? "flex size-6 items-center justify-center rounded-full bg-accent text-accent-fg"
                            : "flex size-6 items-center justify-center rounded-full border border-line"
                        }
                      >
                        {on && <Check className="size-3.5" />}
                      </span>
                      <span className="text-sm">
                        {p.name} <span className="text-subtle">{p.position}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MatchesView({
  players,
  onOpenPlayer,
}: {
  players: Player[];
  onOpenPlayer: (p: Player) => void;
}) {
  const matches = usePitchStore((s) => s.matches);
  const category = usePitchStore((s) => s.category);
  const addMatch = usePitchStore((s) => s.addMatch);
  const removeMatch = usePitchStore((s) => s.removeMatch);
  const updateMatch = usePitchStore((s) => s.updateMatch);
  const { role } = useRole();
  const canEdit = canEditRoster(role);
  const [open, setOpen] = useState<string | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [opponent, setOpponent] = useState("");
  const [venue, setVenue] = useState<"Home" | "Away">("Home");
  const [kickoff, setKickoff] = useState("13:30");
  const [kind, setKind] = useState<"League" | "Tournament" | "Friendly">("League");
  const [dragScorerId, setDragScorerId] = useState<string | null>(null);
  const list = matches.filter((m) => m.category === category).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-3">
      {canEdit && (
        <div className="flex flex-wrap gap-2 rounded-[14px] border border-line bg-surface p-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm" />
          <input value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Opponent" className="h-10 min-w-[120px] flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm" />
          <select value={venue} onChange={(e) => setVenue(e.target.value as "Home" | "Away")} className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm">
            <option>Home</option>
            <option>Away</option>
          </select>
          <input type="time" value={kickoff} onChange={(e) => setKickoff(e.target.value)} className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm" />
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm">
            <option>League</option>
            <option>Tournament</option>
            <option>Friendly</option>
          </select>
          <Button
            onClick={() => {
              if (!opponent.trim()) return;
              addMatch({ date, opponent: opponent.trim(), venue, kickoff, kind });
              setOpponent("");
            }}
          >
            <Plus className="size-4" /> Add fixture
          </Button>
        </div>
      )}
      {list.length === 0 && !canEdit && (
        <div className="rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted">
          No fixtures added yet.
        </div>
      )}
      {list.map((m) => (
        <div key={m.id} className="rounded-[14px] border border-line bg-surface">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(open === m.id ? null : m.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(open === m.id ? null : m.id);
              }
            }}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left"
          >
            <div>
              <div className="font-semibold">
                vs {m.opponent}{" "}
                <span className="text-xs font-normal text-muted">
                  {m.venue} · {m.kind}
                </span>
              </div>
              <div className="text-xs text-muted">
                {formatDateLong(m.date)} · {formatKickoff(m.kickoff)}
                {m.teamScore !== null && m.opponentScore !== null ? ` · ${m.teamScore}–${m.opponentScore}` : ""}
              </div>
            </div>
            {canEdit && (
              <button
                type="button"
                className="text-subtle hover:text-warn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMatch(m.id);
                }}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          {/* READ-ONLY panel: what signed-out visitors (and anyone who can't edit) see. */}
          {open === m.id && !canEdit && (
            <div className="space-y-3 border-t border-line p-3">
              <div className="rounded-[12px] border border-line bg-[#0f1714] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">Result & MVP</div>
                <div className="text-sm">
                  Score:{" "}
                  {m.teamScore != null && m.opponentScore != null
                    ? `${m.teamScore}–${m.opponentScore}`
                    : "Not recorded yet"}
                </div>
                <div className="mt-1 text-sm text-muted">
                  MVP: {players.find((p) => p.id === m.motm)?.name ?? "None selected"}
                </div>
              </div>

              {Object.entries(m.goals ?? {}).length > 0 && (
                <div className="rounded-[12px] border border-line bg-[#0f1714] p-3">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">Goal scorers</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(m.goals ?? {}).map(([id, count]) => {
                      const player = players.find((p) => p.id === id);
                      if (!player) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-xs font-medium text-[#dfece2]"
                        >
                          <span>{player.name}</span>
                          <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {players.some((p) => m.ratings?.[p.id] !== undefined) && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-muted">Match ratings</div>
                  {players
                    .filter((p) => m.ratings?.[p.id] !== undefined)
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-[10px] px-1 py-1 text-sm">
                        <button onClick={() => onOpenPlayer(p)} className="w-28 truncate text-left">
                          {p.name}
                        </button>
                        <span className="tabular-nums text-accent">{m.ratings?.[p.id]}</span>
                        {m.motm === p.id && <span className="text-xs font-semibold text-accent">MVP</span>}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* EDITABLE panel: only for owner / editor / coach. */}
          {open === m.id && canEdit && (
            <div className="space-y-3 border-t border-line p-3">
              <div className="rounded-[12px] border border-line bg-[#0f1714] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">Result & MVP</div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Goal score</span>
                  <input
                    type="number"
                    className="h-9 w-14 rounded-[8px] border border-line bg-elevated px-2 text-sm"
                    value={m.teamScore ?? ""}
                    onChange={(e) =>
                      updateMatch(m.id, { teamScore: e.target.value === "" ? null : Number(e.target.value) })
                    }
                  />
                  <span className="text-muted">–</span>
                  <input
                    type="number"
                    className="h-9 w-14 rounded-[8px] border border-line bg-elevated px-2 text-sm"
                    value={m.opponentScore ?? ""}
                    onChange={(e) =>
                      updateMatch(m.id, { opponentScore: e.target.value === "" ? null : Number(e.target.value) })
                    }
                  />
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-muted">MVP</label>
                  <select
                    value={m.motm ?? "__none__"}
                    onChange={(e) => updateMatch(m.id, { motm: e.target.value === "__none__" ? null : e.target.value })}
                    className="h-9 w-full rounded-[8px] border border-line bg-elevated px-2 text-sm"
                  >
                    <option value="__none__">No MVP selected</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-[12px] border border-line bg-[#0f1714] p-3">
                <div className="mb-2 text-[10px] uppercase tracking-[0.14em] text-muted">Goal scorers</div>
                <div
                  className="min-h-12 rounded-[10px] border border-dashed border-line bg-[#0d1513] p-2"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!dragScorerId) return;
                    const goals = { ...m.goals };
                    goals[dragScorerId] = (goals[dragScorerId] ?? 0) + 1;
                    updateMatch(m.id, { goals });
                    setDragScorerId(null);
                  }}
                >
                  {Object.entries(m.goals ?? {}).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(m.goals ?? {}).map(([id, count]) => {
                        const player = players.find((p) => p.id === id);
                        if (!player) return null;
                        return (
                          <div
                            key={id}
                            draggable
                            onDragStart={() => setDragScorerId(id)}
                            className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-xs font-medium text-[#dfece2]"
                          >
                            <span>{player.name}</span>
                            <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent">{count}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const goals = { ...m.goals };
                                if ((goals[id] ?? 1) <= 1) delete goals[id];
                                else goals[id] = Math.max(0, (goals[id] ?? 1) - 1);
                                updateMatch(m.id, { goals });
                              }}
                              className="text-subtle hover:text-warn"
                              aria-label={`Remove goal for ${player.name}`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-subtle">Drop a player card here or add a scorer below.</div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const id = e.target.value;
                      if (!id) return;
                      const goals = { ...m.goals };
                      goals[id] = (goals[id] ?? 0) + 1;
                      updateMatch(m.id, { goals });
                      e.target.value = "";
                    }}
                    className="h-9 flex-1 rounded-[8px] border border-line bg-elevated px-2 text-sm"
                  >
                    <option value="">Quick add scorer</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs text-muted">
                Match ratings feed form. They never rewrite the base card.
              </div>
              <div className="space-y-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDragScorerId(p.id)}
                    onDragEnd={() => setDragScorerId(null)}
                    className="flex items-center gap-2 rounded-[10px] px-1 py-1"
                  >
                    <button onClick={() => onOpenPlayer(p)} className="w-28 truncate text-left text-sm">
                      {p.name}
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      step={0.1}
                      placeholder="rating"
                      value={m.ratings?.[p.id] ?? ""}
                      onChange={(e) => {
                        const ratings = { ...m.ratings };
                        if (e.target.value === "") delete ratings[p.id];
                        else ratings[p.id] = Number(e.target.value);
                        updateMatch(m.id, { ratings });
                      }}
                      className="h-8 w-16 rounded-[8px] border border-line bg-elevated px-2 text-xs"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="G"
                      value={m.goals?.[p.id] ?? ""}
                      onChange={(e) => {
                        const goals = { ...m.goals };
                        if (e.target.value === "" || Number(e.target.value) === 0) delete goals[p.id];
                        else goals[p.id] = Number(e.target.value);
                        updateMatch(m.id, { goals });
                      }}
                      className="h-8 w-12 rounded-[8px] border border-line bg-elevated px-2 text-xs"
                    />
                    <button
                      onClick={() => updateMatch(m.id, { motm: m.motm === p.id ? null : p.id })}
                      className={m.motm === p.id ? "text-accent text-xs font-semibold" : "text-subtle text-xs"}
                    >
                      MVP
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function CalendarView() {
  const matches = usePitchStore((s) => s.matches);
  const trainings = usePitchStore((s) => s.trainings);
  const category = usePitchStore((s) => s.category);
  const setSquadTab = usePitchStore((s) => s.setSquadTab);
  const events = [
    ...matches.filter((m) => m.category === category).map((m) => ({ date: m.date, label: `Match vs ${m.opponent}`, kind: "match" as const })),
    ...trainings.filter((t) => t.category === category).map((t) => ({ date: t.date, label: t.title, kind: "training" as const })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="space-y-2">
      {events.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted">
          No fixtures or sessions on the calendar yet.
        </div>
      )}
      {events.map((e, i) => (
        <button
          key={i}
          onClick={() => setSquadTab(e.kind === "match" ? "matches" : "training")}
          className="flex w-full items-center gap-3 rounded-[12px] border border-line bg-surface px-3 py-2 text-left"
        >
          {e.kind === "match" ? <Trophy className="size-4 text-accent" /> : <CalendarDays className="size-4 text-muted" />}
          <div>
            <div className="text-sm font-semibold">{e.label}</div>
            <div className="text-xs text-muted">{formatDateLong(e.date)}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function LegacyCabinetView() {
  const trophies = usePitchStore((s) => s.trophies);
  const players = usePitchStore((s) => s.players);
  const matches = usePitchStore((s) => s.matches);
  const category = usePitchStore((s) => s.category);
  const addTrophy = usePitchStore((s) => s.addTrophy);
  const removeTrophy = usePitchStore((s) => s.removeTrophy);
  const { role } = useRole();
  const canEdit = canEditRoster(role);

  const [name, setName] = useState("Aga Khan U15 League Cup");
  const [competition, setCompetition] = useState("National League");
  const [season, setSeason] = useState("2026/27");
  const [notes, setNotes] = useState("A landmark season for the squad and a first trophy under the academy banner.");
  const [photo, setPhoto] = useState<string | null>(null);
  const mvpRows = useMemo(() => {
    const counts: Record<string, number> = {};
    matches
      .filter((match) => match.category === category && match.motm)
      .forEach((match) => {
        if (match.motm) counts[match.motm] = (counts[match.motm] ?? 0) + 1;
      });
    return Object.entries(counts)
      .map(([playerId, wins]) => ({ player: players.find((player) => player.id === playerId), wins }))
      .filter((row): row is { player: Player; wins: number } => !!row.player)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 3);
  }, [category, matches, players]);

  const handlePhoto = (file?: File | null) => {
    if (!file) {
      setPhoto(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submitTrophy = () => {
    if (!name.trim() && !competition.trim() && !season.trim() && !photo) return;
    addTrophy({ name, competition, season, notes, photo });
    setName("");
    setCompetition("");
    setSeason("");
    setNotes("");
    setPhoto(null);
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[22px] border border-line bg-surface">
        <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-5">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-[#d4b66a]/30 bg-[#2a2214] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0d79a]">
              Agakhans Legacy
            </div>
            <h2 className="font-display text-3xl leading-none tracking-[0.06em] text-fg md:text-4xl">
              Trophy cabinet for academy honours and proud moments.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Build a shelf of victories, upload a real photo, and preserve the club story in one place for the academy community.
            </p>
          </div>

          <div className="rounded-[18px] border border-line bg-[#0d1513] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted">Cabinet snapshot</div>
            <div className="flex items-end gap-3">
              <div className="font-display text-4xl text-accent tabular-nums">{trophies.length}</div>
              <div className="pb-1 text-sm text-muted">honours catalogued</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-line bg-surface p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4b66a]">
              <Award className="size-4" /> Player honours
            </div>
            <h3 className="mt-1 font-display text-2xl tracking-[0.04em] text-fg">MVP trophies</h3>
          </div>
          <div className="text-xs text-muted">Calculated from match MVP selections</div>
        </div>
        {mvpRows.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-line px-3 py-4 text-sm text-muted">
            MVP trophies will appear here as match results are recorded.
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-3">
            {mvpRows.map(({ player, wins }, index) => (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-[14px] border border-[#d4b66a]/20 bg-[#15170f] px-3 py-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d4b66a]/35 bg-[#242014] font-display text-lg text-[#f0d79a]">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-fg">{player.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-muted">{player.position}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-[#f0d79a]">{wins}</div>
                  <div className="text-[9px] uppercase tracking-[0.14em] text-muted">MVP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={canEdit ? "grid gap-4 lg:grid-cols-[420px_1fr]" : "grid gap-4"}>
        {canEdit && (
          <div className="rounded-[18px] border border-line bg-surface p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted">Add a trophy</div>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Trophy name"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
              />
              <input
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                placeholder="Competition"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
              />
              <input
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="Season"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write a short memory of the achievement"
                rows={4}
                className="w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle"
              />

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-line bg-[#0f1714] px-3 py-2 text-sm text-muted">
                <span>{photo ? "Replace photo" : "Upload trophy photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
                />
                <span className="rounded-full border border-line px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-accent">
                  Upload
                </span>
              </label>

              {photo && (
                <div className="overflow-hidden rounded-[12px] border border-line bg-[#0c120f]">
                  <img src={photo} alt="Trophy preview" className="h-32 w-full object-cover" />
                </div>
              )}

              <Button onClick={submitTrophy} className="w-full">
                <Plus className="size-4" /> Add to cabinet
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {trophies.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
              {canEdit
                ? "No trophies yet. Add your first academy highlight to begin the legacy cabinet."
                : "No trophies have been added to the cabinet yet."}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {trophies.map((trophy) => (
                <article
                  key={trophy.id}
                  className="group relative overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,#141d1a_0%,#0d1513_100%)] p-3 shadow-[0_16px_30px_rgba(8,12,10,0.25)]"
                >
                  <div className="absolute inset-x-4 top-0 h-24 rounded-b-[40%] bg-gradient-to-b from-[#dcbf72]/18 to-transparent blur-xl" />
                  <div className="relative rounded-[16px] border border-[#d4b66a]/15 bg-[#0f1714] p-3">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="rounded-full border border-[#d4b66a]/30 bg-[#1a170f] px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-[#f0d79a]">
                        {trophy.season}
                      </div>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => removeTrophy(trophy.id)}
                          className="rounded-full border border-line p-1.5 text-subtle hover:text-warn"
                          aria-label={`Remove ${trophy.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="mb-3 flex h-28 items-center justify-center rounded-[14px] border border-line bg-[radial-gradient(circle_at_top,#212f2c,#0d1513_58%)]">
                      {trophy.photo ? (
                        <img src={trophy.photo} alt={trophy.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#d7c88b]">
                          <Trophy className="size-10" />
                          <span className="text-[10px] uppercase tracking-[0.18em] text-muted">Honour</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-display text-xl leading-none text-fg">{trophy.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-accent">{trophy.competition}</div>
                      <p className="min-h-[44px] text-xs leading-5 text-muted">{trophy.notes || "Academy achievement"}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}