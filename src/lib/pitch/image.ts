/**
 * Downscale + re-encode an image file (or existing data URL) to a small JPEG
 * data URL before it ever lands in the store. Run this at the point of
 * upload (player photo, coach photo, trophy photo) rather than trying to
 * shrink things after the fact — a raw phone photo can be 4-8MB, and the
 * whole desk gets POSTed to /api/desk in one request capped at 4.5MB by
 * Vercel, so a couple of uncompressed photos alone can blow the limit.
 *
 * IMPORTANT: earlier this only resized dimensions and set a fixed JPEG
 * quality — it never checked how big the result actually came out. Two
 * photos compressed with identical settings can land at very different byte
 * sizes depending on the image itself (a busy, high-detail photo compresses
 * worse than a plain one at the same quality). With ~14 players plus
 * coaches all going into one /desk save, that inconsistency was enough to
 * push the whole request over Vercel's limit even though each individual
 * photo "looked" compressed. This now actually enforces a byte ceiling: it
 * steps quality down first, and if that's not enough, shrinks the
 * dimensions further and tries again, until the result is genuinely small
 * or it hits a sane floor.
 */
export function compressImageToDataUrl(
  source: File | string,
  {
    maxDim = 640,
    quality = 0.82,
    maxBytes = 220_000,
  }: { maxDim?: number; quality?: number; maxBytes?: number } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const result = encodeUnderBudget(img, maxDim, quality, maxBytes);
        resolve(result);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to compress image"));
      } finally {
        if (typeof source !== "string") URL.revokeObjectURL(img.src);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = typeof source === "string" ? source : URL.createObjectURL(source);
  });
}

/**
 * Draw `img` at `startDim`, encode as JPEG starting at `startQuality`, and
 * keep re-encoding at lower quality / smaller dimensions until the output is
 * under `maxBytes`. Quality is tried first (cheap — no redraw needed);
 * dimensions are only reduced if quality alone can't get there. Bottoms out
 * at a 240px / 0.35-quality floor so this can never spin forever or produce
 * a useless 1x1 image — whatever that floor produces is returned even if it
 * is still slightly over budget, since that's the smallest sane image left.
 */
function encodeUnderBudget(img: HTMLImageElement, startDim: number, startQuality: number, maxBytes: number): string {
  const QUALITY_STEPS = [startQuality, 0.7, 0.55, 0.4, 0.3];
  const MIN_DIM = 240;

  let dim = startDim;
  let lastResult = "";

  while (true) {
    const scale = Math.min(1, dim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(img, 0, 0, w, h);

    for (const q of QUALITY_STEPS) {
      const dataUrl = canvas.toDataURL("image/jpeg", q);
      lastResult = dataUrl;
      if (dataUrlBytes(dataUrl) <= maxBytes) return dataUrl;
    }

    // Every quality step at this size was still too big — shrink further.
    if (dim <= MIN_DIM) return lastResult; // hit the floor, return the smallest we managed
    dim = Math.max(MIN_DIM, Math.round(dim * 0.75));
  }
}

/** Rough byte size of a base64 data URL — used above to enforce the size budget, and available for a "too big" warning before upload. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.floor((base64.length * 3) / 4);
}