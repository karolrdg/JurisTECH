import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, NativeSelect } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { processoSchema, type ProcessoForm } from "@/schemas";
import { AREAS, PROCESSO_STATUS, type ClienteDto, type ProcessoDto, type ProcessoInput } from "@/types";
import { toISODate } from "@/utils/format";

export function ProcessoFormView({
  initial,
  clientes,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial?: ProcessoDto;
  clientes: ClienteDto[];
  submitting?: boolean;
  onSubmit: (v: ProcessoInput) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState } = useForm<ProcessoForm>({
    resolver: zodResolver(processoSchema),
    defaultValues: {
      numeroProcesso: initial?.numeroProcesso ?? "",
      clienteId: initial?.clienteId ?? "",
      titulo: initial?.titulo ?? "",
      areaJuridica: initial?.areaJuridica ?? "Cível",
      status: initial?.status ?? "Novo",
      dataAbertura: initial?.dataAbertura ?? toISODate(new Date()),
      dataEncerramento: initial?.dataEncerramento ?? "",
      descricao: initial?.descricao ?? "",
      observacoes: initial?.observacoes ?? "",
    },
  });
  const e = formState.errors;
  return (
    <form
      noValidate
      onSubmit={handleSubmit((v) => onSubmit({ ...v, dataEncerramento: v.dataEncerramento || null } as ProcessoInput))}
      className="surface grid gap-5 p-5 sm:p-6 md:grid-cols-2"
    >
      <Field label="Número do processo" error={e.numeroProcesso?.message} required hint="Ex.: 0000000-00.2026.0.00.0000">
        <Input className="font-mono" {...register("numeroProcesso")} />
      </Field>
      <Field label="Cliente" error={e.clienteId?.message} required>
        <NativeSelect {...register("clienteId")}>
          <option value="">Selecione um cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
          ))}
        </NativeSelect>
      </Field>
      <Field label="Título" error={e.titulo?.message} required className="md:col-span-2">
        <Input {...register("titulo")} />
      </Field>
      <Field label="Área jurídica" required>
        <NativeSelect {...register("areaJuridica")}>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </NativeSelect>
      </Field>
      <Field label="Status" required>
        <NativeSelect {...register("status")}>
          {PROCESSO_STATUS.map((s) => <option key={s}>{s}</option>)}
        </NativeSelect>
      </Field>
      <Field label="Data de abertura" error={e.dataAbertura?.message} required>
        <Input type="date" {...register("dataAbertura")} />
      </Field>
      <Field label="Data de encerramento" error={e.dataEncerramento?.message}>
        <Input type="date" {...register("dataEncerramento")} />
      </Field>
      <Field label="Descrição" className="md:col-span-2">
        <Textarea rows={3} {...register("descricao")} />
      </Field>
      <Field label="Observações" className="md:col-span-2">
        <Textarea rows={3} {...register("observacoes")} />
      </Field>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end md:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {initial ? "Salvar alterações" : "Cadastrar processo"}
        </Button>
      </div>
    </form>
  );
}
