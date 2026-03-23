import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase.js";
import { useUserStore } from "../store/slices/useUserStore.js";

/**
 * this is we need to wait for firebase auth state for some time
 */
const waitForAuthUser = async (auth, timeoutMs = 1500) => {
  if (auth.currentUser) return auth.currentUser;

  return new Promise((resolve) => {
    let done = false;

    const finish = (user) => {
      if (done) return;
      done = true;
      resolve(user || null);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      finish(user);
    });

    setTimeout(() => {
      unsubscribe();
      finish(null);
    }, timeoutMs);
  });
};

/**
 * Get authenticated headers with fresh Firebase token
 * @returns {Promise<Object>} Headers object with Authorization and Content-Type
 */
export const getAuthHeaders = async () => {
  const auth = getAuth(app);
  const user = await waitForAuthUser(auth);
  let token = "";

  if (user) {
    // Avoid forced refresh on every call to reduce first-render auth failures.
    token = await user.getIdToken();
  }

  if (!token) {
    token = useUserStore.getState()._accessToken || "";
  }

  if (!token) {
    throw new Error("User not authenticated - Please sign in again");
  }
  
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Get authenticated axios config with credentials and headers
 * @returns {Promise<Object>} Axios config object
 */
export const getAuthConfig = async () => {
  const headers = await getAuthHeaders();
  
  return {
    withCredentials: true,
    headers,
  };
};