import type { AtividadeDto, ClienteDto, PrazoDto, ProcessoDto, TarefaDto } from "@/types";
import { mockClients } from "./mockClients";
import { mockProcesses } from "./mockProcesses";
import { mockDeadlines } from "./mockDeadlines";
import { mockTasks } from "./mockTasks";
import { tokenStorage } from "../http/tokenStorage";

interface Db {
  clientes: ClienteDto[];
  processos: ProcessoDto[];
  prazos: PrazoDto[];
  tarefas: TarefaDto[];
  atividades: AtividadeDto[];
}

const dbs = new Map<string, Db>();
const DEMO_EMAIL = "demo@jurismaistech.com";

/** In-memory fictitious data, built lazily (dates are relative to today). */
/** Each office (logged-in account) has its own data; only the demo account starts with samples. */
export function getDb(): Db {
  const owner = tokenStorage.getUser()?.email ?? DEMO_EMAIL;
  let db = dbs.get(owner);
  if (!db && owner !== DEMO_EMAIL) {
    db = { clientes: [], processos: [], prazos: [], tarefas: [], atividades: [] };
    dbs.set(owner, db);
  }
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
    dbs.set(owner, db);
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
