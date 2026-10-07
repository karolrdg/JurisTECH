using JurisTech.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
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
            e.HasIndex(x => x.Cpf).IsUnique();
            e.Property(x => x.Email).HasMaxLength(160).IsRequired();
            e.Property(x => x.Telefone).HasMaxLength(20).IsRequired();
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.Observacoes).HasMaxLength(1000);
        });

        b.Entity<Processo>(e =>
        {
            e.Property(x => x.NumeroProcesso).HasMaxLength(30).IsRequired();
            e.HasIndex(x => x.NumeroProcesso).IsUnique();
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
            e.HasIndex(x => x.Data);
        });
    }
}
