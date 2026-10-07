using JurisTech.Api.Data;
using JurisTech.Api.Dtos;
using JurisTech.Api.Models;
using JurisTech.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JurisTech.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null ||
            new PasswordHasher<Usuario>().VerifyHashedPassword(user, user.SenhaHash, req.Password)
                == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new ErroDto("E-mail ou senha incorretos."));
        }

        var (token, expiresAt) = tokens.Create(user);
        return new LoginResponse(token, expiresAt, new UsuarioDto(user.Id, user.Nome, user.Email));
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Register(RegisterRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (await db.Usuarios.AnyAsync(u => u.Email == email))
            return Conflict(new ErroDto("Já existe uma conta com este e-mail."));

        var user = new Usuario { Nome = req.Nome.Trim(), Email = email };
        user.SenhaHash = new PasswordHasher<Usuario>().HashPassword(user, req.Password);
        db.Usuarios.Add(user);
        await db.SaveChangesAsync();

        var (token, expiresAt) = tokens.Create(user);
        return new LoginResponse(token, expiresAt, new UsuarioDto(user.Id, user.Nome, user.Email));
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout() => NoContent();
}
