import { createFileRoute } from "@tanstack/react-router";
import { Info, Server, ShieldCheck, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { USE_MOCK } from "@/services";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — JURIS+TECH" },
      { name: "description", content: "Perfil do usuário e informações de conexão com a API." },
      { property: "og:title", content: "Configurações — JURIS+TECH" },
      { property: "og:description", content: "Preferências e informações do sistema." },
    ],
  }),
  component: ConfigPage,
});

function Card({ icon: Icon, title, children }: { icon: typeof Info; title: string; children: React.ReactNode }) {
  return (
    <section className="surface p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon className="size-4.5" aria-hidden /></span>
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function ConfigPage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Configurações" description="Informações da conta e do sistema." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card icon={User} title="Perfil">
          <p><span className="font-semibold text-foreground">Nome:</span> {user?.nome}</p>
          <p><span className="font-semibold text-foreground">E-mail:</span> {user?.email}</p>
        </Card>
        <Card icon={Server} title="Conexão com a API">
          <p><span className="font-semibold text-foreground">Modo:</span> {USE_MOCK ? "Demonstração (dados fictícios)" : "API REST"}</p>
          <p><span className="font-semibold text-foreground">Endereço:</span> <code className="font-mono text-xs">{import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api"}</code></p>
        </Card>
        <Card icon={ShieldCheck} title="Segurança e privacidade">
          <p>A sessão expira automaticamente e é encerrada ao fechar a aba.</p>
          <p>Nenhuma senha, chave ou conexão de banco fica armazenada no navegador além do token de sessão.</p>
        </Card>
        <Card icon={Info} title="Sobre">
          <p>JURIS+TECH é uma ferramenta de organização administrativa. Não fornece aconselhamento jurídico, interpretação de leis ou decisões jurídicas.</p>
        </Card>
      </div>
    </>
  );
}
