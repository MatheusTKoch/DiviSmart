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
  if (n === 0) return null;

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

  return varianciaIndice === 0 ? null : covariancia / varianciaIndice;
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

    const mapaBenchmark = new Map(
      historicoBenchmark.map((item) => [
        item.date.toISOString().split("T")[0],
        item.close,
      ])
    );

    const precosAcao = [];
    const precosBenchmark = [];

    historicoAcao.forEach((item) => {
      const dataStr = item.date.toISOString().split("T")[0];
      if (mapaBenchmark.has(dataStr) && item.close) {
        precosAcao.push(item.close);
        precosBenchmark.push(mapaBenchmark.get(dataStr));
      }
    });

    const retornosAcao = calcularRetornosDiarios(precosAcao);
    const retornosBenchmark = calcularRetornosDiarios(precosBenchmark);

    const beta = calcularBeta(retornosAcao, retornosBenchmark);
    return beta ? parseFloat(beta.toFixed(4)) : null;
  } catch (err) {
    console.error(`Erro ao obter Beta para ${ticker}:`, err.message);
    return null;
  }
}