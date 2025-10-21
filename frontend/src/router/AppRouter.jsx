import { createBrowserRouter } from "react-router-dom";
import ErrorFallback from "../components/ErrorFallback.jsx";
import ProtectedLayout from "../components/ProtectedLayout.jsx";
import ProtectedAdminLayout from "../components/ProtectedAdminLayout.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import Courses from "../pages/Courses.jsx";
import PdfInteraction from "../pages/PdfInteraction.jsx";
import VideoInteraction from "../pages/VideoInteraction.jsx";
import Features from "../components/Features.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import CoursesInterface from "../components/CoursesInterface";
import EnrolledCourses from "../components/EnrolledCourses";
import HelpSupport from "../pages/HelpSupport.jsx";
import MyCertificates from "../pages/MyCertificates.jsx";
import PrivacyPolicy from "../pages/Policy.jsx";
import TermsOfService from "../pages/TermsOfService.jsx";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorFallback />,
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
    path: "/help",
    element: <HelpSupport />,
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
    path: "/courses",
    element: (
      <ProtectedLayout>
        <Courses />
      </ProtectedLayout>
    ),
  },
  {
    path: "/enrolled-courses",
    element: (
      <ProtectedLayout>
        <EnrolledCourses />
      </ProtectedLayout>
    ),
  },
  {
    path: "/my-certificates",
    element: (
      <ProtectedLayout>
        <MyCertificates />
      </ProtectedLayout>
    ),
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
    path: "/admin",
    element: (
      <ProtectedAdminLayout>
        <AdminDashboard />
      </ProtectedAdminLayout>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: "/learn/:courseId",
    element: (
      <ProtectedLayout>
        <CoursesInterface />
      </ProtectedLayout>
    ),
  },
  {
    path: "/pdf-learning",
    element: (
      <ProtectedLayout>
        <PdfInteraction />
      </ProtectedLayout>
    ),
  },
  {
    path: "/video-learning",
    element: (
      <ProtectedLayout>
        <VideoInteraction />
      </ProtectedLayout>
    ),
    errorElement: <ErrorFallback />,
  },
  // Alias to support previous navigate(`/video-interaction?...`)
  {
    path: "/video-interaction",
    element: (
      <ProtectedLayout>
        <VideoInteraction />
      </ProtectedLayout>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: "/learn/video",
    element: (
      <ProtectedLayout>
        <VideoInteraction />
      </ProtectedLayout>
    ),
    errorElement: <ErrorFallback />,
  },
  {
    path: "/learn/pdf",
    element: (
      <ProtectedLayout>
        <PdfInteraction />
      </ProtectedLayout>
    ),
  },
  {
    path: "/demo-courses",
    element: <CoursesInterface />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
]);

export default AppRouter;
