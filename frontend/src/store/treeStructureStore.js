import { create } from 'zustand';
import { QueryClient } from '@tanstack/react-query';
import { getProjectTree } from '../apis/projects';

export const useTreeStructureStore = create((set, get) => {

    const queryClient = new QueryClient();

    return {
        projectId: null,
        treeStructure: null,
        treeStructureError: null,

        setTreeStructure: async () => {
            const id = get().projectId;
            try {
                const data = await queryClient.fetchQuery({
                    queryKey: [`projecttree-${id}`],
                    queryFn: () => getProjectTree({ projectId: id }),
                });

                set({
                    treeStructure: data,
                    treeStructureError: null,
                });
            } catch {
                set({
                    treeStructure: null,
                    treeStructureError: 'Couldn\'t load the file tree.',
                });
            }
        },

        setProjectId: (projectId) => {
            set({
                projectId: projectId
            });
        }
    }

})