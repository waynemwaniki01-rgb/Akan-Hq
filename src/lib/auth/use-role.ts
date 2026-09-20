import { useEffect, useState } from "react";
import type { Role } from "@/routes/me";

export type { Role };

/**
 * Fetches the signed-in user's role from GET /me. Defaults to "pending"
 * while loading and on any error — the safe/locked-down default.
 *
 * playerId is the card an approved player has claimed (null for everyone
 * else, and while loading).
 */
export function useRole(): {
  role: Role;
  playerId: string | null;
  loading: boolean;
  refresh: () => void;
} {
  const [role, setRole] = useState<Role>("pending");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/me")
      .then((res) => res.json())
      .then((data: { role?: Role; playerId?: string | null }) => {
        if (cancelled) return;
        setRole(data.role ?? "pending");
        setPlayerId(data.playerId ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setRole("pending");
        setPlayerId(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { role, playerId, loading, refresh: () => setTick((t) => t + 1) };
}

/** True for roles allowed to edit roster data, results, call-ups, etc. */
export function canEditRoster(role: Role): boolean {
  return role === "owner" || role === "editor" || role === "coach";
}

/** True for roles allowed to edit card design/style. */
export function canEditDesign(role: Role): boolean {
  return role === "owner" || role === "editor";
}

/** True only for the app owner (you). */
export function canApproveSignups(role: Role): boolean {
  return role === "owner";
}

/**
 * True when an approved player is looking at THEIR OWN card. They can change
 * that card's look (design and photo) and nothing else. The server checks
 * the same thing again, so this only decides whether to show the button.
 */
export function canEditOwnLook(role: Role, playerId: string | null, cardId: string): boolean {
  return role === "player" && !!playerId && playerId === cardId;
}