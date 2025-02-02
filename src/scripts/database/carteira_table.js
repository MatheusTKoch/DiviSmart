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
    let sql = 'CREATE TABLE IF NOT EXISTS carteiras (CarteiraID int NOT NULL AUTO_INCREMENT, Nome varchar(100) NOT NULL, userId INT NOT NULL, deletedAt DATETIME, FOREIGN KEY (userId) REFERENCES users(UserID), PRIMARY KEY(CarteiraID))'
    db.query(sql, (err) => {
        if (err) throw err;
        console.log("Tabela criada!");
        db.end();
    })
});