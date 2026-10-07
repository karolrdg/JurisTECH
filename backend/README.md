# JURIS+TECH — API (ASP.NET Core 8 + EF Core + SQL Server)

## Requisitos
- .NET 8 SDK — https://dotnet.microsoft.com/download
- SQL Server (Express, Developer ou LocalDB)

## Configurar
Edite `JurisTech.Api/appsettings.json` → `ConnectionStrings:Default`. Exemplos:

```
Server=localhost;Database=JurisTech;Trusted_Connection=True;TrustServerCertificate=True
Server=(localdb)\\MSSQLLocalDB;Database=JurisTech;Trusted_Connection=True
Server=localhost,1433;Database=JurisTech;User Id=sa;Password=SUA_SENHA;TrustServerCertificate=True
```

A chave JWT de desenvolvimento está em `appsettings.Development.json`. Em produção, defina
`Jwt__Key` como variável de ambiente (mínimo 32 caracteres) — nunca grave no repositório.

## Rodar
```
cd backend/JurisTech.Api
dotnet run
```
- API: http://localhost:5000/api
- Swagger: http://localhost:5000/swagger

Na primeira execução o banco é criado e recebe dados fictícios.
Login de demonstração: `demo@jurismaistech.com` / `demo123`.

## Ligar o frontend
No arquivo `.env` do frontend:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```

## Endpoints
| Recurso   | Rotas |
|-----------|-------|
| Auth      | POST /api/auth/login · POST /api/auth/logout |
| Clientes  | GET/POST /api/clientes · GET/PUT/DELETE /api/clientes/{id} |
| Processos | GET/POST /api/processos · GET/PUT/DELETE /api/processos/{id} |
| Prazos    | GET/POST /api/prazos · GET/PUT/DELETE /api/prazos/{id} |
| Tarefas   | GET/POST /api/tarefas · GET/PUT/DELETE /api/tarefas/{id} |
| Dashboard | GET /api/dashboard |

Todas as rotas, exceto login, exigem `Authorization: Bearer <token>`.

## Regras
- CPF validado e único; número de processo único.
- Cliente com processos não pode ser excluído (409).
- Excluir processo remove seus prazos e tarefas.
- Status "Atrasado" de prazo não é gravado — é calculado na tela.
- Senhas com hash (PasswordHasher do ASP.NET Identity).

## Banco de dados e migrações

O banco é versionado com migrações do Entity Framework (pasta `JurisTech.Api/Data/Migrations`).
A primeira migração, `Inicial`, cria todas as tabelas.

### Comportamento por ambiente
| Configuração (`Database`) | Desenvolvimento | Produção |
|---------------------------|-----------------|----------|
| `AutoMigrate` — atualiza o banco ao iniciar | ligado | desligado |
| `SeedDemoData` — dados fictícios se vazio  | ligado | desligado |

### Desenvolvimento
Basta `dotnet run`: o banco é criado/atualizado sozinho e recebe os dados de demonstração.

### Produção (escolha uma opção no deploy)
1. **Comando da própria API** (recomendado):
   ```
   ConnectionStrings__Default="..." dotnet JurisTech.Api.dll --migrate
   ```
   Aplica só as migrações pendentes e encerra. Depois inicie a API normalmente.
2. **Script SQL para o DBA:** `backend/database/migrations.sql` é idempotente
   (pode ser rodado várias vezes; só aplica o que falta).

Use `appsettings.Production.example.json` como modelo. Senha do banco e `Jwt__Key`
devem vir de variáveis de ambiente, nunca do repositório.

### Alterar o banco (nova migração)
```
dotnet tool install --global dotnet-ef --version 8.0.8
cd backend/JurisTech.Api
dotnet ef migrations add NomeDaMudanca -o Data/Migrations
dotnet ef migrations script --idempotent -o ../database/migrations.sql
```
Para desfazer a última migração ainda não aplicada: `dotnet ef migrations remove`.
