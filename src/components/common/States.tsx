import type { LucideIcon } from "lucide-react";
import { AlertTriangle, FolderOpen, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Carregando..." }: { label?: string | undefined }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string | undefined; onRetry?: () => void | undefined }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <p className="font-semibold">Não foi possível carregar os dados</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message ?? "Tente novamente em instantes."}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}: {
  icon?: LucideIcon | undefined;
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="size-7" aria-hidden />
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
