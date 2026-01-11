import axios from "axios";
import * as cheerio from "cheerio";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const db = new Pool({
  host: process.env.VITE_HOST_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  database: process.env.VITE_DATABASE_DB,
});

const ACOES_URL = process.env.VITE_URL_ACOES_DIVIDENDOS;

// CONFIGURAÇÕES
const MAX_RETRIES = 3; // Número máximo de tentativas por ticker
const RETRY_DELAY = 5000; // Tempo de espera entre tentativas (5s)
const REQUEST_TIMEOUT = 15000; // Tempo máximo para a página responder (15s)

async function getAcoes() {
  const query = 'SELECT "acaoid", "ticker" FROM acoes';
  const client = await db.connect();
  try {
    const res = await client.query(query);
    return res.rows;
  } finally {
    client.release();
  }
}

function formatarData(dataStr) {
  if (!dataStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
    return null;
  }
  return dataStr.split("/").reverse().join("-");
}

async function getDividendos(ticker) {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const tickerUpper = ticker.toUpperCase();
      const url = `${ACOES_URL}${tickerUpper}`;

      console.log(
        `[Tentativa ${attempts + 1}/${MAX_RETRIES}] Buscando: ${url}`
      );

      const response = await axios.get(url, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(response.data);
      const dividendos = [];
      const tableSelector = "#resultado tbody tr";

      $(tableSelector).each((index, element) => {
        const $el = $(element);
        if ($el.find("th").length > 0) return;

        const dataPagamentoStr = $el.find("td:nth-child(4)").text().trim();
        const valorPagamentoStr = $el.find("td:nth-child(2)").text().trim();
        const valorLimpo = valorPagamentoStr
          .replace(/\./g, "")
          .replace(",", ".");
        const dataFormatada = formatarData(dataPagamentoStr);

        if (
          dataFormatada &&
          !isNaN(parseFloat(valorLimpo)) &&
          parseFloat(valorLimpo) > 0
        ) {
          dividendos.push({
            DataPagamento: dataFormatada,
            ValorPagamento: parseFloat(valorLimpo),
          });
        }
      });

      return dividendos;
    } catch (error) {
      attempts++;
      console.warn(
        `Aviso: Erro ao acessar ${ticker} (Tentativa ${attempts}). Motivo: ${error.message}`
      );

      if (attempts < MAX_RETRIES) {
        console.log(
          `Aguardando ${RETRY_DELAY / 1000}s para tentar novamente...`
        );
        await delay(RETRY_DELAY);
      } else {
        console.error(
          `Erro: Limite de tentativas atingido para o ticker ${ticker}. Pulando para o próximo.`
        );
      }
    }
  }
  return [];
}

async function salvarDividendos(client, acaoID, dividendos) {
  const insertQuery = `
        INSERT INTO dividendos_acoes ("acaoid", "datapagamento", "valorpagamento")
        VALUES ($1, $2, $3)
        ON CONFLICT ("acaoid", "datapagamento") 
        DO UPDATE SET 
            "valorpagamento" = EXCLUDED."valorpagamento"; 
    `;

  for (const item of dividendos) {
    await client.query(insertQuery, [
      acaoID,
      item.DataPagamento,
      item.ValorPagamento,
    ]);
  }
  console.log(`Dividendos do AcaoID ${acaoID} salvos com sucesso!`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executar() {
  let client;
  try {
    client = await db.connect();
    const acoes = await getAcoes();

    if (acoes.length === 0) {
      console.log("Nenhuma ação encontrada.");
      return;
    }

    for (const acao of acoes) {
      const AcaoID = acao.acaoid;
      const Ticker = acao.ticker;

      const dividendos = await getDividendos(Ticker);

      if (dividendos.length > 0) {
        await salvarDividendos(client, AcaoID, dividendos);
      }

      await delay(3000);
    }

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro fatal no processo principal:", error.message);
  } finally {
    if (client) client.release();
    await db.end();
    process.exit(0);
  }
}

executar();