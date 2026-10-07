using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JurisTech.Api.Data;
using JurisTech.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace JurisTech.Api.Services;

public class TokenService(IConfiguration config)
{
    public (string Token, DateTime ExpiresAt) Create(Usuario u)
    {
        var jwt = config.GetSection("Jwt");
        var expires = DateTime.UtcNow.AddHours(jwt.GetValue("ExpiresHours", 8));
        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
            SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, u.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, u.Email),
                new Claim(ClaimTypes.Name, u.Nome),
            ],
            expires: expires,
            signingCredentials: creds);
        return (new JwtSecurityTokenHandler().WriteToken(token), expires);
    }
}

/// <summary>Registra o histórico exibido em "Atividades recentes".</summary>
public class ActivityService(AppDbContext db)
{
    public void Log(string descricao) => db.Atividades.Add(new Atividade { Descricao = descricao });
}

/// <summary>Escritório (usuário) da requisição atual, lido do token JWT.</summary>
public interface ICurrentUser
{
    Guid Id { get; }
}

public class HttpCurrentUser(IHttpContextAccessor http) : ICurrentUser
{
    public Guid Id
    {
        get
        {
            var u = http.HttpContext?.User;
            var v = u?.FindFirstValue(ClaimTypes.NameIdentifier) ?? u?.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return Guid.TryParse(v, out var id) ? id : Guid.Empty;
        }
    }
}
