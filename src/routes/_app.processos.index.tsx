import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Eye, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NativeSelect } from "@/components/common/Field";
import { PageHeader } from "@/components/common/PageHeader";
import { Pager, usePaged } from "@/components/common/Pager";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { useLookups } from "@/hooks/useLookups";
import { processosHooks } from "@/hooks/useResource";
import { AREAS, PROCESSO_STATUS, type ProcessoDto } from "@/types";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/_app/processos/")({
  head: () => ({
    meta: [
      { title: "Processos — JURIS+TECH" },
      {
        name: "description",
        content:
          "Acompanhe e filtre os processos do escritório por número, cliente, área e status.",
      },
      { property: "og:title", content: "Processos — JURIS+TECH" },
      { property: "og:description", content: "Lista de processos com filtros." },
    ],
  }),
  component: ProcessosPage,
});

function ProcessosPage() {
  const q = processosHooks.useList();
  const lk = useLookups();
  const { remove } = processosHooks.useMutations();
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState<ProcessoDto | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (q.data ?? []).filter(
      (p) =>
        (!area || p.areaJuridica === area) &&
        (!status || p.status === status) &&
        (!s ||
          p.numeroProcesso.toLowerCase().includes(s) ||
          p.titulo.toLowerCase().includes(s) ||
          lk.clienteNome(p.clienteId).toLowerCase().includes(s)),
    );
  }, [q.data, search, area, status, lk]);
  const pg = usePaged(filtered);
  const hasFilters = !!search || !!area || !!status;

  return (
    <>
      <PageHeader
        title="Processos"
        description="Acompanhe o andamento administrativo dos processos."
        actions={
          <Button asChild>
            <Link to="/processos/novo">
              <Plus className="size-4" aria-hidden />
              Novo processo
            </Link>
          </Button>
        }
      />
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Número, título ou cliente"
            label="Pesquisar processos"
          />
          <NativeSelect
            aria-label="Filtrar por área"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="lg:w-44"
          >
            <option value="">Todas as áreas</option>
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="lg:w-48"
          >
            <option value="">Todos os status</option>
            {PROCESSO_STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </NativeSelect>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setArea("");
                setStatus("");
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>
        {q.isLoading ? (
          <LoadingState />
        ) : q.isError ? (
          <ErrorState message={q.error.message} onRetry={() => q.refetch()} />
        ) : filtered.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={Briefcase}
              title="Nenhum processo encontrado"
              description="Ajuste os filtros para ver outros resultados."
            />
          ) : (
            <EmptyState
              icon={Briefcase}
              title="Você ainda não possui processos cadastrados."
              action={
                <Button asChild>
                  <Link to="/processos/novo">+ Novo processo</Link>
                </Button>
              }
            />
          )
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Processo</th>
                  <th className="hidden px-4 py-2.5 font-semibold md:table-cell">Cliente</th>
                  <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">Área</th>
                  <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Status</th>
                  <th className="hidden px-4 py-2.5 font-semibold xl:table-cell">Abertura</th>
                  <th className="px-4 py-2.5">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pg.slice.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link
                        to="/processos/$id"
                        params={{ id: p.id }}
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {p.titulo}
                      </Link>
                      <p className="font-mono text-xs text-muted-foreground">{p.numeroProcesso}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {lk.clienteNome(p.clienteId)}
                      </p>
                      <div className="mt-1 sm:hidden">
                        <StatusBadge status={p.status} />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {lk.clienteNome(p.clienteId)}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">{p.areaJuridica}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                      {formatDate(p.dataAbertura)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={`Ver ${p.titulo}`}>
                          <Link to="/processos/$id" params={{ id: p.id }}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir ${p.titulo}`}
                          onClick={() => setToDelete(p)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pager {...pg} />
          </>
        )}
      </div>
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        loading={remove.isPending}
        onConfirm={() =>
          toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  );
}
