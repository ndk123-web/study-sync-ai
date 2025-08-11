import { createPersistedStore } from "../store";

const useNotes = createPersistedStore("notes", (set) => ({
    // State properties for storing notes
    notStoreNotes: "",
    storeNotes: "",
    
    // Action functions to update the state
    setNotStoreNotes: (notes) => set(() => ({ notStoreNotes: notes })),
    setStoreNotes: (notes) => set(() => ({ storeNotes: notes })),
}))

export { useNotes }