import React from 'react'
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import './ContextMenu.css';
import { useCreateFileStore } from '../../../store/createFileFolderStore';

function FolderContextMenu( {x, y, path} ) {

    const { setIsOpen } = useFolderContextMenuStore();
    const { editorSocket } = useEditorSocketStore();
    const { setIsModalOpen, setFolderPath, setIsFolderCreation } = useCreateFileStore();

    function handleFileDelete(e) {
        e.preventDefault();
        editorSocket.emit('deleteFolder', {
            pathToFileOrFolder: path
        })
    }

    function handleNewFile() {
        setIsFolderCreation(false);
        setIsModalOpen(true);
        setFolderPath(path);
    }

    function handleNewFolder() {
        setIsFolderCreation(true);
        setIsModalOpen(true);
        setFolderPath(path)
    }

    return (
        <div className='contextOptionsWrapper'
            onMouseLeave={() => setIsOpen(false)}
            style={{
                left: x,
                top: y,
            }}
        >
            <button className="contextButton" onClick={handleFileDelete}>Delete</button>
            <button className="contextButton" onClick={handleNewFile}>New File...</button>
            <button className="contextButton" onClick={handleNewFolder}>New Folder...</button>
        </div>
    )
}

export default FolderContextMenu