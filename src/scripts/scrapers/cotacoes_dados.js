import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cherrio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../../../.env')});

const db = mysql.createConnection({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
});

const URL_DOLAR = process.env.VITE_URL_COTACAO_DOLAR;
const URL_BITCOIN = process.env.VITE_URL_COTACAO_BITCOIN;
const URL_OURO = process.env.VITE_URL_COTACAO_OURO;

async function initDB() {
    const connection = await db;
    return connection;
  }

  function parseFormattedNumber(input) {
    let cleaned = input.replace(/[^\d.,]/g, '');
    cleaned = cleaned.replace(/,/g, '');
    const parts = cleaned.split('.');
    const integerPart = parts[0] || '0';
    const decimalPart = parts[1] ? parts[1].substring(0,2) : '00';
    return integerPart + '.' + decimalPart;
  }  

async function scrapeUSDBRL(connection) {
    try {
      const response = await axios.get(URL_DOLAR, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const $ = cherrio.load(response.data);
      const rateText = $('.ccOutputRslt').first().text().trim();
      const match = rateText.match(/([\d,.]+)/);
      if (match) {
        const rate = parseFloat(match[1].replace(',', ''));
        console.log("USD/BRL:", rate);
        const now = new Date();
        await connection.execute(
          'INSERT INTO cotacoes (Ativo, ValorAtual, DataAtualizacao) VALUES (?, ?, ?)',
          ['USD/BRL', rate, now]
        );
      } else {
        console.error("Não foi possível extrair a cotação do dólar.");
      }
    } catch (error) {
      console.error("Erro ao fazer scraping de USD/BRL:", error.message);
    }
  }
  
async function scrapeBitcoin(connection) {
    try {
      const response = await axios.get(URL_BITCOIN, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const $ = cherrio.load(response.data);
      let priceText = $('.tabular-nums').first().text().trim();
      const price = parseFormattedNumber(priceText);
      console.log('Bitcoin:', price);
      const now = new Date();
      await connection.execute(
        'INSERT INTO cotacoes (Ativo, ValorAtual, DataAtualizacao) VALUES (?, ?, ?)',
          ['Bitcoin', price, now]
      )
    } catch (error) {
      console.error('Erro ao fazer scraping do Bitcoin:', error.message);
    }
}

async function scrapeGold(connection) {
    try {
      const response = await axios.get(URL_OURO, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const $ = cherrio.load(response.data);
      let priceText = $('div[data-test="instrument-price-last"]').first().text().trim();
      priceText = priceText.replace(/,/g, '');
      const price = parseFloat(priceText);
      console.log('Gold:', price);
      const now = new Date();
      await connection.execute(
        'INSERT INTO cotacoes (Ativo, ValorAtual, DataAtualizacao) VALUES (?, ?, ?)',
          ['Ouro/USD', price, now]
      )
    } catch (error) {
      console.error('Erro ao fazer scraping do Ouro:', error.message);
    }
  }
  
  async function main() {
    const connection = await initDB();
    await scrapeUSDBRL(connection);
    await scrapeBitcoin(connection);
    await scrapeGold(connection);
    await connection.end();
  }
  
  main();