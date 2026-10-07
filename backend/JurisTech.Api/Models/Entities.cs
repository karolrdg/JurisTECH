using System.Text.Json.Serialization;

namespace JurisTech.Api.Models;

public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
    [JsonIgnore] public string SenhaHash { get; set; } = "";
}

public class Cliente
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string NomeCompleto { get; set; } = "";
    public string Cpf { get; set; } = "";
    public string Email { get; set; } = "";
    public string Telefone { get; set; } = "";
    public DateOnly DataCadastro { get; set; } = DateOnly.FromDateTime(DateTime.Today);
    public string? Observacoes { get; set; }
    public string Status { get; set; } = "Ativo";
    [JsonIgnore] public List<Processo> Processos { get; set; } = [];
}

public class Processo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string NumeroProcesso { get; set; } = "";
    public Guid ClienteId { get; set; }
    [JsonIgnore] public Cliente? Cliente { get; set; }
    public string Titulo { get; set; } = "";
    public string AreaJuridica { get; set; } = "Cível";
    public string Status { get; set; } = "Novo";
    public DateOnly DataAbertura { get; set; }
    public DateOnly? DataEncerramento { get; set; }
    public string? Descricao { get; set; }
    public string? Observacoes { get; set; }
    public DateOnly AtualizadoEm { get; set; } = DateOnly.FromDateTime(DateTime.Today);
    [JsonIgnore] public List<Prazo> Prazos { get; set; } = [];
    [JsonIgnore] public List<Tarefa> Tarefas { get; set; } = [];
}

/// <summary>Status gravado é "Pendente" ou "Concluído"; "Atrasado" é calculado no frontend.</summary>
public class Prazo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProcessoId { get; set; }
    [JsonIgnore] public Processo? Processo { get; set; }
    public string Titulo { get; set; } = "";
    public string? Descricao { get; set; }
    public DateOnly DataLimite { get; set; }
    public string Prioridade { get; set; } = "Média";
    public string Status { get; set; } = "Pendente";
}

public class Tarefa
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProcessoId { get; set; }
    [JsonIgnore] public Processo? Processo { get; set; }
    public string Titulo { get; set; } = "";
    public string? Descricao { get; set; }
    public string Responsavel { get; set; } = "";
    public DateOnly Prazo { get; set; }
    public string Prioridade { get; set; } = "Média";
    public string Status { get; set; } = "Pendente";
}

public class Atividade
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Descricao { get; set; } = "";
    public DateTime Data { get; set; } = DateTime.UtcNow;
}
