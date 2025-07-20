import { Navigate } from "react-router-dom";
import { useIsAuth } from '../store/slices/useIsAuth.js';

const ProtectedLayout = ({ children }) => {
  const isAuth = useIsAuth((state) => state.isAuth);

  return isAuth ? children : <Navigate to="/signin" replace />;
};

export default ProtectedLayout;
