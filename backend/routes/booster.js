import express from 'express';
import * as main from "../contract.js";
const boostersRouter = express.Router();
import { arr } from "../server.js"



boostersRouter.get('/get/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const mes = await getBoostersByAddress(user);
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


boostersRouter.get('/', async (req, res) => {
    try {
        await addBoosterToCollection();
        res.status(200).send('Booster placed successfully');;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

export default boostersRouter;