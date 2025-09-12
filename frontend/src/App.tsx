import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import MainLayout from "./layout/MainLayout";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/notifications",
          element: <NotificationPage />
        },
        {
          path: "/profile/:username",
          element: <ProfilePage />
        },
      ]
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
