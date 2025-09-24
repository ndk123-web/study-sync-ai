import { Navigate } from "react-router-dom";
import { useIsAuth } from "../store/slices/useIsAuth";
import { useUserStore } from "../store/slices/useUserStore";

const ProtectedAdminLayout = ({ children }) => {
  const isAdmin = useIsAuth((state) => state.isAdmin);
  const setAdmin = useIsAuth((state) => state.setAdmin);
  const removeAdmin = useIsAuth((state) => state.removeAdmin);
  const loginUser = useUserStore((state) => state.loginUser);
  const logoutUser = useUserStore((state) => state.logoutUser);

  if (isAdmin) {
    loginUser({ username: "admin" });
    return children;
  } else {
    removeAdmin();
    logoutUser();
    return <Navigate to="/signin" />;
  }
};

export default ProtectedAdminLayout;