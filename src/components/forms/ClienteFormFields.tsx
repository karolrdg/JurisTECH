import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, NativeSelect } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clienteSchema, type ClienteForm } from "@/schemas";
import type { ClienteDto, ClienteInput } from "@/types";
import { formatCpf, formatTelefone } from "@/utils/format";

export function ClienteFormView({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial?: ClienteDto | undefined;
  submitting?: boolean | undefined;
  onSubmit: (v: ClienteInput) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, setValue, formState } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nomeCompleto: initial?.nomeCompleto ?? "",
      cpf: initial?.cpf ?? "",
      email: initial?.email ?? "",
      telefone: initial?.telefone ?? "",
      status: initial?.status ?? "Ativo",
      observacoes: initial?.observacoes ?? "",
    },
  });
  const e = formState.errors;
  return (
    <form noValidate onSubmit={handleSubmit((v) => onSubmit(v as ClienteInput))} className="surface grid gap-5 p-5 sm:p-6 md:grid-cols-2">
      <Field label="Nome completo" error={e.nomeCompleto?.message} required className="md:col-span-2">
        <Input autoComplete="name" {...register("nomeCompleto")} />
      </Field>
      <Field label="CPF" error={e.cpf?.message} required>
        <Input inputMode="numeric" placeholder="000.000.000-00" {...register("cpf", { onChange: (ev) => setValue("cpf", formatCpf(ev.target.value)) })} />
      </Field>
      <Field label="Status" error={e.status?.message} required>
        <NativeSelect {...register("status")}>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </NativeSelect>
      </Field>
      <Field label="E-mail" error={e.email?.message} required>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label="Telefone" error={e.telefone?.message} required>
        <Input inputMode="tel" placeholder="(00) 00000-0000" {...register("telefone", { onChange: (ev) => setValue("telefone", formatTelefone(ev.target.value)) })} />
      </Field>
      <Field label="Observações" error={e.observacoes?.message} className="md:col-span-2">
        <Textarea rows={4} {...register("observacoes")} />
      </Field>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end md:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {initial ? "Salvar alterações" : "Cadastrar cliente"}
        </Button>
      </div>
    </form>
  );
}
