import { MainContract, account } from "./contract.js";
import { extractData } from "./api/api.js";
const numberOfBooster = 2 // Maximum 20

const adminSetName = "AdminCollection"

export async function BoosterToBlockchain() {
    try {
        const contract = await MainContract();
        let arr = await extractData();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        let cardByBooster = 5
        let booster = "Bpn";
        let boosterNumber = 1;

        for (let i = 0; i < numberOfBooster; i++) {
            let setName = booster + boosterNumber
            let cards = []
            for (let j = 0; j < 5; j++) {
                const card = arr[i * cardByBooster + j];
                cards.push({
                    cardName: card.name,
                    id: card.id,
                    owner: "0x0000000000000000000000000000000000000000",
                    imgURL: card.images,
                    setName: setName
                })
            }
            await contract.createBoosters(setName, cards);
            console.log(cards);
            console.log("Nombre de booster ajouté dans la blockchain : " + boosterNumber + " / " + (numberOfBooster + 1));
            boosterNumber++;
        }
        let cards = []
        let setName = adminSetName
        for (let i = numberOfBooster * 5; i < numberOfBooster * 5 + 15; i++) {
            const card = arr[i];
            cards.push({
                cardName: card.name,
                id: card.id,
                owner: account,
                imgURL: card.images,
                setName: setName
            })
        }
        await contract.createBoosters(setName, cards);
        console.log(cards);
        console.log("Nombre de booster ajouté dans la blockchain : " + (numberOfBooster + 1) + " / " + (numberOfBooster + 1));
        boosterNumber++;
    }
    catch (error) {
        console.log("Erreur lors de l'ajout dans la blockchain' :", error);
        return null;
    }

}
