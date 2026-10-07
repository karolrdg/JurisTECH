using JurisTech.Api.Data;
using JurisTech.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<DashboardDto> Get()
    {
        var hoje = DateOnly.FromDateTime(DateTime.Today);
        var limite = hoje.AddDays(7);
        return new DashboardDto(
            await db.Processos.CountAsync(p => p.Status != "Encerrado"),
            await db.Clientes.CountAsync(c => c.Status == "Ativo"),
            await db.Prazos.CountAsync(p => p.Status == "Pendente" && p.DataLimite >= hoje && p.DataLimite <= limite),
            await db.Tarefas.CountAsync(t => t.Status != "Concluída"),
            await db.Atividades.AsNoTracking().OrderByDescending(a => a.Data).Take(6)
                .Select(a => new AtividadeDto(a.Id, a.Descricao, a.Data)).ToListAsync());
    }
}
