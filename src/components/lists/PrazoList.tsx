import { Pencil, Trash2 } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PrazoDto } from "@/types";
import { daysUntil, formatDate, getPrazoStatus } from "@/utils/format";

export function PrazoList({
  prazos,
  subtitle,
  onEdit,
  onDelete,
}: {
  prazos: PrazoDto[];
  subtitle?: (p: PrazoDto) => string | undefined;
  onEdit: (p: PrazoDto) => void;
  onDelete: (p: PrazoDto) => void;
}) {
  return (
    <ul className="divide-y">
      {prazos.map((p) => {
        const st = getPrazoStatus(p);
        const n = daysUntil(p.dataLimite);
        const late = st === "Atrasado";
        return (
          <li key={p.id} className={cn("flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center", late && "border-l-4 border-l-destructive bg-destructive/5")}>
            <div className="min-w-0 flex-1">
              <p className={cn("font-semibold", st === "Concluído" && "text-muted-foreground line-through")}>{p.titulo}</p>
              {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle(p)}</p>}
              <p className={cn("mt-1 text-xs", late ? "font-semibold text-destructive" : "text-muted-foreground")}>
                Data limite: {formatDate(p.dataLimite)}
                {st !== "Concluído" && (n === 0 ? " · vence hoje" : n < 0 ? ` · atrasado há ${-n} dia(s)` : ` · em ${n} dia(s)`)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge prioridade={p.prioridade} />
              <StatusBadge status={st} />
              <Button variant="ghost" size="icon" aria-label={`Editar ${p.titulo}`} onClick={() => onEdit(p)}><Pencil className="size-4" /></Button>
              <Button variant="ghost" size="icon" aria-label={`Excluir ${p.titulo}`} onClick={() => onDelete(p)}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
