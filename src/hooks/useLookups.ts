import { useMemo } from "react";
import { clientesHooks, processosHooks } from "./useResource";

/** Id → entity maps used to display related names (cliente, processo). */
export function useLookups() {
  const clientes = clientesHooks.useList();
  const processos = processosHooks.useList();
  return useMemo(() => {
    const clienteById = new Map((clientes.data ?? []).map((c) => [c.id, c]));
    const processoById = new Map((processos.data ?? []).map((p) => [p.id, p]));
    return {
      clientes: clientes.data ?? [],
      processos: processos.data ?? [],
      clienteNome: (id: string) => clienteById.get(id)?.nomeCompleto ?? "—",
      processo: (id: string) => processoById.get(id),
      clienteDoProcesso: (processoId: string) => clienteById.get(processoById.get(processoId)?.clienteId ?? "")?.nomeCompleto ?? "—",
    };
  }, [clientes.data, processos.data]);
}
