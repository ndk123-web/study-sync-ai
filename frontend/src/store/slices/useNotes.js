import { createPersistedStore } from "../store";


const useNotes = createPersistedStore("notes", (set) => ({

    notStoreNotes: (notes) => set(() => ({ notStoreNotes: notes })),
    storeNotes: (notes) => set(() => ({ storeNotes: notes })),

    setNotStoreNotes: (notes) => set(() => ({ notStoreNotes: notes })),
    setStoreNotes: (notes) => set(() => ({ storeNotes: notes })), 

}))

export { useNotes }