import { useMemo, useRef, useState } from "react";
import { EmptySlotCard, PlayerCard } from "./player-card";
import { layoutFormation } from "@/lib/pitch/formations";
import type { PitchSlot, Player } from "@/lib/pitch/types";
import { usePitchStore } from "@/lib/pitch/store";
import { cn } from "@/lib/utils";

function Markings() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
      <rect x="1.5" y="1.5" width="97" height="97" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <line x1="1.5" y1="50" x2="98.5" y2="50" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <circle cx="50" cy="50" r="0.7" fill="rgba(255,255,255,0.35)" />
      <rect x="22" y="1.5" width="56" height="14" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <rect x="22" y="84.5" width="56" height="14" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <rect x="36" y="1.5" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
      <rect x="36" y="92.5" width="28" height="6" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
    </svg>
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
  cardSize?: "tiny" | "board";
  /** The slot currently "selected" (via click-to-swap) — shown with a highlight ring. */
  selectedSlotId?: string | null;
}) {
  const matches = usePitchStore((s) => s.matches);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const justDraggedRef = useRef(false);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);

  const ballSlot = ball ?? { x: 50, y: 92 };

  function pointToPct(clientX: number, clientY: number) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 50 };
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.min(97, Math.max(3, x)), y: Math.min(97, Math.max(3, y)) };
  }

  return (
    <div
      ref={boardRef}
      className="pitch-board relative w-full overflow-hidden rounded-[14px]"
      style={{ aspectRatio: "0.68", touchAction: interactive ? "none" : undefined }}
    >
      <Markings />
      {showLanes &&
        own
          .filter((s) => s.id !== "gk")
          .map((s) => (
            <div
              key={"lane" + s.id}
              className="pointer-events-none absolute left-0 top-0 h-px origin-left bg-accent/25"
              style={{
                width: `${Math.hypot(s.x - ballSlot.x, s.y - ballSlot.y)}%`,
                left: `${ballSlot.x}%`,
                top: `${ballSlot.y}%`,
                transform: `rotate(${Math.atan2(s.y - ballSlot.y, s.x - ballSlot.x)}rad)`,
              }}
            />
          ))}

      {opp.map((s) => (
        <div
          key={"o" + s.id}
          className="tq-dot pointer-events-none absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)" }}
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-fg text-[8px] font-bold text-bg">
            {s.pos}
          </div>
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
              "tq-card absolute z-10",
              s.id === "gk" && "tq-card-gk",
              isDragging && "z-30 scale-105 cursor-grabbing",
              interactive && player && !isDragging && "cursor-grab",
              isSelected && "z-20 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-surface",
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
              if (!d.moved) return; // treat as a plain tap — let onClick handle selection/swap
              justDraggedRef.current = true;
              const el = document.elementFromPoint(e.clientX, e.clientY);
              const targetEl = el?.closest("[data-slot-id]") as HTMLElement | null;
              const targetId = targetEl?.dataset.slotId;
              if (targetId && targetId !== s.id) {
                onDropOnSlot?.(s.id, targetId);
              } else {
                onFreeMove?.(s.id, p.x, p.y);
              }
            }}
          >
            {player ? (
              <PlayerCard
                player={player}
                matches={matches}
                size={cardSize}
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
              <EmptySlotCard pos={s.pos} onClick={() => onSlotClick?.(s)} size={cardSize} />
            )}
          </div>
        );
      })}

      {ball && (
        <div
          className="tq-ball pointer-events-none absolute z-20 size-2.5 rounded-full bg-white shadow"
          style={{ left: `${ball.x}%`, top: `${ball.y}%`, transform: "translate(-50%,-50%)" }}
        />
      )}
    </div>
  );
}

export function useBoardSlots(formation: string, side: "own" | "opp" = "own") {
  return useMemo(() => layoutFormation(formation, side), [formation, side]);
}