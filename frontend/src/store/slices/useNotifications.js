import { createPersistedStore } from "../store";

// Notification store with:
// - Persistence (already handled by createPersistedStore)
// - De-duplication by id (and title+message combo)
// - Null filtering (in case legacy persisted entries contain null)
// - Auto id generation if not provided
const useNotifications = createPersistedStore("notifications", (set, get) => ({
  userNotifications: [],
  addNotification: (notification) =>
    set((state) => {
      const cleaned = (state.userNotifications || []).filter(Boolean);
      const id = notification.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      // Avoid duplicates by id OR by identical title+message combo
      if (
        cleaned.some(
          (n) =>
            n.id === id ||
            (notification.title &&
              notification.message &&
              n.title === notification.title &&
              n.message === notification.message)
        )
      ) {
        return { userNotifications: cleaned };
      }
      const normalized = { ...notification, id };
      return { userNotifications: [normalized, ...cleaned] };
    }),
  removeNotification: (id) =>
    set((state) => ({
      userNotifications: (state.userNotifications || []).filter(
        (n) => n && n.id !== id
      ),
    })),
  clearNotifications: () => set(() => ({ userNotifications: [] })),
}));

export { useNotifications };
