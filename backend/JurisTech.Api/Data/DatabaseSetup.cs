using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Data;

/// <summary>
/// Aplica migrações e (opcionalmente) dados de demonstração conforme a configuração:
///   Database:AutoMigrate    → aplica migrações pendentes ao iniciar a API
///   Database:SeedDemoData   → insere dados fictícios se o banco estiver vazio
/// Em produção ambos ficam desligados; rode "dotnet JurisTech.Api.dll --migrate" no deploy.
/// </summary>
public static class DatabaseSetup
{
    public static async Task ApplyAsync(IServiceProvider services, IConfiguration config, ILogger logger, bool force = false)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (force || config.GetValue("Database:AutoMigrate", false))
        {
            var pendentes = (await db.Database.GetPendingMigrationsAsync()).ToList();
            if (pendentes.Count == 0)
            {
                logger.LogInformation("Banco de dados já está atualizado.");
            }
            else
            {
                logger.LogInformation("Aplicando {Count} migração(ões): {List}", pendentes.Count, string.Join(", ", pendentes));
                await db.Database.MigrateAsync();
                logger.LogInformation("Migrações aplicadas com sucesso.");
            }
        }

        if (config.GetValue("Database:SeedDemoData", false))
        {
            DbSeeder.Seed(db);
        }
    }
}
