import { useEffect, useState } from "react";
import { usePitchStore } from "@/lib/pitch/store";

/**
 * OWNER ONLY full-screen page: everyone waiting for access, with Approve and
 * Reject buttons. The server (/approvals) checks that you really are the
 * owner, so this screen can't be used by anyone else even if they open it.
 */

type Item =
  | { type: "player"; userId: string; playerId: string; name: string | null; email: string | null }
  | { type: "signup"; userId: string; role: "coach" | "editor"; name: string | null; email: string | null };

export function ApprovalsPanel({
  onClose,
  onCount,
}: {
  onClose: () => void;
  onCount: (n: number) => void;
}) {
  const players = usePitchStore((s) => s.players);
  const [items, setItems] = useState<Item[] | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/approvals");
      const data = (await res.json()) as { items?: Item[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not load requests");
      const list = data.items ?? [];
      setItems(list);
      onCount(list.length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load requests");
      setItems([]);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyOf = (i: Item) => `${i.type}-${i.userId}-${i.type === "player" ? i.playerId : i.role}`;

  async function act(item: Item, action: "approve" | "reject") {
    setBusyKey(keyOf(item));
    setError(null);
    try {
      const res = await fetch("/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          type: item.type,
          userId: item.userId,
          playerId: item.type === "player" ? item.playerId : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-bg px-4 py-10">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-sm text-muted hover:text-fg"
      >
        ← Back to squad
      </button>

      <div className="my-auto w-full max-w-xl space-y-4">
        <div className="text-center">
          <div className="font-display text-2xl tracking-wide">Access requests</div>
          <p className="mt-1 text-sm text-muted">
            Approve to give someone their role. Reject to turn them down.
          </p>
        </div>

        {error && <div className="text-center text-xs text-red-400">{error}</div>}
        {items === null && <div className="text-center text-sm text-muted">Loading…</div>}
        {items !== null && items.length === 0 && !error && (
          <div className="rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted">
            No requests waiting.
          </div>
        )}

        {(items ?? []).map((item) => {
          const card = item.type === "player" ? players.find((p) => p.id === item.playerId) : null;
          const busy = busyKey === keyOf(item);
          return (
            <div key={keyOf(item)} className="rounded-[14px] border border-line bg-surface p-4">
              <div className="text-sm font-semibold text-fg">{item.name || "Unknown name"}</div>
              <div className="text-xs text-muted">{item.email || "No email found"}</div>
              <div className="mt-2 text-sm">
                {item.type === "player" ? (
                  <>
                    Wants to be a <strong>player</strong> — card:{" "}
                    <strong>{card ? `${card.name} (#${card.number}, ${card.position})` : "a card that no longer exists"}</strong>
                  </>
                ) : (
                  <>
                    Wants to be a <strong>{item.role}</strong>
                  </>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act(item, "approve")}
                  className="h-9 flex-1 rounded-full bg-accent text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-fg disabled:cursor-wait disabled:opacity-60"
                >
                  {busy ? "Please wait…" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act(item, "reject")}
                  className="h-9 flex-1 rounded-full border border-line bg-elevated text-[11px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-fg disabled:cursor-wait disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}