import express from 'express';
import { PORT } from './config/serverConfig.js';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import apiRouter from '../src/routes/index.js';
import chokidar from 'chokidar';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';

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

const editorNamespace = io.of('/editor');
editorNamespace.on('connection', (socket) => {
    console.log('editor connected');

    let projectId = socket.handshake.query['projectId'];

    console.log('projectId received afer connection', projectId);

    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true,
            awaitWriteFinish : {
                stabilityThreshold: 2000,
            },
            ignoreInitial: true,
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        })
    }

    handleEditorSocketEvents(socket);

    socket.on('disconnect', async () => {
        await watcher.close();
        console.log('editor disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})