import axios from "axios";
import * as cheerio from "cheerio";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const db = await mysql.createConnection({
  host: process.env.VITE_HOST_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  database: process.env.VITE_DATABASE_DB,
});

const ACOES_URL = process.env.VITE_URL_ACOES_DIVIDENDOS;

async function getAcoes() {
  const query = "SELECT AcaoID, Ticker FROM acoes";
  const [rows] = await db.execute(query);
  return rows; 
}

async function getDividendos(ticker) {
  try {
    const url = `${ACOES_URL}${ticker}`;
    const response = await axios.get(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
        },
    });
    const $ = cheerio.load(response.data);

    const dividendos = [];
    $("table tbody tr").each((index, element) => {
      const dataPagamento = $(element).find("td:nth-child(3)").text().trim();
      const valorPagamento = $(element).find("td:nth-child(4)").text().trim();

      if (dataPagamento && valorPagamento) {
        dividendos.push({
          DataPagamento: new Date(dataPagamento.split("/").reverse().join("-")),
          ValorPagamento: parseFloat(valorPagamento.replace(",", ".")),
        });
      }
    });

    console.log(dividendos)
    return dividendos;
  } catch (error) {
    console.error(`Erro ao fazer scraping para o ticker ${ticker}:`, error.message);
    return [];
  }
}

async function salvarDividendos(acaoID, dividendos) {
  const insertQuery = `
    INSERT INTO dividendos_acoes (acaoID, DataPagamento, ValorPagamento)
    VALUES (?, ?, ?);
  `;

  for (const item of dividendos) {
    await db.execute(insertQuery, [acaoID, item.DataPagamento, item.ValorPagamento]);
  }

  console.log(`Dividendos da ação com AcaoID ${acaoID} inseridos com sucesso!`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executar() {
  try {
    const acoes = await getAcoes();

    for (const acao of acoes) {
      const { AcaoID, Ticker } = acao;
      console.log(`Obtendo dividendos para o ticker: ${Ticker}`);

      const dividendos = await getDividendos(Ticker);
      if (dividendos.length > 0) {
        await salvarDividendos(AcaoID, dividendos);
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
