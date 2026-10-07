import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverted,
}: {
  className?: string | undefined;
  inverted?: boolean | undefined;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="brand-gradient grid size-9 place-items-center rounded-xl text-primary-foreground shadow-lift">
        <Scale className="size-5" aria-hidden />
      </span>
      <span
        className={cn(
          "font-display text-lg font-extrabold tracking-tight",
          inverted ? "text-sidebar-accent-foreground" : "text-foreground",
        )}
      >
        JURIS<span className={inverted ? "text-sidebar-primary" : "text-brand-teal"}>+</span>TECH
      </span>
    </span>
  );
}
