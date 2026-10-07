import { CheckCircle2, Pencil, Trash2, User } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TarefaDto } from "@/types";
import { formatDate } from "@/utils/format";

export function TarefaList({
  tarefas,
  subtitle,
  onEdit,
  onDelete,
  onComplete,
}: {
  tarefas: TarefaDto[];
  subtitle?: (t: TarefaDto) => string;
  onEdit: (t: TarefaDto) => void;
  onDelete: (t: TarefaDto) => void;
  onComplete: (t: TarefaDto) => void;
}) {
  return (
    <ul className="divide-y">
      {tarefas.map((t) => {
        const done = t.status === "Concluída";
        return (
          <li key={t.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className={cn("font-semibold", done && "text-muted-foreground line-through")}>{t.titulo}</p>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle(t)}</p>}
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <User className="size-3" aria-hidden /> {t.responsavel} · prazo {formatDate(t.prazo)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge prioridade={t.prioridade} />
              <StatusBadge status={t.status} />
              {!done && (
                <Button variant="outline" size="sm" onClick={() => onComplete(t)}>
                  <CheckCircle2 className="size-4 text-success" aria-hidden />Concluir
                </Button>
              )}
              <Button variant="ghost" size="icon" aria-label={`Editar ${t.titulo}`} onClick={() => onEdit(t)}><Pencil className="size-4" /></Button>
              <Button variant="ghost" size="icon" aria-label={`Excluir ${t.titulo}`} onClick={() => onDelete(t)}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
