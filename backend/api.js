import fetch from 'node-fetch';
const apiUrl = 'https://api.pokemontcg.io/v2/cards';
import * as main from "../contract.js";
import { arr } from "../server.js";

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


export async function addBoosterToCollection() {
    const contract = await main.init();
    let boosteNumber = 0;
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    while (arr.length >= 5) {
        console.log(arr.length)
        let boosterName = "Booster" + boosteNumber
        boosteNumber++;
        let cards = []
        for (let i = 0; i < 5; i++) {
            const card = arr.pop();
            cards.push({
                cardName: card.name,
                setName: card.set.name,
                imgURL: card.images
            })
        }
        contract.createBooster(boosterName, true, cards);
    }
}

await addBoosterToCollection();
console.log("Booster ajouté dans la blockchain");