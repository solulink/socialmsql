import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "Satellite7979@",
    database: "social",
})