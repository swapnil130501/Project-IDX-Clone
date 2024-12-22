import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"; // required styles
import { AttachAddon } from "@xterm/addon-attach";
import { useTerminalSocketStore } from "../../../store/terminalSocketStore.js";
import "./BrowserTerminal.css";

function BrowserTerminal() {
    const terminalRef = useRef(null);
    const fitAddonRef = useRef(null); // Keep a reference to the FitAddon
    const { terminalSocket } = useTerminalSocketStore();

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize terminal
        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: "#282a37",
                foreground: "#f8f8f3",
                cursor: "#f8f8f3",
                cursorAccent: "#282a37",
                red: "#ff5544",
                green: "#50fa7c",
                yellow: "#f1fa8c",
                cyan: "#8be9fd",
            },
            fontSize: 14,
            fontFamily: "monospace",
            convertEol: true,
        });

        // Add the terminal to the DOM
        term.open(terminalRef.current);

        // Initialize and load FitAddon
        const fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;
        term.loadAddon(fitAddon);
        fitAddon.fit();

        // Attach WebSocket if available
        if (terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon);
            };
        }

        // Resize the terminal when the container resizes
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });
        resizeObserver.observe(terminalRef.current);

        // Cleanup
        return () => {
            term.dispose();
            terminalSocket?.close();
            resizeObserver.disconnect();
        };
    }, [terminalSocket]);

    return <div ref={terminalRef} className="terminal" id="terminal-container"></div>;
}

export default BrowserTerminal;
