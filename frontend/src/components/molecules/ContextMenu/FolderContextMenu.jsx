import React from 'react'
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import './ContextMenu.css';

function FolderContextMenu( {x, y, path} ) {

    const {setX, setY, setIsOpen, setFile} = useFolderContextMenuStore();
    const { editorSocket } = useEditorSocketStore();

    function handleFileDelete(e) {
        e.preventDefault();
        console.log('Deleting folder at', path);
        editorSocket.emit('deleteFolder', {
            pathToFileOrFolder: path
        })
    }

    return (
        <div className='fileContextOptionsWrapper'
            onMouseLeave={() => setIsOpen(false)}
            style={{
                left: x,
                top: y,
            }}
        >
            <button className="fileContextButton" onClick={handleFileDelete}>delete file</button>
            <button className="fileContextButton" >create file</button>
            <button className="fileContextButton" >create folder</button>
            <button className="fileContextButton" >rename file</button>
        </div>
    )
}

export default FolderContextMenu