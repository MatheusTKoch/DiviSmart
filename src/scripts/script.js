import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_LOCK_FILE = path.join(__dirname, ".database_initialized.lock");

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
        if (!fs.existsSync(DB_LOCK_FILE)) {
            console.log("=== Inicializando Banco de Dados (Primeira Execução) ===");
            for (const arquivo of ORDEM_DATABASE) {
                const pastaDatabase = path.join(__dirname, "database");
                if (fs.existsSync(path.join(pastaDatabase, arquivo))) {
                    await rodarScript("database", arquivo);
                }
            }
            fs.writeFileSync(DB_LOCK_FILE, `Banco criado em: ${new Date().toISOString()}`);
            console.log("✓ Tabelas criadas e trava gerada.");
        } else {
            console.log("=== Banco de dados já inicializado anteriormente. Pulando criação de tabelas. ===");
        }

        console.log("=== Iniciando Scrapers ===");
        const pastaScrapers = path.join(__dirname, "scrapers");
        if (fs.existsSync(pastaScrapers)) {
            const arquivosScrapers = fs.readdirSync(pastaScrapers).filter(file => file.endsWith(".js"));
            for (const arquivo of arquivosScrapers) {
                await rodarScript("scrapers", arquivo);
            }
        }

        console.log("=== Todos os scripts foram finalizados! ===");
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