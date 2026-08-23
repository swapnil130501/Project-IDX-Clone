import React from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { CreateFileModal } from "../CreateInputModal/CreateFileFolderModal";
import { useCreateFileStore } from "../../../store/createFileFolderStore";
import { useExpandTreeStore } from "../../../store/expandTreeStore";
import "./Tree.css";

function Tree({ data }) {
    const { editorSocket } = useEditorSocketStore();
    const { setIsOpen: setFileContextMenuIsOpen, setX: setFileContextMenuX, setY: setFileContextMenuY, setFile } = useFileContextMenuStore();
    const { setX: setFolderContextMenuX, setY: setFolderContextMenuY, setIsOpen: setFolderContextMenuIsOpen, setFolder } = useFolderContextMenuStore();
    const { isModalOpen, folderPath, isFolderCreation } = useCreateFileStore();

    const { expand, toggleExpand, setExpanded } = useExpandTreeStore();

    function handleExpand(name) {
        toggleExpand(name);
    }

    function computeExtension(data) {
        const names = data.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    function handleClick(data) {
        editorSocket.emit("readFile", {
            pathToFileOrFolder: data.path,
        });

        console.log("clicked");
    }

    function handleContextMenuForFile(e, path) {
        e.preventDefault();
        console.log("right click on file", path);
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    function handleContextMenuForFolder(e, path) {
        e.preventDefault();
        console.log("right click on folder", path);
        setFolder(path);
        setFolderContextMenuX(e.clientX);
        setFolderContextMenuY(e.clientY);
        setFolderContextMenuIsOpen(true);
    }

    return (
        data && (
            <div className="tree-node">
                {data.children ? (
                    <div>
                        <button
                            className={`tree-folder-button${expand[data.name] ? ' expanded' : ''}`}
                            onClick={() => handleExpand(data.name)}
                            onContextMenu={(e) => handleContextMenuForFolder(e, data.path)}
                        >
                            <span className="tree-folder-icon">
                                {expand[data.name] ? (
                                    <IoIosArrowDown className="tree-icon-expanded" />
                                ) : (
                                    <IoIosArrowForward className="tree-icon-collapsed" />
                                )}
                            </span>
                            {data.name}
                        </button>

                        {isModalOpen && folderPath === data.path && (
                            <div>
                                <CreateFileModal isFolderCreation={isFolderCreation} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className="tree-file-row"
                        onClick={() => handleClick(data)}
                        onContextMenu={(e) => handleContextMenuForFile(e, data.path)}
                    >
                        <span className="tree-file-icon">
                            <FileIcon extension={computeExtension(data)} />
                        </span>
                        <span className="tree-file-name">{data.name}</span>
                    </div>
                )}

                {expand[data.name] &&
                    data.children?.length > 0 &&
                    data.children.map((it) => <Tree data={it} key={it.name} />)}
            </div>
        )
    );
}

export default Tree;
