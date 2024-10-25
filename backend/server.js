import express from 'express';
import cors from 'cors';

import cardRouter from "./routes/card.js";
import boostersRouter from './routes/booster.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/cards', cardRouter);
app.use('/api/booster', boostersRouter);

app.listen(port, () => {
    console.log(`Serveur connecté au ${port}`);
});
