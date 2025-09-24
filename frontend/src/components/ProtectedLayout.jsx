import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useIsAuth } from "../store/slices/useIsAuth.js";
import { useUserStore } from "../store/slices/useUserStore.js";
import { useCurrentPlaylist } from "../store/slices/useCurrentPlaylist.js";
import { useNavigate } from "react-router-dom";

const ProtectedLayout = ({ children }) => {
  const isAuth = useIsAuth((state) => state.isAuth);
  const isAdmin = useIsAuth((state) => state.isAdmin);
  const [showLoader, setShowLoader] = useState(true);
  const removeAuth = useIsAuth((state) => state.removeAuth);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const removeCurrentPlaylist = useCurrentPlaylist(
    (state) => state.removeCurrentPlaylist
  );
  const removeCurrentVideoId = useCurrentPlaylist(
    (state) => state.removeCurrentVideoId
  );
  const removeCourseId = useCurrentPlaylist((state) => state.removeCourseId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (showLoader && !isAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-lg font-medium animate-pulse">Loading...</span>
      </div>
    );
  }

  return isAuth ? (
    children
  ) : (
    <>
      {logoutUser()}
      {removeCurrentPlaylist()}
      {removeCurrentVideoId()}
      {removeCourseId()}
      <Navigate to="/signin" replace />
    </>
  );
};

export default ProtectedLayout;
