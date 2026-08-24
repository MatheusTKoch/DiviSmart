import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const dbAdmin = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST_DB || "db",
  database: "template1",
  port: process.env.POSTGRES_PORT || 5432,
});

async function createCustomUser(client, username, password) {
  const userCheck = await client.query(
    `SELECT 1 FROM pg_roles WHERE rolname = $1;`,
    [username]
  );

  if (userCheck.rowCount === 0) {
    await client.query(`CREATE USER "${username}" WITH PASSWORD '${password}';`);
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${process.env.POSTGRES_DB}" TO "${username}";`);
    console.log(`Usuário "${username}" criado com sucesso!`);
  } else {
    console.log(`O usuário "${username}" já existe.`);
  }
}

async function setupDatabase() {
  let client;
  try {
    client = await dbAdmin.connect();

    const dbName = process.env.POSTGRES_DB || "divismart";
    const dbCheck = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [dbName]
    );

    if (dbCheck.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}";`);
      console.log(`Banco de dados "${dbName}" criado com sucesso!`);
    }

    const newAppUser = process.env.APP_USER;
    const newAppPass = process.env.APP_PASSWORD;

    if (newAppUser && newAppPass) {
      await createCustomUser(client, newAppUser, newAppPass);
    }

  } catch (err) {
    console.error("Erro no setup do banco:", err.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await dbAdmin.end();
  }
}

setupDatabase();