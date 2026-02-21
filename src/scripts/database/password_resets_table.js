import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const db = new Pool({
  database: process.env.VITE_DATABASE_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  host: process.env.VITE_HOST_DB,
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
