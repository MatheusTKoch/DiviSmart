import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';
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

app.get("/", (req, res) => {
    res.json({teste: 'teste'});
});

app.post("/users", (req, res) => {
    let data = {email: req.body.email, senha: req.body.senha};
    const sql = 'INSERT INTO USERS (email, password) values ("' + data.email + '", "' + data.senha + '")';
    db.connect((err) => {
        if (err) throw err;
        db.query(sql, 
            (err) => {
                console.log(err)
            })
    });
    res.status(200).send(JSON.stringify());
}).get("/users", (req, res) => {
    db.connect((err) => {console.log(err)});
    res.json({teste: "teste"});
})

const PORT = process.env.VITE_PORT;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});

