import express from 'express';
import cors from 'cors';
import usersModel from './models/users.model.js';

const app = express();

app.use(cors({origin:"http://localhost:8081"}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({mess:"Teste com sucesso"});
});

app.post("/users", (req, res) => {
    usersModel.create({
        Email,
        Password
    })
}).get("/users", (req, res) => {
    res.json({teste:"teste"});
})

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});

