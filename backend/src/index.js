import express from 'express';
import { PORT } from './config/serverConfig.js';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import apiRouter from '../src/routes/index.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

io.on('connection', (socket) => {
    console.log('a user connected')
});

app.use('/api', apiRouter);

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})