import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const db = new Pool({
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  host: process.env.VITE_HOST_DB,
  database: "postgres",
});

db.connect()
  .then(async (client) => {
    console.log("Conectado com sucesso");
    const sql = `
            CREATE DATABASE divismart;
        `;
    try {
      return await client.query(sql);
    } finally {
      client.release();
    }
  })
  .then(() => {
    console.log("Banco Criado!");
    db.end();
  })
  .catch((err) => {
    if (err.code === "42P04") {
      console.warn('Atenção: O banco de dados "divismart" já existe.');
    } else {
      console.error("Erro no comando:", err.message);
    }
    db.end();
  });
