
import express from 'express';
import mysql from "mysql2";
//import {sagHallo} from './rechner.js'

const app = express();
const PORT = 5000; 
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

// // Eine weitere Unterseite (super einfach mit Express!)
// app.get('/ueber-uns', (req, res) => {
//     const gruss = sagHallo('Entwickler');
//     res.send(gruss);
//     //res.send('Das ist die Über-Uns-Seite.');
// });

app.get('/api/products', (req, res) => {
    sql_connection.execute(
        "SELECT * FROM products",
        (error, results) => {
            if (error) {
                console.error(error);

                res.status(500).json({
                    error: "Data base error"
                });

                return;
            }

            res.json(results);
        }
    );
});

app.get('/products', (req, res) => {
    res.sendFile('products.html', { root: 'public' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
