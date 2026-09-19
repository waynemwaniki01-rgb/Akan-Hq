import { useMemo, useRef, useState } from "react";
import { EmptySlotCard, PlayerCard } from "./player-card";
import { layoutFormation } from "@/lib/pitch/formations";
import type { PitchSlot, Player } from "@/lib/pitch/types";
import { usePitchStore } from "@/lib/pitch/store";
import { cn } from "@/lib/utils";

/* ── Pitch markings ──────────────────────────────────────────────────────
   Drawn in a 0..100 x 0..100 space with preserveAspectRatio="none" so the
   lines always meet the edges of the board no matter its real aspect.
   vectorEffect keeps stroke weight even after the non-uniform scale.       */
function Markings() {
  const line = "rgba(255,255,255,0.30)";
  const faint = "rgba(255,255,255,0.18)";
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="pitchTurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3a24" />
          <stop offset="50%" stopColor="#11492c" />
          <stop offset="100%" stopColor="#0c3220" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="100" height="100" fill="url(#pitchTurf)" />

      {/* mown stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * 10}
          width="100"
          height="10"
          fill={i % 2 ? "rgba(255,255,255,0.028)" : "transparent"}
        />
      ))}

      <g
        fill="none"
        stroke={line}
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      >
        <rect x="2" y="2" width="96" height="96" />
        <line x1="2" y1="50" x2="98" y2="50" />
        <circle cx="50" cy="50" r="9" />

        {/* our box (bottom) */}
        <rect x="21" y="83" width="58" height="15" />
        <rect x="36" y="93" width="28" height="5" />
        <path d="M 38.5 83 A 12 9 0 0 1 61.5 83" />

        {/* their box (top) */}
        <rect x="21" y="2" width="58" height="15" />
        <rect x="36" y="2" width="28" height="5" />
        <path d="M 38.5 17 A 12 9 0 0 0 61.5 17" />

        {/* corner arcs */}
        <path d="M 2 5 A 3 3 0 0 0 5 2" />
        <path d="M 95 2 A 3 3 0 0 0 98 5" />
        <path d="M 98 95 A 3 3 0 0 0 95 98" />
        <path d="M 5 98 A 3 3 0 0 0 2 95" />
      </g>

      <circle cx="50" cy="50" r="0.6" fill={line} />
      <circle cx="50" cy="88" r="0.5" fill={faint} />
      <circle cx="50" cy="12" r="0.5" fill={faint} />
    </svg>
  );
}

/* ── Passing lanes ───────────────────────────────────────────────────────
   Drawn in the same 0..100 space as the markings so the geometry is
   actually correct (the old div+rotate version measured length as a % of
   width while placing it across a taller box, which is why lines
   overshot). Only the nearest few options are shown — a line to every
   player is noise, not information.                                       */
function Lanes({
  own,
  ball,
}: {
  own: PitchSlot[];
  ball: { x: number; y: number };
}) {
  const targets = useMemo(() => {
    return own
      .filter((s) => s.id !== "gk")
      .map((s) => ({ s, d: Math.hypot(s.x - ball.x, s.y - ball.y) }))
      .filter((t) => t.d > 4)
      .sort((a, b) => a.d - b.d)
      .slice(0, 4);
  }, [own, ball]);

  const max = targets.length ? targets[targets.length - 1].d : 1;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden
    >
      {targets.map(({ s, d }) => (
        <line
          key={"lane" + s.id}
          x1={ball.x}
          y1={ball.y}
          x2={s.x}
          y2={s.y}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1"
          strokeDasharray="3 3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.15 + 0.45 * (1 - d / (max || 1))}
        />
      ))}
    </svg>
  );
}

/* ── Tactical token ──────────────────────────────────────────────────────
   Replaces the shrunken PlayerCard used at tiny size. A tactics board is
   read at a glance: a shirt number, a role tag and a surname legible at
   full-board zoom beat a 20px illegible card every time.                  */
function Token({
  pos,
  player,
  side,
  onClick,
}: {
  pos: string;
  player?: Player;
  side: "own" | "opp";
  onClick?: () => void;
}) {
  const label = player?.number?.trim() || pos;
  const surname = player ? player.name.trim().split(/\s+/).slice(-1)[0] : null;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "flex flex-col items-center gap-[3px] select-none",
        onClick && "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-bold tabular-nums",
          "size-[clamp(20px,4.6cqw,30px)] text-[clamp(9px,1.9cqw,12px)]",
          "shadow-[0_2px_6px_rgba(0,0,0,0.45)] ring-1",
          side === "own"
            ? "bg-accent text-accent-fg ring-white/50"
            : "bg-[#1a1d22] text-white/85 ring-white/25",
        )}
      >
        {label}
      </div>
      <span
        className={cn(
          "max-w-[8ch] truncate rounded-[3px] px-1 text-center font-semibold uppercase leading-tight",
          "text-[clamp(6px,1.35cqw,9px)] tracking-wide",
          side === "own"
            ? "bg-black/55 text-white/90"
            : "bg-black/45 text-white/60",
        )}
      >
        {surname ?? pos}
      </span>
    </div>
  );
}

export function PitchSurface({
  own,
  opp = [],
  ball,
  playersById,
  slotMap,
  showLanes,
  onSlotClick,
  onDropOnSlot,
  onFreeMove,
  interactive,
  cardSize = "tiny",
  selectedSlotId,
}: {
  own: PitchSlot[];
  opp?: PitchSlot[];
  ball?: { x: number; y: number };
  playersById: Record<string, Player>;
  slotMap: Record<string, string>;
  showLanes?: boolean;
  onSlotClick?: (slot: PitchSlot) => void;
  /** Card dropped directly onto another occupied slot — swaps the two players. */
  onDropOnSlot?: (fromId: string, toId: string) => void;
  /** Card dropped onto open grass — repositions that slot freely, eFootball-style. */
  onFreeMove?: (slotId: string, xPct: number, yPct: number) => void;
  interactive?: boolean;
  /** "board" = full player cards (Board view). "tiny" = tactical tokens. */
  cardSize?: "tiny" | "board";
  selectedSlotId?: string | null;
}) {
  const matches = usePitchStore((s) => s.matches);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const justDraggedRef = useRef(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);

  /** Tactical mode: tokens, tighter pitch, capped height so it never towers. */
  const tactical = cardSize === "tiny";
  const ballSlot = ball ?? { x: 50, y: 92 };

  function pointToPct(clientX: number, clientY: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 50 };
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.min(97, Math.max(3, x)), y: Math.min(97, Math.max(3, y)) };
  }

  return (
    <div className={cn("w-full", tactical && "flex justify-center")}>
      <div
        ref={boardRef}
        className={cn(
          "pitch-board relative overflow-hidden rounded-[14px]",
          "ring-1 ring-white/10 shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]",
          tactical ? "w-auto" : "w-full",
        )}
        style={{
          // containerType lets token sizes scale with the board, not the viewport.
          containerType: "inline-size",
          aspectRatio: tactical ? "68 / 104" : "0.68",
          ...(tactical
            ? { height: "min(66vh, 620px)", maxWidth: "100%" }
            : null),
          touchAction: interactive ? "none" : undefined,
        }}
      >
        <Markings />
        {showLanes && <Lanes own={own} ball={ballSlot} />}

        {opp.map((s) => (
          <div
            key={"o" + s.id}
            className="pointer-events-none absolute z-10"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <Token pos={s.pos} side="opp" />
          </div>
        ))}

        {own.map((s) => {
          const pid = slotMap[s.id];
          const player = pid ? playersById[pid] : undefined;
          const isDragging = drag?.id === s.id;
          const left = isDragging ? drag!.x : s.x;
          const top = isDragging ? drag!.y : s.y;
          const isSelected = selectedSlotId === s.id;

          return (
            <div
              key={s.id}
              data-slot-id={s.id}
              className={cn(
                "tq-card absolute z-20 transition-[left,top] duration-500 ease-out",
                s.id === "gk" && "tq-card-gk",
                isDragging && "z-30 scale-105 cursor-grabbing transition-none",
                interactive && player && !isDragging && "cursor-grab",
                isSelected && "rounded-full ring-2 ring-accent ring-offset-2 ring-offset-surface",
              )}
              style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%,-50%)" }}
              onPointerDown={(e) => {
                if (!interactive || !player) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                const p = pointToPct(e.clientX, e.clientY);
                dragRef.current = { id: s.id, startX: p.x, startY: p.y, moved: false };
                setDrag({ id: s.id, x: p.x, y: p.y });
              }}
              onPointerMove={(e) => {
                const d = dragRef.current;
                if (!d || d.id !== s.id) return;
                const p = pointToPct(e.clientX, e.clientY);
                if (Math.hypot(p.x - d.startX, p.y - d.startY) > 1.5) d.moved = true;
                setDrag({ id: s.id, x: p.x, y: p.y });
              }}
              onPointerUp={(e) => {
                const d = dragRef.current;
                if (!d || d.id !== s.id) return;
                const p = pointToPct(e.clientX, e.clientY);
                setDrag(null);
                dragRef.current = null;
                if (!d.moved) return; // plain tap — let onClick handle it
                justDraggedRef.current = true;
                const el = document.elementFromPoint(e.clientX, e.clientY);
                const targetEl = el?.closest("[data-slot-id]") as HTMLElement | null;
                const targetId = targetEl?.dataset.slotId;
                if (targetId && targetId !== s.id) onDropOnSlot?.(s.id, targetId);
                else onFreeMove?.(s.id, p.x, p.y);
              }}
            >
              {tactical ? (
                <Token
                  pos={s.pos}
                  player={player}
                  side="own"
                  onClick={() => {
                    if (justDraggedRef.current) {
                      justDraggedRef.current = false;
                      return;
                    }
                    onSlotClick?.(s);
                  }}
                />
              ) : player ? (
                <PlayerCard
                  player={player}
                  matches={matches}
                  size="board"
                  slotPosition={s.pos}
                  onClick={() => {
                    if (justDraggedRef.current) {
                      justDraggedRef.current = false;
                      return;
                    }
                    onSlotClick?.(s);
                  }}
                />
              ) : (
                <EmptySlotCard pos={s.pos} onClick={() => onSlotClick?.(s)} size="board" />
              )}
            </div>
          );
        })}

        {ball && (
          <div
            className="pointer-events-none absolute z-30 transition-[left,top] duration-500 ease-out"
            style={{ left: `${ball.x}%`, top: `${ball.y}%`, transform: "translate(-50%,-50%)" }}
          >
            <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-white/25" />
            <span className="relative block size-[clamp(7px,1.5cqw,11px)] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          </div>
        )}
      </div>
    </div>
  );
}

export function useBoardSlots(formation: string, side: "own" | "opp" = "own") {
  return useMemo(() => layoutFormation(formation, side), [formation, side]);
}