import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getCurrentUserAndRole } from "@/routes/me";
import type { DeskData } from "@/lib/pitch/types";
import { sendEmail } from "@/lib/email";

/**
 * GET  /access -> who am I, and do I already have an access request waiting?
 * POST /access -> a signed-in user with role 'pending' asks for access:
 *     { kind: "player", playerId: "<card id>" }  -> claims one existing card
 *     { kind: "coach" }  or  { kind: "editor" }  -> asks for that role
 *
 * This route NEVER changes anyone's role. It only records the request
 * (player_claims / signup_requests) and emails the owner. The owner approves
 * it in the app (see /approvals).
 */

type Sql = Awaited<ReturnType<typeof getSql>>;

type MyRequest = {
  kind: "player" | "coach" | "editor";
  playerId?: string;
  status: string;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getMyRequest(sql: Sql, userId: string): Promise<MyRequest | null> {
  const claims = await sql<{ player_id: string; status: string }>`
    select player_id, status from player_claims where user_id = ${userId}
  `;
  const reqs = await sql<{ requested_role: string; status: string }>`
    select requested_role, status from signup_requests where user_id = ${userId}
  `;

  const all: MyRequest[] = [
    ...claims.map((c) => ({ kind: "player" as const, playerId: c.player_id, status: c.status })),
    ...reqs.map((r) => ({
      kind: (r.requested_role === "editor" ? "editor" : "coach") as "coach" | "editor",
      status: r.status,
    })),
  ];

  // Prefer a request that is still waiting; otherwise show the latest one we have.
  return all.find((r) => r.status === "pending") ?? all[0] ?? null;
}

/** Name + email of a user, or null if we can't look it up. Never throws. */
async function getUserInfo(sql: Sql, userId: string): Promise<{ name: string | null; email: string | null } | null> {
  try {
    const rows = await sql<{ name: string | null; email: string | null }>`
      select name, email from "user" where id = ${userId}
    `;
    return rows[0] ?? null;
  } catch (err) {
    console.error("[access] could not look up user info:", err);
    return null;
  }
}

function describeUser(info: { name: string | null; email: string | null } | null) {
  if (!info) return "Someone";
  const name = info.name || "Someone";
  return info.email ? `${name} (${info.email})` : name;
}

/**
 * Emails the owner (through src/lib/email.ts, i.e. the academy Gmail account).
 * Never throws — if the email fails, the request itself is still saved and
 * the owner can still see it in the app.
 *
 * Who receives it, in order: NOTIFY_EMAIL (if set in Vercel), otherwise the
 * academy Gmail itself (GMAIL_USER), otherwise the owner's account email.
 */
async function notifyOwner(sql: Sql, subject: string, lines: string[]) {
  try {
    let to: string | null = process.env.NOTIFY_EMAIL ?? process.env.GMAIL_USER ?? null;
    if (!to) {
      const owners = await sql<{ user_id: string }>`
        select user_id from app_users where role = 'owner' limit 1
      `;
      if (owners[0]) {
        to = (await getUserInfo(sql, owners[0].user_id))?.email ?? null;
      }
    }
    if (!to) {
      console.warn("[access] no email address to notify - email skipped");
      return;
    }

    const result = await sendEmail({ to, subject, text: lines.join("\n") });
    if (!result.ok) console.error("[access] email failed:", result.error);
  } catch (err) {
    console.error("[access] notifyOwner failed:", err);
  }
}

export const Route = createFileRoute("/access")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { userId, role } = await getCurrentUserAndRole();
          if (!userId) {
            return json({ signedIn: false, role: "pending", request: null });
          }
          const sql = await getSql();
          const request = await getMyRequest(sql, userId);
          return json({ signedIn: true, role, request });
        } catch (err) {
          console.error("[access] GET failed:", err);
          return json({ error: err instanceof Error ? err.message : "Failed to load" }, 500);
        }
      },

      POST: async ({ request }) => {
        try {
          const { userId, role } = await getCurrentUserAndRole();
          if (!userId) return json({ error: "Please sign in first." }, 401);
          if (role !== "pending") return json({ error: "Your account already has access." }, 400);

          let body: { kind?: string; playerId?: string };
          try {
            body = (await request.json()) as { kind?: string; playerId?: string };
          } catch {
            return json({ error: "Invalid request body" }, 400);
          }

          const sql = await getSql();
          const origin = new URL(request.url).origin;

          if (body.kind === "player") {
            const playerId = typeof body.playerId === "string" ? body.playerId : "";
            if (!playerId) return json({ error: "Pick a card first." }, 400);

            // The card must really exist in the team's shared roster.
            const owners = await sql<{ user_id: string }>`
              select user_id from app_users where role = 'owner' limit 1
            `;
            const ownerId = owners[0]?.user_id;
            if (!ownerId) return json({ error: "The team isn't set up yet." }, 400);

            const desks = await sql<{ data: DeskData }>`
              select data from desk_data where user_id = ${ownerId}
            `;
            const card = (desks[0]?.data?.players ?? []).find((p) => p.id === playerId);
            if (!card) return json({ error: "That card doesn't exist." }, 400);

            // A card that already belongs to someone else can't be claimed.
            const taken = await sql<{ one: number }>`
              select 1 as one from player_claims
              where player_id = ${playerId} and status = 'approved' and user_id <> ${userId}
            `;
            if (taken.length > 0) {
              return json({ error: "That card already belongs to another player." }, 409);
            }

            // Replace any earlier waiting request from this same person.
            await sql`delete from player_claims where user_id = ${userId} and status = 'pending'`;
            await sql`delete from signup_requests where user_id = ${userId} and status = 'pending'`;
            await sql`
              insert into player_claims (player_id, user_id, status)
              values (${playerId}, ${userId}, 'pending')
              on conflict (player_id, user_id) do update set status = 'pending'
            `;

            const info = await getUserInfo(sql, userId);
            await notifyOwner(sql, `Akan HQ: ${info?.name || "someone"} wants to be a player`, [
              `${describeUser(info)} asked to join as a player.`,
              `Card they picked: ${card.name}`,
              "",
              `Open the app and press "Requests" to approve or reject: ${origin}`,
            ]);
            return json({ ok: true });
          }

          if (body.kind === "coach" || body.kind === "editor") {
            await sql`delete from player_claims where user_id = ${userId} and status = 'pending'`;
            await sql`
              insert into signup_requests (user_id, requested_role, status)
              values (${userId}, ${body.kind}, 'pending')
              on conflict (user_id) do update set requested_role = excluded.requested_role, status = 'pending'
            `;

            const info = await getUserInfo(sql, userId);
            await notifyOwner(sql, `Akan HQ: ${info?.name || "someone"} wants to be a ${body.kind}`, [
              `${describeUser(info)} asked to join as a ${body.kind}.`,
              "",
              `Open the app and press "Requests" to approve or reject: ${origin}`,
            ]);
            return json({ ok: true });
          }

          return json({ error: "Unknown request type." }, 400);
        } catch (err) {
          console.error("[access] POST failed:", err);
          return json({ error: err instanceof Error ? err.message : "Failed to save request" }, 500);
        }
      },
    },
  },
});