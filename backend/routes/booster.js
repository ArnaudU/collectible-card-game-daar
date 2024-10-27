import express from 'express';
const boostersRouter = express.Router();
import { MainContract } from "../contract.js";

boostersRouter.post('/open/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const contract = await MainContract();
        const data = await contract.openBooster(user);
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


export default boostersRouter;