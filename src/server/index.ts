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

const db:any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;