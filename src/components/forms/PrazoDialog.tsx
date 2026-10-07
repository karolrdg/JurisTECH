import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Field, NativeSelect } from "@/components/common/Field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prazosHooks } from "@/hooks/useResource";
import { prazoSchema, type PrazoForm } from "@/schemas";
import { PRIORIDADES, type PrazoDto, type PrazoInput, type ProcessoDto } from "@/types";

export function PrazoDialog({
  open,
  onOpenChange,
  initial,
  processos,
  defaultProcessoId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: PrazoDto | null;
  processos: ProcessoDto[];
  defaultProcessoId?: string;
}) {
  const { create, update } = prazosHooks.useMutations();
  const { register, handleSubmit, reset, formState } = useForm<PrazoForm>({ resolver: zodResolver(prazoSchema) });

  useEffect(() => {
    if (open)
      reset({
        processoId: initial?.processoId ?? defaultProcessoId ?? "",
        titulo: initial?.titulo ?? "",
        descricao: initial?.descricao ?? "",
        dataLimite: initial?.dataLimite ?? "",
        prioridade: initial?.prioridade ?? "Média",
        concluido: initial?.status === "Concluído",
      });
  }, [open, initial, defaultProcessoId, reset]);

  const busy = create.isPending || update.isPending;
  const onSubmit = (v: PrazoForm) => {
    const { concluido, ...rest } = v;
    const input = { ...rest, status: concluido ? "Concluído" : "Pendente" } as PrazoInput;
    const done = { onSuccess: () => onOpenChange(false) };
    if (initial) update.mutate({ id: initial.id, input }, done);
    else create.mutate(input, done);
  };
  const e = formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar prazo" : "Novo prazo"}</DialogTitle>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Processo" error={e.processoId?.message} required>
            <NativeSelect {...register("processoId")}>
              <option value="">Selecione um processo</option>
              {processos.map((p) => <option key={p.id} value={p.id}>{p.titulo} — {p.numeroProcesso}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Título" error={e.titulo?.message} required>
            <Input {...register("titulo")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data limite" error={e.dataLimite?.message} required>
              <Input type="date" {...register("dataLimite")} />
            </Field>
            <Field label="Prioridade" required>
              <NativeSelect {...register("prioridade")}>
                {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
              </NativeSelect>
            </Field>
          </div>
          <Field label="Descrição">
            <Textarea rows={3} {...register("descricao")} />
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="size-4 accent-primary" {...register("concluido")} />
            Marcar como concluído
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
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
