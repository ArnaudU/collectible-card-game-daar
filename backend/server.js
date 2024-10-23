import express from 'express';
import cors from 'cors';

import cardRouter from "./routes/card.js";
import collectionsRouter from './routes/collection.js';
import boostersRouter from './routes/booster.js';
import { extractData } from "./api.js";

const app = express();
const port = process.env.PORT || 3000;

export const arr = await extractData();

app.use(cors());
app.use(express.json());


app.use('/api/cards', cardRouter);
app.use('/api/collection', collectionsRouter);
app.use('/api/booster', boostersRouter);

''
app.listen(port, () => {
    console.log(`Serveur connecté au ${port}`);
});

