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

// NOTE: the "from" address is not set in this file. Every email goes out
// through src/lib/email.ts, which sends from the Gmail account set in
// GMAIL_USER / GMAIL_APP_PASSWORD (Vercel settings, or scripts/.env locally).

const FONT = "'Segoe UI',Helvetica,Arial,sans-serif";

type Theme = {
  accent: string;
  ink: string; // colour of initials inside avatars
  headerBg: string;
  panelBg: string;
  panelBorder: string;
  pillBg: string;
  pillBorder: string;
  calloutBg: string;
  calloutBorder: string;
};

const CALLED_THEME: Theme = {
  accent: "#d4b66a",
  ink: "#f0d79a",
  headerBg: "#14231b",
  panelBg: "#15201b",
  panelBorder: "#3b3820",
  pillBg: "#221f10",
  pillBorder: "#4a4222",
  calloutBg: "#1e1c12",
  calloutBorder: "#4a4222",
};

const NOT_SELECTED_THEME: Theme = {
  accent: "#8fa39b",
  ink: "#c9d2ce",
  headerBg: "#141c18",
  panelBg: "#131a17",
  panelBorder: "#2e3934",
  pillBg: "#1a221f",
  pillBorder: "#33403a",
  calloutBg: "#151c19",
  calloutBorder: "#2e3934",
};

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

/** Anything typed by a user (names, notes) is escaped before going into HTML. */
function escapeHtml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Initials-only avatar badge. Player/coach photos in this app are stored as
 * base64 data URLs (often 100KB+ each). Embedding those directly in email
 * HTML caused two real problems: (1) Gmail clips any message over ~102KB,
 * silently cutting off everything after the photo; (2) many mail clients
 * (Outlook, some Gmail paths) don't render `data:` URI images at all,
 * producing a blank circle even without clipping. So: NEVER put r.photo or
 * coachPhoto into an email. Initials-only, always.
 *
 * Built as a single centred table cell (no flexbox) so the initials sit in the
 * middle of the circle in every mail client.
 */
function avatarBadge(name: string, size: number, accent: string, ink: string) {
  const fontSize = Math.round(size * 0.36);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
      <tr>
        <td width="${size}" height="${size}" align="center" valign="middle" style="width:${size}px;height:${size}px;border-radius:50%;background-color:#16241d;border:3px solid ${accent};font-family:${FONT};font-size:${fontSize}px;line-height:${size}px;font-weight:800;color:${ink};letter-spacing:1px;text-align:center;">
          ${escapeHtml(initialsOf(name))}
        </td>
      </tr>
    </table>`;
}

/** Coach row: avatar + name as plain readable text, never dependent on an image. */
function coachRow(coachName: string, label: string, t: Theme) {
  const name = safeText(coachName, "Coaching staff");
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;">
      <tr>
        <td valign="middle" style="padding-right:14px;">
          ${avatarBadge(name, 40, t.accent, t.ink)}
        </td>
        <td valign="middle" style="text-align:left;">
          <div style="font-family:${FONT};font-size:12px;line-height:1.3;color:#8ba39a;text-transform:uppercase;letter-spacing:2px;">${label}</div>
          <div style="font-family:${FONT};font-size:17px;line-height:1.3;color:#f3f5f2;font-weight:700;margin-top:2px;">${escapeHtml(name)}</div>
        </td>
      </tr>
    </table>`;
}

/** The coach's custom note, shown as a clearly separated quote. */
function noteQuoteBlock(note: string, t: Theme) {
  const trimmed = note.trim();
  if (!trimmed) return "";
  const safe = escapeHtml(trimmed).replace(/\r?\n/g, "<br>");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
      <tr>
        <td style="background-color:${t.panelBg};border-left:4px solid ${t.accent};border-radius:0 12px 12px 0;padding:18px 20px;">
          <div style="font-family:${FONT};font-size:12px;color:${t.accent};text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-bottom:8px;">
            Note from the coach
          </div>
          <div style="font-family:${FONT};font-size:16px;line-height:1.6;color:#e6eee9;">
            ${safe}
          </div>
        </td>
      </tr>
    </table>`;
}

/** Avatar, player name and position pill. Returns a table row. */
function playerBlock(name: string, position: string, t: Theme) {
  return `
    <tr>
      <td align="center" style="padding:28px 32px 0;text-align:center;">
        ${avatarBadge(name, 96, t.accent, t.ink)}
        <div style="font-family:${FONT};font-size:26px;line-height:1.2;color:#ffffff;font-weight:800;margin:16px 0 0;">
          ${escapeHtml(name)}
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:12px auto 0;">
          <tr>
            <td style="background-color:${t.pillBg};border:1px solid ${t.pillBorder};border-radius:20px;padding:5px 16px;font-family:${FONT};font-size:12px;letter-spacing:2px;color:${t.accent};font-weight:700;">
              ${escapeHtml(position.toUpperCase())}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/** Intro line, call-up panel, coach note and fallback copy. Returns a table row. */
function contentBlock(opts: {
  intro: string; // already-escaped HTML
  panelLabel: string;
  callUpName: string;
  coachLabel: string;
  coachName: string;
  note: string | null;
  fallbackText: string;
  t: Theme;
}) {
  const { t } = opts;
  const hasNote = !!opts.note?.trim();
  return `
    <tr>
      <td style="padding:28px 32px 0;text-align:left;">
        <p style="font-family:${FONT};color:#e6eee9;font-size:16px;line-height:1.6;margin:0 0 20px;">
          ${opts.intro}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${t.panelBg};border:1px solid ${t.panelBorder};border-radius:14px;overflow:hidden;">
          <tr>
            <td width="5" style="width:5px;background-color:${t.accent};font-size:0;line-height:0;">&nbsp;</td>
            <td style="padding:22px 24px;">
              <div style="font-family:${FONT};font-size:12px;color:${t.accent};text-transform:uppercase;letter-spacing:2px;font-weight:700;">
                ${opts.panelLabel}
              </div>
              <div style="font-family:${FONT};font-size:24px;line-height:1.25;color:#f7e9bd;font-weight:800;margin-top:8px;">
                ${escapeHtml(safeText(opts.callUpName, "Match call-up"))}
              </div>
              <div style="height:1px;line-height:1px;font-size:0;background-color:#2a3630;margin:18px 0 0;">&nbsp;</div>
              ${coachRow(opts.coachName, opts.coachLabel, t)}
            </td>
          </tr>
        </table>
        ${noteQuoteBlock(opts.note ?? "", t)}
        ${
          !hasNote
            ? `<p style="font-family:${FONT};color:#a9b9b1;font-size:15px;line-height:1.7;margin:22px 0 0;">${opts.fallbackText}</p>`
            : ""
        }
      </td>
    </tr>`;
}

/** Highlighted strip at the bottom. Returns a table row. */
function calloutBlock(label: string, text: string, t: Theme) {
  return `
    <tr>
      <td style="padding:24px 32px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="background-color:${t.calloutBg};border:1px solid ${t.calloutBorder};border-radius:12px;padding:16px 20px;text-align:center;">
              <div style="font-family:${FONT};font-size:12px;color:${t.accent};text-transform:uppercase;letter-spacing:2px;font-weight:700;">
                ${label}
              </div>
              <div style="font-family:${FONT};font-size:17px;line-height:1.4;color:#f3ecd0;font-weight:700;margin-top:6px;">
                ${text}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/** Shared outer shell: dark academy theme with an accent trim. `body` is a set of table rows. */
function emailShell(opts: { preheader: string; headline: string; t: Theme; body: string }) {
  const { t } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(opts.headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:#070c0a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:#070c0a;">
    ${escapeHtml(opts.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#070c0a;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#0f1815;border:1px solid #26332d;border-radius:20px;overflow:hidden;">

          <tr>
            <td style="height:5px;line-height:5px;font-size:0;background-color:${t.accent};">&nbsp;</td>
          </tr>

          <tr>
            <td align="center" style="background-color:${t.headerBg};padding:32px 32px 28px;text-align:center;border-bottom:1px solid #26332d;">
              <div style="font-family:${FONT};font-size:12px;letter-spacing:3px;color:${t.accent};text-transform:uppercase;font-weight:700;">
                Aga Khan Football Academy
              </div>
              <div style="font-family:${FONT};font-size:30px;line-height:1.2;color:#ffffff;font-weight:800;margin-top:12px;">
                ${opts.headline}
              </div>
              <div style="height:3px;width:56px;background-color:${t.accent};margin:18px auto 0;border-radius:2px;font-size:0;line-height:3px;">&nbsp;</div>
            </td>
          </tr>

          ${opts.body}

          <tr>
            <td align="center" style="padding:20px 32px 28px;text-align:center;border-top:1px solid #1c2622;">
              <div style="font-family:${FONT};font-size:12px;letter-spacing:2px;color:#6f8178;text-transform:uppercase;">
                Aga Khan Football Academy
              </div>
              <div style="font-family:${FONT};font-size:12px;color:#5f7168;margin-top:6px;">
                Automated squad notification — please do not reply to this email.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function calledUpEmail(r: Recipient, callUpName: string, coachName: string, customNote: string | null) {
  const t = CALLED_THEME;
  const position = safeText(r.position, "SQUAD");
  const playerName = safeText(r.name, "Player");
  const firstName = playerName.split(/\s+/)[0];
  const title = safeText(callUpName, "Match call-up");

  const body =
    playerBlock(playerName, position, t) +
    contentBlock({
      intro: `Great news, <strong style="color:#ffffff;">${escapeHtml(firstName)}</strong> — you've been selected to represent the academy for:`,
      panelLabel: "🏆 Selected for",
      callUpName: title,
      coachLabel: "Selected by",
      coachName,
      note: customNote,
      fallbackText:
        "Check with your coach for kickoff time, kit requirements and where to meet. Train hard and represent the academy with pride.",
      t,
    }) +
    calloutBlock("Don't forget", "Full kit, boots and shin guards", t);

  return emailShell({
    preheader: `You've been selected for ${title}. Open for the details.`,
    headline: "You've been called up! ⚽",
    t,
    body,
  });
}

function notSelectedEmail(r: Recipient, callUpName: string, coachName: string, customNote: string | null) {
  const t = NOT_SELECTED_THEME;
  const position = safeText(r.position, "SQUAD");
  const playerName = safeText(r.name, "Player");
  const firstName = playerName.split(/\s+/)[0];
  const title = safeText(callUpName, "Match call-up");

  const body =
    playerBlock(playerName, position, t) +
    contentBlock({
      intro: `Hi <strong style="color:#ffffff;">${escapeHtml(firstName)}</strong> — you haven't been selected for the squad this time:`,
      panelLabel: "📋 Squad update for",
      callUpName: title,
      coachLabel: "Decision by",
      coachName,
      note: customNote,
      fallbackText:
        "Keep training hard — selection decisions are made week to week, and consistent effort at training is always noticed.",
      t,
    }) +
    calloutBlock("Next up", "See you at the next training session 💪", t);

  return emailShell({
    preheader: `Squad update for ${title}.`,
    headline: "Squad update",
    t,
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