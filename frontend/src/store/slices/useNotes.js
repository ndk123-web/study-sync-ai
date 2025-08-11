import { createPersistedStore } from "../store";

const useNotes = createPersistedStore("notes", (set) => ({
    // State properties for storing notes
    notStoreNotes: "",
    storedNotes: "",  // ✅ Fixed property name
    
    // Action functions to update the state
    setNotStoreNotes: (notes) => set(() => ({ notStoreNotes: notes })),
    setStoredNotes: (notes) => set(() => ({ storedNotes: notes })),  // ✅ Fixed function name

    clearNotes: () => set(() => ({ notStoreNotes: "", storedNotes: "" }))  // ✅ Clear both
}))

export { useNotes }