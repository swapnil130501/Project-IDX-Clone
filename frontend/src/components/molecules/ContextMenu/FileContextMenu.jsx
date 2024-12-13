import React from 'react'
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import './ContextMenu.css';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

function FileContextMenu( {x, y, path}) {

    const {setX, setY, setIsOpen, setFile} = useFileContextMenuStore();
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
            <button className="contextButton" onClick={handleFileDelete}>delete file</button>
            <button className="contextButton" >rename file</button>
        </div>
    )
}

export default FileContextMenu