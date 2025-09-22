import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebase.js";

/**
 * Get authenticated headers with fresh Firebase token
 * @returns {Promise<Object>} Headers object with Authorization and Content-Type
 */
export const getAuthHeaders = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Get fresh ID token (force refresh to ensure it's not expired)
  const token = await user.getIdToken(true);
  
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