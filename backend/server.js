import express from 'express';
import cors from 'cors';

import cardRouter from "./routes/card.js";
import boostersRouter from './routes/booster.js';
import { BoosterToBlockchain } from './blockchain.js';
const app = express();
const port = process.env.PORT || 3000;

await BoosterToBlockchain();

app.use(cors());
app.use(express.json());

app.use('/api/cards', cardRouter);
app.use('/api/booster', boostersRouter);

app.get('/api/test', (req, res) => {
    res.json({ message: "Test réussi !" });
  });
  
  
  

app.listen(port, () => {
    console.log(`Serveur connecté au ${port}`);
});

