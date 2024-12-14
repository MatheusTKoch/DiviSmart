import { Sequelize } from 'sequelize';
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