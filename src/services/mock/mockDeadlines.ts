import type { PrazoDto } from "@/types";
import { toISODate } from "@/utils/format";

const inDays = (d: number) => toISODate(new Date(Date.now() + d * 864e5));

export const mockDeadlines = (): PrazoDto[] => [
  {
    id: "d1",
    processoId: "p1",
    titulo: "Réplica à contestação",
    descricao: "Protocolar réplica.",
    dataLimite: inDays(0),
    prioridade: "Urgente",
    status: "Pendente",
  },
  {
    id: "d2",
    processoId: "p2",
    titulo: "Juntada de documentos",
    dataLimite: inDays(2),
    prioridade: "Alta",
    status: "Pendente",
  },
  {
    id: "d3",
    processoId: "p3",
    titulo: "Manifestação inicial",
    dataLimite: inDays(5),
    prioridade: "Média",
    status: "Pendente",
  },
  {
    id: "d4",
    processoId: "p5",
    titulo: "Apresentar balanço",
    dataLimite: inDays(-2),
    prioridade: "Alta",
    status: "Pendente",
  },
  {
    id: "d5",
    processoId: "p1",
    titulo: "Contestação",
    dataLimite: inDays(-10),
    prioridade: "Alta",
    status: "Concluído",
  },
  {
    id: "d6",
    processoId: "p4",
    titulo: "Audiência de conciliação",
    dataLimite: inDays(14),
    prioridade: "Baixa",
    status: "Pendente",
  },
];
