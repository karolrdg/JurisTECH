using JurisTech.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace JurisTech.Api.Data;

/// <summary>Dados fictícios de demonstração, inseridos só quando o banco está vazio.</summary>
public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Usuarios.Any()) return;

        var hasher = new PasswordHasher<Usuario>();
        var demo = new Usuario { Id = Guid.NewGuid(), Nome = "Dra. Helena Costa", Email = "demo@jurismaistech.com" };
        demo.SenhaHash = hasher.HashPassword(demo, "demo123");
        db.Usuarios.Add(demo);
        var dono = demo.Id;

        var hoje = DateOnly.FromDateTime(DateTime.Today);

        var joao = new Cliente { UsuarioId = dono, NomeCompleto = "João da Silva", Cpf = "52998224725", Email = "joao.silva@email.com", Telefone = "11987654321", DataCadastro = hoje.AddDays(-60) };
        var maria = new Cliente { UsuarioId = dono, NomeCompleto = "Maria Aparecida Souza", Cpf = "11144477735", Email = "maria.souza@email.com", Telefone = "21998765432", DataCadastro = hoje.AddDays(-20) };
        var carlos = new Cliente { UsuarioId = dono, NomeCompleto = "Carlos Eduardo Mendes", Cpf = "39053344705", Email = "carlos.mendes@email.com", Telefone = "31991234567", DataCadastro = hoje.AddDays(-10) };
        db.Clientes.AddRange(joao, maria, carlos);

        var p1 = new Processo { UsuarioId = dono, NumeroProcesso = "0000001-11.2026.0.00.0000", Cliente = joao, Titulo = "Ação de cobrança", AreaJuridica = "Cível", Status = "Em andamento", DataAbertura = hoje.AddDays(-50) };
        var p2 = new Processo { UsuarioId = dono, NumeroProcesso = "0000002-22.2026.0.00.0000", Cliente = maria, Titulo = "Reclamação trabalhista", AreaJuridica = "Trabalhista", Status = "Novo", DataAbertura = hoje.AddDays(-15) };
        var p3 = new Processo { UsuarioId = dono, NumeroProcesso = "0000003-33.2026.0.00.0000", Cliente = carlos, Titulo = "Revisão contratual", AreaJuridica = "Consumidor", Status = "Aguardando decisão", DataAbertura = hoje.AddDays(-8) };
        db.Processos.AddRange(p1, p2, p3);

        db.Prazos.AddRange(
            new Prazo { UsuarioId = dono, Processo = p1, Titulo = "Réplica à contestação", DataLimite = hoje, Prioridade = "Urgente" },
            new Prazo { UsuarioId = dono, Processo = p2, Titulo = "Juntada de documentos", DataLimite = hoje.AddDays(2), Prioridade = "Alta" },
            new Prazo { UsuarioId = dono, Processo = p3, Titulo = "Manifestação inicial", DataLimite = hoje.AddDays(5), Prioridade = "Média" },
            new Prazo { UsuarioId = dono, Processo = p1, Titulo = "Apresentar balanço", DataLimite = hoje.AddDays(-2), Prioridade = "Alta" });

        db.Tarefas.AddRange(
            new Tarefa { UsuarioId = dono, Processo = p1, Titulo = "Reunir documentos", Responsavel = "Ana Lima", Prazo = hoje.AddDays(3), Prioridade = "Alta" },
            new Tarefa { UsuarioId = dono, Processo = p2, Titulo = "Ligar para o cliente", Responsavel = "Bruno Reis", Prazo = hoje.AddDays(1), Prioridade = "Média", Status = "Em andamento" });

        db.Atividades.Add(new Atividade { UsuarioId = dono, Descricao = "Dados de demonstração criados." });
        db.SaveChanges();
    }
}
