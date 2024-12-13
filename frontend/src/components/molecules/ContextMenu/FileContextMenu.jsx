import React from 'react'
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import './ContextMenu.css';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

function FileContextMenu( {x, y, path}) {

    const { setIsOpen } = useFileContextMenuStore();
    const { editorSocket } = useEditorSocketStore();

    function handleFileDelete(e) {
        console.log();
        e.preventDefault();
        console.log('Deleting file at', path);
        editorSocket.emit('deleteFile', {
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
            <button className="contextButton" onClick={handleFileDelete}>Delete</button>
            <button className="contextButton" >Rename...</button>
        </div>
    )
}

export default FileContextMenu