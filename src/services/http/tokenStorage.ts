import type { UsuarioDto } from "@/types";

/**
 * Session storage keeps the JWT only for the browser tab lifetime.
 * In production prefer an HttpOnly cookie issued by the API.
 */
const TOKEN = "jt.token";
const EXP = "jt.exp";
const USER = "jt.user";

const store = () => (typeof window === "undefined" ? null : window.sessionStorage);

export const tokenStorage = {
  get(): string | null {
    const s = store();
    if (!s) return null;
    const exp = s.getItem(EXP);
    if (exp && new Date(exp).getTime() < Date.now()) {
      this.clear();
      return null;
    }
    return s.getItem(TOKEN);
  },
  getUser(): UsuarioDto | null {
    const raw = store()?.getItem(USER);
    try {
      return raw ? (JSON.parse(raw) as UsuarioDto) : null;
    } catch {
      return null;
    }
  },
  set(token: string, expiresAt: string, user: UsuarioDto) {
    const s = store();
    s?.setItem(TOKEN, token);
    s?.setItem(EXP, expiresAt);
    s?.setItem(USER, JSON.stringify(user));
  },
  clear() {
    const s = store();
    s?.removeItem(TOKEN);
    s?.removeItem(EXP);
    s?.removeItem(USER);
  },
};
