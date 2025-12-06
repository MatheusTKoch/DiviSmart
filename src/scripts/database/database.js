import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const { Pool } = pg; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const db = new Pool({
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

db.connect().then(() => {
        console.log('Conectado com sucesso');
        const sql = `
            CREATE DATABASE divismart
        `;
        return db.query(sql);
    })
    .then(() => {
        console.log('Banco Criado!');
        db.end();
    })
    .catch(err => {
        console.error('Erro no comando:', err);
        db.end();
    });