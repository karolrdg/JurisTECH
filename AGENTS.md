<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- UI talks only to `src/services` (never to mocks directly); `VITE_USE_MOCK` switches mock CRUD ↔ Axios REST CRUD so an ASP.NET Core API can be plugged in without UI changes.
- No Supabase/Lovable Cloud: persistence belongs to the external ASP.NET Core + SQL Server backend.
- Auth gate is client-side in `src/routes/_app.tsx` (session token is browser-only); real authorization must be enforced by the API.
- "Atrasado" deadline status is derived at read time (`getPrazoStatus`), not stored, so it never goes stale.
- Backend source lives in `backend/JurisTech.Api` (ASP.NET Core 8 + EF Core SQL Server + JWT); it is not run inside Lovable, and its JSON contract must match `src/types`.
