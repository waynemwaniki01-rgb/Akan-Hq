import { createFileRoute } from "@tanstack/react-router";
import { getCookie } from "@tanstack/react-start/server";
import { getSql } from "@/lib/db";
import { auth, SESSION_TOKEN_COOKIE } from "@/lib/auth/server";

export type Role = "owner" | "editor" | "coach" | "player" | "pending";

/**
 * Look up the signed-in user's id via Better Auth's own session resolver,
 * then their role from app_users. If the user has no app_users row yet
 * (first sign-in), create one with role 'pending' so they immediately
 * enter the approval flow instead of silently defaulting to viewer-like
 * access. Returns null userId when signed out.
 */
export async function getCurrentUserAndRole(): Promise<{ userId: string | null; role: Role }> {
  const token = getCookie(SESSION_TOKEN_COOKIE);
  if (!token) return { userId: null, role: "pending" };

  const headers = new Headers({ cookie: `${SESSION_TOKEN_COOKIE}=${token}` });
  const session = await auth.api.getSession({ headers });
  const userId = session?.user?.id ?? null;
  if (!userId) return { userId: null, role: "pending" };

  const sql = await getSql();
  const roles = await sql<{ role: Role }>`
    select role from app_users where user_id = ${userId}
  `;
  if (roles.length > 0) {
    return { userId, role: roles[0].role };
  }

  // First time we've seen this signed-in user — create their app_users row
  // as 'pending' so the role-choice/approval flow can pick it up.
  await sql`
    insert into app_users (user_id, role) values (${userId}, 'pending')
    on conflict (user_id) do nothing
  `;
  return { userId, role: "pending" };
}

export const Route = createFileRoute("/me")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { userId, role } = await getCurrentUserAndRole();
          return new Response(JSON.stringify({ userId, role }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[me] GET failed:", err);
          return new Response(JSON.stringify({ userId: null, role: "pending" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});