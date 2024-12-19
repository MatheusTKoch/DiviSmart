"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2_1 = require("mysql2");
var db = mysql2_1.default.createConnection({
    database: import.meta.env.DATABASE_DB,
    user: import.meta.env.USER_DB,
    password: import.meta.env.PASSWORD_DB,
    host: "localhost"
});
exports.default = db;
