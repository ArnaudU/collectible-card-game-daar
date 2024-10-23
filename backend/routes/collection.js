import express from 'express';
import * as main from "../contract.js";

const collectionsRouter = express.Router();


async function getUserCollections(user) {

    const contract = await main.init()
    // Now you can use the contract_ object for interactions.
    const collection = await contract.getCollectionsAndCards(false, false, user)
    return collection.map((collection) => {
        return {
            collectionId: collection[0].toNumber(),
            collectionName: collection[1] === "BP" ? collection[1] + "-" + collection[0].toNumber() : collection[1],
            cardCount: collection[2].toNumber(),
            cards: collection[3].map((card) => {
                return {
                    img: card[0],
                    cardNumber: card[1].toNumber(),
                    cardGid: card[2].toNumber(),
                    onSell: card[3],
                    cardOwner: card[4]
                };
            }),
            redeemed: collection[4]
        };
    })
}


async function getListing() {

    const contract = await main.init()
    // Now you can use the contract_ object for interactions.
    const listing = await contract.getListing()
    return listing.map((list) => {
        const priceInWei = BigInt(list[1][3]);
        const priceInEther = Number(priceInWei) / 1e18;
        return {
            id: list[0].toNumber(),
            seller: list[1][0],
            collectionId: list[1][1].toNumber(),
            tokenId: list[1][2].toNumber(),
            price: priceInEther,
            img: list[2][0],
            cardNumber: list[2][1].toNumber(),
            cardGid: list[2][2].toNumber(),
            onSell: list[2][3],
            cardOwner: list[2][4]
        };
    })
}

collectionsRouter.get('/get', async (req, res) => {
    try {
        const mes = await getAllCollections();
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

collectionsRouter.get('/getFor/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const mes = await getUserCollections(user);
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

collectionsRouter.get('/getListing', async (req, res) => {
    try {
        const mes = await getListing();
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default collectionsRouter;