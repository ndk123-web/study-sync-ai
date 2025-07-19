import { createPersistedStore } from "../store";

const useThemeStore = createPersistedStore("theme", (set) => ({
    mode: "light",
    setMode: () => set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' }))
}))

export { useThemeStore }