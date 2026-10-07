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
[Route("api/tarefas")]
public class TarefasController(AppDbContext db, ActivityService log) : ControllerBase
{
    [HttpGet]
    public async Task<List<Tarefa>> List() =>
        await db.Tarefas.AsNoTracking().OrderBy(t => t.Prazo).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Tarefa>> Get(Guid id) =>
        await db.Tarefas.FirstOrDefaultAsync(x => x.Id == id) is { } t ? t : NotFound();

    [HttpPost]
    public async Task<ActionResult<Tarefa>> Create(TarefaInput i)
    {
        if (!await db.Processos.AnyAsync(p => p.Id == i.ProcessoId))
            return BadRequest(new ErroDto("Processo não encontrado."));
        var t = new Tarefa();
        Apply(t, i);
        db.Tarefas.Add(t);
        log.Log($"Tarefa “{t.Titulo}” criada.");
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = t.Id }, t);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Tarefa>> Update(Guid id, TarefaInput i)
    {
        var t = await db.Tarefas.FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        if (!await db.Processos.AnyAsync(p => p.Id == i.ProcessoId))
            return BadRequest(new ErroDto("Processo não encontrado."));
        Apply(t, i);
        log.Log($"Tarefa “{t.Titulo}” atualizada.");
        await db.SaveChangesAsync();
        return t;
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var t = await db.Tarefas.FirstOrDefaultAsync(x => x.Id == id);
        if (t is null) return NotFound();
        db.Tarefas.Remove(t);
        log.Log($"Tarefa “{t.Titulo}” excluída.");
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Tarefa t, TarefaInput i)
    {
        t.ProcessoId = i.ProcessoId;
        t.Titulo = i.Titulo.Trim();
        t.Descricao = i.Descricao;
        t.Responsavel = i.Responsavel.Trim();
        t.Prazo = i.Prazo;
        t.Prioridade = i.Prioridade;
        t.Status = i.Status;
    }
}
