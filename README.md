# JURIS+TECH

Gestão administrativa de processos jurídicos para pequenos escritórios de advocacia (MVP de demonstração). **Não fornece aconselhamento jurídico.** Todos os dados são fictícios.

## Funcionalidades
Login (JWT), dashboard com indicadores, CRUD de clientes, processos, prazos e tarefas, pesquisa e filtros, destaque de prazos atrasados (ícone + texto + cor), atividades recentes, estados de carregamento/vazio/erro, confirmação de exclusão.

## Stack
- Frontend: React 19 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Lucide, TanStack Router (roteamento de arquivos), TanStack Query, Axios, React Hook Form, Zod.
- Backend (a implementar): ASP.NET Core Web API, EF Core, JWT, Swagger.
- Banco: SQL Server (acessado apenas pela API).

```
React → Axios → REST API (ASP.NET Core) → EF Core → SQL Server
```

## Estrutura
```
src/
  routes/        páginas (login, dashboard, clientes, processos, prazos, tarefas, configuracoes)
  components/    common (badges, estados, diálogos), forms, lists, layout, ui (shadcn)
  hooks/         useAuth, useResource (React Query), useLookups
  services/      http/api.ts (Axios + JWT), crud.ts, mock/ (dados fictícios), index.ts
  schemas/       validações Zod
  types/         DTOs
  utils/         formatação, CPF, regra de prazo atrasado
```

## Trocar Mock → API
Defina `VITE_USE_MOCK=false` e `VITE_API_BASE_URL`. Cada serviço usa `createApiCrud(path)` com os endpoints:

| Recurso | Endpoints |
|---|---|
| Auth | POST /api/auth/login, /register, /refresh, /logout |
| Clientes | GET/POST /api/clientes · GET/PUT/DELETE /api/clientes/{id} |
| Processos | GET/POST /api/processos · GET/PUT/DELETE /api/processos/{id} |
| Prazos | GET/POST /api/prazos · GET/PUT/DELETE /api/prazos/{id} |
| Tarefas | GET/POST /api/tarefas · GET/PUT/DELETE /api/tarefas/{id} |
| Dashboard | GET /api/dashboard |

## Entidades e relacionamentos
Cliente 1:N Processo · Processo 1:N Prazo · Processo 1:N Tarefa. Campos conforme `src/types/index.ts`.

## Execução
```
bun install
cp .env.example .env
bun run dev
```
Acesso de demonstração (modo mock): `demo@jurismaistech.com` / `demo123`.

## Segurança
Token JWT em sessionStorage (encerra com a aba; em produção prefira cookie HttpOnly), interceptor 401 → login, nenhuma senha/segredo/connection string no frontend.
