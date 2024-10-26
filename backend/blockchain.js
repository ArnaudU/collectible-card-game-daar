import { MainContract } from "./contract.js";
import { extractData } from "./api/api.js";

const numberOfBooster = 15 // Maximum 20

export async function BoosterToBlockchain() {
    try {
        const contract = await MainContract();
        let arr = await extractData();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        let cardByBooster = 5
        let booster = "Booster pack number";
        let boosterNumber = 1;
        for (let i = 0; i < numberOfBooster; i++) {

            let cards = []
            for (let j = 0; j < 5; j++) {
                const card = arr[i * cardByBooster + j];
                cards.push({
                    cardName: card.name,
                    id: card.id,
                    imgURL: card.images,
                })
            }
            await contract.createBoosters(booster + boosterNumber, cards);
            boosterNumber++;
            console.log("Nombre de booster ajouté dans la blockchain : " + boosterNumber + " / " + numberOfBooster);
        }
    }
    catch (error) {
        console.log("Erreur lors de l'ajout dans la blockchain' :", error);
        return null;
    }

}
