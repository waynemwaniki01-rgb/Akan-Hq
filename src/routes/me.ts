import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { auth, SESSION_TOKEN_COOKIE } from "@/lib/auth/server";

export type Role = "owner" | "editor" | "coach" | "player" | "pending";

/**
 * For a user whose role is 'player', find the card they claimed. This is the
 * ONLY place the server learns which card is "theirs" — it comes from the
 * approved row in player_claims, never from anything the browser sends.
 * Returns null if there is no approved claim (or the lookup fails), which
 * safely means "you can't edit any card".
 */
async function getClaimedPlayerId(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
): Promise<string | null> {
  try {
    const rows = await sql<{ player_id: string }>`
      select player_id from player_claims
      where user_id = ${userId} and status = 'approved'
      limit 1
    `;
    return rows[0]?.player_id ?? null;
  } catch (err) {
    console.error("[me] could not read player_claims:", err);
    return null;
  }
}

/**
 * Look up the signed-in user's id via Better Auth's own session resolver,
 * then their role from app_users. If the user has no app_users row yet
 * (first sign-in), create one with role 'pending' so they immediately
 * enter the approval flow instead of silently defaulting to viewer-like
 * access. Returns null userId when signed out.
 *
 * playerId is only filled in for role 'player' (the card they claimed);
 * it is null for everyone else.
 */
export async function getCurrentUserAndRole(): Promise<{
  userId: string | null;
  role: Role;
  playerId: string | null;
}> {
  const token = getCookie(SESSION_TOKEN_COOKIE);
  if (!token) return { userId: null, role: "pending", playerId: null };

  const headers = new Headers({ cookie: `${SESSION_TOKEN_COOKIE}=${token}` });
  const session = await auth.api.getSession({ headers });
  const userId = session?.user?.id ?? null;
  if (!userId) return { userId: null, role: "pending", playerId: null };

  const sql = await getSql();
  const roles = await sql<{ role: Role }>`
    select role from app_users where user_id = ${userId}
  `;
  if (roles.length > 0) {
    const role = roles[0].role;
    const playerId = role === "player" ? await getClaimedPlayerId(sql, userId) : null;
    return { userId, role, playerId };
  }

  // First time we've seen this signed-in user — create their app_users row
  // as 'pending' so the role-choice/approval flow can pick it up.
  await sql`
    insert into app_users (user_id, role) values (${userId}, 'pending')
    on conflict (user_id) do nothing
  `;
  return { userId, role: "pending", playerId: null };
}

export const Route = createFileRoute("/me")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { userId, role, playerId } = await getCurrentUserAndRole();
          return new Response(JSON.stringify({ userId, role, playerId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[me] GET failed:", err);
          return new Response(JSON.stringify({ userId: null, role: "pending", playerId: null }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});