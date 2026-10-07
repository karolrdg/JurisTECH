import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ClienteFormView } from "@/components/forms/ClienteFormFields";
import { clientesHooks } from "@/hooks/useResource";

export const Route = createFileRoute("/_app/clientes/novo")({
  head: () => ({
    meta: [
      { title: "Novo cliente — JURIS+TECH" },
      { name: "description", content: "Cadastre um novo cliente no escritório." },
      { property: "og:title", content: "Novo cliente — JURIS+TECH" },
      { property: "og:description", content: "Formulário de cadastro de cliente." },
    ],
  }),
  component: NovoCliente,
});

function NovoCliente() {
  const navigate = useNavigate();
  const { create } = clientesHooks.useMutations();
  return (
    <>
      <PageHeader
        title="Novo cliente"
        breadcrumbs={[{ label: "Clientes", to: "/clientes" }, { label: "Novo" }]}
      />
      <ClienteFormView
        submitting={create.isPending}
        onCancel={() => navigate({ to: "/clientes" })}
        onSubmit={(v) =>
          create.mutate(v, {
            onSuccess: (c) => navigate({ to: "/clientes/$id", params: { id: c.id } }),
          })
        }
      />
    </>
  );
}
