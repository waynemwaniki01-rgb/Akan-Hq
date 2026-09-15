import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-ai-CuAVjcZz.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateCardAesthetics_createServerFn_handler = createServerRpc({
	id: "0b515ba27a8a66b3a1aeacb237af916385778b20904e91e04e00a9421afaddd9",
	name: "generateCardAesthetics",
	filename: "src/lib/pitch/card-ai.ts"
}, (opts) => generateCardAesthetics.__executeServer(opts));
var generateCardAesthetics = createServerFn({ method: "POST" }).validator((data) => data).handler(generateCardAesthetics_createServerFn_handler, async ({ data }) => {
	try {
		const apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) return {
			ok: false,
			error: "Missing GEMINI_API_KEY in process.env."
		};
		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: `You are an expert CSS designer for futuristic football trading cards. Read the user's custom design prompt and output ONLY a valid JSON object with these exact keys: background (CSS gradient), accentColor (hex color string), glowColor (rgba color string), gridColor (rgba color string), textColor (hex color string), borderStyle (CSS border string like '2px solid #ffd000'). Do not include markdown formatting, backticks, or extra commentary—return strictly the raw JSON object.\n\nUser prompt: "${data.theme}"` }] }],
				generationConfig: {
					temperature: .7,
					responseMimeType: "application/json"
				}
			})
		});
		if (!response.ok) return {
			ok: false,
			error: `Gemini API error: ${await response.text()}`
		};
		const cleanJson = ((await response.json()).candidates?.[0]?.content?.parts?.[0]?.text || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();
		return {
			ok: true,
			styles: JSON.parse(cleanJson)
		};
	} catch (err) {
		return {
			ok: false,
			error: err?.message || "Failed to parse AI-generated card aesthetics."
		};
	}
});
//#endregion
export { generateCardAesthetics_createServerFn_handler };
