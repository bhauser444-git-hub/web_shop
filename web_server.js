
// import express from 'express'
// import {sagHallo} from './rechner.js'

// const app = express();
// const PORT = 3000;

// // Die Startseite
// app.get('/', (req, res) => {
//     res.send('Hallo von der Express-Startseite!');
// });

// // Eine weitere Unterseite (super einfach mit Express!)
// app.get('/ueber-uns', (req, res) => {
//     const gruss = sagHallo('Entwickler');
//     res.send(gruss);
//     //res.send('Das ist die Über-Uns-Seite.');
// });

// app.listen(PORT, () => {
//     console.log(`Express-Server läuft auf http://localhost:${PORT}`);
// });
import express from 'express';
import {sagHallo} from './rechner.js'
const app = express();
const PORT = 5000; // Neuer Port!

app.get('/', (req, res) => {
    res.send('Der Express-Server funktioniert im Minimal-Test!');
});

// Eine weitere Unterseite (super einfach mit Express!)
app.get('/ueber-uns', (req, res) => {
    const gruss = sagHallo('Entwickler');
    res.send(gruss);
    //res.send('Das ist die Über-Uns-Seite.');
});

app.listen(PORT, () => {
    console.log(`Minimal-Server läuft auf http://localhost:${PORT}`);
});
