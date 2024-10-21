import express from 'express';
import cors from 'cors';
import cardRouter from "./routes/card.js";
import collectionsRouter from './routes/collection.js';
import sqlite3 from 'sqlite3';

const app = express();
const port = process.env.PORT || 3000;

const { Database } = sqlite3.verbose();

app.use(cors());
app.use(express.json());

// middleware pour injecter la base de données
function injectDB(db) {
    return (req, res, next) => {
        req.db = db; // Ajoute db à la requête
        next(); // Passe au middleware suivant
    };
}

let db = new Database('pokemon.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});


app.use('/api/cards', injectDB(db), cardRouter);
app.use('/api/collection', collectionsRouter);

app.listen(port, () => {
    console.log(`Serveur connecté au ${port}`);
});

