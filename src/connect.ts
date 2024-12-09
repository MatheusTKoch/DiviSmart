import mysql from 'mysql';

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB
});

connection.connect((err) => {
    if (err) {
        console.log("Erro na conexao:" + err.message);
    } else {
        console.log("Conexao ok");
    }
});