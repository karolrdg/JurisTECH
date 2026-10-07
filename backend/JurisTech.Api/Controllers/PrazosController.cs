using JurisTech.Api.Data;
using JurisTech.Api.Dtos;
using JurisTech.Api.Models;
using JurisTech.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/prazos")]
public class PrazosController(AppDbContext db, ActivityService log) : ControllerBase
{
    [HttpGet]
    public async Task<List<Prazo>> List() =>
        await db.Prazos.AsNoTracking().OrderBy(p => p.DataLimite).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Prazo>> Get(Guid id) =>
        await db.Prazos.FindAsync(id) is { } p ? p : NotFound();

    [HttpPost]
    public async Task<ActionResult<Prazo>> Create(PrazoInput i)
    {
        if (!await db.Processos.AnyAsync(p => p.Id == i.ProcessoId))
            return BadRequest(new ErroDto("Processo não encontrado."));
        var p = new Prazo();
        Apply(p, i);
        db.Prazos.Add(p);
        log.Log($"Prazo “{p.Titulo}” cadastrado.");
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Prazo>> Update(Guid id, PrazoInput i)
    {
        var p = await db.Prazos.FindAsync(id);
        if (p is null) return NotFound();
        if (!await db.Processos.AnyAsync(x => x.Id == i.ProcessoId))
            return BadRequest(new ErroDto("Processo não encontrado."));
        var concluiuAgora = p.Status != "Concluído" && i.Status == "Concluído";
        Apply(p, i);
        log.Log(concluiuAgora ? $"Prazo “{p.Titulo}” concluído." : $"Prazo “{p.Titulo}” atualizado.");
        await db.SaveChangesAsync();
        return p;
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var p = await db.Prazos.FindAsync(id);
        if (p is null) return NotFound();
        db.Prazos.Remove(p);
        log.Log($"Prazo “{p.Titulo}” excluído.");
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Prazo p, PrazoInput i)
    {
        p.ProcessoId = i.ProcessoId;
        p.Titulo = i.Titulo.Trim();
        p.Descricao = i.Descricao;
        p.DataLimite = i.DataLimite;
        p.Prioridade = i.Prioridade;
        p.Status = i.Status;
    }
}
