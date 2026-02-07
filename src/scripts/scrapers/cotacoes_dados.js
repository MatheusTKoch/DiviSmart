import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import axios from "axios";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const db = new Pool({
  database: process.env.VITE_DATABASE_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  host: process.env.VITE_HOST_DB,
});

const BASE_URL_COTACOES = process.env.VITE_URL_COTACOES;

const ATIVOS_YAHOO = {
  "Ouro/USD": "GC=F",
  Ibovespa: "^BVSP",
  DowJones: "^DJI",
};

function parseFormattedNumber(input) {
  let cleaned = input.replace(/[^\d.,]/g, "");
  cleaned = cleaned.replace(/,/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts.slice(0, -1).join("") + "." + parts.pop();
  }
  return parseFloat(cleaned);
}

async function upsertQuote(client, ativo, valor, dataAtualizacao) {
  const sql = `
        INSERT INTO cotacoes ("ativo", "valoratual", "dataatualizacao") 
        VALUES ($1, $2, $3)
        ON CONFLICT ("ativo") 
        DO UPDATE SET 
            "valoratual" = EXCLUDED."valoratual", 
            "dataatualizacao" = EXCLUDED."dataatualizacao";
    `;

  const params = [ativo, valor, dataAtualizacao];

  try {
    await client.query(sql, params);
    console.log(`Cotação atualizada/inserida para ${ativo} com valor ${valor}`);
  } catch (error) {
    console.error(`Erro ao fazer UPSERT para ${ativo}:`, error.message);
  }
}

async function scrapeAndUpsertYahooQuote(client, ativo, ticker) {
  if (!BASE_URL_COTACOES) {
    console.error("Erro: VITE_URL_COTACOES não configurada.");
    return;
  }

  const url = `${BASE_URL_COTACOES}${ticker}`;

  try {
    console.log(`Buscando ${ativo} em: ${url}`);

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(response.data);

    const priceSelector = 'fin-streamer[data-field="regularMarketPrice"]';
    const fallbackSelector = 'div[data-test="instrument-price-last"]';

    let priceText =
      $(priceSelector).first().attr("value") ||
      $(priceSelector).first().text().trim();

    if (!priceText) {
      priceText = $(fallbackSelector).first().text().trim();
    }

    const valor = parseFormattedNumber(priceText);

    if (valor && !isNaN(valor)) {
      const now = new Date();
      await upsertQuote(client, ativo, valor, now);
    } else {
      console.error(
        `Não foi possível extrair a cotação para ${ativo}. Valor extraído: "${priceText}"`,
      );
    }
  } catch (error) {
    console.error(
      `Erro ao fazer scraping do Yahoo para ${ativo}: Request failed with status code ${error.response ? error.response.status : "N/A"}`,
    );
  }
}

async function main() {
  let client;
  try {
    client = await db.connect();

    console.log("\n--- 📈 Iniciando Scraping Unificado do Yahoo Finance ---");

    for (const [ativo, ticker] of Object.entries(ATIVOS_YAHOO)) {
      await scrapeAndUpsertYahooQuote(client, ativo, ticker);
    }
  } catch (error) {
    console.error("Erro geral na execução:", error.message);
  } finally {
    if (client) {
      client.release();
    }
    await db.end();
    console.log("\nProcesso finalizado e conexão encerrada.");
  }
}

main();
