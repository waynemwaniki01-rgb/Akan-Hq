/**
 * The ONE place the app sends email from (server-side only).
 *
 * Emails are sent through the academy's Gmail account, so they show up as
 * coming from that address. Two settings are needed:
 *
 *   GMAIL_USER          the Gmail address to send from (exactly as it is spelled)
 *   GMAIL_APP_PASSWORD  a Google "App password" for that account (NOT the normal password)
 *
 * They are read from the environment (Vercel -> Settings -> Environment
 * Variables on the live site) or, when running on your own computer, from
 * scripts/.env — the same place the call-up emails always used.
 *
 * Optional:
 *   EMAIL_FROM_NAME     the name people see (default: "Aga Khan Football Academy")
 *
 * Never throws — it returns { ok: false, error } so a failed email can never
 * break saving a request or sending a call-up.
 */

export type EmailMessage = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

export type SendResult = { ok: true } | { ok: false; error: string };

async function loadLocalEnvFile() {
  try {
    // Does nothing for variables that are already set (e.g. the ones in Vercel).
    const dotenv = (await import("dotenv")).default;
    dotenv.config({ path: "scripts/.env" });
  } catch {
    /* no scripts/.env here (normal on the live site) */
  }
}

export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  await loadLocalEnvFile();

  const user = process.env.GMAIL_USER?.trim();
  // Google shows app passwords with spaces ("abcd efgh ijkl mnop"); remove them.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass) {
    return {
      ok: false,
      error: "Email is not set up yet (GMAIL_USER / GMAIL_APP_PASSWORD missing).",
    };
  }

  try {
    // Loaded only when an email is actually sent, so it never ends up in the browser bundle.
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Aga Khan Football Academy";
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      replyTo: msg.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Email failed" };
  }
}