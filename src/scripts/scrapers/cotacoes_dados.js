import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import YahooFinance from "yahoo-finance2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const db = new Pool({
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST_DB || "db",
  port: process.env.POSTGRES_PORT || 5432,
});

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const ATIVOS_YAHOO = {
  "Ouro/USD": "GC=F",
  "S&P 500": "^GSPC",
  DowJones: "^DJI",
};

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

async function fetchAndUpsertYahooQuote(client, ativo, ticker) {
  try {
    console.log(`Buscando ${ativo} (${ticker}) via yahoo-finance2...`);
    const quote = await yahooFinance.quote(ticker);
    const valor = quote?.regularMarketPrice;

    if (valor != null && Number.isFinite(Number(valor))) {
      await upsertQuote(client, ativo, Number(valor), new Date());
    } else {
      console.error(
        `Não foi possível obter a cotação para ${ativo} (${ticker}). Valor: ${valor}`,
      );
    }
  } catch (error) {
    console.error(
      `Erro ao buscar cotação do Yahoo para ${ativo} (${ticker}):`,
      error.message,
    );
  }
}

async function main() {
  let client;
  try {
    client = await db.connect();

    console.log("\n--- Iniciando atualização de cotações (yahoo-finance2) ---");

    for (const [ativo, ticker] of Object.entries(ATIVOS_YAHOO)) {
      await fetchAndUpsertYahooQuote(client, ativo, ticker);
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
