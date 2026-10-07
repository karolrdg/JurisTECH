import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/States";
import { ProcessoFormView } from "@/components/forms/ProcessoFormFields";
import { clientesHooks, processosHooks } from "@/hooks/useResource";

export const Route = createFileRoute("/_app/processos/novo")({
  head: () => ({
    meta: [
      { title: "Novo processo — JURIS+TECH" },
      { name: "description", content: "Cadastre um novo processo vinculado a um cliente." },
      { property: "og:title", content: "Novo processo — JURIS+TECH" },
      { property: "og:description", content: "Formulário de cadastro de processo." },
    ],
  }),
  component: NovoProcesso,
});

function NovoProcesso() {
  const navigate = useNavigate();
  const clientes = clientesHooks.useList();
  const { create } = processosHooks.useMutations();
  return (
    <>
      <PageHeader title="Novo processo" breadcrumbs={[{ label: "Processos", to: "/processos" }, { label: "Novo" }]} />
      {clientes.isLoading ? (
        <LoadingState />
      ) : (
        <ProcessoFormView
          clientes={clientes.data ?? []}
          submitting={create.isPending}
          onCancel={() => navigate({ to: "/processos" })}
          onSubmit={(v) => create.mutate(v, { onSuccess: (p) => navigate({ to: "/processos/$id", params: { id: p.id } }) })}
        />
      )}
    </>
  );
}
