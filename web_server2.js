import express from 'express';
import mysql from "mysql2";
import 'dotenv/config'; // Lädt die .env-Datei automatisch beim Start

const app = express();
app.set('view engine', 'ejs'); 
const PORT = process.env.PORT || 5000; // Nutzt den Port aus .env oder 5000 als Fallback

const sql_connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

sql_connection.connect((err) => {
    if (err) {
        console.error("Connection failed:", err);
        return;
    }
    console.log("Connection to SQL database established.");
});

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send(`
        <h1>Web Shop</h1>
        <a href="/products">Go to products</a>
    `);
});

// 2. Die geänderte Products-Route (holt SQL und rendert direkt HTML)
app.get('/products', (req, res) => {
    sql_connection.execute(
        "SELECT * FROM products",
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Datenbankfehler");
            }

            // Hier übergeben wir die SQL-Ergebnisse direkt an die EJS-Datei
            res.render('products', { products: results });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});