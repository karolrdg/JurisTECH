import type { AtividadeDto, ClienteDto, PrazoDto, ProcessoDto, TarefaDto } from "@/types";
import { mockClients } from "./mockClients";
import { mockProcesses } from "./mockProcesses";
import { mockDeadlines } from "./mockDeadlines";
import { mockTasks } from "./mockTasks";

interface Db {
  clientes: ClienteDto[];
  processos: ProcessoDto[];
  prazos: PrazoDto[];
  tarefas: TarefaDto[];
  atividades: AtividadeDto[];
}

let db: Db | null = null;

/** In-memory fictitious data, built lazily (dates are relative to today). */
export function getDb(): Db {
  if (!db) {
    db = {
      clientes: mockClients(),
      processos: mockProcesses(),
      prazos: mockDeadlines(),
      tarefas: mockTasks(),
      atividades: [
        {
          id: "a1",
          descricao: "Processo “Ação de cobrança” atualizado para Em andamento.",
          data: new Date(Date.now() - 36e5).toISOString(),
        },
        {
          id: "a2",
          descricao: "Cliente Maria Aparecida Souza cadastrada.",
          data: new Date(Date.now() - 5 * 36e5).toISOString(),
        },
        {
          id: "a3",
          descricao: "Prazo “Contestação” concluído.",
          data: new Date(Date.now() - 26 * 36e5).toISOString(),
        },
        {
          id: "a4",
          descricao: "Tarefa “Reunir documentos” criada.",
          data: new Date(Date.now() - 50 * 36e5).toISOString(),
        },
      ],
    };
  }
  return db;
}

export function logActivity(descricao: string) {
  getDb().atividades.unshift({
    id: crypto.randomUUID(),
    descricao,
    data: new Date().toISOString(),
  });
}

export const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
