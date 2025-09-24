import { createPersistedStore } from "../store";
import CryptoJs from "crypto-js";

const useIsAuth = createPersistedStore("isAuth", (set) => ({
  isAuth: false,
  isAdmin: false,
  setAuth: () => set(() => ({ isAuth: true })),
  removeAuth: () => set(() => ({ isAuth: false, isAdmin: false })),
  setAdmin: () => set(() => ({ isAuth: true, isAdmin: true })),
  removeAdmin: () => set(() => ({ isAuth: false, isAdmin: false })),
}));

export { useIsAuth };
