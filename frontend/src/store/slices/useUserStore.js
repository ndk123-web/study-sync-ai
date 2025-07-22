import { createPersistedStore } from "../store";

const useUserStore = createPersistedStore("user", (set) => ({
    username: "",
    bio: "",
    photoURL: "",
    isPremium: "",
    email: "",

    loginUser: ({username, email, bio, photoURL, isPremium}) => set((state) => ({
        username,
        email,
        bio,
        photoURL,
        isPremium
    })),

    updateUser: ({username, email, bio, photoURL, isPremium}) => set((state) => ({
        username,   
        email,
        bio,
        photoURL,
        isPremium
    })),

    logoutUser: () => set((state) => ({
        username: "",
        bio: "",
        photoURL: "",
        isPremium: "",
        email: "",
    }))

}))

export { useUserStore }