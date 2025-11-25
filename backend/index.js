import express from "express";
import mysql from "mysql2";
import bodyparser from "body-parser";
import cors from "cors";
import route from "./routes/routes.js";

const app = express();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'bvcymhrq4n5yygspnwvr-mysql.services.clever-cloud.com',
    user: process.env.DB_USER || 'uyps6mbvy2gk7aeq',
    password: process.env.DB_PASSWORD || 'zFvxd3HKtuLHxHmox9xK',
    database: process.env.DB_NAME || 'bvcymhrq4n5yygspnwvr',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 20000,
    ssl: {
        // This bypasses the self-signed certificate warning
        rejectUnauthorized: false
    }
});


db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL pool connection failed:", err);
    } else {
        console.log("MySQL pool connected successfully");
        connection.release();
    }
});

app.use(bodyparser.json());
app.use(cors());

app.get("/hi", (req, res) => {
    res.send("Hello world");
});
app.use(express.urlencoded({ extended: true }));

app.use("/", route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The application is running on port ${PORT}`);
});

export default db;
