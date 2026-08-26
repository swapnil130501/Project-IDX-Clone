import { useState } from "react";
import { useCreateFileStore } from "../../../store/createFileFolderStore"
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { IoIosArrowForward } from "react-icons/io";
import { useExpandTreeStore } from "../../../store/expandTreeStore";

export const CreateFileModal = ({ isFolderCreation = false }) => {
    const { isModalOpen, setIsModalOpen, setCreatedFileName } = useCreateFileStore();
    const [inputValue, setInputValue] = useState("");
    const { editorSocket } = useEditorSocketStore();
    const { folder } = useFolderContextMenuStore();
    const { setExpanded } = useExpandTreeStore();

    function handleKeyDown(e) {
        if (e.key === "Enter" && inputValue) {
            editorSocket.emit(isFolderCreation ? "createFolder" : "createFile", {
                pathToFileOrFolder: `${folder}/${inputValue}`,
            });

            setCreatedFileName(inputValue);
            setIsModalOpen(false);
            setInputValue("");
            setExpanded(folder, true);
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
        <div className="flex w-full items-center gap-1.5 h-6 pr-2 font-mono text-[13px] leading-none text-ink">
            {isFolderCreation ? (
                <span className="flex h-3.5 w-3.5 items-center justify-center text-ink-faint">
                    <IoIosArrowForward size={13} />
                </span>
            ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                    <FileIcon extension={undefined} compact />
                </span>
            )}
            <input
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Enter ${isFolderCreation ? "folder" : "file"} name`}
                className="w-full border-none bg-transparent font-mono text-[13px] leading-none text-ink outline-none placeholder:text-ink-faint"
            />
        </div>
    );
}