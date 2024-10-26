import express from 'express';
const cardRouter = express.Router();
import { MainContract } from "../contract.js";
import { ethers } from 'ethers';

cardRouter.get('/all', async (req, res) => {
    try {
        const contract = await MainContract();

        const data = await contract.listCards(ethers.constants.AddressZero);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Une erreur est survenue lors du traitement de la requête'
        })
    }
});



cardRouter.get('/own/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const contract = await MainContract();

        // const data = await contract.listCards();
        let data = await contract.listCards(user);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Une erreur est survenue lors du traitement de la requête'
        })
    }
});

export default cardRouter;