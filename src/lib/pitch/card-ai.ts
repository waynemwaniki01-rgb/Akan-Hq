import { createServerFn } from "@tanstack/react-start";
import type { CardStyle } from "./types";
import { mergeCardStyle } from "./card-system";

export interface CardAiStyles {
  background?: string;
  accentColor?: string;
  glowColor?: string;
  gridColor?: string;
  textColor?: string;
  borderStyle?: string;
}

export interface CardAiResponse {
  ok: boolean;
  styles?: CardAiStyles;
  error?: string;
}

export type CardPromptResult = {
  style: CardStyle;
  title: string;
  summary: string;
};

// TanStack Start Server Function (compiled automatically into an RPC endpoint)
export const generateCardAesthetics = createServerFn({ method: "POST" })
  .validator((data: { theme: string }) => data)
  .handler(async ({ data }): Promise<CardAiResponse> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return { ok: false, error: "Missing GEMINI_API_KEY in process.env." };
      }

      const systemInstruction =
        "You are an expert CSS designer for futuristic football trading cards. " +
        "Read the user's custom design prompt and output ONLY a valid JSON object with these exact keys: " +
        "background (CSS gradient), accentColor (hex color string), glowColor (rgba color string), " +
        "gridColor (rgba color string), textColor (hex color string), borderStyle (CSS border string like '2px solid #ffd000'). " +
        "Do not include markdown formatting, backticks, or extra commentary—return strictly the raw JSON object.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${systemInstruction}\n\nUser prompt: "${data.theme}"` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        return { ok: false, error: `Gemini API error: ${errText}` };
      }

      const json = await response.json();
      const content = json.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      const styles: CardAiStyles = JSON.parse(cleanJson);

      return { ok: true, styles };
    } catch (err: any) {
      return { ok: false, error: err?.message || "Failed to parse AI-generated card aesthetics." };
    }
  });

function parseColorsFromPrompt(promptText: string): Partial<CardAiStyles> {
  const hexMatches = promptText.match(/#[0-9a-fA-F]{6}\b/g) || [];
  const rgbaMatches = promptText.match(/rgba?\([^)]+\)/g) || [];

  if (hexMatches.length === 0) return {};

  const darkHexes = hexMatches.filter((h) =>
    ["#09090b", "#18181b", "#0d001a", "#050505", "#000000"].includes(h.toLowerCase())
  );

  const bgStart = darkHexes[0] || hexMatches[0] || "#18181b";
  const bgEnd = darkHexes[1] || hexMatches[1] || "#09090b";

  return {
    background: `linear-gradient(180deg, ${bgStart} 0%, ${bgEnd} 100%)`,
    accentColor: hexMatches.find((h) => !darkHexes.includes(h)) || "#e2e8f0",
    glowColor: rgbaMatches[0] || "rgba(255, 255, 255, 0.2)",
    textColor: "#ffffff",
    borderStyle: `1px solid ${hexMatches.find((h) => !darkHexes.includes(h)) || "#94a3b8"}`,
  };
}

async function fetchAiAesthetics(themePrompt: string): Promise<CardAiStyles | null> {
  try {
    const result = await generateCardAesthetics({ data: { theme: themePrompt } });
    if (!result || !result.ok) {
      console.error("AI card design failed:", result?.error);
      return null;
    }
    return result.styles ?? null;
  } catch (error) {
    console.error("Failed to fetch AI aesthetics, using fallback:", error);
    return null;
  }
}

export async function designCardFromPromptAsync(
  rawPrompt: string,
  base?: CardStyle
): Promise<CardPromptResult> {
  const prompt = rawPrompt.trim();
  const apiStyles = await fetchAiAesthetics(prompt);
  const fallbackParsed = parseColorsFromPrompt(prompt);

  const activeStyles: CardAiStyles = apiStyles || fallbackParsed;

  const styleFromAI: Partial<CardStyle> = {
    // No hardcoded dark fallback here anymore — when neither the AI nor the
    // prompt parser produces a background, leave it unset so the card falls
    // back to its tier's own colorful surface instead of going flat black.
    generatedBackground: activeStyles.background || "",
    accent: activeStyles.accentColor || "#e2e8f0",
    glowColor: activeStyles.glowColor || "rgba(255, 255, 255, 0.2)",
    gridColor: activeStyles.gridColor || "rgba(255, 255, 255, 0.05)",
    text: activeStyles.textColor || "#ffffff",
    border: activeStyles.accentColor || "#94a3b8",
    showGrid: prompt.toLowerCase().includes("grid"),
  };

  const style = mergeCardStyle({ ...base, ...styleFromAI });

  return {
    style,
    title: apiStyles ? "AI-Generated Aesthetic" : "Extracted Prompt Aesthetic",
    summary: apiStyles
      ? `Applied live AI-generated styling for prompt: "${prompt}".`
      : `Extracted colors directly from your prompt.`,
  };
}

export function designCardFromPrompt(rawPrompt: string, base?: CardStyle): CardPromptResult {
  const prompt = rawPrompt.trim();
  const parsed = parseColorsFromPrompt(prompt);

  const style = mergeCardStyle({
    ...base,
    // Same as above: no hardcoded dark fallback, so an unmatched prompt
    // doesn't pin the card to a flat near-black background.
    generatedBackground: parsed.background || "",
    accent: parsed.accentColor || "#e2e8f0",
    glowColor: parsed.glowColor || "rgba(255, 255, 255, 0.2)",
    text: "#ffffff",
  });

  return {
    style,
    title: "Sync AI Preview",
    summary: `Configured base aesthetic for "${prompt.slice(0, 40)}...".`,
  };
}