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
    let sql = 'CREATE TABLE IF NOT EXISTS tesouro_direto (TesouroID int NOT NULL AUTO_INCREMENT, Descricao varchar(250) NOT NULL, InvestimentoMinimo float(15,2) NOT NULL, Vencimento Date NOT NULL, CodigoTitulo varchar(20), PRIMARY KEY(TesouroID))'
    db.query(sql, (err) => {
        if (err) throw err;
        console.log("Tabela criada!");
        db.end();
    })
});