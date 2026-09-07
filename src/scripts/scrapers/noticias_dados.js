import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import Parser from "rss-parser";

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

const parser = new Parser();

const FEEDS = [
  { fonte: "InfoMoney", url: "https://www.infomoney.com.br/feed/" },
  { fonte: "G1 Economia", url: "https://g1.globo.com/rss/g1/economia/" }
];

async function atualizarNoticiasDiarias() {
  try {
    console.log("--- Iniciando Atualização Diária de Notícias ---");

    const deleteSql = `DELETE FROM noticias WHERE dataatualizacao < CURRENT_DATE;`;
    const deleteResult = await db.query(deleteSql);
    console.log(`Notícias de datas anteriores removidas: ${deleteResult.rowCount}`);

    for (const feed of FEEDS) {
      console.log(`Buscando feed de: ${feed.fonte}...`);
      const feedParsed = await parser.parseURL(feed.url);

      for (const item of feedParsed.items) {
        const insertSql = `
          INSERT INTO noticias (titulo, resumo, fonte, link, dataatualizacao)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (link) DO NOTHING;
        `;

        const values = [
          item.title,
          item.contentSnippet || item.summary || "",
          feed.fonte,
          item.link,
          item.pubDate ? new Date(item.pubDate) : new Date()
        ];

        await db.query(insertSql, values);
      }
    }

    console.log("--- Notícias do Dia Atualizadas com Sucesso ---");
  } catch (err) {
    console.error("Erro no script de notícias:", err.message);
    process.exit(1);
  } finally {
    await db.end();
  }
}

atualizarNoticiasDiarias();