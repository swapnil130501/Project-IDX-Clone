import { useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { CreateFileModal } from '../CreateInputModal/CreateFileFolderModal';
import { useCreateFileStore } from "../../../store/createFileFolderStore";
import { useTreeStructureStore } from "../../../store/treeStructureStore";

function Tree({ data }) {
    const [expand, setExpand] = useState({});
    const { editorSocket } = useEditorSocketStore();
    const { setIsOpen: setFileContextMenuIsOpen, setX: setFileContextMenuX, setY: setFileContextMenuY, setFile } = useFileContextMenuStore();
    const { setX: setFolderContextMenuX, setY: setFolderContextMenuY, setIsOpen: setFolderContextMenuIsOpen, setFolder } = useFolderContextMenuStore();
    const { isModalOpen, folderPath, isFolderCreation} = useCreateFileStore();
    const { projectId } = useTreeStructureStore();
    const currentRoomRef = useRef(null); // Track the current room

    function handleExpand(name) {
        setExpand({
            ...expand,
            [name]: !expand[name],
        });
    }

    function computeExtension(data) {
        const names = data.name.split(".");
        return names.length > 1 ? names[names.length - 1] : null;
    }

    function handleClick(data) {
        const roomId = `${projectId}:${data.path}`;

        // Check if already in the room
        if (currentRoomRef.current !== roomId) {
            // Join the new room
            editorSocket.emit("joinRoom", {
                projectId: projectId,
                filePath: data.path,
            });
            console.log(`Joined room: ${roomId}`);
            currentRoomRef.current = roomId; // Update the current room ref
        }

        // Perform the file read operation
        editorSocket.emit("readFile", {
            projectId: projectId,
            pathToFileOrFolder: data.path,
        });
        console.log(`Read file: ${data.path}`);
    }

    function handleContextMenuForFile(e, path) {
        e.preventDefault();
        console.log('right click on file', path);
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    function handleContextMenuForFolder(e, path) {
        e.preventDefault();
        console.log('right click on folder', path);
        setFolder(path);
        setFolderContextMenuX(e.clientX);
        setFolderContextMenuY(e.clientY);
        setFolderContextMenuIsOpen(true);
    }

    return (
        data && (
            <div
                style={{
                    paddingLeft: "15px",
                    backgroundColor: "#21222C",
                    color: "#f8f8f2",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    lineHeight: "1.5",
                }}
            >
                {data.children ? (
                    <div>
                        <button
                            onClick={() => handleExpand(data.name)}
                            style={{
                                border: "none",
                                cursor: "pointer",
                                outline: "none",
                                backgroundColor: "transparent",
                                padding: "10px",
                                marginTop: "5px",
                                fontSize: "17px",
                                fontFamily: "monospace",
                                color: expand[data.name] ? "#ff79c6" : "#bd93f9",
                                display: "flex",
                                alignItems: "center",
                                lineHeight: "1.5",
                            }}
                            onContextMenu={(e) => handleContextMenuForFolder(e, data.path)}
                        >
                            <span
                                style={{
                                    marginRight: "5px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {expand[data.name] ? (
                                    <IoIosArrowDown style={{ color: "#50fa7b", fontSize: "14px" }} />
                                ) : (
                                    <IoIosArrowForward style={{ color: "#ff79c6", fontSize: "14px" }} />
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
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            marginTop: "5px",
                            padding: "5px 0",
                        }}
                        onClick={() => handleClick(data)}
                        onContextMenu={(e) => handleContextMenuForFile(e, data.path)}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "5px",
                            }}
                        >
                            <FileIcon extension={computeExtension(data)} />
                        </span>
                        <span
                            style={{
                                fontSize: "15px",
                                fontFamily: "monospace",
                                lineHeight: "1.5",
                                color: "#f8f8f2",
                            }}
                        >
                            {data.name}
                        </span>
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
