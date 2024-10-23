import express from 'express';
const cardRouter = express.Router();

async function getAllCards() {
    const contract = await main.init();
}

cardRouter.get('/getInfo/:id', async (req, res) => {
    const targetId = req.params.id;

});

cardRouter.get('/getInfo', async (req, res) => {

});


export default cardRouter;