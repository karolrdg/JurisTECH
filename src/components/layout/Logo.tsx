import logoFull from "@/assets/juristech-logo.png.asset.json";
import logoIcon from "@/assets/juristech-icon.png.asset.json";
import { cn } from "@/lib/utils";

/** Official JURIS+TECH logo. `inverted` places it on a light tile for dark surfaces. */
export function Logo({ className, inverted, compact }: { className?: string | undefined; inverted?: boolean | undefined; compact?: boolean | undefined }) {
  if (compact) {
    return <img src={logoIcon.url} alt="JURIS+TECH" className={cn("h-9 w-auto", className)} />;
  }
  const img = <img src={logoFull.url} alt="JURIS+TECH — Gestão jurídica inteligente" className="h-auto w-full" />;
  if (inverted) {
    return <span className={cn("block rounded-xl bg-card px-3 py-2.5 shadow-soft", className)}>{img}</span>;
  }
  return <span className={cn("block w-52", className)}>{img}</span>;
}
