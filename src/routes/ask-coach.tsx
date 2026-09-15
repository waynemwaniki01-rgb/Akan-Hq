import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, CheckCircle2 } from "lucide-react";

function AskCoachPage() {
  const [coachEmail, setCoachEmail] = useState("");
  const [coachName, setCoachName] = useState("");
  const [callUpName, setCallUpName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read context pre-filled from the emailed link (coach, call-up, player name)
  // so the player doesn't have to type any of it in.
  useEffect(() => {
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
          message: message.trim(),
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || "Could not send your message. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070c0a] px-4">
        <div className="w-full max-w-md rounded-[20px] border border-[#26332d] bg-[#0f1815] p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 size-12 text-[#d4b66a]" />
          <h1 className="mb-2 font-display text-2xl text-white">Message sent</h1>
          <p className="text-sm text-[#9fb0a8]">
            {coachName || "Your coach"} will get your question by email and can reply straight to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070c0a] px-4 py-10">
      <div className="w-full max-w-md rounded-[20px] border border-[#26332d] bg-[#0f1815] p-6 sm:p-8">
        <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-[4px] text-[#d4b66a]">
          Aga Khan Football Academy
        </div>
        <h1 className="mb-1 text-center font-display text-2xl text-white">Ask your coach</h1>
        <p className="mb-6 text-center text-sm text-[#9fb0a8]">
          {coachName ? (
            <>Send a quick question to <span className="text-[#f0d79a] font-semibold">{coachName}</span> about {callUpName || "your selection"}.</>
          ) : (
            "Send a quick question to your coach."
          )}
        </p>

        {!coachEmail && (
          <p className="mb-4 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn">
            This link is missing coach contact details — please use the link from your call-up email instead of typing this address manually.
          </p>
        )}

        <div className="space-y-3">
          <label className="block text-xs text-[#9fb0a8]">
            Your name
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 h-11 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 text-sm text-white placeholder:text-[#556860]"
            />
          </label>
          <label className="block text-xs text-[#9fb0a8]">
            Your email (so your coach can reply)
            <input
              type="email"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-1 h-11 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 text-sm text-white placeholder:text-[#556860]"
            />
          </label>
          <label className="block text-xs text-[#9fb0a8]">
            Your message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi coach, could you let me know what I can work on to be considered for the next call-up?"
              rows={5}
              className="mt-1 w-full rounded-[10px] border border-[#26332d] bg-[#151f1a] px-3 py-2 text-sm text-white placeholder:text-[#556860]"
            />
          </label>
        </div>

        {error && (
          <p className="mt-3 rounded-[10px] border border-warn/30 bg-warn/5 px-3 py-2 text-xs text-warn">{error}</p>
        )}

        <button
          type="button"
          onClick={() => void submit()}
          disabled={!coachEmail.trim() || !playerName.trim() || !message.trim() || sending}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#d4b66a] px-4 py-3 text-sm font-bold text-[#0d1310] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-4" /> {sending ? "Sending..." : "Send message"}
        </button>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ask-coach")({
  component: AskCoachPage,
});