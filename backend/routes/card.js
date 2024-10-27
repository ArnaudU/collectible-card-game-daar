import express from 'express';
const cardRouter = express.Router();
import { MainContract } from "../contract.js";
import { ZeroAddress } from 'ethers/constants';

cardRouter.get('/getInfo/:id', async (req, res) => {
    const targetId = req.params.id;
    try {
        const contract = await MainContract();
        const data = await contract.getMinted();
        res.json(data[Number(targetId)]);
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
        const data = await contract.listCards(ZeroAddress);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Une erreur est survenue lors du traitement de la requête'
        })
    }
});

function getNonEmptyElements(data) {
    const nonEmptyList = [];

    for (let item of data) {
        // Vérifie si l'élément a toutes les chaînes non vides
        if (item.some(value => value === "")) {
            break; // Arrête la boucle dès qu'il y a des chaînes vides
        }
        nonEmptyList.push(item); // Ajoute les éléments non vides à la liste
    }

    return nonEmptyList;
}


cardRouter.get('/own/:address', async (req, res) => {
    const user = req.params.address;
    try {
        const contract = await MainContract();
        let data = await contract.listCards(user);
        data = getNonEmptyElements(data)
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
        let data = await contract.listCards(user);
        data = getNonEmptyElements(data)
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Une erreur est survenue lors du traitement de la requête'
        })
    }
});

cardRouter.get('/mint', async (req, res) => {
    const { address, card } = req.query;
    // Vérification de la présence des paramètres (optionnel)
    if (!address || !card) {
        return res.status(400).json({ error: 'Les paramètres address et city sont requis' });
    }

    try {
        const contract = await MainContract();
        let data = await contract.mintCardByAdmin(address, Number(card));
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