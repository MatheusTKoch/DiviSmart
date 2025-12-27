import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const db = new Pool({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

function limparMoeda(valor) {
    if (!valor) return 0;
    return parseFloat(valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
}

function formatarData(dataStr) {
    if (!dataStr) return null;
    const [dia, mes, ano] = dataStr.split('/');
    return `${ano}-${mes}-${dia}`;
}

async function importarCsvLocal() {
    const caminhoArquivo = path.resolve(__dirname, 'rendimento-investir.csv');
    let client;

    try {
        if (!fs.existsSync(caminhoArquivo)) {
            console.error("Arquivo não encontrado! Certifique-se de que 'rendimento-investir.csv' está na mesma pasta deste script.");
            return;
        }

        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        const linhas = conteudo.split(/\r?\n/);
        
        const registros = linhas.slice(1).filter(l => l.trim() !== '');

        client = await db.connect();
        console.log(`Processando ${registros.length} títulos da planilha...`);

        const sql = `
            INSERT INTO tesouro_direto (descricao, investimentominimo, vencimento) 
            VALUES ($1, $2, $3)
            ON CONFLICT (descricao) 
            DO UPDATE SET 
                investimentominimo = EXCLUDED.investimentominimo,
                vencimento = EXCLUDED.vencimento;
        `;

        for (const linha of registros) {
            const colunas = linha.split(';');

            if (colunas.length >= 5) {
                const titulo = colunas[0].trim();        
                const invMin = limparMoeda(colunas[2]);  
                const dataVen = formatarData(colunas[4]); 

                await client.query(sql, [titulo, invMin, dataVen]);
            }
        }

        console.log("Importação concluída com sucesso no PostgreSQL!");

    } catch (err) {
        console.error("Erro durante a importação:", err.message);
    } finally {
        if (client) client.release();
        await db.end();
    }
}

importarCsvLocal();