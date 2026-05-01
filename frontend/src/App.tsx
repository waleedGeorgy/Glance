import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";

function ProtectedRoute({ children, authUser }: { children: React.ReactNode, authUser: unknown }) {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children, authUser }: { children: React.ReactNode, authUser: unknown }) {
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const { data: authUser, isLoading: isCheckingAuthUser } = useQuery({
    queryKey: ["auth/getCurrentAuthUser"],
    retry: false
  });

  if (isCheckingAuthUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-dots loading-xl" />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute authUser={authUser}>
              <HomePage />
            </ProtectedRoute>
          )
        },
        {
          path: "/notifications",
          element: (
            <ProtectedRoute authUser={authUser}>
              <NotificationPage />
            </ProtectedRoute>
          )
        },
        {
          path: "/profile/:username",
          element: (
            <ProtectedRoute authUser={authUser}>
              <ProfilePage />
            </ProtectedRoute>
          )
        },
      ]
    },
    {
      path: "/signup",
      element: (
        <PublicOnlyRoute authUser={authUser}>
          <SignupPage />
        </PublicOnlyRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicOnlyRoute authUser={authUser}>
          <LoginPage />
        </PublicOnlyRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" reverseOrder={true} />
    </>
  )
}

export default App;