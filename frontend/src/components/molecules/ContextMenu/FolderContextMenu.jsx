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
        <div className='contextOptionsWrapper'
            onMouseLeave={() => setIsOpen(false)}
            style={{
                left: x,
                top: y,
            }}
        >
            <button className="contextButton" onClick={handleFileDelete}>delete file</button>
            <button className="contextButton" >create file</button>
            <button className="contextButton" >create folder</button>
            <button className="contextButton" >rename file</button>
        </div>
    )
}

export default FolderContextMenu