import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useIsAuth } from "../store/slices/useIsAuth.js";

const ProtectedLayout = ({ children }) => {
  const isAuth = useIsAuth((state) => state.isAuth);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  if (showLoader && !isAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-lg font-medium animate-pulse">Loading...</span>
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/signin" replace />;
};

export default ProtectedLayout;
