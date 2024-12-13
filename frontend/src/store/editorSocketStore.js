import { create } from 'zustand';
import { useActiveFileTabStore } from './activeFileTabStore';

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        incomingSocket?.on('readFileSuccess', (data) => {
            console.log('read file success', data);
            activeFileTabSetter(data.path, data.value);
        });

        set({
            editorSocket: incomingSocket
        });
    }
}));