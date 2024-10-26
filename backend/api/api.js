import { promises as fs } from 'fs';

export async function extractData() {
    try {
        // Lecture du fichier JSON local
        const fileData = await fs.readFile('./api/api.json', 'utf8');
        // Parser le contenu du fichier en JSON
        const jsonData = JSON.parse(fileData);

        // Extraire les champs souhaités
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
                },
                prices: pokemon.cardmarket?.prices?.averageSellPrice || null,
                images: pokemon.images.small
            };
        }).filter(item => item !== null);

        return filteredDataArray;

    } catch (error) {
        console.log("Erreur lors de la lecture du fichier JSON :", error);
        return null;
    }
}
