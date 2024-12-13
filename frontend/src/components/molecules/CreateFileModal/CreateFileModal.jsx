import { useState } from "react";
import { useCreateFileStore } from "../../../store/createFileStore"
import { Modal } from 'antd';
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const CreateFileModal = () => {
    const { isModalOpen, setIsModalOpen, setCreatedFileName } = useCreateFileStore();
    const [inputValue, setInputValue] = useState("");
    const { editorSocket } = useEditorSocketStore();
    const { folder } = useFolderContextMenuStore();

    function handleOk() {
        if(inputValue) {
            console.log('creating new file', inputValue);
            console.log(folder)
            editorSocket.emit("createFile", {
                pathToFileOrFolder: folder+"/"+inputValue,
            });
            setCreatedFileName(inputValue);
        }

        setIsModalOpen(false);
        setInputValue("");
    }

    function handleClose() {
        setIsModalOpen(false);
        setInputValue("");
    }

    return (
        <>
            <Modal title="Create New File" onOk={handleOk} onClose={handleClose} open={isModalOpen}>
                <input
                    type="text"
                    value={inputValue}
                    placeholder="Enter file name"
                    onChange={(e) => setInputValue(e.target.value)}
                >
                
                </input>
            </Modal>
        </>
    )
}