import express from "express";
import mysql from "mysql2";
import bodyparser from "body-parser";
import cors from "cors";
import route from "./routes/routes.js";

const app = express();

app.use(cors({
    origin: ["https://officenoqu.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));

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

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// This line adds the "/api" prefix that Netlify is looking for
app.use("/api", route); // Fixed: changed 'router' to 'route'


// app.use("/", route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The application is running on port ${PORT}`);
});

export default db;
