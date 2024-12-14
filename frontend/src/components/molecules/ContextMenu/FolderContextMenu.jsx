import React from 'react'
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import './ContextMenu.css';
import { useCreateFileStore } from '../../../store/createFileStore';

function FolderContextMenu( {x, y, path} ) {

    const { setIsOpen } = useFolderContextMenuStore();
    const { editorSocket } = useEditorSocketStore();
    const { setIsModalOpen, setFolderPath } = useCreateFileStore();

    function handleFileDelete(e) {
        e.preventDefault();
        console.log('Deleting folder at', path);
        editorSocket.emit('deleteFolder', {
            pathToFileOrFolder: path
        })
    }

    function handleNewFile() {
        console.log('New file created');
        setIsModalOpen(true);
        setFolderPath(path);
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
            <button className="contextButton" >New Folder...</button>
            <button className="contextButton" >Rename...</button>
        </div>
    )
}

export default FolderContextMenu