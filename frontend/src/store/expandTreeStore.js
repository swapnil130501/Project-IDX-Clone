import { create } from 'zustand';

export const useExpandTreeStore = create((set) => ({
    expand: {},
    toggleExpand: (path) =>
        set((state) => ({
            expand: {
                ...state.expand,
                [path]: !state.expand[path],
            },
        })),

    setExpanded: (path, isExpanded = true) =>
        set((state) => ({
            expand: {
                ...state.expand,
                [path]: isExpanded,
            },
        })),
}));
