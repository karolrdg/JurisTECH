import type { ProcessoDto } from "@/types";
import { toISODate } from "@/utils/format";

const ago = (d: number) => toISODate(new Date(Date.now() - d * 864e5));

export const mockProcesses = (): ProcessoDto[] => [
  { id: "p1", numeroProcesso: "0000001-11.2026.0.00.0000", clienteId: "c1", titulo: "Ação de cobrança", areaJuridica: "Cível", status: "Em andamento", dataAbertura: ago(60), descricao: "Cobrança de valores contratuais em aberto.", atualizadoEm: ago(0) },
  { id: "p2", numeroProcesso: "0000002-22.2026.0.00.0000", clienteId: "c2", titulo: "Reclamação trabalhista", areaJuridica: "Trabalhista", status: "Aguardando decisão", dataAbertura: ago(90), descricao: "Pedido de verbas rescisórias.", atualizadoEm: ago(1) },
  { id: "p3", numeroProcesso: "0000003-33.2026.0.00.0000", clienteId: "c3", titulo: "Indenização por falha de serviço", areaJuridica: "Consumidor", status: "Novo", dataAbertura: ago(5), atualizadoEm: ago(2) },
  { id: "p4", numeroProcesso: "0000004-44.2026.0.00.0000", clienteId: "c4", titulo: "Revisão de pensão", areaJuridica: "Família", status: "Suspenso", dataAbertura: ago(200), atualizadoEm: ago(10) },
  { id: "p5", numeroProcesso: "0000005-55.2026.0.00.0000", clienteId: "c5", titulo: "Dissolução societária", areaJuridica: "Empresarial", status: "Em andamento", dataAbertura: ago(120), atualizadoEm: ago(3) },
  { id: "p6", numeroProcesso: "0000006-66.2026.0.00.0000", clienteId: "c1", titulo: "Concessão de benefício", areaJuridica: "Previdenciário", status: "Encerrado", dataAbertura: ago(400), dataEncerramento: ago(30), atualizadoEm: ago(30) },
];
