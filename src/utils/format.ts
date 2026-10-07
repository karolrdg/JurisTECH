import type { PrazoDto, PrazoStatus } from "@/types";

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function daysUntil(iso: string, today: Date = new Date()): number {
  const t = new Date(toISODate(today) + "T00:00:00");
  const d = new Date(iso.slice(0, 10) + "T00:00:00");
  return Math.round((d.getTime() - t.getTime()) / 86_400_000);
}

/** A pending deadline whose date has passed is "Atrasado". */
export function getPrazoStatus(
  p: Pick<PrazoDto, "status" | "dataLimite">,
  today: Date = new Date(),
): PrazoStatus {
  if (p.status === "Concluído") return "Concluído";
  return daysUntil(p.dataLimite, today) < 0 ? "Atrasado" : "Pendente";
}

export function onlyDigits(v: string): string {
  return v.replace(/\D/g, "");
}

export function formatCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatTelefone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export function isValidCpf(v: string): boolean {
  const c = onlyDigits(v);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const dv = (base: string) => {
    let s = 0;
    for (let i = 0; i < base.length; i++) s += Number(base[i]) * (base.length + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(c.slice(0, 9)) === Number(c[9]) && dv(c.slice(0, 10)) === Number(c[10]);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
