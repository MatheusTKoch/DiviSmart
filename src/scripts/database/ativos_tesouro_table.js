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
    let sql = 'CREATE TABLE IF NOT EXISTS ativos_tesouro (AtivoTesouroID int NOT NULL AUTO_INCREMENT, Quantidade INT NOT NULL, ValorInvestido float(15,2), DataCadastro DATETIME NOT NULL, carteiraID INT NOT NULL, deletedAt DATETIME, FOREIGN KEY(carteiraID) REFERENCES carteiras(CarteiraID), tesouroID INT NOT NULL, FOREIGN KEY (tesouroID) REFERENCES tesouro_direto(TesouroID), PRIMARY KEY(AtivoTesouroID))'
    db.query(sql, (err) => {
        if (err) throw err;
        console.log("Tabela criada!");
        db.end();
    })
});