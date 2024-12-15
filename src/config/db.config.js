module.exports = {
    USER: import.meta.env.USER_DB,
    PASSWORD: import.meta.env.PASSWORD_DB,
    DB: import.meta.env.DATABASE_DB,
    HOST: "localhost",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };