import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg'; 
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const FUNDAMENTUS_URL = 'https://www.fundamentus.com.br/resultado.php';

const db = new Pool({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

async function consultaDadosFundamentus() {
    try {
        const dados = [];
        console.log(`Buscando dados em: ${FUNDAMENTUS_URL}`);
        
        const res = await axios.get(FUNDAMENTUS_URL, {
            headers: {'User-Agent': 'Mozilla/5.0'} 
        });
        
        const dataScrape = cheerio.load(res.data);

        const tableSelector = 'table:first';
        
        dataScrape(tableSelector + ' tbody tr').each((index, element) => {
            const $el = dataScrape(element);
            
            const ticker = $el.find('td:nth-child(1) a').text().trim();
            
            const descricao = $el.find('td:nth-child(2)').text().trim(); 

            if (ticker && descricao) {
                dados.push({ ticker: ticker, descricao: descricao });
            }
        });
        
        console.log(`Dados raspados: ${dados.length} ações.`);
        return dados;
    } catch (err) {
        console.error("Erro na requisição do Fundamentus:", err.message);
        return [];
    }
}

async function insertDados() {
    let client;
    try {
        client = await db.connect();
        
        // SQL: PostgreSQL com $1, $2, e UPSERT
        const sql = `
            INSERT INTO acoes (ticker, descricao) 
            VALUES ($1, $2);
        `;

        const dadosFinal = await consultaDadosFundamentus(); 

        for (const stock of dadosFinal) {
            await client.query(sql, [stock.ticker, stock.descricao]);
        }

        console.log('Todos os dados inseridos/atualizados com sucesso!');

    } catch (err) {
        console.error("Erro ao inserir dados no banco:", err.message);
    } finally {
        if (client) {
            client.release(); 
        }
        await db.end(); 
        console.log('Conexão com o banco encerrada.');
    }
}

insertDados();