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

app.use(cors({origin:"http://localhost:5173"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.VITE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
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

app.post("/users_login", (req, res) => {
    const sql_email = 'SELECT * FROM USERS WHERE email = "' + req.body.email + '"';
    const sql_senha = 'SELECT * FROM USERS WHERE password = "' + req.body.senha + '"';
    let retorno = '';
    db.connect((err) => {
        if (err) {
            console.log(err)
        };
        db.query(sql_email, (err, res) => {
            if (err) { 
                console.error(err) 
            } else if (res[0] == undefined || res[0].length == 0) {
                retorno = 'Email nao encontrado';
            } else {
                db.query(sql_senha, (err, res) => {
                    if (err) {
                        retorno = err.message;
                    } else if (res[0] == undefined || res[0].length == 0) {
                        retorno = 'Senha Incorreta!'; 
                    } else {
                        retorno = 'Sucess!';
                    }
                });
            }
    })});
    res.status(200).redirect('http://localhost:5173/menu'); 
});

app.post("/carteira", (req, res) => {
    const sql = 'SELECT * FROM USERS WHERE email = "' + req.body.email + '"';
    res.status(200);
});

const PORT = process.env.VITE_PORT;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});

