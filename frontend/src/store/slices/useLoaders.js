import { createPersistedStore } from "../store";

const useLoaders = createPersistedStore('loaders', (set) => ({
    loader: false,
    githubLoader: false,
    googleLoader: false,
    pageLoader: false,
    chatLoader: false,
    summarizeLoader: false,
    assessmentLoader: false,
    playlistLoader: false,
    progressLoader: false,

    setLoader: () => set(() => ({ loader: true })),
    unsetLoader: () => set(() => ({ loader: false })),

    setGithubLoader: () => set(() => ({ githubLoader: true })),
    unsetGithubLoader: () => set(() => ({ githubLoader: false })),

    setGoogleLoader: () => set(() => ({ googleLoader: true })),
    unsetGoogleLoader: () => set(() => ({ googleLoader: false })),

    setPageLoader: () => set(() => ({ pageLoader: true })),
    unsetPageLoader: () => set(() => ({ pageLoader: false })),

    setChatLoader: () => set(() => ({ chatLoader: true })),
    unsetChatLoader: () => set(() => ({ chatLoader: false })),

    setSummarizeLoader: () => set(() => ({ summarizeLoader: true })),
    unsetSummarizeLoader: () => set(() => ({ summarizeLoader: false })),

    setAssessmentLoader: () => set(() => ({ assessmentLoader: true })),
    unsetAssessmentLoader: () => set(() => ({ assessmentLoader: false })),

    setPlaylistLoader: () => set(() => ({ playlistLoader: true })),
    unsetPlaylistLoader: () => set(() => ({ playlistLoader: false })),

    setProgressLoader: () => set(() => ({ progressLoader: true })),
    unsetProgressLoader: () => set(() => ({ progressLoader: false })),
}))

export { useLoaders }