import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDateLong(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatKickoff(k: string) {
  if (!k) return "";
  const [h, m] = k.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

export function resizeImage(file: File, maxSize = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height >= width && height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = reject;
      img.src = String(e.target?.result ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function cropFacePortrait(file: File, maxSize = 740, frame: "face" | "full-body" = "face"): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const aspect = width / height;
        const faceCenterX = width * 0.5;
        const faceCenterY = height * 0.42;

        let cropW = width * 0.68;
        let cropH = height * 0.8;

        if (frame === "full-body") {
          cropW = width * 0.9;
          cropH = height * 0.98;
        }

        if (frame === "face" && aspect > 1.15) {
          cropW = width * 0.62;
          cropH = height * 0.86;
        } else if (frame === "face" && aspect < 0.8) {
          cropW = width * 0.8;
          cropH = height * 0.72;
        }

        const cropX = Math.min(Math.max(faceCenterX - cropW / 2, 0), Math.max(0, width - cropW));
        const cropY = frame === "full-body"
          ? Math.max(0, (height - cropH) * 0.35)
          : Math.min(Math.max(faceCenterY - cropH * 0.68, 0), Math.max(0, height - cropH));

        const outW = maxSize;
        const outH = Math.round(maxSize * 1.35);
        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("");
          return;
        }

        // Keep the generated crop transparent so the card chassis can provide the background treatment.
        ctx.clearRect(0, 0, outW, outH);
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = String(e.target?.result ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
