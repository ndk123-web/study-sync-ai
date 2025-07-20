import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { SignIn } from '../pages/SignIn.jsx';
import SignUp  from '../pages/SignUp.jsx';
import Home from "../pages/Home.jsx";

const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: (
            <Home />
        )
    },
    {
        path: '/signin',
        element: (
            <SignIn />
        )
    },
    {
        path: '/signup',
        element: (
            <SignUp />
        )
    }
])

export default AppRouter;