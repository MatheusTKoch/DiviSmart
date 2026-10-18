import { describe, expect, it } from "vitest";
import {
  calcularBeta,
  calcularRetornosDiarios,
} from "../../src/scripts/utils/betaCalculator.js";

describe("calcularRetornosDiarios", () => {
  it("calcula retornos diários a partir de uma série de preços", () => {
    expect(calcularRetornosDiarios([100, 110, 99])).toEqual([0.1, -0.1]);
  });

  it("retorna lista vazia com menos de 2 preços", () => {
    expect(calcularRetornosDiarios([])).toEqual([]);
    expect(calcularRetornosDiarios([42])).toEqual([]);
  });
});

describe("calcularBeta", () => {
  it("calcula beta quando há covariância e variância válidas", () => {
    const retornosAcao = [0.02, -0.01, 0.03, 0.01];
    const retornosIndice = [0.01, -0.005, 0.015, 0.005];
    const beta = calcularBeta(retornosAcao, retornosIndice);

    expect(beta).not.toBeNull();
    expect(beta!).toBeCloseTo(2, 5);
  });

  it("retorna null com séries curtas demais (n < 2)", () => {
    expect(calcularBeta([0.01], [0.02])).toBeNull();
    expect(calcularBeta([], [])).toBeNull();
  });

  it("retorna null quando a variância do índice é zero", () => {
    // usa 0 exato para evitar erro de ponto flutuante (ex.: 0.05+0.05+0.05)
    expect(calcularBeta([0.01, 0.02, 0.03], [0, 0, 0])).toBeNull();
  });

  it("usa o menor comprimento entre as duas séries", () => {
    const betaCurto = calcularBeta([0.02, -0.01], [0.01, -0.005, 0.1]);
    const betaPar = calcularBeta([0.02, -0.01], [0.01, -0.005]);
    expect(betaCurto).toBeCloseTo(betaPar!, 10);
  });
});
