using System.ComponentModel.DataAnnotations;
using JurisTech.Api.Validation;

namespace JurisTech.Api.Dtos;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password);

public record UsuarioDto(Guid Id, string Nome, string Email);
public record LoginResponse(string Token, DateTime ExpiresAt, UsuarioDto Usuario);

public record ClienteInput(
    [Required, StringLength(120, MinimumLength = 3)] string NomeCompleto,
    [Required, Cpf] string Cpf,
    [Required, EmailAddress, StringLength(160)] string Email,
    [Required, StringLength(20, MinimumLength = 10)] string Telefone,
    [Required, AllowedValues("Ativo", "Inativo")] string Status,
    [StringLength(1000)] string? Observacoes);

public record ProcessoInput(
    [Required, StringLength(30)] string NumeroProcesso,
    [Required] Guid ClienteId,
    [Required, StringLength(150)] string Titulo,
    [Required, AllowedValues("Cível", "Trabalhista", "Família", "Consumidor", "Previdenciário", "Empresarial", "Outros")]
    string AreaJuridica,
    [Required, AllowedValues("Novo", "Em andamento", "Aguardando decisão", "Suspenso", "Encerrado")]
    string Status,
    [Required] DateOnly DataAbertura,
    DateOnly? DataEncerramento,
    [StringLength(2000)] string? Descricao,
    [StringLength(1000)] string? Observacoes);

public record PrazoInput(
    [Required] Guid ProcessoId,
    [Required, StringLength(150)] string Titulo,
    [StringLength(1000)] string? Descricao,
    [Required] DateOnly DataLimite,
    [Required, AllowedValues("Baixa", "Média", "Alta", "Urgente")] string Prioridade,
    [Required, AllowedValues("Pendente", "Concluído")] string Status);

public record TarefaInput(
    [Required] Guid ProcessoId,
    [Required, StringLength(150)] string Titulo,
    [StringLength(1000)] string? Descricao,
    [Required, StringLength(80)] string Responsavel,
    [Required] DateOnly Prazo,
    [Required, AllowedValues("Baixa", "Média", "Alta", "Urgente")] string Prioridade,
    [Required, AllowedValues("Pendente", "Em andamento", "Concluída")] string Status);

public record AtividadeDto(Guid Id, string Descricao, DateTime Data);

public record DashboardDto(
    int ProcessosAtivos,
    int ClientesAtivos,
    int PrazosProximos,
    int TarefasPendentes,
    List<AtividadeDto> Atividades);

public record ErroDto(string Message);
