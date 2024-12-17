import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EditorComponent } from '../components/molecules/EditorComponent/EditorComponent';
import TreeStructure from '../components/organisms/TreeStructure/TreeStructure';
import BrowserTerminal from '../components/molecules/BrowserTerminal/BrowserTerminal';
import { useTreeStructureStore } from '../store/treeStructureStore';
import { useEditorSocketStore } from '../store/editorSocketStore';
import { useTerminalSocketStore } from '../store/terminalSocketStore';
import io from 'socket.io-client';
import './ProjectPlayground.css';

function ProjectPlayground() {
    const { projectId: projectIdFromUrl } = useParams();
    const { setProjectId, projectId } = useTreeStructureStore();
    const { setEditorSocket } = useEditorSocketStore();
    const { setTerminalSocket } = useTerminalSocketStore();

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl },
            });
            const ws = new WebSocket("ws://localhost:3000/terminal?projectId=" + projectIdFromUrl);
            setTerminalSocket(ws);
            setEditorSocket(editorSocketConnection);
        }
    }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

    return (
        <div className="project-playground">
            {/* Sidebar */}
            {projectId && (
                    <div className="tree-structure">
                        <TreeStructure />
                    </div>
            )}

            {/* Main Content */}
            <div className="playground-content">
                {/* Editor */}
                <div className="editor-component">
                    <EditorComponent />
                </div>

                {/* Bottom Terminal */}
                <div className="browser-terminal">
                    <BrowserTerminal />
                </div>
            </div>
        </div>
    );
}

export default ProjectPlayground;
