import { removeBackground } from "@imgly/background-removal";

/**
 * Takes a raw player photo (File, Blob, or image URL) and returns a
 * data URL of the same photo with its background made transparent.
 * Runs entirely client-side (WASM) — no API key, no server round trip.
 *
 * Call this once, at the point a coach uploads/sets a player's photo,
 * and store the RESULT as player.photo — not the original file. That
 * way every card render downstream (PlayerCard, MiniPlayerCard, etc.)
 * just uses a normal photo URL and needs no changes.
 */
export async function stripPhotoBackground(
  input: File | Blob | string,
): Promise<string> {
  const resultBlob = await removeBackground(input, {
    // Balances quality vs speed; "medium" is a good default for headshots.
    model: "medium",
    output: { format: "image/png", quality: 0.92 },
  });

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read processed image"));
    reader.readAsDataURL(resultBlob);
  });
}

/**
 * Optional: show a progress callback (0–1) while the model downloads
 * and runs, for a loading spinner during upload.
 */
export async function stripPhotoBackgroundWithProgress(
  input: File | Blob | string,
  onProgress?: (fraction: number) => void,
): Promise<string> {
  const resultBlob = await removeBackground(input, {
    model: "medium",
    output: { format: "image/png", quality: 0.92 },
    progress: (_key, current, total) => {
      if (onProgress && total > 0) onProgress(current / total);
    },
  });

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read processed image"));
    reader.readAsDataURL(resultBlob);
  });
}