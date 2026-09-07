import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

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

async function createTableNoticiasIfNotExists() {
  const sql_noticias = `
    CREATE TABLE IF NOT EXISTS noticias (
      noticiaid SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      resumo TEXT,
      fonte VARCHAR(50) NOT NULL,
      link TEXT NOT NULL UNIQUE,
      dataatualizacao TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("--- Iniciando Criação da Tabela de Notícias ---");
    console.log('Criando "noticias"...');
    await db.query(sql_noticias);
    console.log('Tabela "noticias" criada ou já existente!');
    console.log("--- Concluído ---");
  } catch (err) {
    console.error("Erro ao criar a tabela noticias:", err.message);
    throw err;
  } finally {
    await db.end();
  }
}

createTableNoticiasIfNotExists().catch((err) => {
  console.error("Falha no processo de criação das tabelas:", err.message);
  process.exit(1);
});