import { useEffect, useId, useState, type CSSProperties } from "react";
import {
  RotateCw, ArrowUpRight, Target, Wand2, Sparkles, Zap, Rocket, Flame, Crosshair, Shuffle,
  Send, Lightbulb, Navigation, Radio, Repeat, Wind,
  Feather, ShieldCheck, Gauge, Compass, Wand,
  Mountain, Eye, Square, Radar, Move, Slash,
  Dumbbell, ShieldAlert, MoveDiagonal, TrendingUp, Infinity as InfinityIcon,
  Hand, Shield, Ruler, Plane, Footprints, Activity, Flag,
  type LucideIcon,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { derivePlayer, isGoalkeeper, roleAdjustedRating } from "@/lib/pitch/ratings";
import { SIX_KEYS, GK_KEYS, SIX_LABELS, GK_LABELS, type Match, type Player, type PositionCode } from "@/lib/pitch/types";
import {
  TIER_META,
  lastName,
  mergeCardStyle,
  styleToCssVars,
  type CardSize,
  type CardTier,
} from "@/lib/pitch/card-system";
import { playStyleById } from "@/lib/pitch/playstyles";
import { usePitchStore } from "@/lib/pitch/store";

export type { CardSize };

type Stat = { k: string; label: string; v: number };

/**
 * Every PlayStyle id maps to its OWN icon here — never shared within a
 * category — so two styles never look identical just because they share
 * a category.
 */
const PLAYSTYLE_ICONS: Record<string, LucideIcon> = {
  acrobatic: RotateCw,
  chip_shot: ArrowUpRight,
  dead_ball: Target,
  finesse_shot: Wand2,
  gamechanger: Sparkles,
  low_driven_shot: Zap,
  power_shot: Rocket,
  power_header: Flame,
  precision_header: Crosshair,
  trivela: Shuffle,

  incisive_pass: Send,
  inventive: Lightbulb,
  long_ball_pass: Navigation,
  pinged_pass: Radio,
  tiki_taka: Repeat,
  whipped_pass: Wind,

  first_touch: Feather,
  press_proven: ShieldCheck,
  rapid: Gauge,
  technical: Compass,
  trickster: Wand,

  aerial_fortress: Mountain,
  anticipate: Eye,
  block: Square,
  intercept: Radar,
  jockey: Move,
  slide_tackle: Slash,

  bruiser: Dumbbell,
  enforcer: ShieldAlert,
  long_throw: MoveDiagonal,
  quick_step: TrendingUp,
  relentless: InfinityIcon,

  cross_claimer: Hand,
  deflector: Shield,
  far_reach: Ruler,
  far_throw: Plane,
  footwork: Footprints,
  quick_reflexes: Activity,
  rush_out: Flag,
};

/**
 * The six real GK PlayStyles in FC 26. Used to keep GK cards showing
 * only goalkeeper-relevant styles and outfield cards never showing GK
 * styles, even if bad/legacy data has the wrong ones attached.
 *
 * NOTE: this only filters what's *displayed*. Deciding which of these
 * six a given GK archetype (Traditional / Sweeper Keeper / Ball-Playing)
 * gets assigned happens wherever players are created/edited — that
 * logic isn't in this file, so wire the archetype rules there.
 */
const GK_PLAYSTYLE_IDS = new Set([
  "far_reach",
  "footwork",
  "rush_out",
  "cross_claimer",
  "deflector",
  "far_throw",
]);

/**
 * Maps a `cardStyle.backgroundPattern` value to the CSS class that
 * renders it. "grid" keeps the existing look; the others are new
 * textures defined in styles.css. Requires adding a `backgroundPattern`
 * field to your CardStyle type/mergeCardStyle defaults for the editor
 * UI to actually drive this — until then it just falls back to "grid".
 */
const PATTERN_CLASS: Record<string, string> = {
  grid: "ultimate-grid",
  dots: "ultimate-pattern-dots",
  diagonal: "ultimate-pattern-diagonal",
  hex: "ultimate-pattern-hex",
  none: "",
};

/**
 * When a card is rendered in a pitch slot (`slotPosition` provided) and
 * that slot's position differs from the player's real position, the
 * displayed OVR drops using the existing suitability/affinity model in
 * ratings.ts (roleAdjustedRating) instead of the player's normal OVR.
 * This is purely a DISPLAY adjustment for that slot — the player's saved
 * card, base stats, and OVR everywhere else (squad list, profile, etc.)
 * are completely untouched.
 */
function useCardModel(player: Player, matches: Match[], slotPosition?: PositionCode) {
  const d = derivePlayer(player, matches);
  const gk = isGoalkeeper(player.position) && player.gkCurrent;
  const stats: Stat[] = gk
    ? GK_KEYS.map((k) => ({ k, label: GK_LABELS[k], v: player.gkCurrent![k] }))
    : SIX_KEYS.map((k) => ({ k, label: SIX_LABELS[k], v: player.currentSix[k] }));
  const tier = d.design as CardTier;

  const isOutOfPosition = Boolean(
    slotPosition && !isGoalkeeper(player.position) && slotPosition !== player.position && slotPosition !== "GK",
  );
  const slotOvr = isOutOfPosition && slotPosition ? roleAdjustedRating(player, slotPosition) : d.ovr;

  return { d, stats, tier, meta: TIER_META[tier], slotOvr, isOutOfPosition };
}

function TacticalSilhouette({ name }: { name: string }) {
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
        <path
          d="M60 10 L74 22 L72 44 L48 44 L46 22 Z"
          fill={`url(#${gid})`}
          stroke="var(--pc-accent)"
          strokeWidth="1.2"
        />
        <path d="M54 44 L66 44 L64 54 L56 54 Z" fill="var(--pc-accent)" opacity="0.45" />
        <path
          d="M28 58 L52 52 L68 52 L92 58 L86 118 L60 128 L34 118 Z"
          fill={`url(#${gid})`}
          stroke="var(--pc-accent)"
          strokeWidth="1.1"
        />
        <path d="M28 58 L18 92 L32 96 L40 70 Z" fill="var(--pc-edge)" opacity="0.55" />
        <path d="M92 58 L102 92 L88 96 L80 70 Z" fill="var(--pc-edge)" opacity="0.55" />
        <path d="M40 118 L48 170 L58 170 L56 124 Z" fill={`url(#${gid})`} />
        <path d="M80 118 L72 170 L62 170 L64 124 Z" fill={`url(#${gid})`} />
        <path d="M36 72 H84" stroke="var(--pc-accent)" strokeWidth="0.6" opacity="0.5" />
        <path d="M38 88 H82" stroke="var(--pc-accent)" strokeWidth="0.6" opacity="0.35" />
        <path d="M42 104 H78" stroke="var(--pc-accent)" strokeWidth="0.6" opacity="0.25" />
      </svg>
      <span className="pcard-sil-ini">{ini}</span>
    </div>
  );
}

function CardPhoto({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);
  if (!src || failed) return <TacticalSilhouette name={name} />;
  return <img src={src} alt={name} className="pcard-photo" draggable={false} onError={() => setFailed(true)} />;
}

function TacticalBackdrop() {
  return (
    <svg className="pcard-tactical" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden>
      <rect x="8" y="6" width="84" height="148" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.35" />
      <line x1="8" y1="80" x2="92" y2="80" stroke="currentColor" strokeWidth="0.3" opacity="0.28" />
      <circle cx="50" cy="80" r="11" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.28" />
      <rect x="28" y="6" width="44" height="16" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.22" />
      <path d="M18 150 L50 96 L82 150" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.22" />
      <path d="M50 96 L50 54" stroke="currentColor" strokeWidth="0.35" opacity="0.2" />
    </svg>
  );
}

function ChassisLayers({ tier, rich }: { tier: CardTier; rich: boolean }) {
  const layers = TIER_META[tier].layers;
  if (!rich) return null;
  return (
    <>
      {layers >= 2 && <div className="pcard-ticks" aria-hidden />}
      {layers >= 3 && <div className="pcard-rail" aria-hidden />}
      {layers >= 4 && <div className="pcard-orbit" aria-hidden />}
      {layers >= 5 && <div className="pcard-filigree" aria-hidden />}
      {layers >= 6 && <div className="pcard-slash" aria-hidden />}
    </>
  );
}

function CardStats({ stats, compact }: { stats: Stat[]; compact: boolean }) {
  return (
    <div className={cn("ultimate-stats", compact && "is-compact")}>
      {stats.map((stat) => (
        <div key={stat.k} className="ultimate-stat">
          <span className="ultimate-stat-label">{stat.label}</span>
          <span className="ultimate-stat-line" />
          <strong>{stat.v}</strong>
        </div>
      ))}
    </div>
  );
}

/**
 * Vertical sidebar of PlayStyle tiles on the card's right edge. Now
 * occupies the upper-right slot that used to hold the tier/"AKAN HQ"
 * vertical text (see PlayerCard — that label was removed), so it runs
 * from just under the top edge down to clearance above the stat grid.
 * Rendered as a sibling of .ultimate-content (not a grid row inside
 * it), so it never competes with the header/name/stats layout.
 */
function PlayStyleBadges({
  playStyles,
  playStylesPlus,
  isGK,
}: {
  playStyles: string[];
  playStylesPlus: string[];
  isGK: boolean;
}) {
  const rawIds = Array.from(new Set([...(playStyles ?? []), ...(playStylesPlus ?? [])]));
  const ids = isGK
    ? rawIds.filter((id) => GK_PLAYSTYLE_IDS.has(id))
    : rawIds.filter((id) => !GK_PLAYSTYLE_IDS.has(id));
  if (ids.length === 0) return null;
  const shown = ids.slice(0, 4);
  const overflow = ids.length - shown.length;

  return (
    <div className="ultimate-playstyles-side" aria-label="PlayStyles">
      {shown.map((id) => {
        const def = playStyleById(id);
        if (!def) return null;
        const isPlus = playStylesPlus.includes(id);
        const Icon = PLAYSTYLE_ICONS[id];
        return (
          <span
            key={id}
            title={`${def.name}${isPlus ? " +" : ""} — ${isPlus ? def.effectPlus : def.effect}`}
            className={cn("ultimate-playstyle-badge", isPlus ? "is-plus" : "is-standard")}
          >
            {Icon && <Icon className="ultimate-playstyle-icon" />}
          </span>
        );
      })}
      {overflow > 0 && <span className="ultimate-playstyle-more">+{overflow}</span>}
      <span className="ultimate-playstyles-label">PLAYSTYLES</span>
    </div>
  );
}

function sizeClass(size: CardSize) {
  return `pcard-sz-${size}`;
}

export function PlayerCard({
  player,
  matches = [],
  size = "full",
  className,
  onClick,
  selected,
  dimmed,
  slotPosition,
}: {
  player: Player;
  matches?: Match[];
  size?: CardSize;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  /** The position of the pitch slot this card is currently placed in, if any. */
  slotPosition?: PositionCode;
}) {
  const { d, stats, tier, meta, slotOvr, isOutOfPosition } = useCardModel(player, matches, slotPosition);
  const reducedMotion = usePitchStore((s) => s.reducedMotion);
  const rich = size === "full" || size === "profile" || size === "mini";
  const compact = size === "tiny" || size === "board";
  const style = mergeCardStyle(player.cardStyle);
  const displayName =
    style.nameCase === "title"
      ? player.name.trim().split(/\s+/).slice(-1)[0] || player.name
      : lastName(player.name);
  const formLabel = d.form === null ? "-" : d.form.toFixed(1);
  const cssVars = styleToCssVars(style) as CSSProperties;
  const auraTokens = [d.onForm && "form", player.captain && "captain"].filter(Boolean) as string[];
  const auraAttr = auraTokens.length ? auraTokens.join(" ") : undefined;
  const hasPlayStyles = (player.playStyles?.length ?? 0) + (player.playStylesPlus?.length ?? 0) > 0;

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
      data-tier={tier}
      data-layers={meta.layers}
      data-aura={auraAttr}
      data-out-of-position={isOutOfPosition || undefined}
      title={isOutOfPosition ? `Out of position at ${slotPosition} — rating adjusted from ${d.ovr} to ${slotOvr}` : undefined}
      style={cssVars}
      className={cn(
        "pcard ultimate-card card-wrapper",
        `pcard-${tier}`,
        `pcard-variant-${style.variant}`,
        sizeClass(size),
        selected && "is-selected",
        dimmed && "is-dimmed",
        style.photoFrame === "full-body" && "pcard-frame-full-body",
        onClick && "is-clickable",
        !player.photo && "is-nophoto",
        reducedMotion && "is-still",
        isOutOfPosition && "is-out-of-position",
        className,
      )}
    >
      <div className="ultimate-stage">
        <div className="ultimate-shadow" />
        <div className="ultimate-backplate" />
        <div className="ultimate-foil ultimate-foil-back" />
        <div className="ultimate-geometry" aria-hidden>
          <span className="ultimate-orbit" />
          <span className="ultimate-cut cut-one" />
          <span className="ultimate-cut cut-two" />
          <span className="ultimate-spark spark-one" />
          <span className="ultimate-spark spark-two" />
        </div>
        {auraTokens.length > 0 && (
          <div className="ultimate-aura" aria-hidden>
            {d.onForm && <span className="ultimate-aura-form" />}
            {player.captain && <span className="ultimate-aura-captain" />}
          </div>
        )}
        <div className="ultimate-artboard ultimate-skin card-bg-full" aria-hidden="true">
          {style.showTactical && <TacticalBackdrop />}
          {style.showGrid && (() => {
            const patternClass = PATTERN_CLASS[style.backgroundPattern ?? "grid"] ?? "ultimate-grid";
            return patternClass ? <div className={patternClass} /> : null;
          })()}
          <ChassisLayers tier={tier} rich={rich} />
        </div>

        <div
          className="ultimate-photo-wrap image-wrapper"
          style={{
            transform: `translate(${style.photoX}%, ${style.photoY}%) rotate(${style.photoRotate}deg) scale(${style.photoScale})`,
            filter: `brightness(${style.photoBrightness}) contrast(${style.photoContrast}) saturate(${style.photoSaturate}) blur(${style.photoBlur}px)`,
            opacity: style.photoOpacity,
          }}
        >
          <CardPhoto src={player.photo} name={player.name} />
          <div className="ultimate-photo-light" />
          <div className="ultimate-photo-fade" />
        </div>
        <div className="ultimate-shine" aria-hidden />
        <div className="ultimate-divider card-divider" aria-hidden />

        {!compact && hasPlayStyles && <div className="ultimate-sidebar-divider" aria-hidden />}
        {!compact && hasPlayStyles && (
          <PlayStyleBadges
            playStyles={player.playStyles ?? []}
            playStylesPlus={player.playStylesPlus ?? []}
            isGK={isGoalkeeper(player.position)}
          />
        )}

        <div className="ultimate-content card-ui-overlay">
          <div className="ultimate-zone ultimate-header-zone">
            <div className="ultimate-rating ovr-badge">
              <span className="ultimate-rating-label">OVR</span>
              <strong>{slotOvr}</strong>
              <span className="ultimate-position">{slotPosition ?? player.position}</span>
              {player.captain && <span className="ultimate-captain-mark">C</span>}
            </div>
          </div>
          <div className="ultimate-zone ultimate-name-zone">
            <div className="ultimate-identity player-name-wrapper">
              <strong>{displayName}</strong>
              <span>{player.team || "AKAN HQ"} · #{player.number || "-"}</span>
            </div>
            {compact && <div className="ultimate-compact-name">{displayName}</div>}
          </div>
          {!compact && <div className="ultimate-zone ultimate-stats-zone stats-grid"><CardStats stats={stats} compact={size === "mini"} /></div>}
          {!compact && <div className="ultimate-zone ultimate-footer-zone ultimate-footer card-footer"><span>FORM {formLabel}</span><span>{player.foot[0]} · {player.height}CM</span><b>AKN</b></div>}
        </div>
        <div className="ultimate-foil ultimate-foil-front" aria-hidden />
      </div>
    </div>
  );
}

export function EmptySlotCard({
  pos,
  onClick,
  size = "board",
}: {
  pos: string;
  onClick?: () => void;
  size?: CardSize;
}) {
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
      className={cn("pcard pcard-empty", sizeClass(size), onClick && "is-clickable")}
    >
      <div className="ultimate-stage">
        <div className="ultimate-artboard">
          <TacticalBackdrop />
        </div>
        <div className="ultimate-empty-content">
          <strong>{pos}</strong>
          <span>EMPTY SLOT</span>
        </div>
      </div>
    </div>
  );
}

export function MiniPlayerCard(props: Omit<Parameters<typeof PlayerCard>[0], "size">) {
  return <PlayerCard {...props} size="board" />;
}