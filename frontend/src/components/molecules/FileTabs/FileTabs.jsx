import { AnimatePresence } from 'motion/react';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import EditorTab from '../../atoms/EditorTab/EditorTab';

function FileTabs() {
    const { openTabs, activeFileTab, activateTab, closeTab } = useActiveFileTabStore();

    if (openTabs.length === 0) {
        return null;
    }

    return (
        <div className="flex shrink-0 overflow-x-auto border-b border-line bg-base">
            <AnimatePresence initial={false} mode="popLayout">
                {openTabs.map((tab) => (
                    <EditorTab
                        key={tab.path}
                        label={tab.name}
                        isActive={activeFileTab?.path === tab.path}
                        onClick={() => activateTab(tab.path)}
                        onClose={() => closeTab(tab.path)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default FileTabs;
