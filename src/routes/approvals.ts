import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getCurrentUserAndRole } from "@/routes/me";

/**
 * OWNER ONLY.
 * GET  /approvals -> list every request that is still waiting
 * POST /approvals -> approve or reject one request
 *     { action: "approve" | "reject", type: "player", userId, playerId }
 *     { action: "approve" | "reject", type: "signup", userId }
 *
 * Approving is the ONLY place a role is granted. It sets app_users.role, and
 * only for people who are still 'pending' (it can never demote or change an
 * owner / editor / coach).
 */

type Sql = Awaited<ReturnType<typeof getSql>>;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getUserInfo(sql: Sql, userId: string): Promise<{ name: string | null; email: string | null } | null> {
  try {
    const rows = await sql<{ name: string | null; email: string | null }>`
      select name, email from "user" where id = ${userId}
    `;
    return rows[0] ?? null;
  } catch (err) {
    console.error("[approvals] could not look up user info:", err);
    return null;
  }
}

export const Route = createFileRoute("/approvals")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { userId, role } = await getCurrentUserAndRole();
          if (!userId) return json({ error: "Please sign in." }, 401);
          if (role !== "owner") return json({ error: "Only the owner can see requests." }, 403);

          const sql = await getSql();
          const claims = await sql<{ player_id: string; user_id: string }>`
            select player_id, user_id from player_claims where status = 'pending'
          `;
          const reqs = await sql<{ user_id: string; requested_role: string }>`
            select user_id, requested_role from signup_requests where status = 'pending'
          `;

          const playerItems = await Promise.all(
            claims.map(async (c) => {
              const info = await getUserInfo(sql, c.user_id);
              return {
                type: "player" as const,
                userId: c.user_id,
                playerId: c.player_id,
                name: info?.name ?? null,
                email: info?.email ?? null,
              };
            }),
          );
          const signupItems = await Promise.all(
            reqs.map(async (r) => {
              const info = await getUserInfo(sql, r.user_id);
              return {
                type: "signup" as const,
                userId: r.user_id,
                role: (r.requested_role === "editor" ? "editor" : "coach") as "coach" | "editor",
                name: info?.name ?? null,
                email: info?.email ?? null,
              };
            }),
          );

          return json({ items: [...playerItems, ...signupItems] });
        } catch (err) {
          console.error("[approvals] GET failed:", err);
          return json({ error: err instanceof Error ? err.message : "Failed to load requests" }, 500);
        }
      },

      POST: async ({ request }) => {
        try {
          const { userId, role } = await getCurrentUserAndRole();
          if (!userId) return json({ error: "Please sign in." }, 401);
          if (role !== "owner") return json({ error: "Only the owner can approve requests." }, 403);

          let body: { action?: string; type?: string; userId?: string; playerId?: string };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ error: "Invalid request body" }, 400);
          }

          const targetId = typeof body.userId === "string" ? body.userId : "";
          if (!targetId) return json({ error: "Missing user." }, 400);
          const approve = body.action === "approve";
          const reject = body.action === "reject";
          if (!approve && !reject) return json({ error: "Unknown action." }, 400);

          const sql = await getSql();

          if (body.type === "player") {
            const playerId = typeof body.playerId === "string" ? body.playerId : "";
            if (!playerId) return json({ error: "Missing card." }, 400);

            if (reject) {
              await sql`
                update player_claims set status = 'rejected'
                where player_id = ${playerId} and user_id = ${targetId} and status = 'pending'
              `;
              return json({ ok: true });
            }

            const waiting = await sql<{ one: number }>`
              select 1 as one from player_claims
              where player_id = ${playerId} and user_id = ${targetId} and status = 'pending'
            `;
            if (waiting.length === 0) return json({ error: "That request is no longer waiting." }, 404);

            const taken = await sql<{ one: number }>`
              select 1 as one from player_claims
              where player_id = ${playerId} and status = 'approved' and user_id <> ${targetId}
            `;
            if (taken.length > 0) return json({ error: "That card already belongs to another player." }, 409);

            await sql`
              update player_claims set status = 'approved'
              where player_id = ${playerId} and user_id = ${targetId}
            `;
            // Anyone else waiting for this same card is turned down.
            await sql`
              update player_claims set status = 'rejected'
              where player_id = ${playerId} and user_id <> ${targetId} and status = 'pending'
            `;
            // This person's other waiting requests are cleared.
            await sql`
              update player_claims set status = 'rejected'
              where user_id = ${targetId} and player_id <> ${playerId} and status = 'pending'
            `;
            await sql`
              update signup_requests set status = 'rejected'
              where user_id = ${targetId} and status = 'pending'
            `;
            await sql`
              insert into app_users (user_id, role) values (${targetId}, 'player')
              on conflict (user_id) do update set role = 'player' where app_users.role = 'pending'
            `;
            return json({ ok: true });
          }

          if (body.type === "signup") {
            const rows = await sql<{ requested_role: string }>`
              select requested_role from signup_requests
              where user_id = ${targetId} and status = 'pending'
            `;
            if (rows.length === 0) return json({ error: "That request is no longer waiting." }, 404);

            if (reject) {
              await sql`
                update signup_requests set status = 'rejected'
                where user_id = ${targetId} and status = 'pending'
              `;
              return json({ ok: true });
            }

            // The role comes from what the person asked for, never from the browser.
            const newRole = rows[0].requested_role === "editor" ? "editor" : "coach";
            await sql`
              update signup_requests set status = 'approved'
              where user_id = ${targetId} and status = 'pending'
            `;
            await sql`
              update player_claims set status = 'rejected'
              where user_id = ${targetId} and status = 'pending'
            `;
            await sql`
              insert into app_users (user_id, role) values (${targetId}, ${newRole})
              on conflict (user_id) do update set role = ${newRole} where app_users.role = 'pending'
            `;
            return json({ ok: true });
          }

          return json({ error: "Unknown request type." }, 400);
        } catch (err) {
          console.error("[approvals] POST failed:", err);
          return json({ error: err instanceof Error ? err.message : "Failed to update request" }, 500);
        }
      },
    },
  },
});