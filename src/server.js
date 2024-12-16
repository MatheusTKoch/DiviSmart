import express from 'express';
import cors from 'cors';
import db from './server/index.js';

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

db.sequelize.sync({force: true}).then(() => {
    console.log('Db sincronizada');
}).catch((err) => {
    console.log('Erro ao sincronizar db: ' + err.message );
});