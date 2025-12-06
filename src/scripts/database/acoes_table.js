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

async function createTablesIfNotExists() {
    //Criando acoes
    const sql_acoes = `
        CREATE TABLE IF NOT EXISTS acoes (
            acaoid SERIAL PRIMARY KEY,
            ticker VARCHAR(6) NOT NULL UNIQUE,
            descricao TEXT NOT NULL
        );
    `;

    //Criando ativos_acoes
    const sql_ativos_acoes = `
        CREATE TABLE IF NOT EXISTS ativos_acoes (
            ativoacaoid SERIAL PRIMARY KEY,
            quantidade INT NOT NULL,
            valorinvestido NUMERIC(15, 2),
            datacadastro TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            carteiraid INT NOT NULL,
            deletedat TIMESTAMP WITHOUT TIME ZONE,
            acaoid INT NOT NULL,
            
            FOREIGN KEY(carteiraid) REFERENCES carteiras("carteiraid"),
            FOREIGN KEY (acaoid) REFERENCES acoes("acaoid")
        );
    `;

    //Criando dividendos_acoes
    const sql_dividendos_acoes = `
        CREATE TABLE IF NOT EXISTS dividendos_acoes (
            dividendoacaoid SERIAL PRIMARY KEY,
            datapagamento TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            valorpagamento NUMERIC(15, 2),
            acaoid INT NOT NULL,
            
            FOREIGN KEY (acaoid) REFERENCES acoes("acaoid")
        );
    `;
    
    try {
        console.log('--- Iniciando Criação de Tabelas ---');

        console.log('Criando "acoes"...');
        await db.query(sql_acoes);
        console.log('Tabela "ativos_acoes" criada ou já existente!');

        console.log('Criando "ativos_acoes"...');
        await db.query(sql_ativos_acoes);
        console.log('Tabela "ativos_acoes" criada ou já existente!');
        
        console.log('Criando "dividendos_acoes"...');
        await db.query(sql_dividendos_acoes);
        console.log('Tabela "dividendos_acoes" criada ou já existente!');
        
        console.log('--- Criação de FIIs Ações Concluída ---');
        
    } catch (err) {
        console.error('Erro ao criar uma das tabelas:', err.message);
        console.error('Verifique se as tabelas já existem.');
        throw err;
    } finally {
        await db.end();
    }
}

createTablesIfNotExists()
    .catch(err => {
        console.error('Falha no processo de criação das tabelas:', err.message);
        process.exit(1);
    });

// db.connect((err) => {
//     if (err) throw err;
//     let sql = 'CREATE TABLE IF NOT EXISTS acoes (AcaoID int NOT NULL AUTO_INCREMENT, Ticker varchar(6) NOT NULL, Descricao TEXT NOT NULL, PRIMARY KEY(AcaoID))'
//     db.query(sql, (err) => {
//         if (err) throw err;
//         console.log("Tabela criada!");
//         db.end();
//     })
// });