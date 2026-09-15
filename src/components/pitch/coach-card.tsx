import { useEffect, useId, useState, type CSSProperties } from "react";
import { cn, initials } from "@/lib/utils";
import type { Coach } from "@/lib/pitch/types";
import {
  TIER_META,
  mergeCardStyle,
  styleToCssVars,
  type CardTier,
} from "@/lib/pitch/card-system";

function CoachSilhouette({ name }: { name: string }) {
  const ini = initials(name);
  const gid = useId().replace(/:/g, "");
  return (
    <div className="pcard-sil" aria-hidden>
      <svg viewBox="0 0 120 180" className="pcard-sil-svg">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pc-accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--pc-edge)" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path d="M60 10 L74 22 L72 44 L48 44 L46 22 Z" fill={`url(#${gid})`} stroke="var(--pc-accent)" strokeWidth="1.2" />
        <path d="M28 58 L52 52 L68 52 L92 58 L86 118 L60 128 L34 118 Z" fill={`url(#${gid})`} stroke="var(--pc-accent)" strokeWidth="1.1" />
        <path d="M40 118 L48 170 L58 170 L56 124 Z" fill={`url(#${gid})`} />
        <path d="M80 118 L72 170 L62 170 L64 124 Z" fill={`url(#${gid})`} />
      </svg>
      <span className="pcard-sil-ini">{ini}</span>
    </div>
  );
}

function CoachPhoto({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return <CoachSilhouette name={name} />;
  return <img src={src} alt={name} className="pcard-photo" draggable={false} onError={() => setFailed(true)} />;
}

/**
 * Resolve a coach's cardDesign to a guaranteed-valid CardTier key.
 * Defensive against: missing cardDesign (legacy coaches saved before this
 * field existed), the literal "auto" value, or any value that somehow
 * doesn't exist in TIER_META. Always falls back to "core" rather than
 * ever returning undefined — this is what was crashing on meta.layers.
 */
function resolveTier(cardDesign: unknown): CardTier {
  if (
    cardDesign &&
    typeof cardDesign === "string" &&
    cardDesign !== "auto" &&
    TIER_META[cardDesign as CardTier]
  ) {
    return cardDesign as CardTier;
  }
  return "core";
}

export function CoachCard({
  coach,
  size = "full",
  onClick,
  className,
}: {
  coach: Coach;
  size?: "full" | "mini" | "board" | "tiny";
  onClick?: () => void;
  className?: string;
}) {
  const compact = size === "tiny" || size === "board";
  const style = mergeCardStyle(coach.cardStyle);
  const tier = resolveTier(coach.cardDesign);
  const meta = TIER_META[tier];
  const cssVars = styleToCssVars(style) as CSSProperties;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      data-tier={tier}
      data-layers={meta.layers}
      style={cssVars}
      className={cn(
        "pcard pcard-elite",
        `pcard-${tier}`,
        `pcard-sz-${size}`,
        onClick && "is-clickable",
        style.photoFrame === "full-body" && "pcard-frame-full-body",
        className,
      )}
    >
      <div className="pcard-stage">
        <div className="pcard-glow" aria-hidden />
        <div className="pcard-chassis" />
        <div className="pcard-brackets" aria-hidden />
        <div
          className="pcard-photo-wrap"
          style={{
            transform: `translate(${style.photoX}%, ${style.photoY}%) rotate(${style.photoRotate}deg) scale(${style.photoScale})`,
            filter: `brightness(${style.photoBrightness}) contrast(${style.photoContrast}) saturate(${style.photoSaturate}) blur(${style.photoBlur}px)`,
            opacity: style.photoOpacity,
          }}
        >
          <CoachPhoto src={coach.photo} name={coach.name} />
          <div className="pcard-photo-fade" />
        </div>
        <div className="pcard-shine" aria-hidden />
        <div className="pcard-hud">
          <div className="pcard-top">
            <div className="pcard-ovr-block">
              <span className="pcard-kicker">ROLE</span>
              <span className="pcard-pos" style={{ fontSize: compact ? "8px" : "13px" }}>
                {coach.role.toUpperCase()}
              </span>
            </div>
          </div>
          {compact ? (
            <div className="pcard-board-name">{coach.name}</div>
          ) : (
            <div className="pcard-bottom">
              <div className="pcard-nameplate">
                <div className="pcard-name">{coach.name}</div>
                <div className="pcard-meta">
                  <span>{coach.team || "AKAN HQ"}</span>
                </div>
              </div>
              <div className="mt-2 space-y-1 px-1 text-center text-[10px] text-muted">
                <div className="truncate">{coach.email}</div>
                <div>{coach.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}