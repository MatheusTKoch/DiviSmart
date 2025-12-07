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
  try {
    const url = `${ACOES_URL}${ticker}`;
    console.log(`Buscando dividendos em: ${url}`);

    const response = await axios.get(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
      },
    });
    const $ = cheerio.load(response.data);

    const dividendos = [];
    
    $("table:nth-of-type(2) tbody tr").each((index, element) => { 
      const dataPagamentoStr = $(element).find("td:nth-child(3)").text().trim(); 
      const valorPagamentoStr = $(element).find("td:nth-child(4)").text().trim(); 

      const valorLimpo = valorPagamentoStr.replace(",", ".");
      
      const dataFormatada = formatarData(dataPagamentoStr);

      if (dataFormatada && !isNaN(parseFloat(valorLimpo))) {
        dividendos.push({
          DataPagamento: dataFormatada,
          ValorPagamento: parseFloat(valorLimpo),
        });
      }
    });

    return dividendos;
  } catch (error) {
    console.error(`Erro ao fazer scraping para o ticker ${ticker}:`, error.message);
    return [];
  }
}

async function salvarDividendos(client, acaoID, dividendos) {
  const insertQuery = `
    INSERT INTO dividendos_acoes ("acaoid", "datapagamento", "valorpagamento")
    VALUES ($1, $2, $3)
    ON CONFLICT ("acaoid", "datapagamento") 
    DO UPDATE SET 
      "datapagamento" = EXCLUDED."datapagamento";
  `;

  for (const item of dividendos) {
    await client.query(insertQuery, [acaoID, item.DataPagamento, item.ValorPagamento]);
  }

  console.log(`Dividendos da ação com AcaoID ${acaoID} inseridos/atualizados com sucesso!`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executar() {
  let client;
  try {
    client = await db.connect(); 
    const acoes = await getAcoes();

    for (const acao of acoes) {
      const AcaoID = acao.acaoid; 
      const Ticker = acao.ticker;
      
      console.log(`Obtendo dividendos para o ticker: ${Ticker}`);

      const dividendos = await getDividendos(Ticker);
      if (dividendos.length > 0) {
        await salvarDividendos(client, AcaoID, dividendos); 
      } else {
        console.log(`Nenhum dividendo encontrado para o ticker ${Ticker}`);
      }

      await delay(5000);
    }

    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro no processo principal:", error.message);
  } finally {
    if (client) {
      client.release();
    }
    await db.end(); 
  }
}

executar();