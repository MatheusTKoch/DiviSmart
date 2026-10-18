import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  itemValue,
  totalValue,
  type DividendReportItem,
} from "../../src/scripts/utils/reportGenerator";

const item = (
  overrides: Partial<DividendReportItem> = {},
): DividendReportItem => ({
  DataPagamento: "2024-03-15",
  ValorPagamento: 1.5,
  Quantidade: 10,
  Ticker: "PETR4",
  Descricao: "Dividendo",
  ...overrides,
});

describe("itemValue", () => {
  it("multiplica valor pelo quantidade", () => {
    expect(itemValue(item())).toBe(15);
  });

  it("trata valores ausentes como zero", () => {
    expect(
      itemValue(
        item({ ValorPagamento: "", Quantidade: "" } as unknown as DividendReportItem),
      ),
    ).toBe(0);
  });
});

describe("totalValue", () => {
  it("soma o valor de todos os itens", () => {
    const items = [
      item({ ValorPagamento: 2, Quantidade: 5 }),
      item({ ValorPagamento: 1.25, Quantidade: 4 }),
    ];
    expect(totalValue(items)).toBe(15);
  });

  it("retorna 0 para lista vazia", () => {
    expect(totalValue([])).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("formata em BRL (pt-BR)", () => {
    const formatted = formatCurrency(1234.56);
    expect(formatted).toMatch(/R\$/);
    expect(formatted).toContain("1.234,56");
  });

  it("formata zero corretamente", () => {
    expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
  });
});

describe("formatDate", () => {
  it("converte YYYY-MM-DD para DD/MM/YYYY", () => {
    expect(formatDate("2024-03-15")).toBe("15/03/2024");
  });

  it("aceita datetime ISO e usa só a data", () => {
    expect(formatDate("2024-03-15T12:00:00.000Z")).toBe("15/03/2024");
  });

  it("retorna '-' para string vazia", () => {
    expect(formatDate("")).toBe("-");
  });

  it("devolve o valor original quando o formato não é data ISO", () => {
    expect(formatDate("15/03/2024")).toBe("15/03/2024");
  });
});
