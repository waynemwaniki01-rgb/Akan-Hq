import test from "node:test";
import assert from "node:assert/strict";

import { resolveAcademyQuery } from "./academy-assistant.ts";

test("routes academy questions to the right area and gives a helpful answer", () => {
  const tactics = resolveAcademyQuery("where do i check the tactics board?");
  assert.equal(tactics.target, "tactiq");
  assert.match(tactics.answer, /tactics|formation/i);

  const players = resolveAcademyQuery("show me the players");
  assert.equal(players.target, "players");
  assert.match(players.answer, /player/i);

  const general = resolveAcademyQuery("who plays in goal?");
  assert.equal(general.target, "squad");
  assert.match(general.answer, /goal|squad/i);
});
