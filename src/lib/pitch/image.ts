/**
 * Downscale + re-encode an image file (or existing data URL) to a small JPEG
 * data URL before it ever lands in the store. Run this at the point of
 * upload (player photo, coach photo, trophy photo) rather than trying to
 * shrink things after the fact — a raw phone photo can be 4-8MB, and the
 * whole desk gets POSTed to /api/desk in one request capped at 4.5MB by
 * Vercel, so a couple of uncompressed photos alone can blow the limit.
 */
export function compressImageToDataUrl(
  source: File | string,
  { maxDim = 640, quality = 0.82 }: { maxDim?: number; quality?: number } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
      if (typeof source !== "string") URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = typeof source === "string" ? source : URL.createObjectURL(source);
  });
}

/** Rough byte size of a base64 data URL — useful for a "too big" warning before upload. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.floor((base64.length * 3) / 4);
}