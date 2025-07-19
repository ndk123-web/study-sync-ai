import { createPersistedStore } from "../store";
import CryptoJs from 'crypto-js'

const useThemeStore = createPersistedStore("theme", (set) => ({
    mode: CryptoJs.AES.encrypt("light",import.meta.env.VITE_ENCRYPTION_SECRET).toString(),
    setMode: () => set((state) => {
        const decryptedMode = CryptoJs.AES.decrypt(state.mode,import.meta.env.VITE_ENCRYPTION_SECRET).toString(CryptoJs.enc.Utf8)
        return { mode: CryptoJs.AES.encrypt(decryptedMode === 'dark' ? 'light' : 'dark',import.meta.env.VITE_ENCRYPTION_SECRET).toString() }
    })
}))

export { useThemeStore }