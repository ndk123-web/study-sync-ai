import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      </>
    ),
  },
]);

export default AppRouter;
