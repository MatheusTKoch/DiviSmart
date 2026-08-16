import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import axios from "axios";
import * as cheerio from "cheerio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const isDocker = process.env.POSTGRES_HOST_DB === "db";
const db = new Pool({
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST_DB,
  port: isDocker ? 5432 : Number(process.env.PORT) || 5433,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Converte strings para float
function parseNumeroBr(val) {
  if (!val) return null;
  const limpo = val.replace(/\./g, "").replace(",", ".").replace("%", "").trim();
  const num = parseFloat(limpo);
  return isNaN(num) ? null : num;
}

// Limpa espaços duplicados, quebras de linha e normaliza texto
function normalizarTexto(txt) {
  return txt
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
} 

function extrairValorPorRotulo($, rotuloAlvo) {
  let valorEncontrado = null;
  const alvoNormalizado = normalizarTexto(rotuloAlvo);

  $("td.label").each((_, el) => {
    const $label = $(el);
    const $labelClone = $label.clone();
    $labelClone.find(".help").remove(); 
    
    const textoLabel = normalizarTexto($labelClone.text());

    if (textoLabel === alvoNormalizado || textoLabel.includes(alvoNormalizado)) {
      const $tdValor = $label.next("td");
      if ($tdValor.length > 0) {
        valorEncontrado = $tdValor.find("span.txt").text().trim() || $tdValor.text().trim();
        if (valorEncontrado) return false; 
      }
    }
  });

  return valorEncontrado;
}

async function rasparDetalhesTicker(ticker) {
  const url = `https://www.fundamentus.com.br/detalhes.php?papel=${ticker}`;
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
      responseType: "text",
      timeout: 10000,
    });

    const $ = cheerio.load(res.data);

    let cotacaoRaw = extrairValorPorRotulo($, "cotacao");
    if (!cotacaoRaw) {
      cotacaoRaw = $("td.label.destaque").next("td.data.destaque").text().trim();
    }

    const plRaw = extrairValorPorRotulo($, "p/l");
    const pvpRaw = extrairValorPorRotulo($, "p/vp");
    const dyRaw =
      extrairValorPorRotulo($, "div. yield") ||
      extrairValorPorRotulo($, "div yield") ||
      extrairValorPorRotulo($, "div.yield");

    return {
      precoatual: parseNumeroBr(cotacaoRaw),
      pl: parseNumeroBr(plRaw),
      pvp: parseNumeroBr(pvpRaw),
      dividendyield: parseNumeroBr(dyRaw),
    };
  } catch (err) {
    console.error(`Erro ao raspar ${ticker}:`, err.message);
    return null;
  }
}

async function executarScrapeFrequente() {
  let client;
  try {
    client = await db.connect();
    console.log("Conectado ao PostgreSQL com sucesso.");

    // Processar Ações
    const resAcoes = await client.query(
      "SELECT ticker FROM acoes ORDER BY ticker ASC"
    );
    const acoes = resAcoes.rows;
    console.log(`\nIniciando atualização de ${acoes.length} ações...`);

    const sqlAcao = `
      UPDATE acoes 
      SET precoatual = $1, pl = $2, pvp = $3, dividendyield = $4, dataatualizacao = $5
      WHERE ticker = $6;
    `;

    for (let i = 0; i < acoes.length; i++) {
      const ticker = acoes[i].ticker;
      console.log(`[Ações ${i + 1}/${acoes.length}] Raspando ${ticker}...`);

      const dados = await rasparDetalhesTicker(ticker);
      if (dados) {
        await client.query(sqlAcao, [
          dados.precoatual,
          dados.pl,
          dados.pvp,
          dados.dividendyield,
          new Date(),
          ticker,
        ]);
      }
      await delay(400); 
    }

    // Processar FIIs
    const resFiis = await client.query(
      "SELECT ticker FROM fundo_imobiliario ORDER BY ticker ASC"
    );
    const fiis = resFiis.rows;
    console.log(`\nIniciando atualização de ${fiis.length} FIIs...`);

    const sqlFii = `
      UPDATE fundo_imobiliario 
      SET precoatual = $1, pvp = $2, dividendyield = $3, dataatualizacao = $4
      WHERE ticker = $5;
    `;

    for (let i = 0; i < fiis.length; i++) {
      const ticker = fiis[i].ticker;
      console.log(`[FIIs ${i + 1}/${fiis.length}] Raspando ${ticker}...`);

      const dados = await rasparDetalhesTicker(ticker);
      if (dados) {
        await client.query(sqlFii, [
          dados.precoatual,
          dados.pvp,
          dados.dividendyield,
          new Date(),
          ticker,
        ]);
      }
      await delay(400);
    }

    console.log("\nAtualização de todos os indicadores concluída com sucesso!");
  } catch (err) {
    console.error("Erro durante a execução do script:", err.message);
  } finally {
    if (client) client.release();
    await db.end();
    console.log("Conexão com o banco encerrada.");
  }
}

executarScrapeFrequente();