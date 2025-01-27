import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../.env')});

const db = mysql.createConnection({
    database: process.env.VITE_DATABASE_DB, 
    user: process.env.VITE_USER_DB, 
    password: process.env.VITE_PASSWORD_DB, 
    host: process.env.VITE_HOST_DB
  });

const app = express();
const cookie_life = 10 * 3600000;

app.use(cors({origin:"http://localhost:5173"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.VITE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, 
        maxAge: cookie_life
    }
  }));

  const queryDatabase = (query) => {
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


  app.post("/users_register", async (req, res) => {

    try {
        const { email, nome, sobrenome, senha } = req.body;
        const sql_email = `SELECT * FROM USERS WHERE email = "${email}"`;
        const sql_registro = `INSERT INTO USERS (email, nome, sobrenome, password) VALUES ("${email}", "${nome}", "${sobrenome}", "${senha}")`;

        const emailResult = await queryDatabase(sql_email);

        if (emailResult && emailResult.length > 0) {
            return res
                .status(400)
                .send("O email informado já foi utilizado!" );
        }

        const registroResult = await queryDatabase(sql_registro);

        if (!registroResult || registroResult.length == 0) {
            return res.status(400).send("Erro ao inserir usuario, tente novamente!");
        }

        const sql_get_user = `SELECT * FROM USERS WHERE email = "${email}"`;
        const userResult = await queryDatabase(sql_get_user);

        if (userResult && userResult.length > 0) {
            const userID = userResult[0].UserID;
            req.session.usuario = userID;

            console.log("Sucess! UserID:", userID);
            res.send({usID: req.session.usuario, exp: req.session.cookie.expires, sID: req.sessionID}).status(200);
        } else {
            throw new Error("Erro ao obter o usuário!");
        }
    } catch (err) {
        console.error("Erro ao registrar usuário:", err.message);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/users_login", async (req, res) => {

    try {
        const sql_email = `SELECT * FROM USERS WHERE email = "${req.body.email}"`;
        const emailResult = await queryDatabase(sql_email);

        if (!emailResult || emailResult.length === 0) {
            return res.status(404).send("Email não encontrado");
        }

        const sql_senha = `SELECT * FROM USERS WHERE password = "${req.body.senha}"`;
        const senhaResult = await queryDatabase(sql_senha);

        if (!senhaResult || senhaResult.length === 0) {
            return res.status(401).send("Senha incorreta!");
        }

        const userID = senhaResult[0].UserID;
        req.session.usuario = userID;

        const sql_session = `INSERT INTO user_session (Expires, SessionID, SessionData, userId) values ('${(req.session.cookie.expires).toLocaleString('sv-SE').replaceAll('/', '-').replaceAll(',', '')}', "${req.sessionID}", '${JSON.stringify(req.session)}', "${userID}")`;
        const sessionResult = await queryDatabase(sql_session)
        
        if (!sessionResult || sessionResult.length === 0) {
            return res.status(401).send("Erro ao gravar dados da sessao!");
        }

        console.log("Sucess! UserID:", userID);
        
        res.send({usID: req.session.usuario, exp: req.session.cookie.expires, sID: req.sessionID}).status(200);
    } catch (err) {
        console.error("Erro ao autenticar usuário:", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/users_load", async(req, res) => {
    try {
        const sql_user = `SELECT * FROM USERS WHERE userId = ${req.body.usID}`;
        const userResult = await queryDatabase(sql_user);

        if (!userResult || userResult.length === 0) {
            return res.status(401).send("Sem dados na localStorage");
        }

        
        res.send({Nome: userResult[0].Nome}).status(200);
        }
    catch (err) {
        console.error("Erro peqsuisar usuario: ", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/carteira_load", async(req, res) => {
    try {
        const sql_pesquisa = `SELECT * FROM carteiras where userId = ${req.body.userID} and deletedAt IS NULL`;
        const pesquisa_result = await queryDatabase(sql_pesquisa);

        if (!pesquisa_result || pesquisa_result.length === 0) {
            return res.status(401).send("Erro ao carregar carteiras");
        }

        res.status(200).send(pesquisa_result);
    } catch (err) {
        console.error("Erro ao pesquisar carteiras: ", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/carteira_name", async(req, res) => {
    try {
        const sql_pesquisa = `SELECT * FROM carteiras where userId = ${req.body.userID} and CarteiraID = ${req.body.cID} and deletedAt IS NULL`;
        const pesquisa_result = await queryDatabase(sql_pesquisa);

        if (!pesquisa_result || pesquisa_result.length === 0) {
            return res.status(401).send("Erro ao carregar carteiras");
        }

        res.status(200).send(pesquisa_result);
    }   catch (err) {
        console.error("Erro ao pesquisar carteiras: ", err);
        res.status(500).send("Erro interno no servidor");
    }
})

app.post("/carteira_delete", async (req, res) => {
    try {
        const sql_carteira = `UPDATE carteiras SET deletedAt = now() WHERE carteiraId = ${req.body.carteiraID}`;
        const carteira_result = await queryDatabase(sql_carteira);

        if (!carteira_result || carteira_result.legth === 0) {
            return res.status(401).send("Erro ao deletar carteiras");
        }

        const sql_acoes = `UPDATE ativos_acoes SET deletedAt = now() WHERE carteiraId = ${req.body.carteiraID}`;
        const acoes_result = await queryDatabase(sql_acoes);

        if (!acoes_result || acoes_result.legth === 0) {
            return res.status(401).send("Erro ao deletar acoes");
        }

        const sql_fii = `UPDATE ativos_fii SET deletedAt = now() WHERE carteiraId = ${req.body.carteiraID}`;
        const fii_result = await queryDatabase(sql_fii);

        if (!fii_result || fii_result.legth === 0) {
            return res.status(401).send("Erro ao deletar fiis");
        }

        return res.status(200).send("Carteira deletada!");
    } catch (err) {
        console.error("Erro ao deletar carteira: ", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post('/acoes_cadastro', async(req, res) => {
    try {
        const sql_cadastro = `INSERT INTO ativos_acoes (Quantidade, ValorInvestido, DataCadastro, carteiraID, acaoID) values (${req.body.quantidade}, ${req.body.valorInvestido}, now(), ${req.body.cID}, ${req.body.acaoID})`;
        const cadastroResult = await queryDatabase(sql_cadastro);

        if (!cadastroResult || cadastroResult.length === 0) {
            return res.status(401).send("Erro ao cadstrar acao");
        }
    } catch (err) {
        console.error("Erro ao cadastrar ativo: ", err);
        res.status(500).send("Erro interno no servidor");
    }
})

app.post('/fii_cadastro', async(req, res) => {
    try {
        const sql_cadastro = `INSERT INTO ativos_fii (Quantidade, ValorInvestido, DataCadastro, carteiraID, fiiID) values (${req.body.quantidade}, ${req.body.valorInvestido}, now(), ${req.body.cID}, ${req.body.fiiID})`;
        const cadastroResult = await queryDatabase(sql_cadastro);

        if (!cadastroResult || cadastroResult.length === 0) {
            return res.status(401).send("Erro ao cadstrar fii");
        }
    } catch (err) {
        console.error("Erro ao cadastrar ativo: ", err);
        res.status(500).send("Erro interno no servidor");
    }
})

app.post('/tesouro_cadastro', async(req, res) => {
    try {
        const tesouro_cadastro = `INSERT INTO ativos_tesouro (Quantidade, ValorInvestido, DataCadastro, carteiraID, tesouroID) values (${req.body.quantidade}, ${req.body.valorInvestido}, now(), ${req.body.cID}, ${req.body.tesID})`;
        const cadastroResult = await queryDatabase(tesouro_cadastro);

        if (!cadastroResult || cadastroResult.length === 0) {
            return res.status(401).send("Erro ao cadstrar tesouro");
        }
    } catch (err) {
        console.error("Erro ao cadastrar ativo: ", err);
        res.status(500).send("Erro interno no servidor");
    }
})

app.post("/carteira", async (req, res) => {
    try {
        const sql_carteira = `INSERT INTO carteiras (nome, userId) values ("${req.body.carteira}", "${req.body.userID}")`;
        const carteiraResult = await queryDatabase(sql_carteira);

        if (!carteiraResult || carteiraResult.length === 0) {
            return res.status(401).send("Erro ao gravar carteira");
        }

        res.status(200).send("fecharModal");
    } catch (err) {
        console.error("Erro ao cadastrar carteira: ", err);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/ativos_load", async (req, res) => {
    try {
        const sql_acoes = `SELECT * FROM acoes`;
        const acoesResult = await queryDatabase(sql_acoes);

        if (!acoesResult || acoesResult.length === 0) {
            return res.status(401).send("Erro ao selecionar ativos - acao");
        }

        const sql_fiis = `SELECT * FROM fundo_imobiliario`;
        const fiiResult = await queryDatabase(sql_fiis);

        if (!fiiResult || fiiResult.length === 0) {
            return res.status(401).send("Erro ao selecionar ativos - fii");
        }

        res.status(200).send({acoes: acoesResult, fii: fiiResult});
    } catch (err) {
        console.error("Erro ao carregar ativos", err);
        res.status(500).send("Erro interno no servidor")
    }
})

app.post("/session", async(req, res) => {
    const sql_session = `SELECT * FROM USER_SESSION WHERE userId = ${req.body.usID} and SessionID = "${req.body.sID}"`;
    const sessionResult = await queryDatabase(sql_session);

    if (!sessionResult || sessionResult.length === 0) {
        return res.status(401).send("Sem dados na localStorage");
    }

    if (new Date().getTime() > new Date(req.body.exp).getTime()) {
        return res.status(401).send("Sessao expirada");
    }

    res.send({test: 'teste'}).status(200);
});

app.post("/logout", async(req, res) => {
    const sql_logout = `DELETE FROM USER_SESSION WHERE userId = ${req.body.usID} and SessionID = "${req.body.sID}"`;
    const logoutResult = await queryDatabase(sql_logout);

    if(!logoutResult || logoutResult.length === 0) {
        return res.status(404).send("Usuario nao localizado");
    }

    res.send('sucesso').status(200);
})

const PORT = process.env.VITE_PORT;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});

