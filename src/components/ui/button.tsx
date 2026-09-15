import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "line" | "danger" | "soft";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        size === "sm" && "h-8 px-2.5 text-xs rounded-[8px]",
        size === "md" && "h-10 px-3.5 text-sm rounded-[10px]",
        size === "lg" && "h-11 px-4 text-sm rounded-[12px]",
        variant === "primary" && "bg-accent text-accent-fg hover:bg-accent/90",
        variant === "ghost" && "bg-transparent text-muted hover:text-fg hover:bg-elevated",
        variant === "line" && "bg-transparent text-fg border border-line hover:border-accent/60",
        variant === "danger" && "bg-warn/15 text-warn hover:bg-warn/25",
        variant === "soft" && "bg-elevated text-fg hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}