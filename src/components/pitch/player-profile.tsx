import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "./player-card";
import { PlayerForm } from "./player-form";
import { derivePlayer, isGoalkeeper } from "@/lib/pitch/ratings";
import {
  DETAIL_GROUPS,
  DETAIL_LABELS,
  SIX_KEYS,
  SIX_LABELS,
  GK_KEYS,
  GK_LABELS,
  type Player,
} from "@/lib/pitch/types";
import { usePitchStore } from "@/lib/pitch/store";
import { canEditOwnLook, canEditRoster, useRole } from "@/lib/auth/use-role";

export function PlayerProfile({ player, onClose }: { player: Player; onClose: () => void }) {
  const matches = usePitchStore((s) => s.matches);
  const adjustAttribute = usePitchStore((s) => s.adjustAttribute);
  const removePlayer = usePitchStore((s) => s.removePlayer);
  // Signed-out visitors and pending users get role "pending", so canEdit is
  // false for them and every edit control below stays hidden. An approved
  // player can also change the LOOK (design + photo) of their own card, and
  // nothing else — see canEditLook below.
  const { role, playerId } = useRole();
  const canEdit = canEditRoster(role);
  const canEditLook = !canEdit && canEditOwnLook(role, playerId, player.id);
  const d = derivePlayer(player, matches);
  const [edit, setEdit] = useState(false);
  const [adjKey, setAdjKey] = useState<string | null>(null);
  const [adjVal, setAdjVal] = useState(70);
  const [reason, setReason] = useState("");
  const [confirmDel, setConfirmDel] = useState(false);

  if (edit && (canEdit || canEditLook)) {
    return (
      <PlayerForm
        existing={player}
        appearanceOnly={!canEdit}
        onClose={() => setEdit(false)}
        onCreated={() => setEdit(false)}
      />
    );
  }

  const gk = isGoalkeeper(player.position) && player.gkCurrent;

  return (
    <div className="flex max-h-[min(92vh,860px)] flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="font-display text-xl tracking-wide">
          {player.name} — {player.position} — {d.ovr} OVR
        </div>
        <button onClick={onClose} className="text-muted hover:text-fg">
          <X className="size-5" />
        </button>
      </div>
      <div className="overflow-y-auto hq-scroll p-4">
        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <PlayerCard player={player} matches={matches} size="profile" />
            <div className="grid w-full grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-[10px] bg-elevated p-2">
                <div className="text-muted">Base</div>
                <div className="font-display text-lg">{d.base}</div>
              </div>
              <div className="rounded-[10px] bg-elevated p-2">
                <div className="text-muted">Effective</div>
                <div className="font-display text-lg text-accent">{d.effective}</div>
              </div>
              <div className="rounded-[10px] bg-elevated p-2">
                <div className="text-muted">Form</div>
                <div className="font-display text-lg">{d.form ?? "—"}</div>
              </div>
              <div className="rounded-[10px] bg-elevated p-2">
                <div className="text-muted">Role</div>
                <div className="font-medium">{d.role}</div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Card stats</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(gk ? GK_KEYS : SIX_KEYS).map((k) => {
                  const label = gk ? GK_LABELS[k as keyof typeof GK_LABELS] : SIX_LABELS[k as keyof typeof SIX_LABELS];
                  const current = gk ? player.gkCurrent![k as keyof typeof player.gkCurrent] : player.currentSix[k as keyof typeof player.currentSix];
                  const base = gk ? player.gkBase![k as keyof typeof player.gkBase] : player.baseSix[k as keyof typeof player.baseSix];
                  const tile = (
                    <>
                      <div className="text-[10px] uppercase text-muted">{label}</div>
                      <div className="font-display text-2xl tabular-nums">{current}</div>
                      <div className="text-[10px] text-subtle">base {base}</div>
                    </>
                  );
                  // Only people who can edit get a clickable tile (it opens the
                  // manual-adjustment panel). Everyone else just sees the numbers.
                  return canEdit ? (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setAdjKey(k);
                        setAdjVal(current);
                        setReason("");
                      }}
                      className="rounded-[12px] border border-line bg-elevated p-2.5 text-left"
                    >
                      {tile}
                    </button>
                  ) : (
                    <div key={k} className="rounded-[12px] border border-line bg-elevated p-2.5 text-left">
                      {tile}
                    </div>
                  );
                })}
              </div>
            </section>

            {canEdit && adjKey && (
              <div className="rounded-[14px] border border-accent/40 bg-accent/5 p-3">
                <div className="mb-2 text-sm font-semibold">Manual adjustment — {adjKey.toUpperCase()}</div>
                <input
                  type="range"
                  min={1}
                  max={99}
                  value={adjVal}
                  onChange={(e) => setAdjVal(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="mb-2 text-right font-display text-lg tabular-nums">{adjVal}</div>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason — e.g. Has become noticeably faster"
                  className="mb-2 h-10 w-full rounded-[10px] border border-line bg-surface px-3 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      adjustAttribute(player.id, adjKey, adjVal, reason || "Coach observation");
                      setAdjKey(null);
                    }}
                  >
                    Save change
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setAdjKey(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Position suitability</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {d.suitability.slice(0, 9).map((s) => (
                  <div key={s.pos} className="flex items-center justify-between rounded-[10px] bg-elevated px-2.5 py-1.5 text-xs">
                    <span className="font-semibold">{s.pos}</span>
                    <span className="tabular-nums text-muted">
                      {s.rating} · {s.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Detailed attributes</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {DETAIL_GROUPS.map((g) => (
                  <div key={g.title} className="rounded-[12px] border border-line p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{g.title}</div>
                    {g.keys.map((k) => (
                      <div key={k} className="mb-1 flex justify-between text-xs">
                        <span className="text-muted">{DETAIL_LABELS[k]}</span>
                        <span className="tabular-nums">{player.detail[k]}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Strengths</h3>
                <ul className="space-y-1 text-sm text-muted">
                  {d.strengths.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Watch-outs</h3>
                <ul className="space-y-1 text-sm text-muted">
                  {d.weaknesses.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Match form</h3>
              <p className="text-sm text-muted">
                Average match rating {d.avgRating ?? "—"} from {d.ratingsCount} rated game
                {d.ratingsCount === 1 ? "" : "s"}. {d.goals} goals · {d.motm} MOTM. Form shifts effective rating by{" "}
                {d.formDelta >= 0 ? "+" : ""}
                {d.formDelta} — the base card stays {d.base}.
              </p>
            </section>

            {player.history.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Attribute history</h3>
                <ul className="space-y-1.5 text-sm">
                  {[...player.history].reverse().map((h) => (
                    <li key={h.id} className="rounded-[10px] bg-elevated px-3 py-2">
                      <span className="text-subtle">
                        {new Date(h.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>{" "}
                      <span className="font-semibold">{h.attr}</span> {h.from} → {h.to}{" "}
                      <span className="text-accent">
                        {h.to - h.from >= 0 ? "+" : ""}
                        {h.to - h.from}
                      </span>
                      <div className="text-xs text-muted">{h.reason}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {canEdit && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setEdit(true)}>Edit card</Button>
                {confirmDel ? (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => {
                        removePlayer(player.id);
                        onClose();
                      }}
                    >
                      Confirm delete
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmDel(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="danger" onClick={() => setConfirmDel(true)}>
                    Remove from squad
                  </Button>
                )}
              </div>
            )}

            {/* An approved player, looking at their own card only. */}
            {canEditLook && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setEdit(true)}>Edit my card&apos;s look</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}