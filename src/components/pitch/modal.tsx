import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button className="absolute inset-0 bg-black/70" aria-label="Close" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full overflow-hidden rounded-t-[18px] border border-line bg-surface shadow-2xl sm:rounded-[18px]",
          wide ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        {children}
      </div>
    </div>
  );
}