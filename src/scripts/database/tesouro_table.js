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

async function createTesouroSchema() {
    //Tesouro Direto
    const sql_tesouro_direto = `
        CREATE TABLE IF NOT EXISTS tesouro_direto (
            tesouroid SERIAL PRIMARY KEY,
            descricao TEXT NOT NULL UNIQUE,
            investimentominimo NUMERIC(15, 2) NOT NULL,
            vencimento DATE NOT NULL,
            codigotitulo VARCHAR(20)
        );
    `;

    //Ativos Tesouro
    const sql_ativos_tesouro = `
        CREATE TABLE IF NOT EXISTS ativos_tesouro (
            ativotesouroid SERIAL PRIMARY KEY,
            quantidade INT NOT NULL,
            valorinvestido NUMERIC(15, 2),
            datacadastro TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            carteiraid INT NOT NULL,
            deletedat TIMESTAMP WITHOUT TIME ZONE,
            tesouroid INT NOT NULL,
            
            FOREIGN KEY(carteiraid) REFERENCES carteiras("carteiraid"),
            FOREIGN KEY (tesouroid) REFERENCES tesouro_direto("tesouroid")
        );
    `;
    
    //Dividendo Tesouro
    const sql_dividendos_tesouro = `
        CREATE TABLE IF NOT EXISTS dividendos_tesouro (
            dividendotesouroid SERIAL PRIMARY KEY,
            datapagamento TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            valorpagamento NUMERIC(15, 2),
            tesouroid INT NOT NULL,
            
            FOREIGN KEY (tesouroid) REFERENCES tesouro_direto("tesouroid"),

            UNIQUE(tesouroid, datapagamento)
        );
    `;
    
    try {
        console.log('--- Iniciando Criação de Tesouro Direto Schema ---');
        
        await db.query(sql_tesouro_direto);
        console.log('Tabela "tesouro_direto" criada.');
        
        await db.query(sql_ativos_tesouro);
        console.log('Tabela "ativos_tesouro" criada.');
        
        await db.query(sql_dividendos_tesouro);
        console.log('Tabela "dividendos_tesouro" criada.');
        
        console.log('--- Criação de Tesouro Direto Schema Concluída ---');
        
    } catch (err) {
        console.error('Erro fatal ao criar as tabelas:', err.message);
        console.error('Verifique a existência da tabela "carteiras" e a ordem de criação.');
        throw err;
    } finally {
        await db.end();
    }
}

createTesouroSchema()
    .catch(err => {
        console.error('Falha no processo de criação:', err.message);
        process.exit(1);
    });