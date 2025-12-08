import { createPersistedStore } from "../store";

const useUserStore = createPersistedStore("user", (set) => ({
  username: "",
  bio: "",
  photoURL: "",
  isPremium: "",
  email: "",
  _accessToken: "",

  loginUser: ({ username, email, bio, photoURL, isPremium, _accessToken }) =>
    set((state) => ({
      username,
      email,
      bio,
      photoURL,
      isPremium,
      _accessToken,
    })),

  updateUser: ({ username, email, bio, photoURL, isPremium, _accessToken }) =>
    set((state) => ({
      username,
      email,
      bio,
      photoURL,
      isPremium,
      _accessToken,
    })),

  logoutUser: () =>
    set((state) => ({
      username: "",
      bio: "",
      photoURL: "",
      isPremium: "",
      email: "",
      _accessToken: "",
    })),
}));

export { useUserStore };
