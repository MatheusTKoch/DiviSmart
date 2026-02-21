import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDEM_DATABASE = [
  "database.js",
  "users.js",
  "password_resets_table.js", 
  "diversos.js",
  "acoes_table.js",
  "fii_table.js",
  "tesouro_table.js",
];

async function rodarScript(diretorio, arquivo) {
  const caminhoCompleto = path.join(__dirname, diretorio, arquivo);
  console.log(`> Executando: ${diretorio}/${arquivo}`);

  return new Promise((resolve, reject) => {
    const child = spawn("node", [caminhoCompleto], { stdio: "inherit" });

    child.on("error", (err) => {
      console.error(`Erro ao spawn do script ${arquivo}:`, err.message);
      reject(err);
    });

    child.on("exit", (code, signal) => {
      if (code === 0) {
        console.log(`Script ${arquivo} finalizado com código 0.`);
        resolve();
      } else {
        reject(
          new Error(
            `Script ${arquivo} terminou com código ${code} signal ${signal}`,
          ),
        );
      }
    });
  });
}

async function executarSetupBanco() {
  try {
    const DB_INITIALIZED_LOCK = path.join(
      __dirname,
      ".database_initialized.lock",
    );

    if (!fs.existsSync(DB_INITIALIZED_LOCK)) {
      console.log(
        "=== Inicializando Banco de Dados (Primeira Execução) ===",
      );
      for (const arquivo of ORDEM_DATABASE) {
        const pastaDatabase = path.join(__dirname, "database");
        if (fs.existsSync(path.join(pastaDatabase, arquivo))) {
          await rodarScript("database", arquivo);
        }
      }
      fs.writeFileSync(
        DB_INITIALIZED_LOCK,
        `Banco criado em: ${new Date().toISOString()}`,
      );
      console.log(" Tabelas criadas com sucesso.");
    } else {
      console.log("=== Estrutura do banco de dados já existente. Pulando. ===");
    }

    console.log("=== Fluxo de setup de banco de dados finalizado! ===");
  } catch (error) {
    console.error("FALHA NA EXECUÇÃO DO SETUP DO BANCO:", error);
    process.exit(1);
  }
}

executarSetupBanco().catch((err) => {
  console.error("Erro no fluxo de setup do banco:", err);
  process.exit(1);
});
