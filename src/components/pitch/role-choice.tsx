import { useEffect, useMemo, useState } from "react";
import { usePitchStore } from "@/lib/pitch/store";
import { signOut } from "@/lib/auth/client";

/**
 * Full-screen "Who are you?" page for signed-in people who don't have a role
 * yet (role = "pending"). They choose player / coach / editor. A player also
 * picks their own card. Nothing is granted here — the request is sent to
 * POST /access and waits for the owner to approve it.
 */

type AccessRequest = {
  kind: "player" | "coach" | "editor";
  playerId?: string;
  status: string;
} | null;

const ROLE_OPTIONS = [
  {
    kind: "player",
    title: "I'm a player",
    desc: "Pick your own card. You can view everything, and edit only your own card.",
  },
  {
    kind: "coach",
    title: "I'm a coach",
    desc: "Edit player stats, ratings, matches and training.",
  },
  {
    kind: "editor",
    title: "I'm an editor",
    desc: "Edit everything, including how the cards and the app look.",
  },
] as const;

const optionClass =
  "w-full rounded-[14px] border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-accent/60";

export function RoleChoice({ onClose }: { onClose: () => void }) {
  const players = usePitchStore((s) => s.players);
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState<AccessRequest>(null);
  const [changing, setChanging] = useState(false);
  const [step, setStep] = useState<"choose" | "pick-card">("choose");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadStatus() {
    try {
      const res = await fetch("/access");
      const data = (await res.json()) as { request?: AccessRequest };
      setExisting(data.request ?? null);
    } catch {
      setExisting(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  async function submit(body: { kind: "player" | "coach" | "editor"; playerId?: string }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setChanging(false);
      setStep("choose");
      setSelectedId(null);
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    const rows = n
      ? players.filter((p) => p.name.toLowerCase().includes(n) || String(p.number).includes(n))
      : players;
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [players, q]);

  const view: "loading" | "waiting" | "rejected" | "choose" | "pick-card" = loading
    ? "loading"
    : existing && existing.status === "pending" && !changing
      ? "waiting"
      : existing && existing.status === "rejected" && !changing
        ? "rejected"
        : step;

  const requestedPlayer = existing?.playerId ? players.find((p) => p.id === existing.playerId) : null;
  const requestLabel =
    existing?.kind === "player"
      ? `Player — ${requestedPlayer ? requestedPlayer.name : "your card"}`
      : existing?.kind === "coach"
        ? "Coach"
        : existing?.kind === "editor"
          ? "Editor"
          : "";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-bg px-4 py-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-sm text-muted hover:text-fg"
      >
        ← Back to squad (view only)
      </button>

      <div className="my-auto flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/akan-hq-logo.svg"
            alt="AGA KHAN ACADEMY crest"
            width={64}
            height={64}
            className="block rounded-full object-contain"
            draggable={false}
          />
          <div className="text-center">
            <div className="font-display text-2xl font-semibold tracking-[0.15em] text-[#f3f5f2] uppercase">
              AGA KHAN
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4b66a]">
              Football Academy
            </div>
          </div>
        </div>

        {view === "loading" && <div className="text-sm text-muted">Loading…</div>}

        {view === "waiting" && (
          <div className="w-full space-y-4 text-center">
            <div className="font-display text-2xl tracking-wide">Request sent</div>
            <p className="text-sm text-muted">
              You asked to join as <strong className="text-fg">{requestLabel}</strong>. The academy owner needs to
              approve it. Until then you can look around, but you can't change anything.
            </p>
            <div className="flex flex-col gap-2">
              <button type="button" onClick={onClose} className={optionClass}>
                Back to squad (view only)
              </button>
              <button
                type="button"
                onClick={() => {
                  setChanging(true);
                  setStep("choose");
                }}
                className="text-xs text-muted underline-offset-2 hover:underline"
              >
                Change my request
              </button>
            </div>
          </div>
        )}

        {view === "rejected" && (
          <div className="w-full space-y-4 text-center">
            <div className="font-display text-2xl tracking-wide">Not approved</div>
            <p className="text-sm text-muted">
              Your last request ({requestLabel}) wasn't approved. You can send a new one.
            </p>
            <button
              type="button"
              onClick={() => {
                setChanging(true);
                setStep("choose");
              }}
              className={optionClass}
            >
              Choose again
            </button>
          </div>
        )}

        {view === "choose" && (
          <div className="w-full space-y-3">
            <div className="text-center">
              <div className="font-display text-2xl tracking-wide">Who are you?</div>
              <p className="mt-1 text-sm text-muted">
                Choose one. The academy owner approves every request before it works.
              </p>
            </div>
            {ROLE_OPTIONS.map((o) => (
              <button
                key={o.kind}
                type="button"
                disabled={busy}
                onClick={() => {
                  setError(null);
                  if (o.kind === "player") setStep("pick-card");
                  else void submit({ kind: o.kind });
                }}
                className={optionClass}
              >
                <div className="text-sm font-semibold text-fg">{o.title}</div>
                <div className="mt-0.5 text-xs text-muted">{o.desc}</div>
              </button>
            ))}
            {error && <div className="text-center text-xs text-red-400">{error}</div>}
            {changing && (
              <button
                type="button"
                onClick={() => setChanging(false)}
                className="block w-full text-center text-xs text-muted underline-offset-2 hover:underline"
              >
                Keep my current request
              </button>
            )}
          </div>
        )}

        {view === "pick-card" && (
          <div className="w-full space-y-3">
            <div className="text-center">
              <div className="font-display text-2xl tracking-wide">Pick your card</div>
              <p className="mt-1 text-sm text-muted">Choose the card that is yours. You'll only be able to edit this one.</p>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or number"
              className="h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
            />
            <div className="max-h-[42vh] space-y-1.5 overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <div className="rounded-[12px] border border-dashed border-line p-4 text-center text-sm text-muted">
                  {players.length === 0 ? "There are no player cards yet." : "No cards match your search."}
                </div>
              )}
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={
                    selectedId === p.id
                      ? "flex w-full items-center justify-between rounded-[12px] border border-accent bg-accent/10 px-3 py-2 text-left"
                      : "flex w-full items-center justify-between rounded-[12px] border border-line bg-surface px-3 py-2 text-left hover:border-accent/60"
                  }
                >
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="text-xs text-muted">
                    #{p.number} · {p.position} · {p.category}
                  </span>
                </button>
              ))}
            </div>
            {error && <div className="text-center text-xs text-red-400">{error}</div>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setError(null);
                }}
                className="h-10 flex-1 rounded-full border border-line bg-surface text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!selectedId || busy}
                onClick={() => selectedId && void submit({ kind: "player", playerId: selectedId })}
                className="h-10 flex-1 rounded-full bg-accent text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-fg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Sending…" : "Send request"}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
          className="text-xs text-subtle underline-offset-2 hover:underline disabled:cursor-wait"
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}