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

const DIVIDENDOS_URL = process.env.VITE_URL_FII_DIVIDENDOS;

async function getFundosImobiliarios() {
  const query = "SELECT FundoImobiliarioID, Ticker FROM fundo_imobiliario";
  const [rows] = await db.execute(query);
  return rows;
}

async function getDividendos(ticker) {
    try {
      const url = `${DIVIDENDOS_URL}${ticker}`;
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
  
      const $ = cheerio.load(response.data);
      const dividendos = [];
  
      $("table tbody tr").each((index, element) => {
        const dataPagamento = $(element).find("td:nth-child(3)").text().trim();
        const valorPagamento = $(element).find("td:nth-child(4)").text().trim();
  
        if (dataPagamento && valorPagamento) {
          dividendos.push({
            DataPagamento: new Date(dataPagamento.split("/").reverse().join("-")), // Formato YYYY-MM-DD
            ValorPagamento: parseFloat(valorPagamento.replace(",", ".")), // Convertendo para float
          });
        }
      });
  
      return dividendos;
    } catch (error) {
      console.error(`Erro ao fazer scraping para o ticker ${ticker}:`, error.message);
      return [];
    }
  }

async function salvarDividendos(fiiID, dividendos) {
  const insertQuery = `
    INSERT INTO dividendos_fii (fiiID, DataPagamento, ValorPagamento)
    VALUES (?, ?, ?);
  `;

  for (const item of dividendos) {
    await db.execute(insertQuery, [fiiID, item.DataPagamento, item.ValorPagamento]);
  }

  console.log(`Dividendos do fundo com FundoImobiliarioID ${fiiID} inseridos com sucesso!`);
}

async function executar() {
  try {
    const fundos = await getFundosImobiliarios();

    for (const fundo of fundos) {
      const { FundoImobiliarioID, Ticker } = fundo;
      console.log(`Obtendo dividendos para o ticker: ${Ticker}`);

      const dividendos = await getDividendos(Ticker);
      if (dividendos.length > 0) {
        await salvarDividendos(FundoImobiliarioID, dividendos);
      } else {
        console.log(`Nenhum dividendo encontrado para o ticker ${Ticker}`);
      }
    }

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro no processo:", error.message);
  } finally {
    await db.end();
  }
}

executar();
