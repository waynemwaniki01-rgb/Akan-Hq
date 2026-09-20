import { createFileRoute } from "@tanstack/react-router";
import { sendEmail } from "@/lib/email";
import { getCurrentUserAndRole } from "@/routes/me";

type Recipient = {
  playerId: string;
  name: string;
  email: string;
  photo: string | null;
  position: string;
};

type SendCallUpBody = {
  callUpName: string;
  coachName: string;
  coachEmail?: string | null;
  coachPhoto?: string | null;
  calledNote?: string | null;
  notSelectedNote?: string | null;
  called: Recipient[];
  notSelected: Recipient[];
};

// NOTE: the "from" address is no longer set in this file. Every email now goes
// out through src/lib/email.ts, which sends from the Gmail account set in
// GMAIL_USER / GMAIL_APP_PASSWORD (Vercel settings, or scripts/.env locally).

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function safeText(v: string | null | undefined, fallback: string) {
  const t = (v ?? "").trim();
  return t.length ? t : fallback;
}

/**
 * Initials-only avatar badge. Player/coach photos in this app are stored as
 * base64 data URLs (often 100KB+ each). Embedding those directly in email
 * HTML caused two real problems: (1) Gmail clips any message over ~102KB,
 * silently cutting off everything after the photo; (2) many mail clients
 * (Outlook, some Gmail paths) don't render `data:` URI images at all,
 * producing a blank circle even without clipping. So: NEVER put r.photo or
 * coachPhoto into an email. Initials-only, always — small, reliable,
 * renders everywhere.
 */
function avatarBadge(name: string, size: number, ringColor: string, glow: string) {
  const inner = `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(160deg,#1c2e26,#0c1411);display:flex;align-items:center;justify-content:center;">
       <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:${Math.round(size * 0.34)}px;font-weight:800;color:#f0d79a;letter-spacing:1px;">${initialsOf(name)}</span>
     </div>`;

  const ringSize = size + 10;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="width:${ringSize + 14}px;height:${ringSize + 14}px;border-radius:50%;background:radial-gradient(circle, ${glow} 0%, rgba(0,0,0,0) 70%);text-align:center;vertical-align:middle;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="width:${ringSize}px;height:${ringSize}px;border-radius:50%;background:linear-gradient(160deg, ${ringColor}, rgba(255,255,255,0.15));text-align:center;vertical-align:middle;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;background-color:#0c1411;">
                      ${inner}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

/** Coach attribution row — name is always shown as plain readable text, never dependent on an image loading. */
function coachAttributionBlock(coachName: string, label: string, accent: string) {
  const name = safeText(coachName, "The coaching staff");
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:14px auto 0;">
      <tr>
        <td style="padding-right:12px;vertical-align:middle;">
          ${avatarBadge(name, 34, accent, `${accent}33`)}
        </td>
        <td style="vertical-align:middle;text-align:left;">
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;color:#8ba39a;text-transform:uppercase;letter-spacing:1.5px;">${label}</div>
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#f3f5f2;font-weight:700;">${name}</div>
        </td>
      </tr>
    </table>`;
}

/**
 * A visually distinct "message from the coach" quote box for the custom
 * note, instead of dumping it as bare paragraph text. Keeps the note legible
 * and separated from the surrounding copy, however short or informal the
 * coach's wording is.
 */
function noteQuoteBlock(note: string, accent: string) {
  const trimmed = note.trim();
  if (!trimmed) return "";
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 4px;">
      <tr>
        <td style="background-color:rgba(255,255,255,0.03);border-left:3px solid ${accent};border-radius:0 10px 10px 0;padding:14px 16px;">
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;color:${accent};text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin-bottom:6px;">
            Note from the coach
          </div>
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.65;color:#dfe8e2;">
            ${trimmed}
          </div>
        </td>
      </tr>
    </table>`;
}

/** Shared outer shell — dark academy theme, gold trim. */
function emailShell(opts: {
  headline: string;
  headerGradient: string;
  accent: string;
  body: string;
}) {
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;background-color:#070c0a;padding:36px 16px;margin:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;margin:0 auto;">
      <tr>
        <td style="background-color:#0f1815;border-radius:20px;overflow:hidden;border:1px solid #26332d;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:${opts.headerGradient};padding:30px 28px 24px;text-align:center;border-bottom:1px solid #26332d;">
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;letter-spacing:4px;color:${opts.accent};text-transform:uppercase;font-weight:700;margin-bottom:10px;">
                  ⚽ &nbsp;Aga Khan Football Academy&nbsp; ⚽
                </div>
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:24px;color:#ffffff;font-weight:800;letter-spacing:0.3px;">
                  ${opts.headline}
                </div>
                <div style="height:3px;width:56px;background:${opts.accent};margin:14px auto 0;border-radius:2px;"></div>
              </td>
            </tr>
          </table>

          ${opts.body}

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:18px 28px 26px;text-align:center;border-top:1px solid #1c2622;">
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;letter-spacing:2.5px;color:#556860;text-transform:uppercase;">
                  Aga Khan Football Academy
                </div>
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:10px;color:#3f4e48;margin-top:4px;">
                  Automated squad notification — please do not reply to this email.
                </div>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>`;
}

function calledUpEmail(r: Recipient, callUpName: string, coachName: string, customNote: string | null) {
  const accent = "#d4b66a";
  const position = safeText(r.position, "SQUAD");
  const playerName = safeText(r.name, "Player");

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:30px 28px 6px;text-align:center;">
          ${avatarBadge(playerName, 92, accent, "rgba(212,182,106,0.35)")}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
            <tr>
              <td style="background-color:rgba(212,182,106,0.12);border:1px solid rgba(212,182,106,0.4);border-radius:20px;padding:4px 14px;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:1.5px;color:${accent};font-weight:700;">${position.toUpperCase()}</span>
              </td>
            </tr>
          </table>
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;color:#ffffff;font-weight:800;margin:12px 0 4px;letter-spacing:0.2px;">
            ${playerName}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 4px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:linear-gradient(135deg, rgba(212,182,106,0.18), rgba(212,182,106,0.04));border:1px solid rgba(212,182,106,0.35);border-radius:24px;padding:6px 20px;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:800;color:#f7e9bd;letter-spacing:0.5px;">🏆 CALLED UP</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;text-align:left;">
          <p style="font-family:'Segoe UI',Arial,sans-serif;color:#dfe8e2;font-size:15px;line-height:1.65;margin:0 0 18px;">
            Great news — you've been selected to represent the academy for:
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#151f1a,#0e1613);border:1px solid rgba(212,182,106,0.28);border-radius:14px;">
            <tr>
              <td style="padding:20px 22px;border-left:4px solid ${accent}; border-radius:14px 0 0 14px;">
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:19px;color:#f7e9bd;font-weight:800;letter-spacing:0.2px;">
                  ${safeText(callUpName, "Match call-up")}
                </div>
                ${coachAttributionBlock(coachName, "Selected by", accent)}
              </td>
            </tr>
          </table>
          ${noteQuoteBlock(customNote ?? "", accent)}
          ${
            !customNote?.trim()
              ? `<p style="font-family:'Segoe UI',Arial,sans-serif;color:#9fb0a8;font-size:13.5px;line-height:1.7;margin:18px 0 8px;">
                  Make sure to check with your coach for kickoff time, kit requirements, and where to meet. Train hard and represent the academy with pride.
                </p>`
              : ""
          }
        </td>
      </tr>
      <tr>
        <td style="padding:14px 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color:rgba(212,182,106,0.08);border-radius:10px;padding:12px 16px;text-align:center;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:12.5px;color:${accent};font-weight:700;">⭐ Bring full kit, boots, and shin guards ⭐</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  return emailShell({
    headline: "You've Been Called Up! ⚽",
    headerGradient: "linear-gradient(135deg,#1c2e22,#0d1613)",
    accent,
    body,
  });
}

function notSelectedEmail(r: Recipient, callUpName: string, coachName: string, customNote: string | null) {
  const accent = "#7d8f88";
  const position = safeText(r.position, "SQUAD");
  const playerName = safeText(r.name, "Player");

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:30px 28px 6px;text-align:center;">
          ${avatarBadge(playerName, 92, accent, "rgba(125,143,136,0.28)")}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
            <tr>
              <td style="background-color:rgba(125,143,136,0.12);border:1px solid rgba(125,143,136,0.35);border-radius:20px;padding:4px 14px;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:1.5px;color:${accent};font-weight:700;">${position.toUpperCase()}</span>
              </td>
            </tr>
          </table>
          <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;color:#ffffff;font-weight:800;margin:12px 0 4px;letter-spacing:0.2px;">
            ${playerName}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 4px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:linear-gradient(135deg, rgba(125,143,136,0.16), rgba(125,143,136,0.03));border:1px solid rgba(125,143,136,0.32);border-radius:24px;padding:6px 20px;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:800;color:#c9d2ce;letter-spacing:0.5px;">📋 SQUAD UPDATE</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;text-align:left;">
          <p style="font-family:'Segoe UI',Arial,sans-serif;color:#dfe8e2;font-size:15px;line-height:1.65;margin:0 0 18px;">
            You haven't been selected for the squad this time:
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#131a17,#0e1512);border:1px solid rgba(125,143,136,0.25);border-radius:14px;">
            <tr>
              <td style="padding:20px 22px;border-left:4px solid ${accent}; border-radius:14px 0 0 14px;">
                <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:19px;color:#d5dcd8;font-weight:800;letter-spacing:0.2px;">
                  ${safeText(callUpName, "Match call-up")}
                </div>
                ${coachAttributionBlock(coachName, "Decision by", accent)}
              </td>
            </tr>
          </table>
          ${noteQuoteBlock(customNote ?? "", accent)}
          ${
            !customNote?.trim()
              ? `<p style="font-family:'Segoe UI',Arial,sans-serif;color:#9fb0a8;font-size:13.5px;line-height:1.7;margin:18px 0 8px;">
                  Keep training hard — selection decisions are made week to week, and consistent effort at training is always noticed.
                </p>`
              : ""
          }
        </td>
      </tr>
      <tr>
        <td style="padding:14px 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="background-color:rgba(125,143,136,0.08);border-radius:10px;padding:12px 16px;text-align:center;">
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:12.5px;color:${accent};font-weight:700;">💪 See you at the next training session 💪</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  return emailShell({
    headline: "Squad Update",
    headerGradient: "linear-gradient(135deg,#1a2420,#0d1310)",
    accent,
    body,
  });
}

async function sendOne(
  r: Recipient,
  isCalled: boolean,
  callUpName: string,
  coachName: string,
  customNote: string | null,
) {
  if (!r.email) {
    return { playerId: r.playerId, email: "", success: false, error: "No email on file" };
  }

  const result = await sendEmail({
    to: r.email,
    subject: isCalled ? `⚽ You've been called up — ${callUpName}` : `Squad update — ${callUpName}`,
    html: isCalled
      ? calledUpEmail(r, callUpName, coachName, customNote)
      : notSelectedEmail(r, callUpName, coachName, customNote),
  });

  if (!result.ok) {
    console.error(`[send-callup] Failed to send to ${r.email}:`, result.error);
    return { playerId: r.playerId, email: r.email, success: false, error: result.error };
  }

  console.log(`[send-callup] Sent to ${r.email}`);
  return { playerId: r.playerId, email: r.email, success: true };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/send-callup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Only signed-in owners / editors / coaches may send call-ups. Without
        // this check, anyone who found this address could send email from the
        // academy's Gmail account.
        try {
          const { userId, role } = await getCurrentUserAndRole();
          if (!userId) return json({ error: "Please sign in to send call-ups." }, 401);
          if (role !== "owner" && role !== "editor" && role !== "coach") {
            return json({ error: "You don't have permission to send call-ups." }, 403);
          }
        } catch (err) {
          console.error("[send-callup] permission check failed:", err);
          return json({ error: "Could not check your permissions." }, 500);
        }

        let body: SendCallUpBody;
        try {
          body = (await request.json()) as SendCallUpBody;
        } catch {
          return json({ error: "Invalid request body" }, 400);
        }

        const { callUpName, coachName, called, notSelected, calledNote, notSelectedNote } = body;

        if (!callUpName || !Array.isArray(called) || !Array.isArray(notSelected)) {
          return json({ error: "Missing required fields" }, 400);
        }

        try {
          const results = await Promise.all([
            ...called.map((r) => sendOne(r, true, callUpName, coachName, calledNote ?? null)),
            ...notSelected.map((r) => sendOne(r, false, callUpName, coachName, notSelectedNote ?? null)),
          ]);

          return json({ results });
        } catch (err) {
          console.error("[send-callup] Unexpected failure:", err);
          return json({ error: err instanceof Error ? err.message : "Unexpected server error" }, 500);
        }
      },
    },
  },
});