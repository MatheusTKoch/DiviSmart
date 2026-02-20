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
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.VITE_EMAIL_HOST,
  port: process.env.VITE_EMAIL_PORT,
  secure: process.env.VITE_EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.VITE_EMAIL_USER,
    pass: process.env.VITE_EMAIL_PASS,
  },
});

// --- MIDDLEWARE ---

const authMiddleware = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send("Usuário não autenticado");
  }
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

    // Refatorar para usar bcrypt aqui
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
      req.session.userId = userID;
      res.status(200).send({ message: "Registro realizado com sucesso" });
    }
  } catch (err) {
    console.error("Erro no registro:", err);
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
      return res.status(401).send("Credenciais inválidas");

    const user = userResult[0];

    // Refatorar para usar bcrypt aqui
    if (user.password !== senha) 
      return res.status(401).send("Credenciais inválidas");

    req.session.userId = user.userid;

    res.status(200).send({ message: "Login successful" });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await queryDatabase(
      "SELECT userid FROM users WHERE email = $1",
      [email],
    );

    if (userResult.length === 0) {
      return res.status(200).send("Se o email estiver registrado, um link de redefinição foi enviado.");
    }

    const userId = userResult[0].userid;
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 3600000); 

    await queryDatabase(
      `INSERT INTO password_resets ("userId", token_hash, expires_at) VALUES ($1, $2, $3)
       ON CONFLICT ("userId") DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at, created_at = NOW()`,
      [userId, tokenHash, expiresAt],
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`; // Use your frontend URL

    await transporter.sendMail({
      from: process.env.VITE_EMAIL_USER,
      to: email,
      subject: "Redefinição de Senha - DiviSmart",
      html: `
        <p>Você solicitou uma redefinição de senha para sua conta DiviSmart.</p>
        <p>Por favor, clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${resetUrl}">Redefinir Senha</a></p>
        <p>Este link expirará em 1 hora.</p>
        <p>Se você não solicitou isso, por favor, ignore este email.</p>
      `,
    });

    res.status(200).send("Se o email estiver registrado, um link de redefinição foi enviado.");
  } catch (err) {
    console.error("Erro no forgot-password:", err);
    res.status(500).send("Erro interno no servidor ao solicitar redefinição de senha.");
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).send("Token e nova senha são obrigatórios.");
    }

    const resetEntry = await queryDatabase(
      `SELECT pr."userId", pr.token_hash, pr.expires_at, u.email
       FROM password_resets pr
       JOIN users u ON pr."userId" = u.userid
       WHERE pr.expires_at > NOW()`, 
    );

    let foundToken = null;
    for (const entry of resetEntry) {
        const isMatch = await bcrypt.compare(token, entry.token_hash);
        if (isMatch) {
            foundToken = entry;
            break;
        }
    }

    if (!foundToken) {
      return res.status(400).send("Token de redefinição inválido ou expirado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await queryDatabase(
      "UPDATE users SET password = $1 WHERE userid = $2",
      [hashedPassword, foundToken.userId],
    );

    await queryDatabase(
      `DELETE FROM password_resets WHERE "userId" = $1`,
      [foundToken.userId],
    );

    res.status(200).send("Sua senha foi redefinida com sucesso!");
  } catch (err) {
    console.error("Erro no reset-password:", err);
    res.status(500).send("Erro interno no servidor ao redefinir a senha.");
  }
});


app.get("/get_user_name", authMiddleware, async (req, res) => {
  try {
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
    return res.status(200).send({ authenticated: true, carteiraId: req.session.carteiraId });
  }
  res.status(401).send("Sessão expirada");
});

app.post("/set_active_carteira", authMiddleware, (req, res) => {
  const { cID } = req.body;
  if (!cID) return res.status(400).send("CarteiraID não informado");
  req.session.carteiraId = cID;
  res.status(200).send({ message: "Carteira ativa definida", carteiraId: cID });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Erro ao sair");
    res.clearCookie('connect.sid', { httpOnly: true, sameSite: 'lax' });
    res.status(200).send("sucesso");
  });
});

app.get("/users_load", authMiddleware, async (req, res) => {
  try {
    const userResult = await queryDatabase(
      "SELECT * FROM USERS WHERE userId = $1",
      [req.session.userId],
    );
    if (!userResult || userResult.length === 0)
      return res.status(401).send("Usuário não encontrado");
    res.status(200).send({ Nome: userResult[0].nome });
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

//Rotas de carteira
app.post("/carteira", authMiddleware, async (req, res) => {
  try {
    const sql = "INSERT INTO carteiras (nome, userId) values ($1, $2)";
    await queryDatabase(sql, [req.body.carteira, req.session.userId]);
    res.status(200).send("fecharModal");
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_load", authMiddleware, async (req, res) => {
  try {
    const sql =
      "SELECT * FROM carteiras where userId = $1 and deletedAt IS NULL";
    const result = await queryDatabase(sql, [req.session.userId]);

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

app.post("/carteira_name", authMiddleware, async (req, res) => {
  try {
    const sql =
      "SELECT * FROM carteiras where userId = $1 and CarteiraID = $2 and deletedAt IS NULL";
    const result = await queryDatabase(sql, [req.session.userId, req.body.cID]);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/carteira_dados", authMiddleware, async (req, res) => {
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

app.post("/carteira_delete", authMiddleware, async (req, res) => {
  try {
    const id = req.body.carteiraID;
    await queryDatabase(
      "UPDATE carteiras SET deletedAt = now() WHERE carteiraId = $1 AND userId = $2",
      [id, req.session.userId],
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
app.post("/acoes_cadastro", authMiddleware, async (req, res) => {
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

app.post("/fii_cadastro", authMiddleware, async (req, res) => {
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

app.post("/tesouro_cadastro", authMiddleware, async (req, res) => {
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

app.post("/cotacoes_load", authMiddleware, async (req, res) => {
  try {
    const sql = "SELECT ativo, valoratual FROM cotacoes ORDER BY ativo";
    const result = await queryDatabase(sql);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Erro interno no servidor");
  }
});

app.post("/dividendos_load", authMiddleware, async (req, res) => {
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

app.post("/ativos_load", authMiddleware, async (req, res) => {
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
