import mysql from 'mysql2';

const db = mysql.createConnection({
    database: import.meta.env.DATABASE_DB, 
    user: import.meta.env.USER_DB, 
    password: import.meta.env.PASSWORD_DB, 
    host: "localhost"
  });

export default db;