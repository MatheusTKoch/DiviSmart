import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg'; 
const { Pool } = pkg;
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.VITE_USER_DB,
    host: process.env.VITE_HOST_DB, 
    database: process.env.VITE_DATABASE_DB,
    password: process.env.VITE_PASSWORD_DB,
    port: 5432,
});

const app = express();
const cookie_life = 10 * 3600000;

const caminhoCompletoCotacao = path.resolve(__dirname, 'scripts', 'scrapers', 'cotacoes_dados.js');

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.VITE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Em desenvolvimento local/docker sem HTTPS, manter false
        maxAge: cookie_life
    }
}));

const queryDatabase = async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows; 
};

// --- ROTAS ---
app.post("/users_register", async (req, res) => {
    try {
        const { email, nome, sobrenome, senha } = req.body;

        const emailResult = await queryDatabase('SELECT * FROM users WHERE email = $1', [email]);
        const senhaResult = await queryDatabase('SELECT * FROM users WHERE password = $1', [senha]);

        if (emailResult.length > 0) return res.status(400).send("O email informado já foi utilizado!");
        if (senhaResult.length > 0) return res.status(400).send("A senha informada já foi utilizada!");

        const registroSql = 'INSERT INTO users (email, nome, sobrenome, password) VALUES ($1, $2, $3, $4) RETURNING userid';
        const registroResult = await queryDatabase(registroSql, [email, nome, sobrenome, senha]);

        if (registroResult.length > 0) {
            const userID = registroResult[0].userid;
            req.session.usuario = userID;
            res.status(200).send({ usID: req.session.usuario, exp: req.session.cookie.expires, sID: req.sessionID });
        } else {
            throw new Error("Erro ao inserir usuário!");
        }
    } catch (err) {
        console.error("Erro ao registrar usuário:", err.message);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/users_login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const userResult = await queryDatabase('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.length === 0) return res.status(404).send("Email não encontrado");
        if (userResult[0].password !== senha) return res.status(401).send("Senha incorreta!");

        const userID = userResult[0].userid;
        req.session.usuario = userID;

        const expires = new Date(req.session.cookie.expires).toISOString();
        const sql_session = 'INSERT INTO user_session (expires, sessionid, sessiondata, userid) VALUES ($1, $2, $3, $4)';
        await queryDatabase(sql_session, [expires, req.sessionID, JSON.stringify(req.session), userID]);

        res.status(200).send({ usID: req.session.usuario, exp: req.session.cookie.expires, sID: req.sessionID });
    } catch (err) {
        console.error("Erro ao autenticar usuário:", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/carteira_load", async (req, res) => {
    try {
        const sql = 'SELECT * FROM carteiras WHERE userid = $1 AND deletedat IS NULL';
        const result = await queryDatabase(sql, [req.body.userID]);
        res.status(200).send(result);
    } catch (err) {
        console.error("Erro ao pesquisar carteiras:", err);
        res.status(500).send("Erro interno no servidor");
    }
});

const PORT = process.env.VITE_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});