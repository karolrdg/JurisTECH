import { describe, expect, it } from "vitest";
import { getPrazoStatus, isValidCpf } from "@/utils/format";

const today = new Date("2026-10-06T12:00:00");

describe("prazo status", () => {
  it("pending deadline in the past is Atrasado", () => {
    expect(getPrazoStatus({ status: "Pendente", dataLimite: "2026-10-05" }, today)).toBe("Atrasado");
  });
  it("deadline due today stays Pendente", () => {
    expect(getPrazoStatus({ status: "Pendente", dataLimite: "2026-10-06" }, today)).toBe("Pendente");
  });
  it("completed deadline is never Atrasado", () => {
    expect(getPrazoStatus({ status: "Concluído", dataLimite: "2026-01-01" }, today)).toBe("Concluído");
  });
});

describe("cpf validation", () => {
  it("accepts a valid CPF", () => expect(isValidCpf("123.456.789-09")).toBe(true));
  it("rejects wrong check digits", () => expect(isValidCpf("123.456.789-00")).toBe(false));
  it("rejects repeated digits", () => expect(isValidCpf("111.111.111-11")).toBe(false));
});
