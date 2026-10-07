import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NativeSelect } from "@/components/common/Field";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { PrazoDialog } from "@/components/forms/PrazoDialog";
import { PrazoList } from "@/components/lists/PrazoList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLookups } from "@/hooks/useLookups";
import { prazosHooks } from "@/hooks/useResource";
import { PRIORIDADES, type PrazoDto } from "@/types";
import { daysUntil, getPrazoStatus } from "@/utils/format";

export const Route = createFileRoute("/_app/prazos")({
  head: () => ({
    meta: [
      { title: "Prazos — JURIS+TECH" },
      { name: "description", content: "Acompanhe prazos do escritório com destaque para atrasados." },
      { property: "og:title", content: "Prazos — JURIS+TECH" },
      { property: "og:description", content: "Prazos de hoje, próximos 7 dias, atrasados e concluídos." },
    ],
  }),
  component: PrazosPage,
});

const PERIODOS = ["Todos", "Hoje", "Próximos 7 dias", "Atrasados", "Concluídos"] as const;
type Periodo = (typeof PERIODOS)[number];

function matchPeriodo(p: PrazoDto, f: Periodo) {
  const st = getPrazoStatus(p);
  const n = daysUntil(p.dataLimite);
  switch (f) {
    case "Hoje": return st !== "Concluído" && n === 0;
    case "Próximos 7 dias": return st === "Pendente" && n >= 0 && n <= 7;
    case "Atrasados": return st === "Atrasado";
    case "Concluídos": return st === "Concluído";
    default: return true;
  }
}

function PrazosPage() {
  const q = prazosHooks.useList();
  const lk = useLookups();
  const { remove } = prazosHooks.useMutations();
  const [periodo, setPeriodo] = useState<Periodo>("Todos");
  const [prioridade, setPrioridade] = useState("");
  const [edit, setEdit] = useState<PrazoDto | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<PrazoDto | null>(null);

  const filtered = useMemo(
    () => (q.data ?? []).filter((p) => matchPeriodo(p, periodo) && (!prioridade || p.prioridade === prioridade)).sort((a, b) => a.dataLimite.localeCompare(b.dataLimite)),
    [q.data, periodo, prioridade],
  );
  const atrasados = (q.data ?? []).filter((p) => getPrazoStatus(p) === "Atrasado").length;

  return (
    <>
      <PageHeader
        title="Prazos"
        description={atrasados ? `Atenção: ${atrasados} prazo(s) atrasado(s).` : "Nenhum prazo atrasado. Tudo em dia."}
        actions={<Button onClick={() => setEdit(null)}><Plus className="size-4" aria-hidden />Novo prazo</Button>}
      />
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
          <div role="group" aria-label="Filtrar por período" className="flex flex-wrap gap-1.5">
            {PERIODOS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={periodo === f}
                onClick={() => setPeriodo(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  periodo === f ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <NativeSelect aria-label="Filtrar por prioridade" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} className="md:ml-auto md:w-44">
            <option value="">Todas as prioridades</option>
            {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
          </NativeSelect>
          {(periodo !== "Todos" || prioridade) && <Button variant="ghost" size="sm" onClick={() => { setPeriodo("Todos"); setPrioridade(""); }}>Limpar filtros</Button>}
        </div>
        {q.isLoading ? (
          <LoadingState />
        ) : q.isError ? (
          <ErrorState message={q.error.message} onRetry={() => q.refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nenhum prazo encontrado" description="Não há prazos para os filtros selecionados." />
        ) : (
          <PrazoList
            prazos={filtered}
            subtitle={(p) => `${lk.processo(p.processoId)?.numeroProcesso ?? ""} · ${lk.clienteDoProcesso(p.processoId)}`}
            onEdit={setEdit}
            onDelete={setToDelete}
          />
        )}
      </div>
      <PrazoDialog open={edit !== undefined} onOpenChange={(o) => !o && setEdit(undefined)} initial={edit} processos={lk.processos} />
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} loading={remove.isPending} onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })} />
    </>
  );
}
