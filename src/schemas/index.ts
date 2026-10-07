import { z } from "zod";
import { AREAS, PRIORIDADES, PROCESSO_STATUS, TAREFA_STATUS } from "@/types";
import { isValidCpf, onlyDigits } from "@/utils/format";

const req = (msg: string) => z.string().trim().min(1, msg);

export const loginSchema = z.object({
  email: req("Informe o e-mail.").email("E-mail inválido."),
  password: req("Informe a senha.").min(6, "A senha deve ter ao menos 6 caracteres."),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: req("Informe seu nome.").min(3, "Informe o nome completo.").max(120),
    email: req("Informe o e-mail.").email("E-mail inválido.").max(160),
    password: req("Informe a senha.").min(6, "A senha deve ter ao menos 6 caracteres.").max(100),
    confirm: req("Confirme a senha."),
  })
  .refine((d) => d.password === d.confirm, { message: "As senhas não conferem.", path: ["confirm"] });
export type RegisterForm = z.infer<typeof registerSchema>;

export const clienteSchema = z.object({
  nomeCompleto: req("O nome é obrigatório.").min(3, "Informe o nome completo.").max(120),
  cpf: req("Informe o CPF.").refine(isValidCpf, "CPF inválido."),
  email: req("Informe o e-mail.").email("E-mail inválido.").max(160),
  telefone: req("Informe o telefone.").refine(
    (v) => [10, 11].includes(onlyDigits(v).length),
    "Telefone inválido. Use DDD + número.",
  ),
  status: z.enum(["Ativo", "Inativo"]),
  observacoes: z.string().max(1000).optional(),
});
export type ClienteForm = z.infer<typeof clienteSchema>;

export const processoSchema = z
  .object({
    numeroProcesso: req("Informe o número do processo.").max(30),
    clienteId: req("Selecione o cliente."),
    titulo: req("Informe o título.").max(150),
    areaJuridica: z.enum(AREAS as [string, ...string[]]),
    status: z.enum(PROCESSO_STATUS as [string, ...string[]]),
    dataAbertura: req("Informe a data de abertura."),
    dataEncerramento: z.string().optional(),
    descricao: z.string().max(2000).optional(),
    observacoes: z.string().max(1000).optional(),
  })
  .refine((d) => !d.dataEncerramento || d.dataEncerramento >= d.dataAbertura, {
    path: ["dataEncerramento"],
    message: "O encerramento não pode ser anterior à abertura.",
  });
export type ProcessoForm = z.infer<typeof processoSchema>;

export const prazoSchema = z.object({
  processoId: req("Selecione o processo."),
  titulo: req("Informe o título.").max(150),
  descricao: z.string().max(1000).optional(),
  dataLimite: req("Informe a data limite."),
  prioridade: z.enum(PRIORIDADES as [string, ...string[]]),
  concluido: z.boolean(),
});
export type PrazoForm = z.infer<typeof prazoSchema>;

export const tarefaSchema = z.object({
  processoId: req("Selecione o processo."),
  titulo: req("Informe o título.").max(150),
  descricao: z.string().max(1000).optional(),
  responsavel: req("Informe o responsável.").max(80),
  prazo: req("Informe o prazo."),
  prioridade: z.enum(PRIORIDADES as [string, ...string[]]),
  status: z.enum(TAREFA_STATUS as [string, ...string[]]),
});
export type TarefaForm = z.infer<typeof tarefaSchema>;
