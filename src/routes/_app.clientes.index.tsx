import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NativeSelect } from "@/components/common/Field";
import { PageHeader } from "@/components/common/PageHeader";
import { Pager, usePaged } from "@/components/common/Pager";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/Badges";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { clientesHooks } from "@/hooks/useResource";
import type { ClienteDto } from "@/types";
import { formatDate, onlyDigits } from "@/utils/format";

export const Route = createFileRoute("/_app/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — JURIS+TECH" },
      { name: "description", content: "Cadastre, pesquise e gerencie os clientes do escritório." },
      { property: "og:title", content: "Clientes — JURIS+TECH" },
      {
        property: "og:description",
        content: "Lista de clientes com busca por nome, CPF e e-mail.",
      },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  const q = clientesHooks.useList();
  const { remove } = clientesHooks.useMutations();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState<ClienteDto | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const sd = onlyDigits(s);
    return (q.data ?? []).filter(
      (c) =>
        (!status || c.status === status) &&
        (!s ||
          c.nomeCompleto.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          (sd && onlyDigits(c.cpf).includes(sd))),
    );
  }, [q.data, search, status]);
  const pg = usePaged(filtered);
  const hasFilters = !!search || !!status;

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes do escritório."
        actions={
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="size-4" aria-hidden />
              Novo cliente
            </Link>
          </Button>
        }
      />
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Nome, CPF ou e-mail"
            label="Pesquisar clientes"
          />
          <NativeSelect
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="sm:w-40"
          >
            <option value="">Todos os status</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </NativeSelect>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
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
              icon={Users}
              title="Nenhum cliente encontrado"
              description="Tente ajustar a pesquisa ou limpar os filtros."
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Você ainda não possui clientes cadastrados."
              action={
                <Button asChild>
                  <Link to="/clientes/novo">+ Novo cliente</Link>
                </Button>
              }
            />
          )
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Nome</th>
                  <th className="hidden px-4 py-2.5 font-semibold md:table-cell">CPF</th>
                  <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">Telefone</th>
                  <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Status</th>
                  <th className="hidden px-4 py-2.5 font-semibold xl:table-cell">Cadastro</th>
                  <th className="px-4 py-2.5 text-right font-semibold">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pg.slice.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link
                        to="/clientes/$id"
                        params={{ id: c.id }}
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {c.nomeCompleto}
                      </Link>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                      <div className="mt-1 sm:hidden">
                        <StatusBadge status={c.status} />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs md:table-cell">{c.cpf}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">{c.telefone}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">
                      {formatDate(c.dataCadastro)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          aria-label={`Ver ${c.nomeCompleto}`}
                        >
                          <Link to="/clientes/$id" params={{ id: c.id }}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          aria-label={`Editar ${c.nomeCompleto}`}
                        >
                          <Link to="/clientes/$id" params={{ id: c.id }} search={{ editar: true }}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir ${c.nomeCompleto}`}
                          onClick={() => setToDelete(c)}
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
        title="Tem certeza que deseja excluir este cliente?"
        description={
          toDelete
            ? `${toDelete.nomeCompleto} será removido. Esta ação não poderá ser desfeita.`
            : undefined
        }
        loading={remove.isPending}
        onConfirm={() =>
          toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }
      />
    </>
  );
}
