import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "@/services";
import { tokenStorage } from "@/services/http/tokenStorage";
import type { LoginRequest, UsuarioDto } from "@/types";

interface AuthState {
  ready: boolean;
  user: UsuarioDto | null;
  login: (req: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UsuarioDto | null>(null);

  useEffect(() => {
    setUser(tokenStorage.get() ? tokenStorage.getUser() : null);
    setReady(true);
  }, []);

  const login = useCallback(async (req: LoginRequest) => {
    const res = await authService.login(req);
    tokenStorage.set(res.token, res.expiresAt, res.usuario);
    setUser(res.usuario);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    tokenStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ ready, user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
