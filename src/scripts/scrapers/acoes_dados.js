import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cherrio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../.env')});

const db = mysql.createConnection({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

const B3_URL = process.env.VITE_URL_ACOES;

async function consultaDados() {
    try {
        const dados = [];
        await axios.get(B3_URL).then(res => {
            //console.log(res.data);
            const dataScrape = cherrio.load(res.data);

            dataScrape('table tbody tr').each((index, element) => {
                const ticker = dataScrape(element).find('td:nth-child(1)').text().trim();
                const companyDescription = dataScrape(element).find('span').attr('title');
                if (ticker && companyDescription) {
                    dados.push({ ticker: ticker, descricao: companyDescription });
                }
            });
        });
        //console.log('Dados obtidos:', dados);
        return dados;
    } catch (err) {
        console.log("Erro na requisicao: " + err);
        return [];
    }
}

async function insertDados() {
    try {
        const sql = `INSERT INTO acoes (Ticker, Descricao) VALUES (?, ?)`;
        const dadosFinal = await consultaDados(); 
        console.log(dadosFinal)
        for (const stock of dadosFinal) {
            db.execute(sql, [stock.ticker, stock.descricao]);
        }
        console.log('Dados inseridos com sucesso!');
        db.end();
    } catch (err) {
        console.log("Erro ao inserir dados: " + err);
    }
    
}

insertDados();