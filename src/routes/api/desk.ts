import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { requireUserId, UnauthorizedError } from "@/lib/auth/verify.server";

function errorResponse(err: unknown): Response {
  if (err instanceof UnauthorizedError) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  console.error("[desk] Failed:", err);
  return new Response(
    JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected server error" }),
    { status: 500, headers: { "Content-Type": "application/json" } },
  );
}

export const Route = createFileRoute("/api/desk")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const userId = await requireUserId();
          const sql = await getSql();
          const rows = await sql<{ data: unknown }>`
            select data from desk_data where user_id = ${userId}
          `;
          const data = rows[0]?.data ?? null;
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return errorResponse(err);
        }
      },
      POST: async ({ request }) => {
        try {
          const userId = await requireUserId();
          let body: unknown;
          try {
            body = await request.json();
          } catch {
            return new Response(JSON.stringify({ error: "Invalid request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const sql = await getSql();
          await sql`
            insert into desk_data (user_id, data, updated_at)
            values (${userId}, ${JSON.stringify(body)}::jsonb, now())
            on conflict (user_id)
            do update set data = excluded.data, updated_at = now()
          `;
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          return errorResponse(err);
        }
      },
    },
  },
});