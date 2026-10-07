import { AlertOctagon, ArrowDown, ArrowUp, CheckCircle2, Circle, Clock, Minus, PauseCircle, Sparkles, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prioridade } from "@/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "teal";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-secondary text-secondary-foreground border-primary/15",
  success: "bg-success/10 text-success border-success/25",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
  teal: "bg-accent text-accent-foreground border-brand-teal/25",
};

export function Pill({ tone, icon: Icon, children }: { tone: Tone; icon?: LucideIcon; children: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold", toneClass[tone])}>
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  );
}

const statusMap: Record<string, { tone: Tone; icon: LucideIcon }> = {
  Ativo: { tone: "success", icon: CheckCircle2 },
  Inativo: { tone: "neutral", icon: XCircle },
  Novo: { tone: "teal", icon: Sparkles },
  "Em andamento": { tone: "info", icon: Clock },
  "Aguardando decisão": { tone: "warning", icon: Clock },
  Suspenso: { tone: "neutral", icon: PauseCircle },
  Encerrado: { tone: "neutral", icon: CheckCircle2 },
  Pendente: { tone: "info", icon: Circle },
  Concluído: { tone: "success", icon: CheckCircle2 },
  Concluída: { tone: "success", icon: CheckCircle2 },
  Atrasado: { tone: "danger", icon: AlertOctagon },
};

export function StatusBadge({ status }: { status: string }) {
  const m = statusMap[status] ?? { tone: "neutral" as Tone, icon: Circle };
  return (
    <Pill tone={m.tone} icon={m.icon}>
      {status}
    </Pill>
  );
}

const prioMap: Record<Prioridade, { tone: Tone; icon: LucideIcon }> = {
  Baixa: { tone: "neutral", icon: ArrowDown },
  Média: { tone: "info", icon: Minus },
  Alta: { tone: "warning", icon: ArrowUp },
  Urgente: { tone: "danger", icon: AlertOctagon },
};

export function PriorityBadge({ prioridade }: { prioridade: Prioridade }) {
  const m = prioMap[prioridade];
  return (
    <Pill tone={m.tone} icon={m.icon}>
      {prioridade}
    </Pill>
  );
}
