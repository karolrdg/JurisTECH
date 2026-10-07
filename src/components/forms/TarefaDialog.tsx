import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Field, NativeSelect } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tarefasHooks } from "@/hooks/useResource";
import { tarefaSchema, type TarefaForm } from "@/schemas";
import {
  PRIORIDADES,
  TAREFA_STATUS,
  type ProcessoDto,
  type TarefaDto,
  type TarefaInput,
} from "@/types";

export function TarefaDialog({
  open,
  onOpenChange,
  initial,
  processos,
  defaultProcessoId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: TarefaDto | null | undefined;
  processos: ProcessoDto[];
  defaultProcessoId?: string | undefined;
}) {
  const { create, update } = tarefasHooks.useMutations();
  const { register, handleSubmit, reset, formState } = useForm<TarefaForm>({
    resolver: zodResolver(tarefaSchema),
  });

  useEffect(() => {
    if (open)
      reset({
        processoId: initial?.processoId ?? defaultProcessoId ?? "",
        titulo: initial?.titulo ?? "",
        descricao: initial?.descricao ?? "",
        responsavel: initial?.responsavel ?? "",
        prazo: initial?.prazo ?? "",
        prioridade: initial?.prioridade ?? "Média",
        status: initial?.status ?? "Pendente",
      });
  }, [open, initial, defaultProcessoId, reset]);

  const busy = create.isPending || update.isPending;
  const onSubmit = (v: TarefaForm) => {
    const input = v as TarefaInput;
    const done = { onSuccess: () => onOpenChange(false) };
    if (initial) update.mutate({ id: initial.id, input }, done);
    else create.mutate(input, done);
  };
  const e = formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Processo" error={e.processoId?.message} required>
            <NativeSelect {...register("processoId")}>
              <option value="">Selecione um processo</option>
              {processos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo} — {p.numeroProcesso}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Título" error={e.titulo?.message} required>
            <Input {...register("titulo")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Responsável" error={e.responsavel?.message} required>
              <Input {...register("responsavel")} />
            </Field>
            <Field label="Prazo" error={e.prazo?.message} required>
              <Input type="date" {...register("prazo")} />
            </Field>
            <Field label="Prioridade" required>
              <NativeSelect {...register("prioridade")}>
                {PRIORIDADES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Status" required>
              <NativeSelect {...register("status")}>
                {TAREFA_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Field label="Descrição">
            <Textarea rows={3} {...register("descricao")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
