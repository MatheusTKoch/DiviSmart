import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({origin:"http://localhost:8081"}));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({mess:"Teste com sucesso"});
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}.`);
});