import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

function Tree({ data }) {
    const [expand, setExpand] = useState({});
    const { editorSocket, editorSocketStore } = useEditorSocketStore();
    const { setIsOpen: setFileContextMenuIsOpen, setX: setFileContextMenuX, setY: setFileContextMenuY, setFile } = useFileContextMenuStore();
    const { setX: setFolderContextMenuX, setY: setFolderContextMenuY, setIsOpen: setFolderContextMenuIsOpen, setFolder } = useFolderContextMenuStore();

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
        editorSocket.emit('readFile', {
            pathToFileOrFolder: data.path
        });

        console.log('clicked');
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
