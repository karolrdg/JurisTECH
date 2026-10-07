using System.Text;
using System.Text.Json.Serialization;
using JurisTech.Api.Data;
using JurisTech.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, HttpCurrentUser>();

// Banco de dados (SQL Server via EF Core)
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(config.GetConnectionString("Default")));

// Autenticação JWT
var jwt = config.GetSection("Jwt");
var key = jwt["Key"];
if (string.IsNullOrWhiteSpace(key) || key.Length < 32)
    throw new InvalidOperationException("Configure Jwt:Key com pelo menos 32 caracteres.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwt["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1),
    });
builder.Services.AddAuthorization();

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<ActivityService>();

builder.Services.AddControllers().AddJsonOptions(o =>
    o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull);

// CORS para o frontend React
var origins = config.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:8080"];
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

// Swagger com botão "Authorize" para o token
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "JURIS+TECH API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { [scheme] = [] });
});

var app = builder.Build();

// Banco: aplica migrações / dados de demonstração conforme appsettings (seção "Database").
// "--migrate" só atualiza o banco e encerra (use no deploy de produção).
var migrateOnly = args.Contains("--migrate");
await DatabaseSetup.ApplyAsync(app.Services, config, app.Logger, force: migrateOnly);
if (migrateOnly) return;

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await app.RunAsync();
