import { useEffect, useState } from "react";
import type { Role } from "@/routes/me";

export type { Role };

/**
 * Fetches the signed-in user's role from GET /me. Defaults to "pending"
 * while loading and on any error — the safe/locked-down default.
 */
export function useRole(): { role: Role; loading: boolean; refresh: () => void } {
  const [role, setRole] = useState<Role>("pending");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/me")
      .then((res) => res.json())
      .then((data: { role?: Role }) => {
        if (!cancelled) setRole(data.role ?? "pending");
      })
      .catch(() => {
        if (!cancelled) setRole("pending");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { role, loading, refresh: () => setTick((t) => t + 1) };
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