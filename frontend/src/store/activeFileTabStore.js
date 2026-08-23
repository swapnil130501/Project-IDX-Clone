import { create } from 'zustand';

export const useActiveFileTabStore = create((set, get) => ({
    activeFileTab: null,
    openTabs: [],

    setActiveFileTab: (path, value, extension) => {
        const name = path.split('/').pop();
        const tab = { path, name, extension, value };

        set((state) => {
            const existingIndex = state.openTabs.findIndex((t) => t.path === path);
            const openTabs = existingIndex === -1
                ? [...state.openTabs, tab]
                : state.openTabs.map((t, i) => (i === existingIndex ? tab : t));

            return { activeFileTab: tab, openTabs };
        });
    },

    upsertTabContent: (path, value, extension) => {
        const name = path.split('/').pop();
        const tab = { path, name, extension, value };

        set((state) => {
            const existingIndex = state.openTabs.findIndex((t) => t.path === path);
            if (existingIndex === -1) {
                return state;
            }

            const openTabs = state.openTabs.map((t, i) => (i === existingIndex ? tab : t));
            const activeFileTab = state.activeFileTab?.path === path ? tab : state.activeFileTab;

            return { openTabs, activeFileTab };
        });
    },

    activateTab: (path) => {
        const tab = get().openTabs.find((t) => t.path === path);
        if (tab) {
            set({ activeFileTab: tab });
        }
    },

    closeTab: (path) => {
        set((state) => {
            const closingIndex = state.openTabs.findIndex((t) => t.path === path);
            if (closingIndex === -1) {
                return state;
            }

            const openTabs = state.openTabs.filter((t) => t.path !== path);
            let activeFileTab = state.activeFileTab;

            if (state.activeFileTab?.path === path) {
                const fallbackIndex = Math.max(0, closingIndex - 1);
                activeFileTab = openTabs[fallbackIndex] ?? null;
            }

            return { openTabs, activeFileTab };
        });
    },
}));