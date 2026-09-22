import type { CardDesign, CardStyle, AttrVizStyle, CardVariant } from "./types";

/** Visual chassis family. Independent of licensed game rarity colours. */
export type CardTier = "core" | "elite" | "prime" | "apex" | "legacy" | "iconic";

export const CARD_TIERS: CardTier[] = ["core", "elite", "prime", "apex", "legacy", "iconic"];

export type CardSize = "full" | "profile" | "mini" | "board" | "tiny";

export interface TierMeta {
  label: string;
  tagline: string;
  layers: 1 | 2 | 3 | 4 | 5 | 6;
}

export const TIER_META: Record<CardTier, TierMeta> = {
  core: { label: "CORE", tagline: "Foundation chassis", layers: 1 },
  elite: { label: "ELITE", tagline: "Command geometry", layers: 2 },
  prime: { label: "PRIME", tagline: "Layered strike plate", layers: 3 },
  apex: { label: "APEX", tagline: "High-voltage frame", layers: 4 },
  legacy: { label: "LEGACY", tagline: "Ceremonial plate", layers: 5 },
  iconic: { label: "ICONIC", tagline: "Sovereign artifact", layers: 6 },
};

const LEGACY_DESIGN_MAP: Record<string, CardTier> = {
  pitch: "core",
  midnight: "core",
  carbon: "core",
  forge: "core",
  alloy: "elite",
  ice: "elite",
  ingot: "prime",
  emerald: "apex",
  mythic: "iconic",
};

export function normalizeCardDesign(raw: string | null | undefined): CardDesign {
  if (!raw) return "auto";
  if (raw === "auto") return "auto";
  if ((CARD_TIERS as string[]).includes(raw)) return raw as CardTier;
  return LEGACY_DESIGN_MAP[raw] ?? "auto";
}

export function tierFromDesign(design: Exclude<CardDesign, "auto"> | string): CardTier {
  const n = normalizeCardDesign(design);
  return n === "auto" ? "core" : n;
}

export function tierForOvr(ovr: number): CardTier {
  if (ovr >= 95) return "iconic";
  if (ovr >= 90) return "legacy";
  if (ovr >= 85) return "apex";
  if (ovr >= 80) return "prime";
  if (ovr >= 75) return "elite";
  return "core";
}

export function lastName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1] || name).toUpperCase();
}

export function pipCount(value: number): number {
  return Math.max(0, Math.min(10, Math.round(value / 10)));
}

export const DEFAULT_CARD_STYLE: CardStyle = {
  primary: "",
  secondary: "",
  accent: "",
  background: "",
  border: "",
  text: "",
  attrColor: "",
  ratingColor: "",
  highlight: "",
  generatedBackground: "",
  glowColor: "",
  metallic: "",
  photoTint: "",
  borderWidth: 1.5,
  borderOpacity: 0.85,
  glowIntensity: 0.45,
  shadowIntensity: 0.45,
  highlightIntensity: 0.4,
  photoScale: 1,
  photoX: 0,
  photoY: 0,
  photoRotate: 0,
  photoBrightness: 1,
  photoContrast: 1,
  photoSaturate: 1,
  photoOpacity: 1,
  photoBlur: 0,
  photoFrame: "face",
  variant: "concept",
  nameSize: 1,
  letterSpacing: 0.12,
  nameCase: "upper",
  attrViz: "bars",
  showTactical: true,
  showGrid: true,
  gridColor: "",
  patternOpacity: 0.18,
  backgroundPattern: "grid",
  playstyleScale: 1,
  ovrScale: 1,
  formScale: 1,
};

/** Chassis colour identity — templates, not players. */
export const TIER_PALETTE: Record<CardTier, Partial<CardStyle>> = {
  core: {
    accent: "#c8d0d4", metallic: "#e8edf0", glowColor: "rgba(200,208,212,0.22)",
    primary: "#0f1418", secondary: "#1b242d", border: "#bdc8ce",
  },
  elite: {
    accent: "#5fe3d4", metallic: "#b5f5ef", glowColor: "rgba(95,227,212,0.24)",
    primary: "#0c1a1d", secondary: "#13353b", border: "#8fe8df",
  },
  prime: {
    accent: "#f4bf6c", metallic: "#f8ddab", glowColor: "rgba(244,191,108,0.26)",
    primary: "#20150f", secondary: "#392516", border: "#f0c689",
  },
  apex: {
    accent: "#8b7cff", metallic: "#d7d0ff", glowColor: "rgba(139,124,255,0.3)",
    primary: "#120f1d", secondary: "#211a35", border: "#a79cff",
  },
  legacy: {
    accent: "#d9b85b", metallic: "#f2e2af", glowColor: "rgba(217,184,91,0.3)",
    primary: "#17130d", secondary: "#2d210f", border: "#f0d899",
  },
  iconic: {
    accent: "#ff678a", metallic: "#ffc4d1", glowColor: "rgba(255,103,138,0.3)",
    primary: "#1a0e12", secondary: "#34171f", border: "#f7a6b9",
  },
};

export const ATTR_VIZ_OPTIONS: { id: AttrVizStyle; label: string }[] = [
  { id: "bars", label: "Bars" },
  { id: "segmented", label: "Segmented" },
  { id: "radial", label: "Radial" },
  { id: "angular", label: "Angular" },
  { id: "minimal", label: "Minimal" },
  { id: "analytical", label: "Analytical" },
];

const CARD_THEME_BANK: Array<Partial<CardStyle> & { name: string }> = [
  { name: "Gold Pulse", primary: "#100d09", secondary: "#2e220d", accent: "#f3c76c", border: "#e8d9a3", text: "#f6f1e6", attrColor: "#f4d88f", ratingColor: "#fef7e1", metallic: "#fbe7b6", glowColor: "rgba(243,199,108,0.22)" },
  { name: "Ice Blue", primary: "#081821", secondary: "#102c3d", accent: "#7dd4ff", border: "#c6f0ff", text: "#edfafe", attrColor: "#a9ebff", ratingColor: "#f0fbff", metallic: "#ddf8ff", glowColor: "rgba(125,212,255,0.22)" },
  { name: "Jade Burst", primary: "#071b17", secondary: "#12342a", accent: "#5fe29c", border: "#c7f5d8", text: "#ebfff3", attrColor: "#9ef3bf", ratingColor: "#f1fff8", metallic: "#d1f9e1", glowColor: "rgba(95,226,156,0.22)" },
  { name: "Crimson Vibe", primary: "#180d14", secondary: "#341c28", accent: "#ff688a", border: "#ffc0ce", text: "#fff0f5", attrColor: "#ffb5c7", ratingColor: "#fff2f6", metallic: "#ffdfe9", glowColor: "rgba(255,104,138,0.22)" },
  { name: "Electric Violet", primary: "#100f1a", secondary: "#231d38", accent: "#8d7dff", border: "#d4cdfd", text: "#f4f1ff", attrColor: "#cabdff", ratingColor: "#f4f1ff", metallic: "#e7e0ff", glowColor: "rgba(141,125,255,0.22)" },
  { name: "Sunset Red", primary: "#1b0d0b", secondary: "#362118", accent: "#ff8658", border: "#ffd2bb", text: "#fff3ee", attrColor: "#ffb79f", ratingColor: "#fff4ef", metallic: "#ffe2d6", glowColor: "rgba(255,134,88,0.2)" },
  { name: "Forest Mist", primary: "#0d1210", secondary: "#172e22", accent: "#81d49d", border: "#d3f3d9", text: "#f5fff6", attrColor: "#b9f0c1", ratingColor: "#f0fff5", metallic: "#dffae4", glowColor: "rgba(129,212,157,0.22)" },
  { name: "Slate Steel", primary: "#0a1014", secondary: "#1f2f3a", accent: "#a3b8c7", border: "#dfeaf2", text: "#f2f7fb", attrColor: "#c8d9ea", ratingColor: "#f6fbff", metallic: "#edf4f9", glowColor: "rgba(163,184,199,0.2)" },
  { name: "Amber Sky", primary: "#181209", secondary: "#2c250e", accent: "#ffbe4d", border: "#ffe3a3", text: "#fff8e8", attrColor: "#ffd77d", ratingColor: "#fff8de", metallic: "#ffeec2", glowColor: "rgba(255,190,77,0.22)" },
  { name: "Night Flux", primary: "#0b0d15", secondary: "#171c2b", accent: "#68a9ff", border: "#d2e2ff", text: "#eef5ff", attrColor: "#b0d0ff", ratingColor: "#f0f6ff", metallic: "#dfeefe", glowColor: "rgba(104,169,255,0.22)" },
  { name: "Rose Gold", primary: "#17120f", secondary: "#2b1d1a", accent: "#ffb7a2", border: "#fce2d7", text: "#fff1ec", attrColor: "#ffd0c3", ratingColor: "#fff6f2", metallic: "#ffe7df", glowColor: "rgba(255,183,162,0.22)" },
  { name: "Emerald Halo", primary: "#091711", secondary: "#163227", accent: "#6ce9bb", border: "#d9f7e8", text: "#f0fff9", attrColor: "#aaf5d3", ratingColor: "#f3fff9", metallic: "#dffef0", glowColor: "rgba(108,233,187,0.22)" },
  { name: "Royal Navy", primary: "#0b1220", secondary: "#182844", accent: "#6ca8ff", border: "#d9e7ff", text: "#edf5ff", attrColor: "#bfd7ff", ratingColor: "#f1f7ff", metallic: "#ddeafe", glowColor: "rgba(108,168,255,0.22)" },
  { name: "Pink Laser", primary: "#180d18", secondary: "#331d34", accent: "#ff75d3", border: "#ffd7f3", text: "#fff3fb", attrColor: "#ffbddf", ratingColor: "#fff4fb", metallic: "#ffe5f5", glowColor: "rgba(255,117,211,0.2)" },
  { name: "Cobalt Edge", primary: "#0d1220", secondary: "#1e2d47", accent: "#5ea7ff", border: "#d7e8ff", text: "#edf5ff", attrColor: "#b8d6ff", ratingColor: "#f2f8ff", metallic: "#dfeeff", glowColor: "rgba(94,167,255,0.22)" },
  { name: "Citrus X", primary: "#18160b", secondary: "#2b2a13", accent: "#dfe96e", border: "#f5ffc4", text: "#fafdd6", attrColor: "#eaf89d", ratingColor: "#fffde8", metallic: "#f5f9c4", glowColor: "rgba(223,233,110,0.2)" }
];

export const CAPTAIN_SIGNATURE_STYLE: Partial<CardStyle> = {
  primary: "#130d08",
  secondary: "#2b1d0d",
  accent: "#e3c767",
  border: "#f4e3a7",
  text: "#fffaf1",
  attrColor: "#f7e5b0",
  ratingColor: "#fffaf0",
  background: "#120d0a",
  metallic: "#f7e9be",
  glowColor: "rgba(227,199,103,0.32)",
  variant: "icon",
};

const FEATURED_CARD_PRESETS: { id: string; name: string; style: CardStyle }[] = [
  {
    id: "featured-cyber-titan",
    name: "Cyber-Titan Hybrid",
    style: mergeCardStyle({ primary: "#070b12", secondary: "#101c2c", accent: "#5be7ff", border: "#d9f7ff", text: "#f3fbff", attrColor: "#83efff", ratingColor: "#ffffff", metallic: "#d7edf5", glowColor: "rgba(91,231,255,0.32)", variant: "titan", showTactical: true, showGrid: true, patternOpacity: 0.24, glowIntensity: 0.68, shadowIntensity: 0.6, highlightIntensity: 0.58, borderWidth: 2 }),
  },
  {
    id: "featured-garden-legacy",
    name: "Garden Legacy",
    style: mergeCardStyle({ primary: "#10150f", secondary: "#20351f", accent: "#b8df86", border: "#e6f4c5", text: "#f5fbe9", attrColor: "#cdeca1", ratingColor: "#fffde9", metallic: "#e4efbd", glowColor: "rgba(184,223,134,0.28)", variant: "floral", showTactical: false, showGrid: true, patternOpacity: 0.2, glowIntensity: 0.48, shadowIntensity: 0.48, highlightIntensity: 0.5 }),
  },
  {
    id: "featured-heritage-gold",
    name: "Academy Heritage Gold",
    style: mergeCardStyle({ primary: "#171006", secondary: "#3a260b", accent: "#f4c85e", border: "#fff0b0", text: "#fff9e8", attrColor: "#f7d87e", ratingColor: "#fffbe9", metallic: "#ffe9a8", glowColor: "rgba(244,200,94,0.34)", variant: "heritage", showTactical: false, showGrid: false, patternOpacity: 0.08, glowIntensity: 0.62, shadowIntensity: 0.58, highlightIntensity: 0.72, borderWidth: 2.2 }),
  },
];

export const CARD_PRESET_THEMES = [
  ...FEATURED_CARD_PRESETS,
  ...Array.from({ length: 140 }, (_, index) => {
    const base = CARD_THEME_BANK[index % CARD_THEME_BANK.length];
    const referenceNames = [
      "Non-Rare Concept", "Rare Concept", "Special Concept", "Bronze Core", "Silver Core", "Gold Core",
      "TOTY Gold", "FUT Showdown", "Fantasy Green", "Prime Hero", "Prime Hero Plus", "Trailblazer",
      "FUT Heroes", "Flashback Shock", "Squad Foundations", "World Tour", "World Tour Superstar",
      "Champions League", "Europa League", "UCL RTTK", "Icon", "Hall of Fame", "Hero", "World Cup Hero",
      "Ones to Watch", "In-Form", "Big Time", "Show Time", "Akan Future Star",
    ];
    const tone = index % 2 === 0 ? { accent: base.accent, glowColor: base.glowColor } : { accent: base.accent, glowColor: base.glowColor };
    const variants: CardVariant[] = [
      "prism", "hologram", "chrome", "cyber", "glitch", "eclipse", "crystal", "manga", "lava", "aurora",
      "circuit", "relic", "dimension", "cosmic", "street", "quantum", "royal", "phantom", "velocity", "show-time",
      "toty", "icon", "hero", "flashback", "champions", "big-time", "prism", "hologram", "chrome", "cyber",
    ];
    const vaultNames = [
      "Prism Future", "Holo Genesis", "Chrome Phantom", "Cyber Striker", "Glitchwave", "Eclipse Blackout",
      "Crystal Crown", "Manga Impact", "Lava Rush", "Aurora Pulse", "Circuit Breaker", "Relic Prime",
      "Dimension Shift", "Cosmic Eleven", "Street Kings", "Quantum Rare", "Royal Command", "Phantom XI",
      "Velocity X", "Neon Show Time", "TOTY Radiant", "Icon Sovereign", "Hero Ascension", "Flashback Gold",
      "Champions Voltage", "Big Time Mechanism", "Prism Afterdark", "Holo Spectrum", "Chrome Gold",
      "Cyber Neon", "Glitch Rewind", "Eclipse Solar", "Crystal Ice", "Manga Supernova", "Lava Inferno",
      "Aurora Borealis", "Circuit Gold", "Relic Vault", "Dimension Zero", "Cosmic Storm", "Street Art",
      "Quantum Blue", "Royal Velvet", "Phantom Glass", "Velocity Carbon", "Show Time Ultra", "TOTY Black",
      "Icon Eternal", "Hero Wildcard", "Flashback Fire", "Champions Nova", "Big Time Gold", "Prism Galaxy",
      "Holo Mirage", "Chrome Inferno", "Cyber Matrix", "Glitch Static", "Eclipse Moon", "Crystal Bloom",
      "Manga Lightning", "Lava Core", "Aurora Mint", "Circuit Pulse", "Relic Bronze", "Dimension Gold",
      "Cosmic Rift", "Street Spectrum", "Quantum Red", "Royal Blue", "Phantom Silver", "Velocity Gold",
    ];
    return {
      id: `preset-${index + 1}`,
      name: vaultNames[index % vaultNames.length] ?? referenceNames[index % referenceNames.length] ?? `${base.name} ${index + 1}`,
      style: {
        ...mergeCardStyle(),
        ...base,
        ...tone,
        variant: variants[index % variants.length],
        photoOpacity: 1,
        patternOpacity: 0.12 + (index % 7) * 0.02,
        borderWidth: 1.4 + (index % 5) * 0.25,
        glowIntensity: 0.32 + (index % 9) * 0.05,
        shadowIntensity: 0.38 + (index % 6) * 0.06,
      },
    };
  }),
];

export function mergeCardStyle(partial?: Partial<CardStyle> | null): CardStyle {
  return { ...DEFAULT_CARD_STYLE, ...partial };
}

/** The dark fallback card-ai.ts used to write into every player's
 * generatedBackground when the AI design flow didn't produce a real one.
 * It's treated as "no custom background" here so existing players aren't
 * stuck on a flat near-black card — they fall through to the tier's own
 * colorful --ultimate-surface instead. */
const PLACEHOLDER_GENERATED_BG = "linear-gradient(180deg, #18181b 0%, #09090b 100%)";

export function styleToCssVars(style: CardStyle | undefined): Record<string, string> {
  const s = mergeCardStyle(style);
  const v: Record<string, string> = {
    "--pc-border-w": `${s.borderWidth}px`,
    "--pc-border-a": String(s.borderOpacity),
    "--pc-glow-i": String(s.glowIntensity),
    "--pc-shadow-i": String(s.shadowIntensity),
    "--pc-hi": String(s.highlightIntensity),
    "--pc-pattern-a": String(s.patternOpacity),
    "--pc-name-size": String(s.nameSize),
    "--pc-track": `${s.letterSpacing}em`,
    "--pc-ovr-s": String(s.ovrScale),
    "--pc-form-s": String(s.formScale),
    "--ps-scale": String(s.playstyleScale),
  };
  if (s.primary) v["--pc-base"] = s.primary;
  if (s.background) v["--pc-base"] = s.background;
  if (s.secondary) v["--pc-mid"] = s.secondary;
  if (s.accent) v["--pc-accent"] = s.accent;
  if (s.border) v["--pc-edge"] = s.border;
  if (s.text) v["--pc-ink"] = s.text;
  if (s.attrColor) v["--pc-attr"] = s.attrColor;
  if (s.ratingColor) v["--pc-rating"] = s.ratingColor;
  if (s.highlight) v["--pc-highlight"] = s.highlight;
  if (s.glowColor) v["--pc-glow"] = s.glowColor;
  if (s.metallic) v["--pc-metal"] = s.metallic;
  if (s.photoTint) v["--pc-photo-tint"] = s.photoTint;
  if (s.generatedBackground && s.generatedBackground !== PLACEHOLDER_GENERATED_BG) {
    v["--pc-generated-bg"] = s.generatedBackground;
  }
  if (s.gridColor) v["--pc-grid"] = s.gridColor;
  return v;
}