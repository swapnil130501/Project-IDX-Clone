import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure";
import BrowserTerminal from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import io from "socket.io-client";
import "./ProjectPlayground.css";
import { Browser } from "../components/organisms/Browser/Browser";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function ProjectPlayground() {
    const { projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { setEditorSocket } = useEditorSocketStore();
    const { setTerminalSocket, terminalSocket } = useTerminalSocketStore();
    const [loadBrowser, setLoadBrowser] = useState(false);

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl },
            });

            try {
                const ws = new WebSocket(
                    "ws://localhost:4000/terminal?projectId=" + projectIdFromUrl
                );
                setTerminalSocket(ws);
            } catch (error) {
                console.log("error in ws", error);
            }
            setEditorSocket(editorSocketConnection);
        }
    }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

    return (
        <div className="project-playground">
            <Allotment>
                {/* Left Sidebar */}
                <Allotment.Pane preferredSize={250} minSize={200} maxSize={400}>
                    {projectId && (
                        <div className="tree-structure">
                            <TreeStructure />
                        </div>
                    )}
                </Allotment.Pane>

                {/* Main Content */}
                <Allotment>
                    {/* Editor and Browser Split */}
                    <Allotment.Pane>
                        <Allotment vertical>
                            {/* Editor */}
                            <Allotment.Pane preferredSize="75%">
                                <div className="editor-component">
                                    <EditorComponent />
                                </div>
                            </Allotment.Pane>

                            {/* Terminal */}
                           
                        </Allotment>
                    </Allotment.Pane>
                    
                    <div className="browser-terminal">
                        <BrowserTerminal />
                    </div>

                    {/* Browser */}
                    <Allotment.Pane preferredSize="25%" minSize={200}>
                        <div className="browser-container">
                            <button onClick={() => setLoadBrowser(true)}>Load my browser</button>
                            {loadBrowser && projectIdFromUrl && terminalSocket && (
                                <Browser projectId={projectIdFromUrl} />
                            )}
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </Allotment>
        </div>
    );
}

export default ProjectPlayground;
