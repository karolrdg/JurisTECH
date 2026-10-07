import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Field } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterForm } from "@/schemas";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — JURIS+TECH" },
      { name: "description", content: "Crie sua conta no JURIS+TECH e organize o seu escritório." },
      { property: "og:title", content: "Criar conta — JURIS+TECH" },
      { property: "og:description", content: "Cadastre-se para gerenciar clientes, processos, prazos e tarefas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CadastroPage,
});

const iconCls = "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground";

function CadastroPage() {
  const { register: signUp, user, ready } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", password: "", confirm: "" },
  });

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  const onSubmit = async ({ nome, email, password }: RegisterForm) => {
    setError(null);
    try {
      await signUp({ nome, email, password });
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar a conta.");
    }
  };

  const e = formState.errors;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 sm:p-10">
      <div className="w-full max-w-md">
        <img src="/logo.png" alt="JURIS+TECH" className="mx-auto mb-8 w-56" />
        <div className="surface rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
          <div className="mb-6 grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
            <UserPlus className="size-5" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Criar sua conta</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Preencha os dados para começar a usar o sistema.
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-5">
            <Field label="Nome completo" error={e.nome?.message} required>
              <div className="relative">
                <User className={iconCls} aria-hidden />
                <Input autoComplete="name" placeholder="Seu nome" className="h-11 pl-10" {...register("nome")} />
              </div>
            </Field>
            <Field label="E-mail" error={e.email?.message} required>
              <div className="relative">
                <Mail className={iconCls} aria-hidden />
                <Input type="email" autoComplete="email" placeholder="seu@escritorio.com" className="h-11 pl-10" {...register("email")} />
              </div>
            </Field>
            <Field label="Senha" error={e.password?.message} required>
              <div className="relative">
                <Lock className={iconCls} aria-hidden />
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="h-11 pl-10 pr-11"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <Field label="Confirmar senha" error={e.confirm?.message} required>
              <div className="relative">
                <Lock className={iconCls} aria-hidden />
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repita a senha"
                  className="h-11 pl-10"
                  {...register("confirm")}
                />
              </div>
            </Field>
            <Button type="submit" className="h-11 w-full text-base" disabled={formState.isSubmitting}>
              {formState.isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {formState.isSubmitting ? "Criando conta..." : "Criar conta"}
              {!formState.isSubmitting && <ArrowRight className="size-4" aria-hidden />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
