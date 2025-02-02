import axios from "axios";
import pdfParse from "pdf-parse";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const db = await mysql.createConnection({
  host: process.env.VITE_HOST_DB,
  user: process.env.VITE_USER_DB,
  password: process.env.VITE_PASSWORD_DB,
  database: process.env.VITE_DATABASE_DB,
});

const TESOURO_PDF_URL = process.env.VITE_URL_TESOURO_PDF;
const FILE_NAME = "/DatasPag20240701.pdf";
const FILE_PATH = path.join(__dirname, FILE_NAME);


async function downloadPDF() {
  try {
    const response = await axios.get(TESOURO_PDF_URL, { responseType: "arraybuffer" });
    fs.writeFileSync(FILE_PATH, response.data);
    console.log(`Arquivo salvo em: ${FILE_PATH}`);
    console.log("Arquivo PDF baixado com sucesso!");
  } catch (error) {
    console.error("Erro ao baixar o arquivo PDF:", error.message);
  }
}

async function processPDF() {
  try {
    const buffer = fs.readFileSync(FILE_PATH);
    const data = await pdfParse(buffer);
    const text = data.text;
    
    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const dividendos = [];
    
    const regex = /(\d{2}\/\d{2}\/\d{4}).*?(\d+,\d{2})/;
    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        const dataPagamento = new Date(match[1].split("/").reverse().join("-"));
        const valorPagamento = parseFloat(match[2].replace(",", "."));
        dividendos.push({
          CodigoTitulo: "EXEMPLO", 
          DataPagamento: dataPagamento,
          ValorPagamento: valorPagamento,
        });
      }
    }
    return dividendos;
  } catch (error) {
    console.error("Erro ao processar o PDF:", error.message);
    return [];
  }
}

async function getTesouroIDPorCodigo(codigoTitulo) {
  const query = "SELECT TesouroID FROM tesouro_direto WHERE CodigoTitulo = ?";
  const [rows] = await db.execute(query, [codigoTitulo]);
  if (rows.length > 0) {
    return rows[0].TesouroID;
  }
  return null;
}

async function salvarDividendosTesouro(dividendo) {
  const insertQuery = `
    INSERT INTO dividendos_tesouro (TesouroID, DataPagamento, ValorPagamento)
    VALUES (?, ?, ?);
  `;
  await db.execute(insertQuery, [
    dividendo.TesouroID,
    dividendo.DataPagamento,
    dividendo.ValorPagamento,
  ]);
  console.log(`Dividendos inseridos para TesouroID ${dividendo.TesouroID}`);
}


async function executar() {
  try {
    await downloadPDF();
    const dividendosExtraidos = await processPDF();
    console.log("Dados extraídos do PDF:", dividendosExtraidos);
    
    for (const reg of dividendosExtraidos) {
      const tesouroID = await getTesouroIDPorCodigo(reg.CodigoTitulo);
      if (tesouroID) {
        const dividendData = {
          TesouroID: tesouroID,
          DataPagamento: reg.DataPagamento,
          ValorPagamento: reg.ValorPagamento,
        };
        await salvarDividendosTesouro(dividendData);
      } else {
        console.warn(`Não encontrado registro em tesouro_direto para o código: ${reg.CodigoTitulo}`);
      }
    }
    
    console.log("Processo concluído!");
  } catch (error) {
    console.error("Erro no processo:", error.message);
  } finally {
    await db.end();
  }
}

executar();
