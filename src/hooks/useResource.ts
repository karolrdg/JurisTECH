import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CrudService } from "@/services/crud";
import { clientesService, dashboardService, prazosService, processosService, tarefasService } from "@/services";

function makeHooks<T, I>(key: string, service: CrudService<T, I>, noun: string) {
  return {
    useList: () => useQuery({ queryKey: [key], queryFn: () => service.list() }),
    useOne: (id: string) => useQuery({ queryKey: [key, id], queryFn: () => service.get(id) }),
    useMutations: () => {
      const qc = useQueryClient();
      const done = (msg: string) => {
        qc.invalidateQueries();
        toast.success(msg);
      };
      const fail = (e: Error) => toast.error(e.message);
      return {
        create: useMutation({ mutationFn: (i: I) => service.create(i), onSuccess: () => done(`${noun} cadastrado(a) com sucesso.`), onError: fail }),
        update: useMutation({
          mutationFn: ({ id, input }: { id: string; input: I }) => service.update(id, input),
          onSuccess: () => done(`${noun} atualizado(a) com sucesso.`),
          onError: fail,
        }),
        remove: useMutation({ mutationFn: (id: string) => service.remove(id), onSuccess: () => done(`${noun} excluído(a) com sucesso.`), onError: fail }),
      };
    },
  };
}

export const clientesHooks = makeHooks("clientes", clientesService, "Cliente");
export const processosHooks = makeHooks("processos", processosService, "Processo");
export const prazosHooks = makeHooks("prazos", prazosService, "Prazo");
export const tarefasHooks = makeHooks("tarefas", tarefasService, "Tarefa");

export const useDashboard = () => useQuery({ queryKey: ["dashboard"], queryFn: () => dashboardService.get() });
