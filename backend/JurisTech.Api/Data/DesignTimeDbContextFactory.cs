using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace JurisTech.Api.Data;

/// <summary>
/// Usado só pelas ferramentas do EF (dotnet ef) para gerar migrações sem iniciar a API.
/// Lê a connection string de appsettings + variáveis de ambiente (ConnectionStrings__Default).
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile($"appsettings.{env}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(config.GetConnectionString("Default"))
            .Options;
        return new AppDbContext(options);
    }
}
