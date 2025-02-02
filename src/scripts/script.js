import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const diretorios = ["database", "scrapers"];

async function executarScripts() {
  for (const dir of diretorios) {
    const pasta = path.join(__dirname, dir);
    const arquivos = fs.readdirSync(pasta).filter(file => file.endsWith(".js"));

    for (const arquivo of arquivos) {
      const caminhoCompleto = path.join(pasta, arquivo);
      console.log(`Executando: ${arquivo}`);

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
