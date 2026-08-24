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

async function createTables() {
  //Carteiras
  const sql_carteiras = `
        CREATE TABLE IF NOT EXISTS carteiras (
            carteiraid SERIAL PRIMARY KEY,
            nome TEXT NOT NULL,
            userid INT NOT NULL,
            deletedat TIMESTAMP WITHOUT TIME ZONE,
            
            FOREIGN KEY (userid) REFERENCES users("userid")
        );
    `;

  //Cotacoes
  const sql_cotacoes = `
        CREATE TABLE IF NOT EXISTS cotacoes (
            cotacaoid SERIAL PRIMARY KEY,
            ativo TEXT NOT NULL UNIQUE,
            valoratual NUMERIC(15, 2) NOT NULL,
            dataatualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL
        );
    `;

  try {
    console.log("--- Iniciando Criação das Tabelas carteiras e cotacoes ---");

    console.log('Criando a tabela "carteiras"...');
    await db.query(sql_carteiras);
    console.log('Tabela "carteiras" criada ou já existente!');

    console.log('Criando a tabela "cotacoes"...');
    await db.query(sql_cotacoes);
    console.log('Tabela "cotacoes" criada ou já existente!');

    console.log("--- Criação de Tabelas Concluída ---");
  } catch (err) {
    console.error("Erro fatal ao criar uma das tabelas:", err.message);
    console.error(
      'Verifique se a tabela "users" existe antes de criar "carteiras".',
    );
    throw err;
  } finally {
    await db.end();
  }
}

createTables().catch((err) => {
  console.error("Falha no processo de criação das tabelas:", err.message);
  process.exit(1);
});
