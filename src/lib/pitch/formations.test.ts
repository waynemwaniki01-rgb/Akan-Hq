import test from "node:test";
import assert from "node:assert/strict";

import { layoutFormation } from "./formations.ts";

test("goalkeeper sits inside the goal, not behind the goal line", () => {
  const own = layoutFormation("4-3-3", "own");
  const opp = layoutFormation("4-3-3", "opp");

  const ownGk = own.find((slot) => slot.id === "gk");
  const oppGk = opp.find((slot) => slot.id === "gk");

  assert.ok(ownGk);
  assert.ok(oppGk);
  assert.equal(ownGk.y, 92);
  assert.equal(oppGk.y, 8);
});
