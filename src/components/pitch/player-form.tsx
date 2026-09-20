import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Upload, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayerCard } from "./player-card";
import { cn, cropFacePortrait } from "@/lib/utils";
import { compressImageToDataUrl } from "@/lib/pitch/image";
import { emptyGk, emptySix, isGoalkeeper, spreadDetail } from "@/lib/pitch/ratings";
import {
  CARD_DESIGNS,
  CARD_DESIGN_LABELS,
  POSITIONS,
  POSITION_LABELS,
  SIX_KEYS,
  SIX_LABELS,
  GK_KEYS,
  GK_LABELS,
  type CardDesign,
  type CardStyle,
  type GkSix,
  type OutfieldSix,
  type Player,
  type PositionCode,
  type StarRating,
} from "@/lib/pitch/types";
import {
  PLAYSTYLES,
  PLAYSTYLE_CATEGORY_LABELS,
  MAX_PLAYSTYLES,
  MAX_PLAYSTYLES_PLUS,
} from "@/lib/pitch/playstyles";
import { draftToPlayer, usePitchStore, type PlayerDraft } from "@/lib/pitch/store";
import {
  ATTR_VIZ_OPTIONS,
  CAPTAIN_SIGNATURE_STYLE,
  CARD_PRESET_THEMES,
  DEFAULT_CARD_STYLE,
  TIER_PALETTE,
  mergeCardStyle,
  normalizeCardDesign,
  type CardTier,
} from "@/lib/pitch/card-system";
import { designCardFromPrompt } from "@/lib/pitch/card-ai";

const STEPS = ["Identity", "Attributes", "Card Designer"];

type SaveStatus = "idle" | "saving" | "synced" | "error";

const COLOR_FIELDS: { key: keyof CardStyle; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "border", label: "Border" },
  { key: "text", label: "Text" },
  { key: "attrColor", label: "Attributes" },
  { key: "ratingColor", label: "Rating" },
  { key: "highlight", label: "Highlight" },
  { key: "glowColor", label: "Glow" },
  { key: "metallic", label: "Metallic" },
  { key: "photoTint", label: "Photo tint" },
];

const PANES = [
  { id: "ai", label: "AI" },
  { id: "presets", label: "Presets" },
  { id: "style", label: "Style" },
];

function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <label className={cn("block", disabled && "opacity-50")}>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-display text-base tabular-nums text-accent">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent disabled:cursor-not-allowed"
      />
    </label>
  );
}

/** 1–5 star clickable rating picker, used for Weak Foot and Skill Moves. */
function StarPicker({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (n: StarRating) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn(disabled && "opacity-50")}>
      <div className="mb-1 text-xs text-muted">{label}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n as StarRating)}
            className={cn(
              "text-xl leading-none transition disabled:cursor-not-allowed",
              n <= value ? "text-accent" : "text-line",
            )}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

/** PlayStyle picker — grouped by category, position-filtered, tap to equip, double-tap to elevate to "+". */
function PlayStylePicker({
  position,
  selected,
  selectedPlus,
  onToggle,
  onTogglePlus,
  disabled = false,
}: {
  position: PositionCode;
  selected: string[];
  selectedPlus: string[];
  onToggle: (id: string) => void;
  onTogglePlus: (id: string) => void;
  disabled?: boolean;
}) {
  const available = PLAYSTYLES.filter((p) => !p.positions || p.positions.includes(position));
  const grouped = Object.entries(PLAYSTYLE_CATEGORY_LABELS)
    .map(([cat, label]) => ({
      cat,
      label,
      styles: available.filter((p) => p.category === cat),
    }))
    .filter((g) => g.styles.length > 0);

  return (
    <div className={cn("space-y-4", disabled && "opacity-50")}>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>PlayStyles ({selected.length}/{MAX_PLAYSTYLES})</span>
        <span>Elite + ({selectedPlus.length}/{MAX_PLAYSTYLES_PLUS})</span>
      </div>
      {grouped.map((g) => (
        <div key={g.cat}>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">{g.label}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.styles.map((style) => {
              const isOn = selected.includes(style.id);
              const isPlus = selectedPlus.includes(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  disabled={disabled}
                  title={isPlus ? style.effectPlus : style.effect}
                  onClick={() => onToggle(style.id)}
                  onDoubleClick={() => isOn && onTogglePlus(style.id)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold disabled:cursor-not-allowed",
                    isPlus
                      ? "border-[#f1d38a] bg-[#f1d38a]/15 text-[#f7e9bd]"
                      : isOn
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line bg-elevated text-muted",
                  )}
                >
                  {style.name}
                  {isPlus && " +"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-[11px] text-subtle">
        Tap to equip a style. Double-tap an equipped style to upgrade it to elite &quot;+&quot; (max {MAX_PLAYSTYLES_PLUS}).
      </p>
    </div>
  );
}

export function PlayerForm({
  existing,
  onClose,
  onCreated,
  appearanceOnly = false,
}: {
  existing?: Player;
  onClose: () => void;
  onCreated?: (id: string) => void;
  /**
   * Look-only mode, used when a player edits their OWN card. Only the card
   * design (chassis, colors, frame, image, data layout) and the photo can be
   * changed. Name, number, position, contact details, ratings and playstyles
   * are never shown. The server enforces the same rule, so this is just the
   * friendly version of it.
   */
  appearanceOnly?: boolean;
}) {
  const addPlayer = usePitchStore((s) => s.addPlayer);
  const updatePlayer = usePitchStore((s) => s.updatePlayer);
  const category = usePitchStore((s) => s.category);

  // Look-only mode only makes sense for a card that already exists.
  const lookOnly = appearanceOnly && !!existing;

  // Sign-in is disabled for now, so everyone edits as a stand-in admin user.
  const currentUser = { id: "local-user", role: "admin" as const };
  const canEdit = true;
  const readOnlyReason: string | null = null;

  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(existing ? 2 : 0);
  const [pane, setPane] = useState<"chassis" | "color" | "frame" | "image" | "data" | "ai" | "presets">("ai");
  const [name, setName] = useState(existing?.name ?? "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [photoSource, setPhotoSource] = useState<File | null>(null);
  const [position, setPosition] = useState<PositionCode>(existing?.position ?? "CM");
  const [secondary, setSecondary] = useState<PositionCode[]>(existing?.secondaryPositions ?? []);
  const [foot, setFoot] = useState<Player["foot"]>(existing?.foot ?? "Right");
  const [weakFoot, setWeakFoot] = useState<StarRating>(existing?.weakFoot ?? 3);
  const [skillMoves, setSkillMoves] = useState<StarRating>(existing?.skillMoves ?? 3);
  const [playStyles, setPlayStyles] = useState<string[]>(existing?.playStyles ?? []);
  const [playStylesPlus, setPlayStylesPlus] = useState<string[]>(existing?.playStylesPlus ?? []);
  const [number, setNumber] = useState(existing?.number ?? "");
  const [age, setAge] = useState(existing?.age ?? 15);
  const [height, setHeight] = useState(existing?.height ?? 172);
  const [captain, setCaptain] = useState(existing?.captain ?? false);
  const [team, setTeam] = useState(existing?.team ?? "AKAN HQ");
  // Contact details — needed so coaches can actually send call-up emails.
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [guardianName, setGuardianName] = useState(existing?.guardianName ?? "");
  const [guardianEmail, setGuardianEmail] = useState(existing?.guardianEmail ?? "");
  const [guardianPhone, setGuardianPhone] = useState(existing?.guardianPhone ?? "");
  const [cardDesign, setCardDesign] = useState<CardDesign>(
    normalizeCardDesign(existing?.cardDesign ?? "auto"),
  );
  const [style, setStyle] = useState<CardStyle>(mergeCardStyle(existing?.cardStyle));
  const [six, setSix] = useState<OutfieldSix>(existing?.currentSix ?? emptySix());
  const [gk, setGk] = useState<GkSix>(existing?.gkCurrent ?? emptyGk());
  const [past, setPast] = useState<CardStyle[]>([]);
  const [future, setFuture] = useState<CardStyle[]>([]);
  const [photoFrame, setPhotoFrame] = useState<"face" | "full-body">(style.photoFrame);
  const [cardPrompt, setCardPrompt] = useState("");
  const [cardAiStatus, setCardAiStatus] = useState("Describe the card you want to create.");
  const [cardAiLoading, setCardAiLoading] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const presets = usePitchStore((s) => s.designPresets);
  const savePreset = usePitchStore((s) => s.savePreset);
  const updatePreset = usePitchStore((s) => s.updatePreset);
  const duplicatePreset = usePitchStore((s) => s.duplicatePreset);
  const removePreset = usePitchStore((s) => s.removePreset);

  // --- Save button status (idle -> saving -> synced) ---
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveStatusResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveStatusResetRef.current) clearTimeout(saveStatusResetRef.current);
    };
  }, []);

  const saveButtonLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "synced"
        ? "Saved!"
        : saveStatus === "error"
          ? "Save failed — retry"
          : "Save Card";

  // --- AI attribute generation (separate from the full card-design AI above) ---
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCardAI = async () => {
    // Attribute AI changes name, position and ratings, so it is never
    // available in look-only mode.
    if (!canEdit || lookOnly || !aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          if (call.name === "updatePlayerAttributes") {
            const args = call.args ?? {};
            if (args.name) setName(args.name);
            if (args.position) setPosition(args.position as PositionCode);
            setSix((prev) => ({
              ...prev,
              ...(args.pace !== undefined ? { pace: args.pace } : {}),
              ...(args.shooting !== undefined ? { shooting: args.shooting } : {}),
              ...(args.passing !== undefined ? { passing: args.passing } : {}),
              ...(args.dribbling !== undefined ? { dribbling: args.dribbling } : {}),
              ...(args.defending !== undefined ? { defending: args.defending } : {}),
              ...(args.physical !== undefined ? { physical: args.physical } : {}),
            }));
          }
        }
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!captain) return;
    setStyle((prev) => ({ ...mergeCardStyle(prev), ...CAPTAIN_SIGNATURE_STYLE }));
  }, [captain]);

  function pushStyle(next: CardStyle) {
    if (!canEdit) return;
    setPast((h) => [...h.slice(-30), style]);
    setFuture([]);
    setStyle(next);
  }

  function patchStyle(partial: Partial<CardStyle>) {
    if (!canEdit) return;
    pushStyle({ ...style, ...partial });
  }

  async function createCardFromPrompt() {
    if (!canEdit) return;
    if (!cardPrompt.trim()) {
      setCardAiStatus("Add a short design brief first, for example: dark floral academy card with gold details.");
      return;
    }
    setCardAiLoading(true);
    setCardAiStatus("Creating your card design...");
    try {
      const response = await fetch("http://localhost:3000/api/generate-card-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: cardPrompt.trim() }),
      });
      const payload = (await response.json()) as { success?: boolean; prompt?: string; error?: string };
      if (!response.ok || !payload.success || !payload.prompt) throw new Error(payload.error || "AI request failed");
      const result = designCardFromPrompt(payload.prompt, style);
      setCardDesign("auto");
      setPhotoFrame(result.style.photoFrame);
      pushStyle(result.style);
      setCardAiStatus(`AI design ready: ${result.summary}`);
    } catch {
      const result = designCardFromPrompt(cardPrompt, style);
      setCardDesign("auto");
      setPhotoFrame(result.style.photoFrame);
      pushStyle(result.style);
      setCardAiStatus(`Local design ready: ${result.summary} (AI server unavailable)`);
    } finally {
      setCardAiLoading(false);
    }
  }

  // Reference-image uploads are cropped, THEN compressed to a small JPEG
  // before ever landing in state — this is what was previously missing,
  // causing raw multi-MB images to sit in the store and blow past Vercel's
  // request size limit on /desk saves.
  async function useCardReferences(files: FileList | null) {
    if (!canEdit) return;
    const selected = Array.from(files ?? []);
    const source = selected[selected.length - 1];
    if (!source) return;
    try {
      setPhotoSource(source);
      const cropped = await cropFacePortrait(source, 740, photoFrame);
      setPhoto(await compressImageToDataUrl(cropped, { maxDim: 640, quality: 0.82 }));
      setCardAiStatus(`${selected.length} reference image${selected.length === 1 ? "" : "s"} uploaded. The latest image is now on the live card.`);
    } catch {
      setCardAiStatus("That image could not be read. Try a PNG, JPG, or WEBP file.");
    }
  }

  // Look-only mode has no Identity step, so the Image tab carries its own
  // photo picker. Same crop-then-compress path as everywhere else.
  async function replacePhoto(file: File | undefined) {
    if (!canEdit || !file) return;
    try {
      setPhotoSource(file);
      const cropped = await cropFacePortrait(file, 740, photoFrame);
      setPhoto(await compressImageToDataUrl(cropped, { maxDim: 640, quality: 0.82 }));
    } catch {
      setCardAiStatus("That image could not be read. Try a PNG, JPG, or WEBP file.");
    }
  }

  // Same fix applied when switching face/full-body framing, since that
  // re-crops (and therefore must re-compress) the existing photo source.
  async function applyPhotoFrame(nextFrame: "face" | "full-body") {
    if (!canEdit) return;
    setPhotoFrame(nextFrame);
    patchStyle({ photoFrame: nextFrame });
    if (photoSource) {
      const cropped = await cropFacePortrait(photoSource, 740, nextFrame);
      setPhoto(await compressImageToDataUrl(cropped, { maxDim: 640, quality: 0.82 }));
    }
  }

  function togglePlayStyle(id: string) {
    if (!canEdit) return;
    setPlayStyles((prev) => {
      if (prev.includes(id)) {
        setPlayStylesPlus((plus) => plus.filter((x) => x !== id));
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_PLAYSTYLES) return prev;
      return [...prev, id];
    });
  }

  function togglePlayStylePlus(id: string) {
    if (!canEdit) return;
    setPlayStylesPlus((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_PLAYSTYLES_PLUS) return prev;
      return [...prev, id];
    });
  }

  const draft: PlayerDraft = {
    name: name || "New Player",
    photo,
    position,
    secondaryPositions: secondary,
    foot,
    weakFoot,
    skillMoves,
    playStyles,
    playStylesPlus,
    number,
    age,
    height,
    captain,
    team,
    email,
    phone,
    guardianName,
    guardianEmail,
    guardianPhone,
    cardDesign,
    cardStyle: style,
    currentSix: six,
    gkCurrent: isGoalkeeper(position) ? gk : null,
  };
  const preview = useMemo(() => {
    const p = draftToPlayer(draft, category);
    return {
      ...p,
      id: existing?.id ?? "preview",
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      history: existing?.history ?? [],
      detail: spreadDetail(six),
    } as Player;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    photo,
    position,
    secondary,
    foot,
    weakFoot,
    skillMoves,
    playStyles,
    playStylesPlus,
    number,
    age,
    height,
    captain,
    team,
    email,
    phone,
    guardianName,
    guardianEmail,
    guardianPhone,
    cardDesign,
    style,
    six,
    gk,
    category,
    existing,
  ]);

  function toggleSecondary(pos: PositionCode) {
    if (!canEdit) return;
    setSecondary((s) => (s.includes(pos) ? s.filter((x) => x !== pos) : [...s, pos].slice(0, 3)));
  }

  function applyChassis(d: CardDesign) {
    if (!canEdit) return;
    setCardDesign(d);
    if (d !== "auto") {
      const pal = TIER_PALETTE[d as CardTier];
      if (pal) patchStyle(pal);
    }
  }

  // Turn whatever storage throws into a short, human-readable reason so the
  // "Save failed — retry" state can actually tell you *why* (quota, private
  // browsing, network, server rejection, etc.) instead of just failing
  // silently.
  function describeSaveError(err: unknown): string {
    if (err instanceof DOMException) {
      if (err.name === "QuotaExceededError" || err.code === 22 || err.name === "NS_ERROR_DOM_QUOTA_REACHED") {
        return "Storage is full (too many cards/images). Delete an old card, or export this one, then retry.";
      }
      return err.message || "Storage error.";
    }
    if (err instanceof Error) return err.message;
    return "Unknown error while saving.";
  }

  // Saving now does TWO things, in order:
  //   1. Update local Zustand state (addPlayer/updatePlayer) — this is what
  //      makes the change show up instantly in the UI and persists it to
  //      this browser's IndexedDB.
  //   2. Push the FULL desk to the server via saveToServer() (POST /desk).
  //      Without this second step, the edit only ever lived in this one
  //      browser — it was never written to the database, so it looked
  //      "saved" but disappeared on next sign-in or on another device.
  //      This is the fix for that bug.
  //
  // In look-only mode every non-look field in the form is still exactly what
  // was loaded from `existing` (those controls are never shown), so the
  // payload only differs from the stored card in photo / cardDesign /
  // cardStyle. The server is what actually guarantees that.
  async function save() {
    if (!canEdit || !currentUser || !name.trim()) return;

    const payload = draftToPlayer({ ...draft, name }, category);

    if (saveStatusResetRef.current) clearTimeout(saveStatusResetRef.current);
    setSaveStatus("saving");
    setSaveError(null);

    let id: string;
    try {
      if (existing) {
        updatePlayer(existing.id, payload);
        id = existing.id;
      } else {
        id = addPlayer(payload);
      }
    } catch (err) {
      console.error("Local save failed:", err);
      setSaveError(describeSaveError(err));
      setSaveStatus("error");
      return;
    }

    try {
      await usePitchStore.getState().saveToServer();
      const syncError = usePitchStore.getState().syncError;
      if (syncError) throw new Error(syncError);
    } catch (err) {
      console.error("Server save failed:", err);
      setSaveError(describeSaveError(err));
      setSaveStatus("error");
      return;
    }

    setSaveStatus("synced");
    onCreated?.(id);
    saveStatusResetRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
  }

  return (
    <div className="flex max-h-[min(94vh,920px)] flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <div className="font-display text-xl tracking-wide">
            {lookOnly ? "Edit my card's look" : existing ? "Edit player card" : "Create player card"}
          </div>
          <div className="text-xs text-muted">
            {lookOnly
              ? "Design and photo only"
              : `Step ${step + 1} of 3 — ${STEPS[step]}`}
          </div>
        </div>
        <button onClick={onClose} className="text-sm text-muted hover:text-fg">
          Close
        </button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto hq-scroll p-4 lg:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          {step === 0 && !lookOnly && (
            <>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => fileRef.current?.click()}
                  className="flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <Camera className="size-5 text-subtle" />}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!canEdit}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f && canEdit) {
                      setPhotoSource(f);
                      const cropped = await cropFacePortrait(f, 740, photoFrame);
                      setPhoto(await compressImageToDataUrl(cropped, { maxDim: 640, quality: 0.82 }));
                    }
                    e.target.value = "";
                  }}
                />
                <div className="text-xs text-muted">Choose a face portrait or full-body kit shot. The card blends the crop into its chassis.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["face", "full-body"] as const).map((frame) => (
                  <button
                    key={frame}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => void applyPhotoFrame(frame)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                      photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted",
                    )}
                  >
                    {frame === "face" ? "Face focus" : "Full body + kit"}
                  </button>
                ))}
              </div>
              {photo && canEdit && (
                <button type="button" className="text-xs text-muted underline" onClick={() => setPhoto(null)}>
                  Remove photo
                </button>
              )}
              <label className="block text-xs text-muted">
                Player name
                <input
                  value={name}
                  disabled={!canEdit}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Full name"
                />
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <label className="text-xs text-muted">
                  Shirt no.
                  <input
                    value={number}
                    disabled={!canEdit}
                    onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                    className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>
                <label className="text-xs text-muted">
                  Age
                  <input
                    type="number"
                    value={age}
                    disabled={!canEdit}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>
                <label className="text-xs text-muted">
                  Height (cm)
                  <input
                    type="number"
                    value={height}
                    disabled={!canEdit}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>
                <label className="text-xs text-muted">
                  Preferred foot
                  <select
                    value={foot}
                    disabled={!canEdit}
                    onChange={(e) => setFoot(e.target.value as Player["foot"])}
                    className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option>Right</option>
                    <option>Left</option>
                    <option>Both</option>
                  </select>
                </label>
              </div>

              <div className="rounded-[12px] border border-line bg-surface p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Contact — so coaches can send call-ups
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-xs text-muted">
                    Player email
                    <input
                      type="email"
                      value={email}
                      disabled={!canEdit}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@email.com"
                      className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Player phone
                    <input
                      value={phone}
                      disabled={!canEdit}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07xx xxx xxx"
                      className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="text-xs text-muted">
                    Guardian name
                    <input
                      value={guardianName}
                      disabled={!canEdit}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="Parent / guardian"
                      className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Guardian email
                    <input
                      type="email"
                      value={guardianEmail}
                      disabled={!canEdit}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      placeholder="guardian@email.com"
                      className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Guardian phone
                    <input
                      value={guardianPhone}
                      disabled={!canEdit}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="07xx xxx xxx"
                      className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                </div>
                {!email.trim() && !guardianEmail.trim() && (
                  <p className="mt-2 text-[11px] text-warn">
                    Add at least one email (player or guardian) so call-ups can actually be sent.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StarPicker label="Weak foot" value={weakFoot} disabled={!canEdit} onChange={setWeakFoot} />
                <StarPicker label="Skill moves" value={skillMoves} disabled={!canEdit} onChange={setSkillMoves} />
              </div>
              <PlayStylePicker
                position={position}
                selected={playStyles}
                selectedPlus={playStylesPlus}
                onToggle={togglePlayStyle}
                onTogglePlus={togglePlayStylePlus}
                disabled={!canEdit}
              />
              <label className="block text-xs text-muted">
                Actual position
                <select
                  value={position}
                  disabled={!canEdit}
                  onChange={(e) => setPosition(e.target.value as PositionCode)}
                  className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p} — {POSITION_LABELS[p]}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-1.5 text-xs text-muted">Secondary positions (up to 3)</div>
                <div className="flex flex-wrap gap-1.5">
                  {POSITIONS.filter((p) => p !== position).map((p) => (
                    <button
                      key={p}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => toggleSecondary(p)}
                      className={cn(
                        "rounded-full px-2 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                        secondary.includes(p) ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-xs text-muted">
                Team
                <input
                  value={team}
                  disabled={!canEdit}
                  onChange={(e) => setTeam(e.target.value)}
                  className="mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={captain} disabled={!canEdit} onChange={(e) => setCaptain(e.target.checked)} />
                Captain
              </label>
            </>
          )}

          {step === 1 && !lookOnly && (
            <div className="space-y-4">
              <p className="text-xs text-muted">
                Six-stat model. Overall is position-weighted — a centre-back is not a simple average of every number.
              </p>
              {isGoalkeeper(position)
                ? GK_KEYS.map((k) => (
                    <Slider key={k} label={GK_LABELS[k]} value={gk[k]} disabled={!canEdit} onChange={(v) => setGk({ ...gk, [k]: v })} />
                  ))
                : SIX_KEYS.map((k) => (
                    <Slider key={k} label={SIX_LABELS[k]} value={six[k]} disabled={!canEdit} onChange={(v) => setSix({ ...six, [k]: v })} />
                  ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit || past.length === 0}
                  onClick={() => {
                    const prev = past[past.length - 1];
                    setFuture((f) => [style, ...f]);
                    setPast((h) => h.slice(0, -1));
                    setStyle(prev);
                  }}
                >
                  Undo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit || future.length === 0}
                  onClick={() => {
                    const next = future[0];
                    setPast((h) => [...h, style]);
                    setFuture((f) => f.slice(1));
                    setStyle(next);
                  }}
                >
                  Redo
                </Button>
                <Button variant="ghost" size="sm" disabled={!canEdit} onClick={() => pushStyle({ ...DEFAULT_CARD_STYLE })}>
                  <RotateCcw className="size-3.5" /> Reset design
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 border-b border-line pb-2">
                {(
                  [
                    ["chassis", "Chassis"],
                    ["color", "Color"],
                    ["frame", "Frame"],
                    ["image", "Image"],
                    ["data", "Data"],
                    ["presets", "Presets"],
                    ["ai", "Card AI"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPane(id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold",
                      pane === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {pane === "ai" && (
                <div className="space-y-4">
                  <div className="rounded-[16px] border border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-fg">
                      <WandSparkles className="size-4 text-accent" /> Design your card with a prompt
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Describe the colors, mood, pattern, and photo style. The designer converts your brief into a live card layout.
                    </p>
                    <textarea
                      value={cardPrompt}
                      disabled={!canEdit}
                      onChange={(e) => setCardPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void createCardFromPrompt();
                      }}
                      placeholder="Example: a dark academy card with cyan circuits, serious typography, and a bright headshot"
                      rows={5}
                      className="mt-3 w-full rounded-[12px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button className="mt-3 w-full" onClick={() => void createCardFromPrompt()} disabled={!canEdit || cardAiLoading}>
                      <Sparkles className="size-4" /> Create card design
                    </Button>
                    <div className="mt-3 text-xs leading-5 text-accent">{cardAiStatus}</div>
                  </div>

                  {!lookOnly && (
                    <div className="rounded-[16px] border border-accent/30 bg-accent/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-fg">
                        <Sparkles className="size-4 text-accent" /> Generate attributes with AI
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        Describe the player and let AI fill in name, position, and the six-stat attributes.
                      </p>
                      <textarea
                        value={aiPrompt}
                        disabled={!canEdit}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void handleCardAI();
                        }}
                        placeholder="Example: a pacey right winger, strong dribbler, weaker in the air"
                        rows={4}
                        className="mt-3 w-full rounded-[12px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <Button className="mt-3 w-full" onClick={() => void handleCardAI()} disabled={!canEdit || isGenerating}>
                        <Sparkles className="size-4" /> {isGenerating ? "Generating..." : "Generate attributes"}
                      </Button>
                    </div>
                  )}

                  <div className="rounded-[14px] border border-line bg-surface p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Reference image</div>
                    <label className={cn("flex items-center justify-between rounded-[10px] border border-dashed border-line bg-elevated px-3 py-3 text-sm text-muted", canEdit ? "cursor-pointer" : "cursor-not-allowed opacity-50")}>
                      <span>Upload a visual reference</span>
                      <Upload className="size-4 text-accent" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={!canEdit}
                        className="hidden"
                        onChange={(e) => {
                          void useCardReferences(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <p className="mt-2 text-[11px] leading-5 text-subtle">Reference uploads are available for repeated inspiration. The local designer uses your written brief to apply the style.</p>
                  </div>
                </div>
              )}

              {pane === "chassis" && (
                <div>
                  <p className="mb-2 text-xs text-muted">
                    Chassis templates are starting points — not players. Auto assigns a tier from overall.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CARD_DESIGNS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => applyChassis(d)}
                        className={cn(
                          "rounded-[12px] border px-3 py-2 text-left text-xs disabled:cursor-not-allowed disabled:opacity-50",
                          cardDesign === d ? "border-accent bg-accent/10" : "border-line bg-elevated",
                        )}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          <span className={cn("pcard-swatch", `pcard-swatch-${d}`)} />
                          {CARD_DESIGN_LABELS[d].split(" — ")[0]}
                        </div>
                        <div className="text-[10px] text-muted">{CARD_DESIGN_LABELS[d].split(" — ")[1] ?? "by OVR"}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pane === "color" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {COLOR_FIELDS.map((f) => {
                    const val = String(style[f.key] ?? "");
                    return (
                      <label key={f.key} className="text-xs text-muted">
                        {f.label}
                        <div className="mt-1 flex gap-2">
                          <input
                            type="color"
                            disabled={!canEdit}
                            value={val && val.startsWith("#") ? val : "#808080"}
                            onChange={(e) => patchStyle({ [f.key]: e.target.value })}
                            className="h-10 w-12 rounded border border-line bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
                          />
                          <input
                            value={val}
                            disabled={!canEdit}
                            onChange={(e) => patchStyle({ [f.key]: e.target.value })}
                            placeholder="empty = tier default"
                            className="h-10 flex-1 rounded-[10px] border border-line bg-elevated px-2 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {pane === "frame" && (
                <div className="space-y-3">
                  <Slider
                    label="Border thickness"
                    value={style.borderWidth}
                    min={0.5}
                    max={4}
                    step={0.1}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ borderWidth: v })}
                  />
                  <Slider
                    label="Border opacity"
                    value={Math.round(style.borderOpacity * 100)}
                    min={10}
                    max={100}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ borderOpacity: v / 100 })}
                  />
                  <Slider
                    label="Glow"
                    value={Math.round(style.glowIntensity * 100)}
                    min={0}
                    max={100}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ glowIntensity: v / 100 })}
                  />
                  <Slider
                    label="Shadow"
                    value={Math.round(style.shadowIntensity * 100)}
                    min={0}
                    max={100}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ shadowIntensity: v / 100 })}
                  />
                  <Slider
                    label="Highlight"
                    value={Math.round(style.highlightIntensity * 100)}
                    min={0}
                    max={100}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ highlightIntensity: v / 100 })}
                  />
                  <Slider
                    label="Pattern opacity"
                    value={Math.round(style.patternOpacity * 100)}
                    min={0}
                    max={50}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ patternOpacity: v / 100 })}
                  />
                  <div className="flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={style.showTactical}
                        onChange={(e) => patchStyle({ showTactical: e.target.checked })}
                      />
                      Tactical pitch marks
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        checked={style.showGrid}
                        onChange={(e) => patchStyle({ showGrid: e.target.checked })}
                      />
                      Data grid
                    </label>
                  </div>
                </div>
              )}

              {pane === "image" && (
                <div className="space-y-3">
                  {lookOnly && (
                    <div className="flex items-center gap-3 rounded-[12px] border border-line bg-surface p-3">
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-elevated">
                        {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <Camera className="size-5 text-subtle" />}
                      </div>
                      <div className="flex flex-col items-start gap-1.5">
                        <label className="cursor-pointer rounded-full border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-fg">
                          {photo ? "Change photo" : "Add photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              void replacePhoto(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {photo && (
                          <button type="button" className="text-xs text-muted underline" onClick={() => setPhoto(null)}>
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Portrait framing</div>
                    <div className="flex flex-wrap gap-2">
                      {(["face", "full-body"] as const).map((frame) => (
                        <button
                          key={frame}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => void applyPhotoFrame(frame)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                            photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted",
                          )}
                        >
                          {frame === "face" ? "Face focus" : "Full body + kit"}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] text-subtle">Changing the crop reprocesses the current upload when available.</p>
                  </div>
                  <Slider
                    label="Scale"
                    value={Math.round(style.photoScale * 100)}
                    min={60}
                    max={160}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoScale: v / 100 })}
                  />
                  <Slider label="Horizontal" value={style.photoX} min={-25} max={25} disabled={!canEdit} onChange={(v) => patchStyle({ photoX: v })} />
                  <Slider label="Vertical" value={style.photoY} min={-25} max={25} disabled={!canEdit} onChange={(v) => patchStyle({ photoY: v })} />
                  <Slider label="Rotation" value={style.photoRotate} min={-15} max={15} disabled={!canEdit} onChange={(v) => patchStyle({ photoRotate: v })} />
                  <Slider
                    label="Brightness"
                    value={Math.round(style.photoBrightness * 100)}
                    min={40}
                    max={160}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoBrightness: v / 100 })}
                  />
                  <Slider
                    label="Contrast"
                    value={Math.round(style.photoContrast * 100)}
                    min={40}
                    max={160}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoContrast: v / 100 })}
                  />
                  <Slider
                    label="Saturation"
                    value={Math.round(style.photoSaturate * 100)}
                    min={0}
                    max={180}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoSaturate: v / 100 })}
                  />
                  <Slider
                    label="Opacity"
                    value={Math.round(style.photoOpacity * 100)}
                    min={30}
                    max={100}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoOpacity: v / 100 })}
                  />
                  <Slider
                    label="Blur"
                    value={Math.round(style.photoBlur * 10)}
                    min={0}
                    max={20}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ photoBlur: v / 10 })}
                  />
                </div>
              )}

              {pane === "data" && (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Attribute visualization
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ATTR_VIZ_OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          disabled={!canEdit}
                          onClick={() => patchStyle({ attrViz: o.id })}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                            style.attrViz === o.id ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Slider
                    label="Name size"
                    value={Math.round(style.nameSize * 100)}
                    min={70}
                    max={140}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ nameSize: v / 100 })}
                  />
                  <Slider
                    label="Letter spacing"
                    value={Math.round(style.letterSpacing * 100)}
                    min={0}
                    max={30}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ letterSpacing: v / 100 })}
                  />
                  <Slider
                    label="OVR scale"
                    value={Math.round(style.ovrScale * 100)}
                    min={70}
                    max={140}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ ovrScale: v / 100 })}
                  />
                  <Slider
                    label="Form scale"
                    value={Math.round(style.formScale * 100)}
                    min={70}
                    max={140}
                    disabled={!canEdit}
                    onChange={(v) => patchStyle({ formScale: v / 100 })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      disabled={!canEdit}
                      checked={style.nameCase === "upper"}
                      onChange={(e) => patchStyle({ nameCase: e.target.checked ? "upper" : "title" })}
                    />
                    Uppercase name
                  </label>
                </div>
              )}

              {pane === "presets" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted">Presets store the visual configuration only — they are not players.</p>
                  <div className="flex flex-wrap gap-2">
                    {captain && (
                      <button
                        type="button"
                        disabled={!canEdit}
                        className="rounded-full border border-[#f1d38a] bg-[#f1d38a]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f7e9bd] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => {
                          setCardDesign("auto");
                          pushStyle(mergeCardStyle(CAPTAIN_SIGNATURE_STYLE));
                        }}
                      >
                        Captain signature
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!canEdit}
                      className="rounded-full border border-line bg-elevated px-3 py-1.5 text-[11px] font-semibold text-muted disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => {
                        const preset = CARD_PRESET_THEMES[Math.floor(Math.random() * CARD_PRESET_THEMES.length)];
                        setCardDesign("auto");
                        setPhotoFrame(preset.style.photoFrame);
                        pushStyle(mergeCardStyle(preset.style));
                      }}
                    >
                      Random FC style
                    </button>
                  </div>
                  <div className="rounded-[12px] border border-line bg-surface p-2">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fg">FC card library</div>
                      <div className="text-[10px] text-muted">{CARD_PRESET_THEMES.length} designs</div>
                    </div>
                    <div className="grid max-h-[430px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                    {CARD_PRESET_THEMES.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => {
                          setCardDesign("auto");
                          setPhotoFrame(preset.style.photoFrame);
                          pushStyle(mergeCardStyle(preset.style));
                        }}
                        className="flex min-h-[158px] flex-col items-center justify-between rounded-[12px] border border-line bg-elevated p-2 text-left transition hover:border-accent hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-elevated"
                      >
                        <div className="flex h-[118px] items-center justify-center">
                          <PlayerCard
                            player={{
                              ...preview,
                              cardDesign: "auto",
                              cardStyle: mergeCardStyle(preset.style),
                            }}
                            size="mini"
                          />
                        </div>
                        <div className="mt-2 w-full truncate text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-fg">
                          {preset.name}
                        </div>
                      </button>
                    ))}
                    </div>
                  </div>
                  {/* Saved presets are shared by the whole desk, so a player
                      can apply them but not create, rename, copy or delete. */}
                  {!lookOnly && (
                    <div className="flex gap-2">
                      <input
                        value={presetName}
                        disabled={!canEdit}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Preset name"
                        className="h-10 flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <Button
                        disabled={!canEdit}
                        onClick={() => {
                          if (!presetName.trim()) return;
                          savePreset(presetName.trim(), cardDesign, style);
                          setPresetName("");
                        }}
                      >
                        Save preset
                      </Button>
                    </div>
                  )}
                  {presets.length === 0 && <p className="text-sm text-subtle">No saved presets yet.</p>}
                  <ul className="space-y-1.5">
                    {presets.map((pr) => (
                      <li key={pr.id} className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-elevated px-3 py-2">
                        {renameId === pr.id && !lookOnly ? (
                          <input
                            defaultValue={pr.name}
                            className="h-8 flex-1 rounded border border-line bg-surface px-2 text-sm"
                            onBlur={(e) => {
                              updatePreset(pr.id, { name: e.target.value.trim() || pr.name });
                              setRenameId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className="flex-1 text-sm font-semibold">{pr.name}</span>
                        )}
                        <button type="button" disabled={!canEdit} className="text-[11px] text-accent disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setCardDesign(pr.cardDesign); setPhotoFrame(pr.style.photoFrame); pushStyle(mergeCardStyle(pr.style)); }}>
                          Apply
                        </button>
                        {!lookOnly && (
                          <>
                            <button type="button" disabled={!canEdit} className="text-[11px] text-muted disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setRenameId(pr.id)}>
                              Rename
                            </button>
                            <button type="button" disabled={!canEdit} className="text-[11px] text-muted disabled:cursor-not-allowed disabled:opacity-50" onClick={() => duplicatePreset(pr.id)}>
                              Duplicate
                            </button>
                            <button type="button" disabled={!canEdit} className="text-[11px] text-warn disabled:cursor-not-allowed disabled:opacity-50" onClick={() => removePreset(pr.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="sticky top-0">
            <PlayerCard player={preview} size="full" className="player-card-create-preview" />
            <p className="mt-2 text-center text-[10px] text-subtle">Live preview</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        {lookOnly ? (
          <div />
        ) : (
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft className="size-4" /> Back
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !name.trim()}>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <div className="flex flex-col items-end gap-1">
            {saveStatus === "error" && saveError && (
              <p className="max-w-[260px] text-right text-[11px] leading-4 text-warn">{saveError}</p>
            )}
            <Button
              onClick={() => void save()}
              disabled={!canEdit || !name.trim() || saveStatus === "saving"}
              className={cn(
                saveStatus === "synced" && "bg-emerald-600 hover:bg-emerald-600",
                saveStatus === "error" && "bg-warn/80 hover:bg-warn",
              )}
            >
              {saveButtonLabel.toUpperCase()}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}