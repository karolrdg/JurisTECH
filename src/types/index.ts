export type ClienteStatus = "Ativo" | "Inativo";
export type AreaJuridica =
  | "Cível"
  | "Trabalhista"
  | "Família"
  | "Consumidor"
  | "Previdenciário"
  | "Empresarial"
  | "Outros";
export type ProcessoStatus =
  | "Novo"
  | "Em andamento"
  | "Aguardando decisão"
  | "Suspenso"
  | "Encerrado";
export type Prioridade = "Baixa" | "Média" | "Alta" | "Urgente";
export type PrazoStatus = "Pendente" | "Concluído" | "Atrasado";
export type TarefaStatus = "Pendente" | "Em andamento" | "Concluída";

export const AREAS: AreaJuridica[] = [
  "Cível",
  "Trabalhista",
  "Família",
  "Consumidor",
  "Previdenciário",
  "Empresarial",
  "Outros",
];
export const PROCESSO_STATUS: ProcessoStatus[] = [
  "Novo",
  "Em andamento",
  "Aguardando decisão",
  "Suspenso",
  "Encerrado",
];
export const PRIORIDADES: Prioridade[] = ["Baixa", "Média", "Alta", "Urgente"];
export const TAREFA_STATUS: TarefaStatus[] = ["Pendente", "Em andamento", "Concluída"];

export interface ClienteDto {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  dataCadastro: string;
  observacoes?: string;
  status: ClienteStatus;
}
export type ClienteInput = Omit<ClienteDto, "id" | "dataCadastro">;

export interface ProcessoDto {
  id: string;
  numeroProcesso: string;
  clienteId: string;
  titulo: string;
  areaJuridica: AreaJuridica;
  status: ProcessoStatus;
  dataAbertura: string;
  dataEncerramento?: string | null;
  descricao?: string;
  observacoes?: string;
  atualizadoEm: string;
}
export type ProcessoInput = Omit<ProcessoDto, "id" | "atualizadoEm">;

export interface PrazoDto {
  id: string;
  processoId: string;
  titulo: string;
  descricao?: string;
  dataLimite: string;
  prioridade: Prioridade;
  /** Stored status; "Atrasado" is derived at read time via getPrazoStatus. */
  status: PrazoStatus;
}
export type PrazoInput = Omit<PrazoDto, "id">;

export interface TarefaDto {
  id: string;
  processoId: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prazo: string;
  prioridade: Prioridade;
  status: TarefaStatus;
}
export type TarefaInput = Omit<TarefaDto, "id">;

export interface AtividadeDto {
  id: string;
  descricao: string;
  data: string;
}

export interface DashboardDto {
  processosAtivos: number;
  clientesAtivos: number;
  prazosProximos: number;
  tarefasPendentes: number;
  atividades: AtividadeDto[];
}

export interface UsuarioDto {
  id: string;
  nome: string;
  email: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  expiresAt: string;
  usuario: UsuarioDto;
}
