import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  Loader2,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
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
      <section className="relative hidden overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex lg:flex-col xl:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div
          className="brand-gradient absolute -right-40 -top-40 size-[28rem] rounded-full opacity-25 blur-3xl"
          aria-hidden
        />
        <div
          className="brand-gradient absolute -bottom-48 -left-32 size-[28rem] rounded-full opacity-15 blur-3xl"
          aria-hidden
        />

        <Logo inverted className="relative w-64" />

        <div className="relative my-auto max-w-lg py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar-accent/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-sidebar-primary">
            <Scale className="size-3.5" aria-hidden />
            Gestão jurídica inteligente
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.15] text-sidebar-accent-foreground xl:text-5xl">
            Controle total do seu escritório,{" "}
            <span className="text-sidebar-primary">do cliente ao prazo.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-sidebar-foreground/80">
            Centralize clientes, processos, prazos e tarefas em uma plataforma segura, pensada
            para a rotina de pequenos escritórios de advocacia.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: Users, t: "Clientes", d: "Cadastro completo" },
              { icon: Briefcase, t: "Processos", d: "Status e andamentos" },
              { icon: CalendarClock, t: "Prazos", d: "Alertas de atraso" },
            ].map(({ icon: I, t, d }) => (
              <div
                key={t}
                className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-4 backdrop-blur-sm"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
                  <I className="size-4" aria-hidden />
                </span>
                <p className="mt-3 text-sm font-semibold text-sidebar-accent-foreground">{t}</p>
                <p className="text-xs text-sidebar-foreground/70">{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/70">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-sidebar-primary" aria-hidden />
            Acesso protegido e dados confidenciais
          </span>
          <span>© {new Date().getFullYear()} JURIS+TECH</span>
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
