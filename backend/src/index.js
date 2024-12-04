import express from 'express';
import { PORT } from './config/serverConfig.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})