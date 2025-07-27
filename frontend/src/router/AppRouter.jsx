import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Features from "../components/Features.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import CoursesInterface from '../components/CoursesInterface.jsx'

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
  {
    path:"/courses/:id",
    element: (
      <ProtectedLayout>
        <CoursesInterface />
      </ProtectedLayout>
    )
  },
  {
    path:"/demo-courses",
    element: <CoursesInterface />
  }
]);

export default AppRouter;
