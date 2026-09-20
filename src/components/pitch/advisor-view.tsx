import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "./player-card";
import { rankFormations, slotMapFromEval, type FormationEval } from "@/lib/pitch/ai";
import { usePitchStore, type FormatSize } from "@/lib/pitch/store";
import type { Player, PitchSlot } from "@/lib/pitch/types";
import { cn } from "@/lib/utils";
import { canEditRoster, useRole } from "@/lib/auth/use-role";

export function AdvisorView({
  players,
  onOpenPlayer,
  onUsed,
}: {
  players: Player[];
  onOpenPlayer: (p: Player) => void;
  onUsed: () => void;
}) {
  const matches = usePitchStore((s) => s.matches);
  const formatSize = usePitchStore((s) => s.formatSize);
  const setFormat = usePitchStore((s) => s.setFormat);
  const setSlotMap = usePitchStore((s) => s.setSlotMap);
  const setMode = usePitchStore((s) => s.setMode);
  const setTactiqTab = usePitchStore((s) => s.setTactiqTab);
  const intel = usePitchStore((s) => s.opponentIntel);
  const setIntel = usePitchStore((s) => s.setIntel);
  const [open, setOpen] = useState<string | null>(null);
  // Opponent notes are part of the shared team desk, so only people who can
  // edit the roster may change them. Everyone else can read them.
  const { role } = useRole();
  const canEditNotes = canEditRoster(role);

  const ranked = useMemo(
    () => rankFormations(formatSize, players, matches, intel),
    [formatSize, players, matches, intel],
  );
  const best = ranked[0];

  function apply(ev: FormationEval) {
    setFormat(ev.size, ev.formation);
    setSlotMap(slotMapFromEval(ev));
    setMode("tactiq");
    setTactiqTab("board");
    onUsed();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-accent/40 bg-accent/5 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
          <Sparkles className="size-4" /> Tactical Lab
        </div>
        <p className="mt-1 text-sm text-muted">
          Analyst workstation grounded in the player cards and match data you entered. Missing data is stated explicitly — nothing is invented.
        </p>
        {best && (
          <>
            <div className="mt-3 font-display text-3xl tracking-wide">
              {best.formation}{" "}
              <span className="text-accent">{best.fit}/100</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{best.explanation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => apply(best)}>Apply to board</Button>
              <Button variant="line" onClick={() => setOpen(best.formation)}>
                Why this score
              </Button>
            </div>
          </>
        )}
        {players.length === 0 && (
          <div className="mt-4 rounded-[12px] border border-dashed border-line p-4 text-sm text-muted">
            No saved player cards yet. Create cards in My Cards so Tactical Lab can score formations, CB selection and role fit from real attributes.
          </div>
        )}
      </div>

      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 font-display text-lg">
          {canEditNotes ? "Opponent notes (optional)" : "Opponent notes"}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-muted">
            Strengths
            <textarea
              value={intel.strengths}
              readOnly={!canEditNotes}
              onChange={(e) => {
                if (!canEditNotes) return;
                setIntel({ ...intel, strengths: e.target.value });
              }}
              placeholder={canEditNotes ? "Fast wingers, strong striker, high pressing" : "Nothing logged."}
              className={cn(
                "mt-1 h-20 w-full rounded-[10px] border border-line bg-elevated p-2 text-sm text-fg",
                !canEditNotes && "cursor-default opacity-70",
              )}
            />
          </label>
          <label className="text-xs text-muted">
            Weaknesses
            <textarea
              value={intel.weaknesses}
              readOnly={!canEditNotes}
              onChange={(e) => {
                if (!canEditNotes) return;
                setIntel({ ...intel, weaknesses: e.target.value });
              }}
              placeholder={canEditNotes ? "Slow centre-backs, weak midfield, poor transitions" : "Nothing logged."}
              className={cn(
                "mt-1 h-20 w-full rounded-[10px] border border-line bg-elevated p-2 text-sm text-fg",
                !canEditNotes && "cursor-default opacity-70",
              )}
            />
          </label>
        </div>
        {!canEditNotes && (
          <p className="mt-2 text-[11px] text-subtle">Only coaches and editors can change these notes.</p>
        )}
      </div>

      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Ask the lab</div>
        <p className="mb-2 text-xs text-subtle">
          Answers use saved cards, formation scores and opponent notes. Missing data is stated, never invented.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Which CB should start?",
            "Why concede from the wings?",
            "How should we press?",
            "What is weak in this shape?",
            "How to build from the back?",
            "How to create more chances?",
          ].map((q) => (
            <span
              key={q}
              className="rounded-full border border-line bg-elevated px-3 py-1.5 text-[11px] font-medium text-muted"
            >
              {q}
            </span>
          ))}
        </div>
        {players.length > 0 && best ? (
          <div className="mt-3 space-y-2 text-sm text-muted">
            <p>
              <span className="font-semibold text-fg">CB selection — </span>
              ranked from DEF, PHY, PAS and effective rating among your centre-backs. Open a card to inspect the numbers.
            </p>
            <p>
              <span className="font-semibold text-fg">Wings / press / chances — </span>
              use opponent notes plus the formation table. Fit {best.fit}/100 is the current evidence for {best.formation}.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Create player cards first — the lab will not fabricate a squad.</p>
        )}
      </div>

      {best && (
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 font-display text-lg">Recommended XI — {best.formation}</div>
          <div className="space-y-1.5">
            {best.assignment.map((a) => (
              <div key={a.slot.id} className="flex items-center gap-2 rounded-[10px] bg-elevated px-2 py-1.5">
                <span className="w-10 font-display text-sm text-accent">{a.slot.pos}</span>
                {a.player ? (
                  <button className="flex flex-1 items-center gap-2 text-left" onClick={() => onOpenPlayer(a.player!)}>
                    <PlayerCard player={a.player} matches={matches} size="tiny" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{a.player.name}</div>
                      <div className="truncate text-[11px] text-muted">{a.reason}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="font-display tabular-nums">{a.effective}</div>
                      <div className="text-[10px] text-subtle">{a.suitability}% fit</div>
                    </div>
                  </button>
                ) : (
                  <span className="text-sm text-subtle">No player</span>
                )}
              </div>
            ))}
          </div>
          {best.formNotes.length > 0 && (
            <div className="mt-3 space-y-1 text-xs text-muted">
              {best.formNotes.map((n) => (
                <p key={n}>· {n}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 font-display text-lg">Tactical problems</div>
        {players.length === 0 ? (
          <p className="text-sm text-muted">
            Evidence requires saved cards. No players have been created yet, so formation weaknesses cannot be scored.
          </p>
        ) : (
          <ul className="space-y-1 text-sm text-muted">
            {(best?.problems ?? ["No tactical problems flagged from current squad data."]).map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        )}
      </div>

      {best && players.length > 0 && (
        <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
          <div className="border-b border-line bg-elevated/40 px-4 py-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-accent">Tactical problem</div>
            <div className="font-display text-lg">Best available shape for this squad</div>
          </div>
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-line p-4 sm:border-r sm:border-b-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Why it is happening</div>
              <p className="mt-1 text-sm">{best.explanation}</p>
            </div>
            <div className="border-b border-line p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Evidence</div>
              <ul className="mt-1 space-y-1 text-sm text-muted">
                <li>Fit {best.fit}/100 from position suitability, form and effective rating.</li>
                <li>
                  Assigned {best.assignment.filter((a) => a.player).length} of {best.assignment.length} slots from saved cards.
                </li>
                {intel.strengths ? <li>Opponent strengths: {intel.strengths}</li> : <li>No opponent strengths logged.</li>}
              </ul>
            </div>
            <div className="border-b border-line p-4 sm:border-r sm:border-b-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Recommended change</div>
              <p className="mt-1 text-sm">Apply {best.formation} to the tactical board and refine slots if a specialist is missing.</p>
            </div>
            <div className="p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Expected effect</div>
              <p className="mt-1 text-sm text-muted">
                The XI reflects role fit, not raw OVR. Form shifts effective rating; base cards stay unchanged.
              </p>
              <Button className="mt-3" size="sm" onClick={() => apply(best)}>
                Apply to board
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-[14px] border border-line">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-elevated text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Formation</th>
              <th className="px-3 py-2 font-medium">Fit</th>
              <th className="px-3 py-2 font-medium">Attack</th>
              <th className="px-3 py-2 font-medium">Defence</th>
              <th className="px-3 py-2 font-medium">Possession</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr
                key={r.formation}
                className={cn("border-t border-line cursor-pointer hover:bg-elevated/60", open === r.formation && "bg-accent/5")}
                onClick={() => setOpen(open === r.formation ? null : r.formation)}
              >
                <td className="px-3 py-2 font-semibold">{r.formation}</td>
                <td className="px-3 py-2 tabular-nums text-accent">{r.fit}</td>
                <td className="px-3 py-2 tabular-nums">{r.attack}</td>
                <td className="px-3 py-2 tabular-nums">{r.defence}</td>
                <td className="px-3 py-2 tabular-nums">{r.possession}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && ranked.find((r) => r.formation === open) && (
        <div className="rounded-[14px] border border-line bg-surface p-3">
          {(() => {
            const r = ranked.find((x) => x.formation === open)!;
            return (
              <>
                <div className="mb-1 font-display text-lg">
                  {r.formation} — {r.fit}/100
                </div>
                <p className="mb-2 text-sm text-muted">{r.explanation}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase text-muted">Strengths</div>
                    {r.strengths.map((s) => (
                      <p key={s} className="text-sm text-muted">
                        · {s}
                      </p>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted">Weaknesses</div>
                    {r.weaknesses.map((s) => (
                      <p key={s} className="text-sm text-muted">
                        · {s}
                      </p>
                    ))}
                  </div>
                </div>
                <Button className="mt-3" onClick={() => apply(r)}>
                  Apply to board
                </Button>
              </>
            );
          })()}
        </div>
      )}
      {formatSize !== 11 && (
        <p className="text-xs text-subtle">Advisor is scoring every {formatSize}-a-side shape in the library.</p>
      )}
      <SizeNote size={formatSize} />
    </div>
  );
}

function SizeNote({ size }: { size: FormatSize }) {
  return (
    <p className="text-xs text-subtle">
      Switch format size in TACTIQ to rescore {size === 11 ? "7/8/9" : "other"}-a-side libraries.
    </p>
  );
}

export function SlotPicker({
  slot,
  players,
  onClose,
}: {
  slot: PitchSlot;
  players: Player[];
  onClose: () => void;
}) {
  const assignSlot = usePitchStore((s) => s.assignSlot);
  const slotMap = usePitchStore((s) => s.slotMap);
  const matches = usePitchStore((s) => s.matches);
  const used = new Set(Object.values(slotMap));
  return (
    <div className="p-4">
      <div className="mb-3 font-display text-xl">Place a {slot.pos}</div>
      <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto hq-scroll sm:grid-cols-3">
        {players.map((p) => (
          <button
            key={p.id}
            className="flex flex-col items-center"
            onClick={() => {
              assignSlot(slot.id, p.id);
              onClose();
            }}
          >
            <PlayerCard player={p} matches={matches} size="mini" dimmed={used.has(p.id) && slotMap[slot.id] !== p.id} />
            <span className="mt-1 text-[11px] text-muted">{p.position}</span>
          </button>
        ))}
      </div>
      <Button variant="ghost" className="mt-3" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
}