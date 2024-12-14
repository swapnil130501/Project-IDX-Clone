import { create } from "zustand";

export const useCreateFileStore = create((set) => ({
    isModalOpen: false,
    folderPath: null,
    createdFileName: null,
    isFolderCreation: false,
    setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
    setFolderPath: (path) => set({ folderPath: path }),
    setCreatedFileName: (name) => set({ createdFileName: name }),
    setIsFolderCreation: (isFolder) => set({ isFolderCreation: isFolder }),
}));
