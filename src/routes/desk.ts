import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getCurrentUserAndRole } from "@/routes/me";
import { emptyData } from "@/lib/pitch/seed";
import type { DeskData } from "@/lib/pitch/types";

/**
 * GET /desk  -> load the signed-in user's desk from desk_data table
 * POST /desk -> save the signed-in user's desk to desk_data table
 *
 * Per-user JSON storage: one row per user_id in desk_data, holding the full
 * DeskData as JSONB. Full-replace reads/writes only.
 */

export const Route = createFileRoute("/desk")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { userId } = await getCurrentUserAndRole();
          
          // Debug logging to track user ID
          console.log('[desk] GET - userId from session:', userId);
          
          if (!userId) {
            // No session = return empty desk with fixtures
            console.log('[desk] GET - no userId, returning empty desk');
            return new Response(JSON.stringify(emptyData()), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const sql = await getSql();
          const rows = await sql<{ data: DeskData }>`
            select data from desk_data where user_id = ${userId}
          `;
          
          console.log('[desk] GET - found rows:', rows.length);
          if (rows.length > 0) {
            console.log('[desk] GET - data.players count:', rows[0].data.players?.length ?? 0);
            console.log('[desk] GET - data.coaches count:', rows[0].data.coaches?.length ?? 0);
            console.log('[desk] GET - data.matches count:', rows[0].data.matches?.length ?? 0);
            console.log('[desk] GET - data.trainings count:', rows[0].data.trainings?.length ?? 0);
            console.log('[desk] GET - data.meta.version:', rows[0].data.meta?.version);
          }
          
          if (rows.length === 0) {
            // User has no saved desk yet - return empty with fixtures
            console.log('[desk] GET - no desk_data row for user, returning empty desk');
            return new Response(JSON.stringify(emptyData()), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const desk = rows[0].data;
          return new Response(JSON.stringify(desk), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[desk] GET failed:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Failed to load desk" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      POST: async ({ request }) => {
        const { userId, role } = await getCurrentUserAndRole();
        
        // Debug logging
        console.log('[desk] POST - userId:', userId, 'role:', role);
        
        if (role !== "coach") {
          return new Response(JSON.stringify({ error: "You don't have permission to save changes." }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!userId) {
          return new Response(JSON.stringify({ error: "Not signed in" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        let desk: DeskData;
        try {
          desk = (await request.json()) as DeskData;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const sql = await getSql();
          
          console.log('[desk] POST - saving for userId:', userId);
          console.log('[desk] POST - players count:', desk.players?.length ?? 0);
          console.log('[desk] POST - coaches count:', desk.coaches?.length ?? 0);
          console.log('[desk] POST - matches count:', desk.matches?.length ?? 0);
          console.log('[desk] POST - trainings count:', desk.trainings?.length ?? 0);
          
          // Upsert: insert or update the user's desk_data row
          await sql`
            insert into desk_data (user_id, data, updated_at)
            values (${userId}, ${JSON.stringify(desk)}, now())
            on conflict (user_id)
            do update set data = ${JSON.stringify(desk)}, updated_at = now()
          `;

          console.log('[desk] POST - save successful');
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[desk] POST failed:", err);
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Failed to save desk" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});