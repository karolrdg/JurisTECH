import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { NativeSelect } from "@/components/common/Field";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { TarefaDialog } from "@/components/forms/TarefaDialog";
import { TarefaList } from "@/components/lists/TarefaList";
import { Button } from "@/components/ui/button";
import { useLookups } from "@/hooks/useLookups";
import { tarefasHooks } from "@/hooks/useResource";
import { TAREFA_STATUS, type TarefaDto } from "@/types";

export const Route = createFileRoute("/_app/tarefas")({
  head: () => ({
    meta: [
      { title: "Tarefas — JURIS+TECH" },
      {
        name: "description",
        content: "Crie, acompanhe e conclua as tarefas internas do escritório.",
      },
      { property: "og:title", content: "Tarefas — JURIS+TECH" },
      { property: "og:description", content: "Gestão de tarefas por processo e responsável." },
    ],
  }),
  component: TarefasPage,
});

function TarefasPage() {
  const q = tarefasHooks.useList();
  const lk = useLookups();
  const { update, remove } = tarefasHooks.useMutations();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState<TarefaDto | null | undefined>(undefined);
  const [toDelete, setToDelete] = useState<TarefaDto | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return (q.data ?? [])
      .filter(
        (t) =>
          (!status || t.status === status) &&
          (!s || t.titulo.toLowerCase().includes(s) || t.responsavel.toLowerCase().includes(s)),
      )
      .sort(
        (a, b) =>
          Number(a.status === "Concluída") - Number(b.status === "Concluída") ||
          a.prazo.localeCompare(b.prazo),
      );
  }, [q.data, search, status]);

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="Organize as atividades internas da equipe."
        actions={
          <Button onClick={() => setEdit(null)}>
            <Plus className="size-4" aria-hidden />
            Nova tarefa
          </Button>
        }
      />
      <div className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Título ou responsável"
            label="Pesquisar tarefas"
          />
          <NativeSelect
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="sm:w-44"
          >
            <option value="">Todos os status</option>
            {TAREFA_STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </NativeSelect>
          {(search || status) && (
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
          <EmptyState
            icon={CheckSquare}
            title="Nenhuma tarefa encontrada"
            action={<Button onClick={() => setEdit(null)}>+ Nova tarefa</Button>}
          />
        ) : (
          <TarefaList
            tarefas={filtered}
            subtitle={(t) =>
              `${lk.processo(t.processoId)?.titulo ?? ""} · ${lk.clienteDoProcesso(t.processoId)}`
            }
            onEdit={setEdit}
            onDelete={setToDelete}
            onComplete={(t) => update.mutate({ id: t.id, input: { ...t, status: "Concluída" } })}
          />
        )}
      </div>
      <TarefaDialog
        open={edit !== undefined}
        onOpenChange={(o) => !o && setEdit(undefined)}
        initial={edit}
        processos={lk.processos}
      />
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
