import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, CalendarClock, CheckSquare, History, Users, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { PriorityBadge, StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { prazosHooks, processosHooks, useDashboard } from "@/hooks/useResource";
import { useLookups } from "@/hooks/useLookups";
import { daysUntil, formatDate, getPrazoStatus } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — JURIS+TECH" },
      { name: "description", content: "Indicadores do escritório: processos ativos, clientes, prazos e tarefas." },
      { property: "og:title", content: "Dashboard — JURIS+TECH" },
      { property: "og:description", content: "Visão geral do escritório em um só painel." },
    ],
  }),
  component: Dashboard,
});

function StatCard({ label, value, icon: Icon, hint, to }: { label: string; value?: number; icon: LucideIcon; hint: string; to: string }) {
  return (
    <Link to={to} className="surface group block p-5 transition-shadow hover:shadow-lift">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value ?? "—"}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
        {hint} <ArrowRight className="size-3" aria-hidden />
      </p>
    </Link>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const dash = useDashboard();
  const prazos = prazosHooks.useList();
  const processos = processosHooks.useList();
  const lk = useLookups();

  if (dash.isLoading) return <LoadingState />;
  if (dash.isError) return <ErrorState message={dash.error.message} onRetry={() => dash.refetch()} />;
  const d = dash.data;

  const proximos = (prazos.data ?? [])
    .map((p) => ({ ...p, status: getPrazoStatus(p) }))
    .filter((p) => p.status !== "Concluído")
    .sort((a, b) => a.dataLimite.localeCompare(b.dataLimite))
    .slice(0, 5);
  const recentes = [...(processos.data ?? [])].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm)).slice(0, 5);

  return (
    <>
      <PageHeader title={`Olá, ${user?.nome.split(" ").slice(0, 2).join(" ")}`} description="Aqui está o resumo do seu escritório hoje." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Processos ativos" value={d?.processosAtivos} icon={Briefcase} hint="Ver processos" to="/processos" />
        <StatCard label="Clientes ativos" value={d?.clientesAtivos} icon={Users} hint="Ver clientes" to="/clientes" />
        <StatCard label="Prazos próximos (7 dias)" value={d?.prazosProximos} icon={CalendarClock} hint="Ver prazos" to="/prazos" />
        <StatCard label="Tarefas pendentes" value={d?.tarefasPendentes} icon={CheckSquare} hint="Ver tarefas" to="/tarefas" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="surface overflow-hidden xl:col-span-2" aria-labelledby="h-prazos">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 id="h-prazos" className="text-base font-bold">Próximos prazos</h2>
            <Link to="/prazos" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
          </div>
          {proximos.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nenhum prazo pendente" />
          ) : (
            <ul className="divide-y">
              {proximos.map((p) => {
                const n = daysUntil(p.dataLimite);
                return (
                  <li key={p.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.titulo}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {lk.processo(p.processoId)?.numeroProcesso} · {lk.clienteDoProcesso(p.processoId)}
                        {p.descricao ? ` · ${p.descricao}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatDate(p.dataLimite)} · {n === 0 ? "hoje" : n < 0 ? `${-n}d atrás` : `em ${n}d`}
                      </span>
                      <PriorityBadge prioridade={p.prioridade} />
                      <StatusBadge status={p.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="surface overflow-hidden" aria-labelledby="h-ativ">
          <div className="border-b px-5 py-4">
            <h2 id="h-ativ" className="text-base font-bold">Atividades recentes</h2>
          </div>
          {d?.atividades.length ? (
            <ol className="space-y-4 px-5 py-4">
              {d.atividades.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <History className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm leading-snug">{a.descricao}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{new Date(a.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState icon={History} title="Sem atividades ainda" />
          )}
        </section>
      </div>

      <section className="surface mt-6 overflow-hidden" aria-labelledby="h-proc">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 id="h-proc" className="text-base font-bold">Processos recentes</h2>
          <Link to="/processos" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-2.5 font-semibold">Processo</th>
              <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Cliente</th>
              <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Área</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="hidden px-5 py-2.5 font-semibold lg:table-cell">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentes.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <td className="px-5 py-3">
                  <Link to="/processos/$id" params={{ id: p.id }} className="font-semibold hover:text-primary hover:underline">{p.titulo}</Link>
                  <p className="font-mono text-xs text-muted-foreground">{p.numeroProcesso}</p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{lk.clienteNome(p.clienteId)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">{p.areaJuridica}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{formatDate(p.atualizadoEm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
