import { create } from 'zustand';
import { useActiveFileTabStore } from './activeFileTabStore';
import { useTreeStructureStore } from './treeStructureStore';
import { usePortStore } from './portStore';

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;
        const portSetter = usePortStore.getState().setPort;  
        
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

        incomingSocket?.on("getPortSuccess", ({ port }) => {
            console.log("port data", port);
            portSetter(port);
        });

        set({
            editorSocket: incomingSocket
        });
    }
}));