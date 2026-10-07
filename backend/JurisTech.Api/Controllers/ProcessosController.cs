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
[Route("api/processos")]
public class ProcessosController(AppDbContext db, ActivityService log) : ControllerBase
{
    [HttpGet]
    public async Task<List<Processo>> List() =>
        await db.Processos.AsNoTracking().OrderByDescending(p => p.AtualizadoEm).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Processo>> Get(Guid id) =>
        await db.Processos.FindAsync(id) is { } p ? p : NotFound();

    [HttpPost]
    public async Task<ActionResult<Processo>> Create(ProcessoInput i)
    {
        if (await Validate(i, null) is { } erro) return erro;
        var p = new Processo();
        Apply(p, i);
        db.Processos.Add(p);
        log.Log($"Processo “{p.Titulo}” cadastrado.");
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Processo>> Update(Guid id, ProcessoInput i)
    {
        var p = await db.Processos.FindAsync(id);
        if (p is null) return NotFound();
        if (await Validate(i, id) is { } erro) return erro;
        Apply(p, i);
        log.Log($"Processo “{p.Titulo}” atualizado para {p.Status}.");
        await db.SaveChangesAsync();
        return p;
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var p = await db.Processos.FindAsync(id);
        if (p is null) return NotFound();
        db.Processos.Remove(p); // prazos e tarefas do processo são removidos junto
        log.Log($"Processo “{p.Titulo}” excluído.");
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<ActionResult?> Validate(ProcessoInput i, Guid? id)
    {
        if (!await db.Clientes.AnyAsync(c => c.Id == i.ClienteId))
            return BadRequest(new ErroDto("Cliente não encontrado."));
        if (i.DataEncerramento is { } fim && fim < i.DataAbertura)
            return BadRequest(new ErroDto("O encerramento não pode ser anterior à abertura."));
        if (await db.Processos.AnyAsync(p => p.NumeroProcesso == i.NumeroProcesso && p.Id != id))
            return Conflict(new ErroDto("Já existe um processo com este número."));
        return null;
    }

    private static void Apply(Processo p, ProcessoInput i)
    {
        p.NumeroProcesso = i.NumeroProcesso.Trim();
        p.ClienteId = i.ClienteId;
        p.Titulo = i.Titulo.Trim();
        p.AreaJuridica = i.AreaJuridica;
        p.Status = i.Status;
        p.DataAbertura = i.DataAbertura;
        p.DataEncerramento = i.DataEncerramento;
        p.Descricao = i.Descricao;
        p.Observacoes = i.Observacoes;
        p.AtualizadoEm = DateOnly.FromDateTime(DateTime.Today);
    }
}
