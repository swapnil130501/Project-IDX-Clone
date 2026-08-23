import PropTypes from 'prop-types';
import './EditorButton.css';

function EditorButton({ label, isActive, onClick, onClose }) {
    function handleClose(e) {
        e.stopPropagation();
        onClose();
    }

    return (
        <button
            className={`editor-button${isActive ? ' editor-button-active' : ''}`}
            onClick={onClick}
        >
            <span className="editor-button-label">{label}</span>
            <span className="editor-button-close" onClick={handleClose}>×</span>
        </button>
    );
}

EditorButton.propTypes = {
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EditorButton;