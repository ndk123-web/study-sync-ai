import { createPersistedStore } from "../store";

const useUserStore = createPersistedStore("user", (set) => ({
    name: "",
    bio: "",
    photoURL: "",
    isPremium: "",
    email: "",

    loginUser: (name, email, bio, photoURL, isPremium) => set((state) => ({
        name,
        email,
        bio,
        photoURL,
        isPremium
    })),

    updateUser: (name, email, bio, photoURL, isPremium) => set((state) => ({
        name,
        email,
        bio,
        photoURL,
        isPremium
    })),

    logoutUser: () => set((state) => ({
        name: "",
        bio: "",
        photoURL: "",
        isPremium: "",
        email: "",
    }))

}))

export { useUserStore }