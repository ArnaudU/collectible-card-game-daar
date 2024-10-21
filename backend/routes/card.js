import express from 'express';
import fetch from 'node-fetch';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';
const cardRouter = express.Router();


cardRouter.get('/getInfo/:id', async (req, res) => {
    const targetId = req.params.id;
    const db = req.db;
    db.get(`SELECT * FROM Carte WHERE id = ?`, [targetId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Carte non trouvée' });
        }
        res.json(row); // Envoie la réponse avec les données
    });
});

cardRouter.get('/getInfo', async (req, res) => {
    const db = req.db; // Récupérer l'instance de la base de données
    db.all(`SELECT * FROM Carte`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Aucune carte trouvée' });
        }
        res.json(rows); // Envoie toutes les cartes dans la réponse
    });
});


export default cardRouter;