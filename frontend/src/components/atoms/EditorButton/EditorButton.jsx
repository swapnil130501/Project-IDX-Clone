import React from 'react'
import './EditorButton.css'

function EditorButton({ isActive }) {

    function handleClick() {
        console.log('clicked');
    }

    return (
        <button 
            className='editor-button'
            style={{
                color: isActive ? 'white' : "#959eba",
                backgroundColor: isActive ? '#303242': '#4a4859',
                borderTop: isActive ? 'border-top: 2px solid #f7b9dd' : 'none'
            }}
            onClick={handleClick}
        >
            file.js
        </button>
    )
}

export default EditorButton