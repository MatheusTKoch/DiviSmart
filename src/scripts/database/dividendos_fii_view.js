import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const db = mysql.createConnection({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

db.connect((err) => {
    if (err) throw err;
    let sql = 'CREATE OR REPLACE VIEW dividendos_fii_view AS SELECT dividendos_fii.DataPagamento, dividendos_fii.ValorPagamento, dividendos_fii.fiiID, fundo_imobiliario.Ticker, fundo_imobiliario.Segmento, ativos_fii.Quantidade, ativos_fii.carteiraID FROM dividendos_fii inner join fundo_imobiliario on fundo_imobiliario.FundoImobiliarioID = dividendos_fii.fiiID inner join ativos_fii on ativos_fii.fiiID = dividendos_fii.fiiID where ativos_fii.deletedAt IS NULL;'
    db.query(sql, (err) => {
        if (err) throw err;
        console.log("View criada!");
        db.end();
    })
});