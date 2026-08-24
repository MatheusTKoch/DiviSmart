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

async function createFiiSchema() {
  //Fundo Imobiliario
  const sql_fundo_imobiliario = `
        CREATE TABLE IF NOT EXISTS fundo_imobiliario (
            fundoimobiliarioid SERIAL PRIMARY KEY,
            ticker VARCHAR(7) NOT NULL UNIQUE,
            segmento TEXT NOT NULL,
            precoatual NUMERIC(15, 2),
            pvp NUMERIC(10, 2),
            dividendyield NUMERIC(6, 2),
            dataatualizacao TIMESTAMP WITHOUT TIME ZONE
        );
    `;

  //Ativos FII
  const sql_ativos_fii = `
        CREATE TABLE IF NOT EXISTS ativos_fii (
            ativofiid SERIAL PRIMARY KEY,
            quantidade INT NOT NULL,
            valorinvestido NUMERIC(15, 2),
            datacadastro TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            carteiraid INT NOT NULL,
            deletedat TIMESTAMP WITHOUT TIME ZONE,
            fiid INT NOT NULL,
            
            FOREIGN KEY(carteiraid) REFERENCES carteiras("carteiraid"),
            FOREIGN KEY (fiid) REFERENCES fundo_imobiliario("fundoimobiliarioid")
        );
    `;

  //Dividendos FII
  const sql_dividendos_fii = `
        CREATE TABLE IF NOT EXISTS dividendos_fii (
            dividendofiid SERIAL PRIMARY KEY,
            datapagamento TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            valorpagamento NUMERIC(15, 2),
            fiid INT NOT NULL,
            
            FOREIGN KEY (fiid) REFERENCES fundo_imobiliario("fundoimobiliarioid"),

            UNIQUE(fiid, datapagamento)
        );
    `;

  //Dividendos FII View
  const sql_view = `
        CREATE OR REPLACE VIEW dividendos_fii_view AS 
        SELECT 
            df.datapagamento, 
            df.valorpagamento, 
            df.fiid, 
            fi.ticker, 
            fi.segmento, 
            af.quantidade, 
            af.carteiraid 
        FROM 
            dividendos_fii df 
        INNER JOIN 
            fundo_imobiliario fi ON fi.fundoimobiliarioid = df.fiid 
        INNER JOIN 
            ativos_fii af ON af.fiid = df.fiid 
        WHERE 
            af.deletedat IS NULL;
    `;

  try {
    console.log("--- Iniciando Criação de FIIs Schema ---");

    await db.query(sql_fundo_imobiliario);
    console.log("Tabela fundo_imobiliario criada.");

    await db.query(sql_ativos_fii);
    console.log("Tabela ativos_fii criada.");

    await db.query(sql_dividendos_fii);
    console.log("Tabela dividendos_fii criada.");

    await db.query(sql_view);
    console.log("View dividendos_fii_view criada ou substituída!");

    console.log("--- Criação de FIIs Schema Concluída ---");
  } catch (err) {
    console.error("Erro fatal:", err.message);
    console.error(
      'Verifique a existência da tabela "carteiras" e a ordem de criação.',
    );
    throw err;
  } finally {
    await db.end();
  }
}

createFiiSchema().catch((err) => {
  console.error("Falha no processo de criação:", err.message);
  process.exit(1);
});
