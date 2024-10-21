import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';

const { Database } = sqlite3.verbose();


async function extractData() {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const jsonData = await response.json();
            // Extract only the desired fields
            const filteredDataArray = jsonData.data.map(pokemon => {
                if (!pokemon.id) {
                    return null; // Ignorer si l'id n'existe pas
                }

                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    types: pokemon.types,
                    set: {
                        id: pokemon.set.id,
                        name: pokemon.set.name,
                        series: pokemon.set.series,
                        images: pokemon.set.images,
                    },
                    averagePrices: pokemon.cardmarket?.prices?.averageSellPrice || null,
                    images: pokemon.images.small
                }
            }).filter(item => item !== null);
            console.log(filteredDataArray.length)
            return filteredDataArray;
        } else {
            console.log(response)
            return null
        }

    } catch (error) {
        console.log(error)
        return null
    }
}

async function createTables(db) {
    await db.serialize(() => {
        // Créer la table Collection
        db.run(`CREATE TABLE IF NOT EXISTS Collection (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT,
        images TEXT
      )`, (err) => {
            if (err) {
                console.error("Erreur lors de la création de la table Collection:", err.message);
            } else {
                // console.log("Table Collection créée ou déjà existante.");
            }
        });

        // Créer la table Carte
        db.run(`CREATE TABLE IF NOT EXISTS Carte (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        types TEXT NOT NULL,
        averagePrices REAL,
        images TEXT,
        collection_id TEXT,
        FOREIGN KEY (collection_id) REFERENCES Collection(id)
      )`, (err) => {
            if (err) {
                console.error("Erreur lors de la création de la table Carte:", err.message);
            } else {
                // console.log("Table Carte créée ou déjà existante.");
            }
        });
    });
}

// Créer/ouvrir une connexion à la base de données
let db = new Database('pokemon.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

function putInDataBase(dataArray) {
    if (dataArray == null) {
        return console.log("Il y a eu une erreur lors de l'extraction de l'api")
    }
    dataArray.map((pokemon) => {
        insertCarte(pokemon);
    })
}

// Fonction pour insérer une collection
function insertCollection(pokemon, callback) {

    const images = pokemon.images

    db.run(`INSERT OR IGNORE INTO Collection (id, name, series, images) VALUES (?, ?, ?, ?)`,
        [pokemon.set.id, pokemon.set.name, pokemon.set.series, images],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Collection ${pokemon.name} ajoutée avec succès.`)
            callback();
        });
}

// Fonction pour insérer une carte
function insertCarte(pokemon) {
    insertCollection(pokemon, () => {
        const typesJson = JSON.stringify(pokemon.types); // Vérifier les types

        db.run(`INSERT INTO Carte (id, name, types, averagePrices, images, collection_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
            [pokemon.id, pokemon.name, typesJson, pokemon.averagePrices, pokemon.images, pokemon.set.id],
            function (err) {
                if (err) {
                    return console.error("Erreur lors de l'insertion de la carte:", err.message);
                }
                console.log(`Carte ${pokemon.name} ajoutée avec succès.`);
            });
    });
}

const data = await extractData();
await createTables(db);
putInDataBase(data);
// Fermer la base de données
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed the database connection.');
});
