using JurisTech.Api.Data;
using JurisTech.Api.Dtos;
using JurisTech.Api.Models;
using JurisTech.Api.Services;
using JurisTech.Api.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/clientes")]
public class ClientesController(AppDbContext db, ActivityService log) : ControllerBase
{
    [HttpGet]
    public async Task<List<Cliente>> List() =>
        await db.Clientes.AsNoTracking().OrderBy(c => c.NomeCompleto).ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Cliente>> Get(Guid id) =>
        await db.Clientes.FirstOrDefaultAsync(x => x.Id == id) is { } c ? c : NotFound();

    [HttpPost]
    public async Task<ActionResult<Cliente>> Create(ClienteInput i)
    {
        var cpf = CpfAttribute.Digits(i.Cpf);
        if (await db.Clientes.AnyAsync(c => c.Cpf == cpf))
            return Conflict(new ErroDto("Já existe um cliente com este CPF."));

        var c = new Cliente();
        Apply(c, i, cpf);
        db.Clientes.Add(c);
        log.Log($"Cliente {c.NomeCompleto} cadastrado.");
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Cliente>> Update(Guid id, ClienteInput i)
    {
        var c = await db.Clientes.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        var cpf = CpfAttribute.Digits(i.Cpf);
        if (await db.Clientes.AnyAsync(x => x.Cpf == cpf && x.Id != id))
            return Conflict(new ErroDto("Já existe um cliente com este CPF."));

        Apply(c, i, cpf);
        log.Log($"Cliente {c.NomeCompleto} atualizado.");
        await db.SaveChangesAsync();
        return c;
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var c = await db.Clientes.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        if (await db.Processos.AnyAsync(p => p.ClienteId == id))
            return Conflict(new ErroDto("Este cliente possui processos vinculados e não pode ser excluído."));

        db.Clientes.Remove(c);
        log.Log($"Cliente {c.NomeCompleto} excluído.");
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Cliente c, ClienteInput i, string cpf)
    {
        c.NomeCompleto = i.NomeCompleto.Trim();
        c.Cpf = cpf;
        c.Email = i.Email.Trim();
        c.Telefone = CpfAttribute.Digits(i.Telefone);
        c.Status = i.Status;
        c.Observacoes = i.Observacoes;
    }
}
