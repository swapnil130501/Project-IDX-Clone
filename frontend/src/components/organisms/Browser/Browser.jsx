// frontend/src/components/organisms/Browser/Browser.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { usePreviewReloadStore } from "../../../store/previewReloadStore";
import "./Browser.css";

export const Browser = ({ projectId }) => {

    const browserRef = useRef(null);
    const isFirstRender = useRef(true);
    const { port } = usePortStore();
    const { editorSocket } = useEditorSocketStore();
    const { reloadCount } = usePreviewReloadStore();

    useEffect(() => {
        if (!port) {
            editorSocket?.emit("getPort", {
                containerName: projectId
            });
        }
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
        return <div className="browser-loading">Loading preview…</div>;
    }

    return (
        <div className="browser-pane">
            <div className="browser-address-bar">{`http://localhost:${port}`}</div>
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
