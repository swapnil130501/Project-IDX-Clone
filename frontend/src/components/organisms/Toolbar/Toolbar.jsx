import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { VscRefresh } from 'react-icons/vsc';
import { usePortStore } from '../../../store/portStore';
import './Toolbar.css';

function Toolbar({ onReloadPreview }) {
    const { projectId } = useParams();
    const { port } = usePortStore();

    return (
        <div className="toolbar">
            <span className="toolbar-project-name">{projectId}</span>
            <div className="toolbar-spacer" />
            <span className={`toolbar-status ${port ? 'toolbar-status-running' : 'toolbar-status-idle'}`}>
                {port ? 'Running' : 'Starting…'}
            </span>
            <button
                className="toolbar-icon-button"
                onClick={onReloadPreview}
                title="Reload preview"
                aria-label="Reload preview"
            >
                <VscRefresh />
            </button>
        </div>
    );
}

Toolbar.propTypes = {
    onReloadPreview: PropTypes.func.isRequired,
};

export default Toolbar;
