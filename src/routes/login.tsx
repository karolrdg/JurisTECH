import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CalendarClock, Loader2, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Field } from "@/components/common/Field";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginForm } from "@/schemas";
import { DEMO_LOGIN, USE_MOCK } from "@/services";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — JURIS+TECH" },
      {
        name: "description",
        content:
          "Acesse o JURIS+TECH, gestão administrativa de processos para escritórios de advocacia.",
      },
      { property: "og:title", content: "Entrar — JURIS+TECH" },
      {
        property: "og:description",
        content: "Gestão administrativa de clientes, processos, prazos e tarefas.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data);
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao entrar.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col">
        <div
          className="brand-gradient absolute -right-32 -top-32 size-96 rounded-full opacity-30 blur-3xl"
          aria-hidden
        />
        <div
          className="brand-gradient absolute -bottom-40 -left-20 size-96 rounded-full opacity-20 blur-3xl"
          aria-hidden
        />
        <Logo inverted className="relative" />
        <div className="relative mt-auto max-w-md">
          <h2 className="text-4xl font-bold leading-tight text-sidebar-accent-foreground">
            Seu escritório organizado, do cliente ao prazo.
          </h2>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              { icon: Users, t: "Clientes e processos em um só lugar" },
              { icon: CalendarClock, t: "Prazos com alertas de atraso" },
              { icon: ShieldCheck, t: "Acesso protegido por autenticação" },
            ].map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-sidebar-accent text-sidebar-primary">
                  <I className="size-4" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com suas credenciais para continuar.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            <Field label="E-mail" error={formState.errors.email?.message} required>
              <Input type="email" autoComplete="email" {...register("email")} />
            </Field>
            <Field label="Senha" error={formState.errors.password?.message} required>
              <Input type="password" autoComplete="current-password" {...register("password")} />
            </Field>
            <Button type="submit" className="w-full" size="lg" disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Entrar
            </Button>
          </form>

          {USE_MOCK && (
            <div className="mt-6 rounded-xl border border-dashed border-brand-teal/40 bg-accent/50 p-4 text-sm">
              <p className="font-semibold text-accent-foreground">Modo demonstração</p>
              <p className="mt-1 text-muted-foreground">Use o acesso fictício de teste.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setValue("email", DEMO_LOGIN.email);
                  setValue("password", DEMO_LOGIN.password);
                }}
              >
                Preencher acesso de demonstração
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
