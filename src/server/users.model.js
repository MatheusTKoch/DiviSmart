import { DataTypes, Sequelize } from 'sequelize';
import dotEnv from 'dotenv';

dotEnv.config();

const sequelize = new Sequelize(
    process.env.DATABASE_DB, 
    process.env.USER_DB, 
    process.env.PASSWORD_DB, 
{
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const User = sequelize.define("users", {
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync().then(() => {
  console.log("Tabela users criada!");
  User.create({
    Email: "teste1@hotmail.com",
    Password: "erer!@#ewe123"
  })
}).catch((error) => {
  console.error("Erro ao criar tabela: ", error);
});

