import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from "../Loader/Loader.jsx";
import PublicRoute from "../PublicRoute/PublicRoute.jsx";
import PrivateRoute from "../PrivateRoute/PrivateRoute.jsx";

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage'));
const RegistrationPage = lazy(() => import('../../pages/RegistrationPage/RegistrationPage'));
const DashboardPage = lazy(() => import('../../pages/DashboardPage/DashboardPage'));

const AppRouter = () => {
  const isLoggedIn = true;
  const isLoading = false;

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        {isLoading && <Loader />}
        
        <Routes>
          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <RegistrationPage />
              </PublicRoute>
            }
          />
          
          <Route
            path="/login"
            element={
              <PublicRoute isLoggedIn={isLoggedIn}>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;