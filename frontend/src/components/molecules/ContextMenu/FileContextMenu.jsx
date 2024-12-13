import React from 'react'
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import './FileContextMenu.css';
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
        <div className='fileContextOptionsWrapper'
            onMouseLeave={() => setIsOpen(false)}
            style={{
                left: x,
                top: y,
            }}
        >
            <button className="fileContextButton" onClick={handleFileDelete}>delete file</button>
            <button className="fileContextButton" >rename file</button>
        </div>
    )
}

export default FileContextMenu