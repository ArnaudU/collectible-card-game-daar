import express from 'express';
const cardRouter = express.Router();
import { apiUrl } from '../api.js';
import { MainContract } from "../contract.js";
import { ethers } from 'ethers';

cardRouter.get('/getInfo/:id', async (req, res) => {
    const targetId = req.params.id;
    try {
        const response = await fetch(apiUrl.concat("/", targetId));
        if (response.ok) {
            const jsonData = await response.json();
            // Extract only the desired fields
            const filteredData = {
                id: jsonData.data.id,
                name: jsonData.data.name,
                types: jsonData.data.types,
                set: {
                    id: jsonData.data.set.id,
                    name: jsonData.data.set.name,
                    series: jsonData.data.set.series,
                    images: jsonData.data.set.images,
                },
                averagePrices: jsonData.data.cardmarket.prices.averageSellPrice,
                images: jsonData.data.images.small
            };
            res.json(filteredData);
        } else {
            console.error("Erreur lors de l'extraction du JSON", response.statusText);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Une erreur est survenue lors du traitement de la requête'
        })
    }
});

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