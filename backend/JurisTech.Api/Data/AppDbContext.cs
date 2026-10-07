using JurisTech.Api.Models;
using JurisTech.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options, ICurrentUser? currentUser = null)
    : DbContext(options)
{
    /// <summary>Escritório logado. Guid.Empty fora de uma requisição (seed, ferramentas do EF).</summary>
    public Guid CurrentUserId => currentUser?.Id ?? Guid.Empty;

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Processo> Processos => Set<Processo>();
    public DbSet<Prazo> Prazos => Set<Prazo>();
    public DbSet<Tarefa> Tarefas => Set<Tarefa>();
    public DbSet<Atividade> Atividades => Set<Atividade>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Usuario>(e =>
        {
            e.Property(x => x.Nome).HasMaxLength(120).IsRequired();
            e.Property(x => x.Email).HasMaxLength(160).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
        });

        b.Entity<Cliente>(e =>
        {
            e.Property(x => x.NomeCompleto).HasMaxLength(120).IsRequired();
            e.Property(x => x.Cpf).HasMaxLength(11).IsRequired();
            e.HasIndex(x => new { x.UsuarioId, x.Cpf }).IsUnique();
            e.Property(x => x.Email).HasMaxLength(160).IsRequired();
            e.Property(x => x.Telefone).HasMaxLength(20).IsRequired();
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.Observacoes).HasMaxLength(1000);
        });

        b.Entity<Processo>(e =>
        {
            e.Property(x => x.NumeroProcesso).HasMaxLength(30).IsRequired();
            e.HasIndex(x => new { x.UsuarioId, x.NumeroProcesso }).IsUnique();
            e.Property(x => x.Titulo).HasMaxLength(150).IsRequired();
            e.Property(x => x.AreaJuridica).HasMaxLength(30);
            e.Property(x => x.Status).HasMaxLength(30);
            e.Property(x => x.Descricao).HasMaxLength(2000);
            e.Property(x => x.Observacoes).HasMaxLength(1000);
            // Cliente com processos não pode ser excluído
            e.HasOne(x => x.Cliente).WithMany(c => c.Processos)
                .HasForeignKey(x => x.ClienteId).OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<Prazo>(e =>
        {
            e.Property(x => x.Titulo).HasMaxLength(150).IsRequired();
            e.Property(x => x.Descricao).HasMaxLength(1000);
            e.Property(x => x.Prioridade).HasMaxLength(20);
            e.Property(x => x.Status).HasMaxLength(20);
            e.HasOne(x => x.Processo).WithMany(p => p.Prazos)
                .HasForeignKey(x => x.ProcessoId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Tarefa>(e =>
        {
            e.Property(x => x.Titulo).HasMaxLength(150).IsRequired();
            e.Property(x => x.Descricao).HasMaxLength(1000);
            e.Property(x => x.Responsavel).HasMaxLength(80).IsRequired();
            e.Property(x => x.Prioridade).HasMaxLength(20);
            e.Property(x => x.Status).HasMaxLength(20);
            e.HasOne(x => x.Processo).WithMany(p => p.Tarefas)
                .HasForeignKey(x => x.ProcessoId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Atividade>(e =>
        {
            e.Property(x => x.Descricao).HasMaxLength(300).IsRequired();
            e.HasIndex(x => new { x.UsuarioId, x.Data });
        });

        // Isolamento por escritório: toda consulta só enxerga os registros do usuário logado.
        b.Entity<Cliente>().HasQueryFilter(x => x.UsuarioId == CurrentUserId);
        b.Entity<Processo>().HasQueryFilter(x => x.UsuarioId == CurrentUserId);
        b.Entity<Prazo>().HasQueryFilter(x => x.UsuarioId == CurrentUserId);
        b.Entity<Tarefa>().HasQueryFilter(x => x.UsuarioId == CurrentUserId);
        b.Entity<Atividade>().HasQueryFilter(x => x.UsuarioId == CurrentUserId);
        foreach (var t in new[] { typeof(Cliente), typeof(Processo), typeof(Prazo), typeof(Tarefa), typeof(Atividade) })
        {
            b.Entity(t).HasOne(typeof(Usuario)).WithMany().HasForeignKey(nameof(IOwned.UsuarioId))
                .OnDelete(DeleteBehavior.NoAction);
            b.Entity(t).HasIndex(nameof(IOwned.UsuarioId));
        }
    }

    /// <summary>Novos registros recebem automaticamente o escritório logado.</summary>
    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var e in ChangeTracker.Entries<IOwned>())
        {
            if (e.State == EntityState.Added && e.Entity.UsuarioId == Guid.Empty)
            {
                if (CurrentUserId == Guid.Empty)
                    throw new InvalidOperationException("Registro sem escritório: usuário não identificado.");
                e.Entity.UsuarioId = CurrentUserId;
            }
            else if (e.State == EntityState.Modified)
            {
                e.Property(x => x.UsuarioId).IsModified = false; // nunca troca de dono
            }
        }
        return base.SaveChangesAsync(ct);
    }
}
