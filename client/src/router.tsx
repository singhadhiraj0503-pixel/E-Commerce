import { createBrowserRouter } from "react-router-dom";
import Customerlayout from "./components/layout/Customerlayout";
import Home from "./pages/customer/Home";
import PublicOnlyLayout from "./components/auth/PublicOnlyLayout";
import SignInPage from "./pages/auth/Sign-in";
import SignUpPage from "./pages/auth/Sign-up";
import ProtectedLayout from "./components/auth/ProtectedLayout";
import Profile from "./pages/customer/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Customerlayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "sign-in/*",
            element: <SignInPage />,
          },
          {
            path: "sign-up/*",
            element: <SignUpPage />,
          },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);
