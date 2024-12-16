const db = {
    USER: process.env.VITE_USER_DB,
    PASSWORD: process.env.VITE_PASSWORD_DB,
    DB: process.env.VITE_DATABASE_DB,
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