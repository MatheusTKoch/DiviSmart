import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const db = new Pool({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

async function createAuthTables() {
    // Users
    const sql_users = `
        CREATE TABLE IF NOT EXISTS users (
            userid SERIAL PRIMARY KEY,
            email VARCHAR(50) NOT NULL,
            nome VARCHAR(50) NOT NULL,
            sobrenome VARCHAR(100) NOT NULL,
            password VARCHAR(20) NOT NULL 
        );
    `;

    // User session
    const sql_user_session = `
        CREATE TABLE IF NOT EXISTS user_session (
            usersessionid SERIAL PRIMARY KEY,
            expires TIMESTAMP WITH TIME ZONE NOT NULL, 
            sessionid VARCHAR(50) NOT NULL,
            sessiondata TEXT NOT NULL, 
            userid INT NOT NULL,
            
            FOREIGN KEY (userid) REFERENCES users(userid)
        );
    `;
    
    try {
        console.log('--- Iniciando Criação das Tabelas users e user_session ---');
        
        // Executa a criação da tabela users
        console.log('Tentando criar a tabela "users"...');
        await db.query(sql_users);
        console.log('Tabela "users" criada ou já existente!');
        
        // Executa a criação da tabela user_session
        console.log('Tentando criar a tabela "user_session"...');
        await db.query(sql_user_session);
        console.log('Tabela "user_session" criada ou já existente!');
        
        console.log('--- Criação de Tabelas Concluída ---');
        
    } catch (err) {
        console.error('Erro fatal ao criar uma das tabelas:', err.message);
        throw err;
    } finally {
        // Encerra o pool de conexões
        await db.end();
    }
}

// Inicia a função
createAuthTables()
    .catch(err => {
        console.error('Falha no processo de criação das tabelas:', err.message);
        process.exit(1);
    });