export type AcademyQueryResult = {
  target: "squad" | "tactiq" | "players" | "advisor";
  answer: string;
};

export function resolveAcademyQuery(raw: string): AcademyQueryResult {
  const q = raw.trim().toLowerCase();

  if (!q) {
    return {
      target: "squad",
      answer: "Start in the Squad Hub to view the academy overview, player cards, and upcoming fixtures.",
    };
  }

  if (
    /tactic|formation|board|shape|press|build|possession|compare|simulat|plan/.test(q)
  ) {
    return {
      target: "tactiq",
      answer:
        "Open the Tactics section to review the formation board, compare shapes, and simulate team patterns before the next session.",
    };
  }

  if (/player card|show me the players|find player|look up player|player profile|which player|who is .*player|name.*player|roster/.test(q)) {
    return {
      target: "players",
      answer:
        "Visit the Players area to browse player cards, review profiles, and find the right player for a position or role.",
    };
  }

  if (/who plays|who is|which player|player/.test(q) && !/goal|squad|team/.test(q)) {
    return {
      target: "players",
      answer:
        "Use the Players section to locate the relevant card and review that player’s role, profile, and development path.",
    };
  }

  if (/advisor|insight|recommend|analysis|lab|suggest/.test(q)) {
    return {
      target: "advisor",
      answer:
        "The Tactical Lab gives recommendations and deeper football analysis based on your current squad and formation choices.",
    };
  }

  return {
    target: "squad",
    answer:
      "Use the Squad Hub to review your academy overview, upcoming fixtures, and the latest player performances across the group.",
  };
}
