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
const cookie_life = 20 * 3600000;

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


app.post("/users_register", (req, res) => {
    let data = {email: req.body.email, senha: req.body.senha};
    let email_existe = false;
    const sql_email = 'SELECT * FROM USERS WHERE email = "' + req.body.email + '"';
    const sql_registro = 'INSERT INTO USERS (email, password) values ("' + data.email + '", "' + data.senha + '")';

    db.connect((err) => {
        if (err) {
            console.log(err)
        }
        db.query(sql_email, (err, res) => {
                if (err) { 
                    console.log(err);
                } else if (res == undefined || res.length == 0) {
                    db.query(sql_registro, (err) => {
                        console.log(err);
                    });
                } else {
                    email_existe = true;
                    console.log('email ja existe!');
                }
            });
    });
    if (email_existe == true) {
        res.status(400).send({message: 'O email informado já foi utilizado!'});
    } else {
        res.status(200).redirect('http://localhost:5173/menu');
    }
});

app.post("/users_login", async (req, res) => {
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
        console.log("Sucess! UserID:", userID);

        res.status(200).redirect("http://localhost:5173/menu");
    } catch (err) {
        console.error("Erro ao autenticar usuário:", err.message);
        res.status(500).send("Erro interno no servidor");
    }
});

app.post("/carteira", (req, res) => {
    let userID;
    const sql = 'INSERT INTO carteiras (nome, userId) values ("' + req.body.carteira + '", "' + userID +'")';
    res.status(200);
});

const PORT = process.env.VITE_PORT;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});

