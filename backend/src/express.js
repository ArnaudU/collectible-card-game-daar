const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');

// Initialiser la base de données avec SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'cards.db',
});

// Définition du modèle User
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Définition du modèle Card
const Card = sequelize.define('Card', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Définition du modèle PokemonSet
const PokemonSet = sequelize.define('PokemonSet', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

PokemonSet.hasMany(Card, { foreignKey: 'setId' });
Card.belongsTo(PokemonSet);

// Fonction pour télécharger les cartes depuis l'API Pokémon TCG
const fetchPokemonCards = async () => {
    try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards', {
            params: {
                pageSize: 100, // Récupérer 100 cartes
            },
        });

        const cards = response.data.data; // Les cartes sont dans la propriété "data"
        return cards;
    } catch (error) {
        console.error('Erreur lors du téléchargement des cartes:', error);
        return [];
    }
};

// Fonction pour sauvegarder les cartes dans SQLite
const storePokemonCards = async (cards) => {
    try {
        for (let card of cards) {
            // Vérifier si le set existe déjà
            let set = await PokemonSet.findOne({ where: { id: card.set.id } });
            if (!set) {
                // Si le set n'existe pas, le créer
                set = await PokemonSet.create({
                    id: card.set.id,
                    name: card.set.name,
                });
            }

            // Sauvegarder la carte avec le setId correspondant
            await Card.create({
                id: card.id,
                name: card.name,
                imageUrl: card.images.small,
                setId: set.id,
            });
        }
        console.log('Les cartes ont été sauvegardées avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des cartes:', error);
    }
};

// Créer un serveur Express
const app = express();
app.use(cors());
app.use(express.json());

// Route pour récupérer 5 cartes avec leurs images
app.get('/api/cards/images', async (req, res) => {
    try {
        // Récupérer 5 cartes depuis la base de données
        const cards = await Card.findAll({
            limit: 5, // Limiter à 5 cartes
        });

        // Vérifier si des cartes ont été trouvées
        if (cards.length === 0) {
            return res.status(404).json({ message: 'Aucune carte trouvée.' });
        }

        // Mapper les cartes pour renvoyer uniquement les informations nécessaires
        const cardImages = cards.map(card => ({
            id: card.id,
            name: card.name,
            imageUrl: card.imageUrl,
        }));

        // Renvoie les images des cartes
        res.json(cardImages);
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Lancement du serveur
const startServer = async () => {
    try {
        // Synchroniser les modèles avec la base de données
        await sequelize.sync();
        console.log('Base de données connectée');

        // Télécharger et sauvegarder les cartes avant de démarrer le serveur
        const cards = await fetchPokemonCards();
        if (cards.length > 0) {
            await storePokemonCards(cards);
        }

        // Démarrer le serveur après avoir stocké les cartes
        app.listen(8080, () => {
            console.log('Serveur en cours d\'exécution sur http://localhost:8080');
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
    }
};

// Démarrer le serveur
startServer();
