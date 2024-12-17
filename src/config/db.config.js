import dotenv from 'dotenv';

dotenv.config();

const db = {
    USER: import.meta.env.VITE_USER_DB,
    PASSWORD: import.meta.env.VITE_PASSWORD_DB,
    DB: import.meta.env.VITE_DATABASE_DB,
    HOST: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

export default db;