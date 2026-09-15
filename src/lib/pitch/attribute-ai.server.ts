import { createServerFn } from "@tanstack/react-start";
import { POSITIONS } from "./types";

export interface GeneratedAttributes {
  name?: string;
  position?: string;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

export interface AttributeAiResponse {
  ok: boolean;
  data?: GeneratedAttributes;
  error?: string;
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    position: { type: "string", enum: POSITIONS as unknown as string[] },
    pace: { type: "integer" },
    shooting: { type: "integer" },
    passing: { type: "integer" },
    dribbling: { type: "integer" },
    defending: { type: "integer" },
    physical: { type: "integer" },
  },
};

const SYSTEM_INSTRUCTION = `You are a scout for a football video game card creator. Given a text description of a player (and optionally a reference photo), output a JSON object with:
- "name": a plausible player name if one is implied or given (omit if none implied)
- "position": one of the standard position codes (GK, CB, LB, RB, CDM, CM, CAM, LM, RM, LW, RW, ST, CF)
- "pace", "shooting", "passing", "dribbling", "defending", "physical": integers from 1-99 that reflect the description

If a reference image is given, let it inform your read of the player's likely build, age, and playing style (e.g. a big physical frame might suggest higher "physical" and "defending"; a slight, quick-looking frame might suggest higher "pace" and "dribbling") — but this is just supporting context, weight the text description as primary.

Only include fields you can reasonably infer. Output ONLY the JSON object. No markdown, no explanation.`;

export const generateCardAttributes = createServerFn({ method: "POST" })
  .validator((data: { prompt: string; imageBase64?: string; imageMimeType?: string }) => data)
  .handler(async ({ data }): Promise<AttributeAiResponse> => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return { ok: false, error: "Missing GEMINI_API_KEY in your environment variables (.env)." };
      }

      const userParts: any[] = [{ text: data.prompt || "Describe a balanced football player." }];
      if (data.imageBase64 && data.imageMimeType) {
        userParts.push({ inlineData: { mimeType: data.imageMimeType, data: data.imageBase64 } });
      }

      const model = "gemini-3.7-flash";
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [{ role: "user", parts: userParts }],
            generationConfig: {
              temperature: 0.8,
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        return { ok: false, error: `Gemini API request failed (${response.status}): ${errText}` };
      }

      const json = await response.json();
      const content: string | undefined = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) return { ok: false, error: "Gemini response had no content." };

      let parsed: GeneratedAttributes;
      try {
        parsed = JSON.parse(content);
      } catch {
        return { ok: false, error: `Failed to parse Gemini response as JSON: ${content.slice(0, 200)}` };
      }

      return { ok: true, data: parsed };
    } catch (err: any) {
      return { ok: false, error: err?.message || "Failed to generate attributes." };
    }
  });