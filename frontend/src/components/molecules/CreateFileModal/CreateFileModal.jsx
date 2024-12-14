import { useState } from "react";
import { useCreateFileStore } from "../../../store/createFileStore"
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

export const CreateFileModal = () => {
    const { isModalOpen, setIsModalOpen, setCreatedFileName } = useCreateFileStore();
    const [inputValue, setInputValue] = useState("");
    const { editorSocket } = useEditorSocketStore();
    const { folder } = useFolderContextMenuStore();

    function handleKeyDown(e) {
        if (e.key === "Enter" && inputValue) {
            console.log("Creating new file", inputValue);
            console.log(folder);
            editorSocket.emit("createFile", {
                pathToFileOrFolder: `${folder}/${inputValue}`,
            });
            setCreatedFileName(inputValue);
            setIsModalOpen(false);
            setInputValue("");
        } else if (e.key === "Escape") {
            handleClose();
        }
    }

    function handleClose() {
        setIsModalOpen(false);
        setInputValue("");
    }

    if (!isModalOpen) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <FileIcon extension={undefined} />
            <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter file name"
                style={{
                    marginLeft: '5px', 
                    width: '100%',
                    height: '25px',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '15px',
                }}
            />
        </div>
    );
}