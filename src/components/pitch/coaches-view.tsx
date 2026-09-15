import { useMemo, useState } from "react";
import { Camera, Loader2, Plus, Send, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachCard } from "./coach-card";
import { PlayerCard } from "./player-card";
import { Modal } from "./modal";
import { usePitchStore } from "@/lib/pitch/store";
import type { Coach, CoachRole, Player, CardDesign, CardStyle } from "@/lib/pitch/types";
import { CARD_DESIGNS, CARD_DESIGN_LABELS } from "@/lib/pitch/types";
import {
  TIER_PALETTE,
  DEFAULT_CARD_STYLE,
  mergeCardStyle,
  normalizeCardDesign,
  type CardTier,
} from "@/lib/pitch/card-system";
import { cn } from "@/lib/utils";

const ROLES: CoachRole[] = ["Head Coach", "Assistant Coach", "Goalkeeping Coach", "Fitness Coach", "Scout"];

type SendResult = {
  playerId: string;
  email: string;
  success: boolean;
  error?: string;
};

function CoachForm({ existing, onClose }: { existing?: Coach; onClose: () => void }) {
  const addCoach = usePitchStore((s) => s.addCoach);
  const updateCoach = usePitchStore((s) => s.updateCoach);
  const [tab, setTab] = useState<"info" | "design">("info");
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState<CoachRole>(existing?.role ?? "Head Coach");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [team, setTeam] = useState(existing?.team ?? "AKAN HQ");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [cardDesign, setCardDesign] = useState<CardDesign>(normalizeCardDesign(existing?.cardDesign ?? "auto"));
  const [style, setStyle] = useState<CardStyle>(mergeCardStyle(existing?.cardStyle));

  function patchStyle(partial: Partial<CardStyle>) {
    setStyle((s) => ({ ...s, ...partial }));
  }

  function applyChassis(d: CardDesign) {
    setCardDesign(d);
    if (d !== "auto") {
      const pal = TIER_PALETTE[d as CardTier];
      if (pal) patchStyle(pal);
    }
  }

  const previewCoach: Coach = {
    id: existing?.id ?? "preview",
    name: name || "New Coach",
    photo,
    role,
    phone,
    email,
    team,
    category: "U15",
    bio,
    cardDesign,
    cardStyle: style,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  function save() {
    if (!name.trim() || !email.trim()) return;
    const payload = {
      name: name.trim(),
      role,
      phone,
      email: email.trim(),
      team,
      bio,
      photo,
      cardDesign,
      cardStyle: style,
    };
    if (existing) {
      updateCoach(existing.id, payload);
    } else {
      addCoach(payload);
    }
    onClose();
  }

  return (
    <div className="flex max-h-[min(90vh,760px)] flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="font-display text-xl">{existing ? "Edit coach" : "Add coach"}</div>
        <button onClick={onClose} className="text-sm text-muted hover:text-fg">
          Close
        </button>
      </div>

      <div className="flex gap-1 border-b border-line px-4 pt-2">
        {(
          [
            ["info", "Info"],
            ["design", "Card design"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-t-[10px] px-3 py-1.5 text-xs font-semibold",
              tab === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[1fr_220px]">
        <div>
          {tab === "info" && (
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-elevated">
                  {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <Camera className="size-5 text-subtle" />}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(String(reader.result));
                    reader.readAsDataURL(f);
                  }}
                />
                <span className="text-xs text-muted">Upload photo</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CoachRole)}
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
              />
              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Team"
                className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short bio (optional)"
                rows={3}
                className="w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
              />
            </div>
          )}

          {tab === "design" && (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs text-muted">Chassis template — same styles used for player cards.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CARD_DESIGNS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => applyChassis(d)}
                      className={cn(
                        "rounded-[12px] border px-3 py-2 text-left text-xs",
                        cardDesign === d ? "border-accent bg-accent/10" : "border-line bg-elevated",
                      )}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <span className={cn("pcard-swatch", `pcard-swatch-${d}`)} />
                        {CARD_DESIGN_LABELS[d].split(" — ")[0]}
                      </div>
                      <div className="text-[10px] text-muted">{CARD_DESIGN_LABELS[d].split(" — ")[1] ?? ""}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { key: "primary", label: "Primary" },
                    { key: "secondary", label: "Secondary" },
                    { key: "accent", label: "Accent" },
                    { key: "background", label: "Background" },
                    { key: "border", label: "Border" },
                    { key: "glowColor", label: "Glow" },
                  ] as const
                ).map((f) => {
                  const val = String(style[f.key] ?? "");
                  return (
                    <label key={f.key} className="text-xs text-muted">
                      {f.label}
                      <div className="mt-1 flex gap-2">
                        <input
                          type="color"
                          value={val && val.startsWith("#") ? val : "#808080"}
                          onChange={(e) => patchStyle({ [f.key]: e.target.value })}
                          className="h-10 w-12 rounded border border-line bg-elevated"
                        />
                        <input
                          value={val}
                          onChange={(e) => patchStyle({ [f.key]: e.target.value })}
                          placeholder="empty = tier default"
                          className="h-10 flex-1 rounded-[10px] border border-line bg-elevated px-2 text-sm"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Portrait framing</div>
                <div className="flex flex-wrap gap-2">
                  {(["face", "full-body"] as const).map((frame) => (
                    <button
                      key={frame}
                      type="button"
                      onClick={() => patchStyle({ photoFrame: frame })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        style.photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted",
                      )}
                    >
                      {frame === "face" ? "Face focus" : "Full body"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="text-xs text-muted underline"
                onClick={() => {
                  setCardDesign("auto");
                  setStyle({ ...DEFAULT_CARD_STYLE });
                }}
              >
                Reset design to default
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="sticky top-0">
            <CoachCard coach={previewCoach} size="full" />
            <p className="mt-2 text-center text-[10px] text-subtle">Live preview</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save} disabled={!name.trim() || !email.trim()}>
          Save coach
        </Button>
      </div>
    </div>
  );
}

function CallUpBuilder({ coach, players, onClose }: { coach: Coach; players: Player[]; onClose: () => void }) {
  const trainingCountForPlayer = usePitchStore((s) => s.trainingCountForPlayer);
  const createCallUp = usePitchStore((s) => s.createCallUp);
  const callUps = usePitchStore((s) => s.callUps);
  const toggleRoster = usePitchStore((s) => s.toggleRoster);

  const [callUpName, setCallUpName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reuseId, setReuseId] = useState<string>("");
  const [notSelectedNote, setNotSelectedNote] = useState("");
  const [calledNote, setCalledNote] = useState("");
  const [rosterOnly, setRosterOnly] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { called: Player[]; notSelected: Player[]; results: SendResult[] }>(
    null,
  );

  const visible = useMemo(
    () => (rosterOnly ? players.filter((p) => p.onRoster) : players),
    [players, rosterOnly],
  );

  const ranked = useMemo(
    () => [...visible].sort((a, b) => trainingCountForPlayer(b.id) - trainingCountForPlayer(a.id)),
    [visible, trainingCountForPlayer],
  );

  const offRosterCount = players.length - players.filter((p) => p.onRoster).length;

  function applyReuse(id: string) {
    setReuseId(id);
    const src = callUps.find((c) => c.id === id);
    if (!src) return;
    setSelected(new Set(src.entries.filter((e) => e.status === "called").map((e) => e.playerId)));
  }

  function markCalled(id: string) {
    setSelected((s) => new Set(s).add(id));
  }

  function markNotSelected(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }

  async function send() {
    if (!callUpName.trim() || sending) return;

    // Only players actually visible under the current roster filter count
    // as "not selected" — someone off the roster shouldn't get a
    // not-selected email just because they're not on the active squad.
    const called = visible.filter((p) => selected.has(p.id));
    const notSelected = visible.filter((p) => !selected.has(p.id));

    setSending(true);
    setSendError(null);

    try {
      const response = await fetch("/send-callup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callUpName: callUpName.trim(),
          coachName: coach.name,
          coachEmail: coach.email,
          calledNote: calledNote.trim() || null,
          notSelectedNote: notSelectedNote.trim() || null,
          called: called.map((p) => ({
            playerId: p.id,
            name: p.name,
            email: p.email?.trim() || p.guardianEmail?.trim() || "",
            photo: p.photo,
            position: p.position,
          })),
          notSelected: notSelected.map((p) => ({
            playerId: p.id,
            name: p.name,
            email: p.email?.trim() || p.guardianEmail?.trim() || "",
            photo: p.photo,
            position: p.position,
          })),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { results?: SendResult[]; error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || `Send failed (status ${response.status})`);
      }

      createCallUp(callUpName, coach.id, [...selected]);
      setResult({ called, notSelected, results: payload?.results ?? [] });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Could not send the call-up. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (result) {
    const resultFor = (playerId: string) => result.results.find((r) => r.playerId === playerId);
    return (
      <div className="p-5">
        <div className="mb-1 font-display text-xl">Call-up sent</div>
        <p className="mb-4 text-sm text-muted">
          "{callUpName}" saved. Delivery status per player below.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[12px] border border-accent/30 bg-accent/5 p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-accent">Called up ({result.called.length})</div>
            {result.called.map((p) => {
              const r = resultFor(p.id);
              return (
                <div key={p.id} className="mb-1 text-sm">
                  {p.name}{" "}
                  {r?.success ? (
                    <span className="text-xs text-accent">— email sent</span>
                  ) : (
                    <span className="text-xs text-warn">— {r?.error || "not sent (no email on file)"}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="rounded-[12px] border border-line bg-elevated p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-muted">Not selected ({result.notSelected.length})</div>
            {result.notSelected.map((p) => {
              const r = resultFor(p.id);
              return (
                <div key={p.id} className="mb-1 text-sm text-muted">
                  {p.name}{" "}
                  {r?.success ? (
                    <span className="text-xs text-muted">— email sent</span>
                  ) : (
                    <span className="text-xs text-warn">— {r?.error || "not sent (no email on file)"}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Button className="mt-4" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-1 font-display text-xl">New call-up — {coach.name}</div>
      <p className="mb-3 text-xs text-muted">
        Players are sorted by training attendance — most-trained first. Use the buttons on each row to mark them.
      </p>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line bg-elevated px-3 py-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          <input
            type="checkbox"
            checked={rosterOnly}
            onChange={(e) => setRosterOnly(e.target.checked)}
            className="size-4"
          />
          Show roster players only
        </label>
        {offRosterCount > 0 && (
          <span className="text-[11px] text-subtle">
            {offRosterCount} player{offRosterCount === 1 ? "" : "s"} marked off-roster
            {rosterOnly ? " (hidden)" : ""}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={callUpName}
          onChange={(e) => setCallUpName(e.target.value)}
          placeholder="Call-up name (e.g. vs Riverside, Sat)"
          className="h-10 flex-1 min-w-[180px] rounded-[10px] border border-line bg-elevated px-3 text-sm"
        />
        {callUps.length > 0 && (
          <select
            value={reuseId}
            onChange={(e) => applyReuse(e.target.value)}
            className="h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
          >
            <option value="">Start a new list</option>
            {callUps
              .filter((c) => c.coachId === coach.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  Reuse: {c.name}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">
          {selected.size} of {ranked.length} marked called up
        </span>
        <button
          type="button"
          onClick={() => setSelected(new Set(ranked.map((p) => p.id)))}
          className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
        >
          Mark all called up
        </button>
        <button
          type="button"
          onClick={() => setSelected(new Set())}
          className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
        >
          Mark all not selected
        </button>
        <button
          type="button"
          onClick={() => setSelected(new Set(ranked.slice(0, 11).map((p) => p.id)))}
          className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent"
        >
          Top 11 by attendance
        </button>
      </div>

      <div className="max-h-[40vh] space-y-1.5 overflow-y-auto hq-scroll">
        {ranked.map((p) => {
          const count = trainingCountForPlayer(p.id);
          const on = selected.has(p.id);
          const hasEmail = Boolean(p.email?.trim() || p.guardianEmail?.trim());
          return (
            <div
              key={p.id}
              className={cn(
                "flex w-full flex-wrap items-center gap-3 rounded-[10px] border px-3 py-2",
                on ? "border-accent bg-accent/10" : "border-line bg-elevated",
              )}
            >
              <PlayerCard player={p} size="tiny" />
              <div className="min-w-[120px] flex-1">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.position} · {count} training{count === 1 ? "" : "s"} attended
                  {!hasEmail && <span className="text-warn"> · no email on file</span>}
                </div>
              </div>

              {/* Explicit called-up / not-selected buttons — clicking anywhere
                  on the row used to toggle selection, which wasn't clear. Now
                  there are two dedicated buttons so it's obvious what state
                  each player is in and how to change it. */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => markCalled(p.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide",
                    on
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-line bg-surface text-muted hover:border-accent/50 hover:text-accent",
                  )}
                >
                  ✓ Called up
                </button>
                <button
                  type="button"
                  onClick={() => markNotSelected(p.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide",
                    !on
                      ? "border-warn bg-warn/20 text-warn"
                      : "border-line bg-surface text-muted hover:border-warn/50 hover:text-warn",
                  )}
                >
                  Not selected
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleRoster(p.id)}
                title={p.onRoster ? "Remove from roster" : "Add to roster"}
                className={cn(
                  "shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold",
                  p.onRoster
                    ? "border-line bg-surface text-muted hover:text-warn"
                    : "border-accent/40 bg-accent/10 text-accent",
                )}
              >
                {p.onRoster ? "On roster" : "Off roster"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-muted">
          Custom note for called-up players (optional)
          <textarea
            value={calledNote}
            onChange={(e) => setCalledNote(e.target.value)}
            placeholder="e.g. Meet at the main gate 30 min before kickoff, full kit required."
            rows={3}
            className="mt-1 w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs text-muted">
          Custom note for players not selected (optional)
          <textarea
            value={notSelectedNote}
            onChange={(e) => setNotSelectedNote(e.target.value)}
            placeholder="e.g. Really close call this week — keep up the work at Tuesday's session."
            rows={3}
            className="mt-1 w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
          />
        </label>
      </div>

      {sendError && (
        <p className="mt-3 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn">{sendError}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        <Button onClick={() => void send()} disabled={!callUpName.trim() || sending}>
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="size-4" /> Send call-up
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function CoachesView({ players }: { players: Player[] }) {
  const coaches = usePitchStore((s) => s.coaches);
  const callUps = usePitchStore((s) => s.callUps);
  const removeCoach = usePitchStore((s) => s.removeCoach);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Coach | null>(null);
  const [callingUp, setCallingUp] = useState<Coach | null>(null);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl tracking-wide">Coaches</h2>
          <p className="text-xs text-muted">Manage staff profiles and build match call-ups.</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" /> Add coach
        </Button>
      </div>

      {coaches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-surface px-6 py-16 text-center">
          <Users className="mb-3 size-8 text-subtle" />
          <div className="font-display text-2xl tracking-wide">No coaches yet</div>
          <p className="mt-2 max-w-sm text-sm text-muted">Add a coach profile to start building match call-ups.</p>
          <Button className="mt-6" onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Add coach
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 pt-4 sm:grid-cols-3 lg:grid-cols-4">
          {coaches.map((c) => (
            <div key={c.id} className="group relative flex flex-col items-center">
              <CoachCard coach={c} size="full" />
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <button
                  type="button"
                  onClick={() => setCallingUp(c)}
                  className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent"
                >
                  New call-up
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(c)}
                  className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(c)}
                  className="rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-warn hover:bg-warn/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {callUps.length > 0 && (
        <div className="mt-8">
          <div className="mb-2 font-display text-lg">Recent call-ups</div>
          <div className="space-y-1.5">
            {callUps.map((cu) => {
              const coach = coaches.find((c) => c.id === cu.coachId);
              const calledCount = cu.entries.filter((e) => e.status === "called").length;
              return (
                <div key={cu.id} className="flex items-center justify-between rounded-[10px] border border-line bg-surface px-3 py-2">
                  <div>
                    <div className="text-sm font-semibold">{cu.name}</div>
                    <div className="text-xs text-muted">
                      {coach?.name ?? "Unknown coach"} · {calledCount} called up · {cu.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} wide>
        <CoachForm onClose={() => setCreating(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} wide>
        {editing && <CoachForm existing={editing} onClose={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!callingUp} onClose={() => setCallingUp(null)} wide>
        {callingUp && <CallUpBuilder coach={callingUp} players={players} onClose={() => setCallingUp(null)} />}
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        {confirmDelete && (
          <div className="p-5">
            <div className="font-display text-xl">Delete coach?</div>
            <p className="mt-2 text-sm text-muted">
              Remove <strong className="text-fg">{confirmDelete.name}</strong> and their call-up history. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  removeCoach(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}