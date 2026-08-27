// frontend/src/components/organisms/Browser/Browser.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { VscRefresh } from "react-icons/vsc";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { usePreviewReloadStore } from "../../../store/previewReloadStore";
import Spinner from "../../atoms/Spinner/Spinner";
import "./Browser.css";

export const Browser = ({ projectId }) => {

    const browserRef = useRef(null);
    const isFirstRender = useRef(true);
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();
    const { reloadCount, triggerReload } = usePreviewReloadStore();

    useEffect(() => {
        if (port || !editorSocket) {
            return;
        }

        editorSocket.emit("getPort", { containerName: projectId });

        // The container can still be (re)starting when this fires, so a single
        // request can race it and come back empty with nothing to retry it.
        // Poll until a port actually comes back.
        const retryId = setInterval(() => {
            editorSocket.emit("getPort", { containerName: projectId });
        }, 2000);

        return () => clearInterval(retryId);
    }, [port, editorSocket, projectId]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (browserRef.current) {
            const oldAddr = browserRef.current.src;
            browserRef.current.src = oldAddr;
        }
    }, [reloadCount]);

    if (!port) {
        return (
            <div className="browser-loading">
                <Spinner size="sm" />
                <span>Loading preview…</span>
            </div>
        );
    }

    return (
        <div className="browser-pane">
            <div className="browser-address-bar">
                <span className="browser-address-status" aria-hidden="true" />
                <span className="browser-address-url">{`localhost:${port}`}</span>
                <button
                    type="button"
                    className="browser-address-reload"
                    onClick={triggerReload}
                    title="Reload preview"
                    aria-label="Reload preview"
                >
                    <VscRefresh />
                </button>
            </div>
            <iframe
                ref={browserRef}
                className="browser-frame"
                src={`http://localhost:${port}`}
                title="Project preview"
            />
        </div>
    );
}

Browser.propTypes = {
    projectId: PropTypes.string.isRequired,
};
