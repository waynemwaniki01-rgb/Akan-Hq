import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { readSessionToken } from "@/lib/auth/server";

export type Role = "coach" | "designer" | "viewer";

/**
 * Look up the signed-in user's id from the session cookie, then their role
 * from app_users (default "viewer" if no row exists yet). Returns null
 * userId when signed out — callers treat that as viewer-only too.
 */
export async function getCurrentUserAndRole(): Promise<{ userId: string | null; role: Role }> {
  const token = readSessionToken();
  if (!token) return { userId: null, role: "viewer" };

  const sql = await getSql();
  const sessions = await sql<{ userId: string }>`
    select "userId" from "session" where "token" = ${token} and "expiresAt" > now()
  `;
  const userId = sessions[0]?.userId ?? null;
  if (!userId) return { userId: null, role: "viewer" };

  const roles = await sql<{ role: Role }>`
    select role from app_users where user_id = ${userId}
  `;
  return { userId, role: roles[0]?.role ?? "viewer" };
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
          return new Response(JSON.stringify({ userId: null, role: "viewer" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});