import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import axios from "axios";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const FII_URL = process.env.VITE_URL_FII;

const db = new Pool({
  database: process.env.VITE_DATABASE_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  host: process.env.VITE_HOST_DB,
});

async function consultaDados() {
  try {
    const dados = [];
    console.log(`Buscando dados em: ${FII_URL}`);

    const res = await axios.get(FII_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const dataScrape = cheerio.load(res.data);

    const tableSelector = "table:first";

    dataScrape(tableSelector + " tbody tr").each((index, element) => {
      const $el = dataScrape(element);

      const ticker = $el.find("td:nth-child(1) a").text().trim();

      const segmento_fii = $el.find("td:nth-child(2)").text().trim();

      if (ticker && segmento_fii) {
        dados.push({ ticker: ticker, segmento: segmento_fii });
      }
    });

    console.log(`Dados raspados: ${dados.length} FIIs.`);
    return dados;
  } catch (err) {
    console.error("Erro na requisicao:", err.message);
    return [];
  }
}

async function insertDados() {
  let client;
  try {
    client = await db.connect();

    const sql = `
            INSERT INTO fundo_imobiliario (ticker, segmento) 
            VALUES ($1, $2)
            ON CONFLICT (ticker) 
            DO UPDATE SET segmento = EXCLUDED.segmento;
        `;

    const dadosFinal = await consultaDados();

    for (const fii of dadosFinal) {
      await client.query(sql, [fii.ticker, fii.segmento]);
    }

    console.log("Dados de FIIs inseridos/atualizados com sucesso!");
  } catch (err) {
    console.error("Erro ao inserir dados no banco:", err.message);
  } finally {
    if (client) {
      client.release();
    }
    await db.end();
    console.log("Conexão com o banco encerrada.");
  }
}

insertDados();
