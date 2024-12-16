import React, { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

function BrowserTerminal() {

    const {projectId: projectIdFromUrl } = useParams();
    const terminalRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: "#383737",
                foreground: '#00FD61',
                cursor: '#00FD61',
                cursorAccent: '#383737',
                red: '#ff5544',
                green: '#50faf7',
            },
            fontSize: 14,
            fontFamily: 'monospace',
            convertEol: true,
        })

        term.open(terminalRef.current);
        let fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();

        socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
            query: {
                projectId: projectIdFromUrl
            }
        });

        socket.current.on('shell-output', (data) => {
            term.write(data);
        });

        term.onData((data) => {
            console.log(data);
            socket.current.emit('shell-input', data);
        });

        return () => {
            term.dispose();
            socket.current.disconnect();
        }
    });

    return (

        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '25vh',
                overflow: 'auto'
            }}
            className='terminal'
            id='terminal'
        >

        </div>
    )
}

export default BrowserTerminal