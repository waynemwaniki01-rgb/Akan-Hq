import { o as __toESM } from "../_runtime.mjs";
import { L as require_jsx_runtime, R as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as CircleCheck, x as Send } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-coach-tY4poozZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AskCoachPage() {
	const [coachEmail, setCoachEmail] = (0, import_react.useState)("");
	const [coachName, setCoachName] = (0, import_react.useState)("");
	const [callUpName, setCallUpName] = (0, import_react.useState)("");
	const [playerName, setPlayerName] = (0, import_react.useState)("");
	const [playerEmail, setPlayerEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		setCoachEmail(params.get("coachEmail") ?? "");
		setCoachName(params.get("coachName") ?? "");
		setCallUpName(params.get("callup") ?? "");
		setPlayerName(params.get("player") ?? "");
	}, []);
	async function submit() {
		if (!coachEmail.trim() || !playerName.trim() || !message.trim() || sending) return;
		setSending(true);
		setError(null);
		try {
			const response = await fetch("/api/ask-coach", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					coachEmail: coachEmail.trim(),
					coachName: coachName.trim(),
					playerName: playerName.trim(),
					playerEmail: playerEmail.trim(),
					callUpName: callUpName.trim(),
					message: message.trim()
				})
			});
			const payload = await response.json().catch(() => null);
			if (!response.ok) throw new Error(payload?.error || "Could not send your message. Please try again.");
			setSent(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
		} finally {
			setSending(false);
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#070c0a] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[20px] border border-[#26332d] bg-[#0f1815] p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto mb-4 size-12 text-[#d4b66a]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-2 font-display text-2xl text-white",
					children: "Message sent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-[#9fb0a8]",
					children: [coachName || "Your coach", " will get your question by email and can reply straight to you."]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#070c0a] px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-[20px] border border-[#26332d] bg-[#0f1815] p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-center text-[10px] font-bold uppercase tracking-[4px] text-[#d4b66a]",
					children: "Aga Khan Football Academy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-1 text-center font-display text-2xl text-white",
					children: "Ask your coach"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-center text-sm text-[#9fb0a8]",
					children: coachName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Send a quick question to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#f0d79a] font-semibold",
							children: coachName
						}),
						" about ",
						callUpName || "your selection",
						"."
					] }) : "Send a quick question to your coach."
				}),
				!coachEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn",
					children: "This link is missing coach contact details — please use the link from your call-up email instead of typing this address manually."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-[#9fb0a8]",
							children: ["Your name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: playerName,
								onChange: (e) => setPlayerName(e.target.value),
								placeholder: "Your full name",
								className: "mt-1 h-11 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 text-sm text-white placeholder:text-[#556860]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-[#9fb0a8]",
							children: ["Your email (so your coach can reply)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: playerEmail,
								onChange: (e) => setPlayerEmail(e.target.value),
								placeholder: "you@email.com",
								className: "mt-1 h-11 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 text-sm text-white placeholder:text-[#556860]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-[#9fb0a8]",
							children: ["Your message", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: "e.g. Hi coach, could you let me know what I can work on to be considered for the next call-up?",
								rows: 5,
								className: "mt-1 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 py-2 text-sm text-white placeholder:text-[#556860]"
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void submit(),
					disabled: !coachEmail.trim() || !playerName.trim() || !message.trim() || sending,
					className: "mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#d4b66a] px-4 py-3 text-sm font-bold text-[#0d1310] disabled:cursor-not-allowed disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }),
						" ",
						sending ? "Sending..." : "Send message"
					]
				})
			]
		})
	});
}
//#endregion
export { AskCoachPage as component };
