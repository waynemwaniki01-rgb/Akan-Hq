import { o as __toESM } from "../_runtime.mjs";
import { L as require_jsx_runtime, R as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CircleHelp, A as Plus, B as LayoutGrid, C as Ruler, D as Repeat, E as Rocket, F as Move, G as Flame, H as Hand, I as MoveDiagonal, J as Eye, K as Flag, L as Mountain, M as Plane, N as Pause, O as Radio, P as Navigation, Q as Compass, R as LoaderCircle, S as Search, T as RotateCcw, U as Gauge, V as Infinity$1, W as Footprints, X as Dumbbell, Y as EyeOff, Z as Crosshair, _ as Shuffle, a as WandSparkles, at as CalendarDays, b as ShieldAlert, c as Upload, ct as Activity, d as TrendingUp, f as Trash2, g as Slash, h as Sparkles, i as Wand, it as Camera, j as Play, k as Radar, l as Trophy, m as Square, n as X, nt as ChevronLeft, o as Users, ot as Award, p as Target, q as Feather, r as Wind, rt as Check, s as UserCog, st as ArrowUpRight, t as Zap, tt as ChevronRight, v as Shield, w as RotateCw, x as Send, y as ShieldCheck, z as Lightbulb } from "../_libs/lucide-react.mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { Ht as capitalizeFirstLetter, Ut as toKebabCase, m as isSafeUrlScheme, o as createFetch } from "../_libs/@better-auth/core+[...].mjs";
import { n as defu } from "../_libs/defu.mjs";
import { a as getBaseURL, i as PACKAGE_VERSION, n as hasGateSessionMarker, r as GENERIC_OAUTH_ERROR_CODES } from "./router-Bu3nZ6EP.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as get, r as set, t as del } from "../_libs/idb-keyval.mjs";
import { a as atom, i as onSet, n as STORE_UNMOUNT_DELAY, r as onMount, t as listenKeys } from "../_libs/nanostores.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-8R2xJp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROTO_POLLUTION_PATTERNS = {
	proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
	constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
	protoShort: /"__proto__"\s*:/,
	constructorShort: /"constructor"\s*:/
};
var JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
var SPECIAL_VALUES = {
	true: true,
	false: false,
	null: null,
	undefined: void 0,
	nan: NaN,
	infinity: Number.POSITIVE_INFINITY,
	"-infinity": Number.NEGATIVE_INFINITY
};
var ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
	return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
	const match = ISO_DATE_REGEX.exec(value);
	if (!match) return null;
	const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
	const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
	if (offsetSign) {
		const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
		date.setUTCMinutes(date.getUTCMinutes() + offset);
	}
	return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
	const { strict = false, warnings = false, reviver, parseDates = true } = options;
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	const lowerValue = trimmed.toLowerCase();
	if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
	if (!JSON_SIGNATURE.test(trimmed)) {
		if (strict) throw new SyntaxError("[better-json] Invalid JSON");
		return value;
	}
	if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
		const matches = pattern.test(trimmed);
		if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
		return matches;
	}) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
	try {
		const secureReviver = (key, value) => {
			if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
				if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
				return;
			}
			if (parseDates && typeof value === "string") {
				const date = parseISODate(value);
				if (date) return date;
			}
			return reviver ? reviver(key, value) : value;
		};
		return JSON.parse(trimmed, secureReviver);
	} catch (error) {
		if (strict) throw error;
		return value;
	}
}
function parseJSON(value, options = { strict: true }) {
	return betterJSONParse(value, options);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function formatDateLong(iso) {
	return (/* @__PURE__ */ new Date(iso + "T00:00:00")).toLocaleDateString(void 0, {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function formatKickoff(k) {
	if (!k) return "";
	const [h, m] = k.split(":").map(Number);
	const period = h >= 12 ? "PM" : "AM";
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}
function cropFacePortrait(file, maxSize = 740, frame = "face") {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				const { width, height } = img;
				const aspect = width / height;
				const faceCenterX = width * .5;
				const faceCenterY = height * .42;
				let cropW = width * .68;
				let cropH = height * .8;
				if (frame === "full-body") {
					cropW = width * .9;
					cropH = height * .98;
				}
				if (frame === "face" && aspect > 1.15) {
					cropW = width * .62;
					cropH = height * .86;
				} else if (frame === "face" && aspect < .8) {
					cropW = width * .8;
					cropH = height * .72;
				}
				const cropX = Math.min(Math.max(faceCenterX - cropW / 2, 0), Math.max(0, width - cropW));
				const cropY = frame === "full-body" ? Math.max(0, (height - cropH) * .35) : Math.min(Math.max(faceCenterY - cropH * .68, 0), Math.max(0, height - cropH));
				const outW = maxSize;
				const outH = Math.round(maxSize * 1.35);
				const canvas = document.createElement("canvas");
				canvas.width = outW;
				canvas.height = outH;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					resolve("");
					return;
				}
				ctx.clearRect(0, 0, outW, outH);
				ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);
				resolve(canvas.toDataURL("image/png"));
			};
			img.onerror = reject;
			img.src = String(e.target?.result ?? "");
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
function Modal({ open, onClose, children, wide }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0 bg-black/70",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("relative z-10 w-full overflow-hidden rounded-t-[18px] border border-line bg-surface shadow-2xl sm:rounded-[18px]", wide ? "max-w-5xl" : "max-w-3xl"),
			children
		})]
	});
}
function Button({ className, variant = "primary", size = "md", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none", size === "sm" && "h-8 px-2.5 text-xs rounded-[8px]", size === "md" && "h-10 px-3.5 text-sm rounded-[10px]", size === "lg" && "h-11 px-4 text-sm rounded-[12px]", variant === "primary" && "bg-accent text-accent-fg hover:bg-accent/90", variant === "ghost" && "bg-transparent text-muted hover:text-fg hover:bg-elevated", variant === "line" && "bg-transparent text-fg border border-line hover:border-accent/60", variant === "danger" && "bg-warn/15 text-warn hover:bg-warn/25", variant === "soft" && "bg-elevated text-fg hover:bg-surface-2", className),
		...props
	});
}
var CATEGORIES = ["U15"];
var POSITIONS = [
	"GK",
	"SW",
	"CB",
	"LCB",
	"RCB",
	"LB",
	"RB",
	"LWB",
	"RWB",
	"CDM",
	"LDM",
	"RDM",
	"CM",
	"LCM",
	"RCM",
	"CAM",
	"LAM",
	"RAM",
	"LM",
	"RM",
	"LW",
	"RW",
	"LF",
	"RF",
	"CF",
	"ST",
	"SS"
];
var POSITION_LABELS = {
	GK: "Goalkeeper",
	SW: "Sweeper",
	CB: "Centre Back",
	LCB: "Left Centre Back",
	RCB: "Right Centre Back",
	LB: "Left Back",
	RB: "Right Back",
	LWB: "Left Wing Back",
	RWB: "Right Wing Back",
	CDM: "Defensive Midfielder",
	LDM: "Left Defensive Mid",
	RDM: "Right Defensive Mid",
	CM: "Central Midfielder",
	LCM: "Left Central Mid",
	RCM: "Right Central Mid",
	CAM: "Attacking Midfielder",
	LAM: "Left Attacking Mid",
	RAM: "Right Attacking Mid",
	LM: "Left Midfielder",
	RM: "Right Midfielder",
	LW: "Left Winger",
	RW: "Right Winger",
	LF: "Left Forward",
	RF: "Right Forward",
	CF: "Centre Forward",
	ST: "Striker",
	SS: "Second Striker"
};
var SIX_KEYS = [
	"pac",
	"sho",
	"pas",
	"dri",
	"def",
	"phy"
];
var SIX_LABELS = {
	pac: "PAC",
	sho: "SHO",
	pas: "PAS",
	dri: "DRI",
	def: "DEF",
	phy: "PHY"
};
var GK_KEYS = [
	"div",
	"han",
	"kic",
	"ref",
	"spd",
	"pos"
];
var GK_LABELS = {
	div: "DIV",
	han: "HAN",
	kic: "KIC",
	ref: "REF",
	spd: "SPD",
	pos: "POS"
};
var DETAIL_GROUPS = [
	{
		title: "Pace",
		keys: ["acceleration", "sprintSpeed"]
	},
	{
		title: "Shooting",
		keys: [
			"finishing",
			"shotPower",
			"longShots",
			"volleys",
			"attackingPosition"
		]
	},
	{
		title: "Passing",
		keys: [
			"shortPassing",
			"longPassing",
			"vision",
			"crossing",
			"curve",
			"fkAccuracy"
		]
	},
	{
		title: "Dribbling",
		keys: [
			"dribbling",
			"ballControl",
			"agility",
			"balance",
			"reactions"
		]
	},
	{
		title: "Defending",
		keys: [
			"defensiveAwareness",
			"standingTackle",
			"slidingTackle",
			"interceptions",
			"headingAccuracy"
		]
	},
	{
		title: "Physical",
		keys: [
			"strength",
			"stamina",
			"aggression",
			"jumping"
		]
	}
];
var DETAIL_LABELS = {
	acceleration: "Acceleration",
	sprintSpeed: "Sprint Speed",
	finishing: "Finishing",
	shotPower: "Shot Power",
	longShots: "Long Shots",
	volleys: "Volleys",
	attackingPosition: "Positioning",
	shortPassing: "Short Passing",
	longPassing: "Long Passing",
	vision: "Vision",
	crossing: "Crossing",
	curve: "Curve",
	fkAccuracy: "Free Kick Accuracy",
	dribbling: "Dribbling",
	ballControl: "Ball Control",
	agility: "Agility",
	balance: "Balance",
	reactions: "Reactions",
	defensiveAwareness: "Defensive Awareness",
	standingTackle: "Standing Tackle",
	slidingTackle: "Sliding Tackle",
	interceptions: "Interceptions",
	headingAccuracy: "Heading Accuracy",
	strength: "Strength",
	stamina: "Stamina",
	aggression: "Aggression",
	jumping: "Jumping"
};
var CARD_DESIGNS = [
	"auto",
	"core",
	"elite",
	"prime",
	"apex",
	"legacy",
	"iconic"
];
var CARD_DESIGN_LABELS = {
	auto: "Auto — by overall",
	core: "Core — graphite chassis",
	elite: "Elite — command cyan",
	prime: "Prime — copper strike",
	apex: "Apex — violet voltage",
	legacy: "Legacy — ceremonial plate",
	iconic: "Iconic — sovereign crimson"
};
var CARD_TIERS = [
	"core",
	"elite",
	"prime",
	"apex",
	"legacy",
	"iconic"
];
var TIER_META = {
	core: {
		label: "CORE",
		tagline: "Foundation chassis",
		layers: 1
	},
	elite: {
		label: "ELITE",
		tagline: "Command geometry",
		layers: 2
	},
	prime: {
		label: "PRIME",
		tagline: "Layered strike plate",
		layers: 3
	},
	apex: {
		label: "APEX",
		tagline: "High-voltage frame",
		layers: 4
	},
	legacy: {
		label: "LEGACY",
		tagline: "Ceremonial plate",
		layers: 5
	},
	iconic: {
		label: "ICONIC",
		tagline: "Sovereign artifact",
		layers: 6
	}
};
var LEGACY_DESIGN_MAP = {
	pitch: "core",
	midnight: "core",
	carbon: "core",
	forge: "core",
	alloy: "elite",
	ice: "elite",
	ingot: "prime",
	emerald: "apex",
	mythic: "iconic"
};
function normalizeCardDesign(raw) {
	if (!raw) return "auto";
	if (raw === "auto") return "auto";
	if (CARD_TIERS.includes(raw)) return raw;
	return LEGACY_DESIGN_MAP[raw] ?? "auto";
}
function tierForOvr(ovr) {
	if (ovr >= 95) return "iconic";
	if (ovr >= 90) return "legacy";
	if (ovr >= 85) return "apex";
	if (ovr >= 80) return "prime";
	if (ovr >= 75) return "elite";
	return "core";
}
function lastName(name) {
	const parts = name.trim().split(/\s+/);
	return (parts[parts.length - 1] || name).toUpperCase();
}
var DEFAULT_CARD_STYLE = {
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
	borderOpacity: .85,
	glowIntensity: .45,
	shadowIntensity: .45,
	highlightIntensity: .4,
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
	letterSpacing: .12,
	nameCase: "upper",
	attrViz: "bars",
	showTactical: true,
	showGrid: true,
	gridColor: "",
	patternOpacity: .18,
	backgroundPattern: "grid",
	playstyleScale: 1,
	ovrScale: 1,
	formScale: 1
};
/** Chassis colour identity — templates, not players. */
var TIER_PALETTE = {
	core: {
		accent: "#c8d0d4",
		metallic: "#e8edf0",
		glowColor: "rgba(200,208,212,0.22)",
		primary: "#0f1418",
		secondary: "#1b242d",
		border: "#bdc8ce"
	},
	elite: {
		accent: "#5fe3d4",
		metallic: "#b5f5ef",
		glowColor: "rgba(95,227,212,0.24)",
		primary: "#0c1a1d",
		secondary: "#13353b",
		border: "#8fe8df"
	},
	prime: {
		accent: "#f4bf6c",
		metallic: "#f8ddab",
		glowColor: "rgba(244,191,108,0.26)",
		primary: "#20150f",
		secondary: "#392516",
		border: "#f0c689"
	},
	apex: {
		accent: "#8b7cff",
		metallic: "#d7d0ff",
		glowColor: "rgba(139,124,255,0.3)",
		primary: "#120f1d",
		secondary: "#211a35",
		border: "#a79cff"
	},
	legacy: {
		accent: "#d9b85b",
		metallic: "#f2e2af",
		glowColor: "rgba(217,184,91,0.3)",
		primary: "#17130d",
		secondary: "#2d210f",
		border: "#f0d899"
	},
	iconic: {
		accent: "#ff678a",
		metallic: "#ffc4d1",
		glowColor: "rgba(255,103,138,0.3)",
		primary: "#1a0e12",
		secondary: "#34171f",
		border: "#f7a6b9"
	}
};
var ATTR_VIZ_OPTIONS = [
	{
		id: "bars",
		label: "Bars"
	},
	{
		id: "segmented",
		label: "Segmented"
	},
	{
		id: "radial",
		label: "Radial"
	},
	{
		id: "angular",
		label: "Angular"
	},
	{
		id: "minimal",
		label: "Minimal"
	},
	{
		id: "analytical",
		label: "Analytical"
	}
];
var CARD_THEME_BANK = [
	{
		name: "Gold Pulse",
		primary: "#100d09",
		secondary: "#2e220d",
		accent: "#f3c76c",
		border: "#e8d9a3",
		text: "#f6f1e6",
		attrColor: "#f4d88f",
		ratingColor: "#fef7e1",
		metallic: "#fbe7b6",
		glowColor: "rgba(243,199,108,0.22)"
	},
	{
		name: "Ice Blue",
		primary: "#081821",
		secondary: "#102c3d",
		accent: "#7dd4ff",
		border: "#c6f0ff",
		text: "#edfafe",
		attrColor: "#a9ebff",
		ratingColor: "#f0fbff",
		metallic: "#ddf8ff",
		glowColor: "rgba(125,212,255,0.22)"
	},
	{
		name: "Jade Burst",
		primary: "#071b17",
		secondary: "#12342a",
		accent: "#5fe29c",
		border: "#c7f5d8",
		text: "#ebfff3",
		attrColor: "#9ef3bf",
		ratingColor: "#f1fff8",
		metallic: "#d1f9e1",
		glowColor: "rgba(95,226,156,0.22)"
	},
	{
		name: "Crimson Vibe",
		primary: "#180d14",
		secondary: "#341c28",
		accent: "#ff688a",
		border: "#ffc0ce",
		text: "#fff0f5",
		attrColor: "#ffb5c7",
		ratingColor: "#fff2f6",
		metallic: "#ffdfe9",
		glowColor: "rgba(255,104,138,0.22)"
	},
	{
		name: "Electric Violet",
		primary: "#100f1a",
		secondary: "#231d38",
		accent: "#8d7dff",
		border: "#d4cdfd",
		text: "#f4f1ff",
		attrColor: "#cabdff",
		ratingColor: "#f4f1ff",
		metallic: "#e7e0ff",
		glowColor: "rgba(141,125,255,0.22)"
	},
	{
		name: "Sunset Red",
		primary: "#1b0d0b",
		secondary: "#362118",
		accent: "#ff8658",
		border: "#ffd2bb",
		text: "#fff3ee",
		attrColor: "#ffb79f",
		ratingColor: "#fff4ef",
		metallic: "#ffe2d6",
		glowColor: "rgba(255,134,88,0.2)"
	},
	{
		name: "Forest Mist",
		primary: "#0d1210",
		secondary: "#172e22",
		accent: "#81d49d",
		border: "#d3f3d9",
		text: "#f5fff6",
		attrColor: "#b9f0c1",
		ratingColor: "#f0fff5",
		metallic: "#dffae4",
		glowColor: "rgba(129,212,157,0.22)"
	},
	{
		name: "Slate Steel",
		primary: "#0a1014",
		secondary: "#1f2f3a",
		accent: "#a3b8c7",
		border: "#dfeaf2",
		text: "#f2f7fb",
		attrColor: "#c8d9ea",
		ratingColor: "#f6fbff",
		metallic: "#edf4f9",
		glowColor: "rgba(163,184,199,0.2)"
	},
	{
		name: "Amber Sky",
		primary: "#181209",
		secondary: "#2c250e",
		accent: "#ffbe4d",
		border: "#ffe3a3",
		text: "#fff8e8",
		attrColor: "#ffd77d",
		ratingColor: "#fff8de",
		metallic: "#ffeec2",
		glowColor: "rgba(255,190,77,0.22)"
	},
	{
		name: "Night Flux",
		primary: "#0b0d15",
		secondary: "#171c2b",
		accent: "#68a9ff",
		border: "#d2e2ff",
		text: "#eef5ff",
		attrColor: "#b0d0ff",
		ratingColor: "#f0f6ff",
		metallic: "#dfeefe",
		glowColor: "rgba(104,169,255,0.22)"
	},
	{
		name: "Rose Gold",
		primary: "#17120f",
		secondary: "#2b1d1a",
		accent: "#ffb7a2",
		border: "#fce2d7",
		text: "#fff1ec",
		attrColor: "#ffd0c3",
		ratingColor: "#fff6f2",
		metallic: "#ffe7df",
		glowColor: "rgba(255,183,162,0.22)"
	},
	{
		name: "Emerald Halo",
		primary: "#091711",
		secondary: "#163227",
		accent: "#6ce9bb",
		border: "#d9f7e8",
		text: "#f0fff9",
		attrColor: "#aaf5d3",
		ratingColor: "#f3fff9",
		metallic: "#dffef0",
		glowColor: "rgba(108,233,187,0.22)"
	},
	{
		name: "Royal Navy",
		primary: "#0b1220",
		secondary: "#182844",
		accent: "#6ca8ff",
		border: "#d9e7ff",
		text: "#edf5ff",
		attrColor: "#bfd7ff",
		ratingColor: "#f1f7ff",
		metallic: "#ddeafe",
		glowColor: "rgba(108,168,255,0.22)"
	},
	{
		name: "Pink Laser",
		primary: "#180d18",
		secondary: "#331d34",
		accent: "#ff75d3",
		border: "#ffd7f3",
		text: "#fff3fb",
		attrColor: "#ffbddf",
		ratingColor: "#fff4fb",
		metallic: "#ffe5f5",
		glowColor: "rgba(255,117,211,0.2)"
	},
	{
		name: "Cobalt Edge",
		primary: "#0d1220",
		secondary: "#1e2d47",
		accent: "#5ea7ff",
		border: "#d7e8ff",
		text: "#edf5ff",
		attrColor: "#b8d6ff",
		ratingColor: "#f2f8ff",
		metallic: "#dfeeff",
		glowColor: "rgba(94,167,255,0.22)"
	},
	{
		name: "Citrus X",
		primary: "#18160b",
		secondary: "#2b2a13",
		accent: "#dfe96e",
		border: "#f5ffc4",
		text: "#fafdd6",
		attrColor: "#eaf89d",
		ratingColor: "#fffde8",
		metallic: "#f5f9c4",
		glowColor: "rgba(223,233,110,0.2)"
	}
];
var CAPTAIN_SIGNATURE_STYLE = {
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
	variant: "icon"
};
var CARD_PRESET_THEMES = [...[
	{
		id: "featured-cyber-titan",
		name: "Cyber-Titan Hybrid",
		style: mergeCardStyle({
			primary: "#070b12",
			secondary: "#101c2c",
			accent: "#5be7ff",
			border: "#d9f7ff",
			text: "#f3fbff",
			attrColor: "#83efff",
			ratingColor: "#ffffff",
			metallic: "#d7edf5",
			glowColor: "rgba(91,231,255,0.32)",
			variant: "titan",
			showTactical: true,
			showGrid: true,
			patternOpacity: .24,
			glowIntensity: .68,
			shadowIntensity: .6,
			highlightIntensity: .58,
			borderWidth: 2
		})
	},
	{
		id: "featured-garden-legacy",
		name: "Garden Legacy",
		style: mergeCardStyle({
			primary: "#10150f",
			secondary: "#20351f",
			accent: "#b8df86",
			border: "#e6f4c5",
			text: "#f5fbe9",
			attrColor: "#cdeca1",
			ratingColor: "#fffde9",
			metallic: "#e4efbd",
			glowColor: "rgba(184,223,134,0.28)",
			variant: "floral",
			showTactical: false,
			showGrid: true,
			patternOpacity: .2,
			glowIntensity: .48,
			shadowIntensity: .48,
			highlightIntensity: .5
		})
	},
	{
		id: "featured-heritage-gold",
		name: "Academy Heritage Gold",
		style: mergeCardStyle({
			primary: "#171006",
			secondary: "#3a260b",
			accent: "#f4c85e",
			border: "#fff0b0",
			text: "#fff9e8",
			attrColor: "#f7d87e",
			ratingColor: "#fffbe9",
			metallic: "#ffe9a8",
			glowColor: "rgba(244,200,94,0.34)",
			variant: "heritage",
			showTactical: false,
			showGrid: false,
			patternOpacity: .08,
			glowIntensity: .62,
			shadowIntensity: .58,
			highlightIntensity: .72,
			borderWidth: 2.2
		})
	}
], ...Array.from({ length: 140 }, (_, index) => {
	const base = CARD_THEME_BANK[index % CARD_THEME_BANK.length];
	const referenceNames = [
		"Non-Rare Concept",
		"Rare Concept",
		"Special Concept",
		"Bronze Core",
		"Silver Core",
		"Gold Core",
		"TOTY Gold",
		"FUT Showdown",
		"Fantasy Green",
		"Prime Hero",
		"Prime Hero Plus",
		"Trailblazer",
		"FUT Heroes",
		"Flashback Shock",
		"Squad Foundations",
		"World Tour",
		"World Tour Superstar",
		"Champions League",
		"Europa League",
		"UCL RTTK",
		"Icon",
		"Hall of Fame",
		"Hero",
		"World Cup Hero",
		"Ones to Watch",
		"In-Form",
		"Big Time",
		"Show Time",
		"Akan Future Star"
	];
	const tone = index % 2 === 0 ? {
		accent: base.accent,
		glowColor: base.glowColor
	} : {
		accent: base.accent,
		glowColor: base.glowColor
	};
	const variants = [
		"prism",
		"hologram",
		"chrome",
		"cyber",
		"glitch",
		"eclipse",
		"crystal",
		"manga",
		"lava",
		"aurora",
		"circuit",
		"relic",
		"dimension",
		"cosmic",
		"street",
		"quantum",
		"royal",
		"phantom",
		"velocity",
		"show-time",
		"toty",
		"icon",
		"hero",
		"flashback",
		"champions",
		"big-time",
		"prism",
		"hologram",
		"chrome",
		"cyber"
	];
	const vaultNames = [
		"Prism Future",
		"Holo Genesis",
		"Chrome Phantom",
		"Cyber Striker",
		"Glitchwave",
		"Eclipse Blackout",
		"Crystal Crown",
		"Manga Impact",
		"Lava Rush",
		"Aurora Pulse",
		"Circuit Breaker",
		"Relic Prime",
		"Dimension Shift",
		"Cosmic Eleven",
		"Street Kings",
		"Quantum Rare",
		"Royal Command",
		"Phantom XI",
		"Velocity X",
		"Neon Show Time",
		"TOTY Radiant",
		"Icon Sovereign",
		"Hero Ascension",
		"Flashback Gold",
		"Champions Voltage",
		"Big Time Mechanism",
		"Prism Afterdark",
		"Holo Spectrum",
		"Chrome Gold",
		"Cyber Neon",
		"Glitch Rewind",
		"Eclipse Solar",
		"Crystal Ice",
		"Manga Supernova",
		"Lava Inferno",
		"Aurora Borealis",
		"Circuit Gold",
		"Relic Vault",
		"Dimension Zero",
		"Cosmic Storm",
		"Street Art",
		"Quantum Blue",
		"Royal Velvet",
		"Phantom Glass",
		"Velocity Carbon",
		"Show Time Ultra",
		"TOTY Black",
		"Icon Eternal",
		"Hero Wildcard",
		"Flashback Fire",
		"Champions Nova",
		"Big Time Gold",
		"Prism Galaxy",
		"Holo Mirage",
		"Chrome Inferno",
		"Cyber Matrix",
		"Glitch Static",
		"Eclipse Moon",
		"Crystal Bloom",
		"Manga Lightning",
		"Lava Core",
		"Aurora Mint",
		"Circuit Pulse",
		"Relic Bronze",
		"Dimension Gold",
		"Cosmic Rift",
		"Street Spectrum",
		"Quantum Red",
		"Royal Blue",
		"Phantom Silver",
		"Velocity Gold"
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
			patternOpacity: .12 + index % 7 * .02,
			borderWidth: 1.4 + index % 5 * .25,
			glowIntensity: .32 + index % 9 * .05,
			shadowIntensity: .38 + index % 6 * .06
		}
	};
})];
function mergeCardStyle(partial) {
	return {
		...DEFAULT_CARD_STYLE,
		...partial
	};
}
function styleToCssVars(style) {
	const s = mergeCardStyle(style);
	const v = {
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
		"--ps-scale": String(s.playstyleScale)
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
	if (s.generatedBackground) v["--pc-generated-bg"] = s.generatedBackground;
	if (s.gridColor) v["--pc-grid"] = s.gridColor;
	return v;
}
var PLAYSTYLE_CATEGORY_LABELS = {
	scoring: "Scoring",
	passing: "Passing",
	ball_control: "Ball Control",
	defending: "Defending",
	physical: "Physical",
	goalkeeping: "Goalkeeping"
};
var PLAYSTYLES = [
	{
		id: "acrobatic",
		name: "Acrobatic",
		category: "scoring",
		icon: "RotateCw",
		effect: "Better volleys and acrobatic finishes.",
		effectPlus: "Elite volley accuracy with advanced acrobatic finishes."
	},
	{
		id: "chip_shot",
		name: "Chip Shot",
		category: "scoring",
		icon: "ArrowUpRight",
		effect: "Faster, more accurate chip shots.",
		effectPlus: "Much faster, highly accurate chip shots."
	},
	{
		id: "dead_ball",
		name: "Dead Ball",
		category: "scoring",
		icon: "Target",
		effect: "Better free kicks and set pieces.",
		effectPlus: "Elite set-piece accuracy and control."
	},
	{
		id: "finesse_shot",
		name: "Finesse Shot",
		category: "scoring",
		icon: "Wand2",
		effect: "Faster finesse shots with more curve.",
		effectPlus: "Maximum curve and exceptional finesse accuracy."
	},
	{
		id: "gamechanger",
		name: "Gamechanger",
		category: "scoring",
		icon: "Sparkles",
		effect: "Improved flair finishing, unlocks trivela shots.",
		effectPlus: "Greatly enhanced creative finishing consistency."
	},
	{
		id: "low_driven_shot",
		name: "Low Driven Shot",
		category: "scoring",
		icon: "Zap",
		effect: "More effective, accurate low driven shots.",
		effectPlus: "Significantly enhanced low driven finishing."
	},
	{
		id: "power_shot",
		name: "Power Shot",
		category: "scoring",
		icon: "Rocket",
		effect: "Faster power shots.",
		effectPlus: "Major increase in power shot speed."
	},
	{
		id: "power_header",
		name: "Power Header",
		category: "scoring",
		icon: "Flame",
		effect: "More powerful, accurate headers.",
		effectPlus: "Elite heading power and accuracy."
	},
	{
		id: "precision_header",
		name: "Precision Header",
		category: "scoring",
		icon: "Crosshair",
		effect: "Better header accuracy and control.",
		effectPlus: "Much greater heading accuracy and consistency."
	},
	{
		id: "trivela",
		name: "Trivela",
		category: "scoring",
		icon: "Shuffle",
		effect: "Improved outside-foot shots.",
		effectPlus: "Significantly improved trivela consistency."
	},
	{
		id: "incisive_pass",
		name: "Incisive Pass",
		category: "passing",
		icon: "Send",
		effect: "More accurate through balls and precision passes.",
		effectPlus: "Even more dangerous, accurate through balls."
	},
	{
		id: "inventive",
		name: "Inventive",
		category: "passing",
		icon: "Lightbulb",
		effect: "Improved fancy and trivela passes.",
		effectPlus: "Greatly improved fancy/trivela pass accuracy."
	},
	{
		id: "long_ball_pass",
		name: "Long Ball Pass",
		category: "passing",
		icon: "Navigation",
		effect: "More accurate, faster lofted passes.",
		effectPlus: "Extremely accurate, hard-to-intercept long balls."
	},
	{
		id: "pinged_pass",
		name: "Pinged Pass",
		category: "passing",
		icon: "Radio",
		effect: "Faster passes, cleaner reception.",
		effectPlus: "Much faster passes with excellent reception."
	},
	{
		id: "tiki_taka",
		name: "Tiki Taka",
		category: "passing",
		icon: "Repeat",
		effect: "Better first-time and short passing.",
		effectPlus: "Elite accuracy on difficult short passes."
	},
	{
		id: "whipped_pass",
		name: "Whipped Pass",
		category: "passing",
		icon: "Wind",
		effect: "More accurate, curved crosses.",
		effectPlus: "Powerful, driven crosses with great accuracy."
	},
	{
		id: "first_touch",
		name: "First Touch",
		category: "ball_control",
		icon: "Feather",
		effect: "Cleaner traps, faster transition to dribble.",
		effectPlus: "Excellent first touches, near-instant transitions."
	},
	{
		id: "press_proven",
		name: "Press Proven",
		category: "ball_control",
		icon: "ShieldCheck",
		effect: "Better ball control under pressure.",
		effectPlus: "Elite shielding and control when pressed."
	},
	{
		id: "rapid",
		name: "Rapid",
		category: "ball_control",
		icon: "Gauge",
		effect: "Faster dribbling and sprinting on the ball.",
		effectPlus: "Significantly faster ball carrying."
	},
	{
		id: "technical",
		name: "Technical",
		category: "ball_control",
		icon: "Compass",
		effect: "Faster controlled sprint, precise turns.",
		effectPlus: "Elite controlled sprint speed and turning."
	},
	{
		id: "trickster",
		name: "Trickster",
		category: "ball_control",
		icon: "Wand",
		effect: "Access to advanced skill moves.",
		effectPlus: "More advanced, consistent skill moves."
	},
	{
		id: "aerial_fortress",
		name: "Aerial Fortress",
		category: "defending",
		icon: "Mountain",
		effect: "Better aerial ability and defensive heading.",
		effectPlus: "Elite aerial dominance."
	},
	{
		id: "anticipate",
		name: "Anticipate",
		category: "defending",
		icon: "Eye",
		effect: "Better standing tackles, keeps ball after winning it.",
		effectPlus: "Elite standing tackles and ball retention."
	},
	{
		id: "block",
		name: "Block",
		category: "defending",
		icon: "Square",
		effect: "Better reach and success blocking shots/passes.",
		effectPlus: "Elite reach and block success rate."
	},
	{
		id: "intercept",
		name: "Intercept",
		category: "defending",
		icon: "Radar",
		effect: "Better interception reach and retention.",
		effectPlus: "Elite interception reach and retention."
	},
	{
		id: "jockey",
		name: "Jockey",
		category: "defending",
		icon: "Move",
		effect: "Faster sprint jockeying and transitions.",
		effectPlus: "Much faster, more responsive jockeying."
	},
	{
		id: "slide_tackle",
		name: "Slide Tackle",
		category: "defending",
		icon: "Slash",
		effect: "Improved, more reliable slide tackles.",
		effectPlus: "Stronger, highly consistent slide tackles."
	},
	{
		id: "bruiser",
		name: "Bruiser",
		category: "physical",
		icon: "Dumbbell",
		effect: "Greater strength in physical challenges.",
		effectPlus: "Elite physical tackling strength."
	},
	{
		id: "enforcer",
		name: "Enforcer",
		category: "physical",
		icon: "ShieldAlert",
		effect: "Stronger shielding and shoulder challenges.",
		effectPlus: "Elite shielding and shoulder-challenge strength."
	},
	{
		id: "long_throw",
		name: "Long Throw",
		category: "physical",
		icon: "MoveDiagonal",
		effect: "Throw-ins travel farther.",
		effectPlus: "Maximum-distance throw-ins."
	},
	{
		id: "quick_step",
		name: "Quick Step",
		category: "physical",
		icon: "TrendingUp",
		effect: "Faster acceleration on explosive sprints.",
		effectPlus: "Significantly faster acceleration."
	},
	{
		id: "relentless",
		name: "Relentless",
		category: "physical",
		icon: "Infinity",
		effect: "Less fatigue, better recovery.",
		effectPlus: "Greatly reduced fatigue, excellent recovery."
	},
	{
		id: "cross_claimer",
		name: "Cross Claimer",
		category: "goalkeeping",
		icon: "Hand",
		effect: "Aggressively claims crosses, stronger punches.",
		effectPlus: "Elite cross claiming and punching power.",
		positions: ["GK"]
	},
	{
		id: "deflector",
		name: "Deflector",
		category: "goalkeeping",
		icon: "Shield",
		effect: "Pushes dangerous shots away safely.",
		effectPlus: "Excellent deflections and safer save outcomes.",
		positions: ["GK"]
	},
	{
		id: "far_reach",
		name: "Far Reach",
		category: "goalkeeping",
		icon: "Ruler",
		effect: "Reaches long-distance shots better.",
		effectPlus: "Elite diving reach.",
		positions: ["GK"]
	},
	{
		id: "far_throw",
		name: "Far Throw",
		category: "goalkeeping",
		icon: "Plane",
		effect: "Throws the ball much farther.",
		effectPlus: "Maximum-distance distribution.",
		positions: ["GK"]
	},
	{
		id: "footwork",
		name: "Footwork",
		category: "goalkeeping",
		icon: "Footprints",
		effect: "Uses feet more often to make saves.",
		effectPlus: "Excellent foot saves, especially low shots.",
		positions: ["GK"]
	},
	{
		id: "quick_reflexes",
		name: "Quick Reflexes",
		category: "goalkeeping",
		icon: "Activity",
		effect: "Faster reflex saves and reactions.",
		effectPlus: "Elite reflexes and reaction speed.",
		positions: ["GK"]
	},
	{
		id: "rush_out",
		name: "Rush Out",
		category: "goalkeeping",
		icon: "Flag",
		effect: "More aggressive coming off the line for 1v1s.",
		effectPlus: "Elite rushing decisions and close-shot reactions.",
		positions: ["GK"]
	}
];
var PLAYSTYLE_MAP = Object.fromEntries(PLAYSTYLES.map((p) => [p.id, p]));
function playStyleById(id) {
	return PLAYSTYLE_MAP[id];
}
/**
* Realistic, capped OVR bonus from PlayStyles.
*
* `playStylesPlus` is a subset — a style upgraded to "+" should NOT also be
* counted as a normal-tier bonus, it's the elite version of the same style.
*
* Bonus math: +1 OVR per normal style (up to 7), +2 OVR per "+" style (up to 3),
* but the COMBINED total is hard-capped at +6 — so even a fully loaded card
* gets a believable nudge, never a +20 swing. Tune MAX_TOTAL_BONUS below if
* you want cards to feel stronger or weaker.
*/
var MAX_TOTAL_BONUS = 6;
function computePlayStyleBonus(playStyles = [], playStylesPlus = []) {
	const normalOnly = playStyles.filter((id) => !playStylesPlus.includes(id));
	const normalBonus = Math.min(normalOnly.length, 7) * 1;
	const plusBonus = Math.min(playStylesPlus.length, 3) * 2;
	return Math.min(normalBonus + plusBonus, MAX_TOTAL_BONUS);
}
/** Position-dependent OVR weights. Easy to retune. */
var OVR_WEIGHTS = {
	GK: {
		pac: .1,
		sho: 0,
		pas: .15,
		dri: .05,
		def: .35,
		phy: .35
	},
	SW: {
		pac: .12,
		sho: 0,
		pas: .22,
		dri: .06,
		def: .38,
		phy: .22
	},
	CB: {
		pac: .1,
		sho: 0,
		pas: .2,
		dri: .05,
		def: .4,
		phy: .25
	},
	LCB: {
		pac: .1,
		sho: 0,
		pas: .2,
		dri: .05,
		def: .4,
		phy: .25
	},
	RCB: {
		pac: .1,
		sho: 0,
		pas: .2,
		dri: .05,
		def: .4,
		phy: .25
	},
	LB: {
		pac: .2,
		sho: .05,
		pas: .2,
		dri: .15,
		def: .3,
		phy: .1
	},
	RB: {
		pac: .2,
		sho: .05,
		pas: .2,
		dri: .15,
		def: .3,
		phy: .1
	},
	LWB: {
		pac: .25,
		sho: .08,
		pas: .2,
		dri: .2,
		def: .17,
		phy: .1
	},
	RWB: {
		pac: .25,
		sho: .08,
		pas: .2,
		dri: .2,
		def: .17,
		phy: .1
	},
	CDM: {
		pac: .1,
		sho: .08,
		pas: .22,
		dri: .12,
		def: .28,
		phy: .2
	},
	LDM: {
		pac: .1,
		sho: .08,
		pas: .22,
		dri: .12,
		def: .28,
		phy: .2
	},
	RDM: {
		pac: .1,
		sho: .08,
		pas: .22,
		dri: .12,
		def: .28,
		phy: .2
	},
	CM: {
		pac: .1,
		sho: .1,
		pas: .3,
		dri: .2,
		def: .15,
		phy: .15
	},
	LCM: {
		pac: .1,
		sho: .1,
		pas: .3,
		dri: .2,
		def: .15,
		phy: .15
	},
	RCM: {
		pac: .1,
		sho: .1,
		pas: .3,
		dri: .2,
		def: .15,
		phy: .15
	},
	CAM: {
		pac: .12,
		sho: .22,
		pas: .28,
		dri: .28,
		def: .02,
		phy: .08
	},
	LAM: {
		pac: .18,
		sho: .2,
		pas: .24,
		dri: .28,
		def: .02,
		phy: .08
	},
	RAM: {
		pac: .18,
		sho: .2,
		pas: .24,
		dri: .28,
		def: .02,
		phy: .08
	},
	LM: {
		pac: .22,
		sho: .12,
		pas: .22,
		dri: .28,
		def: .08,
		phy: .08
	},
	RM: {
		pac: .22,
		sho: .12,
		pas: .22,
		dri: .28,
		def: .08,
		phy: .08
	},
	LW: {
		pac: .25,
		sho: .2,
		pas: .15,
		dri: .3,
		def: .05,
		phy: .05
	},
	RW: {
		pac: .25,
		sho: .2,
		pas: .15,
		dri: .3,
		def: .05,
		phy: .05
	},
	LF: {
		pac: .2,
		sho: .3,
		pas: .15,
		dri: .25,
		def: .02,
		phy: .08
	},
	RF: {
		pac: .2,
		sho: .3,
		pas: .15,
		dri: .25,
		def: .02,
		phy: .08
	},
	CF: {
		pac: .18,
		sho: .38,
		pas: .12,
		dri: .18,
		def: 0,
		phy: .14
	},
	ST: {
		pac: .2,
		sho: .4,
		pas: .1,
		dri: .2,
		def: 0,
		phy: .1
	},
	SS: {
		pac: .18,
		sho: .32,
		pas: .18,
		dri: .24,
		def: 0,
		phy: .08
	}
};
var GK_OVR_WEIGHTS = {
	div: .2,
	han: .2,
	kic: .1,
	ref: .25,
	spd: .1,
	pos: .15
};
function groupOf(pos) {
	if (pos === "GK") return "GK";
	if ([
		"SW",
		"CB",
		"LCB",
		"RCB"
	].includes(pos)) return "CB";
	if (["LB", "RB"].includes(pos)) return "FB";
	if (["LWB", "RWB"].includes(pos)) return "WB";
	if ([
		"CDM",
		"LDM",
		"RDM"
	].includes(pos)) return "DM";
	if ([
		"CM",
		"LCM",
		"RCM"
	].includes(pos)) return "CM";
	if ([
		"CAM",
		"LAM",
		"RAM"
	].includes(pos)) return "AM";
	if (["LM", "RM"].includes(pos)) return "WM";
	if ([
		"LW",
		"RW",
		"LF",
		"RF"
	].includes(pos)) return "W";
	return "ST";
}
var AFFINITY = {
	GK: {
		GK: 1,
		CB: .25,
		FB: .15,
		WB: .1,
		DM: .1,
		CM: .05,
		AM: .02,
		WM: .02,
		W: .02,
		ST: .02
	},
	CB: {
		GK: .2,
		CB: 1,
		FB: .7,
		WB: .5,
		DM: .75,
		CM: .45,
		AM: .2,
		WM: .25,
		W: .15,
		ST: .12
	},
	FB: {
		GK: .1,
		CB: .65,
		FB: 1,
		WB: .9,
		DM: .5,
		CM: .45,
		AM: .3,
		WM: .7,
		W: .55,
		ST: .2
	},
	WB: {
		GK: .08,
		CB: .4,
		FB: .85,
		WB: 1,
		DM: .4,
		CM: .5,
		AM: .45,
		WM: .85,
		W: .75,
		ST: .3
	},
	DM: {
		GK: .1,
		CB: .7,
		FB: .5,
		WB: .4,
		DM: 1,
		CM: .85,
		AM: .5,
		WM: .4,
		W: .25,
		ST: .2
	},
	CM: {
		GK: .05,
		CB: .4,
		FB: .45,
		WB: .5,
		DM: .8,
		CM: 1,
		AM: .8,
		WM: .65,
		W: .45,
		ST: .35
	},
	AM: {
		GK: .02,
		CB: .2,
		FB: .3,
		WB: .4,
		DM: .4,
		CM: .75,
		AM: 1,
		WM: .7,
		W: .7,
		ST: .65
	},
	WM: {
		GK: .02,
		CB: .2,
		FB: .65,
		WB: .8,
		DM: .35,
		CM: .6,
		AM: .7,
		WM: 1,
		W: .9,
		ST: .5
	},
	W: {
		GK: .02,
		CB: .12,
		FB: .5,
		WB: .7,
		DM: .2,
		CM: .4,
		AM: .7,
		WM: .85,
		W: 1,
		ST: .7
	},
	ST: {
		GK: .02,
		CB: .12,
		FB: .2,
		WB: .3,
		DM: .18,
		CM: .35,
		AM: .65,
		WM: .5,
		W: .7,
		ST: 1
	}
};
function emptySix() {
	return {
		pac: 70,
		sho: 70,
		pas: 70,
		dri: 70,
		def: 70,
		phy: 70
	};
}
function emptyGk() {
	return {
		div: 70,
		han: 70,
		kic: 70,
		ref: 70,
		spd: 70,
		pos: 70
	};
}
function spreadDetail(six) {
	const j = (n, d) => clamp(Math.round(n + d), 1, 99);
	return {
		acceleration: j(six.pac, 2),
		sprintSpeed: j(six.pac, -1),
		finishing: j(six.sho, 1),
		shotPower: j(six.sho, 0),
		longShots: j(six.sho, -3),
		volleys: j(six.sho, -4),
		attackingPosition: j(six.sho, 2),
		shortPassing: j(six.pas, 2),
		longPassing: j(six.pas, -1),
		vision: j(six.pas, 1),
		crossing: j(six.pas, -2),
		curve: j(six.pas, -3),
		fkAccuracy: j(six.pas, -4),
		dribbling: j(six.dri, 1),
		ballControl: j(six.dri, 2),
		agility: j(six.dri, 0),
		balance: j(six.dri, -1),
		reactions: j(six.dri, 1),
		defensiveAwareness: j(six.def, 2),
		standingTackle: j(six.def, 1),
		slidingTackle: j(six.def, -2),
		interceptions: j(six.def, 0),
		headingAccuracy: j(six.def, -1),
		strength: j(six.phy, 1),
		stamina: j(six.phy, 2),
		aggression: j(six.phy, 0),
		jumping: j(six.phy, -1)
	};
}
function ovrFromSix(six, pos) {
	const w = OVR_WEIGHTS[pos];
	const raw = six.pac * w.pac + six.sho * w.sho + six.pas * w.pas + six.dri * w.dri + six.def * w.def + six.phy * w.phy;
	return clamp(Math.round(raw), 1, 99);
}
function ovrFromGk(gk) {
	const raw = gk.div * GK_OVR_WEIGHTS.div + gk.han * GK_OVR_WEIGHTS.han + gk.kic * GK_OVR_WEIGHTS.kic + gk.ref * GK_OVR_WEIGHTS.ref + gk.spd * GK_OVR_WEIGHTS.spd + gk.pos * GK_OVR_WEIGHTS.pos;
	return clamp(Math.round(raw), 1, 99);
}
function isGoalkeeper(pos) {
	return pos === "GK";
}
/**
* Small, capped OVR nudge from weak foot / skill moves — only 5-star ratings
* matter, +1 OVR each, max +2 total. Kept tiny on purpose so a 5★/5★ card
* isn't a different player, just a slightly more complete one.
*/
function starBonus(weakFoot, skillMoves) {
	return (weakFoot >= 5 ? 1 : 0) + (skillMoves >= 5 ? 1 : 0);
}
function baseOvr(player) {
	if (isGoalkeeper(player.position) && player.gkBase) return ovrFromGk(player.gkBase);
	return clamp(ovrFromSix(player.baseSix, player.position) + starBonus(player.weakFoot, player.skillMoves), 1, 99);
}
/**
* Current OVR. Stat-based rating + star bonus + a small, capped PlayStyle
* bonus (see computePlayStyleBonus in ./playstyles — up to +6 total,
* scaled down further per position below). PlayStyles are a *developed*
* trait, so this bonus lives here (not in baseOvr, which represents the
* player's raw stat floor before traits are factored in).
*
* The bonus is scaled by how relevant PlayStyles are to the position —
* a GK's PlayStyles are all goalkeeping-specific and matter fully, but
* an outfield player's PlayStyles matter a bit less to a pure stat-based
* OVR than his actual six attributes do, so outfield gets 75% of the
* capped bonus. This keeps the nudge believable rather than making
* PlayStyles a backdoor way to inflate OVR.
*/
function playStyleOvrBonus(player) {
	const raw = computePlayStyleBonus(player.playStyles, player.playStylesPlus);
	const scale = isGoalkeeper(player.position) ? 1 : .75;
	return Math.round(raw * scale);
}
function currentOvr(player) {
	return clamp((isGoalkeeper(player.position) && player.gkCurrent ? ovrFromGk(player.gkCurrent) : ovrFromSix(player.currentSix, player.position)) + (starBonus(player.weakFoot, player.skillMoves) + playStyleOvrBonus(player)), 1, 99);
}
function positionRating(player, pos) {
	if (pos === "GK") {
		if (player.gkCurrent) return ovrFromGk(player.gkCurrent);
		return ovrFromSix(player.currentSix, "GK");
	}
	return ovrFromSix(player.currentSix, pos);
}
function suitabilityPct(player, pos) {
	const rating = positionRating(player, pos);
	const a = AFFINITY[groupOf(player.position)]?.[groupOf(pos)] ?? .3;
	const secondary = player.secondaryPositions.includes(pos) ? 6 : 0;
	const preferred = player.position === pos ? 4 : 0;
	const mismatchPenalty = Math.max(0, (1 - a) * 42);
	const raw = 50 + 50 * (rating / 99) * a + secondary + preferred - mismatchPenalty;
	return clamp(Math.round(raw), 12, 99);
}
/**
* How much the displayed OVR should drop when a player is placed at `pos`.
* - Their actual listed position: NO penalty — positionRating already
*   reflects their real stats recalculated for that position, so there's
*   nothing to punish.
* - A position they've listed as a secondary position (genuinely can play
*   there): a light penalty only, capped low, since they're a real option
*   there, not a stretch.
* - Anywhere else: the full penalty, scaled by how unfamiliar the position
*   group is (via suitabilityPct/AFFINITY).
*/
function roleAdjustedRating(player, pos, precision = 1) {
	const base = positionRating(player, pos);
	if (pos === player.position) return clamp(base, 1, 99);
	const fit = suitabilityPct(player, pos);
	const isSecondary = player.secondaryPositions.includes(pos);
	const maxPenalty = isSecondary ? 12 : 36;
	const rate = isSecondary ? .15 : .38;
	const penalty = clamp((100 - fit) * (rate * precision), 0, maxPenalty);
	return clamp(Math.round(base - penalty), 1, 99);
}
function allSuitability(player) {
	return POSITIONS.map((pos) => ({
		pos,
		rating: positionRating(player, pos),
		pct: suitabilityPct(player, pos)
	})).sort((a, b) => b.pct - a.pct);
}
function rarityFor(ovr) {
	if (ovr >= 95) return "legendary";
	if (ovr >= 90) return "world";
	if (ovr >= 85) return "elite";
	if (ovr >= 80) return "gold";
	if (ovr >= 75) return "silver";
	return "bronze";
}
function resolvedDesign(player, ovr) {
	const design = normalizeCardDesign(player.cardDesign);
	if (design !== "auto") return design;
	return tierForOvr(ovr);
}
/** Recent match ratings (1–10) → form 0–10. */
function formFromRatings(ratings) {
	if (!ratings.length) return null;
	const last = ratings.slice(-5);
	const avg = last.reduce((a, b) => a + b, 0) / last.length;
	return Math.round(avg * 10) / 10;
}
/** Form 8.5 → +2; form 5.5 → −2. Permanent card is untouched. */
function formDelta(form) {
	if (form === null) return 0;
	return clamp(Math.round((form - 7) * .8), -2, 2);
}
function effectiveOvr(player, form) {
	return clamp(currentOvr(player) + formDelta(form), 1, 99);
}
function recommendRole(player) {
	const s = player.currentSix;
	const pos = player.position;
	if (pos === "GK") {
		if ((player.gkCurrent?.kic ?? 0) >= 80) return "Sweeper keeper";
		return "Shot stopper";
	}
	if ([
		"CB",
		"LCB",
		"RCB",
		"SW"
	].includes(pos)) {
		if (s.pas >= 80 && s.dri >= 70) return "Ball-playing CB";
		if (s.pac >= 78) return "Cover";
		return "Stopper";
	}
	if (["LB", "RB"].includes(pos)) {
		if (s.dri >= 78 && s.pac >= 80) return "Attacking full-back";
		return "Defensive full-back";
	}
	if (["LWB", "RWB"].includes(pos)) return s.dri >= 78 ? "Wing-back invert" : "Traditional wing-back";
	if ([
		"CDM",
		"LDM",
		"RDM"
	].includes(pos)) {
		if (s.pas >= 82 && s.dri >= 75) return "Deep-lying playmaker";
		if (s.def >= 82) return "Ball winner";
		return "Anchor";
	}
	if ([
		"CM",
		"LCM",
		"RCM"
	].includes(pos)) {
		if (s.phy >= 80 && s.def >= 72) return "Box-to-box";
		if (s.pas >= 84) return "Playmaker";
		return "Mezzala";
	}
	if ([
		"CAM",
		"LAM",
		"RAM"
	].includes(pos)) {
		if (s.sho >= 80) return "Shadow striker";
		return "Classic 10";
	}
	if ([
		"LW",
		"RW",
		"LM",
		"RM",
		"LF",
		"RF"
	].includes(pos)) {
		if (s.sho >= 78 && s.dri >= 80) return "Inside forward";
		if (s.pas >= 78) return "Inverted winger";
		return "Traditional winger";
	}
	if (s.phy >= 82 && s.sho >= 78) return "Target man";
	if (s.pac >= 84) return "Advanced forward";
	return "Pressing forward";
}
function playerStrengths(player) {
	const s = player.currentSix;
	const out = [];
	if (isGoalkeeper(player.position) && player.gkCurrent) {
		const g = player.gkCurrent;
		if (g.ref >= 80) out.push("Elite reflexes");
		if (g.div >= 80) out.push("Strong diving range");
		if (g.kic >= 78) out.push("Distributes over distance");
		if (g.han >= 80) out.push("Commands the box");
	} else {
		if (s.pac >= 82) out.push("Recovers and stretches with pace");
		if (s.sho >= 82) out.push("Clinical in the box");
		if (s.pas >= 82) out.push("Progresses play through the lines");
		if (s.dri >= 82) out.push("Beats a man in tight spaces");
		if (s.def >= 82) out.push("Reads danger early");
		if (s.phy >= 82) out.push("Wins duels and holds the line");
	}
	if (player.captain) out.push("On-pitch leader");
	if (!out.length) out.push("Balanced, coachable profile");
	return out.slice(0, 4);
}
function playerWeaknesses(player) {
	const s = player.currentSix;
	const out = [];
	if (isGoalkeeper(player.position) && player.gkCurrent) {
		const g = player.gkCurrent;
		if (g.spd < 60) out.push("Vulnerable in one-v-ones outside the box");
		if (g.kic < 65) out.push("Limited range on distribution");
	} else {
		if (s.pac < 62) out.push("Lacks recovery pace");
		if (s.sho < 55 && ![
			"CB",
			"LCB",
			"RCB",
			"GK",
			"CDM"
		].includes(player.position)) out.push("Needs a better end product");
		if (s.def < 55 && [
			"CB",
			"CDM",
			"LB",
			"RB"
		].includes(player.position)) out.push("Can be exposed defensively");
		if (s.phy < 60) out.push("Loses physical duels against stronger sides");
		if (s.pas < 60) out.push("Build-up can stall on the ball");
	}
	if (!out.length) out.push("No glaring hole — keep developing the weaker foot and decision speed");
	return out.slice(0, 3);
}
function ratingsForPlayer(playerId, matches) {
	return matches.filter((m) => typeof m.ratings?.[playerId] === "number").map((m) => m.ratings[playerId]);
}
/**
* On-form aura eligibility. Requires a real sample of recent match ratings —
* never guessed. Needs at least 3 rated appearances AND a genuinely
* exceptional recent average before the card is allowed to show it.
*/
var ON_FORM_MIN_RATINGS = 3;
var ON_FORM_THRESHOLD = 8.5;
function isOnForm(form, ratingsCount) {
	return ratingsCount >= ON_FORM_MIN_RATINGS && form !== null && form >= ON_FORM_THRESHOLD;
}
function derivePlayer(player, matches) {
	const ratings = ratingsForPlayer(player.id, matches);
	const form = formFromRatings(ratings);
	const ovr = currentOvr(player);
	const base = baseOvr(player);
	const effective = effectiveOvr(player, form);
	const avgRating = ratings.length ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : null;
	const goals = matches.reduce((s, m) => s + (m.goals?.[player.id] || 0), 0);
	const motm = matches.filter((m) => m.motm === player.id).length;
	return {
		ovr,
		base,
		effective,
		form,
		formDelta: formDelta(form),
		onForm: isOnForm(form, ratings.length),
		rarity: rarityFor(ovr),
		design: resolvedDesign(player, ovr),
		role: recommendRole(player),
		strengths: playerStrengths(player),
		weaknesses: playerWeaknesses(player),
		suitability: allSuitability(player),
		avgRating,
		ratingsCount: ratings.length,
		goals,
		motm
	};
}
var FIXTURES = [
	{
		date: "2026-09-02",
		opponent: "SAA",
		venue: "Home",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-09-08",
		opponent: "Makini Runda",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-09-12",
		opponent: "Hillcrest Tournament",
		venue: "Away",
		kickoff: "07:00",
		kind: "Tournament"
	},
	{
		date: "2026-09-14",
		opponent: "Rusinga",
		venue: "Home",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-09-17",
		opponent: "Nairobi Academy",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-09-21",
		opponent: "Braeside Thika",
		venue: "Home",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-09-26",
		opponent: "IPSSA Tournament @ Crawford",
		venue: "Away",
		kickoff: "07:00",
		kind: "Tournament"
	},
	{
		date: "2026-09-30",
		opponent: "Makini",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-10-01",
		opponent: "Oshwal",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-10-03",
		opponent: "Braeside Thika Tournament",
		venue: "Away",
		kickoff: "07:00",
		kind: "Tournament"
	},
	{
		date: "2026-10-28",
		opponent: "Crawford",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-11-04",
		opponent: "Woodcreek",
		venue: "Away",
		kickoff: "13:30",
		kind: "League"
	},
	{
		date: "2026-11-10",
		opponent: "Swaminarayan",
		venue: "Home",
		kickoff: "13:30",
		kind: "League"
	}
];
function fixtureMatch(id, f) {
	return {
		id,
		date: f.date,
		opponent: f.opponent,
		venue: f.venue,
		kickoff: f.kickoff,
		kind: f.kind,
		category: "U15",
		lineup: [],
		slotMap: {},
		ratings: {},
		goals: {},
		teamScore: null,
		opponentScore: null,
		motm: null
	};
}
var SESSIONS = [{
	id: "t-shape",
	date: "2026-08-25",
	title: "Shape + pressing triggers",
	category: "U15",
	attendance: {}
}, {
	id: "t-finish",
	date: "2026-08-28",
	title: "Finishing + set pieces",
	category: "U15",
	attendance: {}
}];
/** Fixtures and sessions only — no demo players, no Staff Select, no Pre-Season XI. */
function emptyData() {
	return {
		players: [],
		trainings: SESSIONS,
		matches: FIXTURES.map((f, i) => fixtureMatch(`fx-${i + 1}`, f)),
		trophies: [],
		coaches: [],
		callUps: [],
		opponentIntel: {
			strengths: "",
			weaknesses: ""
		},
		designPresets: [],
		meta: {
			seeded: false,
			version: 6
		}
	};
}
var FORMAT_LIST = {
	7: [
		"3-2-1",
		"2-3-1",
		"3-1-2",
		"2-2-2",
		"1-3-2"
	],
	8: [
		"3-3-1",
		"3-2-2",
		"2-3-2",
		"2-2-3",
		"4-2-1"
	],
	9: [
		"3-3-2",
		"3-2-3",
		"4-3-1",
		"4-2-2",
		"2-3-3"
	],
	11: [
		"4-4-2",
		"4-3-3",
		"4-2-3-1",
		"3-5-2",
		"3-4-3",
		"5-3-2",
		"5-4-1",
		"4-5-1",
		"4-2-2-2",
		"4-1-4-1",
		"4-3-1-2",
		"4-3-2-1",
		"4-2-4",
		"3-4-2-1",
		"3-4-1-2",
		"4-1-3-2",
		"3-2-4-1",
		"3-2-2-3",
		"3-1-4-2",
		"3-3-3-1",
		"2-3-5"
	]
};
var OPPONENT_DEFAULT = {
	7: "2-3-1",
	8: "3-3-1",
	9: "3-3-2",
	11: "4-4-2"
};
var FORMAT_EMPHASIS = {
	7: [
		"Quick transitions",
		"Small spaces",
		"Compactness",
		"1-v-1 situations",
		"Width",
		"Short passing combinations"
	],
	8: [
		"Midfield structure",
		"Width",
		"Defensive transitions",
		"Overloads"
	],
	9: [
		"More defined positional roles",
		"Midfield control",
		"Wide attacking play",
		"Defensive organisation"
	],
	11: [
		"Full tactical structures",
		"Pressing systems",
		"Build-up patterns",
		"Defensive blocks",
		"Transitions",
		"Positional rotations"
	]
};
var INFO = {
	"7:3-2-1": {
		adv: ["Very balanced with a strong defensive base.", "Two midfielders support both boxes and control the centre."],
		dis: ["Can lack width out wide.", "The lone striker becomes isolated between defensive lines."],
		bestFor: "Teams wanting defensive solidity without giving up a central presence.",
		requires: "Disciplined, high-work-rate central midfielders.",
		key: "Central midfielders, lone striker"
	},
	"7:2-3-1": {
		adv: ["Excellent midfield control with passing triangles.", "Good attacking support behind the striker."],
		dis: ["Only two defenders — vulnerable to counters.", "Wide areas can be exposed in transition."],
		bestFor: "Possession-based teams that want to dominate the middle third.",
		requires: "Two disciplined centre-backs comfortable defending space.",
		key: "Central midfield three"
	},
	"7:3-1-2": {
		adv: [
			"Strong defensive base of three.",
			"Two attackers give a real goal threat.",
			"The pivot screens the back line."
		],
		dis: ["Narrow — wide areas are thin.", "The lone pivot can be overloaded and isolated."],
		bestFor: "Counter-attacking teams looking to spring two strikers in behind.",
		requires: "A tireless, tactically aware defensive midfielder.",
		key: "Defensive midfielder, front two"
	},
	"7:2-2-2": {
		adv: ["Balanced and easy to coach.", "Natural passing triangles in every third."],
		dis: ["Can lack width.", "Midfield pair can be outnumbered centrally."],
		bestFor: "Younger or developing squads learning shape.",
		requires: "Players who understand rotation and cover.",
		key: "Central midfield pair"
	},
	"7:1-3-2": {
		adv: ["Extremely strong in midfield and attack.", "Ideal for dominating possession."],
		dis: ["Only one recognised defender.", "Extremely exposed to the counter-attack."],
		bestFor: "Teams facing weaker opposition who want to press and dominate the ball.",
		requires: "Excellent, fast defensive recovery from midfield.",
		key: "Lone sweeper, front two"
	},
	"8:3-3-1": {
		adv: [
			"Excellent balance across the pitch.",
			"Three defenders give real security.",
			"The striker always has midfield support."
		],
		dis: ["Lone striker can be isolated.", "Wide midfielders must track back consistently."],
		bestFor: "Teams wanting control without sacrificing defensive shape.",
		requires: "Box-to-box wide midfielders.",
		key: "Wide midfielders, lone striker"
	},
	"8:3-2-2": {
		adv: ["Balanced attack and defence.", "Two forwards combine well together."],
		dis: ["Can lack width.", "Midfield pair can be outnumbered."],
		bestFor: "Teams that want a compact, hard-to-break-down block that still attacks in twos.",
		requires: "Two centrally strong midfielders covering the whole width.",
		key: "Central midfield pair"
	},
	"8:2-3-2": {
		adv: ["Strong midfield presence.", "Two forwards create good attacking options."],
		dis: ["Only two defenders.", "Space appears behind the midfield line."],
		bestFor: "Possession-first teams willing to defend higher up.",
		requires: "A back two comfortable defending in open space.",
		key: "Central midfield three"
	},
	"8:2-2-3": {
		adv: ["Very attacking — three forwards create constant pressure.", "Good for teams looking to dominate territory."],
		dis: ["Midfield becomes exposed.", "Large gaps open between defence and attack."],
		bestFor: "Chasing a game or facing a weaker opponent.",
		requires: "Attackers who track back the moment the ball is lost.",
		key: "Front three"
	},
	"8:4-2-1": {
		adv: ["Strong defensive structure.", "Two holding midfielders shield the back four."],
		dis: ["Can become too defensive.", "The striker is often isolated."],
		bestFor: "Protecting a lead or facing a stronger attacking side.",
		requires: "A striker who can hold the ball up alone.",
		key: "Holding midfield pair"
	},
	"9:3-3-2": {
		adv: [
			"Very balanced with real defensive stability.",
			"Three midfielders control the centre.",
			"Two strikers give attacking options."
		],
		dis: ["Wide areas can be exposed.", "Midfielders carry heavy defensive responsibility."],
		bestFor: "All-round teams wanting control in every phase.",
		requires: "Versatile midfielders who can defend and create.",
		key: "Central midfield three"
	},
	"9:3-2-3": {
		adv: ["Excellent attacking width.", "Three attackers create constant problems for a back line."],
		dis: ["Midfield can be bypassed.", "Space opens between midfield and defence."],
		bestFor: "Front-foot teams looking to overwhelm a back three or four.",
		requires: "Wide attackers who track back defensively.",
		key: "Front three"
	},
	"9:4-3-1": {
		adv: [
			"Strong defensive foundation of four.",
			"Three midfielders provide control.",
			"The attacking midfielder links play to the striker."
		],
		dis: ["The striker can become isolated.", "Lacks natural width."],
		bestFor: "Teams building patiently through a number 10.",
		requires: "A creative attacking midfielder.",
		key: "Attacking midfielder, striker"
	},
	"9:4-2-2": {
		adv: ["Strong defensive structure.", "Two holding midfielders protect the back four."],
		dis: ["Can become narrow.", "Struggles against a three-man midfield."],
		bestFor: "Facing possession-heavy opposition.",
		requires: "Disciplined double pivot.",
		key: "Double pivot"
	},
	"9:2-3-3": {
		adv: ["Extremely attacking with constant pressure up front.", "Three midfielders provide good passing options."],
		dis: ["Only two defenders — very vulnerable to counters.", "Needs excellent defensive transition."],
		bestFor: "Chasing games against deeper defences.",
		requires: "Fast recovery runs from the front three.",
		key: "Front three, central midfield three"
	},
	"11:4-4-2": {
		adv: ["Simple, balanced, and easy to organise.", "Two strikers support each other centrally."],
		dis: ["Can be outnumbered in central midfield.", "Wingers must track back or full-backs are exposed."],
		bestFor: "Teams prioritising a clear, well-drilled defensive block.",
		requires: "Disciplined banks of four.",
		key: "Central midfield pair, front two"
	},
	"11:4-3-3": {
		adv: ["Excellent natural width from the front three.", "Three central midfielders control possession and pressing."],
		dis: ["Space appears behind advancing full-backs.", "Wingers must contribute defensively or midfield is overloaded."],
		bestFor: "Teams that want to press high and dominate the ball.",
		requires: "Wingers who track back and full-backs who overlap intelligently.",
		key: "Full-backs, central midfield three"
	},
	"11:4-2-3-1": {
		adv: ["Strong protection in front of the back four.", "The attacking three create constant chance-creation."],
		dis: ["The lone striker can be isolated.", "Can drop too deep and become passive."],
		bestFor: "Balanced teams wanting control without losing defensive solidity.",
		requires: "A creative number 10 and a striker comfortable playing alone.",
		key: "Double pivot, number 10"
	},
	"11:3-5-2": {
		adv: [
			"Numerical superiority in midfield.",
			"Wing-backs provide width without sacrificing a back three.",
			"Two strikers support each other."
		],
		dis: ["Huge space behind the wing-backs.", "Wing-backs face enormous physical demand."],
		bestFor: "Teams with elite, high-endurance wing-backs.",
		key: "Wing-backs",
		requires: "Wing-backs who can defend and attack a full flank alone."
	},
	"11:3-4-3": {
		adv: ["Three attackers stretch any back line.", "Strong pressing triggers from a front three."],
		dis: ["Space behind the wing-backs.", "Centre-backs can be exposed 3-v-3 in behind."],
		bestFor: "Aggressive, front-foot teams committed to pressing.",
		requires: "Elite defensive organisation and recovery pace.",
		key: "Wing-backs, front three"
	},
	"11:5-3-2": {
		adv: [
			"Very strong defensive structure.",
			"Central midfield three controls the middle.",
			"Two strikers threaten on the counter."
		],
		dis: ["Can become overly defensive.", "Wing-backs pinned deep, limiting attacking outlets."],
		bestFor: "Protecting a lead or facing a stronger opponent.",
		requires: "Central midfielders who can both defend and spring counters.",
		key: "Central midfield three"
	},
	"11:5-4-1": {
		adv: ["Extremely difficult to play through centrally.", "Excellent for protecting a result."],
		dis: ["The lone striker is isolated.", "Very limited attacking threat and low territorial control."],
		bestFor: "Underdogs needing to frustrate a stronger side.",
		requires: "Total defensive discipline from every outfield player.",
		key: "Back five"
	},
	"11:4-5-1": {
		adv: ["Dominant central midfield presence.", "Very compact and hard to break down."],
		dis: ["The lone striker is often isolated.", "Can become too defensive and cede attacking territory."],
		bestFor: "Away trips against stronger, possession-based sides.",
		requires: "Midfielders willing to make late forward runs to support the striker.",
		key: "Central midfield five"
	},
	"11:4-2-2-2": {
		adv: ["Two strikers plus two attacking midfielders overload the centre.", "Double pivot protects the back four."],
		dis: ["Often lacks natural width.", "Full-backs must provide almost all the width alone."],
		bestFor: "Teams building through combination play in central zones.",
		requires: "Full-backs comfortable being the primary width outlet.",
		key: "Full-backs, double pivot"
	},
	"11:4-1-4-1": {
		adv: ["Excellent central coverage across the midfield four.", "The holding midfielder screens the back line."],
		dis: ["The lone striker becomes isolated.", "Huge responsibility falls on the single holding midfielder."],
		bestFor: "Structured pressing teams defending as a block of five.",
		requires: "An elite, high-workrate defensive midfielder.",
		key: "Holding midfielder"
	},
	"11:4-3-1-2": {
		adv: ["Strong central midfield control.", "The number 10 links play between midfield and two strikers."],
		dis: ["Very narrow — fullbacks provide almost all width.", "Vulnerable against teams that attack down the flanks."],
		bestFor: "Teams building centrally with two strikers up top.",
		requires: "Full-backs who bomb forward relentlessly.",
		key: "Number 10, full-backs"
	},
	"11:4-3-2-1": {
		adv: ["Strong central midfield with layered attacking support.", "Good for patient possession football."],
		dis: ["Naturally narrow with limited width.", "The lone striker can be isolated."],
		bestFor: "Possession-dominant teams happy to work the ball centrally.",
		requires: "Fluid, rotating attacking midfielders.",
		key: "Attacking midfield three"
	},
	"11:4-2-4": {
		adv: ["Huge attacking numbers can overwhelm a defence.", "Four attackers stretch play horizontally and vertically."],
		dis: ["Only two central midfielders — usually dominated there.", "Extremely exposed on the counter-attack."],
		bestFor: "Must-win situations chasing a result late in games.",
		requires: "Two midfielders capable of covering the whole pitch.",
		key: "Central midfield pair"
	},
	"11:3-4-2-1": {
		adv: ["Strong central midfield platform.", "Two attacking midfielders support a central striker."],
		dis: ["Wing-backs must cover huge amounts of space.", "Vulnerable on the flanks in transition."],
		bestFor: "Teams building with a central focal point and layered support.",
		requires: "Wing-backs with excellent stamina and recovery speed.",
		key: "Wing-backs, attacking midfield pair"
	},
	"11:3-4-1-2": {
		adv: ["Two strikers give a strong central threat.", "The number 10 connects midfield to attack."],
		dis: ["Width depends entirely on the wing-backs.", "Wide defensive spaces open when they push forward."],
		bestFor: "Teams wanting two out-and-out strikers plus central creativity.",
		requires: "A creative number 10 and disciplined wing-backs.",
		key: "Number 10"
	},
	"11:4-1-3-2": {
		adv: [
			"Two strikers offer a direct goal threat.",
			"The holding midfielder shields a back four.",
			"Three attacking midfielders create combinations."
		],
		dis: ["Wide areas can be exposed in behind full-backs.", "The lone pivot carries huge defensive responsibility."],
		bestFor: "Teams wanting a direct front two backed by central creativity.",
		requires: "A dominant, mobile defensive midfielder.",
		key: "Holding midfielder, front two"
	},
	"11:3-2-4-1": {
		adv: ["Excellent possession structure with five players occupying attacking zones.", "Strong build-up shape from the back three."],
		dis: ["Requires exceptional positional discipline.", "Exposed during rapid transitions if the double pivot is bypassed."],
		bestFor: "Elite possession teams building through the thirds with intent.",
		requires: "A double pivot capable of screening the whole back three.",
		key: "Double pivot"
	},
	"11:3-2-2-3": {
		adv: ["Strong attacking structure with layered passing triangles.", "Excellent for coordinated pressing."],
		dis: ["Space can appear beside the double pivot.", "Requires highly intelligent, constant player movement."],
		bestFor: "Technically elite teams that press and build with patience.",
		requires: "Intelligent rotation between all attacking-midfield players.",
		key: "Double pivot, attacking midfield pair"
	},
	"11:3-1-4-2": {
		adv: ["Two strikers plus four midfielders give huge central presence.", "The lone pivot protects a back three."],
		dis: ["The single defensive midfielder can be overwhelmed.", "Space can open directly behind the midfield line."],
		bestFor: "Teams dominating midfield numerically against a back four.",
		requires: "An exceptional lone defensive midfielder.",
		key: "Defensive midfielder"
	},
	"11:3-3-3-1": {
		adv: ["Many attacking options across three advanced lines.", "Strong for aggressive, coordinated pressing."],
		dis: ["Extremely complex to organise.", "Vulnerable during transitions if discipline slips."],
		bestFor: "Elite, tactically sophisticated squads.",
		requires: "Total positional discipline and game intelligence.",
		key: "Every line — total rotation"
	},
	"11:2-3-5": {
		adv: ["Massive attacking presence creating overloads in the final third.", "Historically the foundation of attacking football."],
		dis: ["Almost no defensive protection.", "Modern opponents can counter into huge open space."],
		bestFor: "Demonstrating football history, or facing a vastly weaker side.",
		requires: "A back two supremely confident defending in isolation.",
		key: "Back two"
	}
};
function infoFor(size, formation) {
	return INFO[`${size}:${formation}`] || {
		adv: ["Balanced shape."],
		dis: ["Can be exploited if players lose discipline."],
		bestFor: "General use.",
		requires: "Good positional awareness.",
		key: "—"
	};
}
function linspace(a, b, n) {
	if (n <= 1) return [a];
	const arr = [];
	for (let i = 0; i < n; i++) arr.push(a + (b - a) * i / (n - 1));
	return arr;
}
function xsFor(count) {
	if (count <= 1) return [50];
	if (count === 2) return [34, 66];
	if (count === 3) return [
		20,
		50,
		80
	];
	if (count === 4) return [
		12,
		36,
		64,
		88
	];
	if (count === 5) return [
		10,
		30,
		50,
		70,
		90
	];
	return linspace(10, 90, count);
}
function labelLine(count, lineIndex, totalLines) {
	const isLast = lineIndex === totalLines - 1;
	if (lineIndex === 0) {
		if (count === 1) return ["CB"];
		if (count === 2) return ["LCB", "RCB"];
		if (count === 3) return [
			"LCB",
			"CB",
			"RCB"
		];
		if (count === 4) return [
			"LB",
			"LCB",
			"RCB",
			"RB"
		];
		if (count === 5) return [
			"LWB",
			"LCB",
			"CB",
			"RCB",
			"RWB"
		];
		return Array.from({ length: count }, (_, i) => i === 0 ? "LB" : i === count - 1 ? "RB" : "CB");
	}
	if (isLast) {
		if (count === 1) return ["ST"];
		if (count === 2) return ["ST", "ST"];
		if (count === 3) return [
			"LW",
			"ST",
			"RW"
		];
		if (count === 4) return [
			"LW",
			"CF",
			"CF",
			"RW"
		];
		if (count === 5) return [
			"LW",
			"LF",
			"ST",
			"RF",
			"RW"
		];
		return Array.from({ length: count }, () => "ST");
	}
	const midIndex = lineIndex;
	const midCount = totalLines - 2;
	const t = midCount <= 1 ? .5 : (midIndex - 1) / (midCount - 1);
	if (t < .34) {
		if (count === 1) return ["CDM"];
		if (count === 2) return ["LDM", "RDM"];
		if (count === 3) return [
			"LCM",
			"CDM",
			"RCM"
		];
		if (count === 4) return [
			"LM",
			"LCM",
			"RCM",
			"RM"
		];
		return [
			"LM",
			"LCM",
			"CDM",
			"RCM",
			"RM"
		].slice(0, count);
	}
	if (t > .66) {
		if (count === 1) return ["CAM"];
		if (count === 2) return ["LAM", "RAM"];
		if (count === 3) return [
			"LAM",
			"CAM",
			"RAM"
		];
		if (count === 4) return [
			"LM",
			"LAM",
			"RAM",
			"RM"
		];
		return [
			"LW",
			"LAM",
			"CAM",
			"RAM",
			"RW"
		].slice(0, count);
	}
	if (count === 1) return ["CM"];
	if (count === 2) return ["LCM", "RCM"];
	if (count === 3) return [
		"LCM",
		"CM",
		"RCM"
	];
	if (count === 4) return [
		"LM",
		"LCM",
		"RCM",
		"RM"
	];
	return [
		"LM",
		"LCM",
		"CM",
		"RCM",
		"RM"
	].slice(0, count);
}
function layoutFormation(formationStr, side) {
	const lines = formationStr.split("-").map(Number);
	const gkY = side === "own" ? 92 : 8;
	const ys = linspace(side === "own" ? 68 : 28, side === "own" ? 16 : 46, lines.length);
	const slots = [{
		id: "gk",
		pos: "GK",
		x: 50,
		y: gkY,
		line: "GK"
	}];
	lines.forEach((count, i) => {
		const labels = labelLine(count, i, lines.length);
		const xs = xsFor(count);
		for (let j = 0; j < count; j++) slots.push({
			id: `l${i}p${j}`,
			pos: labels[j] ?? "CM",
			x: xs[j] ?? 50,
			y: ys[i] ?? 50,
			line: i === 0 ? "DEF" : i === lines.length - 1 ? "FWD" : "MID"
		});
	});
	if (side === "opp") return slots.map((s) => ({
		...s,
		x: 100 - s.x
	}));
	return slots;
}
function cloneSlots(slots) {
	return slots.map((s) => ({ ...s }));
}
function ratingsFor(formationStr) {
	const lines = formationStr.split("-").map(Number);
	const def = lines[0] ?? 4;
	const fwd = lines[lines.length - 1] ?? 2;
	const midTotal = lines.slice(1, -1).reduce((a, b) => a + b, 0);
	const n = lines.length;
	const clamp5 = (v) => Math.max(1, Math.min(5, Math.round(v)));
	return {
		Attacking: clamp5(fwd * 1.4 + midTotal * .25),
		Defending: clamp5(def * 1.05 + (n >= 4 ? .6 : 0)),
		Possession: clamp5(midTotal * .9 + .5),
		Pressing: clamp5((def + midTotal) * .5),
		Counter: clamp5(fwd * 1.1 + (def <= 3 ? .8 : 0)),
		Width: clamp5((def >= 4 ? 3.6 : 2.4) + (n >= 4 ? .8 : 0)),
		Central: clamp5(midTotal * 1 + .4)
	};
}
/**
* NEW — eFootball-style freeform positioning.
*
* Converts a raw pitch coordinate (x/y as percentages, "own" side
* orientation where low y = near the opponent's goal, high y = near
* your own goal) into the closest sensible PositionCode. This is a
* zone-based heuristic, not an exact science — it's what lets a card
* dragged to open grass get a believable label (and therefore a
* believable roleAdjustedRating) instead of staying stuck with
* whatever position it started the drag with.
*/
function positionFromPoint(x, y) {
	const xBand = x < 25 ? "L" : x > 75 ? "R" : x < 42 ? "LC" : x > 58 ? "RC" : "C";
	if (y >= 85) return "GK";
	if (y >= 62) {
		if (xBand === "L") return "LB";
		if (xBand === "R") return "RB";
		if (xBand === "LC") return "LCB";
		if (xBand === "RC") return "RCB";
		return "CB";
	}
	if (y >= 45) {
		if (xBand === "L") return "LDM";
		if (xBand === "R") return "RDM";
		return "CDM";
	}
	if (y >= 30) {
		if (xBand === "L") return "LM";
		if (xBand === "R") return "RM";
		if (xBand === "LC") return "LCM";
		if (xBand === "RC") return "RCM";
		return "CM";
	}
	if (y >= 18) {
		if (xBand === "L") return "LW";
		if (xBand === "R") return "RW";
		if (xBand === "LC") return "LAM";
		if (xBand === "RC") return "RAM";
		return "CAM";
	}
	if (xBand === "L") return "LW";
	if (xBand === "R") return "RW";
	return "ST";
}
var STORAGE_KEY = "pitchhq-os-v2";
function persistSlice(s) {
	return {
		players: s.players,
		trainings: s.trainings,
		matches: s.matches,
		trophies: s.trophies,
		coaches: s.coaches,
		callUps: s.callUps,
		opponentIntel: s.opponentIntel,
		designPresets: s.designPresets,
		meta: s.meta
	};
}
var indexedDBStorage = {
	getItem: async (name) => {
		const fromIdb = await get(name);
		if (fromIdb != null) return fromIdb;
		try {
			const legacy = localStorage.getItem(name);
			if (legacy != null) {
				await set(name, legacy);
				localStorage.removeItem(name);
				return legacy;
			}
		} catch {}
		return null;
	},
	setItem: async (name, value) => {
		await set(name, value);
	},
	removeItem: async (name) => {
		await del(name);
	}
};
var usePitchStore = create()(persist((set, get) => ({
	...emptyData(),
	loaded: false,
	mode: "squad",
	squadTab: "home",
	tactiqTab: "board",
	category: "U15",
	formatSize: 11,
	formation: "4-3-3",
	compareA: "4-3-3",
	compareB: "4-2-3-1",
	slotMap: {},
	slotOverrides: {},
	selectedPlayerId: null,
	reducedMotion: false,
	setMode: (mode) => set({ mode }),
	setSquadTab: (squadTab) => set({
		squadTab,
		mode: "squad"
	}),
	setTactiqTab: (tactiqTab) => set({
		tactiqTab,
		mode: "tactiq"
	}),
	setCategory: (category) => set({ category }),
	setFormat: (formatSize, formation) => set({
		formatSize,
		formation,
		slotOverrides: {}
	}),
	setCompare: (compareA, compareB) => set({
		compareA,
		compareB
	}),
	setSlotMap: (slotMap) => set({ slotMap }),
	setReducedMotion: (reducedMotion) => set({ reducedMotion }),
	assignSlot: (slotId, playerId) => set((s) => {
		const slotMap = { ...s.slotMap };
		if (!playerId) delete slotMap[slotId];
		else {
			for (const [k, v] of Object.entries(slotMap)) if (v === playerId) delete slotMap[k];
			slotMap[slotId] = playerId;
		}
		return { slotMap };
	}),
	swapSlots: (a, b) => set((s) => {
		const slotMap = { ...s.slotMap };
		const pa = slotMap[a];
		const pb = slotMap[b];
		if (pa) slotMap[b] = pa;
		else delete slotMap[b];
		if (pb) slotMap[a] = pb;
		else delete slotMap[a];
		return { slotMap };
	}),
	setSlotOverride: (slotId, x, y) => set((s) => {
		const cx = clamp(x, 4, 96);
		const cy = clamp(y, 6, 94);
		const pos = slotId === "gk" ? "GK" : positionFromPoint(cx, cy);
		return { slotOverrides: {
			...s.slotOverrides,
			[slotId]: {
				x: cx,
				y: cy,
				pos
			}
		} };
	}),
	clearSlotOverrides: () => set({ slotOverrides: {} }),
	setSelectedPlayer: (selectedPlayerId) => set({ selectedPlayerId }),
	addPlayer: (p) => {
		const id = uid();
		const player = {
			...p,
			id,
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			history: []
		};
		set((s) => ({ players: [...s.players, player] }));
		return id;
	},
	updatePlayer: (id, patch) => set((s) => ({ players: s.players.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) })),
	removePlayer: (id) => set((s) => ({
		players: s.players.filter((p) => p.id !== id),
		trainings: s.trainings.map((t) => {
			const attendance = { ...t.attendance };
			delete attendance[id];
			return {
				...t,
				attendance
			};
		}),
		matches: s.matches.map((m) => {
			const ratings = { ...m.ratings };
			const goals = { ...m.goals };
			delete ratings[id];
			delete goals[id];
			const slotMap = { ...m.slotMap };
			for (const [k, v] of Object.entries(slotMap)) if (v === id) delete slotMap[k];
			return {
				...m,
				ratings,
				goals,
				slotMap,
				lineup: m.lineup.filter((x) => x !== id),
				motm: m.motm === id ? null : m.motm
			};
		}),
		slotMap: Object.fromEntries(Object.entries(s.slotMap).filter(([, v]) => v !== id)),
		selectedPlayerId: s.selectedPlayerId === id ? null : s.selectedPlayerId
	})),
	duplicatePlayer: (id) => {
		const src = get().players.find((p) => p.id === id);
		if (!src) return null;
		return get().addPlayer({
			name: `${src.name} (copy)`,
			photo: src.photo,
			position: src.position,
			secondaryPositions: [...src.secondaryPositions],
			foot: src.foot,
			number: src.number,
			age: src.age,
			height: src.height,
			captain: false,
			team: src.team,
			email: src.email,
			phone: src.phone,
			guardianName: src.guardianName,
			guardianEmail: src.guardianEmail,
			guardianPhone: src.guardianPhone,
			category: src.category,
			cardDesign: src.cardDesign,
			cardStyle: src.cardStyle ? { ...src.cardStyle } : void 0,
			baseSix: { ...src.baseSix },
			currentSix: { ...src.currentSix },
			detail: { ...src.detail },
			gkBase: src.gkBase ? { ...src.gkBase } : null,
			gkCurrent: src.gkCurrent ? { ...src.gkCurrent } : null,
			playStyles: [...src.playStyles],
			playStylesPlus: [...src.playStylesPlus],
			weakFoot: src.weakFoot,
			skillMoves: src.skillMoves
		});
	},
	setPlayerPhoto: (id, photo) => set((s) => ({ players: s.players.map((p) => p.id === id ? {
		...p,
		photo
	} : p) })),
	adjustAttribute: (id, attr, value, reason) => set((s) => ({ players: s.players.map((p) => {
		if (p.id !== id) return p;
		const sixKeys = [
			"pac",
			"sho",
			"pas",
			"dri",
			"def",
			"phy"
		];
		const gkKeys = [
			"div",
			"han",
			"kic",
			"ref",
			"spd",
			"pos"
		];
		let from = 0;
		const next = {
			...p,
			currentSix: { ...p.currentSix },
			detail: { ...p.detail }
		};
		if (sixKeys.includes(attr)) {
			const k = attr;
			from = p.currentSix[k];
			next.currentSix = {
				...p.currentSix,
				[k]: value
			};
			next.detail = spreadDetail(next.currentSix);
		} else if (gkKeys.includes(attr) && p.gkCurrent) {
			const k = attr;
			from = p.gkCurrent[k];
			next.gkCurrent = {
				...p.gkCurrent,
				[k]: value
			};
		} else if (attr in p.detail) {
			const k = attr;
			from = p.detail[k];
			next.detail = {
				...p.detail,
				[k]: value
			};
		} else return p;
		next.history = [...p.history, {
			id: uid(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			attr: attr.toUpperCase(),
			from,
			to: value,
			reason
		}];
		return next;
	}) })),
	addTraining: (date, title) => set((s) => ({ trainings: [...s.trainings, {
		id: uid(),
		date,
		title: title || "Training",
		category: s.category,
		attendance: {}
	}] })),
	removeTraining: (id) => set((s) => ({ trainings: s.trainings.filter((t) => t.id !== id) })),
	toggleAttendance: (trainingId, playerId) => set((s) => ({ trainings: s.trainings.map((t) => t.id === trainingId ? {
		...t,
		attendance: {
			...t.attendance,
			[playerId]: !t.attendance?.[playerId]
		}
	} : t) })),
	addMatch: (m) => set((s) => ({ matches: [...s.matches, {
		id: uid(),
		...m,
		category: s.category,
		lineup: [],
		slotMap: {},
		ratings: {},
		goals: {},
		teamScore: null,
		opponentScore: null,
		motm: null
	}] })),
	removeMatch: (id) => set((s) => ({ matches: s.matches.filter((m) => m.id !== id) })),
	updateMatch: (id, patch) => set((s) => ({ matches: s.matches.map((m) => m.id === id ? {
		...m,
		...patch
	} : m) })),
	addTrophy: (t) => set((s) => ({ trophies: [{
		id: uid(),
		name: t.name.trim() || "Untitled trophy",
		competition: t.competition.trim() || "Tournament",
		season: t.season.trim() || "Season",
		notes: t.notes.trim() || "Academy achievement",
		photo: t.photo ?? null,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...s.trophies] })),
	removeTrophy: (id) => set((s) => ({ trophies: s.trophies.filter((t) => t.id !== id) })),
	setIntel: (opponentIntel) => set({ opponentIntel }),
	savePreset: (name, cardDesign, style) => {
		const id = uid();
		set((s) => ({ designPresets: [...s.designPresets, {
			id,
			name: name.trim() || "Untitled",
			cardDesign,
			style: { ...style }
		}] }));
		return id;
	},
	updatePreset: (id, patch) => set((s) => ({ designPresets: s.designPresets.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) })),
	duplicatePreset: (id) => {
		const src = get().designPresets.find((p) => p.id === id);
		if (!src) return null;
		return get().savePreset(`${src.name} copy`, src.cardDesign, src.style);
	},
	removePreset: (id) => set((s) => ({ designPresets: s.designPresets.filter((p) => p.id !== id) })),
	addCoach: (c) => {
		const id = uid();
		const coach = {
			...c,
			id,
			cardDesign: c.cardDesign ?? "auto",
			category: get().category,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ coaches: [...s.coaches, coach] }));
		return id;
	},
	updateCoach: (id, patch) => set((s) => ({ coaches: s.coaches.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) })),
	removeCoach: (id) => set((s) => ({
		coaches: s.coaches.filter((c) => c.id !== id),
		callUps: s.callUps.filter((cu) => cu.coachId !== id)
	})),
	trainingCountForPlayer: (playerId) => {
		const { trainings, category } = get();
		return trainings.filter((t) => t.category === category && t.attendance?.[playerId]).length;
	},
	createCallUp: (name, coachId, playerIds) => {
		const id = uid();
		const entries = get().players.filter((p) => p.category === get().category).map((p) => ({
			playerId: p.id,
			status: playerIds.includes(p.id) ? "called" : "not-selected"
		}));
		const callUp = {
			id,
			name: name.trim() || "Untitled call-up",
			coachId,
			category: get().category,
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			entries,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ callUps: [callUp, ...s.callUps] }));
		return id;
	},
	duplicateCallUpAsNew: (id, name) => {
		const src = get().callUps.find((c) => c.id === id);
		if (!src) return null;
		const newId = uid();
		set((s) => ({ callUps: [{
			...src,
			id: newId,
			name: name.trim() || `${src.name} copy`,
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			entries: src.entries.map((e) => ({ ...e }))
		}, ...s.callUps] }));
		return newId;
	},
	updateCallUpEntry: (callUpId, playerId, patch) => set((s) => ({ callUps: s.callUps.map((cu) => cu.id === callUpId ? {
		...cu,
		entries: cu.entries.map((e) => e.playerId === playerId ? {
			...e,
			...patch
		} : e)
	} : cu) })),
	removeCallUp: (id) => set((s) => ({ callUps: s.callUps.filter((c) => c.id !== id) })),
	resetDesk: () => set({
		...emptyData(),
		slotMap: {},
		slotOverrides: {},
		selectedPlayerId: null,
		formation: "4-3-3",
		formatSize: 11
	})
}), {
	name: STORAGE_KEY,
	storage: createJSONStorage(() => indexedDBStorage),
	partialize: (s) => ({
		...persistSlice(s),
		mode: s.mode,
		squadTab: s.squadTab,
		tactiqTab: s.tactiqTab,
		category: s.category,
		formatSize: s.formatSize,
		formation: s.formation,
		compareA: s.compareA,
		compareB: s.compareB,
		slotMap: s.slotMap,
		slotOverrides: s.slotOverrides,
		reducedMotion: s.reducedMotion
	}),
	onRehydrateStorage: () => (state) => {
		if (state) {
			state.loaded = true;
			if (!state.designPresets) state.designPresets = [];
			if (!state.slotOverrides) state.slotOverrides = {};
			if (!state.coaches) state.coaches = [];
			if (!state.callUps) state.callUps = [];
			state.coaches = state.coaches.map((c) => ({
				...c,
				cardDesign: c.cardDesign ?? "auto"
			}));
		}
	}
}));
function draftToPlayer(d, category) {
	return {
		name: d.name.trim(),
		photo: d.photo,
		position: d.position,
		secondaryPositions: d.secondaryPositions,
		foot: d.foot,
		weakFoot: d.weakFoot,
		skillMoves: d.skillMoves,
		number: d.number,
		age: d.age,
		height: d.height,
		captain: d.captain,
		team: d.team,
		email: d.email,
		phone: d.phone,
		guardianName: d.guardianName,
		guardianEmail: d.guardianEmail,
		guardianPhone: d.guardianPhone,
		category,
		cardDesign: d.cardDesign,
		cardStyle: d.cardStyle,
		baseSix: { ...d.currentSix },
		currentSix: { ...d.currentSix },
		detail: spreadDetail(d.currentSix),
		gkBase: d.gkCurrent ? { ...d.gkCurrent } : null,
		gkCurrent: d.gkCurrent ? { ...d.gkCurrent } : null,
		playStyles: d.playStyles ?? [],
		playStylesPlus: d.playStylesPlus ?? []
	};
}
/**
* Every PlayStyle id maps to its OWN icon here — never shared within a
* category — so two styles never look identical just because they share
* a category.
*/
var PLAYSTYLE_ICONS = {
	acrobatic: RotateCw,
	chip_shot: ArrowUpRight,
	dead_ball: Target,
	finesse_shot: WandSparkles,
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
	relentless: Infinity$1,
	cross_claimer: Hand,
	deflector: Shield,
	far_reach: Ruler,
	far_throw: Plane,
	footwork: Footprints,
	quick_reflexes: Activity,
	rush_out: Flag
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
var GK_PLAYSTYLE_IDS = /* @__PURE__ */ new Set([
	"far_reach",
	"footwork",
	"rush_out",
	"cross_claimer",
	"deflector",
	"far_throw"
]);
/**
* Maps a `cardStyle.backgroundPattern` value to the CSS class that
* renders it. "grid" keeps the existing look; the others are new
* textures defined in styles.css. Requires adding a `backgroundPattern`
* field to your CardStyle type/mergeCardStyle defaults for the editor
* UI to actually drive this — until then it just falls back to "grid".
*/
var PATTERN_CLASS = {
	grid: "ultimate-grid",
	dots: "ultimate-pattern-dots",
	diagonal: "ultimate-pattern-diagonal",
	hex: "ultimate-pattern-hex",
	none: ""
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
function useCardModel(player, matches, slotPosition) {
	const d = derivePlayer(player, matches);
	const stats = isGoalkeeper(player.position) && player.gkCurrent ? GK_KEYS.map((k) => ({
		k,
		label: GK_LABELS[k],
		v: player.gkCurrent[k]
	})) : SIX_KEYS.map((k) => ({
		k,
		label: SIX_LABELS[k],
		v: player.currentSix[k]
	}));
	const tier = d.design;
	const isOutOfPosition = Boolean(slotPosition && !isGoalkeeper(player.position) && slotPosition !== player.position && slotPosition !== "GK");
	const slotOvr = isOutOfPosition && slotPosition ? roleAdjustedRating(player, slotPosition) : d.ovr;
	return {
		d,
		stats,
		tier,
		meta: TIER_META[tier],
		slotOvr,
		isOutOfPosition
	};
}
function TacticalSilhouette({ name }) {
	const ini = initials(name);
	const gid = (0, import_react.useId)().replace(/:/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pcard-sil",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 180",
			className: "pcard-sil-svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: gid,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--pc-accent)",
						stopOpacity: "0.55"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--pc-edge)",
						stopOpacity: "0.18"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 10 L74 22 L72 44 L48 44 L46 22 Z",
					fill: `url(#${gid})`,
					stroke: "var(--pc-accent)",
					strokeWidth: "1.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M54 44 L66 44 L64 54 L56 54 Z",
					fill: "var(--pc-accent)",
					opacity: "0.45"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 58 L52 52 L68 52 L92 58 L86 118 L60 128 L34 118 Z",
					fill: `url(#${gid})`,
					stroke: "var(--pc-accent)",
					strokeWidth: "1.1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 58 L18 92 L32 96 L40 70 Z",
					fill: "var(--pc-edge)",
					opacity: "0.55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M92 58 L102 92 L88 96 L80 70 Z",
					fill: "var(--pc-edge)",
					opacity: "0.55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 118 L48 170 L58 170 L56 124 Z",
					fill: `url(#${gid})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M80 118 L72 170 L62 170 L64 124 Z",
					fill: `url(#${gid})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M36 72 H84",
					stroke: "var(--pc-accent)",
					strokeWidth: "0.6",
					opacity: "0.5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M38 88 H82",
					stroke: "var(--pc-accent)",
					strokeWidth: "0.6",
					opacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M42 104 H78",
					stroke: "var(--pc-accent)",
					strokeWidth: "0.6",
					opacity: "0.25"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pcard-sil-ini",
			children: ini
		})]
	});
}
function CardPhoto({ src, name }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFailed(false);
	}, [src]);
	if (!src || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TacticalSilhouette, { name });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: name,
		className: "pcard-photo",
		draggable: false,
		onError: () => setFailed(true)
	});
}
function TacticalBackdrop() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "pcard-tactical",
		viewBox: "0 0 100 160",
		preserveAspectRatio: "none",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "6",
				width: "84",
				height: "148",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.35",
				opacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "8",
				y1: "80",
				x2: "92",
				y2: "80",
				stroke: "currentColor",
				strokeWidth: "0.3",
				opacity: "0.28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "80",
				r: "11",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.3",
				opacity: "0.28"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "28",
				y: "6",
				width: "44",
				height: "16",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.3",
				opacity: "0.22"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M18 150 L50 96 L82 150",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "0.4",
				opacity: "0.22"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M50 96 L50 54",
				stroke: "currentColor",
				strokeWidth: "0.35",
				opacity: "0.2"
			})
		]
	});
}
function ChassisLayers({ tier, rich }) {
	const layers = TIER_META[tier].layers;
	if (!rich) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		layers >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pcard-ticks",
			"aria-hidden": true
		}),
		layers >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pcard-rail",
			"aria-hidden": true
		}),
		layers >= 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pcard-orbit",
			"aria-hidden": true
		}),
		layers >= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pcard-filigree",
			"aria-hidden": true
		}),
		layers >= 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pcard-slash",
			"aria-hidden": true
		})
	] });
}
function CardStats({ stats, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("ultimate-stats", compact && "is-compact"),
		children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ultimate-stat",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ultimate-stat-label",
					children: stat.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-stat-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stat.v })
			]
		}, stat.k))
	});
}
/**
* Vertical sidebar of PlayStyle tiles on the card's right edge. Now
* occupies the upper-right slot that used to hold the tier/"AKAN HQ"
* vertical text (see PlayerCard — that label was removed), so it runs
* from just under the top edge down to clearance above the stat grid.
* Rendered as a sibling of .ultimate-content (not a grid row inside
* it), so it never competes with the header/name/stats layout.
*/
function PlayStyleBadges({ playStyles, playStylesPlus, isGK }) {
	const rawIds = Array.from(/* @__PURE__ */ new Set([...playStyles ?? [], ...playStylesPlus ?? []]));
	const ids = isGK ? rawIds.filter((id) => GK_PLAYSTYLE_IDS.has(id)) : rawIds.filter((id) => !GK_PLAYSTYLE_IDS.has(id));
	if (ids.length === 0) return null;
	const shown = ids.slice(0, 4);
	const overflow = ids.length - shown.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ultimate-playstyles-side",
		"aria-label": "PlayStyles",
		children: [
			shown.map((id) => {
				const def = playStyleById(id);
				if (!def) return null;
				const isPlus = playStylesPlus.includes(id);
				const Icon = PLAYSTYLE_ICONS[id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					title: `${def.name}${isPlus ? " +" : ""} — ${isPlus ? def.effectPlus : def.effect}`,
					className: cn("ultimate-playstyle-badge", isPlus ? "is-plus" : "is-standard"),
					children: Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "ultimate-playstyle-icon" })
				}, id);
			}),
			overflow > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ultimate-playstyle-more",
				children: ["+", overflow]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ultimate-playstyles-label",
				children: "PLAYSTYLES"
			})
		]
	});
}
function sizeClass(size) {
	return `pcard-sz-${size}`;
}
function PlayerCard({ player, matches = [], size = "full", className, onClick, selected, dimmed, slotPosition }) {
	const { d, stats, tier, meta, slotOvr, isOutOfPosition } = useCardModel(player, matches, slotPosition);
	const reducedMotion = usePitchStore((s) => s.reducedMotion);
	const rich = size === "full" || size === "profile" || size === "mini";
	const compact = size === "tiny" || size === "board";
	const style = mergeCardStyle(player.cardStyle);
	const displayName = style.nameCase === "title" ? player.name.trim().split(/\s+/).slice(-1)[0] || player.name : lastName(player.name);
	const formLabel = d.form === null ? "-" : d.form.toFixed(1);
	const cssVars = styleToCssVars(style);
	const auraTokens = [d.onForm && "form", player.captain && "captain"].filter(Boolean);
	const auraAttr = auraTokens.length ? auraTokens.join(" ") : void 0;
	const hasPlayStyles = (player.playStyles?.length ?? 0) + (player.playStylesPlus?.length ?? 0) > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: onClick ? "button" : void 0,
		tabIndex: onClick ? 0 : void 0,
		onClick,
		onKeyDown: onClick ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		} : void 0,
		"data-tier": tier,
		"data-layers": meta.layers,
		"data-aura": auraAttr,
		"data-out-of-position": isOutOfPosition || void 0,
		title: isOutOfPosition ? `Out of position at ${slotPosition} — rating adjusted from ${d.ovr} to ${slotOvr}` : void 0,
		style: cssVars,
		className: cn("pcard ultimate-card card-wrapper", `pcard-${tier}`, `pcard-variant-${style.variant}`, sizeClass(size), selected && "is-selected", dimmed && "is-dimmed", style.photoFrame === "full-body" && "pcard-frame-full-body", onClick && "is-clickable", !player.photo && "is-nophoto", reducedMotion && "is-still", isOutOfPosition && "is-out-of-position", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ultimate-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ultimate-shadow" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ultimate-backplate" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ultimate-foil ultimate-foil-back" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ultimate-geometry",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-orbit" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-cut cut-one" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-cut cut-two" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-spark spark-one" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-spark spark-two" })
					]
				}),
				auraTokens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ultimate-aura",
					"aria-hidden": true,
					children: [d.onForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-aura-form" }), player.captain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ultimate-aura-captain" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ultimate-artboard ultimate-skin card-bg-full",
					"aria-hidden": "true",
					children: [
						style.showTactical && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TacticalBackdrop, {}),
						style.showGrid && (() => {
							const patternClass = PATTERN_CLASS[style.backgroundPattern ?? "grid"] ?? "ultimate-grid";
							return patternClass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: patternClass }) : null;
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChassisLayers, {
							tier,
							rich
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ultimate-photo-wrap image-wrapper",
					style: {
						transform: `translate(${style.photoX}%, ${style.photoY}%) rotate(${style.photoRotate}deg) scale(${style.photoScale})`,
						filter: `brightness(${style.photoBrightness}) contrast(${style.photoContrast}) saturate(${style.photoSaturate}) blur(${style.photoBlur}px)`,
						opacity: style.photoOpacity
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardPhoto, {
							src: player.photo,
							name: player.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ultimate-photo-light" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ultimate-photo-fade" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ultimate-shine",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ultimate-divider card-divider",
					"aria-hidden": true
				}),
				!compact && hasPlayStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ultimate-sidebar-divider",
					"aria-hidden": true
				}),
				!compact && hasPlayStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayStyleBadges, {
					playStyles: player.playStyles ?? [],
					playStylesPlus: player.playStylesPlus ?? [],
					isGK: isGoalkeeper(player.position)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ultimate-content card-ui-overlay",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ultimate-zone ultimate-header-zone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ultimate-rating ovr-badge",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ultimate-rating-label",
										children: "OVR"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: slotOvr }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ultimate-position",
										children: slotPosition ?? player.position
									}),
									player.captain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ultimate-captain-mark",
										children: "C"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ultimate-zone ultimate-name-zone",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ultimate-identity player-name-wrapper",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: displayName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									player.team || "AKAN HQ",
									" · #",
									player.number || "-"
								] })]
							}), compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ultimate-compact-name",
								children: displayName
							})]
						}),
						!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ultimate-zone ultimate-stats-zone stats-grid",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardStats, {
								stats,
								compact: size === "mini"
							})
						}),
						!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ultimate-zone ultimate-footer-zone ultimate-footer card-footer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["FORM ", formLabel] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									player.foot[0],
									" · ",
									player.height,
									"CM"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "AKN" })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ultimate-foil ultimate-foil-front",
					"aria-hidden": true
				})
			]
		})
	});
}
function EmptySlotCard({ pos, onClick, size = "board" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: onClick ? "button" : void 0,
		tabIndex: onClick ? 0 : void 0,
		onClick,
		onKeyDown: onClick ? (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		} : void 0,
		className: cn("pcard pcard-empty", sizeClass(size), onClick && "is-clickable"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ultimate-stage",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ultimate-artboard",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TacticalBackdrop, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ultimate-empty-content",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: pos }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EMPTY SLOT" })]
			})]
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0b515ba27a8a66b3a1aeacb237af916385778b20904e91e04e00a9421afaddd9"));
function parseColorsFromPrompt(promptText) {
	const hexMatches = promptText.match(/#[0-9a-fA-F]{6}\b/g) || [];
	const rgbaMatches = promptText.match(/rgba?\([^)]+\)/g) || [];
	if (hexMatches.length === 0) return {};
	const darkHexes = hexMatches.filter((h) => [
		"#09090b",
		"#18181b",
		"#0d001a",
		"#050505",
		"#000000"
	].includes(h.toLowerCase()));
	return {
		background: `linear-gradient(180deg, ${darkHexes[0] || hexMatches[0] || "#18181b"} 0%, ${darkHexes[1] || hexMatches[1] || "#09090b"} 100%)`,
		accentColor: hexMatches.find((h) => !darkHexes.includes(h)) || "#e2e8f0",
		glowColor: rgbaMatches[0] || "rgba(255, 255, 255, 0.2)",
		textColor: "#ffffff",
		borderStyle: `1px solid ${hexMatches.find((h) => !darkHexes.includes(h)) || "#94a3b8"}`
	};
}
function designCardFromPrompt(rawPrompt, base) {
	const prompt = rawPrompt.trim();
	const parsed = parseColorsFromPrompt(prompt);
	return {
		style: mergeCardStyle({
			...base,
			generatedBackground: parsed.background || "linear-gradient(180deg, #18181b 0%, #09090b 100%)",
			accent: parsed.accentColor || "#e2e8f0",
			glowColor: parsed.glowColor || "rgba(255, 255, 255, 0.2)",
			text: "#ffffff"
		}),
		title: "Sync AI Preview",
		summary: `Configured base aesthetic for "${prompt.slice(0, 40)}...".`
	};
}
var STEPS = [
	"Identity",
	"Attributes",
	"Card Designer"
];
var COLOR_FIELDS = [
	{
		key: "primary",
		label: "Primary"
	},
	{
		key: "secondary",
		label: "Secondary"
	},
	{
		key: "accent",
		label: "Accent"
	},
	{
		key: "background",
		label: "Background"
	},
	{
		key: "border",
		label: "Border"
	},
	{
		key: "text",
		label: "Text"
	},
	{
		key: "attrColor",
		label: "Attributes"
	},
	{
		key: "ratingColor",
		label: "Rating"
	},
	{
		key: "highlight",
		label: "Highlight"
	},
	{
		key: "glowColor",
		label: "Glow"
	},
	{
		key: "metallic",
		label: "Metallic"
	},
	{
		key: "photoTint",
		label: "Photo tint"
	}
];
function Slider({ label, value, onChange, min = 1, max = 99, step = 1, disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("block", disabled && "opacity-50"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-base tabular-nums text-accent",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			disabled,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full accent-accent disabled:cursor-not-allowed"
		})]
	});
}
/** 1–5 star clickable rating picker, used for Weak Foot and Skill Moves. */
function StarPicker({ label, value, onChange, disabled = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn(disabled && "opacity-50"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: [
				1,
				2,
				3,
				4,
				5
			].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled,
				onClick: () => onChange(n),
				className: cn("text-xl leading-none transition disabled:cursor-not-allowed", n <= value ? "text-accent" : "text-line"),
				"aria-label": `${n} star${n === 1 ? "" : "s"}`,
				children: "★"
			}, n))
		})]
	});
}
/** PlayStyle picker — grouped by category, position-filtered, tap to equip, double-tap to elevate to "+". */
function PlayStylePicker({ position, selected, selectedPlus, onToggle, onTogglePlus, disabled = false }) {
	const available = PLAYSTYLES.filter((p) => !p.positions || p.positions.includes(position));
	const grouped = Object.entries(PLAYSTYLE_CATEGORY_LABELS).map(([cat, label]) => ({
		cat,
		label,
		styles: available.filter((p) => p.category === cat)
	})).filter((g) => g.styles.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-4", disabled && "opacity-50"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"PlayStyles (",
					selected.length,
					"/",
					7,
					")"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Elite + (",
					selectedPlus.length,
					"/",
					3,
					")"
				] })]
			}),
			grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle",
				children: g.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: g.styles.map((style) => {
					const isOn = selected.includes(style.id);
					const isPlus = selectedPlus.includes(style.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						title: isPlus ? style.effectPlus : style.effect,
						onClick: () => onToggle(style.id),
						onDoubleClick: () => isOn && onTogglePlus(style.id),
						className: cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold disabled:cursor-not-allowed", isPlus ? "border-[#f1d38a] bg-[#f1d38a]/15 text-[#f7e9bd]" : isOn ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted"),
						children: [style.name, isPlus && " +"]
					}, style.id);
				})
			})] }, g.cat)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-subtle",
				children: [
					"Tap to equip a style. Double-tap an equipped style to upgrade it to elite \"+\" (max ",
					3,
					")."
				]
			})
		]
	});
}
function PlayerForm({ existing, onClose, onCreated }) {
	const addPlayer = usePitchStore((s) => s.addPlayer);
	const updatePlayer = usePitchStore((s) => s.updatePlayer);
	const category = usePitchStore((s) => s.category);
	const currentUser = {
		id: "local-user",
		role: "admin"
	};
	const canEdit = true;
	const fileRef = (0, import_react.useRef)(null);
	const [step, setStep] = (0, import_react.useState)(existing ? 2 : 0);
	const [pane, setPane] = (0, import_react.useState)("ai");
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "");
	const [photo, setPhoto] = (0, import_react.useState)(existing?.photo ?? null);
	const [photoSource, setPhotoSource] = (0, import_react.useState)(null);
	const [position, setPosition] = (0, import_react.useState)(existing?.position ?? "CM");
	const [secondary, setSecondary] = (0, import_react.useState)(existing?.secondaryPositions ?? []);
	const [foot, setFoot] = (0, import_react.useState)(existing?.foot ?? "Right");
	const [weakFoot, setWeakFoot] = (0, import_react.useState)(existing?.weakFoot ?? 3);
	const [skillMoves, setSkillMoves] = (0, import_react.useState)(existing?.skillMoves ?? 3);
	const [playStyles, setPlayStyles] = (0, import_react.useState)(existing?.playStyles ?? []);
	const [playStylesPlus, setPlayStylesPlus] = (0, import_react.useState)(existing?.playStylesPlus ?? []);
	const [number, setNumber] = (0, import_react.useState)(existing?.number ?? "");
	const [age, setAge] = (0, import_react.useState)(existing?.age ?? 15);
	const [height, setHeight] = (0, import_react.useState)(existing?.height ?? 172);
	const [captain, setCaptain] = (0, import_react.useState)(existing?.captain ?? false);
	const [team, setTeam] = (0, import_react.useState)(existing?.team ?? "AKAN HQ");
	const [email, setEmail] = (0, import_react.useState)(existing?.email ?? "");
	const [phone, setPhone] = (0, import_react.useState)(existing?.phone ?? "");
	const [guardianName, setGuardianName] = (0, import_react.useState)(existing?.guardianName ?? "");
	const [guardianEmail, setGuardianEmail] = (0, import_react.useState)(existing?.guardianEmail ?? "");
	const [guardianPhone, setGuardianPhone] = (0, import_react.useState)(existing?.guardianPhone ?? "");
	const [cardDesign, setCardDesign] = (0, import_react.useState)(normalizeCardDesign(existing?.cardDesign ?? "auto"));
	const [style, setStyle] = (0, import_react.useState)(mergeCardStyle(existing?.cardStyle));
	const [six, setSix] = (0, import_react.useState)(existing?.currentSix ?? emptySix());
	const [gk, setGk] = (0, import_react.useState)(existing?.gkCurrent ?? emptyGk());
	const [past, setPast] = (0, import_react.useState)([]);
	const [future, setFuture] = (0, import_react.useState)([]);
	const [photoFrame, setPhotoFrame] = (0, import_react.useState)(style.photoFrame);
	const [cardPrompt, setCardPrompt] = (0, import_react.useState)("");
	const [cardAiStatus, setCardAiStatus] = (0, import_react.useState)("Describe the card you want to create.");
	const [cardAiLoading, setCardAiLoading] = (0, import_react.useState)(false);
	const [presetName, setPresetName] = (0, import_react.useState)("");
	const [renameId, setRenameId] = (0, import_react.useState)(null);
	const presets = usePitchStore((s) => s.designPresets);
	const savePreset = usePitchStore((s) => s.savePreset);
	const updatePreset = usePitchStore((s) => s.updatePreset);
	const duplicatePreset = usePitchStore((s) => s.duplicatePreset);
	const removePreset = usePitchStore((s) => s.removePreset);
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("idle");
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const saveStatusResetRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			if (saveStatusResetRef.current) clearTimeout(saveStatusResetRef.current);
		};
	}, []);
	const saveButtonLabel = saveStatus === "saving" ? "Saving..." : saveStatus === "synced" ? "Saved!" : saveStatus === "error" ? "Save failed — retry" : "Save Card";
	const [aiPrompt, setAiPrompt] = (0, import_react.useState)("");
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const handleCardAI = async () => {
		if (!aiPrompt.trim()) return;
		setIsGenerating(true);
		try {
			const data = await (await fetch("/api/generate-card", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: aiPrompt })
			})).json();
			if (data.functionCalls && data.functionCalls.length > 0) {
				for (const call of data.functionCalls) if (call.name === "updatePlayerAttributes") {
					const args = call.args ?? {};
					if (args.name) setName(args.name);
					if (args.position) setPosition(args.position);
					setSix((prev) => ({
						...prev,
						...args.pace !== void 0 ? { pace: args.pace } : {},
						...args.shooting !== void 0 ? { shooting: args.shooting } : {},
						...args.passing !== void 0 ? { passing: args.passing } : {},
						...args.dribbling !== void 0 ? { dribbling: args.dribbling } : {},
						...args.defending !== void 0 ? { defending: args.defending } : {},
						...args.physical !== void 0 ? { physical: args.physical } : {}
					}));
				}
			}
		} catch (err) {
			console.error("AI Generation Error:", err);
		} finally {
			setIsGenerating(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!captain) return;
		setStyle((prev) => ({
			...mergeCardStyle(prev),
			...CAPTAIN_SIGNATURE_STYLE
		}));
	}, [captain]);
	function pushStyle(next) {
		setPast((h) => [...h.slice(-30), style]);
		setFuture([]);
		setStyle(next);
	}
	function patchStyle(partial) {
		pushStyle({
			...style,
			...partial
		});
	}
	async function createCardFromPrompt() {
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
				body: JSON.stringify({ theme: cardPrompt.trim() })
			});
			const payload = await response.json();
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
	async function useCardReferences(files) {
		const selected = Array.from(files ?? []);
		const source = selected[selected.length - 1];
		if (!source) return;
		try {
			setPhotoSource(source);
			setPhoto(await cropFacePortrait(source, 740, photoFrame));
			setCardAiStatus(`${selected.length} reference image${selected.length === 1 ? "" : "s"} uploaded. The latest image is now on the live card.`);
		} catch {
			setCardAiStatus("That image could not be read. Try a PNG, JPG, or WEBP file.");
		}
	}
	async function applyPhotoFrame(nextFrame) {
		setPhotoFrame(nextFrame);
		patchStyle({ photoFrame: nextFrame });
		if (photoSource) setPhoto(await cropFacePortrait(photoSource, 740, nextFrame));
	}
	function togglePlayStyle(id) {
		setPlayStyles((prev) => {
			if (prev.includes(id)) {
				setPlayStylesPlus((plus) => plus.filter((x) => x !== id));
				return prev.filter((x) => x !== id);
			}
			if (prev.length >= 7) return prev;
			return [...prev, id];
		});
	}
	function togglePlayStylePlus(id) {
		setPlayStylesPlus((prev) => {
			if (prev.includes(id)) return prev.filter((x) => x !== id);
			if (prev.length >= 3) return prev;
			return [...prev, id];
		});
	}
	const draft = {
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
		gkCurrent: isGoalkeeper(position) ? gk : null
	};
	const preview = (0, import_react.useMemo)(() => {
		return {
			...draftToPlayer(draft, category),
			id: existing?.id ?? "preview",
			createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			history: existing?.history ?? [],
			detail: spreadDetail(six)
		};
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
		existing
	]);
	function toggleSecondary(pos) {
		setSecondary((s) => s.includes(pos) ? s.filter((x) => x !== pos) : [...s, pos].slice(0, 3));
	}
	function applyChassis(d) {
		setCardDesign(d);
		if (d !== "auto") {
			const pal = TIER_PALETTE[d];
			if (pal) patchStyle(pal);
		}
	}
	function describeSaveError(err) {
		if (err instanceof DOMException) {
			if (err.name === "QuotaExceededError" || err.code === 22 || err.name === "NS_ERROR_DOM_QUOTA_REACHED") return "Storage is full (too many cards/images). Delete an old card, or export this one, then retry.";
			return err.message || "Storage error.";
		}
		if (err instanceof Error) return err.message;
		return "Unknown error while saving.";
	}
	function save() {
		if (!currentUser || !name.trim()) return;
		const payload = draftToPlayer({
			...draft,
			name
		}, category);
		if (saveStatusResetRef.current) clearTimeout(saveStatusResetRef.current);
		setSaveStatus("saving");
		setSaveError(null);
		try {
			let id;
			if (existing) {
				updatePlayer(existing.id, payload);
				id = existing.id;
			} else id = addPlayer(payload);
			setSaveStatus("synced");
			onCreated?.(id);
		} catch (err) {
			console.error("Save failed:", err);
			setSaveError(describeSaveError(err));
			setSaveStatus("error");
			return;
		}
		saveStatusResetRef.current = setTimeout(() => setSaveStatus("idle"), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-h-[min(94vh,920px)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl tracking-wide",
					children: existing ? "Edit player card" : "Create player card"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted",
					children: [
						"Step ",
						step + 1,
						" of 3 — ",
						STEPS[step]
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-sm text-muted hover:text-fg",
					children: "Close"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid flex-1 grid-cols-1 gap-4 overflow-y-auto hq-scroll p-4 lg:grid-cols-[1fr_240px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: false,
										onClick: () => fileRef.current?.click(),
										className: "flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-elevated disabled:cursor-not-allowed disabled:opacity-50",
										children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: photo,
											alt: "",
											className: "size-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5 text-subtle" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										disabled: false,
										onChange: async (e) => {
											const f = e.target.files?.[0];
											if (f && canEdit) {
												setPhotoSource(f);
												setPhoto(await cropFacePortrait(f, 740, photoFrame));
											}
											e.target.value = "";
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: "Choose a face portrait or full-body kit shot. The card blends the crop into its chassis."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: ["face", "full-body"].map((frame) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: false,
									onClick: () => void applyPhotoFrame(frame),
									className: cn("rounded-full border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50", photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted"),
									children: frame === "face" ? "Face focus" : "Full body + kit"
								}, frame))
							}),
							photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-muted underline",
								onClick: () => setPhoto(null),
								children: "Remove photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Player name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: name,
									disabled: false,
									onChange: (e) => setName(e.target.value),
									className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50",
									placeholder: "Full name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted",
										children: ["Shirt no.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: number,
											disabled: false,
											onChange: (e) => setNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 3)),
											className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted",
										children: ["Age", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: age,
											disabled: false,
											onChange: (e) => setAge(Number(e.target.value)),
											className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted",
										children: ["Height (cm)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											value: height,
											disabled: false,
											onChange: (e) => setHeight(Number(e.target.value)),
											className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs text-muted",
										children: ["Preferred foot", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: foot,
											disabled: false,
											onChange: (e) => setFoot(e.target.value),
											className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Right" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Left" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Both" })
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[12px] border border-line bg-surface p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted",
										children: "Contact — so coaches can send call-ups"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted",
											children: ["Player email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												value: email,
												disabled: false,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "player@email.com",
												className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted",
											children: ["Player phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: phone,
												disabled: false,
												onChange: (e) => setPhone(e.target.value),
												placeholder: "07xx xxx xxx",
												className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs text-muted",
												children: ["Guardian name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: guardianName,
													disabled: false,
													onChange: (e) => setGuardianName(e.target.value),
													placeholder: "Parent / guardian",
													className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs text-muted",
												children: ["Guardian email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "email",
													value: guardianEmail,
													disabled: false,
													onChange: (e) => setGuardianEmail(e.target.value),
													placeholder: "guardian@email.com",
													className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs text-muted",
												children: ["Guardian phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: guardianPhone,
													disabled: false,
													onChange: (e) => setGuardianPhone(e.target.value),
													placeholder: "07xx xxx xxx",
													className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
												})]
											})
										]
									}),
									!email.trim() && !guardianEmail.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[11px] text-warn",
										children: "Add at least one email (player or guardian) so call-ups can actually be sent."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarPicker, {
									label: "Weak foot",
									value: weakFoot,
									disabled: false,
									onChange: setWeakFoot
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarPicker, {
									label: "Skill moves",
									value: skillMoves,
									disabled: false,
									onChange: setSkillMoves
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayStylePicker, {
								position,
								selected: playStyles,
								selectedPlus: playStylesPlus,
								onToggle: togglePlayStyle,
								onTogglePlus: togglePlayStylePlus,
								disabled: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Actual position", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: position,
									disabled: false,
									onChange: (e) => setPosition(e.target.value),
									className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
									children: POSITIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: p,
										children: [
											p,
											" — ",
											POSITION_LABELS[p]
										]
									}, p))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1.5 text-xs text-muted",
								children: "Secondary positions (up to 3)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: POSITIONS.filter((p) => p !== position).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: false,
									onClick: () => toggleSecondary(p),
									className: cn("rounded-full px-2 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-50", secondary.includes(p) ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
									children: p
								}, p))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs text-muted",
								children: ["Team", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: team,
									disabled: false,
									onChange: (e) => setTeam(e.target.value),
									className: "mt-1 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: captain,
									disabled: false,
									onChange: (e) => setCaptain(e.target.checked)
								}), "Captain"]
							})
						] }),
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Six-stat model. Overall is position-weighted — a centre-back is not a simple average of every number."
							}), isGoalkeeper(position) ? GK_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: GK_LABELS[k],
								value: gk[k],
								disabled: false,
								onChange: (v) => setGk({
									...gk,
									[k]: v
								})
							}, k)) : SIX_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								label: SIX_LABELS[k],
								value: six[k],
								disabled: false,
								onChange: (v) => setSix({
									...six,
									[k]: v
								})
							}, k))]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											disabled: past.length === 0,
											onClick: () => {
												const prev = past[past.length - 1];
												setFuture((f) => [style, ...f]);
												setPast((h) => h.slice(0, -1));
												setStyle(prev);
											},
											children: "Undo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											disabled: future.length === 0,
											onClick: () => {
												const next = future[0];
												setPast((h) => [...h, style]);
												setFuture((f) => f.slice(1));
												setStyle(next);
											},
											children: "Redo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											disabled: false,
											onClick: () => pushStyle({ ...DEFAULT_CARD_STYLE }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset design"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1 border-b border-line pb-2",
									children: [
										["chassis", "Chassis"],
										["color", "Color"],
										["frame", "Frame"],
										["image", "Image"],
										["data", "Data"],
										["presets", "Presets"],
										["ai", "Card AI"]
									].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPane(id),
										className: cn("rounded-full px-3 py-1.5 text-xs font-semibold", pane === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
										children: label
									}, id))
								}),
								pane === "ai" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-[16px] border border-accent/30 bg-accent/5 p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-sm font-semibold text-fg",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4 text-accent" }), " Design your card with a prompt"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs leading-5 text-muted",
													children: "Describe the colors, mood, pattern, and photo style. The designer converts your brief into a live card layout."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: cardPrompt,
													disabled: false,
													onChange: (e) => setCardPrompt(e.target.value),
													onKeyDown: (e) => {
														if ((e.ctrlKey || e.metaKey) && e.key === "Enter") createCardFromPrompt();
													},
													placeholder: "Example: a dark academy card with cyan circuits, serious typography, and a bright headshot",
													rows: 5,
													className: "mt-3 w-full rounded-[12px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													className: "mt-3 w-full",
													onClick: () => void createCardFromPrompt(),
													disabled: cardAiLoading,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Create card design"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-3 text-xs leading-5 text-accent",
													children: cardAiStatus
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-[16px] border border-accent/30 bg-accent/5 p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 text-sm font-semibold text-fg",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }), " Generate attributes with AI"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs leading-5 text-muted",
													children: "Describe the player and let AI fill in name, position, and the six-stat attributes."
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													value: aiPrompt,
													disabled: false,
													onChange: (e) => setAiPrompt(e.target.value),
													onKeyDown: (e) => {
														if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleCardAI();
													},
													placeholder: "Example: a pacey right winger, strong dribbler, weaker in the air",
													rows: 4,
													className: "mt-3 w-full rounded-[12px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle disabled:cursor-not-allowed disabled:opacity-50"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													className: "mt-3 w-full",
													onClick: () => void handleCardAI(),
													disabled: isGenerating,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
														" ",
														isGenerating ? "Generating..." : "Generate attributes"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-[14px] border border-line bg-surface p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted",
													children: "Reference image"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: cn("flex items-center justify-between rounded-[10px] border border-dashed border-line bg-elevated px-3 py-3 text-sm text-muted", "cursor-pointer"),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload a visual reference" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 text-accent" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "file",
															accept: "image/*",
															multiple: true,
															disabled: false,
															className: "hidden",
															onChange: (e) => {
																useCardReferences(e.target.files);
																e.target.value = "";
															}
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-[11px] leading-5 text-subtle",
													children: "Reference uploads are available for repeated inspiration. The local designer uses your written brief to apply the style."
												})
											]
										})
									]
								}),
								pane === "chassis" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-xs text-muted",
									children: "Chassis templates are starting points — not players. Auto assigns a tier from overall."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
									children: CARD_DESIGNS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: false,
										onClick: () => applyChassis(d),
										className: cn("rounded-[12px] border px-3 py-2 text-left text-xs disabled:cursor-not-allowed disabled:opacity-50", cardDesign === d ? "border-accent bg-accent/10" : "border-line bg-elevated"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("pcard-swatch", `pcard-swatch-${d}`) }), CARD_DESIGN_LABELS[d].split(" — ")[0]]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted",
											children: CARD_DESIGN_LABELS[d].split(" — ")[1] ?? "by OVR"
										})]
									}, d))
								})] }),
								pane === "color" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: COLOR_FIELDS.map((f) => {
										const val = String(style[f.key] ?? "");
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "text-xs text-muted",
											children: [f.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "color",
													disabled: false,
													value: val && val.startsWith("#") ? val : "#808080",
													onChange: (e) => patchStyle({ [f.key]: e.target.value }),
													className: "h-10 w-12 rounded border border-line bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: val,
													disabled: false,
													onChange: (e) => patchStyle({ [f.key]: e.target.value }),
													placeholder: "empty = tier default",
													className: "h-10 flex-1 rounded-[10px] border border-line bg-elevated px-2 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50"
												})]
											})]
										}, f.key);
									})
								}),
								pane === "frame" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Border thickness",
											value: style.borderWidth,
											min: .5,
											max: 4,
											step: .1,
											disabled: false,
											onChange: (v) => patchStyle({ borderWidth: v })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Border opacity",
											value: Math.round(style.borderOpacity * 100),
											min: 10,
											max: 100,
											disabled: false,
											onChange: (v) => patchStyle({ borderOpacity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Glow",
											value: Math.round(style.glowIntensity * 100),
											min: 0,
											max: 100,
											disabled: false,
											onChange: (v) => patchStyle({ glowIntensity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Shadow",
											value: Math.round(style.shadowIntensity * 100),
											min: 0,
											max: 100,
											disabled: false,
											onChange: (v) => patchStyle({ shadowIntensity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Highlight",
											value: Math.round(style.highlightIntensity * 100),
											min: 0,
											max: 100,
											disabled: false,
											onChange: (v) => patchStyle({ highlightIntensity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Pattern opacity",
											value: Math.round(style.patternOpacity * 100),
											min: 0,
											max: 50,
											disabled: false,
											onChange: (v) => patchStyle({ patternOpacity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-4 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													disabled: false,
													checked: style.showTactical,
													onChange: (e) => patchStyle({ showTactical: e.target.checked })
												}), "Tactical pitch marks"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													disabled: false,
													checked: style.showGrid,
													onChange: (e) => patchStyle({ showGrid: e.target.checked })
												}), "Data grid"]
											})]
										})
									]
								}),
								pane === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted",
												children: "Portrait framing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-2",
												children: ["face", "full-body"].map((frame) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													disabled: false,
													onClick: () => void applyPhotoFrame(frame),
													className: cn("rounded-full border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50", photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted"),
													children: frame === "face" ? "Face focus" : "Full body + kit"
												}, frame))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] text-subtle",
												children: "Changing the crop reprocesses the current upload when available."
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Scale",
											value: Math.round(style.photoScale * 100),
											min: 60,
											max: 160,
											disabled: false,
											onChange: (v) => patchStyle({ photoScale: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Horizontal",
											value: style.photoX,
											min: -25,
											max: 25,
											disabled: false,
											onChange: (v) => patchStyle({ photoX: v })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Vertical",
											value: style.photoY,
											min: -25,
											max: 25,
											disabled: false,
											onChange: (v) => patchStyle({ photoY: v })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Rotation",
											value: style.photoRotate,
											min: -15,
											max: 15,
											disabled: false,
											onChange: (v) => patchStyle({ photoRotate: v })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Brightness",
											value: Math.round(style.photoBrightness * 100),
											min: 40,
											max: 160,
											disabled: false,
											onChange: (v) => patchStyle({ photoBrightness: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Contrast",
											value: Math.round(style.photoContrast * 100),
											min: 40,
											max: 160,
											disabled: false,
											onChange: (v) => patchStyle({ photoContrast: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Saturation",
											value: Math.round(style.photoSaturate * 100),
											min: 0,
											max: 180,
											disabled: false,
											onChange: (v) => patchStyle({ photoSaturate: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Opacity",
											value: Math.round(style.photoOpacity * 100),
											min: 30,
											max: 100,
											disabled: false,
											onChange: (v) => patchStyle({ photoOpacity: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Blur",
											value: Math.round(style.photoBlur * 10),
											min: 0,
											max: 20,
											disabled: false,
											onChange: (v) => patchStyle({ photoBlur: v / 10 })
										})
									]
								}),
								pane === "data" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted",
											children: "Attribute visualization"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-1.5",
											children: ATTR_VIZ_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: false,
												onClick: () => patchStyle({ attrViz: o.id }),
												className: cn("rounded-full px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50", style.attrViz === o.id ? "bg-accent text-accent-fg" : "bg-elevated text-muted"),
												children: o.label
											}, o.id))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Name size",
											value: Math.round(style.nameSize * 100),
											min: 70,
											max: 140,
											disabled: false,
											onChange: (v) => patchStyle({ nameSize: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Letter spacing",
											value: Math.round(style.letterSpacing * 100),
											min: 0,
											max: 30,
											disabled: false,
											onChange: (v) => patchStyle({ letterSpacing: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "OVR scale",
											value: Math.round(style.ovrScale * 100),
											min: 70,
											max: 140,
											disabled: false,
											onChange: (v) => patchStyle({ ovrScale: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											label: "Form scale",
											value: Math.round(style.formScale * 100),
											min: 70,
											max: 140,
											disabled: false,
											onChange: (v) => patchStyle({ formScale: v / 100 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												disabled: false,
												checked: style.nameCase === "upper",
												onChange: (e) => patchStyle({ nameCase: e.target.checked ? "upper" : "title" })
											}), "Uppercase name"]
										})
									]
								}),
								pane === "presets" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: "Presets store the visual configuration only — they are not players."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [captain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: false,
												className: "rounded-full border border-[#f1d38a] bg-[#f1d38a]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f7e9bd] disabled:cursor-not-allowed disabled:opacity-50",
												onClick: () => {
													setCardDesign("auto");
													pushStyle(mergeCardStyle(CAPTAIN_SIGNATURE_STYLE));
												},
												children: "Captain signature"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: false,
												className: "rounded-full border border-line bg-elevated px-3 py-1.5 text-[11px] font-semibold text-muted disabled:cursor-not-allowed disabled:opacity-50",
												onClick: () => {
													const preset = CARD_PRESET_THEMES[Math.floor(Math.random() * CARD_PRESET_THEMES.length)];
													setCardDesign("auto");
													setPhotoFrame(preset.style.photoFrame);
													pushStyle(mergeCardStyle(preset.style));
												},
												children: "Random FC style"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-[12px] border border-line bg-surface p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2 flex items-center justify-between px-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-semibold uppercase tracking-[0.14em] text-fg",
													children: "FC card library"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-muted",
													children: [CARD_PRESET_THEMES.length, " designs"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid max-h-[430px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3",
												children: CARD_PRESET_THEMES.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: false,
													onClick: () => {
														setCardDesign("auto");
														setPhotoFrame(preset.style.photoFrame);
														pushStyle(mergeCardStyle(preset.style));
													},
													className: "flex min-h-[158px] flex-col items-center justify-between rounded-[12px] border border-line bg-elevated p-2 text-left transition hover:border-accent hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-elevated",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex h-[118px] items-center justify-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
															player: {
																...preview,
																cardDesign: "auto",
																cardStyle: mergeCardStyle(preset.style)
															},
															size: "mini"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2 w-full truncate text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-fg",
														children: preset.name
													})]
												}, preset.id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: presetName,
												disabled: false,
												onChange: (e) => setPresetName(e.target.value),
												placeholder: "Preset name",
												className: "h-10 flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												disabled: false,
												onClick: () => {
													if (!presetName.trim()) return;
													savePreset(presetName.trim(), cardDesign, style);
													setPresetName("");
												},
												children: "Save preset"
											})]
										}),
										presets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-subtle",
											children: "No saved presets yet."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-1.5",
											children: presets.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-elevated px-3 py-2",
												children: [
													renameId === pr.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														defaultValue: pr.name,
														className: "h-8 flex-1 rounded border border-line bg-surface px-2 text-sm",
														onBlur: (e) => {
															updatePreset(pr.id, { name: e.target.value.trim() || pr.name });
															setRenameId(null);
														},
														onKeyDown: (e) => {
															if (e.key === "Enter") e.target.blur();
														},
														autoFocus: true
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1 text-sm font-semibold",
														children: pr.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: false,
														className: "text-[11px] text-accent disabled:cursor-not-allowed disabled:opacity-50",
														onClick: () => {
															setCardDesign(pr.cardDesign);
															setPhotoFrame(pr.style.photoFrame);
															pushStyle(mergeCardStyle(pr.style));
														},
														children: "Apply"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: false,
														className: "text-[11px] text-muted disabled:cursor-not-allowed disabled:opacity-50",
														onClick: () => setRenameId(pr.id),
														children: "Rename"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: false,
														className: "text-[11px] text-muted disabled:cursor-not-allowed disabled:opacity-50",
														onClick: () => duplicatePreset(pr.id),
														children: "Duplicate"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														disabled: false,
														className: "text-[11px] text-warn disabled:cursor-not-allowed disabled:opacity-50",
														onClick: () => removePreset(pr.id),
														children: "Delete"
													})
												]
											}, pr.id))
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							player: preview,
							size: "full",
							className: "player-card-create-preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-[10px] text-subtle",
							children: "Live preview"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => setStep((s) => Math.max(0, s - 1)),
					disabled: step === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
				}), step < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setStep((s) => s + 1),
					disabled: step === 0 && !name.trim(),
					children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-1",
					children: [saveStatus === "error" && saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-[260px] text-right text-[11px] leading-4 text-warn",
						children: saveError
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						disabled: !name.trim() || saveStatus === "saving",
						className: cn(saveStatus === "synced" && "bg-emerald-600 hover:bg-emerald-600", saveStatus === "error" && "bg-warn/80 hover:bg-warn"),
						children: saveButtonLabel.toUpperCase()
					})]
				})]
			})
		]
	});
}
function PlayerProfile({ player, onClose }) {
	const matches = usePitchStore((s) => s.matches);
	const adjustAttribute = usePitchStore((s) => s.adjustAttribute);
	const removePlayer = usePitchStore((s) => s.removePlayer);
	const d = derivePlayer(player, matches);
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [adjKey, setAdjKey] = (0, import_react.useState)(null);
	const [adjVal, setAdjVal] = (0, import_react.useState)(70);
	const [reason, setReason] = (0, import_react.useState)("");
	const [confirmDel, setConfirmDel] = (0, import_react.useState)(false);
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerForm, {
		existing: player,
		onClose: () => setEdit(false),
		onCreated: () => setEdit(false)
	});
	const gk = isGoalkeeper(player.position) && player.gkCurrent;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-h-[min(92vh,860px)] flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-line px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "font-display text-xl tracking-wide",
				children: [
					player.name,
					" — ",
					player.position,
					" — ",
					d.ovr,
					" OVR"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "text-muted hover:text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-y-auto hq-scroll p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 md:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
						player,
						matches,
						size: "profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid w-full grid-cols-2 gap-2 text-center text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[10px] bg-elevated p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									children: "Base"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: d.base
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[10px] bg-elevated p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									children: "Effective"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg text-accent",
									children: d.effective
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[10px] bg-elevated p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									children: "Form"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg",
									children: d.form ?? "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[10px] bg-elevated p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted",
									children: "Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: d.role
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
							children: "Card stats"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
							children: (gk ? GK_KEYS : SIX_KEYS).map((k) => {
								const label = gk ? GK_LABELS[k] : SIX_LABELS[k];
								const current = gk ? player.gkCurrent[k] : player.currentSix[k];
								const base = gk ? player.gkBase[k] : player.baseSix[k];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setAdjKey(k);
										setAdjVal(current);
										setReason("");
									},
									className: "rounded-[12px] border border-line bg-elevated p-2.5 text-left",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase text-muted",
											children: label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-2xl tabular-nums",
											children: current
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-subtle",
											children: ["base ", base]
										})
									]
								}, k);
							})
						})] }),
						adjKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[14px] border border-accent/40 bg-accent/5 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 text-sm font-semibold",
									children: ["Manual adjustment — ", adjKey.toUpperCase()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 99,
									value: adjVal,
									onChange: (e) => setAdjVal(Number(e.target.value)),
									className: "w-full accent-accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-right font-display text-lg tabular-nums",
									children: adjVal
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: reason,
									onChange: (e) => setReason(e.target.value),
									placeholder: "Reason — e.g. Has become noticeably faster",
									className: "mb-2 h-10 w-full rounded-[10px] border border-line bg-surface px-3 text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => {
											adjustAttribute(player.id, adjKey, adjVal, reason || "Coach observation");
											setAdjKey(null);
										},
										children: "Save change"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setAdjKey(null),
										children: "Cancel"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
							children: "Position suitability"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-1.5 sm:grid-cols-3",
							children: d.suitability.slice(0, 9).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-[10px] bg-elevated px-2.5 py-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: s.pos
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums text-muted",
									children: [
										s.rating,
										" · ",
										s.pct,
										"%"
									]
								})]
							}, s.pos))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
							children: "Detailed attributes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: DETAIL_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[12px] border border-line p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-semibold uppercase tracking-wide text-accent",
									children: g.title
								}), g.keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: DETAIL_LABELS[k]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: player.detail[k]
									})]
								}, k))]
							}, g.title))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
								children: "Strengths"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1 text-sm text-muted",
								children: d.strengths.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", x] }, x))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
								children: "Watch-outs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1 text-sm text-muted",
								children: d.weaknesses.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", x] }, x))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
							children: "Match form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Average match rating ",
								d.avgRating ?? "—",
								" from ",
								d.ratingsCount,
								" rated game",
								d.ratingsCount === 1 ? "" : "s",
								". ",
								d.goals,
								" goals · ",
								d.motm,
								" MOTM. Form shifts effective rating by",
								" ",
								d.formDelta >= 0 ? "+" : "",
								d.formDelta,
								" — the base card stays ",
								d.base,
								"."
							]
						})] }),
						player.history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-sm font-semibold uppercase tracking-wide text-muted",
							children: "Attribute history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-sm",
							children: [...player.history].reverse().map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-[10px] bg-elevated px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: new Date(h.at).toLocaleDateString(void 0, {
											month: "short",
											day: "numeric"
										})
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: h.attr
									}),
									" ",
									h.from,
									" → ",
									h.to,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-accent",
										children: [h.to - h.from >= 0 ? "+" : "", h.to - h.from]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: h.reason
									})
								]
							}, h.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setEdit(true),
								children: "Edit card"
							}), confirmDel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => {
									removePlayer(player.id);
									onClose();
								},
								children: "Confirm delete"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmDel(false),
								children: "Cancel"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => setConfirmDel(true),
								children: "Remove from squad"
							})]
						})
					]
				})]
			})
		})]
	});
}
function resolveAcademyQuery(raw) {
	const q = raw.trim().toLowerCase();
	if (!q) return {
		target: "squad",
		answer: "Start in the Squad Hub to view the academy overview, player cards, and upcoming fixtures."
	};
	if (/tactic|formation|board|shape|press|build|possession|compare|simulat|plan/.test(q)) return {
		target: "tactiq",
		answer: "Open the Tactics section to review the formation board, compare shapes, and simulate team patterns before the next session."
	};
	if (/player card|show me the players|find player|look up player|player profile|which player|who is .*player|name.*player|roster/.test(q)) return {
		target: "players",
		answer: "Visit the Players area to browse player cards, review profiles, and find the right player for a position or role."
	};
	if (/who plays|who is|which player|player/.test(q) && !/goal|squad|team/.test(q)) return {
		target: "players",
		answer: "Use the Players section to locate the relevant card and review that player’s role, profile, and development path."
	};
	if (/advisor|insight|recommend|analysis|lab|suggest/.test(q)) return {
		target: "advisor",
		answer: "The Tactical Lab gives recommendations and deeper football analysis based on your current squad and formation choices."
	};
	return {
		target: "squad",
		answer: "Use the Squad Hub to review your academy overview, upcoming fixtures, and the latest player performances across the group."
	};
}
function matchDateTime(m) {
	return /* @__PURE__ */ new Date(`${m.date}T${m.kickoff || "13:30"}:00`);
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[14px] border border-line bg-surface p-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-2xl text-accent tabular-nums",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-[11px] text-muted",
			children: label
		})]
	});
}
function HomeView({ players, onOpenPlayer }) {
	const matches = usePitchStore((s) => s.matches);
	const trainings = usePitchStore((s) => s.trainings);
	const category = usePitchStore((s) => s.category);
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [assistantInput, setAssistantInput] = (0, import_react.useState)("");
	const [assistantResult, setAssistantResult] = (0, import_react.useState)(() => resolveAcademyQuery("where would you like to visit?"));
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 3e4);
		return () => window.clearInterval(t);
	}, []);
	const upcoming = (0, import_react.useMemo)(() => matches.filter((m) => m.category === category && matchDateTime(m) > now).sort((a, b) => matchDateTime(a).getTime() - matchDateTime(b).getTime()), [
		matches,
		category,
		now
	]);
	const next = upcoming[0];
	const countdown = (0, import_react.useMemo)(() => {
		if (!next) return null;
		let diff = Math.max(0, matchDateTime(next).getTime() - now.getTime());
		const days = Math.floor(diff / 864e5);
		diff -= days * 864e5;
		const hours = Math.floor(diff / 36e5);
		diff -= hours * 36e5;
		return {
			days,
			hours,
			mins: Math.floor(diff / 6e4)
		};
	}, [next, now]);
	const ranked = (0, import_react.useMemo)(() => players.map((p) => ({
		p,
		d: derivePlayer(p, matches)
	})).sort((a, b) => b.d.effective - a.d.effective), [players, matches]);
	const monthKey = now.toISOString().slice(0, 7);
	const monthMatches = matches.filter((m) => m.category === category && m.date.slice(0, 7) === monthKey);
	const motmCounts = {};
	monthMatches.forEach((m) => {
		if (m.motm) motmCounts[m.motm] = (motmCounts[m.motm] || 0) + 1;
	});
	const topMotm = Object.entries(motmCounts).sort((a, b) => b[1] - a[1])[0];
	const goalCounts = {};
	matches.forEach((m) => {
		Object.entries(m.goals || {}).forEach(([id, g]) => {
			goalCounts[id] = (goalCounts[id] || 0) + (g || 0);
		});
	});
	const topScorer = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0];
	const motmPlayer = players.find((p) => p.id === topMotm?.[0]);
	const scorerPlayer = players.find((p) => p.id === topScorer?.[0]);
	const pastTrainings = trainings.filter((t) => t.category === category && new Date(t.date) <= now);
	const rated = matches.filter((m) => m.category === category && Object.keys(m.ratings || {}).length > 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden rounded-[20px] border border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 md:grid-cols-[1.7fr_1fr] md:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent",
								children: "Welcome to the Aga Khan Squad Hub"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl leading-none tracking-[0.04em] text-fg md:text-5xl",
								children: "Academy performance, squad direction, and match preparation."
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-sm leading-6 text-muted md:text-[15px]",
								children: "A clear home for player tracking, tactical planning, training progress, and next-match preparation across the academy programme."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => usePitchStore.getState().setMode("tactiq"),
									className: "rounded-full bg-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg",
									children: "Visit tactics"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => usePitchStore.getState().setMode("squad"),
									className: "rounded-full border border-line bg-[#121c19] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg",
									children: "View squad"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[18px] border border-line bg-[#0d1513] p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 text-[10px] uppercase tracking-[0.18em] text-muted",
								children: "Ask the academy assistant"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-[12px] bg-[#131f1b] px-3 py-2",
										children: "“Where do I visit the tactics board?”"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-[12px] bg-[#131f1b] px-3 py-2",
										children: "“Who is the next best player for midfield?”"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-[12px] bg-[#131f1b] px-3 py-2",
										children: "“Can you help me find the right squad area?”"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: "academy-question",
										children: "Ask a question"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "academy-question",
										value: assistantInput,
										onChange: (e) => setAssistantInput(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") setAssistantResult(resolveAcademyQuery(assistantInput));
										},
										placeholder: "Where would you like to visit?",
										className: "w-full rounded-[12px] border border-line bg-[#101813] px-3 py-2 text-sm text-fg placeholder:text-subtle"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setAssistantResult(resolveAcademyQuery(assistantInput || "where would you like to visit?")),
										className: "w-full rounded-full bg-accent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-fg",
										children: "Ask the assistant"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-[12px] border border-accent/30 bg-accent/5 p-3 text-[12px] leading-6 text-[#dfece2]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent",
									children: "Reply"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: assistantResult.answer })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[16px] border border-line bg-surface p-4",
				children: next && countdown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] uppercase tracking-wider text-muted",
						children: ["Next ", next.kind === "Tournament" ? "tournament" : "match"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-2xl",
						children: [
							"vs ",
							next.opponent,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 rounded-full bg-elevated px-2 py-0.5 text-xs text-muted",
								children: next.venue
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 text-sm text-muted",
						children: [
							formatDateLong(next.date),
							" · ",
							formatKickoff(next.kickoff)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							["DAYS", countdown.days],
							["HRS", countdown.hours],
							["MIN", countdown.mins]
						].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 rounded-[12px] bg-elevated py-2 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-3xl tabular-nums text-accent",
								children: String(v).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] tracking-widest text-muted",
								children: l
							})]
						}, l))
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted",
					children: "No upcoming matches scheduled."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					{
						label: "Academy overview",
						value: "Squad hub",
						desc: "Tracking and home view for the whole programme."
					},
					{
						label: "Player planning",
						value: "Profiles",
						desc: "Review cards, ratings, and development details."
					},
					{
						label: "System direction",
						value: "Tactics",
						desc: "Formation comparisons and match preparation."
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[16px] border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.18em] text-muted",
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-display text-2xl text-fg",
							children: item.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-muted",
							children: item.desc
						})
					]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Squad",
						value: players.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Rated matches",
						value: rated
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Trainings",
						value: pastTrainings.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Fixtures left",
						value: upcoming.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[14px] border border-line bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4 text-accent" }), " Man of the month"]
					}), motmPlayer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-2",
						onClick: () => onOpenPlayer(motmPlayer),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							player: motmPlayer,
							matches,
							size: "tiny"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: motmPlayer.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-accent",
							children: [topMotm[1], " MOTM"]
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-subtle",
						children: "No MOTM picked this month."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[14px] border border-line bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-gold" }), " Top scorer"]
					}), scorerPlayer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-2",
						onClick: () => onOpenPlayer(scorerPlayer),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							player: scorerPlayer,
							matches,
							size: "tiny"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: scorerPlayer.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-gold",
							children: [topScorer[1], " goals"]
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-subtle",
						children: "No goals logged yet."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-display text-lg tracking-wide",
				children: "Top form right now"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [ranked.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[14px] border border-dashed border-line p-4 text-sm text-muted",
					children: "No player cards yet. Create one in My Cards."
				}), ranked.slice(0, 5).map(({ p, d }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onOpenPlayer(p),
					className: "flex w-full items-center gap-3 rounded-[14px] border border-line bg-surface px-3 py-2 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-4 font-display text-muted",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							player: p,
							matches,
							size: "tiny"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted",
								children: [
									p.position,
									" · ",
									d.role
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg tabular-nums",
								children: d.effective
							})]
						})
					]
				}, p.id))]
			})] })
		]
	});
}
function PlayersView({ players, onOpenPlayer }) {
	const matches = usePitchStore((s) => s.matches);
	const removePlayer = usePitchStore((s) => s.removePlayer);
	const duplicatePlayer = usePitchStore((s) => s.duplicatePlayer);
	const updatePlayer = usePitchStore((s) => s.updatePlayer);
	const [q, setQ] = (0, import_react.useState)("");
	const [pos, setPos] = (0, import_react.useState)("ALL");
	const [sort, setSort] = (0, import_react.useState)("ovr");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [rename, setRename] = (0, import_react.useState)(null);
	const [renameVal, setRenameVal] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => {
		let rows = players.map((p) => ({
			p,
			d: derivePlayer(p, matches)
		}));
		if (pos !== "ALL") rows = rows.filter((r) => r.p.position === pos || r.p.secondaryPositions.includes(pos));
		if (q.trim()) {
			const n = q.toLowerCase();
			rows = rows.filter((r) => r.p.name.toLowerCase().includes(n) || r.p.number.includes(n));
		}
		rows.sort((a, b) => {
			if (sort === "name") return a.p.name.localeCompare(b.p.name);
			if (sort === "form") return (b.d.form ?? 0) - (a.d.form ?? 0);
			if (sort === "pac") return b.p.currentSix.pac - a.p.currentSix.pac;
			if (sort === "def") return b.p.currentSix.def - a.p.currentSix.def;
			if (sort === "pas") return b.p.currentSix.pas - a.p.currentSix.pas;
			return b.d.ovr - a.d.ovr;
		});
		return rows;
	}, [
		players,
		matches,
		q,
		pos,
		sort
	]);
	const isEmpty = players.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-wide",
				children: "My Cards"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Only cards you create and save appear here. Nothing is generated automatically."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setCreating(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Create player card"]
			})]
		}),
		!isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-[160px] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search cards",
						className: "h-10 w-full rounded-[10px] border border-line bg-elevated pl-8 pr-3 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: pos,
					onChange: (e) => setPos(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "ALL",
						children: "All positions"
					}), POSITIONS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: p
					}, p))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ovr",
							children: "Sort: OVR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "form",
							children: "Sort: form"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pac",
							children: "Sort: PAC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pas",
							children: "Sort: PAS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "def",
							children: "Sort: DEF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "name",
							children: "Sort: name"
						})
					]
				})
			]
		}),
		isEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-surface px-6 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl tracking-wide",
					children: "No player cards yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm text-muted",
					children: "Create your first player card. Design the chassis, set attributes, then press SAVE CARD."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					onClick: () => setCreating(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Create player card"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-3 gap-y-10 pt-4 sm:grid-cols-3 lg:grid-cols-4",
			children: list.map(({ p }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
					player: p,
					matches,
					size: "full",
					onClick: () => onOpenPlayer(p)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap justify-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEditing(p),
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => duplicatePlayer(p.id),
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
							children: "Duplicate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setRename(p);
								setRenameVal(p.name);
							},
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
							children: "Rename"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmDelete(p),
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-warn hover:bg-warn/10",
							children: "Delete"
						})
					]
				})]
			}, p.id))
		}), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted",
			children: "No cards match your filters."
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: creating,
			onClose: () => setCreating(false),
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerForm, {
				onClose: () => setCreating(false),
				onCreated: () => setCreating(false)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!editing,
			onClose: () => setEditing(null),
			wide: true,
			children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerForm, {
				existing: editing,
				onClose: () => setEditing(null),
				onCreated: () => setEditing(null)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!confirmDelete,
			onClose: () => setConfirmDelete(null),
			children: confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl",
						children: "Delete card?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Remove ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: confirmDelete.name
							}),
							" permanently. This cannot be undone."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmDelete(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "danger",
							onClick: () => {
								removePlayer(confirmDelete.id);
								setConfirmDelete(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!rename,
			onClose: () => setRename(null),
			children: rename && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl",
						children: "Rename card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: renameVal,
						onChange: (e) => setRenameVal(e.target.value),
						className: "mt-3 h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setRename(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (renameVal.trim()) updatePlayer(rename.id, { name: renameVal.trim() });
								setRename(null);
							},
							children: "Save"
						})]
					})
				]
			})
		})
	] });
}
function TrainingView({ players }) {
	const trainings = usePitchStore((s) => s.trainings);
	const category = usePitchStore((s) => s.category);
	const addTraining = usePitchStore((s) => s.addTraining);
	const removeTraining = usePitchStore((s) => s.removeTraining);
	const toggleAttendance = usePitchStore((s) => s.toggleAttendance);
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [title, setTitle] = (0, import_react.useState)("Training");
	const [open, setOpen] = (0, import_react.useState)(null);
	const list = trainings.filter((t) => t.category === category).sort((a, b) => a.date < b.date ? 1 : -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 rounded-[14px] border border-line bg-surface p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "h-10 min-w-[140px] flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						addTraining(date, title);
						setTitle("Training");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Log session"]
				})
			]
		}), list.map((t) => {
			const present = players.filter((p) => t.attendance?.[p.id]).length;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "button",
					tabIndex: 0,
					onClick: () => setOpen(open === t.id ? null : t.id),
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setOpen(open === t.id ? null : t.id);
						}
					},
					className: "flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted",
						children: [
							formatDateLong(t.date),
							" · ",
							present,
							"/",
							players.length,
							" present"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-subtle hover:text-warn",
						onClick: (e) => {
							e.stopPropagation();
							removeTraining(t.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				}), open === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-1 border-t border-line p-2 sm:grid-cols-2",
					children: players.map((p) => {
						const on = !!t.attendance?.[p.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggleAttendance(t.id, p.id),
							className: "flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-left hover:bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: on ? "flex size-6 items-center justify-center rounded-full bg-accent text-accent-fg" : "flex size-6 items-center justify-center rounded-full border border-line",
								children: on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								children: [
									p.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: p.position
									})
								]
							})]
						}, p.id);
					})
				})]
			}, t.id);
		})]
	});
}
function MatchesView({ players, onOpenPlayer }) {
	const matches = usePitchStore((s) => s.matches);
	const category = usePitchStore((s) => s.category);
	const addMatch = usePitchStore((s) => s.addMatch);
	const removeMatch = usePitchStore((s) => s.removeMatch);
	const updateMatch = usePitchStore((s) => s.updateMatch);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [opponent, setOpponent] = (0, import_react.useState)("");
	const [venue, setVenue] = (0, import_react.useState)("Home");
	const [kickoff, setKickoff] = (0, import_react.useState)("13:30");
	const [kind, setKind] = (0, import_react.useState)("League");
	const [dragScorerId, setDragScorerId] = (0, import_react.useState)(null);
	const list = matches.filter((m) => m.category === category).sort((a, b) => a.date < b.date ? 1 : -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2 rounded-[14px] border border-line bg-surface p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: opponent,
					onChange: (e) => setOpponent(e.target.value),
					placeholder: "Opponent",
					className: "h-10 min-w-[120px] flex-1 rounded-[10px] border border-line bg-elevated px-3 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: venue,
					onChange: (e) => setVenue(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Home" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Away" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "time",
					value: kickoff,
					onChange: (e) => setKickoff(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: kind,
					onChange: (e) => setKind(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "League" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Tournament" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Friendly" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						if (!opponent.trim()) return;
						addMatch({
							date,
							opponent: opponent.trim(),
							venue,
							kickoff,
							kind
						});
						setOpponent("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add fixture"]
				})
			]
		}), list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[14px] border border-line bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "button",
				tabIndex: 0,
				onClick: () => setOpen(open === m.id ? null : m.id),
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setOpen(open === m.id ? null : m.id);
					}
				},
				className: "flex w-full cursor-pointer items-center justify-between px-3 py-3 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold",
					children: [
						"vs ",
						m.opponent,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-normal text-muted",
							children: [
								m.venue,
								" · ",
								m.kind
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted",
					children: [
						formatDateLong(m.date),
						" · ",
						formatKickoff(m.kickoff),
						m.teamScore !== null && m.opponentScore !== null ? ` · ${m.teamScore}–${m.opponentScore}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-subtle hover:text-warn",
					onClick: (e) => {
						e.stopPropagation();
						removeMatch(m.id);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}), open === m.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 border-t border-line p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[12px] border border-line bg-[#0f1714] p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-[10px] uppercase tracking-[0.14em] text-muted",
								children: "Result & MVP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Goal score"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "h-9 w-14 rounded-[8px] border border-line bg-elevated px-2 text-sm",
										value: m.teamScore ?? "",
										onChange: (e) => updateMatch(m.id, { teamScore: e.target.value === "" ? null : Number(e.target.value) })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "–"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "h-9 w-14 rounded-[8px] border border-line bg-elevated px-2 text-sm",
										value: m.opponentScore ?? "",
										onChange: (e) => updateMatch(m.id, { opponentScore: e.target.value === "" ? null : Number(e.target.value) })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-[10px] uppercase tracking-[0.14em] text-muted",
									children: "MVP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: m.motm ?? "__none__",
									onChange: (e) => updateMatch(m.id, { motm: e.target.value === "__none__" ? null : e.target.value }),
									className: "h-9 w-full rounded-[8px] border border-line bg-elevated px-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "__none__",
										children: "No MVP selected"
									}), players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[12px] border border-line bg-[#0f1714] p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-[10px] uppercase tracking-[0.14em] text-muted",
								children: "Goal scorers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-12 rounded-[10px] border border-dashed border-line bg-[#0d1513] p-2",
								onDragOver: (e) => e.preventDefault(),
								onDrop: (e) => {
									e.preventDefault();
									if (!dragScorerId) return;
									const goals = { ...m.goals };
									goals[dragScorerId] = (goals[dragScorerId] ?? 0) + 1;
									updateMatch(m.id, { goals });
									setDragScorerId(null);
								},
								children: Object.entries(m.goals ?? {}).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: Object.entries(m.goals ?? {}).map(([id, count]) => {
										const player = players.find((p) => p.id === id);
										if (!player) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											draggable: true,
											onDragStart: () => setDragScorerId(id),
											className: "flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-2.5 py-1.5 text-xs font-medium text-[#dfece2]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: player.name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent",
													children: count
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: (e) => {
														e.stopPropagation();
														const goals = { ...m.goals };
														if ((goals[id] ?? 1) <= 1) delete goals[id];
														else goals[id] = Math.max(0, (goals[id] ?? 1) - 1);
														updateMatch(m.id, { goals });
													},
													className: "text-subtle hover:text-warn",
													"aria-label": `Remove goal for ${player.name}`,
													children: "×"
												})
											]
										}, id);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-subtle",
									children: "Drop a player card here or add a scorer below."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									defaultValue: "",
									onChange: (e) => {
										const id = e.target.value;
										if (!id) return;
										const goals = { ...m.goals };
										goals[id] = (goals[id] ?? 0) + 1;
										updateMatch(m.id, { goals });
										e.target.value = "";
									},
									className: "h-9 flex-1 rounded-[8px] border border-line bg-elevated px-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Quick add scorer"
									}), players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: "Match ratings feed form. They never rewrite the base card."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							draggable: true,
							onDragStart: () => setDragScorerId(p.id),
							onDragEnd: () => setDragScorerId(null),
							className: "flex items-center gap-2 rounded-[10px] px-1 py-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onOpenPlayer(p),
									className: "w-28 truncate text-left text-sm",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 1,
									max: 10,
									step: .1,
									placeholder: "rating",
									value: m.ratings?.[p.id] ?? "",
									onChange: (e) => {
										const ratings = { ...m.ratings };
										if (e.target.value === "") delete ratings[p.id];
										else ratings[p.id] = Number(e.target.value);
										updateMatch(m.id, { ratings });
									},
									className: "h-8 w-16 rounded-[8px] border border-line bg-elevated px-2 text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									placeholder: "G",
									value: m.goals?.[p.id] ?? "",
									onChange: (e) => {
										const goals = { ...m.goals };
										if (e.target.value === "" || Number(e.target.value) === 0) delete goals[p.id];
										else goals[p.id] = Number(e.target.value);
										updateMatch(m.id, { goals });
									},
									className: "h-8 w-12 rounded-[8px] border border-line bg-elevated px-2 text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => updateMatch(m.id, { motm: m.motm === p.id ? null : p.id }),
									className: m.motm === p.id ? "text-accent text-xs font-semibold" : "text-subtle text-xs",
									children: "MVP"
								})
							]
						}, p.id))
					})
				]
			})]
		}, m.id))]
	});
}
function CalendarView() {
	const matches = usePitchStore((s) => s.matches);
	const trainings = usePitchStore((s) => s.trainings);
	const category = usePitchStore((s) => s.category);
	const setSquadTab = usePitchStore((s) => s.setSquadTab);
	const events = [...matches.filter((m) => m.category === category).map((m) => ({
		date: m.date,
		label: `Match vs ${m.opponent}`,
		kind: "match"
	})), ...trainings.filter((t) => t.category === category).map((t) => ({
		date: t.date,
		label: t.title,
		kind: "training"
	}))].sort((a, b) => a.date.localeCompare(b.date));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-[14px] border border-dashed border-line p-8 text-center text-sm text-muted",
			children: "No fixtures or sessions on the calendar yet."
		}), events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setSquadTab(e.kind === "match" ? "matches" : "training"),
			className: "flex w-full items-center gap-3 rounded-[12px] border border-line bg-surface px-3 py-2 text-left",
			children: [e.kind === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: e.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted",
				children: formatDateLong(e.date)
			})] })]
		}, i))]
	});
}
function LegacyCabinetView() {
	const trophies = usePitchStore((s) => s.trophies);
	const players = usePitchStore((s) => s.players);
	const matches = usePitchStore((s) => s.matches);
	const category = usePitchStore((s) => s.category);
	const addTrophy = usePitchStore((s) => s.addTrophy);
	const removeTrophy = usePitchStore((s) => s.removeTrophy);
	const [name, setName] = (0, import_react.useState)("Aga Khan U15 League Cup");
	const [competition, setCompetition] = (0, import_react.useState)("National League");
	const [season, setSeason] = (0, import_react.useState)("2026/27");
	const [notes, setNotes] = (0, import_react.useState)("A landmark season for the squad and a first trophy under the academy banner.");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const mvpRows = (0, import_react.useMemo)(() => {
		const counts = {};
		matches.filter((match) => match.category === category && match.motm).forEach((match) => {
			if (match.motm) counts[match.motm] = (counts[match.motm] ?? 0) + 1;
		});
		return Object.entries(counts).map(([playerId, wins]) => ({
			player: players.find((player) => player.id === playerId),
			wins
		})).filter((row) => !!row.player).sort((a, b) => b.wins - a.wins).slice(0, 3);
	}, [
		category,
		matches,
		players
	]);
	const handlePhoto = (file) => {
		if (!file) {
			setPhoto(null);
			return;
		}
		const reader = new FileReader();
		reader.onload = () => setPhoto(String(reader.result));
		reader.readAsDataURL(file);
	};
	const submitTrophy = () => {
		if (!name.trim() && !competition.trim() && !season.trim() && !photo) return;
		addTrophy({
			name,
			competition,
			season,
			notes,
			photo
		});
		setName("");
		setCompetition("");
		setSeason("");
		setNotes("");
		setPhoto(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden rounded-[22px] border border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center rounded-full border border-[#d4b66a]/30 bg-[#2a2214] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0d79a]",
								children: "Agakhans Legacy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl leading-none tracking-[0.06em] text-fg md:text-4xl",
								children: "Trophy cabinet for academy honours and proud moments."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-sm leading-6 text-muted",
								children: "Build a shelf of victories, upload a real photo, and preserve the club story in one place for the academy community."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[18px] border border-line bg-[#0d1513] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-[10px] uppercase tracking-[0.18em] text-muted",
							children: "Cabinet snapshot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-4xl text-accent tabular-nums",
								children: trophies.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pb-1 text-sm text-muted",
								children: "honours catalogued"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[18px] border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-end justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4b66a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" }), " Player honours"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-display text-2xl tracking-[0.04em] text-fg",
						children: "MVP trophies"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted",
						children: "Calculated from match MVP selections"
					})]
				}), mvpRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[12px] border border-dashed border-line px-3 py-4 text-sm text-muted",
					children: "MVP trophies will appear here as match results are recorded."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 md:grid-cols-3",
					children: mvpRows.map(({ player, wins }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-[14px] border border-[#d4b66a]/20 bg-[#15170f] px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d4b66a]/35 bg-[#242014] font-display text-lg text-[#f0d79a]",
								children: index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold text-fg",
									children: player.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.15em] text-muted",
									children: player.position
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl text-[#f0d79a]",
									children: wins
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] uppercase tracking-[0.14em] text-muted",
									children: "MVP"
								})]
							})
						]
					}, player.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-[420px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[18px] border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 text-[10px] uppercase tracking-[0.18em] text-muted",
						children: "Add a trophy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Trophy name",
								className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: competition,
								onChange: (e) => setCompetition(e.target.value),
								placeholder: "Competition",
								className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: season,
								onChange: (e) => setSeason(e.target.value),
								placeholder: "Season",
								className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm text-fg placeholder:text-subtle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Write a short memory of the achievement",
								rows: 4,
								className: "w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-line bg-[#0f1714] px-3 py-2 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: photo ? "Replace photo" : "Upload trophy photo" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => handlePhoto(e.target.files?.[0] ?? null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-line px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-accent",
										children: "Upload"
									})
								]
							}),
							photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-[12px] border border-line bg-[#0c120f]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photo,
									alt: "Trophy preview",
									className: "h-32 w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: submitTrophy,
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add to cabinet"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: trophies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[18px] border border-dashed border-line bg-surface p-8 text-center text-sm text-muted",
						children: "No trophies yet. Add your first academy highlight to begin the legacy cabinet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
						children: trophies.map((trophy) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "group relative overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,#141d1a_0%,#0d1513_100%)] p-3 shadow-[0_16px_30px_rgba(8,12,10,0.25)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-4 top-0 h-24 rounded-b-[40%] bg-gradient-to-b from-[#dcbf72]/18 to-transparent blur-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rounded-[16px] border border-[#d4b66a]/15 bg-[#0f1714] p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-full border border-[#d4b66a]/30 bg-[#1a170f] px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-[#f0d79a]",
											children: trophy.season
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeTrophy(trophy.id),
											className: "rounded-full border border-line p-1.5 text-subtle hover:text-warn",
											"aria-label": `Remove ${trophy.name}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-3 flex h-28 items-center justify-center rounded-[14px] border border-line bg-[radial-gradient(circle_at_top,#212f2c,#0d1513_58%)]",
										children: trophy.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: trophy.photo,
											alt: trophy.name,
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-2 text-[#d7c88b]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase tracking-[0.18em] text-muted",
												children: "Honour"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-xl leading-none text-fg",
												children: trophy.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] uppercase tracking-[0.18em] text-accent",
												children: trophy.competition
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "min-h-[44px] text-xs leading-5 text-muted",
												children: trophy.notes || "Academy achievement"
											})
										]
									})
								]
							})]
						}, trophy.id))
					})
				})]
			})
		]
	});
}
function CoachSilhouette({ name }) {
	const ini = initials(name);
	const gid = (0, import_react.useId)().replace(/:/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pcard-sil",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 120 180",
			className: "pcard-sil-svg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: gid,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--pc-accent)",
						stopOpacity: "0.55"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--pc-edge)",
						stopOpacity: "0.18"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 10 L74 22 L72 44 L48 44 L46 22 Z",
					fill: `url(#${gid})`,
					stroke: "var(--pc-accent)",
					strokeWidth: "1.2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M28 58 L52 52 L68 52 L92 58 L86 118 L60 128 L34 118 Z",
					fill: `url(#${gid})`,
					stroke: "var(--pc-accent)",
					strokeWidth: "1.1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 118 L48 170 L58 170 L56 124 Z",
					fill: `url(#${gid})`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M80 118 L72 170 L62 170 L64 124 Z",
					fill: `url(#${gid})`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pcard-sil-ini",
			children: ini
		})]
	});
}
function CoachPhoto({ src, name }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setFailed(false), [src]);
	if (!src || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachSilhouette, { name });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: name,
		className: "pcard-photo",
		draggable: false,
		onError: () => setFailed(true)
	});
}
/**
* Resolve a coach's cardDesign to a guaranteed-valid CardTier key.
* Defensive against: missing cardDesign (legacy coaches saved before this
* field existed), the literal "auto" value, or any value that somehow
* doesn't exist in TIER_META. Always falls back to "core" rather than
* ever returning undefined — this is what was crashing on meta.layers.
*/
function resolveTier(cardDesign) {
	if (cardDesign && typeof cardDesign === "string" && cardDesign !== "auto" && TIER_META[cardDesign]) return cardDesign;
	return "core";
}
function CoachCard({ coach, size = "full", onClick, className }) {
	const compact = size === "tiny" || size === "board";
	const style = mergeCardStyle(coach.cardStyle);
	const tier = resolveTier(coach.cardDesign);
	const meta = TIER_META[tier];
	const cssVars = styleToCssVars(style);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: onClick ? "button" : void 0,
		tabIndex: onClick ? 0 : void 0,
		onClick,
		"data-tier": tier,
		"data-layers": meta.layers,
		style: cssVars,
		className: cn("pcard pcard-elite", `pcard-${tier}`, `pcard-sz-${size}`, onClick && "is-clickable", style.photoFrame === "full-body" && "pcard-frame-full-body", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pcard-stage",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pcard-glow",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pcard-chassis" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pcard-brackets",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pcard-photo-wrap",
					style: {
						transform: `translate(${style.photoX}%, ${style.photoY}%) rotate(${style.photoRotate}deg) scale(${style.photoScale})`,
						filter: `brightness(${style.photoBrightness}) contrast(${style.photoContrast}) saturate(${style.photoSaturate}) blur(${style.photoBlur}px)`,
						opacity: style.photoOpacity
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachPhoto, {
						src: coach.photo,
						name: coach.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pcard-photo-fade" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pcard-shine",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pcard-hud",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pcard-top",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pcard-ovr-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pcard-kicker",
								children: "ROLE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pcard-pos",
								style: { fontSize: compact ? "8px" : "13px" },
								children: coach.role.toUpperCase()
							})]
						})
					}), compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pcard-board-name",
						children: coach.name
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pcard-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pcard-nameplate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pcard-name",
								children: coach.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pcard-meta",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: coach.team || "AKAN HQ" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1 px-1 text-center text-[10px] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate",
								children: coach.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: coach.phone })]
						})]
					})]
				})
			]
		})
	});
}
var ROLES = [
	"Head Coach",
	"Assistant Coach",
	"Goalkeeping Coach",
	"Fitness Coach",
	"Scout"
];
function CoachForm({ existing, onClose }) {
	const addCoach = usePitchStore((s) => s.addCoach);
	const updateCoach = usePitchStore((s) => s.updateCoach);
	const [tab, setTab] = (0, import_react.useState)("info");
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "");
	const [role, setRole] = (0, import_react.useState)(existing?.role ?? "Head Coach");
	const [phone, setPhone] = (0, import_react.useState)(existing?.phone ?? "");
	const [email, setEmail] = (0, import_react.useState)(existing?.email ?? "");
	const [team, setTeam] = (0, import_react.useState)(existing?.team ?? "AKAN HQ");
	const [bio, setBio] = (0, import_react.useState)(existing?.bio ?? "");
	const [photo, setPhoto] = (0, import_react.useState)(existing?.photo ?? null);
	const [cardDesign, setCardDesign] = (0, import_react.useState)(normalizeCardDesign(existing?.cardDesign ?? "auto"));
	const [style, setStyle] = (0, import_react.useState)(mergeCardStyle(existing?.cardStyle));
	function patchStyle(partial) {
		setStyle((s) => ({
			...s,
			...partial
		}));
	}
	function applyChassis(d) {
		setCardDesign(d);
		if (d !== "auto") {
			const pal = TIER_PALETTE[d];
			if (pal) patchStyle(pal);
		}
	}
	const previewCoach = {
		id: existing?.id ?? "preview",
		name: name || "New Coach",
		photo,
		role,
		phone,
		email,
		team,
		category: "U15",
		bio,
		cardDesign,
		cardStyle: style,
		createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
	function save() {
		if (!name.trim() || !email.trim()) return;
		const payload = {
			name: name.trim(),
			role,
			phone,
			email: email.trim(),
			team,
			bio,
			photo,
			cardDesign,
			cardStyle: style
		};
		if (existing) updateCoach(existing.id, payload);
		else addCoach(payload);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-h-[min(90vh,760px)] flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl",
					children: existing ? "Edit coach" : "Add coach"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "text-sm text-muted hover:text-fg",
					children: "Close"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 border-b border-line px-4 pt-2",
				children: [["info", "Info"], ["design", "Card design"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("rounded-t-[10px] px-3 py-1.5 text-xs font-semibold", tab === id ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[1fr_220px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [tab === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-14 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-elevated",
									children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photo,
										alt: "",
										className: "size-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5 text-subtle" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: async (e) => {
										const f = e.target.files?.[0];
										if (!f) return;
										const reader = new FileReader();
										reader.onload = () => setPhoto(String(reader.result));
										reader.readAsDataURL(f);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Upload photo"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Full name",
							className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm",
							children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "Email",
							type: "email",
							className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "Phone number",
							className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: team,
							onChange: (e) => setTeam(e.target.value),
							placeholder: "Team",
							className: "h-10 w-full rounded-[10px] border border-line bg-elevated px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							placeholder: "Short bio (optional)",
							rows: 3,
							className: "w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
						})
					]
				}), tab === "design" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs text-muted",
							children: "Chassis template — same styles used for player cards."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
							children: CARD_DESIGNS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => applyChassis(d),
								className: cn("rounded-[12px] border px-3 py-2 text-left text-xs", cardDesign === d ? "border-accent bg-accent/10" : "border-line bg-elevated"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("pcard-swatch", `pcard-swatch-${d}`) }), CARD_DESIGN_LABELS[d].split(" — ")[0]]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted",
									children: CARD_DESIGN_LABELS[d].split(" — ")[1] ?? ""
								})]
							}, d))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								{
									key: "primary",
									label: "Primary"
								},
								{
									key: "secondary",
									label: "Secondary"
								},
								{
									key: "accent",
									label: "Accent"
								},
								{
									key: "background",
									label: "Background"
								},
								{
									key: "border",
									label: "Border"
								},
								{
									key: "glowColor",
									label: "Glow"
								}
							].map((f) => {
								const val = String(style[f.key] ?? "");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted",
									children: [f.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: val && val.startsWith("#") ? val : "#808080",
											onChange: (e) => patchStyle({ [f.key]: e.target.value }),
											className: "h-10 w-12 rounded border border-line bg-elevated"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: val,
											onChange: (e) => patchStyle({ [f.key]: e.target.value }),
											placeholder: "empty = tier default",
											className: "h-10 flex-1 rounded-[10px] border border-line bg-elevated px-2 text-sm"
										})]
									})]
								}, f.key);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted",
							children: "Portrait framing"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: ["face", "full-body"].map((frame) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => patchStyle({ photoFrame: frame }),
								className: cn("rounded-full border px-3 py-1.5 text-xs font-semibold", style.photoFrame === frame ? "border-accent bg-accent/10 text-accent" : "border-line bg-elevated text-muted"),
								children: frame === "face" ? "Face focus" : "Full body"
							}, frame))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-muted underline",
							onClick: () => {
								setCardDesign("auto");
								setStyle({ ...DEFAULT_CARD_STYLE });
							},
							children: "Reset design to default"
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachCard, {
							coach: previewCoach,
							size: "full"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-center text-[10px] text-subtle",
							children: "Live preview"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 border-t border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					disabled: !name.trim() || !email.trim(),
					children: "Save coach"
				})]
			})
		]
	});
}
function CallUpBuilder({ coach, players, onClose }) {
	const trainingCountForPlayer = usePitchStore((s) => s.trainingCountForPlayer);
	const createCallUp = usePitchStore((s) => s.createCallUp);
	const callUps = usePitchStore((s) => s.callUps);
	const toggleRoster = usePitchStore((s) => s.toggleRoster);
	const [callUpName, setCallUpName] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [reuseId, setReuseId] = (0, import_react.useState)("");
	const [notSelectedNote, setNotSelectedNote] = (0, import_react.useState)("");
	const [calledNote, setCalledNote] = (0, import_react.useState)("");
	const [rosterOnly, setRosterOnly] = (0, import_react.useState)(true);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const visible = (0, import_react.useMemo)(() => rosterOnly ? players.filter((p) => p.onRoster) : players, [players, rosterOnly]);
	const ranked = (0, import_react.useMemo)(() => [...visible].sort((a, b) => trainingCountForPlayer(b.id) - trainingCountForPlayer(a.id)), [visible, trainingCountForPlayer]);
	const offRosterCount = players.length - players.filter((p) => p.onRoster).length;
	function applyReuse(id) {
		setReuseId(id);
		const src = callUps.find((c) => c.id === id);
		if (!src) return;
		setSelected(new Set(src.entries.filter((e) => e.status === "called").map((e) => e.playerId)));
	}
	function markCalled(id) {
		setSelected((s) => new Set(s).add(id));
	}
	function markNotSelected(id) {
		setSelected((s) => {
			const next = new Set(s);
			next.delete(id);
			return next;
		});
	}
	async function send() {
		if (!callUpName.trim() || sending) return;
		const called = visible.filter((p) => selected.has(p.id));
		const notSelected = visible.filter((p) => !selected.has(p.id));
		setSending(true);
		setSendError(null);
		try {
			const response = await fetch("/send-callup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					callUpName: callUpName.trim(),
					coachName: coach.name,
					coachEmail: coach.email,
					calledNote: calledNote.trim() || null,
					notSelectedNote: notSelectedNote.trim() || null,
					called: called.map((p) => ({
						playerId: p.id,
						name: p.name,
						email: p.email?.trim() || p.guardianEmail?.trim() || "",
						photo: p.photo,
						position: p.position
					})),
					notSelected: notSelected.map((p) => ({
						playerId: p.id,
						name: p.name,
						email: p.email?.trim() || p.guardianEmail?.trim() || "",
						photo: p.photo,
						position: p.position
					}))
				})
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error || `Send failed (status ${response.status})`);
			createCallUp(callUpName, coach.id, [...selected]);
			setResult({
				called,
				notSelected,
				results: payload?.results ?? []
			});
		} catch (err) {
			setSendError(err instanceof Error ? err.message : "Could not send the call-up. Check your connection and try again.");
		} finally {
			setSending(false);
		}
	}
	if (result) {
		const resultFor = (playerId) => result.results.find((r) => r.playerId === playerId);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 font-display text-xl",
					children: "Call-up sent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-sm text-muted",
					children: [
						"\"",
						callUpName,
						"\" saved. Delivery status per player below."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[12px] border border-accent/30 bg-accent/5 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 text-xs font-semibold uppercase text-accent",
							children: [
								"Called up (",
								result.called.length,
								")"
							]
						}), result.called.map((p) => {
							const r = resultFor(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 text-sm",
								children: [
									p.name,
									" ",
									r?.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-accent",
										children: "— email sent"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-warn",
										children: ["— ", r?.error || "not sent (no email on file)"]
									})
								]
							}, p.id);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[12px] border border-line bg-elevated p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 text-xs font-semibold uppercase text-muted",
							children: [
								"Not selected (",
								result.notSelected.length,
								")"
							]
						}), result.notSelected.map((p) => {
							const r = resultFor(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 text-sm text-muted",
								children: [
									p.name,
									" ",
									r?.success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "— email sent"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-warn",
										children: ["— ", r?.error || "not sent (no email on file)"]
									})
								]
							}, p.id);
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: onClose,
					children: "Done"
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 font-display text-xl",
				children: ["New call-up — ", coach.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted",
				children: "Players are sorted by training attendance — most-trained first. Use the buttons on each row to mark them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line bg-elevated px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-xs font-semibold text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: rosterOnly,
						onChange: (e) => setRosterOnly(e.target.checked),
						className: "size-4"
					}), "Show roster players only"]
				}), offRosterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-subtle",
					children: [
						offRosterCount,
						" player",
						offRosterCount === 1 ? "" : "s",
						" marked off-roster",
						rosterOnly ? " (hidden)" : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: callUpName,
					onChange: (e) => setCallUpName(e.target.value),
					placeholder: "Call-up name (e.g. vs Riverside, Sat)",
					className: "h-10 flex-1 min-w-[180px] rounded-[10px] border border-line bg-elevated px-3 text-sm"
				}), callUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: reuseId,
					onChange: (e) => applyReuse(e.target.value),
					className: "h-10 rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Start a new list"
					}), callUps.filter((c) => c.coachId === coach.id).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.id,
						children: ["Reuse: ", c.name]
					}, c.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted",
						children: [
							selected.size,
							" of ",
							ranked.length,
							" marked called up"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelected(new Set(ranked.map((p) => p.id))),
						className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
						children: "Mark all called up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelected(/* @__PURE__ */ new Set()),
						className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
						children: "Mark all not selected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelected(new Set(ranked.slice(0, 11).map((p) => p.id))),
						className: "rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent",
						children: "Top 11 by attendance"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[40vh] space-y-1.5 overflow-y-auto hq-scroll",
				children: ranked.map((p) => {
					const count = trainingCountForPlayer(p.id);
					const on = selected.has(p.id);
					const hasEmail = Boolean(p.email?.trim() || p.guardianEmail?.trim());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex w-full flex-wrap items-center gap-3 rounded-[10px] border px-3 py-2", on ? "border-accent bg-accent/10" : "border-line bg-elevated"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
								player: p,
								size: "tiny"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[120px] flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted",
									children: [
										p.position,
										" · ",
										count,
										" training",
										count === 1 ? "" : "s",
										" attended",
										!hasEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-warn",
											children: " · no email on file"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => markCalled(p.id),
									className: cn("rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide", on ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-muted hover:border-accent/50 hover:text-accent"),
									children: "✓ Called up"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => markNotSelected(p.id),
									className: cn("rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide", !on ? "border-warn bg-warn/20 text-warn" : "border-line bg-surface text-muted hover:border-warn/50 hover:text-warn"),
									children: "Not selected"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleRoster(p.id),
								title: p.onRoster ? "Remove from roster" : "Add to roster",
								className: cn("shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold", p.onRoster ? "border-line bg-surface text-muted hover:text-warn" : "border-accent/40 bg-accent/10 text-accent"),
								children: p.onRoster ? "On roster" : "Off roster"
							})
						]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Custom note for called-up players (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: calledNote,
						onChange: (e) => setCalledNote(e.target.value),
						placeholder: "e.g. Meet at the main gate 30 min before kickoff, full kit required.",
						rows: 3,
						className: "mt-1 w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Custom note for players not selected (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: notSelectedNote,
						onChange: (e) => setNotSelectedNote(e.target.value),
						placeholder: "e.g. Really close call this week — keep up the work at Tuesday's session.",
						rows: 3,
						className: "mt-1 w-full rounded-[10px] border border-line bg-elevated px-3 py-2 text-sm"
					})]
				})]
			}),
			sendError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn",
				children: sendError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					disabled: sending,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void send(),
					disabled: !callUpName.trim() || sending,
					children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Sending..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), " Send call-up"] })
				})]
			})
		]
	});
}
function CoachesView({ players }) {
	const coaches = usePitchStore((s) => s.coaches);
	const callUps = usePitchStore((s) => s.callUps);
	const removeCoach = usePitchStore((s) => s.removeCoach);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [callingUp, setCallingUp] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-wide",
				children: "Coaches"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Manage staff profiles and build match call-ups."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setCreating(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add coach"]
			})]
		}),
		coaches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-surface px-6 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-3 size-8 text-subtle" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl tracking-wide",
					children: "No coaches yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm text-muted",
					children: "Add a coach profile to start building match call-ups."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					onClick: () => setCreating(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add coach"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-x-3 gap-y-10 pt-4 sm:grid-cols-3 lg:grid-cols-4",
			children: coaches.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative flex flex-col items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachCard, {
					coach: c,
					size: "full"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap justify-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCallingUp(c),
							className: "rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent",
							children: "New call-up"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEditing(c),
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-fg",
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmDelete(c),
							className: "rounded-full border border-line bg-elevated px-2.5 py-1 text-[11px] font-semibold text-warn hover:bg-warn/10",
							children: "Delete"
						})
					]
				})]
			}, c.id))
		}),
		callUps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-display text-lg",
				children: "Recent call-ups"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1.5",
				children: callUps.map((cu) => {
					const coach = coaches.find((c) => c.id === cu.coachId);
					const calledCount = cu.entries.filter((e) => e.status === "called").length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between rounded-[10px] border border-line bg-surface px-3 py-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: cu.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								coach?.name ?? "Unknown coach",
								" · ",
								calledCount,
								" called up · ",
								cu.date
							]
						})] })
					}, cu.id);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: creating,
			onClose: () => setCreating(false),
			wide: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachForm, { onClose: () => setCreating(false) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!editing,
			onClose: () => setEditing(null),
			wide: true,
			children: editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachForm, {
				existing: editing,
				onClose: () => setEditing(null)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!callingUp,
			onClose: () => setCallingUp(null),
			wide: true,
			children: callingUp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallUpBuilder, {
				coach: callingUp,
				players,
				onClose: () => setCallingUp(null)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			open: !!confirmDelete,
			onClose: () => setConfirmDelete(null),
			children: confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl",
						children: "Delete coach?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Remove ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: confirmDelete.name
							}),
							" and their call-up history. This cannot be undone."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmDelete(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "danger",
							onClick: () => {
								removeCoach(confirmDelete.id);
								setConfirmDelete(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
						})]
					})
				]
			})
		})
	] });
}
function Markings() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 100",
		className: "absolute inset-0 size-full",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "1.5",
				y: "1.5",
				width: "97",
				height: "97",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "1.5",
				y1: "50",
				x2: "98.5",
				y2: "50",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: "9",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r: "0.7",
				fill: "rgba(255,255,255,0.35)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "1.5",
				width: "56",
				height: "14",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "84.5",
				width: "56",
				height: "14",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "1.5",
				width: "28",
				height: "6",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "36",
				y: "92.5",
				width: "28",
				height: "6",
				fill: "none",
				stroke: "rgba(255,255,255,0.28)",
				strokeWidth: "0.45"
			})
		]
	});
}
function PitchSurface({ own, opp = [], ball, playersById, slotMap, showLanes, onSlotClick, onDropOnSlot, onFreeMove, interactive, cardSize = "tiny", selectedSlotId }) {
	const matches = usePitchStore((s) => s.matches);
	const boardRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	const justDraggedRef = (0, import_react.useRef)(false);
	const [drag, setDrag] = (0, import_react.useState)(null);
	const ballSlot = ball ?? {
		x: 50,
		y: 92
	};
	function pointToPct(clientX, clientY) {
		const rect = boardRef.current?.getBoundingClientRect();
		if (!rect) return {
			x: 50,
			y: 50
		};
		const x = (clientX - rect.left) / rect.width * 100;
		const y = (clientY - rect.top) / rect.height * 100;
		return {
			x: Math.min(97, Math.max(3, x)),
			y: Math.min(97, Math.max(3, y))
		};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boardRef,
		className: "pitch-board relative w-full overflow-hidden rounded-[14px]",
		style: {
			aspectRatio: "0.68",
			touchAction: interactive ? "none" : void 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markings, {}),
			showLanes && own.filter((s) => s.id !== "gk").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-0 top-0 h-px origin-left bg-accent/25",
				style: {
					width: `${Math.hypot(s.x - ballSlot.x, s.y - ballSlot.y)}%`,
					left: `${ballSlot.x}%`,
					top: `${ballSlot.y}%`,
					transform: `rotate(${Math.atan2(s.y - ballSlot.y, s.x - ballSlot.x)}rad)`
				}
			}, "lane" + s.id)),
			opp.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tq-dot pointer-events-none absolute",
				style: {
					left: `${s.x}%`,
					top: `${s.y}%`,
					transform: "translate(-50%,-50%)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-6 items-center justify-center rounded-full bg-fg text-[8px] font-bold text-bg",
					children: s.pos
				})
			}, "o" + s.id)),
			own.map((s) => {
				const pid = slotMap[s.id];
				const player = pid ? playersById[pid] : void 0;
				const isDragging = drag?.id === s.id;
				const left = isDragging ? drag.x : s.x;
				const top = isDragging ? drag.y : s.y;
				const isSelected = selectedSlotId === s.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot-id": s.id,
					className: cn("tq-card absolute z-10", s.id === "gk" && "tq-card-gk", isDragging && "z-30 scale-105 cursor-grabbing", interactive && player && !isDragging && "cursor-grab", isSelected && "z-20 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-surface"),
					style: {
						left: `${left}%`,
						top: `${top}%`,
						transform: "translate(-50%,-50%)"
					},
					onPointerDown: (e) => {
						if (!interactive || !player) return;
						e.currentTarget.setPointerCapture(e.pointerId);
						const p = pointToPct(e.clientX, e.clientY);
						dragRef.current = {
							id: s.id,
							startX: p.x,
							startY: p.y,
							moved: false
						};
						setDrag({
							id: s.id,
							x: p.x,
							y: p.y
						});
					},
					onPointerMove: (e) => {
						const d = dragRef.current;
						if (!d || d.id !== s.id) return;
						const p = pointToPct(e.clientX, e.clientY);
						if (Math.hypot(p.x - d.startX, p.y - d.startY) > 1.5) d.moved = true;
						setDrag({
							id: s.id,
							x: p.x,
							y: p.y
						});
					},
					onPointerUp: (e) => {
						const d = dragRef.current;
						if (!d || d.id !== s.id) return;
						const p = pointToPct(e.clientX, e.clientY);
						setDrag(null);
						dragRef.current = null;
						if (!d.moved) return;
						justDraggedRef.current = true;
						const targetId = (document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-slot-id]"))?.dataset.slotId;
						if (targetId && targetId !== s.id) onDropOnSlot?.(s.id, targetId);
						else onFreeMove?.(s.id, p.x, p.y);
					},
					children: player ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
						player,
						matches,
						size: cardSize,
						slotPosition: s.pos,
						onClick: () => {
							if (justDraggedRef.current) {
								justDraggedRef.current = false;
								return;
							}
							onSlotClick?.(s);
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySlotCard, {
						pos: s.pos,
						onClick: () => onSlotClick?.(s),
						size: cardSize
					})
				}, s.id);
			}),
			ball && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "tq-ball pointer-events-none absolute z-20 size-2.5 rounded-full bg-white shadow",
				style: {
					left: `${ball.x}%`,
					top: `${ball.y}%`,
					transform: "translate(-50%,-50%)"
				}
			})
		]
	});
}
function tacticalScore(player, pos, matches) {
	const d = derivePlayer(player, matches);
	const posRating = roleAdjustedRating(player, pos, 1.1);
	const suitability = suitabilityPct(player, pos);
	const effective = d.effective;
	const formBoost = formDelta(d.form);
	const score = posRating * .45 + suitability / 100 * 35 + effective * .2 + formBoost * 3;
	let formNote;
	if (d.form !== null && d.form >= 8.5 && d.base > effective - 1) formNote = `${player.name} is in excellent form (${d.form}/10) — currently performing above base card.`;
	if (d.form !== null && d.form <= 6.2) formNote = `${player.name} has a higher base rating but is in poor form (${d.form}/10).`;
	return {
		score,
		posRating,
		suitability,
		effective,
		formNote
	};
}
function assignBest(slots, players, matches) {
	const remaining = [...players];
	const assignment = [];
	const formNotes = [];
	const scarcity = (pos) => {
		if (pos === "GK") return 0;
		if ([
			"ST",
			"CF",
			"SS"
		].includes(pos)) return 1;
		if ([
			"CB",
			"LCB",
			"RCB"
		].includes(pos)) return 2;
		if ([
			"LB",
			"RB",
			"LWB",
			"RWB"
		].includes(pos)) return 3;
		if (["LW", "RW"].includes(pos)) return 4;
		return 5;
	};
	const ordered = [...slots].sort((a, b) => scarcity(a.pos) - scarcity(b.pos));
	const used = /* @__PURE__ */ new Set();
	for (const slot of ordered) {
		let best = null;
		for (const p of remaining) {
			if (used.has(p.id)) continue;
			if (slot.pos === "GK" && !isGoalkeeper(p.position) && !p.secondaryPositions.includes("GK")) {}
			if (slot.pos !== "GK" && isGoalkeeper(p.position)) continue;
			const meta = tacticalScore(p, slot.pos, matches);
			if (!best || meta.score > best.meta.score) best = {
				player: p,
				meta
			};
		}
		if (slot.pos === "GK" && best && !isGoalkeeper(best.player.position)) {
			const gk = remaining.find((p) => isGoalkeeper(p.position) && !used.has(p.id));
			if (gk) best = {
				player: gk,
				meta: tacticalScore(gk, "GK", matches)
			};
		}
		if (!best) {
			assignment.push({
				slot,
				player: null,
				posRating: 0,
				suitability: 0,
				effective: 0,
				reason: "No player available for this role."
			});
			continue;
		}
		used.add(best.player.id);
		if (best.meta.formNote) formNotes.push(best.meta.formNote);
		const d = derivePlayer(best.player, matches);
		const reason = best.meta.suitability >= 80 ? `Natural ${slot.pos} — ${best.meta.suitability}% fit, ${d.role.toLowerCase()}.` : `Cover at ${slot.pos} (${best.meta.suitability}% suitability) with ${d.effective} effective rating.`;
		assignment.push({
			slot,
			player: best.player,
			posRating: best.meta.posRating,
			suitability: best.meta.suitability,
			effective: best.meta.effective,
			reason
		});
	}
	assignment.sort((a, b) => slots.findIndex((s) => s.id === a.slot.id) - slots.findIndex((s) => s.id === b.slot.id));
	return {
		assignment,
		formNotes
	};
}
function axisScores(assignment, formation) {
	const filled = assignment.filter((a) => a.player);
	const avg = (line) => {
		const rows = filled.filter((a) => a.slot.line === line);
		if (!rows.length) return 50;
		return rows.reduce((s, a) => s + a.posRating, 0) / rows.length;
	};
	const shape = ratingsFor(formation);
	const defP = avg("DEF");
	const midP = avg("MID");
	const fwdP = avg("FWD");
	const gk = filled.find((a) => a.slot.pos === "GK")?.posRating ?? 60;
	const defence = clamp(Math.round(defP * .55 + gk * .2 + midP * .15 + shape.Defending * 4), 1, 99);
	return {
		attack: clamp(Math.round(fwdP * .6 + midP * .25 + shape.Attacking * 4), 1, 99),
		defence,
		possession: clamp(Math.round(midP * .55 + filled.reduce((s, a) => s + (a.player?.currentSix.pas ?? 60), 0) / Math.max(1, filled.length) * .3 + shape.Possession * 3), 1, 99),
		width: clamp(Math.round(shape.Width * 16 + (filled.filter((a) => [
			"LW",
			"RW",
			"LM",
			"RM",
			"LB",
			"RB",
			"LWB",
			"RWB"
		].includes(a.slot.pos)).length >= 4 ? 8 : 0)), 1, 99)
	};
}
function problemsFor(assignment, players) {
	const issues = [];
	const filled = assignment.filter((a) => a.player);
	const fbs = filled.filter((a) => [
		"LB",
		"RB",
		"LWB",
		"RWB"
	].includes(a.slot.pos));
	if (fbs.length && fbs.every((a) => a.player.currentSix.pac < 72)) issues.push("Your squad lacks pace at full back — transitions the other way will hurt.");
	const mids = filled.filter((a) => a.slot.line === "MID");
	if (mids.length) {
		const avgPas = mids.reduce((s, a) => s + a.player.currentSix.pas, 0) / mids.length;
		const avgDef = mids.reduce((s, a) => s + a.player.currentSix.def, 0) / mids.length;
		if (avgPas >= 80 && avgDef < 68) issues.push("Your midfield has excellent passing but limited defensive strength.");
		if (avgPas >= 78) issues.push("You have several technically strong midfielders, making a possession-based formation more suitable.");
	}
	const cbs = filled.filter((a) => [
		"CB",
		"LCB",
		"RCB"
	].includes(a.slot.pos));
	if (cbs.length && cbs.every((a) => a.player.currentSix.pac < 68) && cbs.every((a) => a.player.currentSix.def >= 78)) issues.push("Your centre-backs are strong defensively but vulnerable against fast attackers.");
	const wingers = filled.filter((a) => [
		"LW",
		"RW",
		"LM",
		"RM"
	].includes(a.slot.pos));
	if (wingers.length >= 2 && wingers.every((a) => a.suitability >= 78)) issues.push("Wide players are a genuine strength — keep them high and supply early.");
	const uncovered = assignment.filter((a) => !a.player);
	if (uncovered.length) issues.push(`You are short ${uncovered.length} player${uncovered.length === 1 ? "" : "s"} for a complete XI in this shape.`);
	const offPos = filled.filter((a) => a.suitability < 55);
	if (offPos.length) issues.push(`${offPos.map((a) => a.player.name).join(", ")} ${offPos.length === 1 ? "is" : "are"} being asked to play well off-position.`);
	if (players.filter((p) => !filled.some((a) => a.player.id === p.id) && !isGoalkeeper(p.position)).length < 3) issues.push("Thin bench — rotation and injuries will quickly change the picture.");
	return [...new Set(issues)].slice(0, 5);
}
function applyOpponent(evaln, intel) {
	const s = intel.strengths.toLowerCase();
	const w = intel.weaknesses.toLowerCase();
	const extra = [];
	let fitAdj = 0;
	if (/fast wing|pacey wing|wingers/.test(s)) {
		extra.push("The opponent has fast wingers, so a deeper defensive line is safer than pushing both full-backs high.");
		if (evaln.formation.startsWith("3-") || evaln.formation.startsWith("2-")) fitAdj -= 6;
		if (evaln.formation.startsWith("5-") || evaln.formation.startsWith("4-")) fitAdj += 3;
	}
	if (/strong strik|target man|aerial/.test(s)) {
		extra.push("A physical striker up against you favours an extra centre-back or a compact midfield screen.");
		if (evaln.formation.startsWith("3-") || evaln.formation.startsWith("5-")) fitAdj += 4;
	}
	if (/high press|pressing/.test(s)) {
		extra.push("Against a high press, build with a back three or a double pivot so the first pass is never isolated.");
		if (evaln.formation.includes("2-3") || evaln.formation.startsWith("3-2")) fitAdj += 3;
	}
	if (/slow centre|slow cb|high line/.test(w)) {
		extra.push("Slow centre-backs in the other team reward a front three that runs in behind — 4-3-3 and 3-4-3 gain.");
		if ([
			"4-3-3",
			"3-4-3",
			"4-2-4"
		].includes(evaln.formation)) fitAdj += 5;
	}
	if (/weak mid|midfield/.test(w)) {
		extra.push("A weak opposing midfield is an invitation to overload the centre (4-2-3-1, 3-5-2, 4-3-1-2).");
		if ([
			"4-2-3-1",
			"3-5-2",
			"4-3-1-2",
			"4-1-4-1"
		].includes(evaln.formation)) fitAdj += 4;
	}
	if (/poor transition|counter/.test(w)) {
		extra.push("Poor defensive transitions at the other end reward aggressive full-backs and a high press.");
		if (["4-3-3", "3-4-3"].includes(evaln.formation)) fitAdj += 3;
	}
	return {
		...evaln,
		fit: clamp(evaln.fit + fitAdj, 1, 99),
		explanation: extra.length ? `${evaln.explanation} ${extra.join(" ")}` : evaln.explanation,
		problems: [...evaln.problems, ...extra].slice(0, 6)
	};
}
function explain(evaln, info) {
	const names = evaln.assignment.filter((a) => a.player).map((a) => a.player.name);
	const wingers = evaln.assignment.filter((a) => a.player && [
		"LW",
		"RW",
		"LM",
		"RM"
	].includes(a.slot.pos));
	const dm = evaln.assignment.find((a) => a.player && [
		"CDM",
		"LDM",
		"RDM"
	].includes(a.slot.pos));
	const cbs = evaln.assignment.filter((a) => a.player && [
		"CB",
		"LCB",
		"RCB"
	].includes(a.slot.pos));
	const bits = [];
	bits.push(`${evaln.formation} is recommended based on the player data you entered — it is an analytical suggestion, not a guarantee of match success.`);
	if (wingers.length >= 2 && wingers.every((a) => a.suitability >= 75)) bits.push(`Your squad has ${wingers.length} strong wide players (${wingers.map((a) => a.player.name).join(" and ")}).`);
	if (dm && dm.effective >= 80) bits.push(`${dm.player.name} is a high-rated defensive midfielder who can screen the back line.`);
	if (cbs.length && cbs.every((a) => (a.player?.currentSix.pas ?? 0) >= 74)) bits.push("Your centre-backs pass well enough to build from the back.");
	bits.push(info.bestFor);
	if (names.length) bits.push(`Best available XI uses ${names.slice(0, 3).join(", ")} as the spine.`);
	return bits.join(" ");
}
function evaluateFormation(size, formation, players, matches, intel) {
	const { assignment, formNotes } = assignBest(layoutFormation(formation, "own"), players, matches);
	const axes = axisScores(assignment, formation);
	const filled = assignment.filter((a) => a.player);
	const avgSuit = filled.length ? filled.reduce((s, a) => s + a.suitability, 0) / filled.length : 40;
	const avgEff = filled.length ? filled.reduce((s, a) => s + a.effective, 0) / filled.length : 50;
	const balance = 100 - Math.abs(axes.attack - axes.defence) * .4;
	const depth = clamp(players.length / (size + 4), 0, 1) * 8;
	const fit = clamp(Math.round(avgSuit * .35 + avgEff * .25 + (axes.attack + axes.defence + axes.possession) / 15 + balance * .15 + depth), 1, 99);
	const info = infoFor(size, formation);
	const problems = problemsFor(assignment, players);
	const base = {
		formation,
		size,
		fit,
		...axes,
		assignment,
		explanation: "",
		strengths: info.adv,
		weaknesses: info.dis,
		problems,
		formNotes: [...new Set(formNotes)].slice(0, 4)
	};
	base.explanation = explain(base, info);
	return intel && (intel.strengths || intel.weaknesses) ? applyOpponent(base, intel) : base;
}
function rankFormations(size, players, matches, intel) {
	return FORMAT_LIST[size].map((f) => evaluateFormation(size, f, players, matches, intel)).sort((a, b) => b.fit - a.fit);
}
function slotMapFromEval(evaln) {
	const map = {};
	for (const a of evaln.assignment) if (a.player) map[a.slot.id] = a.player.id;
	return map;
}
function pickNearest(list, targetX, fallback) {
	if (!list.length) return fallback;
	return list.reduce((a, b) => Math.abs(a.x - targetX) < Math.abs(b.x - targetX) ? a : b);
}
function pickWidest(list, fallback) {
	if (!list.length) return fallback;
	return list.reduce((a, b) => Math.abs(b.x - 50) > Math.abs(a.x - 50) ? b : a);
}
function buildAdvantageSequence(own, opp, info) {
	const base = cloneSlots(own);
	const gk = base.find((s) => s.id === "gk") ?? base[0];
	const def = base.filter((s) => s.line === "DEF");
	const midish = base.filter((s) => s.line === "MID");
	const fwd = base.filter((s) => s.line === "FWD");
	const nearCB = pickNearest(def, 38, gk);
	const centralMid = midish.length ? pickNearest(midish, 50, nearCB) : nearCB;
	const wideAttacker = pickWidest([...fwd, ...midish], centralMid);
	const side = wideAttacker.x < 50 ? -1 : 1;
	const flankDefs = def.filter((s) => Math.sign(s.x - 50) === side || def.length === 1);
	const fullback = flankDefs.length ? pickWidest(flankDefs, def[0] ?? gk) : null;
	const striker = fwd.length ? pickNearest(fwd, 50, centralMid) : centralMid;
	const phases = [];
	phases.push({
		own: cloneSlots(base),
		opp: cloneSlots(opp),
		ball: {
			x: gk.x,
			y: gk.y
		},
		note: "Kick-off shape — the goalkeeper starts the build-up from the back."
	});
	phases.push({
		own: cloneSlots(base),
		opp: cloneSlots(opp),
		ball: {
			x: nearCB.x,
			y: nearCB.y
		},
		note: "The ball is played to the nearest centre-back to begin the phase of play."
	});
	phases.push({
		own: cloneSlots(base),
		opp: cloneSlots(opp),
		ball: {
			x: centralMid.x,
			y: centralMid.y
		},
		note: "A central midfielder drops between the lines to receive on the half-turn."
	});
	const p3 = cloneSlots(base);
	if (fullback) {
		const fb = p3.find((s) => s.id === fullback.id);
		if (fb) fb.y -= 16;
	}
	phases.push({
		own: p3,
		opp: cloneSlots(opp),
		ball: {
			x: wideAttacker.x,
			y: wideAttacker.y
		},
		note: "Play is switched to the wide player, who holds the width and pins the opposing full-back."
	});
	const p4 = cloneSlots(p3);
	if (fullback) {
		const fb = p4.find((s) => s.id === fullback.id);
		if (fb) {
			fb.y -= 14;
			fb.x += side * 5;
		}
	}
	const wa4 = p4.find((s) => s.id === wideAttacker.id);
	if (wa4) {
		wa4.x -= side * 12;
		wa4.y -= 5;
	}
	const ballAt4 = fullback ? p4.find((s) => s.id === fullback.id) ?? wa4 : wa4;
	phases.push({
		own: p4,
		opp: cloneSlots(opp),
		ball: {
			x: ballAt4?.x ?? 50,
			y: ballAt4?.y ?? 40
		},
		note: "The full-back overlaps into the space the winger just vacated — a 2-v-1 out wide."
	});
	const p5 = cloneSlots(p4);
	const st5 = p5.find((s) => s.id === striker.id);
	if (st5) st5.y -= 3;
	phases.push({
		own: p5,
		opp: cloneSlots(opp),
		ball: {
			x: st5?.x ?? 50,
			y: st5?.y ?? 20
		},
		note: `ADVANTAGE — ${info.adv[0]}`
	});
	return phases;
}
function buildDisadvantageSequence(own, opp, info) {
	const base = cloneSlots(own);
	const def = base.filter((s) => s.line === "DEF");
	const wideDef = def.length ? pickWidest(def, base[0]) : base[0];
	const side = wideDef.x < 50 ? -1 : 1;
	const oppFwd = opp.filter((s) => s.line === "FWD");
	const runner = oppFwd.length ? pickWidest(oppFwd, opp[opp.length - 1] ?? opp[0]) : opp[opp.length - 1] ?? opp[0];
	const phases = [];
	const p0 = cloneSlots(base);
	const wd0 = p0.find((s) => s.id === wideDef.id);
	if (wd0) wd0.y -= 20;
	phases.push({
		own: p0,
		opp: cloneSlots(opp),
		ball: {
			x: wd0?.x ?? 50,
			y: (wd0?.y ?? 70) - 6
		},
		note: "Possession is lost high up the pitch — the advanced defender is caught out of position."
	});
	const opp1 = cloneSlots(opp);
	const r1 = opp1.find((s) => s.id === runner.id);
	if (r1) r1.y += 22;
	phases.push({
		own: cloneSlots(p0),
		opp: opp1,
		ball: {
			x: r1?.x ?? 50,
			y: r1?.y ?? 40
		},
		note: "The opponent immediately plays into the channel — their runner sprints into the vacated space."
	});
	const p2 = cloneSlots(p0);
	p2.filter((s) => s.line === "DEF" && s.id !== wideDef.id).forEach((c) => {
		c.x += side * 7;
	});
	const opp2 = cloneSlots(opp1);
	const r2 = opp2.find((s) => s.id === runner.id);
	if (r2) r2.y += 18;
	phases.push({
		own: p2,
		opp: opp2,
		ball: {
			x: r2?.x ?? 50,
			y: r2?.y ?? 50
		},
		note: "The back line has to shift across urgently — but the runner already has a head start."
	});
	const opp3 = cloneSlots(opp2);
	const r3 = opp3.find((s) => s.id === runner.id);
	if (r3) r3.y += 12;
	phases.push({
		own: cloneSlots(p2),
		opp: opp3,
		ball: {
			x: r3?.x ?? 50,
			y: r3?.y ?? 60
		},
		note: `DISADVANTAGE — ${info.dis[0]}`
	});
	return phases;
}
function buildPossessionMorph(own) {
	const base = cloneSlots(own);
	const def = base.filter((s) => s.line === "DEF");
	const maxAbs = Math.max(1, ...def.map((s) => Math.abs(s.x - 50)));
	return {
		base,
		inPoss: base.map((s) => {
			if (s.id === "gk") return { ...s };
			if (s.line === "DEF") {
				const wide = Math.abs(s.x - 50) > maxAbs * .5;
				return {
					...s,
					y: wide ? s.y - 24 : s.y - 4
				};
			}
			if (s.line === "FWD") return {
				...s,
				x: 50 + (s.x - 50) * 1.15,
				y: s.y - 2
			};
			return {
				...s,
				y: s.y - 5
			};
		}),
		outPoss: base.map((s) => {
			if (s.id === "gk") return { ...s };
			if (s.line === "DEF") return {
				...s,
				y: Math.min(90, s.y + 3)
			};
			if (s.line === "FWD") return {
				...s,
				y: s.y + 20,
				x: 50 + (s.x - 50) * .5
			};
			return {
				...s,
				y: s.y + 6,
				x: 50 + (s.x - 50) * .8
			};
		})
	};
}
function playersMap(players) {
	return Object.fromEntries(players.map((p) => [p.id, p]));
}
function BoardView({ players, onOpenPlayer, onPickForSlot }) {
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
	const baseOwn = (0, import_react.useMemo)(() => layoutFormation(formation, "own"), [formation]);
	const own = (0, import_react.useMemo)(() => baseOwn.map((s) => {
		const ov = slotOverrides[s.id];
		return ov ? {
			...s,
			x: ov.x,
			y: ov.y,
			pos: ov.pos
		} : s;
	}), [baseOwn, slotOverrides]);
	const byId = (0, import_react.useMemo)(() => playersMap(players), [players]);
	const info = infoFor(formatSize, formation);
	const hasCustomLayout = Object.keys(slotOverrides).length > 0;
	const [armedPlayerId, setArmedPlayerId] = (0, import_react.useState)(null);
	const benchDragRef = (0, import_react.useRef)(null);
	const benchPlayers = players.filter((p) => !Object.values(slotMap).includes(p.id));
	(0, import_react.useEffect)(() => {
		if (armedPlayerId && !benchPlayers.some((p) => p.id === armedPlayerId)) setArmedPlayerId(null);
	}, [armedPlayerId, benchPlayers]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[16px] border border-line bg-surface p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-lg tracking-wide",
						children: [
							formatSize,
							"-a-side · ",
							formation
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex overflow-hidden rounded-[10px] border border-line",
								children: [
									7,
									8,
									9,
									11
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFormat(s, FORMAT_LIST[s][0]),
									className: cn("px-2.5 py-1.5 text-xs font-semibold", formatSize === s ? "bg-accent text-accent-fg" : "text-muted"),
									children: s
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: formation,
								onChange: (e) => setFormat(formatSize, e.target.value),
								className: "h-8 rounded-[10px] border border-line bg-elevated px-2 text-xs",
								children: FORMAT_LIST[formatSize].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									const best = rankFormations(formatSize, players, matches)[0];
									if (!best) return;
									setFormat(best.size, best.formation);
									setSlotMap(slotMapFromEval(best));
								},
								children: "Build best XI"
							}),
							hasCustomLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "line",
								onClick: clearSlotOverrides,
								children: "Reset positions"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchSurface, {
					own,
					playersById: byId,
					slotMap,
					interactive: true,
					cardSize: "board",
					onSlotClick: (slot) => {
						if (armedPlayerId) {
							assignSlot(slot.id, armedPlayerId);
							setArmedPlayerId(null);
							return;
						}
						const pid = slotMap[slot.id];
						const p = pid ? byId[pid] : null;
						if (p) onOpenPlayer(p);
						else onPickForSlot(slot);
					},
					onDropOnSlot: (a, b) => swapSlots(a, b),
					onFreeMove: (slotId, x, y) => setSlotOverride(slotId, x, y)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: armedPlayerId ? "Now tap a slot on the pitch to place them there." : "Drag a card onto another to swap, or onto open grass to reposition. Tap a bench player below, then tap a slot to bring them on."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Strengths"
					}),
					info.adv.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-1 text-sm text-muted",
						children: ["· ", a]
					}, a)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Weaknesses"
					}),
					info.dis.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-1 text-sm text-muted",
						children: ["· ", a]
					}, a))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bench" }), armedPlayerId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setArmedPlayerId(null),
						className: "rounded-full border border-line px-2 py-0.5 text-[10px] normal-case text-muted",
						children: "Cancel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [benchPlayers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-subtle",
						children: "Every player is on the pitch."
					}), benchPlayers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { touchAction: "none" },
						className: cn("rounded-[10px]", armedPlayerId === p.id && "ring-2 ring-accent ring-offset-2 ring-offset-surface"),
						onPointerDown: (e) => {
							e.currentTarget.setPointerCapture(e.pointerId);
							benchDragRef.current = {
								id: p.id,
								moved: false
							};
						},
						onPointerMove: (e) => {
							const d = benchDragRef.current;
							if (!d || d.id !== p.id) return;
							d.moved = true;
						},
						onPointerUp: (e) => {
							const d = benchDragRef.current;
							benchDragRef.current = null;
							if (!d || d.id !== p.id) return;
							if (!d.moved) {
								setArmedPlayerId((cur) => cur === p.id ? null : p.id);
								return;
							}
							const slotEl = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-slot-id]");
							if (slotEl?.dataset.slotId) {
								assignSlot(slotEl.dataset.slotId, p.id);
								setArmedPlayerId(null);
							}
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							player: p,
							size: "tiny"
						})
					}, p.id))]
				})]
			})]
		})]
	});
}
function SimulateView({ players, onOpenPlayer }) {
	const formation = usePitchStore((s) => s.formation);
	const formatSize = usePitchStore((s) => s.formatSize);
	const slotMap = usePitchStore((s) => s.slotMap);
	const setFormat = usePitchStore((s) => s.setFormat);
	const own = (0, import_react.useMemo)(() => layoutFormation(formation, "own"), [formation]);
	const opp = (0, import_react.useMemo)(() => layoutFormation(OPPONENT_DEFAULT[formatSize], "opp"), [formatSize]);
	const info = (0, import_react.useMemo)(() => infoFor(formatSize, formation), [formatSize, formation]);
	const ratings = (0, import_react.useMemo)(() => ratingsFor(formation), [formation]);
	const adv = (0, import_react.useMemo)(() => buildAdvantageSequence(own, opp, info), [
		own,
		opp,
		info
	]);
	const dis = (0, import_react.useMemo)(() => buildDisadvantageSequence(own, opp, info), [
		own,
		opp,
		info
	]);
	const [seq, setSeq] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [speed, setSpeed] = (0, import_react.useState)(1);
	const [lanes, setLanes] = (0, import_react.useState)(true);
	const [why, setWhy] = (0, import_react.useState)(false);
	const active = seq === "advantage" ? adv : seq === "disadvantage" ? dis : null;
	const current = active ? active[phase] : {
		own,
		opp,
		ball: {
			x: 50,
			y: 92
		},
		note: `Base ${formation} shape. Run Advantage or Disadvantage.`
	};
	(0, import_react.useEffect)(() => {
		if (!playing || !active) return;
		if (phase >= active.length - 1) {
			setPlaying(false);
			return;
		}
		const t = setTimeout(() => setPhase((i) => Math.min(i + 1, active.length - 1)), 1500 / speed);
		return () => clearTimeout(t);
	}, [
		playing,
		phase,
		active,
		speed
	]);
	const byId = (0, import_react.useMemo)(() => playersMap(players), [players]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[16px] border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-lg",
							children: [
								formatSize,
								"-a-side · ",
								formation
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: formation,
								onChange: (e) => {
									setFormat(formatSize, e.target.value);
									setSeq(null);
									setPhase(0);
									setPlaying(false);
								},
								className: "h-8 rounded-[10px] border border-line bg-elevated px-2 text-xs",
								children: FORMAT_LIST[formatSize].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setLanes((v) => !v),
								className: "flex items-center gap-1 rounded-[8px] border border-line px-2 text-xs text-muted",
								children: [lanes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" }), " lanes"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchSurface, {
						own: current.own,
						opp: current.opp,
						ball: current.ball,
						playersById: byId,
						slotMap,
						showLanes: lanes,
						cardSize: "tiny",
						onSlotClick: (s) => {
							const p = slotMap[s.id] ? byId[slotMap[s.id]] : null;
							if (p) onOpenPlayer(p);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "line",
								disabled: !active,
								onClick: () => {
									setPlaying(false);
									setPhase((i) => Math.max(0, i - 1));
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: !active,
								onClick: () => setPlaying((p) => !p),
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "line",
								disabled: !active,
								onClick: () => {
									setPlaying(false);
									setPhase((i) => Math.min((active?.length ?? 1) - 1, i + 1));
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: !active,
								onClick: () => {
									setPhase(0);
									setPlaying(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" })
							}),
							[
								.5,
								1,
								2
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSpeed(s),
								className: cn("rounded-[8px] px-2 py-1 text-xs font-bold", speed === s ? "bg-accent text-accent-fg" : "text-muted"),
								children: [s, "×"]
							}, s))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: seq === "advantage" ? "primary" : "line",
								onClick: () => {
									setSeq("advantage");
									setPhase(0);
									setPlaying(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" }), " Advantage"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: seq === "disadvantage" ? "primary" : "line",
								onClick: () => {
									setSeq("disadvantage");
									setPhase(0);
									setPlaying(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }), " Disadvantage"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: why ? "soft" : "ghost",
								onClick: () => setWhy((v) => !v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" }), " Why did they move?"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-[12px] bg-elevated p-3 text-sm leading-relaxed text-muted",
						children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 text-[10px] uppercase tracking-wide text-subtle",
							children: [
								"Phase ",
								phase + 1,
								" / ",
								active.length
							]
						}), why ? current.note : active ? current.note : `Select Advantage or Disadvantage to watch the ${formation} operate.`]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 font-display text-lg",
					children: ["Tactical dashboard — ", formation]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: Object.entries(ratings).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-muted",
						children: [
							k,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-accent",
								children: [v, "/5"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent",
							style: { width: `${v * 20}%` }
						})
					})] }, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 font-display text-lg",
					children: [formatSize, "-a-side emphasis"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: FORMAT_EMPHASIS[formatSize].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] text-accent",
						children: t
					}, t))
				})]
			})
		]
	});
}
function PossessionView({ players }) {
	const formation = usePitchStore((s) => s.formation);
	const formatSize = usePitchStore((s) => s.formatSize);
	const slotMap = usePitchStore((s) => s.slotMap);
	const own = (0, import_react.useMemo)(() => layoutFormation(formation, "own"), [formation]);
	const opp = (0, import_react.useMemo)(() => layoutFormation(OPPONENT_DEFAULT[formatSize], "opp"), [formatSize]);
	const morph = (0, import_react.useMemo)(() => buildPossessionMorph(own), [own]);
	const [shape, setShape] = (0, import_react.useState)("base");
	const current = shape === "base" ? morph.base : shape === "in" ? morph.inPoss : morph.outPoss;
	const byId = (0, import_react.useMemo)(() => playersMap(players), [players]);
	const isFlagship = formatSize === 11 && formation === "4-3-3";
	const shapes = [
		{
			id: "out",
			label: isFlagship ? "Out of possession (4-1-4-1)" : "Out of possession",
			desc: "The team compresses into a deeper, narrower block. Forwards drop into midfield lines to deny central passing lanes and force play wide."
		},
		{
			id: "base",
			label: `Base shape (${formation})`,
			desc: "The reference formation the team lines up in before the ball dictates any adjustment."
		},
		{
			id: "in",
			label: isFlagship ? "In possession (3-2-4-1)" : "In possession",
			desc: "Wide defenders push high to become auxiliary wingers, one central defender or pivot drops to form a back three for build-up, and the front line stretches the opposition."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 font-display text-lg",
				children: "In possession vs out of possession"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-muted",
				children: [
					"Modern teams rarely hold one static shape. Watch how the ",
					formation,
					" reshapes depending on who has the ball."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchSurface, {
				own: current,
				opp,
				ball: {
					x: 50,
					y: shape === "in" ? 55 : shape === "out" ? 88 : 92
				},
				playersById: byId,
				slotMap,
				cardSize: "tiny"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: shapes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: shape === s.id ? "primary" : "line",
					onClick: () => setShape(s.id),
					children: s.label
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 rounded-[12px] bg-elevated p-3 text-sm text-muted",
				children: shapes.find((s) => s.id === shape)?.desc
			})
		]
	});
}
function CompareView() {
	const formatSize = usePitchStore((s) => s.formatSize);
	const compareA = usePitchStore((s) => s.compareA);
	const compareB = usePitchStore((s) => s.compareB);
	const setCompare = usePitchStore((s) => s.setCompare);
	const a = FORMAT_LIST[formatSize].includes(compareA) ? compareA : FORMAT_LIST[formatSize][0];
	const b = FORMAT_LIST[formatSize].includes(compareB) ? compareB : FORMAT_LIST[formatSize][1] ?? FORMAT_LIST[formatSize][0];
	const ownA = (0, import_react.useMemo)(() => layoutFormation(a, "own"), [a]);
	const ownB = (0, import_react.useMemo)(() => layoutFormation(b, "own"), [b]);
	const ratingsA = ratingsFor(a);
	const ratingsB = ratingsFor(b);
	const infoA = infoFor(formatSize, a);
	const infoB = infoFor(formatSize, b);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] border border-line bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 font-display text-lg",
				children: [
					a,
					" vs ",
					b
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: a,
					onChange: (e) => setCompare(e.target.value, b),
					className: "mb-2 h-9 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: FORMAT_LIST[formatSize].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchSurface, {
					own: ownA,
					playersById: {},
					slotMap: {},
					cardSize: "tiny"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: b,
					onChange: (e) => setCompare(a, e.target.value),
					className: "mb-2 h-9 w-full rounded-[10px] border border-line bg-elevated px-2 text-sm",
					children: FORMAT_LIST[formatSize].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: f }, f))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PitchSurface, {
					own: ownB,
					playersById: {},
					slotMap: {},
					cardSize: "tiny"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: Object.keys(ratingsA).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-xs text-muted",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto h-full bg-accent",
							style: { width: `${ratingsA[k] * 20}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-pitch",
							style: { width: `${ratingsB[k] * 20}%` }
						})
					})]
				})] }, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase text-muted",
					children: [a, " weakness"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: ["· ", infoA.dis[0]]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs uppercase text-muted",
					children: [b, " weakness"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: ["· ", infoB.dis[0]]
				})] })]
			})
		]
	});
}
function AdvisorView({ players, onOpenPlayer, onUsed }) {
	const matches = usePitchStore((s) => s.matches);
	const formatSize = usePitchStore((s) => s.formatSize);
	const setFormat = usePitchStore((s) => s.setFormat);
	const setSlotMap = usePitchStore((s) => s.setSlotMap);
	const setMode = usePitchStore((s) => s.setMode);
	const setTactiqTab = usePitchStore((s) => s.setTactiqTab);
	const intel = usePitchStore((s) => s.opponentIntel);
	const setIntel = usePitchStore((s) => s.setIntel);
	const [open, setOpen] = (0, import_react.useState)(null);
	const ranked = (0, import_react.useMemo)(() => rankFormations(formatSize, players, matches, intel), [
		formatSize,
		players,
		matches,
		intel
	]);
	const best = ranked[0];
	function apply(ev) {
		setFormat(ev.size, ev.formation);
		setSlotMap(slotMapFromEval(ev));
		setMode("tactiq");
		setTactiqTab("board");
		onUsed();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[16px] border border-accent/40 bg-accent/5 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs uppercase tracking-wide text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Tactical Lab"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Analyst workstation grounded in the player cards and match data you entered. Missing data is stated explicitly — nothing is invented."
					}),
					best && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 font-display text-3xl tracking-wide",
							children: [
								best.formation,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-accent",
									children: [best.fit, "/100"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: best.explanation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => apply(best),
								children: "Apply to board"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "line",
								onClick: () => setOpen(best.formation),
								children: "Why this score"
							})]
						})
					] }),
					players.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-[12px] border border-dashed border-line p-4 text-sm text-muted",
						children: "No saved player cards yet. Create cards in My Cards so Tactical Lab can score formations, CB selection and role fit from real attributes."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-display text-lg",
					children: "Opponent notes (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Strengths", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: intel.strengths,
							onChange: (e) => setIntel({
								...intel,
								strengths: e.target.value
							}),
							placeholder: "Fast wingers, strong striker, high pressing",
							className: "mt-1 h-20 w-full rounded-[10px] border border-line bg-elevated p-2 text-sm text-fg"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: ["Weaknesses", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: intel.weaknesses,
							onChange: (e) => setIntel({
								...intel,
								weaknesses: e.target.value
							}),
							placeholder: "Slow centre-backs, weak midfield, poor transitions",
							className: "mt-1 h-20 w-full rounded-[10px] border border-line bg-elevated p-2 text-sm text-fg"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Ask the lab"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-subtle",
						children: "Answers use saved cards, formation scores and opponent notes. Missing data is stated, never invented."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"Which CB should start?",
							"Why concede from the wings?",
							"How should we press?",
							"What is weak in this shape?",
							"How to build from the back?",
							"How to create more chances?"
						].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-line bg-elevated px-3 py-1.5 text-[11px] font-medium text-muted",
							children: q
						}, q))
					}),
					players.length > 0 && best ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-fg",
							children: "CB selection — "
						}), "ranked from DEF, PHY, PAS and effective rating among your centre-backs. Open a card to inspect the numbers."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-fg",
								children: "Wings / press / chances — "
							}),
							"use opponent notes plus the formation table. Fit ",
							best.fit,
							"/100 is the current evidence for ",
							best.formation,
							"."
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Create player cards first — the lab will not fabricate a squad."
					})
				]
			}),
			best && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 font-display text-lg",
						children: ["Recommended XI — ", best.formation]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: best.assignment.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-[10px] bg-elevated px-2 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-10 font-display text-sm text-accent",
								children: a.slot.pos
							}), a.player ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex flex-1 items-center gap-2 text-left",
								onClick: () => onOpenPlayer(a.player),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
										player: a.player,
										matches,
										size: "tiny"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-semibold",
											children: a.player.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-[11px] text-muted",
											children: a.reason
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ml-auto text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display tabular-nums",
											children: a.effective
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-subtle",
											children: [a.suitability, "% fit"]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-subtle",
								children: "No player"
							})]
						}, a.slot.id))
					}),
					best.formNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-1 text-xs text-muted",
						children: best.formNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["· ", n] }, n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-display text-lg",
					children: "Tactical problems"
				}), players.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Evidence requires saved cards. No players have been created yet, so formation weaknesses cannot be scored."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm text-muted",
					children: (best?.problems ?? ["No tactical problems flagged from current squad data."]).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", p] }, p))
				})]
			}),
			best && players.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-[14px] border border-line bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-line bg-elevated/40 px-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-wide text-accent",
						children: "Tactical problem"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg",
						children: "Best available shape for this squad"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-line p-4 sm:border-r sm:border-b-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wide text-muted",
								children: "Why it is happening"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: best.explanation
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-line p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wide text-muted",
								children: "Evidence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1 space-y-1 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Fit ",
										best.fit,
										"/100 from position suitability, form and effective rating."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Assigned ",
										best.assignment.filter((a) => a.player).length,
										" of ",
										best.assignment.length,
										" slots from saved cards."
									] }),
									intel.strengths ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Opponent strengths: ", intel.strengths] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No opponent strengths logged." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-line p-4 sm:border-r sm:border-b-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wide text-muted",
								children: "Recommended change"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [
									"Apply ",
									best.formation,
									" to the tactical board and refine slots if a specialist is missing."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold uppercase tracking-wide text-muted",
									children: "Expected effect"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "The XI reflects role fit, not raw OVR. Form shifts effective rating; base cards stay unchanged."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-3",
									size: "sm",
									onClick: () => apply(best),
									children: "Apply to board"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-[14px] border border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[520px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-elevated text-xs uppercase tracking-wide text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Formation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Fit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Attack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Defence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Possession"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ranked.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: cn("border-t border-line cursor-pointer hover:bg-elevated/60", open === r.formation && "bg-accent/5"),
						onClick: () => setOpen(open === r.formation ? null : r.formation),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-semibold",
								children: r.formation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums text-accent",
								children: r.fit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.attack
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.defence
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.possession
							})
						]
					}, r.formation)) })]
				})
			}),
			open && ranked.find((r) => r.formation === open) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[14px] border border-line bg-surface p-3",
				children: (() => {
					const r = ranked.find((x) => x.formation === open);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 font-display text-lg",
							children: [
								r.formation,
								" — ",
								r.fit,
								"/100"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm text-muted",
							children: r.explanation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase text-muted",
								children: "Strengths"
							}), r.strengths.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["· ", s]
							}, s))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase text-muted",
								children: "Weaknesses"
							}), r.weaknesses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["· ", s]
							}, s))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							onClick: () => apply(r),
							children: "Apply to board"
						})
					] });
				})()
			}),
			formatSize !== 11 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [
					"Advisor is scoring every ",
					formatSize,
					"-a-side shape in the library."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeNote, { size: formatSize })
		]
	});
}
function SizeNote({ size }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-xs text-subtle",
		children: [
			"Switch format size in TACTIQ to rescore ",
			size === 11 ? "7/8/9" : "other",
			"-a-side libraries."
		]
	});
}
function SlotPicker({ slot, players, onClose }) {
	const assignSlot = usePitchStore((s) => s.assignSlot);
	const slotMap = usePitchStore((s) => s.slotMap);
	const matches = usePitchStore((s) => s.matches);
	const used = new Set(Object.values(slotMap));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 font-display text-xl",
				children: ["Place a ", slot.pos]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto hq-scroll sm:grid-cols-3",
				children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex flex-col items-center",
					onClick: () => {
						assignSlot(slot.id, p.id);
						onClose();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
						player: p,
						matches,
						size: "mini",
						dimmed: used.has(p.id) && slotMap[slot.id] !== p.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 text-[11px] text-muted",
						children: p.position
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-3",
				onClick: onClose,
				children: "Cancel"
			})
		]
	});
}
var genericOAuthClient = () => {
	return {
		id: "generic-oauth-client",
		version: PACKAGE_VERSION,
		$InferServerPlugin: {},
		$ERROR_CODES: GENERIC_OAUTH_ERROR_CODES
	};
};
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
/**
* Deep structural equality for JSON-serializable values.
* Handles: primitives, null, arrays, and plain objects.
* Short-circuits on referential equality at every recursion level.
*/
function isJsonEqual(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) if (!isJsonEqual(a[i], b[i])) return false;
		return true;
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		for (const key of keysA) if (!(key in b) || !isJsonEqual(a[key], b[key])) return false;
		return true;
	}
	return false;
}
/**
* Attach an equality gate to a nanostores atom via `onSet`.
* When `isEqual(currentValue, newValue)` returns true, the `set()` call
* is aborted: no listeners fire, no framework re-renders occur.
*
* Returns the unsubscribe function from `onSet`.
*/
function withEquality(store, isEqual) {
	return onSet(store, ({ newValue, abort }) => {
		if (isEqual(store.value, newValue)) abort();
	});
}
var redirectPlugin = {
	id: "redirect",
	name: "Redirect",
	hooks: { onSuccess(context) {
		if (context.data?.url && context.data?.redirect && isSafeUrlScheme(context.data.url)) {
			if (typeof window !== "undefined" && window.location) {
				if (window.location) try {
					window.location.href = context.data.url;
				} catch {}
			}
		}
	} }
};
var kBroadcastChannel = Symbol.for("better-auth:broadcast-channel");
var now$1 = () => Math.floor(Date.now() / 1e3);
var WindowBroadcastChannel = class {
	listeners = /* @__PURE__ */ new Set();
	name;
	constructor(name = "better-auth.message") {
		this.name = name;
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	post(message) {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(this.name, JSON.stringify({
				...message,
				timestamp: now$1()
			}));
		} catch {}
	}
	setup() {
		if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const handler = (event) => {
			if (event.key !== this.name) return;
			const message = JSON.parse(event.newValue ?? "{}");
			if (message?.event !== "session" || !message?.data) return;
			this.listeners.forEach((listener) => listener(message));
		};
		window.addEventListener("storage", handler);
		return () => {
			window.removeEventListener("storage", handler);
		};
	}
};
function getGlobalBroadcastChannel(name = "better-auth.message") {
	if (!globalThis[kBroadcastChannel]) globalThis[kBroadcastChannel] = new WindowBroadcastChannel(name);
	return globalThis[kBroadcastChannel];
}
var kFocusManager = Symbol.for("better-auth:focus-manager");
var WindowFocusManager = class {
	listeners = /* @__PURE__ */ new Set();
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	setFocused(focused) {
		this.listeners.forEach((listener) => listener(focused));
	}
	setup() {
		if (typeof window === "undefined" || typeof document === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const visibilityHandler = () => {
			if (document.visibilityState === "visible") this.setFocused(true);
		};
		document.addEventListener("visibilitychange", visibilityHandler, false);
		return () => {
			document.removeEventListener("visibilitychange", visibilityHandler, false);
		};
	}
};
function getGlobalFocusManager() {
	if (!globalThis[kFocusManager]) globalThis[kFocusManager] = new WindowFocusManager();
	return globalThis[kFocusManager];
}
var kOnlineManager = Symbol.for("better-auth:online-manager");
var WindowOnlineManager = class {
	listeners = /* @__PURE__ */ new Set();
	isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
	subscribe(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	setOnline(online) {
		this.isOnline = online;
		this.listeners.forEach((listener) => listener(online));
	}
	setup() {
		if (typeof window === "undefined" || typeof window.addEventListener === "undefined") return () => {};
		const onOnline = () => this.setOnline(true);
		const onOffline = () => this.setOnline(false);
		window.addEventListener("online", onOnline, false);
		window.addEventListener("offline", onOffline, false);
		return () => {
			window.removeEventListener("online", onOnline, false);
			window.removeEventListener("offline", onOffline, false);
		};
	}
};
function getGlobalOnlineManager() {
	if (!globalThis[kOnlineManager]) globalThis[kOnlineManager] = new WindowOnlineManager();
	return globalThis[kOnlineManager];
}
var now = () => Math.floor(Date.now() / 1e3);
/**
* Rate limit: don't refetch on focus if a session request was made within this many seconds
*/
var FOCUS_REFETCH_RATE_LIMIT_SECONDS = 5;
function createSessionRefreshManager(opts) {
	const { fetchSession, shouldPollSession = () => true, sessionSignal, options = {} } = opts;
	const refetchInterval = options.sessionOptions?.refetchInterval ?? 0;
	const refetchOnWindowFocus = options.sessionOptions?.refetchOnWindowFocus ?? true;
	const refetchWhenOffline = options.sessionOptions?.refetchWhenOffline ?? false;
	const state = {
		isInitialized: false,
		lastSessionRequest: 0
	};
	const shouldRefetch = () => {
		return refetchWhenOffline || getGlobalOnlineManager().isOnline;
	};
	const triggerRefetch = (event) => {
		if (!shouldRefetch()) return;
		if (event?.event === "storage") {
			fetchSession();
			return;
		}
		if (event?.event === "poll") {
			state.lastSessionRequest = now();
			fetchSession();
			return;
		}
		if (event?.event === "visibilitychange") {
			if (now() - state.lastSessionRequest < FOCUS_REFETCH_RATE_LIMIT_SECONDS) return;
			state.lastSessionRequest = now();
			fetchSession();
			return;
		}
		fetchSession();
	};
	const broadcastSessionUpdate = (trigger) => {
		getGlobalBroadcastChannel().post({
			event: "session",
			data: { trigger },
			clientId: Math.random().toString(36).substring(7)
		});
	};
	const setupPolling = () => {
		if (refetchInterval && refetchInterval > 0) state.pollInterval = setInterval(() => {
			if (shouldPollSession()) triggerRefetch({ event: "poll" });
		}, refetchInterval * 1e3);
	};
	const setupBroadcast = () => {
		state.unsubscribeBroadcast = getGlobalBroadcastChannel().subscribe(() => {
			triggerRefetch({ event: "storage" });
		});
	};
	const setupFocusRefetch = () => {
		if (!refetchOnWindowFocus) return;
		state.unsubscribeFocus = getGlobalFocusManager().subscribe(() => {
			triggerRefetch({ event: "visibilitychange" });
		});
	};
	const setupOnlineRefetch = () => {
		state.unsubscribeOnline = getGlobalOnlineManager().subscribe((online) => {
			if (online) triggerRefetch({ event: "visibilitychange" });
		});
	};
	const setupSignalSubscription = () => {
		state.unsubscribeSignal = sessionSignal.listen(() => {
			fetchSession();
		});
	};
	const init = () => {
		if (state.isInitialized) return;
		state.isInitialized = true;
		setupPolling();
		setupBroadcast();
		setupFocusRefetch();
		setupOnlineRefetch();
		setupSignalSubscription();
		state.cleanupBroadcastSetup = getGlobalBroadcastChannel().setup();
		state.cleanupFocusSetup = getGlobalFocusManager().setup();
		state.cleanupOnlineSetup = getGlobalOnlineManager().setup();
	};
	const cleanup = () => {
		if (!state.isInitialized) return;
		if (state.pollInterval) {
			clearInterval(state.pollInterval);
			state.pollInterval = void 0;
		}
		if (state.unsubscribeBroadcast) {
			state.unsubscribeBroadcast();
			state.unsubscribeBroadcast = void 0;
		}
		if (state.unsubscribeFocus) {
			state.unsubscribeFocus();
			state.unsubscribeFocus = void 0;
		}
		if (state.unsubscribeOnline) {
			state.unsubscribeOnline();
			state.unsubscribeOnline = void 0;
		}
		if (state.unsubscribeSignal) {
			state.unsubscribeSignal();
			state.unsubscribeSignal = void 0;
		}
		if (state.cleanupBroadcastSetup) {
			state.cleanupBroadcastSetup();
			state.cleanupBroadcastSetup = void 0;
		}
		if (state.cleanupFocusSetup) {
			state.cleanupFocusSetup();
			state.cleanupFocusSetup = void 0;
		}
		if (state.cleanupOnlineSetup) {
			state.cleanupOnlineSetup();
			state.cleanupOnlineSetup = void 0;
		}
		state.isInitialized = false;
		state.lastSessionRequest = 0;
	};
	return {
		init,
		cleanup,
		triggerRefetch,
		broadcastSessionUpdate
	};
}
var isServer = () => typeof window === "undefined";
var SESSION_MOUNT_DEDUPE_INTERVAL = STORE_UNMOUNT_DELAY;
/**
* Normalize $fetch response: `throw: true` returns data directly,
* otherwise `{ data, error }`.
*/
function normalizeSessionResponse(res) {
	if (typeof res === "object" && res !== null && "data" in res && "error" in res) return res;
	return {
		data: res,
		error: null
	};
}
function normalizeSessionData(data) {
	if (!data) return null;
	if (data.session === null && data.user === null) return null;
	return data;
}
function isSessionAtomEqual(a, b) {
	return isJsonEqual(a.data, b.data) && a.error === b.error && a.isPending === b.isPending && a.isRefetching === b.isRefetching && a.refetch === b.refetch;
}
function getSessionAtom($fetch, options) {
	const $signal = /* @__PURE__ */ atom(false);
	let flight;
	let freshUntil = 0;
	let sessionRevision = 0;
	$signal.listen(() => {
		sessionRevision++;
		freshUntil = 0;
	});
	const refetch = (queryParams) => fetchSession(queryParams);
	const session = /* @__PURE__ */ atom({
		data: null,
		error: null,
		isPending: true,
		isRefetching: false,
		refetch
	});
	withEquality(session, isSessionAtomEqual);
	const executeSessionFetch = async (signal, queryParams) => {
		const current = session.value;
		session.set({
			...current,
			isPending: current.data === null,
			isRefetching: true,
			error: null,
			refetch
		});
		if (signal.aborted) return "aborted";
		try {
			const res = await $fetch("/get-session", {
				method: "GET",
				query: queryParams?.query,
				signal
			});
			if (signal.aborted) return "aborted";
			let { data, error } = normalizeSessionResponse(res);
			let outcome = "fresh";
			if (data?.needsRefresh) try {
				const refreshRes = await $fetch("/get-session", {
					method: "POST",
					signal
				});
				if (signal.aborted) return "aborted";
				({data, error} = normalizeSessionResponse(refreshRes));
			} catch {
				if (signal.aborted) return "aborted";
				outcome = "stale";
			}
			if (error) {
				const latest = session.value;
				const isUnauthorized = error?.status === 401;
				session.set({
					data: isUnauthorized ? null : latest.data,
					error,
					isPending: false,
					isRefetching: false,
					refetch
				});
				return "failed";
			}
			const sessionData = normalizeSessionData(data);
			const current = session.value;
			const stableData = current.data != null && sessionData != null && isJsonEqual(current.data, sessionData) ? current.data : sessionData;
			session.set({
				data: stableData,
				error: null,
				isPending: false,
				isRefetching: false,
				refetch
			});
			return outcome;
		} catch (fetchError) {
			if (signal.aborted) return "aborted";
			const latest = session.value;
			session.set({
				data: latest.data,
				error: fetchError,
				isPending: false,
				isRefetching: false,
				refetch
			});
			return "failed";
		}
	};
	const getFreshUntil = () => {
		const expiresAt = session.value.data?.session?.expiresAt;
		const sessionExpiresAt = expiresAt instanceof Date ? expiresAt.getTime() : Number.POSITIVE_INFINITY;
		return Math.min(Date.now() + SESSION_MOUNT_DEDUPE_INTERVAL, sessionExpiresAt);
	};
	const fetchSession = (queryParams) => {
		freshUntil = 0;
		flight?.cancel();
		const controller = new AbortController();
		const request = {
			cancel: () => controller.abort(),
			promise: Promise.resolve().then(() => {
				if (controller.signal.aborted) return "aborted";
				return executeSessionFetch(controller.signal, queryParams);
			}),
			revision: sessionRevision
		};
		flight = request;
		const settleFlight = (outcome) => {
			if (flight !== request) return;
			flight = void 0;
			if (outcome === "fresh" && request.revision === sessionRevision) freshUntil = getFreshUntil();
		};
		request.promise.then(settleFlight, () => settleFlight("failed"));
		return request.promise.then(() => void 0);
	};
	const fetchSessionOnMount = () => {
		if (flight?.revision === sessionRevision) return flight.promise.then(() => void 0);
		if (Date.now() < freshUntil) return Promise.resolve();
		return fetchSession();
	};
	let broadcastSessionUpdate = () => {};
	onMount(session, () => {
		let timeoutId;
		if (!isServer()) timeoutId = setTimeout(() => {
			fetchSessionOnMount();
		}, 0);
		const refreshManager = createSessionRefreshManager({
			fetchSession,
			shouldPollSession: () => session.value.data != null,
			sessionSignal: $signal,
			options
		});
		refreshManager.init();
		broadcastSessionUpdate = refreshManager.broadcastSessionUpdate;
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			refreshManager.cleanup();
		};
	});
	return {
		session,
		$sessionSignal: $signal,
		broadcastSessionUpdate: (trigger) => broadcastSessionUpdate(trigger)
	};
}
var resolvePublicAuthUrl = (basePath) => {
	if (typeof process === "undefined") return void 0;
	const path = basePath ?? "/api/auth";
	if (process.env.NEXT_PUBLIC_AUTH_URL) return process.env.NEXT_PUBLIC_AUTH_URL;
	if (typeof window === "undefined") {
		if (process.env.NEXTAUTH_URL) try {
			return process.env.NEXTAUTH_URL;
		} catch {}
		if (process.env.VERCEL_URL) try {
			const protocol = process.env.VERCEL_URL.startsWith("http") ? "" : "https://";
			return `${new URL(`${protocol}${process.env.VERCEL_URL}`).origin}${path}`;
		} catch {}
	}
};
var getClientConfig = (options, loadEnv) => {
	const isCredentialsSupported = "credentials" in Request.prototype;
	const baseURL = getBaseURL(options?.baseURL, options?.basePath, void 0, loadEnv) ?? resolvePublicAuthUrl(options?.basePath) ?? "/api/auth";
	const pluginsFetchPlugins = options?.plugins?.flatMap((plugin) => plugin.fetchPlugins).filter((pl) => pl !== void 0) || [];
	const lifeCyclePlugin = {
		id: "lifecycle-hooks",
		name: "lifecycle-hooks",
		hooks: {
			onSuccess: options?.fetchOptions?.onSuccess,
			onError: options?.fetchOptions?.onError,
			onRequest: options?.fetchOptions?.onRequest,
			onResponse: options?.fetchOptions?.onResponse
		}
	};
	const { onSuccess: _onSuccess, onError: _onError, onRequest: _onRequest, onResponse: _onResponse, ...restOfFetchOptions } = options?.fetchOptions || {};
	const $fetch = createFetch({
		baseURL,
		...isCredentialsSupported ? { credentials: "include" } : {},
		method: "GET",
		jsonParser(text) {
			if (!text) return null;
			return parseJSON(text, { strict: false });
		},
		customFetchImpl: fetch,
		...restOfFetchOptions,
		plugins: [
			lifeCyclePlugin,
			...restOfFetchOptions.plugins || [],
			...options?.disableDefaultFetchPlugins ? [] : [redirectPlugin],
			...pluginsFetchPlugins
		]
	});
	const { $sessionSignal, session, broadcastSessionUpdate } = getSessionAtom($fetch, options);
	const plugins = options?.plugins || [];
	let pluginsActions = {};
	const pluginsAtoms = {
		$sessionSignal,
		session
	};
	const pluginPathMethods = {
		"/sign-out": "POST",
		"/revoke-sessions": "POST",
		"/revoke-other-sessions": "POST",
		"/delete-user": "POST"
	};
	const atomListeners = [{
		signal: "$sessionSignal",
		matcher(path) {
			return path === "/sign-out" || path === "/update-user" || path === "/update-session" || path === "/sign-up/email" || path === "/sign-in/email" || path === "/delete-user" || path === "/verify-email" || path === "/revoke-sessions" || path === "/revoke-session" || path === "/revoke-other-sessions" || path === "/change-email" || path === "/change-password";
		},
		callback(path) {
			if (path === "/sign-out") broadcastSessionUpdate("signout");
			else if (path === "/update-user" || path === "/update-session") broadcastSessionUpdate("updateUser");
		}
	}];
	for (const plugin of plugins) {
		if (plugin.getAtoms) Object.assign(pluginsAtoms, plugin.getAtoms?.($fetch));
		if (plugin.pathMethods) Object.assign(pluginPathMethods, plugin.pathMethods);
		if (plugin.atomListeners) atomListeners.push(...plugin.atomListeners);
	}
	const $store = {
		notify: (signal) => {
			pluginsAtoms[signal].set(!pluginsAtoms[signal].get());
		},
		listen: (signal, listener) => {
			pluginsAtoms[signal].subscribe(listener);
		},
		atoms: pluginsAtoms
	};
	for (const plugin of plugins) if (plugin.getActions) pluginsActions = defu(plugin.getActions?.($fetch, $store, options) ?? {}, pluginsActions);
	return {
		get baseURL() {
			return baseURL;
		},
		pluginsActions,
		pluginsAtoms,
		pluginPathMethods,
		atomListeners,
		$fetch,
		$store
	};
};
function isAtom(value) {
	return typeof value === "object" && value !== null && "get" in value && typeof value.get === "function" && "lc" in value && typeof value.lc === "number";
}
function getMethod(path, knownPathMethods, args) {
	const method = knownPathMethods[path];
	const { fetchOptions, query: _query, ...body } = args || {};
	if (method) return method;
	if (fetchOptions?.method) return fetchOptions.method;
	if (body && Object.keys(body).length > 0) return "POST";
	return "GET";
}
function createDynamicPathProxy(routes, client, knownPathMethods, atoms, atomListeners) {
	function createProxy(path = []) {
		return new Proxy(function() {}, {
			get(_, prop) {
				if (typeof prop !== "string") return;
				if (prop === "then" || prop === "catch" || prop === "finally") return;
				const fullPath = [...path, prop];
				let current = routes;
				for (const segment of fullPath) if (current && typeof current === "object" && segment in current) current = current[segment];
				else {
					current = void 0;
					break;
				}
				if (typeof current === "function") return current;
				if (isAtom(current)) return current;
				return createProxy(fullPath);
			},
			apply: async (_, __, args) => {
				const routePath = "/" + path.map(toKebabCase).join("/");
				const arg = args[0] || {};
				const fetchOptions = args[1] || {};
				const { query, fetchOptions: argFetchOptions, ...body } = arg;
				const options = {
					...fetchOptions,
					...argFetchOptions
				};
				const method = getMethod(routePath, knownPathMethods, arg);
				return await client(routePath, {
					...options,
					body: method === "GET" ? void 0 : {
						...body,
						...options?.body || {}
					},
					query: query || options?.query,
					method,
					async onSuccess(context) {
						await options?.onSuccess?.(context);
						if (!atomListeners || options.disableSignal) return;
						/**
						* We trigger listeners
						*/
						const matches = atomListeners.filter((s) => s.matcher(routePath));
						if (!matches.length) return;
						const visited = /* @__PURE__ */ new Set();
						for (const match of matches) {
							const signal = atoms[match.signal];
							if (!signal) return;
							if (visited.has(match.signal)) continue;
							visited.add(match.signal);
							/**
							* To avoid race conditions we set the signal in a setTimeout
							*/
							const val = signal.get();
							setTimeout(() => {
								signal.set(!val);
							}, 10);
							match.callback?.(routePath);
						}
					}
				});
			}
		});
	}
	return createProxy();
}
/**
* Subscribe to store changes and get store's value.
*
* Can be used with store builder too.
*
* ```js
* import { useStore } from 'nanostores/react'
*
* import { router } from '../store/router'
*
* export const Layout = () => {
*   let page = useStore(router)
*   if (page.route === 'home') {
*     return <HomePage />
*   } else {
*     return <Error404 />
*   }
* }
* ```
*
* @param store Store instance.
* @returns Store value.
*/
function useStore(store, options = {}) {
	const snapshotRef = (0, import_react.useRef)(store.get());
	const { keys, deps = [store, keys] } = options;
	const subscribe = (0, import_react.useCallback)((onChange) => {
		const emitChange = (value) => {
			if (snapshotRef.current === value) return;
			snapshotRef.current = value;
			onChange();
		};
		emitChange(store.value);
		if (keys?.length) return listenKeys(store, keys, emitChange);
		return store.listen(emitChange);
	}, deps);
	const get = () => snapshotRef.current;
	return (0, import_react.useSyncExternalStore)(subscribe, get, get);
}
function getAtomKey(str) {
	return `use${capitalizeFirstLetter(str)}`;
}
function createAuthClient(options) {
	const { pluginPathMethods, pluginsActions, pluginsAtoms, $fetch, $store, atomListeners } = getClientConfig(options);
	const resolvedHooks = {};
	for (const [key, value] of Object.entries(pluginsAtoms)) resolvedHooks[getAtomKey(key)] = () => useStore(value);
	return createDynamicPathProxy({
		...pluginsActions,
		...resolvedHooks,
		$fetch,
		$store
	}, $fetch, pluginPathMethods, pluginsAtoms, atomListeners);
}
/**
* The sign-out sequence used by `src/lib/auth/client.ts`, kept here as a pure
* module so its effects can be unit-tested (`node --test` only covers
* `scripts/`), the same split `migration-plan.mjs` uses for the two appliers.
*
* The two environments authenticate differently, so they need different
* answers to "the server did not reply":
*
* - **Live preview** — a partitioned iframe with no readable session cookie;
*   the session rides the bearer token in `sessionStorage`. Dropping that token
*   IS being signed out, so the server call is best effort and a wedged request
*   must never strand the button. This is where the hang actually happens.
* - **Deployed** — the session rides an HttpOnly `__Host-` cookie that JS
*   cannot delete. ONLY a completed sign-out response clears it, and
*   `server.ts` enables `session.cookieCache` (maxAge 300), so `/get-session`
*   would keep answering from the cached cookie for minutes afterwards.
*   Redirecting on a timeout would show the visitor "signed out" while their
*   session is still live — so here we fail loudly instead of pretending.
*/
/**
* Live preview: aggressive, because the local clear is what signs the user out.
* The same-origin POST normally answers in tens of ms; lower would start
* abandoning slow-but-working sign-outs for no gain.
*/
var PREVIEW_SIGN_OUT_TIMEOUT_MS = 1500;
/**
* Deployed: generous, because only the server can end this session — but still
* bounded, so a wedged request reports failure the visitor can retry instead of
* spinning forever. A sign-out still unanswered at 10s is not going to land.
*/
var DEPLOYED_SIGN_OUT_TIMEOUT_MS = 1e4;
/**
* How long to wait for a sign-out in this environment. Every sign-out network
* call picks its bound here, so the preview/deployed split cannot drift apart
* between callers.
* @param {boolean} livePreview
* @returns {number}
*/
function signOutTimeoutMs(livePreview) {
	return livePreview ? PREVIEW_SIGN_OUT_TIMEOUT_MS : DEPLOYED_SIGN_OUT_TIMEOUT_MS;
}
/**
* Run `start()` but give up after `timeoutMs`, reporting which happened. Never
* rejects — callers decide what a failure means, and a `try/catch` around an
* `await` does nothing for a promise that never settles.
* @param {() => unknown} start
* @param {number} timeoutMs
* @returns {Promise<"ok" | "failed" | "timeout">}
*/
function settleWithin(start, timeoutMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => resolve("timeout"), timeoutMs);
		/** @param {"ok" | "failed"} outcome */
		const done = (outcome) => {
			clearTimeout(timer);
			resolve(outcome);
		};
		try {
			Promise.resolve(start()).then(() => done("ok"), () => done("failed"));
		} catch {
			done("failed");
		}
	});
}
/**
* @typedef {object} SignOutSteps
* @property {boolean} livePreview Whether the app is the sandbox preview iframe.
* @property {boolean} hasBearer Whether a preview bearer token is stored.
* @property {() => unknown} requestSignOut Ask the server to end the session; must reject on a failed response.
* @property {() => void} clearToken Drop the stored bearer token.
* @property {() => void} redirect Leave the page.
* @property {number} [timeoutMs]
*/
/**
* End the session, then clear the local token and redirect.
*
* In the live preview those last two always run. When deployed they run only if
* the server confirmed, because nothing else can clear the cookie — a failed or
* timed-out sign-out throws rather than reporting a sign-out that did not
* happen.
* @param {SignOutSteps} steps
* @returns {Promise<void>}
*/
async function runSignOut({ livePreview, hasBearer, requestSignOut, clearToken, redirect, timeoutMs }) {
	if (livePreview) {
		if (hasBearer) await settleWithin(requestSignOut, timeoutMs ?? signOutTimeoutMs(livePreview));
		clearToken();
		redirect();
		return;
	}
	const outcome = await settleWithin(requestSignOut, timeoutMs ?? signOutTimeoutMs(livePreview));
	if (outcome !== "ok") throw new Error(outcome === "timeout" ? "Sign-out timed out — you are still signed in. Please try again." : "Sign-out failed — you are still signed in. Please try again.");
	clearToken();
	redirect();
}
/**
* Better Auth client for this React SPA (browser-side).
*
* Talks to this app's OWN Better Auth at same-origin `/api/auth/*`. In the live
* preview the app is an embedded iframe with PARTITIONED cookies, so after a
* popup sign-in it can't read the session cookie — it authenticates with a
* bearer token instead (captured from the popup, see `signIn`). The `onRequest`
* hook attaches that token when present; when deployed (cookie auth) no token
* is stored, so nothing changes.
*
* To sign out call `signOut()` below, NOT `authClient.signOut()`: the raw call
* leaves the bearer token in place, and `onRequest` keeps re-attaching it, so
* the visitor stays signed in.
*/
var authClient = createAuthClient({
	plugins: [genericOAuthClient()],
	fetchOptions: { onRequest(ctx) {
		const token = getBearerToken();
		if (token) ctx.headers.set("Authorization", `Bearer ${token}`);
		return ctx;
	} }
});
var BEARER_KEY = "grok-auth.bearer-token";
/** The stored preview bearer token, or null. */
function getBearerToken() {
	if (typeof window === "undefined") return null;
	try {
		return window.sessionStorage.getItem(BEARER_KEY);
	} catch {
		return null;
	}
}
function setBearerToken(token) {
	if (typeof window === "undefined") return;
	try {
		if (token) window.sessionStorage.setItem(BEARER_KEY, token);
		else window.sessionStorage.removeItem(BEARER_KEY);
	} catch {}
}
/**
* The sandbox live preview runs this app inside an iframe on a `*.grok-sandbox.com`
* host, where a full-page redirect to the broker can't work — so sign-in uses a
* popup there and a normal redirect everywhere else.
*/
function inLivePreview() {
	return typeof window !== "undefined" && window.location.hostname.endsWith(".grok-sandbox.com");
}
/**
* Sign out of THIS app's local session, clear the preview token, then redirect.
*
* Use this, never `authClient.signOut()` — see the note on `authClient`.
* Sequencing lives in `scripts/sign-out-plan.mjs` so it can be unit-tested.
*
* **Rejects when deployed if the server never confirms.** There the session is
* an HttpOnly cookie only the server can clear, so redirecting anyway would
* report a sign-out that did not happen. `<UserButton />` handles that for you;
* a hand-rolled control must catch it and let the visitor retry. In the live
* preview the local clear is sufficient, so it always resolves.
*/
async function signOut(redirectTo = "/") {
	await runSignOut({
		livePreview: inLivePreview(),
		hasBearer: Boolean(getBearerToken()),
		requestSignOut: async () => {
			const { error } = await authClient.signOut();
			if (error) throw new Error(error.message ?? "Sign-out failed");
		},
		clearToken: () => setBearerToken(null),
		redirect: () => {
			window.location.href = redirectTo;
		}
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Local email/password sign-in + sign-up form, using this app's own Better
* Auth database (not the broker). Requires `emailAndPasswordEnabled` to be
* `true` in `./email-password`. Toggle between sign-in and sign-up with the
* link at the bottom.
*/
function EmailPasswordForm() {
	const [mode, setMode] = (0, import_react.useState)("sign-in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "sign-up") {
				const { error: signUpError } = await authClient.signUp.email({
					name: name || email,
					email,
					password
				});
				if (signUpError) throw new Error(signUpError.message ?? "Sign-up failed");
			} else {
				const { error: signInError } = await authClient.signIn.email({
					email,
					password
				});
				if (signInError) throw new Error(signInError.message ?? "Sign-in failed");
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex w-full max-w-sm flex-col gap-2 rounded-md border border-neutral-300 p-4 dark:border-neutral-700",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-sm font-semibold",
				children: mode === "sign-up" ? "Create an account" : "Sign in"
			}),
			mode === "sign-up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Name",
				value: name,
				onChange: (e) => setName(e.target.value),
				className: "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "email",
				placeholder: "Email",
				required: true,
				value: email,
				onChange: (e) => setEmail(e.target.value),
				className: "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "password",
				placeholder: "Password",
				required: true,
				minLength: 8,
				value: password,
				onChange: (e) => setPassword(e.target.value),
				className: "rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-red-500",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: loading,
				className: "mt-1 w-full cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
				children: loading ? "Please wait…" : mode === "sign-up" ? "Sign up" : "Sign in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					setError(null);
					setMode(mode === "sign-up" ? "sign-in" : "sign-up");
				},
				className: "mt-1 text-xs text-neutral-500 underline-offset-2 hover:underline",
				children: mode === "sign-up" ? "Already have an account? Sign in" : "Need an account? Sign up"
			})
		]
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function Crest({ size = 42 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/akan-hq-logo.svg",
		alt: "AGA KHAN ACADEMY crest",
		width: size,
		height: size,
		className: "block rounded-full object-contain shadow-[0_0_0_1px_rgba(252,236,188,0.55),0_10px_30px_rgba(3,10,7,0.65)]",
		draggable: false
	});
}
function AppShell() {
	const loaded = usePitchStore((s) => s.loaded);
	const mode = usePitchStore((s) => s.mode);
	const setMode = usePitchStore((s) => s.setMode);
	const squadTab = usePitchStore((s) => s.squadTab);
	const setSquadTab = usePitchStore((s) => s.setSquadTab);
	const tactiqTab = usePitchStore((s) => s.tactiqTab);
	const setTactiqTab = usePitchStore((s) => s.setTactiqTab);
	const category = usePitchStore((s) => s.category);
	const setCategory = usePitchStore((s) => s.setCategory);
	const playersAll = usePitchStore((s) => s.players);
	const selectedId = usePitchStore((s) => s.selectedPlayerId);
	const setSelectedPlayer = usePitchStore((s) => s.setSelectedPlayer);
	const reducedMotion = usePitchStore((s) => s.reducedMotion);
	const setReducedMotion = usePitchStore((s) => s.setReducedMotion);
	const [pickSlot, setPickSlot] = (0, import_react.useState)(null);
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const saveDesk = () => {
		setSaveState("saved");
		window.setTimeout(() => setSaveState("idle"), 1200);
	};
	(0, import_react.useEffect)(() => {
		const unsub = usePitchStore.persist.onFinishHydration(() => {
			usePitchStore.setState({ loaded: true });
		});
		if (usePitchStore.persist.hasHydrated()) usePitchStore.setState({ loaded: true });
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		const st = usePitchStore.getState();
		if (Object.keys(st.slotMap).length > 0) return;
		const squad = st.players.filter((p) => p.category === st.category);
		const best = rankFormations(st.formatSize, squad, st.matches)[0];
		if (best) st.setSlotMap(slotMapFromEval(best));
	}, [loaded]);
	const players = (0, import_react.useMemo)(() => playersAll.filter((p) => p.category === category), [playersAll, category]);
	const selected = playersAll.find((p) => p.id === selectedId) ?? null;
	if (!loaded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-bg text-muted",
		children: "Loading desk…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-6 bg-bg text-fg px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-full bg-[#0e1513] p-1.5 ring-1 ring-[#dfe8df]/15 shadow-[0_8px_30px_rgba(0,0,0,0.38)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crest, { size: 74 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl font-semibold uppercase tracking-[0.2em] text-[#f3f5f2]",
					children: "AGA KHAN"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4b66a]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-5 bg-[#d4b66a]/70" }),
						"Football Academy",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-5 bg-[#d4b66a]/70" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailPasswordForm, {})
		]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-line bg-surface/90",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full bg-[#0e1513] p-1.5 ring-1 ring-[#dfe8df]/15 shadow-[0_8px_30px_rgba(0,0,0,0.38)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crest, { size: 74 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-[1.7rem] font-semibold leading-none tracking-[0.2em] text-[#f3f5f2] uppercase",
								children: "AGA KHAN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#d4b66a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-5 bg-[#d4b66a]/70" }), "Football Academy"]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex overflow-hidden rounded-full border border-line bg-[#0d1412] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
									children: [
										["squad", "Squad"],
										["tactiq", "Tactics"],
										["advisor", "Insights"]
									].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMode(id),
										className: cn("rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors", mode === id ? "bg-accent text-accent-fg shadow-[0_0_18px_rgba(122,169,135,0.18)]" : "text-muted hover:text-fg"),
										children: label
									}, id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: category,
									onChange: (e) => setCategory(e.target.value),
									className: "h-9 rounded-full border border-line bg-[#101814] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted",
									children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c,
										children: [c, " squad"]
									}, c))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: saveDesk,
									className: "h-9 rounded-full border border-[#a7b6a7]/30 bg-[#142019] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#e4ece5]",
									title: "Save current changes",
									children: saveState === "saved" ? "Saved" : "Save"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setReducedMotion(!reducedMotion),
									className: cn("h-9 rounded-full border px-3 text-[10px] font-semibold uppercase tracking-[0.12em]", reducedMotion ? "border-accent/60 bg-accent/10 text-accent" : "border-line bg-[#101814] text-muted"),
									title: "Reduce motion",
									children: reducedMotion ? "Motion off" : "Motion on"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							]
						})]
					}),
					mode === "squad" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pt-1",
						children: [
							[
								"home",
								"Home",
								Zap
							],
							[
								"players",
								"My Cards",
								Users
							],
							[
								"coaches",
								"Coaches",
								UserCog
							],
							[
								"training",
								"Training",
								Dumbbell
							],
							[
								"matches",
								"Matches",
								Trophy
							],
							[
								"calendar",
								"Calendar",
								CalendarDays
							],
							[
								"legacy",
								"Legacy",
								Trophy
							]
						].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSquadTab(id),
							className: cn("flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]", squadTab === id ? "border-accent text-accent" : "border-transparent text-subtle hover:text-fg"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }),
								" ",
								label
							]
						}, id))
					}),
					mode === "tactiq" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 pt-1",
						children: [
							[
								"board",
								"Board",
								LayoutGrid
							],
							[
								"simulate",
								"Simulate",
								Zap
							],
							[
								"possession",
								"In possession",
								Users
							],
							[
								"compare",
								"Compare",
								Trophy
							]
						].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTactiqTab(id),
							className: cn("flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]", tactiqTab === id ? "border-accent text-accent" : "border-transparent text-subtle hover:text-fg"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }),
								" ",
								label
							]
						}, id))
					}),
					mode === "advisor" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-accent" }), "Tactical Lab — formation intelligence, evidence, and recommendations grounded in squad data."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-4 pb-16",
				children: [
					mode === "squad" && squadTab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id)
					}),
					mode === "squad" && squadTab === "players" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayersView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id)
					}),
					mode === "squad" && squadTab === "coaches" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachesView, { players }),
					mode === "squad" && squadTab === "training" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainingView, { players }),
					mode === "squad" && squadTab === "matches" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchesView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id)
					}),
					mode === "squad" && squadTab === "calendar" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarView, {}),
					mode === "squad" && squadTab === "legacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegacyCabinetView, {}),
					mode === "tactiq" && tactiqTab === "board" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id),
						onPickForSlot: setPickSlot
					}),
					mode === "tactiq" && tactiqTab === "simulate" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulateView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id)
					}),
					mode === "tactiq" && tactiqTab === "possession" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PossessionView, { players }),
					mode === "tactiq" && tactiqTab === "compare" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareView, {}),
					mode === "advisor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvisorView, {
						players,
						onOpenPlayer: (p) => setSelectedPlayer(p.id),
						onUsed: () => {}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line py-3 text-center text-[11px] text-subtle",
				children: "MADE BY WAYNE LTD COMPANY"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: !!selected,
				onClose: () => setSelectedPlayer(null),
				wide: true,
				children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerProfile, {
					player: selected,
					onClose: () => setSelectedPlayer(null)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: !!pickSlot,
				onClose: () => setPickSlot(null),
				children: pickSlot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotPicker, {
					slot: pickSlot,
					players,
					onClose: () => setPickSlot(null)
				})
			})
		]
	}) })] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
