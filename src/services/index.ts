import type {
  ClienteDto,
  ClienteInput,
  DashboardDto,
  LoginRequest,
  LoginResponse,
  PrazoDto,
  PrazoInput,
  ProcessoDto,
  ProcessoInput,
  TarefaDto,
  TarefaInput,
} from "@/types";
import { toISODate, daysUntil, getPrazoStatus } from "@/utils/format";
import { api } from "./http/api";
import { createApiCrud, createMockCrud } from "./crud";
import { delay, getDb } from "./mock/mockDb";

/** Set VITE_USE_MOCK=false to switch every service to the real REST API. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const newId = () => crypto.randomUUID();
const today = () => toISODate(new Date());

export const clientesService = USE_MOCK
  ? createMockCrud<ClienteDto, ClienteInput>({
      store: () => getDb().clientes,
      noun: "Cliente",
      label: (c) => c.nomeCompleto,
      build: (i, e) => ({ ...i, id: e?.id ?? newId(), dataCadastro: e?.dataCadastro ?? today() }),
    })
  : createApiCrud<ClienteDto, ClienteInput>("/clientes");

export const processosService = USE_MOCK
  ? createMockCrud<ProcessoDto, ProcessoInput>({
      store: () => getDb().processos,
      noun: "Processo",
      label: (p) => p.titulo,
      build: (i, e) => ({ ...i, id: e?.id ?? newId(), atualizadoEm: today() }),
    })
  : createApiCrud<ProcessoDto, ProcessoInput>("/processos");

export const prazosService = USE_MOCK
  ? createMockCrud<PrazoDto, PrazoInput>({
      store: () => getDb().prazos,
      noun: "Prazo",
      label: (p) => p.titulo,
      build: (i, e) => ({ ...i, id: e?.id ?? newId() }),
    })
  : createApiCrud<PrazoDto, PrazoInput>("/prazos");

export const tarefasService = USE_MOCK
  ? createMockCrud<TarefaDto, TarefaInput>({
      store: () => getDb().tarefas,
      noun: "Tarefa",
      label: (t) => t.titulo,
      build: (i, e) => ({ ...i, id: e?.id ?? newId() }),
    })
  : createApiCrud<TarefaDto, TarefaInput>("/tarefas");

export const dashboardService = {
  async get(): Promise<DashboardDto> {
    if (!USE_MOCK) return (await api.get<DashboardDto>("/dashboard")).data;
    await delay();
    const db = getDb();
    return {
      processosAtivos: db.processos.filter((p) => p.status !== "Encerrado").length,
      clientesAtivos: db.clientes.filter((c) => c.status === "Ativo").length,
      prazosProximos: db.prazos.filter((p) => getPrazoStatus(p) === "Pendente" && daysUntil(p.dataLimite) <= 7).length,
      tarefasPendentes: db.tarefas.filter((t) => t.status !== "Concluída").length,
      atividades: db.atividades.slice(0, 6),
    };
  },
};

/** Demo credentials for the mock API (fictitious). */
export const DEMO_LOGIN = { email: "demo@jurismaistech.com", password: "demo123" };

export const authService = {
  async login(req: LoginRequest): Promise<LoginResponse> {
    if (!USE_MOCK) return (await api.post<LoginResponse>("/auth/login", req)).data;
    await delay(600);
    if (req.email.toLowerCase() !== DEMO_LOGIN.email || req.password !== DEMO_LOGIN.password) {
      throw new Error("E-mail ou senha incorretos.");
    }
    return {
      token: `mock.${newId()}`,
      expiresAt: new Date(Date.now() + 8 * 36e5).toISOString(),
      usuario: { id: "u1", nome: "Dra. Helena Costa", email: req.email },
    };
  },
  async logout(): Promise<void> {
    if (!USE_MOCK) await api.post("/auth/logout").catch(() => undefined);
  },
};
