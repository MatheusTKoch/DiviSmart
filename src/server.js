import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
  user: process.env.VITE_USER_DB,
  host: process.env.VITE_HOST_DB,
  database: process.env.VITE_DATABASE_DB,
  password: process.env.VITE_PASSWORD_DB,
  port: 5432,
});

const app = express();
const cookie_life = 10 * 3600000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.VITE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: cookie_life,
    },
  }),
);

const queryDatabase = async (text, params) => {
  const res = await pool.query(text, params);
  return res.rows;
};

// --- ROTAS ---
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

    if (userResult.length === 0)
      return res.status(404).send("Email não encontrado");
    if (userResult[0].password !== senha)
      return res.status(401).send("Senha incorreta!");

    const userID = userResult[0].userid;
    req.session.usuario = userID;

    const expires = new Date(req.session.cookie.expires).toISOString();
    const sql_session =
      "INSERT INTO user_session (expires, sessionid, sessiondata, userid) VALUES ($1, $2, $3, $4)";
    await queryDatabase(sql_session, [
      expires,
      req.sessionID,
      JSON.stringify(req.session),
      userID,
    ]);

    res.status(200).send({
      usID: userID,
      exp: req.session.cookie.expires,
      sID: req.sessionID,
    });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
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

app.post("/carteira_load", async (req, res) => {
  try {
    const sql =
      "SELECT * FROM carteiras where userId = $1 and deletedAt IS NULL";
    const result = await queryDatabase(sql, [req.body.userID]);
    res.status(200).send(result);
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

app.post("/acoes_cadastro", async (req, res) => {
  try {
    const sql =
      "INSERT INTO ativos_acoes (Quantidade, ValorInvestido, DataCadastro, carteiraID, acaoID) values ($1, $2, now(), $3, $4)";
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

app.post("/carteira", async (req, res) => {
  try {
    const sql = "INSERT INTO carteiras (nome, userId) values ($1, $2)";
    await queryDatabase(sql, [req.body.carteira, req.body.userID]);
    res.status(200).send("fecharModal");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/session", async (req, res) => {
  try {
    const { usID, sID, exp } = req.body;
    const sessionResult = await queryDatabase(
      "SELECT * FROM USER_SESSION WHERE userId = $1 AND sessionid = $2",
      [usID, sID],
    );

    if (!sessionResult || sessionResult.length === 0)
      return res.status(401).send("Sessão não encontrada");

    if (new Date() > new Date(exp))
      return res.status(401).send("Sessao expirada");

    res.status(200).send({ status: "Sessão ativa" });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/logout", async (req, res) => {
  try {
    await queryDatabase(
      "DELETE FROM USER_SESSION WHERE userId = $1 AND sessionid = $2",
      [req.body.usID, req.body.sID],
    );
    res.status(200).send("sucesso");
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

app.post("/ativos_load", async (req, res) => {
  try {
    const acoes = await queryDatabase(
      "SELECT acaoid, ticker, descricao FROM acoes ORDER BY ticker ASC"
    );

    const tesouro = await queryDatabase(
      "SELECT tesouroid, descricao, investimentominimo, vencimento, codigotitulo FROM tesouro_direto ORDER BY descricao ASC"
    );

    const fii = await queryDatabase(
      "SELECT fundoimobiliarioid, ticker, segmento FROM fundo_imobiliario ORDER BY ticker ASC"
    );

    res.status(200).send({
      acoes,
      tesouro,
      fii
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
