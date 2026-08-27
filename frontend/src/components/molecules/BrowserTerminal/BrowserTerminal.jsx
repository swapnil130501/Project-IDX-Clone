import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"; // required styles
import { AttachAddon } from "@xterm/addon-attach";
import { VscTerminal } from "react-icons/vsc";
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
                background: "#181818",
                foreground: "#e6e6e6",
                cursor: "#e6e6e6",
                cursorAccent: "#181818",
                red: "#f85149",
                green: "#3fb950",
                yellow: "#e3b341",
                cyan: "#3b82f6",
            },
            fontSize: 14,
            fontFamily: "'Fira Code', ui-monospace, monospace",
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

    return (
        <div className="flex h-full flex-col">
            <div className="terminal-header">
                <VscTerminal aria-hidden="true" />
                <span>Terminal</span>
            </div>
            <div className="terminal-body">
                <div ref={terminalRef} className="terminal" id="terminal-container"></div>
            </div>
        </div>
    );
}

export default BrowserTerminal;
