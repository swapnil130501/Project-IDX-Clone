import { create } from "zustand";

export const useCreateFileStore = create((set) => ({
    isModalOpen: false,
    folderPath: null, 
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setFolderPath: (path) => set({ folderPath: path }),
    setCreatedFileName: (name) => set({ createdFileName: name }),
}));
