import fetch from 'node-fetch';
export const apiUrl = 'https://api.pokemontcg.io/v2/cards';

export async function extractData() {
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
                    },
                    prices: pokemon.cardmarket?.prices?.averageSellPrice || null,
                    images: pokemon.images.small
                }
            }).filter(item => item !== null);
            return filteredDataArray;
        } else {
            return null
        }

    } catch (error) {
        console.log(error)
        return null
    }
}