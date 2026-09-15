import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PitchSurface } from "./pitch-board";
import { PlayerCard } from "./player-card";
import { rankFormations, slotMapFromEval } from "@/lib/pitch/ai";
import { FORMAT_EMPHASIS, FORMAT_LIST, infoFor, layoutFormation, OPPONENT_DEFAULT, ratingsFor } from "@/lib/pitch/formations";
import { buildAdvantageSequence, buildDisadvantageSequence, buildPossessionMorph } from "@/lib/pitch/sequences";
import { usePitchStore, type FormatSize } from "@/lib/pitch/store";
import type { Player, PitchSlot } from "@/lib/pitch/types";
import { cn } from "@/lib/utils";

function playersMap(players: Player[]) {
  return Object.fromEntries(players.map((p) => [p.id, p]));
}

export function BoardView({
  players,
  onOpenPlayer,
  onPickForSlot,
}: {
  players: Player[];
  onOpenPlayer: (p: Player) => void;
  onPickForSlot: (slot: PitchSlot) => void;
}) {
  const formation = usePitchStore((s) => s.formation);
  const formatSize = usePitchStore((s) => s.formatSize);
  const slotMap = usePitchStore((s) => s.slotMap);
  const slotOverrides = usePitchStore((s) => s.slotOverrides);
  const setSlotOverride = usePitchStore((s) => s.setSlotOverride);
  const clearSlotOverrides = usePitchStore((s) => s.clearSlotOverrides);
  const swapSlots = usePitchStore((s) => s.swapSlots);
  const assignSlot = usePitchStore((s) => s.assignSlot);
  const setFormat = usePitchStore((s) => s.setFormat);
  const setSlotMap = usePitchStore((s) => s.setSlotMap);
  const matches = usePitchStore((s) => s.matches);
  const baseOwn = useMemo(() => layoutFormation(formation, "own"), [formation]);
  const own = useMemo(
    () =>
      baseOwn.map((s) => {
        const ov = slotOverrides[s.id];
        return ov ? { ...s, x: ov.x, y: ov.y, pos: ov.pos } : s;
      }),
    [baseOwn, slotOverrides],
  );
  const byId = useMemo(() => playersMap(players), [players]);
  const info = infoFor(formatSize, formation);
  const hasCustomLayout = Object.keys(slotOverrides).length > 0;

  // --- Bench -> slot placement ---
  // "Armed" bench player: tap them once, then tap any slot to place them there.
  const [armedPlayerId, setArmedPlayerId] = useState<string | null>(null);
  const benchDragRef = useRef<{ id: string; moved: boolean } | null>(null);
  const benchPlayers = players.filter((p) => !Object.values(slotMap).includes(p.id));

  useEffect(() => {
    // If the armed bench player just got placed some other way (or removed), unarm.
    if (armedPlayerId && !benchPlayers.some((p) => p.id === armedPlayerId)) {
      setArmedPlayerId(null);
    }
  }, [armedPlayerId, benchPlayers]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="rounded-[16px] border border-line bg-surface p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="font-display text-lg tracking-wide">
            {formatSize}-a-side · {formation}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex overflow-hidden rounded-[10px] border border-line">
              {([7, 8, 9, 11] as FormatSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFormat(s, FORMAT_LIST[s][0])}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-semibold",
                    formatSize === s ? "bg-accent text-accent-fg" : "text-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <select
              value={formation}
              onChange={(e) => setFormat(formatSize, e.target.value)}
              className="h-8 rounded-[10px] border border-line bg-elevated px-2 text-xs"
            >
              {FORMAT_LIST[formatSize].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={() => {
                const best = rankFormations(formatSize, players, matches)[0];
                if (!best) return;
                setFormat(best.size, best.formation);
                setSlotMap(slotMapFromEval(best));
              }}
            >
              Build best XI
            </Button>
            {hasCustomLayout && (
              <Button size="sm" variant="line" onClick={clearSlotOverrides}>
                Reset positions
              </Button>
            )}
          </div>
        </div>
        <PitchSurface
          own={own}
          playersById={byId}
          slotMap={slotMap}
          interactive
          cardSize="board"
          onSlotClick={(slot) => {
            if (armedPlayerId) {
              assignSlot(slot.id, armedPlayerId);
              setArmedPlayerId(null);
              return;
            }
            const pid = slotMap[slot.id];
            const p = pid ? byId[pid] : null;
            if (p) onOpenPlayer(p);
            else onPickForSlot(slot);
          }}
          onDropOnSlot={(a, b) => swapSlots(a, b)}
          onFreeMove={(slotId, x, y) => setSlotOverride(slotId, x, y)}
        />
        <p className="mt-2 text-xs text-muted">
          {armedPlayerId
            ? "Now tap a slot on the pitch to place them there."
            : "Drag a card onto another to swap, or onto open grass to reposition. Tap a bench player below, then tap a slot to bring them on."}
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Strengths</div>
          {info.adv.map((a) => (
            <p key={a} className="mb-1 text-sm text-muted">
              · {a}
            </p>
          ))}
          <div className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Weaknesses</div>
          {info.dis.map((a) => (
            <p key={a} className="mb-1 text-sm text-muted">
              · {a}
            </p>
          ))}
        </div>
        <div className="rounded-[14px] border border-line bg-surface p-3">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
            <span>Bench</span>
            {armedPlayerId && (
              <button
                onClick={() => setArmedPlayerId(null)}
                className="rounded-full border border-line px-2 py-0.5 text-[10px] normal-case text-muted"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {benchPlayers.length === 0 && (
              <div className="text-xs text-subtle">Every player is on the pitch.</div>
            )}
            {benchPlayers.map((p) => (
              <div
                key={p.id}
                style={{ touchAction: "none" }}
                className={cn(
                  "rounded-[10px]",
                  armedPlayerId === p.id && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
                )}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  benchDragRef.current = { id: p.id, moved: false };
                }}
                onPointerMove={(e) => {
                  const d = benchDragRef.current;
                  if (!d || d.id !== p.id) return;
                  d.moved = true;
                }}
                onPointerUp={(e) => {
                  const d = benchDragRef.current;
                  benchDragRef.current = null;
                  if (!d || d.id !== p.id) return;
                  if (!d.moved) {
                    // Plain tap — arm/disarm for tap-then-tap-a-slot placement.
                    setArmedPlayerId((cur) => (cur === p.id ? null : p.id));
                    return;
                  }
                  // Dragged straight onto a pitch slot — drop them there directly.
                  const el = document.elementFromPoint(e.clientX, e.clientY);
                  const slotEl = el?.closest("[data-slot-id]") as HTMLElement | null;
                  if (slotEl?.dataset.slotId) {
                    assignSlot(slotEl.dataset.slotId, p.id);
                    setArmedPlayerId(null);
                  }
                }}
              >
                <PlayerCard player={p} size="tiny" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimulateView({ players, onOpenPlayer }: { players: Player[]; onOpenPlayer: (p: Player) => void }) {
  const formation = usePitchStore((s) => s.formation);
  const formatSize = usePitchStore((s) => s.formatSize);
  const slotMap = usePitchStore((s) => s.slotMap);
  const setFormat = usePitchStore((s) => s.setFormat);
  const own = useMemo(() => layoutFormation(formation, "own"), [formation]);
  const opp = useMemo(() => layoutFormation(OPPONENT_DEFAULT[formatSize], "opp"), [formatSize]);
  const info = useMemo(() => infoFor(formatSize, formation), [formatSize, formation]);
  const ratings = useMemo(() => ratingsFor(formation), [formation]);
  const adv = useMemo(() => buildAdvantageSequence(own, opp, info), [own, opp, info]);
  const dis = useMemo(() => buildDisadvantageSequence(own, opp, info), [own, opp, info]);
  const [seq, setSeq] = useState<"advantage" | "disadvantage" | null>(null);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [lanes, setLanes] = useState(true);
  const [why, setWhy] = useState(false);
  const active = seq === "advantage" ? adv : seq === "disadvantage" ? dis : null;
  const current = active
    ? active[phase]
    : { own, opp, ball: { x: 50, y: 92 }, note: `Base ${formation} shape. Run Advantage or Disadvantage.` };

  useEffect(() => {
    if (!playing || !active) return;
    if (phase >= active.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setPhase((i) => Math.min(i + 1, active.length - 1)), 1500 / speed);
    return () => clearTimeout(t);
  }, [playing, phase, active, speed]);

  const byId = useMemo(() => playersMap(players), [players]);

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-line bg-surface p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="font-display text-lg">
            {formatSize}-a-side · {formation}
          </div>
          <div className="flex gap-2">
            <select
              value={formation}
              onChange={(e) => {
                setFormat(formatSize, e.target.value);
                setSeq(null);
                setPhase(0);
                setPlaying(false);
              }}
              className="h-8 rounded-[10px] border border-line bg-elevated px-2 text-xs"
            >
              {FORMAT_LIST[formatSize].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <button onClick={() => setLanes((v) => !v)} className="flex items-center gap-1 rounded-[8px] border border-line px-2 text-xs text-muted">
              {lanes ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />} lanes
            </button>
          </div>
        </div>
        <PitchSurface
          own={current.own}
          opp={current.opp}
          ball={current.ball}
          playersById={byId}
          slotMap={slotMap}
          showLanes={lanes}
          cardSize="tiny"
          onSlotClick={(s) => {
            const p = slotMap[s.id] ? byId[slotMap[s.id]] : null;
            if (p) onOpenPlayer(p);
          }}
        />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" variant="line" disabled={!active} onClick={() => { setPlaying(false); setPhase((i) => Math.max(0, i - 1)); }}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="sm" disabled={!active} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </Button>
          <Button size="sm" variant="line" disabled={!active} onClick={() => { setPlaying(false); setPhase((i) => Math.min((active?.length ?? 1) - 1, i + 1)); }}>
            <ChevronRight className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" disabled={!active} onClick={() => { setPhase(0); setPlaying(true); }}>
            <RotateCcw className="size-3.5" />
          </Button>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn("rounded-[8px] px-2 py-1 text-xs font-bold", speed === s ? "bg-accent text-accent-fg" : "text-muted")}
            >
              {s}×
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant={seq === "advantage" ? "primary" : "line"}
            onClick={() => {
              setSeq("advantage");
              setPhase(0);
              setPlaying(true);
            }}
          >
            <Zap className="size-4" /> Advantage
          </Button>
          <Button
            variant={seq === "disadvantage" ? "primary" : "line"}
            onClick={() => {
              setSeq("disadvantage");
              setPhase(0);
              setPlaying(true);
            }}
          >
            <ShieldAlert className="size-4" /> Disadvantage
          </Button>
          <Button variant={why ? "soft" : "ghost"} onClick={() => setWhy((v) => !v)}>
            <HelpCircle className="size-4" /> Why did they move?
          </Button>
        </div>
        <div className="mt-3 rounded-[12px] bg-elevated p-3 text-sm leading-relaxed text-muted">
          {active && (
            <div className="mb-1 text-[10px] uppercase tracking-wide text-subtle">
              Phase {phase + 1} / {active.length}
            </div>
          )}
          {why ? current.note : active ? current.note : `Select Advantage or Disadvantage to watch the ${formation} operate.`}
        </div>
      </div>
      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 font-display text-lg">Tactical dashboard — {formation}</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(ratings).map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-xs text-muted">
                {k} <span className="text-accent">{v}/5</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="h-full bg-accent" style={{ width: `${v * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[14px] border border-line bg-surface p-3">
        <div className="mb-2 font-display text-lg">{formatSize}-a-side emphasis</div>
        <div className="flex flex-wrap gap-1.5">
          {FORMAT_EMPHASIS[formatSize].map((t) => (
            <span key={t} className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] text-accent">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PossessionView({ players }: { players: Player[] }) {
  const formation = usePitchStore((s) => s.formation);
  const formatSize = usePitchStore((s) => s.formatSize);
  const slotMap = usePitchStore((s) => s.slotMap);
  const own = useMemo(() => layoutFormation(formation, "own"), [formation]);
  const opp = useMemo(() => layoutFormation(OPPONENT_DEFAULT[formatSize], "opp"), [formatSize]);
  const morph = useMemo(() => buildPossessionMorph(own), [own]);
  const [shape, setShape] = useState<"out" | "base" | "in">("base");
  const current = shape === "base" ? morph.base : shape === "in" ? morph.inPoss : morph.outPoss;
  const byId = useMemo(() => playersMap(players), [players]);
  const isFlagship = formatSize === 11 && formation === "4-3-3";
  const shapes = [
    {
      id: "out" as const,
      label: isFlagship ? "Out of possession (4-1-4-1)" : "Out of possession",
      desc: "The team compresses into a deeper, narrower block. Forwards drop into midfield lines to deny central passing lanes and force play wide.",
    },
    {
      id: "base" as const,
      label: `Base shape (${formation})`,
      desc: "The reference formation the team lines up in before the ball dictates any adjustment.",
    },
    {
      id: "in" as const,
      label: isFlagship ? "In possession (3-2-4-1)" : "In possession",
      desc: "Wide defenders push high to become auxiliary wingers, one central defender or pivot drops to form a back three for build-up, and the front line stretches the opposition.",
    },
  ];
  return (
    <div className="rounded-[16px] border border-line bg-surface p-3">
      <div className="mb-1 font-display text-lg">In possession vs out of possession</div>
      <p className="mb-3 text-sm text-muted">
        Modern teams rarely hold one static shape. Watch how the {formation} reshapes depending on who has the ball.
      </p>
      <PitchSurface
        own={current}
        opp={opp}
        ball={{ x: 50, y: shape === "in" ? 55 : shape === "out" ? 88 : 92 }}
        playersById={byId}
        slotMap={slotMap}
        cardSize="tiny"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {shapes.map((s) => (
          <Button key={s.id} variant={shape === s.id ? "primary" : "line"} onClick={() => setShape(s.id)}>
            {s.label}
          </Button>
        ))}
      </div>
      <div className="mt-3 rounded-[12px] bg-elevated p-3 text-sm text-muted">{shapes.find((s) => s.id === shape)?.desc}</div>
    </div>
  );
}

export function CompareView() {
  const formatSize = usePitchStore((s) => s.formatSize);
  const compareA = usePitchStore((s) => s.compareA);
  const compareB = usePitchStore((s) => s.compareB);
  const setCompare = usePitchStore((s) => s.setCompare);
  const a = FORMAT_LIST[formatSize].includes(compareA) ? compareA : FORMAT_LIST[formatSize][0];
  const b = FORMAT_LIST[formatSize].includes(compareB) ? compareB : FORMAT_LIST[formatSize][1] ?? FORMAT_LIST[formatSize][0];
  const ownA = useMemo(() => layoutFormation(a, "own"), [a]);
  const ownB = useMemo(() => layoutFormation(b, "own"), [b]);
  const ratingsA = ratingsFor(a);
  const ratingsB = ratingsFor(b);
  const infoA = infoFor(formatSize, a);
  const infoB = infoFor(formatSize, b);
  return (
    <div className="rounded-[16px] border border-line bg-surface p-3">
      <div className="mb-2 font-display text-lg">
        {a} vs {b}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <select value={a} onChange={(e) => setCompare(e.target.value, b)} className="mb-2 h-9 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm">
            {FORMAT_LIST[formatSize].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <PitchSurface own={ownA} playersById={{}} slotMap={{}} cardSize="tiny" />
        </div>
        <div>
          <select value={b} onChange={(e) => setCompare(a, e.target.value)} className="mb-2 h-9 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm">
            {FORMAT_LIST[formatSize].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <PitchSurface own={ownB} playersById={{}} slotMap={{}} cardSize="tiny" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {Object.keys(ratingsA).map((k) => (
          <div key={k}>
            <div className="mb-1 text-xs text-muted">{k}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="ml-auto h-full bg-accent" style={{ width: `${ratingsA[k as keyof typeof ratingsA] * 20}%` }} />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                <div className="h-full bg-pitch" style={{ width: `${ratingsB[k as keyof typeof ratingsB] * 20}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs uppercase text-muted">{a} weakness</div>
          <p className="text-muted">· {infoA.dis[0]}</p>
        </div>
        <div>
          <div className="text-xs uppercase text-muted">{b} weakness</div>
          <p className="text-muted">· {infoB.dis[0]}</p>
        </div>
      </div>
    </div>
  );
}