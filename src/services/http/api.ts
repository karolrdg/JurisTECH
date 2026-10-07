import axios, { AxiosError } from "axios";
import { tokenStorage } from "./tokenStorage";

/** Central Axios instance for the ASP.NET Core REST API. */
export const api = axios.create({
  baseURL: import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:5000/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ message?: string; title?: string }>) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?expirado=1");
      }
    }
    return Promise.reject(new Error(getErrorMessage(error)));
  },
);

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (!error.response) return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    const s = error.response.status;
    if (s === 400)
      return (
        error.response.data?.message ??
        error.response.data?.title ??
        "Dados inválidos. Revise os campos."
      );
    if (s === 401) return error.response.data?.message ?? "Sua sessão expirou. Entre novamente.";
    if (s === 403) return "Você não tem permissão para esta ação.";
    if (s === 404) return "Registro não encontrado.";
    if (s === 409) return error.response.data?.message ?? "Conflito com um registro existente.";
    if (s >= 500) return "Erro no servidor. Tente novamente em instantes.";
  }
  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado.";
}
