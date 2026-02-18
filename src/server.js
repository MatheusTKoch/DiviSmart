import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

//Configuração do .env e express
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Configuração de pool Postgres
const pool = new Pool({
  user: process.env.VITE_USER_DB,
  host: process.env.VITE_HOST_DB,
  database: process.env.VITE_DATABASE_DB,
  password: process.env.VITE_PASSWORD_DB,
  port: 5432,
});

//Configuração do Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "divi_session:",
});

//Configuração do server

//CORS
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true 
}));

//Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: redisStore,
    secret: process.env.VITE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //Em produção alterar para true
      httpOnly: true,
      maxAge: 10 * 3600000,
      sameSite: 'lax'
    },
  }),
);

const queryDatabase = async (text, params) => {
  const res = await pool.query(text, params);
  return res.rows;
};

// --- ROTAS ---

//Rotas de login e autenticação

app.post("/users_register", async (req, res) => {
  try {
    const { email, nome, sobrenome, senha } = req.body;
    const emailResult = await queryDatabase(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (emailResult.length > 0)
      return res.status(400).send("O email informado já foi utilizado!");

    const registroSql =
      "INSERT INTO users (email, nome, sobrenome, password) VALUES ($1, $2, $3, $4) RETURNING userid";
    const registroResult = await queryDatabase(registroSql, [
      email,
      nome,
      sobrenome,
      senha,
    ]);

    if (registroResult.length > 0) {
      const userID = registroResult[0].userid;
      req.session.usuario = userID;
      res.status(200).send({
        usID: userID,
        exp: req.session.cookie.expires,
        sID: req.sessionID,
      });
    }
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});


app.post("/users_login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const userResult = await queryDatabase(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (userResult.length === 0 || userResult[0].password !== senha)
      return res.status(401).send("Credenciais inválidas");

    const user = userResult[0];

    req.session.userId = user.userid;

    res.status(200).send({ message: "Login successful" });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/get_user_name", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).send("Usuário não autenticado");
    }
    const userResult = await queryDatabase(
      "SELECT nome FROM users WHERE userid = $1",
      [req.session.userId],
    );
    if (userResult.length > 0) {
      res.status(200).send({ Nome: userResult[0].nome });
    } else {
      res.status(404).send("Nome de usuário não encontrado");
    }
  } catch (err) {
    console.error("Erro ao obter nome do usuário:", err);
    res.status(500).send("Erro interno no servidor");
  }
});

app.get("/verify_session", (req, res) => {
  if (req.session.userId) {
    return res.status(200).send({ authenticated: true });
  }
  res.status(401).send("Sessão expirada");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Erro ao sair");
    res.clearCookie('connect.sid', { httpOnly: true, sameSite: 'lax' });
    res.status(200).send("sucesso");
  });
});

app.post("/users_load", async (req, res) => {
  try {
    const userResult = await queryDatabase(
      "SELECT * FROM USERS WHERE userId = $1",
      [req.body.usID],
    );
    if (!userResult || userResult.length === 0)
      return res.status(401).send("Usuário não encontrado");
    res.status(200).send({ Nome: userResult[0].nome });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

//Rotas de carteira
app.post("/carteira", async (req, res) => {
  try {
    const sql = "INSERT INTO carteiras (nome, userId) values ($1, $2)";
    await queryDatabase(sql, [req.body.carteira, req.body.userID]);
    res.status(200).send("fecharModal");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_load", async (req, res) => {
  try {
    const sql =
      "SELECT * FROM carteiras where userId = $1 and deletedAt IS NULL";
    const result = await queryDatabase(sql, [req.body.userID]);

    const mapped = result.map((row) => ({
      ...row,
      CarteiraID: row.carteiraid ?? row.carteiraId ?? row.CarteiraID,
      Nome: row.nome ?? row.Nome,
    }));

    res.status(200).send(mapped);
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_name", async (req, res) => {
  try {
    const sql =
      "SELECT * FROM carteiras where userId = $1 and CarteiraID = $2 and deletedAt IS NULL";
    const result = await queryDatabase(sql, [req.body.userID, req.body.cID]);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_dados", async (req, res) => {
  try {
    const cID = req.body.cID;
    const totalAcao =
      (
        await queryDatabase(
          "SELECT sum(ValorInvestido) as total FROM ativos_acoes WHERE carteiraID = $1 AND deletedAt IS NULL",
          [cID],
        )
      )[0].total || 0;
    const totalFii =
      (
        await queryDatabase(
          "SELECT sum(ValorInvestido) as total FROM ativos_fii WHERE carteiraID = $1 AND deletedAt IS NULL",
          [cID],
        )
      )[0].total || 0;
    const totalTesouro =
      (
        await queryDatabase(
          "SELECT sum(ValorInvestido) as total FROM ativos_tesouro WHERE carteiraID = $1 AND deletedAt IS NULL",
          [cID],
        )
      )[0].total || 0;

    const countAcao =
      parseInt(
        (
          await queryDatabase(
            "SELECT count(*) as count FROM ativos_acoes WHERE carteiraID = $1 AND deletedAt IS NULL",
            [cID],
          )
        )[0].count,
      ) || 0;
    const countFii =
      parseInt(
        (
          await queryDatabase(
            "SELECT count(*) as count FROM ativos_fii WHERE carteiraID = $1 AND deletedAt IS NULL",
            [cID],
          )
        )[0].count,
      ) || 0;
    const countTesouro =
      parseInt(
        (
          await queryDatabase(
            "SELECT count(*) as count FROM ativos_tesouro WHERE carteiraID = $1 AND deletedAt IS NULL",
            [cID],
          )
        )[0].count,
      ) || 0;

    res.status(200).send({
      valores:
        parseFloat(totalAcao) + parseFloat(totalFii) + parseFloat(totalTesouro),
      quantidade: countAcao + countFii + countTesouro,
    });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_delete", async (req, res) => {
  try {
    const id = req.body.carteiraID;
    await queryDatabase(
      "UPDATE carteiras SET deletedAt = now() WHERE carteiraId = $1",
      [id],
    );
    await queryDatabase(
      "UPDATE ativos_acoes SET deletedAt = now() WHERE carteiraId = $1",
      [id],
    );
    await queryDatabase(
      "UPDATE ativos_fii SET deletedAt = now() WHERE carteiraId = $1",
      [id],
    );
    res.status(200).send("Carteira deletada!");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});


//Rotas de ativos/dividendos
app.post("/acoes_cadastro", async (req, res) => {
  try {
    const sql =
      "INSERT INTO ativos_acoes (quantidade, valorinvestido, datacadastro, carteiraid, acaoid) values ($1, $2, now(), $3, $4)";
    await queryDatabase(sql, [
      req.body.quantidade,
      req.body.valorInvestido,
      req.body.cID,
      req.body.acaoID,
    ]);
    res.status(200).send("Cadastro realizado com sucesso!");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/fii_cadastro", async (req, res) => {
  try {
    const sql =
      "INSERT INTO ativos_fii (quantidade, valorinvestido, datacadastro, carteiraid, fiid) values ($1, $2, now(), $3, $4)";
    await queryDatabase(sql, [
      req.body.quantidade,
      req.body.valorInvestido,
      req.body.cID,
      req.body.fiiID,
    ]);
    res.status(200).send("Cadastro realizado com sucesso!");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/tesouro_cadastro", async (req, res) => {
  try {
    const sql =
      "INSERT INTO ativos_fii (quantidade, valorinvestido, datacadastro, carteiraid, fiid) values ($1, $2, now(), $3, $4)";
    await queryDatabase(sql, [
      req.body.quantidade,
      req.body.valorInvestido,
      req.body.cID,
      req.body.tesID,
    ]);
    res.status(200).send("Cadastro realizado com sucesso!");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/cotacoes_load", async (req, res) => {
  try {
    const sql = "SELECT ativo, valoratual FROM cotacoes ORDER BY ativo";
    const result = await queryDatabase(sql);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/dividendos_load", async (req, res) => {
  try {
    const { cID, dataInicial, dataFinal } = req.body;

    const sql_dividendos_acoes = `
      SELECT 
        da.*, 
        a.ticker, 
        a.descricao
      FROM dividendos_acoes da
      JOIN acoes a ON da.acaoid = a.acaoid
      JOIN ativos_acoes aa ON a.acaoid = aa.acaoid
      WHERE aa.carteiraid = $1 
        AND aa.deletedat IS NULL
        AND da.datapagamento >= $2 
        AND da.datapagamento <= $3
      ORDER BY da.datapagamento DESC`;

    const sql_dividendos_fii = `
      SELECT 
        df.*, 
        f.ticker
      FROM dividendos_fii df
      JOIN fundo_imobiliario f ON df.fiid = f.fundoimobiliarioid
      JOIN ativos_fii af ON f.fundoimobiliarioid = af.fiid
      WHERE af.carteiraid = $1 
        AND af.deletedat IS NULL
        AND df.datapagamento >= $2 
        AND df.datapagamento <= $3
      ORDER BY df.datapagamento DESC`;

    const acoesResult = await queryDatabase(sql_dividendos_acoes, [cID, dataInicial, dataFinal]);
    const fiiResult = await queryDatabase(sql_dividendos_fii, [cID, dataInicial, dataFinal]);

    res.status(200).send({
      fii: fiiResult,
      acao: acoesResult
    });

  } catch (err) {
    console.error("Erro ao carregar dividendos: ", err);
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/ativos_load", async (req, res) => {
  try {
    const acoes = await queryDatabase(
      "SELECT acaoid, ticker, descricao FROM acoes ORDER BY ticker ASC",
    );

    const tesouro = await queryDatabase(
      "SELECT tesouroid, descricao, investimentominimo, vencimento, codigotitulo FROM tesouro_direto ORDER BY descricao ASC",
    );

    const fii = await queryDatabase(
      "SELECT fundoimobiliarioid, ticker, segmento FROM fundo_imobiliario ORDER BY ticker ASC",
    );

    res.status(200).send({
      acoes,
      tesouro,
      fii,
    });
  } catch (err) {
    console.error("Erro ao carregar ativos de referência:", err);
    res.status(500).send("Erro interno no servidor ao carregar dados.");
  }
});

const PORT = process.env.VITE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}.`);
});
