import type { TarefaDto } from "@/types";
import { toISODate } from "@/utils/format";

const inDays = (d: number) => toISODate(new Date(Date.now() + d * 864e5));

export const mockTasks = (): TarefaDto[] => [
  { id: "t1", processoId: "p1", titulo: "Reunir comprovantes de pagamento", responsavel: "Ana Costa", prazo: inDays(1), prioridade: "Alta", status: "Pendente" },
  { id: "t2", processoId: "p2", titulo: "Ligar para o cliente", descricao: "Confirmar testemunhas.", responsavel: "Bruno Alves", prazo: inDays(3), prioridade: "Média", status: "Em andamento" },
  { id: "t3", processoId: "p3", titulo: "Digitalizar contrato", responsavel: "Ana Costa", prazo: inDays(4), prioridade: "Baixa", status: "Pendente" },
  { id: "t4", processoId: "p5", titulo: "Atualizar planilha de custas", responsavel: "Carla Dias", prazo: inDays(-1), prioridade: "Urgente", status: "Pendente" },
  { id: "t5", processoId: "p6", titulo: "Arquivar documentos", responsavel: "Bruno Alves", prazo: inDays(-20), prioridade: "Baixa", status: "Concluída" },
];
