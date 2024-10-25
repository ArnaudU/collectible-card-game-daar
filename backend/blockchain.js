import { MainContract } from "./contract.js";
import { extractData } from "./api.js";

async function addBoosterToCollection() {
    const contract = await MainContract();
    let arr = await extractData();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let cardByBooster = 5
    for (let i = 0; i < 1; i++) {

        let cards = []
        for (let j = 0; j < 5; j++) {
            const card = arr[i * cardByBooster + j];
            cards.push({
                cardName: card.name,
                id: card.id,
                imgURL: card.images,
            })
        }
        console.log("Ajout")
        contract.createBoosters(cards[0].id, cards);
    }

}
await addBoosterToCollection();
console.log("Booster ajouté dans la blockchain");