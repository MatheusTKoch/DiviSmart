import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_LOCK_FILE = path.join(__dirname, ".last_run_date.lock");

const ORDEM_DATABASE = [
    "database.js",
    "users.js",
    "diversos.js",
    "acoes_table.js",
    "fii_table.js",
    "tesouro_table.js"
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
                reject(new Error(`Script ${arquivo} terminou com código ${code} signal ${signal}`));
            }
        });
    });
}

async function executarScripts() {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const DB_INITIALIZED_LOCK = path.join(__dirname, ".database_initialized.lock");
        const SCRAPER_LAST_RUN_LOCK = path.join(__dirname, ".scraper_last_run.lock");

        if (!fs.existsSync(DB_INITIALIZED_LOCK)) {
            console.log("=== 🛠️ Inicializando Banco de Dados (Primeira Execução) ===");
            for (const arquivo of ORDEM_DATABASE) {
                const pastaDatabase = path.join(__dirname, "database");
                if (fs.existsSync(path.join(pastaDatabase, arquivo))) {
                    await rodarScript("database", arquivo);
                }
            }
            fs.writeFileSync(DB_INITIALIZED_LOCK, `Banco criado em: ${new Date().toISOString()}`);
            console.log("✓ Tabelas criadas com sucesso.");
        } else {
            console.log("=== Estrutura do banco de dados já existente ===");
        }

        let ultimaExecucao = "";
        if (fs.existsSync(SCRAPER_LAST_RUN_LOCK)) {
            ultimaExecucao = fs.readFileSync(SCRAPER_LAST_RUN_LOCK, 'utf8').trim();
        }

        if (ultimaExecucao === hoje) {
            console.log(`\n=== Scrapers já executados hoje (${hoje}). Pulando atualização de dados... ===\n`);
        } else {
            console.log(`\n=== Iniciando Scrapers (Primeira execução do dia: ${hoje}) ===`);
            const pastaScrapers = path.join(__dirname, "scrapers");
            
            if (fs.existsSync(pastaScrapers)) {
                const arquivosScrapers = fs.readdirSync(pastaScrapers).filter(file => file.endsWith(".js"));
                
                for (const arquivo of arquivosScrapers) {
                    await rodarScript("scrapers", arquivo);
                }
                
                fs.writeFileSync(SCRAPER_LAST_RUN_LOCK, hoje);
                console.log(`\n Todos os scrapers foram finalizados e registrados para ${hoje}!`);
            }
        }

        console.log("=== Fluxo de execução finalizado! ===");
        
    } catch (error) {
        console.error("FALHA NA EXECUÇÃO:", error);
        process.exit(1); 
    }
}

executarScripts().then(() => {
    console.log("Fluxo de inicialização completo.");
}).catch(err => {
    console.error("Erro no fluxo:", err);
    process.exit(1);
});