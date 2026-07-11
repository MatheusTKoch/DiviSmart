import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Configuração de execução diaria/frequente
const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith("--mode="));
const modo = modeArg ? modeArg.split("=")[1] : "all";

async function rodarScript(arquivo) {
  const caminhoCompleto = path.join(__dirname, "scrapers", arquivo);
  console.log(`> Executando scraper: ${arquivo}`);

  return new Promise((resolve, reject) => {
    const child = spawn("node", [caminhoCompleto], { stdio: "inherit" });

    child.on("error", (err) => {
      console.error(`Erro ao iniciar o script ${arquivo}:`, err.message);
      reject(err);
    });

    child.on("exit", (code, signal) => {
      if (code === 0) {
        console.log(`Scraper ${arquivo} finalizado com sucesso.`);
        resolve();
      } else {
        reject(new Error(`Scraper ${arquivo} terminou com código ${code} e sinal ${signal}`));
      }
    });
  });
}

async function executarScrapers() {
  try {
    const hoje = new Date().toISOString().split("T")[0];
    
    // Definição dos blocos de arquivos
    const scrapersDiarios = [
      "acoes_dados.js",
      "cotacoes_dados.js",
      "tesouro_dados.js",
      "fii_dados.js"
    ];

    const scrapersFrequentes = [
      "dividendos_acoes_dados.js",
      "dividendos_fii_dados.js",
      "cotacoes_dados.js"
    ];

    let arquivosParaRodar = [];
    let lockFile = null;

    // Define o escopo com base no modo
    if (modo === "diario") {
      arquivosParaRodar = scrapersDiarios;
      lockFile = path.join(__dirname, ".scraper_daily_last_run.lock");
      console.log(`\n=== Iniciando Scrapers Diários (Modo: ${modo}) ===`);
    } else if (modo === "frequente") {
      arquivosParaRodar = scrapersFrequentes;
      console.log(`\n=== Iniciando Scrapers Frequentes (Modo: ${modo}) ===`);
    } else {
      arquivosParaRodar = [...new Set([...scrapersDiarios, ...scrapersFrequentes])];
      lockFile = path.join(__dirname, ".scraper_last_run.lock");
      console.log(`\n=== Iniciando TODOS os Scrapers (Modo: Geral) ===`);
    }

    if (lockFile && fs.existsSync(lockFile)) {
      const ultimaExecucao = fs.readFileSync(lockFile, "utf8").trim();
      if (ultimaExecucao === hoje) {
        console.log(`=== Scrapers já executados hoje (${hoje}). Pulando execução... ===\n`);
        return;
      }
    }

    console.log(`> Iniciando a execução paralela de ${arquivosParaRodar.length} scrapers...`);
    
    const promessas = arquivosParaRodar.map(arquivo => rodarScript(arquivo));
    
    await Promise.all(promessas);

    if (lockFile) {
      fs.writeFileSync(lockFile, hoje);
    }

    console.log(`\n=== Fluxo de scraping [${modo}] finalizado com sucesso para ${hoje}! ===`);
  } catch (error) {
    console.error("FALHA NA EXECUÇÃO DOS SCRAPERS:", error);
    process.exit(1);
  }
}

executarScrapers().catch((err) => {
  console.error("Erro no fluxo de scraping:", err);
  process.exit(1);
});
