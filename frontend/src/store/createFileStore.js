import { create } from "zustand";

export const useCreateFileStore = create((set) => ({
    createdFileName: "",
    isModalOpen: false,

    setCreatedFileName: (fileName) => {
        set({
            createdFileName: fileName
        })
    },

    setIsModalOpen: (isOpen) => {
        set({
            isModalOpen: isOpen
        })
    }
}));