import { create } from 'zustand';

export const usePreviewReloadStore = create((set) => ({
    reloadCount: 0,
    triggerReload: () => set((state) => ({ reloadCount: state.reloadCount + 1 })),
}));
