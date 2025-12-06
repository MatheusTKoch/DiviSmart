import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const diretorios = ["database", "scrapers"];

const ORDEM_DATABASE = [
    "database.js",
    "users.js",
    "diversos.js",
    "acoes_table.js",
    "fii_table.js",
    "tesouro_table.js"
];

async function executarScripts() {
    for (const dir of diretorios) {
        const pasta = path.join(__dirname, dir);
        let arquivos = [];

        if (dir === "database") {
            arquivos = ORDEM_DATABASE;
        } else {
            arquivos = fs.readdirSync(pasta).filter(file => file.endsWith(".js"));
        }
        
        arquivos = arquivos.filter(arquivo => fs.existsSync(path.join(pasta, arquivo)));

        for (const arquivo of arquivos) {
            const caminhoCompleto = path.join(pasta, arquivo);
            console.log(`Executando: ${dir}/${arquivo}`);

            await new Promise((resolve, reject) => {
                exec(`node "${caminhoCompleto}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erro ao executar ${arquivo}:`, error.message);
                        return reject(error);
                    }
                    if (stderr) {
                        console.error(`Erro no script ${arquivo}:`, stderr);
                    }
                    console.log(stdout);
                    resolve();
                });
            });
        }
    }

    console.log("Todos os scripts foram executados!");
}

executarScripts().catch(error => console.error("Erro geral:", error));