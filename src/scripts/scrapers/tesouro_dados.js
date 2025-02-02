import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const db = mysql.createConnection({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

const TESOURO_URL = process.env.VITE_URL_TESOURO;

async function extrairDados() {
    try {
        const response = await axios.get(TESOURO_URL);
        const data = response.data;
      
        if (!data || !data.response || !data.response.TrsrBdTradgList) {
            throw new Error("Estrutura do JSON inesperada.");
        }
        const bonds = data.response.TrsrBdTradgList;

        const extractedData = bonds.map((bond) => {
            const { nm, mtrtyDt, minInvstmtAmt, cd } = bond.TrsrBd;

            return {
                Nome: nm,
                InvestimentoMinimo: minInvstmtAmt,
                Vencimento: mtrtyDt.split("T")[0],
                CodigoTitulo: cd || null,
            };
        });

        console.log("Dados extraídos:", extractedData);

        const insertQuery = `
            INSERT INTO tesouro_direto 
            (Descricao, InvestimentoMinimo, Vencimento, CodigoTitulo)
            VALUES (?, ?, ?, ?);
        `;

        for (const item of extractedData) {
            await db.execute(insertQuery, [
                item.Nome,
                item.InvestimentoMinimo,
                item.Vencimento,
                item.CodigoTitulo,
            ]);
        }

      console.log("Dados inseridos no banco com sucesso!");

        await db.end();
    } catch (error) {
        console.error("Erro ao processar os dados:", error.message);
    }

} 

extrairDados();
