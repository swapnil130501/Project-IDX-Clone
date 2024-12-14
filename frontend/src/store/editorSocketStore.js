import { create } from 'zustand';
import { useActiveFileTabStore } from './activeFileTabStore';
import { useTreeStructureStore } from './treeStructureStore';

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;  
        
        incomingSocket?.on('readFileSuccess', (data) => {
            console.log('read file success', data);
            const fileExtension = data.path.split('.').pop();
            activeFileTabSetter(data.path, data.value, fileExtension);
        });

        incomingSocket?.on('writeFileSuccess', (data) => {
            console.log('writeFileSucess', data);
            incomingSocket?.emit('readFile', {
                pathToFileOrFolder: data.path
            })
        });

        incomingSocket?.on('deleteFileSuccess', (data) => {
            console.log('deleteFileSuccess', data);
            projectTreeStructureSetter();
        });

        incomingSocket?.on('deleteFolderSuccess', (data) => {
            console.log('deleteFolderSuccess', data);
            projectTreeStructureSetter();
        });

        incomingSocket?.on('createFileSuccess', (data) => {
            console.log('createFileSuccess', data);
            projectTreeStructureSetter();
        });

        incomingSocket?.on('createFolderSuccess', (data) => {
            console.log('createFolderSuccess', data);
            projectTreeStructureSetter();
        });

        set({
            editorSocket: incomingSocket
        });
    }
}));