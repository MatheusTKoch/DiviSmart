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

async function createTablesIfNotExists() {
  //Criando acoes
  const sql_acoes = `
        CREATE TABLE IF NOT EXISTS acoes (
            acaoid SERIAL PRIMARY KEY,
            ticker VARCHAR(6) NOT NULL UNIQUE,
            descricao TEXT NOT NULL,
            precoatual NUMERIC(15, 2),
            pl NUMERIC(10, 2),
            pvp NUMERIC(10, 2),
            dividendyield NUMERIC(6, 2),
            dataatualizacao TIMESTAMP WITHOUT TIME ZONE
        );
    `;

  //Criando ativos_acoes
  const sql_ativos_acoes = `
        CREATE TABLE IF NOT EXISTS ativos_acoes (
            ativoacaoid SERIAL PRIMARY KEY,
            quantidade INT NOT NULL,
            valorinvestido NUMERIC(15, 2),
            datacadastro TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            carteiraid INT NOT NULL,
            deletedat TIMESTAMP WITHOUT TIME ZONE,
            acaoid INT NOT NULL,
            
            FOREIGN KEY(carteiraid) REFERENCES carteiras("carteiraid"),
            FOREIGN KEY (acaoid) REFERENCES acoes("acaoid")
        );
    `;

  //Criando dividendos_acoes
  const sql_dividendos_acoes = `
        CREATE TABLE IF NOT EXISTS dividendos_acoes (
            dividendoacaoid SERIAL PRIMARY KEY,
            datapagamento TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            valorpagamento NUMERIC(15, 2),
            acaoid INT NOT NULL,
            
            FOREIGN KEY (acaoid) REFERENCES acoes("acaoid"),

            UNIQUE(acaoid, datapagamento)
        );
    `;

  try {
    console.log("--- Iniciando Criação de Tabelas ---");

    console.log('Criando "acoes"...');
    await db.query(sql_acoes);
    console.log('Tabela "ativos_acoes" criada ou já existente!');

    console.log('Criando "ativos_acoes"...');
    await db.query(sql_ativos_acoes);
    console.log('Tabela "ativos_acoes" criada ou já existente!');

    console.log('Criando "dividendos_acoes"...');
    await db.query(sql_dividendos_acoes);
    console.log('Tabela "dividendos_acoes" criada ou já existente!');

    console.log("--- Criação de FIIs Ações Concluída ---");
  } catch (err) {
    console.error("Erro ao criar uma das tabelas:", err.message);
    console.error("Verifique se as tabelas já existem.");
    throw err;
  } finally {
    await db.end();
  }
}

createTablesIfNotExists().catch((err) => {
  console.error("Falha no processo de criação das tabelas:", err.message);
  process.exit(1);
});

