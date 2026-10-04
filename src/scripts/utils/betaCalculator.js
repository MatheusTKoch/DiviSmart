import yahooFinance from "yahoo-finance2";

function calcularRetornosDiarios(precos) {
  const retornos = [];
  for (let i = 1; i < precos.length; i++) {
    retornos.push((precos[i] - precos[i - 1]) / precos[i - 1]);
  }
  return retornos;
}

function calcularBeta(retornosAcao, retornosIndice) {
  const n = Math.min(retornosAcao.length, retornosIndice.length);
  if (n < 2) return null;

  const mediaAcao = retornosAcao.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const mediaIndice = retornosIndice.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let covariancia = 0;
  let varianciaIndice = 0;

  for (let i = 0; i < n; i++) {
    const diffAcao = retornosAcao[i] - mediaAcao;
    const diffIndice = retornosIndice[i] - mediaIndice;

    covariancia += diffAcao * diffIndice;
    varianciaIndice += diffIndice * diffIndice;
  }

  const beta = varianciaIndice === 0 ? null : covariancia / varianciaIndice;
  return Number.isFinite(beta) ? beta : null;
}


export async function obterBetaAtivo(ticker, periodoAnos = 1) {
  try {
    const symbol = ticker.endsWith(".SA") ? ticker : `${ticker}.SA`;
    const benchmark = "^BVSP";

    const hoje = new Date();
    const dataInicio = new Date();
    dataInicio.setFullYear(hoje.getFullYear() - periodoAnos);

    const queryOptions = {
      period1: dataInicio.toISOString().split("T")[0],
      period2: hoje.toISOString().split("T")[0],
      interval: "1d",
    };

    const [historicoAcao, historicoBenchmark] = await Promise.all([
      yahooFinance.historical(symbol, queryOptions),
      yahooFinance.historical(benchmark, queryOptions),
    ]);

    if (!historicoAcao.length || !historicoBenchmark.length) {
      return null;
    }

    const precosAcaoPorData = new Map(
      historicoAcao
        .filter((item) => Number.isFinite(item.close) && item.close > 0)
        .map((item) => [
          item.date.toISOString().split("T")[0],
          item.close,
        ])
    );
    const precosBenchmarkPorData = new Map(
      historicoBenchmark
        .filter((item) => Number.isFinite(item.close) && item.close > 0)
        .map((item) => [
          item.date.toISOString().split("T")[0],
          item.close,
        ])
    );

    const datasComuns = [...precosAcaoPorData.keys()]
      .filter((data) => precosBenchmarkPorData.has(data))
      .sort();
    const precosAcao = datasComuns.map((data) => precosAcaoPorData.get(data));
    const precosBenchmark = datasComuns.map((data) =>
      precosBenchmarkPorData.get(data)
    );

    const retornosAcao = calcularRetornosDiarios(precosAcao);
    const retornosBenchmark = calcularRetornosDiarios(precosBenchmark);

    const beta = calcularBeta(retornosAcao, retornosBenchmark);
    return beta === null ? null : parseFloat(beta.toFixed(4));
  } catch (err) {
    console.error(`Erro ao obter Beta para ${ticker}:`, err.message);
    return null;
  }
}