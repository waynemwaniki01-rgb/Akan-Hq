import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { getCurrentUserAndRole } from "@/routes/me";
import { emptyData } from "@/lib/pitch/seed";
import { CARD_DESIGNS } from "@/lib/pitch/types";
import type { DeskData, Player } from "@/lib/pitch/types";

/**
 * GET /desk  -> load the TEAM's desk (public — no sign-in required)
 * POST /desk -> save the team's desk
 *                - owner / editor / coach: save the whole desk
 *                - player: save ONLY the look (photo, cardDesign, cardStyle)
 *                  of the one card they claimed. Everything else in the
 *                  request is ignored.
 *
 * This app models ONE shared team roster, not a private desk per visitor.
 * The team's data lives in the desk_data row that belongs to the account
 * with role = 'owner' (there is exactly one owner). Anyone — signed in or
 * not — can GET it, so cards/squad/matches are viewable by anyone with the
 * link. Only signed-in users with an editing role can POST changes, and
 * those changes are written to the SAME owner-owned row, so every editor's
 * changes land in the one shared roster instead of a private copy.
 */

const MAX_PHOTO_CHARS = 2_000_000;
const MAX_STYLE_CHARS = 200_000;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getOwnerUserId(sql: Awaited<ReturnType<typeof getSql>>): Promise<string | null> {
  const rows = await sql<{ user_id: string }>`
    select user_id from app_users where role = 'owner' limit 1
  `;
  return rows[0]?.user_id ?? null;
}

type LookFields = {
  photo: string | null;
  cardDesign: Player["cardDesign"];
  cardStyle?: Player["cardStyle"];
};

/**
 * Pull the three allowed "look" fields out of whatever the browser sent for
 * a card, and check each one. Anything else on the card is never read.
 * This list is the whole of what a player is allowed to change.
 */
function readLookFields(card: unknown): { ok: true; look: LookFields } | { ok: false; error: string } {
  if (!card || typeof card !== "object") return { ok: false, error: "Missing card data." };
  const c = card as Record<string, unknown>;

  const photo = c.photo ?? null;
  if (photo !== null) {
    const okPhoto =
      typeof photo === "string" &&
      photo.length <= MAX_PHOTO_CHARS &&
      (photo.startsWith("data:image/") || photo.startsWith("https://"));
    if (!okPhoto) return { ok: false, error: "That photo isn't in a supported format." };
  }

  const design = c.cardDesign;
  if (typeof design !== "string" || !(CARD_DESIGNS as readonly string[]).includes(design)) {
    return { ok: false, error: "Unknown card design." };
  }

  let cardStyle: Player["cardStyle"];
  if (c.cardStyle !== undefined && c.cardStyle !== null) {
    if (
      typeof c.cardStyle !== "object" ||
      Array.isArray(c.cardStyle) ||
      JSON.stringify(c.cardStyle).length > MAX_STYLE_CHARS
    ) {
      return { ok: false, error: "That card style isn't valid." };
    }
    cardStyle = c.cardStyle as Player["cardStyle"];
  }

  return {
    ok: true,
    look: {
      photo: photo as string | null,
      cardDesign: design as Player["cardDesign"],
      cardStyle,
    },
  };
}

export const Route = createFileRoute("/desk")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sql = await getSql();
          const ownerId = await getOwnerUserId(sql);

          if (!ownerId) {
            // No owner configured yet — nothing to show.
            return new Response(JSON.stringify(emptyData()), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const rows = await sql<{ data: DeskData }>`
            select data from desk_data where user_id = ${ownerId}
          `;

          console.log("[desk] GET (public/team) - found rows:", rows.length);

          if (rows.length === 0) {
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
        const { userId, role, playerId } = await getCurrentUserAndRole();

        console.log("[desk] POST - userId:", userId, "role:", role);

        if (!userId) {
          return new Response(JSON.stringify({ error: "Not signed in" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const canSaveWholeDesk = role === "owner" || role === "editor" || role === "coach";
        if (!canSaveWholeDesk && role !== "player") {
          return new Response(JSON.stringify({ error: "You don't have permission to save changes." }), {
            status: 403,
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

        // ---- Player: look-only save for their own card -------------------
        if (role === "player") {
          if (!playerId) {
            return jsonResponse({ error: "Your account isn't linked to a player card yet." }, 403);
          }

          try {
            const submittedCard = Array.isArray(desk?.players)
              ? desk.players.find((p) => p?.id === playerId)
              : undefined;
            if (!submittedCard) {
              return jsonResponse({ error: "Your card wasn't included in this save." }, 400);
            }

            const parsed = readLookFields(submittedCard);
            if (!parsed.ok) return jsonResponse({ error: parsed.error }, 400);

            const sql = await getSql();
            const ownerId = await getOwnerUserId(sql);
            if (!ownerId) return jsonResponse({ error: "The team desk isn't set up yet." }, 404);

            // Start from what is ALREADY stored, not from what the browser
            // sent. That way a player can never overwrite a coach's changes
            // (or anyone else's card) with an out-of-date copy.
            const rows = await sql<{ data: DeskData }>`
              select data from desk_data where user_id = ${ownerId}
            `;
            if (rows.length === 0) return jsonResponse({ error: "The team desk isn't set up yet." }, 404);

            const stored = rows[0].data;
            const storedPlayers = Array.isArray(stored.players) ? stored.players : [];
            if (!storedPlayers.some((p) => p.id === playerId)) {
              return jsonResponse({ error: "Your card no longer exists on the squad." }, 404);
            }

            const { photo, cardDesign, cardStyle } = parsed.look;
            const merged: DeskData = {
              ...stored,
              players: storedPlayers.map((p) =>
                p.id === playerId
                  ? { ...p, photo, cardDesign, ...(cardStyle ? { cardStyle } : {}) }
                  : p,
              ),
            };

            await sql`
              update desk_data
              set data = ${JSON.stringify(merged)}, updated_at = now()
              where user_id = ${ownerId}
            `;

            console.log("[desk] POST - player look saved for card:", playerId);
            return jsonResponse({ ok: true });
          } catch (err) {
            console.error("[desk] POST (player look) failed:", err);
            return jsonResponse(
              { error: err instanceof Error ? err.message : "Failed to save your card" },
              500,
            );
          }
        }

        // ---- Owner / editor / coach: save the whole desk -----------------
        try {
          const sql = await getSql();
          const ownerId = (await getOwnerUserId(sql)) ?? userId;

          console.log("[desk] POST - saving to team row owned by:", ownerId);
          console.log("[desk] POST - players count:", desk.players?.length ?? 0);

          // Always upsert into the OWNER's row — this is the single shared
          // team desk. An editor/coach saving does not create their own
          // separate row; their change lands in the same shared roster.
          await sql`
            insert into desk_data (user_id, data, updated_at)
            values (${ownerId}, ${JSON.stringify(desk)}, now())
            on conflict (user_id)
            do update set data = ${JSON.stringify(desk)}, updated_at = now()
          `;

          console.log("[desk] POST - save successful");
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