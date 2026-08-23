import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import EditorButton from '../../atoms/EditorButton/EditorButton';
import './FileTabs.css';

function FileTabs() {
    const { openTabs, activeFileTab, activateTab, closeTab } = useActiveFileTabStore();

    if (openTabs.length === 0) {
        return null;
    }

    return (
        <div className="file-tabs">
            {openTabs.map((tab) => (
                <EditorButton
                    key={tab.path}
                    label={tab.name}
                    isActive={activeFileTab?.path === tab.path}
                    onClick={() => activateTab(tab.path)}
                    onClose={() => closeTab(tab.path)}
                />
            ))}
        </div>
    );
}

export default FileTabs;
