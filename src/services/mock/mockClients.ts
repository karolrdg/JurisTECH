import type { ClienteDto } from "@/types";

export const mockClients = (): ClienteDto[] => [
  { id: "c1", nomeCompleto: "João da Silva", cpf: "123.456.789-09", email: "joao.silva@exemplo.com", telefone: "(11) 98765-4321", dataCadastro: "2026-01-12", status: "Ativo", observacoes: "Prefere contato por e-mail." },
  { id: "c2", nomeCompleto: "Maria Aparecida Souza", cpf: "987.654.321-00", email: "maria.souza@exemplo.com", telefone: "(21) 99876-1234", dataCadastro: "2026-02-03", status: "Ativo" },
  { id: "c3", nomeCompleto: "Carlos Eduardo Mendes", cpf: "111.444.777-35", email: "carlos.mendes@exemplo.com", telefone: "(31) 3344-5566", dataCadastro: "2026-03-18", status: "Ativo" },
  { id: "c4", nomeCompleto: "Antônia Ribeiro", cpf: "246.813.579-28", email: "antonia.ribeiro@exemplo.com", telefone: "(41) 99123-4567", dataCadastro: "2026-04-22", status: "Inativo" },
  { id: "c5", nomeCompleto: "Empresa Alfa Comércio Ltda", cpf: "135.792.468-28", email: "contato@alfa.exemplo.com", telefone: "(51) 3222-1100", dataCadastro: "2026-05-09", status: "Ativo" },
  { id: "c6", nomeCompleto: "Rafael Nogueira Lima", cpf: "314.159.265-90", email: "rafael.lima@exemplo.com", telefone: "(61) 98111-2233", dataCadastro: "2026-06-30", status: "Ativo" },
];
