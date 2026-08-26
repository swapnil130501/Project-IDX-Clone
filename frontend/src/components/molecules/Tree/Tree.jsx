import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { CreateFileModal } from "../CreateInputModal/CreateFileFolderModal";
import { useCreateFileStore } from "../../../store/createFileFolderStore";
import { useExpandTreeStore } from "../../../store/expandTreeStore";
import { useActiveFileTabStore } from "../../../store/activeFileTabStore";
import TreeRow from "./TreeRow";

function Tree({ data, depth = 0 }) {
    const { editorSocket } = useEditorSocketStore();
    const {
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY,
        setFile,
    } = useFileContextMenuStore();
    const {
        setX: setFolderContextMenuX,
        setY: setFolderContextMenuY,
        setIsOpen: setFolderContextMenuIsOpen,
        setFolder,
    } = useFolderContextMenuStore();
    const { isModalOpen, folderPath, isFolderCreation } = useCreateFileStore();
    const { expand, toggleExpand } = useExpandTreeStore();
    const { activeFileTab } = useActiveFileTabStore();
    const reduceMotion = useReducedMotion();

    if (!data) {
        return null;
    }

    const isFolder = Boolean(data.children);
    const isExpanded = Boolean(expand[data.path]);
    const isActive = !isFolder && activeFileTab?.path === data.path;

    function computeExtension(node) {
        const names = node.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    function handleClick() {
        if (isFolder) {
            toggleExpand(data.path);
            return;
        }
        editorSocket.emit("readFile", { pathToFileOrFolder: data.path });
    }

    function handleContextMenu(e) {
        e.preventDefault();
        if (isFolder) {
            setFolder(data.path);
            setFolderContextMenuX(e.clientX);
            setFolderContextMenuY(e.clientY);
            setFolderContextMenuIsOpen(true);
            return;
        }
        setFile(data.path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    return (
        <div className="w-full">
            <TreeRow
                depth={depth}
                isFolder={isFolder}
                isExpanded={isExpanded}
                isActive={isActive}
                name={data.name}
                extension={isFolder ? undefined : computeExtension(data)}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            />

            {isFolder && isModalOpen && folderPath === data.path && (
                <div style={{ paddingLeft: `${6 + (depth + 1) * 14}px` }}>
                    <CreateFileModal isFolderCreation={isFolderCreation} />
                </div>
            )}

            <AnimatePresence initial={false}>
                {isFolder && isExpanded && data.children?.length > 0 && (
                    <motion.div
                        key="children"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                    >
                        {data.children.map((child) => (
                            <Tree data={child} depth={depth + 1} key={child.name} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

Tree.propTypes = {
    data: PropTypes.object,
    depth: PropTypes.number,
};

export default Tree;
