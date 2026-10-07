import logoIcon from "@/assets/juristech-icon.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Logo oficial JURIS+TECH.
 */
export function Logo({
  className,
  inverted,
  compact,
}: {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <img
        src={logoIcon.url}
        alt="JURIS+TECH"
        className={cn("h-9 w-auto", className)}
      />
    );
  }

  const img = (
    <img
      src="/logo.png"
      alt="JURIS+TECH — Gestão jurídica inteligente"
      className="h-auto w-full"
    />
  );

  if (inverted) {
    return (
      <span
        className={cn(
          "block rounded-xl bg-card px-3 py-2.5 shadow-soft",
          className,
        )}
      >
        {img}
      </span>
    );
  }

  return (
    <span className={cn("block w-52", className)}>
      {img}
    </span>
  );
}