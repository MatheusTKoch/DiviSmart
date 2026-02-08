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
  "S&P 500": "^GSPC",
  "DowJones": "^DJI",
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

  const url = `${BASE_URL_COTACOES}${encodeURIComponent(ticker)}`;

  try {
    console.log(`Buscando ${ativo} (${ticker}) em: ${url}`);
    const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(response.data);

    const header = $("#quote-header-info").first();
    const headerTitle = header.find("h1").first().text().trim() || header.text().trim().slice(0, 120);
    console.log(`Página carregada (header): "${headerTitle}"`);

    const selectors = [
      'fin-streamer[data-field="regularMarketPrice"]',
      'span[data-test="qsp-price"]',
      'span.price',
      'div[data-test="instrument-price-last"]'
    ];

    let priceText = "";

    // Tenta cada seletor dentro do header (preferência)
    for (const sel of selectors) {
      const el = header.find(sel).first();
      if (el && el.length) {
        priceText = el.attr("value") || el.text().trim();
        console.log(`Seletor usado: ${sel}`);
        break;
      }
    }

    // Se não achou no header, tenta fin-streamer por símbolo na página (tratando ^)
    if (!priceText) {
      const normalized = ticker.replace(/^\^/, "");
      const bySymbol = $(`fin-streamer[data-symbol="${ticker}"], fin-streamer[data-symbol="${normalized}"]`).filter((i, el) => $(el).text().trim()).first();
      if (bySymbol && bySymbol.length) {
        priceText = bySymbol.attr("value") || bySymbol.text().trim();
        console.log("Seletor usado: fin-streamer por símbolo");
      }
    }

    // Último recurso: primeiro fin-streamer visível na página
    if (!priceText) {
      const anyPriceElem = $('fin-streamer[data-field="regularMarketPrice"]').filter((i, el) => $(el).text().trim()).first();
      priceText = (anyPriceElem && anyPriceElem.length) ? (anyPriceElem.attr("value") || anyPriceElem.text().trim()) : "";
      if (priceText) console.log("Seletor usado: fin-streamer (any)");
    }

    console.log(`Valor bruto extraído para ${ativo}: "${priceText}"`);

    const valor = priceText ? parseFormattedNumber(priceText) : NaN;

    if (valor && !isNaN(valor)) {
      const now = new Date();
      await upsertQuote(client, ativo, valor, now);
    } else {
      console.error(`Não foi possível extrair a cotação correta para ${ativo}. Valor extraído: "${priceText}"`);
    }
  } catch (error) {
    console.error(
      `Erro ao fazer scraping do Yahoo para ${ativo}:`,
      error.response ? `${error.response.status} ${error.response.statusText}` : error.message,
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
