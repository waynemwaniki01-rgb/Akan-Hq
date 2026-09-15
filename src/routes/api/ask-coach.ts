import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import dotenv from "dotenv";

type AskCoachBody = {
  coachEmail: string;
  coachName: string;
  playerName: string;
  playerEmail: string;
  callUpName: string;
  message: string;
};

function ensureEnvLoaded() {
  dotenv.config({ path: "scripts/.env" });
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || "Aga Khan Football Academy <onboarding@resend.dev>";
}

function getResendClient() {
  ensureEnvLoaded();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set — check scripts/.env");
  }
  return new Resend(apiKey);
}

function askCoachEmail(playerName: string, callUpName: string, message: string) {
  const accent = "#d4b66a";
  const safeMessage = message
    .split("\n")
    .map((line) => `<p style="margin:0 0 10px;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#e4ece5;">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");

  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#070c0a;padding:36px 16px;margin:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;margin:0 auto;">
      <tr>
        <td style="background-color:#0f1815;border-radius:20px;overflow:hidden;border:1px solid #26332d;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:linear-gradient(135deg,#1c2e22,#0d1613);padding:28px 28px 20px;text-align:center;border-bottom:1px solid #26332d;">
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;letter-spacing:4px;color:${accent};text-transform:uppercase;font-weight:700;margin-bottom:10px;">
                  ⚽ &nbsp;Aga Khan Football Academy&nbsp; ⚽
                </div>
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;color:#ffffff;font-weight:800;">
                  💬 A player has a question
                </div>
              </td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:26px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#151f1a,#0e1613);border:1px solid rgba(212,182,106,0.28);border-radius:14px;margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px 20px;border-left:4px solid ${accent};border-radius:14px 0 0 14px;">
                      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#8ba39a;text-transform:uppercase;letter-spacing:1.5px;">From</div>
                      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:17px;color:#f7e9bd;font-weight:800;">${playerName}</div>
                      <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#8ba39a;margin-top:6px;">Re: ${callUpName}</div>
                    </td>
                  </tr>
                </table>
                ${safeMessage}
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#5f716a;margin:20px 0 0;">
                  Reply directly to this email to respond to ${playerName}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

export const Route = createFileRoute("/api/ask-coach")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        ensureEnvLoaded();

        if (!process.env.RESEND_API_KEY) {
          return new Response(
            JSON.stringify({ error: "Email service is not configured. Check scripts/.env." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        let body: AskCoachBody;
        try {
          body = (await request.json()) as AskCoachBody;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { coachEmail, coachName, playerName, playerEmail, callUpName, message } = body;

        if (!coachEmail?.trim() || !playerName?.trim() || !message?.trim()) {
          return new Response(JSON.stringify({ error: "Missing required fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const resend = getResendClient();
          const { error } = await resend.emails.send({
            from: getFromAddress(),
            to: coachEmail.trim(),
            replyTo: playerEmail?.trim() || undefined,
            subject: `💬 ${playerName} has a question — ${callUpName || "Call-up"}`,
            html: askCoachEmail(playerName.trim(), callUpName || "the recent call-up", message.trim()),
          });

          if (error) {
            console.error("[ask-coach] Resend rejected email:", error);
            return new Response(JSON.stringify({ error: error.message || "Could not send message" }), {
              status: 502,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[ask-coach] Failed:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});