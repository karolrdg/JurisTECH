import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { ClienteFormView } from "@/components/forms/ClienteFormFields";
import { Button } from "@/components/ui/button";
import { clientesHooks, processosHooks } from "@/hooks/useResource";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/_app/clientes/$id")({
  validateSearch: z.object({ editar: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Detalhes do cliente — JURIS+TECH" },
      { name: "description", content: "Dados cadastrais e processos do cliente." },
      { property: "og:title", content: "Detalhes do cliente — JURIS+TECH" },
      { property: "og:description", content: "Ficha do cliente com processos vinculados." },
    ],
  }),
  component: ClienteDetalhe,
});

function Info({ label, value }: { label: string; value?: string | undefined }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value || "—"}</dd>
    </div>
  );
}

function ClienteDetalhe() {
  const { id } = Route.useParams();
  const { editar } = Route.useSearch();
  const navigate = useNavigate();
  const q = clientesHooks.useOne(id);
  const processos = processosHooks.useList();
  const { update, remove } = clientesHooks.useMutations();
  const [confirm, setConfirm] = useState(false);
  const setEditing = (v: boolean) => navigate({ to: "/clientes/$id", params: { id }, search: v ? { editar: true } : {} });

  if (q.isLoading) return <LoadingState />;
  if (q.isError || !q.data) return <ErrorState message={q.error?.message} onRetry={() => q.refetch()} />;
  const c = q.data;
  const seus = (processos.data ?? []).filter((p) => p.clienteId === c.id);
  const crumbs = [{ label: "Clientes", to: "/clientes" }, { label: c.nomeCompleto }];

  if (editar) {
    return (
      <>
        <PageHeader title="Editar cliente" breadcrumbs={crumbs} />
        <ClienteFormView initial={c} submitting={update.isPending} onCancel={() => setEditing(false)} onSubmit={(v) => update.mutate({ id, input: v }, { onSuccess: () => setEditing(false) })} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={c.nomeCompleto}
        breadcrumbs={crumbs}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="size-4" aria-hidden />Editar</Button>
            <Button variant="outline" onClick={() => setConfirm(true)} className="text-destructive"><Trash2 className="size-4" aria-hidden />Excluir</Button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="surface p-6" aria-label="Dados do cliente">
          <div className="mb-5"><StatusBadge status={c.status} /></div>
          <dl className="grid gap-4">
            <Info label="CPF" value={c.cpf} />
            <Info label="E-mail" value={c.email} />
            <Info label="Telefone" value={c.telefone} />
            <Info label="Cliente desde" value={formatDate(c.dataCadastro)} />
            <Info label="Observações" value={c.observacoes} />
          </dl>
        </section>
        <section className="surface overflow-hidden lg:col-span-2" aria-labelledby="h-proc">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="h-proc" className="text-base font-bold">Processos ({seus.length})</h2>
            <Button asChild size="sm" variant="outline"><Link to="/processos/novo">+ Novo processo</Link></Button>
          </div>
          {seus.length === 0 ? (
            <EmptyState icon={Briefcase} title="Este cliente ainda não possui processos." />
          ) : (
            <ul className="divide-y">
              {seus.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link to="/processos/$id" params={{ id: p.id }} className="font-semibold hover:text-primary hover:underline">{p.titulo}</Link>
                    <p className="font-mono text-xs text-muted-foreground">{p.numeroProcesso} · {p.areaJuridica}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Tem certeza que deseja excluir este cliente?"
        loading={remove.isPending}
        onConfirm={() => remove.mutate(id, { onSuccess: () => navigate({ to: "/clientes" }) })}
      />
    </>
  );
}
