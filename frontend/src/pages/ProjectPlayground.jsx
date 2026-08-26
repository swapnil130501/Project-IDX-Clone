import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import TreeStructure from "../components/organisms/TreeStructure/TreeStructure";
import BrowserTerminal from "../components/molecules/BrowserTerminal/BrowserTerminal";
import FileTabs from "../components/molecules/FileTabs/FileTabs";
import Toolbar from "../components/organisms/Toolbar/Toolbar";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { usePreviewReloadStore } from "../store/previewReloadStore";
import { usePortStore } from "../store/portStore";
import { useActiveFileTabStore } from "../store/activeFileTabStore";
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
    const { triggerReload } = usePreviewReloadStore();

    useEffect(() => {
        if (projectIdFromUrl) {
            usePortStore.setState({ port: null });
            useActiveFileTabStore.setState({ activeFileTab: null, openTabs: [] });
            setProjectId(projectIdFromUrl);

            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl },
            });
            setEditorSocket(editorSocketConnection);

            try {
                const ws = new WebSocket(
                    "ws://localhost:4000/terminal?projectId=" + projectIdFromUrl
                );
                setTerminalSocket(ws);
            } catch (error) {
                console.log("Error initializing WebSocket:", error);
            }
        }
    }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

    return (
        <div className="project-playground">
            <Toolbar onReloadPreview={triggerReload} />
            <div className="playground-narrow-notice flex min-[720px]:hidden flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
                <p className="font-ui text-[14px] font-semibold text-ink">
                    Nimbus needs a wider screen
                </p>
                <p className="font-ui text-[13px] text-ink-dim">
                    The workspace's file tree, editor, and preview panes need at least a laptop-sized display. Try again on a larger screen.
                </p>
            </div>
            <div className="playground-body hidden min-[720px]:block">
                <Allotment>
                    {/* Left Sidebar */}
                    <Allotment.Pane preferredSize={250} minSize={200} maxSize={400}>
                        {projectId && (
                            <div className="h-full overflow-y-auto border-r border-line bg-base px-1.5 py-2 text-ink">
                                <TreeStructure />
                            </div>
                        )}
                    </Allotment.Pane>

                    {/* Main Content */}
                    <Allotment.Pane>
                        <Allotment vertical>
                            {/* Editor */}
                            <Allotment.Pane preferredSize="70%" minSize={300}>
                                <div className="relative flex h-full flex-col overflow-hidden border-l border-line bg-surface">
                                    <FileTabs />
                                    <EditorComponent />
                                </div>
                            </Allotment.Pane>

                            {/* Terminal */}
                            <Allotment.Pane preferredSize="30%" minSize={200}>
                                <div className="browser-terminal">
                                    <BrowserTerminal />
                                </div>
                            </Allotment.Pane>
                        </Allotment>
                    </Allotment.Pane>

                    {/* Browser */}
                    <Allotment.Pane preferredSize={300} minSize={250}>
                        <div className="browser-container">
                            {projectIdFromUrl && terminalSocket && (
                                <Browser projectId={projectIdFromUrl} />
                            )}
                        </div>
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}

export default ProjectPlayground;
