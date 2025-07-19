import { createPersistedStore } from "../store";
import CryptoJs from 'crypto-js'

const useIsAuth = createPersistedStore("isAuth", (set) => ({
    isAuth: false,
    setAuth: () => set(() => ({ isAuth: true })),
    removeAuth: () => set(() => ({ isAuth: false }))
}))

export { useIsAuth }