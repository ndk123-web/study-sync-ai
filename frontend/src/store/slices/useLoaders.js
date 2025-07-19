import { createPersistedStore } from "../store";

const useLoaders = createPersistedStore('loaders', (set) => ({
    loader: false,
    githubLoader: false,
    googleLoader: false,
    pageLoader: false,

    setLoader: () => set(() => ({ loader: true })),
    unsetLoader: () => set(() => ({ loader: false })),

    setGithubLoader: () => set(() => ({ githubLoader: true })),
    unsetGithubLoader: () => set(() => ({ githubLoader: false })),

    setGoogleLoader: () => set(() => ({ googleLoader: true })),
    unsetGoogleLoader: () => set(() => ({ googleLoader: false })),

    setPageLoader: () => set(() => ({ pageLoader: true })),
    unsetPageLoader: () => set(() => ({ pageLoader: false })),
}))

export { useLoaders }