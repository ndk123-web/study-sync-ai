import { createPersistedStore } from "../store";

const useCurrentPlaylist = createPersistedStore("currentPlaylist", (set) => ({
    currentPlaylist: [],
    currentVideoId: null,
    courseId: null,
    setCurrentPlaylist: (playlist) => set(() => ({ currentPlaylist: playlist })),
    setCurrentVideoId: (videoId) => set(() => ({ currentVideoId: videoId })),
    setCourseId: (id) => set(() => ({ courseId: id })),

    removeCurrentPlaylist: () => set(() => ({ currentPlaylist: [] })),
    removeCurrentVideoId: () => set(() => ({ currentVideoId: null })),
    removeCourseId: () => set(() => ({ courseId: null }))
}))

export { useCurrentPlaylist }