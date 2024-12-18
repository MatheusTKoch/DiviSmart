import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  import.meta.env.DATABASE_DB, 
  import.meta.env.USER_DB, 
  import.meta.env.PASSWORD_DB, {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

function conectDatabase() {
  db.sequelize.authenticate().then(() => {
    console.log("Conectado no banco com sucesso!");
  }).catch((err: string) => {
    console.log("Erro ao conectar com banco: " + err);
  });
}
const db:any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;