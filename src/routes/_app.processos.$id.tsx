import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarClock, CheckSquare, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { PrazoDialog } from "@/components/forms/PrazoDialog";
import { ProcessoFormView } from "@/components/forms/ProcessoFormFields";
import { TarefaDialog } from "@/components/forms/TarefaDialog";
import { PrazoList } from "@/components/lists/PrazoList";
import { TarefaList } from "@/components/lists/TarefaList";
import { Button } from "@/components/ui/button";
import { useLookups } from "@/hooks/useLookups";
import { prazosHooks, processosHooks, tarefasHooks } from "@/hooks/useResource";
import type { PrazoDto, TarefaDto } from "@/types";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/_app/processos/$id")({
  validateSearch: z.object({ editar: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Detalhes do processo — JURIS+TECH" },
      { name: "description", content: "Dados do processo, prazos e tarefas vinculadas." },
      { property: "og:title", content: "Detalhes do processo — JURIS+TECH" },
      { property: "og:description", content: "Ficha completa do processo." },
    ],
  }),
  component: ProcessoDetalhe,
});

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-sm">{value || "—"}</dd>
    </div>
  );
}

type Del = { kind: "processo" } | { kind: "prazo"; item: PrazoDto } | { kind: "tarefa"; item: TarefaDto };

function ProcessoDetalhe() {
  const { id } = Route.useParams();
  const { editar } = Route.useSearch();
  const navigate = useNavigate();
  const q = processosHooks.useOne(id);
  const lk = useLookups();
  const prazos = prazosHooks.useList();
  const tarefas = tarefasHooks.useList();
  const pm = processosHooks.useMutations();
  const prm = prazosHooks.useMutations();
  const tm = tarefasHooks.useMutations();
  const [prazoEdit, setPrazoEdit] = useState<PrazoDto | null | undefined>(undefined);
  const [tarefaEdit, setTarefaEdit] = useState<TarefaDto | null | undefined>(undefined);
  const [del, setDel] = useState<Del | null>(null);
  const setEditing = (v: boolean) => navigate({ to: "/processos/$id", params: { id }, search: v ? { editar: true } : {} });

  if (q.isLoading) return <LoadingState />;
  if (q.isError || !q.data) return <ErrorState message={q.error?.message} onRetry={() => q.refetch()} />;
  const p = q.data;
  const crumbs = [{ label: "Processos", to: "/processos" }, { label: p.numeroProcesso }];
  const meusPrazos = (prazos.data ?? []).filter((x) => x.processoId === id).sort((a, b) => a.dataLimite.localeCompare(b.dataLimite));
  const minhasTarefas = (tarefas.data ?? []).filter((x) => x.processoId === id);

  if (editar) {
    return (
      <>
        <PageHeader title="Editar processo" breadcrumbs={crumbs} />
        <ProcessoFormView initial={p} clientes={lk.clientes} submitting={pm.update.isPending} onCancel={() => setEditing(false)} onSubmit={(v) => pm.update.mutate({ id, input: v }, { onSuccess: () => setEditing(false) })} />
      </>
    );
  }

  const confirmDelete = () => {
    if (!del) return;
    if (del.kind === "processo") pm.remove.mutate(id, { onSuccess: () => navigate({ to: "/processos" }) });
    if (del.kind === "prazo") prm.remove.mutate(del.item.id, { onSuccess: () => setDel(null) });
    if (del.kind === "tarefa") tm.remove.mutate(del.item.id, { onSuccess: () => setDel(null) });
  };

  return (
    <>
      <PageHeader
        title={p.titulo}
        description={p.numeroProcesso}
        breadcrumbs={crumbs}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="size-4" aria-hidden />Editar</Button>
            <Button variant="outline" className="text-destructive" onClick={() => setDel({ kind: "processo" })}><Trash2 className="size-4" aria-hidden />Excluir</Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface p-6" aria-label="Dados do processo">
          <div className="mb-5"><StatusBadge status={p.status} /></div>
          <dl className="grid gap-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</dt>
              <dd className="mt-1 text-sm">
                <Link to="/clientes/$id" params={{ id: p.clienteId }} className="font-semibold text-primary hover:underline">{lk.clienteNome(p.clienteId)}</Link>
              </dd>
            </div>
            <Info label="Área" value={p.areaJuridica} />
            <Info label="Abertura" value={formatDate(p.dataAbertura)} />
            <Info label="Encerramento" value={formatDate(p.dataEncerramento)} />
            <Info label="Descrição" value={p.descricao} />
            <Info label="Observações" value={p.observacoes} />
          </dl>
        </section>
        <div className="space-y-6 lg:col-span-2">
          <section className="surface overflow-hidden" aria-labelledby="h-prazos">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="h-prazos" className="text-base font-bold">Prazos ({meusPrazos.length})</h2>
              <Button size="sm" variant="outline" onClick={() => setPrazoEdit(null)}><Plus className="size-4" aria-hidden />Prazo</Button>
            </div>
            {meusPrazos.length === 0 ? (
              <EmptyState icon={CalendarClock} title="Nenhum prazo para este processo." />
            ) : (
              <PrazoList prazos={meusPrazos} onEdit={setPrazoEdit} onDelete={(item) => setDel({ kind: "prazo", item })} />
            )}
          </section>
          <section className="surface overflow-hidden" aria-labelledby="h-tarefas">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 id="h-tarefas" className="text-base font-bold">Tarefas ({minhasTarefas.length})</h2>
              <Button size="sm" variant="outline" onClick={() => setTarefaEdit(null)}><Plus className="size-4" aria-hidden />Tarefa</Button>
            </div>
            {minhasTarefas.length === 0 ? (
              <EmptyState icon={CheckSquare} title="Nenhuma tarefa para este processo." />
            ) : (
              <TarefaList
                tarefas={minhasTarefas}
                onEdit={setTarefaEdit}
                onDelete={(item) => setDel({ kind: "tarefa", item })}
                onComplete={(t) => tm.update.mutate({ id: t.id, input: { ...t, status: "Concluída" } })}
              />
            )}
          </section>
        </div>
      </div>
      <PrazoDialog open={prazoEdit !== undefined} onOpenChange={(o) => !o && setPrazoEdit(undefined)} initial={prazoEdit} processos={lk.processos} defaultProcessoId={id} />
      <TarefaDialog open={tarefaEdit !== undefined} onOpenChange={(o) => !o && setTarefaEdit(undefined)} initial={tarefaEdit} processos={lk.processos} defaultProcessoId={id} />
      <ConfirmDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        title={del?.kind === "processo" ? "Tem certeza que deseja excluir este processo?" : undefined}
        loading={pm.remove.isPending || prm.remove.isPending || tm.remove.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
