import { create } from 'zustand';

export const useExpandTreeStore = create((set) => ({
    expand: {}, 
    toggleExpand: (name) =>
        set((state) => ({
            expand: {
                ...state.expand,
                [name]: !state.expand[name],
            },
        })),

    setExpanded: (name, isExpanded = true) =>
        set((state) => ({
            expand: {
                ...state.expand,
                [name]: isExpanded,
            },
        })),
}));
