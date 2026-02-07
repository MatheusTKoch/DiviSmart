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

const DIVIDENDOS_URL = process.env.VITE_URL_FII_DIVIDENDOS;

function parseDate(dateStr) {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return null;
  }
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}

async function getFundosImobiliarios() {
  const query = 'SELECT "fundoimobiliarioid", "ticker" FROM fundo_imobiliario';
  const client = await db.connect();
  try {
    const res = await client.query(query);
    return res.rows;
  } finally {
    client.release();
  }
}

async function getDividendos(ticker) {
  try {
    const tickerUpper = ticker.toUpperCase();
    const url = `${DIVIDENDOS_URL}${tickerUpper}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const dividendos = [];

    const tableSelector = "table:first tbody tr";

    $(tableSelector).each((index, element) => {
      const $el = $(element);

      if ($el.find("th").length > 0) {
        return;
      }

      const dataPagamentoStr = $el.find("td:nth-child(3)").text().trim();
      const valorPagamentoStr = $el.find("td:nth-child(4)").text().trim();

      const dataFormatada = parseDate(dataPagamentoStr);
      const valorLimpo = valorPagamentoStr.replace(".", "").replace(",", ".");

      if (dataFormatada && valorLimpo && !isNaN(parseFloat(valorLimpo))) {
        dividendos.push({
          DataPagamento: dataFormatada,
          ValorPagamento: parseFloat(valorLimpo),
        });
      }
    });

    return dividendos;
  } catch (error) {
    console.error(
      `Erro ao fazer scraping para o ticker ${ticker}:`,
      error.message,
    );
    return [];
  }
}

async function salvarDividendos(fiiID, dividendos) {
  const client = await db.connect();
  try {
    const insertQuery = `
            INSERT INTO dividendos_fii ("fiid", "datapagamento", "valorpagamento")
            VALUES ($1, $2, $3)
            ON CONFLICT ("fiid", "datapagamento")
            DO UPDATE SET
                "valorpagamento" = EXCLUDED."valorpagamento";
        `;

    for (const item of dividendos) {
      await client.query(insertQuery, [
        fiiID,
        item.DataPagamento,
        item.ValorPagamento,
      ]);
    }

    console.log(
      `Dividendos do fundo com FundoImobiliarioID ${fiiID} inseridos/atualizados com sucesso!`,
    );
  } finally {
    client.release();
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executar() {
  try {
    const fundos = await getFundosImobiliarios();

    if (fundos.length === 0) {
      console.log(
        "Nenhum Fundo Imobiliário encontrado na base de dados para processar.",
      );
      return;
    }

    for (const fundo of fundos) {
      const FundoImobiliarioID = fundo.fundoimobiliarioid;
      const Ticker = fundo.ticker;

      console.log(`Obtendo dividendos para o ticker: ${Ticker}`);

      const dividendos = await getDividendos(Ticker);
      if (dividendos.length > 0) {
        await salvarDividendos(FundoImobiliarioID, dividendos);
      } else {
        console.log(`Nenhum dividendo encontrado para o ticker ${Ticker}`);
      }

      await delay(5000);
    }

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro no processo:", error.message);
  } finally {
    await db.end();
  }
}

executar();
