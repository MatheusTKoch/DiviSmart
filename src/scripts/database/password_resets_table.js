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

async function createPasswordResetsTable() {
  const sql_password_resets = `
        CREATE TABLE IF NOT EXISTS password_resets (
            "userId" INT NOT NULL PRIMARY KEY,
            token_hash VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
            
            FOREIGN KEY ("userId") REFERENCES users(userid) ON DELETE CASCADE
        );
    `;

  try {
    console.log("--- Iniciando Criação da Tabela password_resets ---");
    await db.query(sql_password_resets);
    console.log('Tabela "password_resets" criada ou já existente!');
    console.log("--- Criação da Tabela password_resets Concluída ---");
  } catch (err) {
    console.error("Erro fatal ao criar a tabela password_resets:", err.message);
    throw err;
  } finally {
    await db.end();
  }
}

createPasswordResetsTable().catch((err) => {
  console.error(
    "Falha no processo de criação da tabela password_resets:",
    err.message,
  );
  process.exit(1);
});
