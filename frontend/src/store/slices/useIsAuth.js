import { createPersistedStore } from "../store";

const useIsAuth = createPersistedStore("isAuth", (set) => ({
    isAuth: false,
    setAuth: () => set(() => ({ isAuth: true })),
    removeAuth: () => set(() => ({ isAuth: false }))
}))

export { useIsAuth }