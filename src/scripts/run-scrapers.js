import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rodarScript(diretorio, arquivo) {
  const caminhoCompleto = path.join(__dirname, diretorio, arquivo);
  console.log(`> Executando scraper: ${arquivo}`);

  return new Promise((resolve, reject) => {
    const child = spawn("node", [caminhoCompleto], { stdio: "inherit" });

    child.on("error", (err) => {
      console.error(`Erro ao spawn do script ${arquivo}:`, err.message);
      reject(err);
    });

    child.on("exit", (code, signal) => {
      if (code === 0) {
        console.log(`Scraper ${arquivo} finalizado com sucesso.`);
        resolve();
      } else {
        reject(
          new Error(
            `Scraper ${arquivo} terminou com código ${code} e sinal ${signal}`,
          ),
        );
      }
    });
  });
}

async function executarScrapers() {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    const SCRAPER_LAST_RUN_LOCK = path.join(
      __dirname,
      ".scraper_last_run.lock",
    );

    let ultimaExecucao = "";
    if (fs.existsSync(SCRAPER_LAST_RUN_LOCK)) {
      ultimaExecucao = fs.readFileSync(SCRAPER_LAST_RUN_LOCK, "utf8").trim();
    }

    if (ultimaExecucao === hoje) {
      console.log(
        `
=== Scrapers já executados hoje (${hoje}). Pulando atualização de dados... ===
`,
      );
    } else {
      console.log(
        `
=== Iniciando Scrapers (Primeira execução do dia: ${hoje}) ===`,
      );
      const pastaScrapers = path.join(__dirname, "scrapers");

      if (fs.existsSync(pastaScrapers)) {
        const arquivosScrapers = fs
          .readdirSync(pastaScrapers)
          .filter((file) => file.endsWith(".js"));

        for (const arquivo of arquivosScrapers) {
          await rodarScript("scrapers", arquivo);
        }

        fs.writeFileSync(SCRAPER_LAST_RUN_LOCK, hoje);
        console.log(
          `
   Todos os scrapers foram finalizados e registrados para ${hoje}!`,
        );
      }
    }

    console.log("=== Fluxo de scraping finalizado! ===");
  } catch (error) {
    console.error("FALHA NA EXECUÇÃO DOS SCRAPERS:", error);
    process.exit(1);
  }
}

executarScrapers().catch((err) => {
  console.error("Erro no fluxo de scraping:", err);
  process.exit(1);
});
