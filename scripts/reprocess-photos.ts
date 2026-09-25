/**
 * One-time batch job: runs every existing player's photo through
 * background removal and overwrites player.photo with the transparent
 * version. Run once after adding background removal support, to fix
 * players (like Aadi) whose photo was uploaded before this existed.
 *
 * Usage: npx tsx scripts/reprocess-photos.ts
 */
import { removeBackground } from "@imgly/background-removal-node";
import fs from "node:fs/promises";
import path from "node:path";

// Adjust this import to wherever your players are actually persisted
// (a JSON file, a DB client, etc.) — this assumes a JSON file for now.
const DATA_PATH = path.resolve("src/data/players.json");

async function main() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const players: Array<{ id: string; name: string; photo: string | null }> = JSON.parse(raw);

  for (const player of players) {
    if (!player.photo) {
      console.log(`Skipping ${player.name} — no photo`);
      continue;
    }
    try {
      console.log(`Processing ${player.name}...`);
      const blob = await removeBackground(player.photo, {
        model: "medium",
        output: { format: "image/png", quality: 0.92 },
      });
      const buffer = Buffer.from(await blob.arrayBuffer());
      player.photo = `data:image/png;base64,${buffer.toString("base64")}`;
      console.log(`✓ ${player.name} done`);
    } catch (err) {
      console.error(`✗ Failed on ${player.name}:`, err);
    }
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(players, null, 2));
  console.log("All done — players.json updated.");
}

main();