import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import PublicRoute from "../PublicRoute/PublicRoute";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

const LoginPage = lazy(() => import("../LoginForm/LoginForm"));
const RegistrationPage = lazy(() => import("../RegisterForm/RegisterForm"));
const DashboardPage = lazy(() =>
  import("../../pages/DashboardPage/DashboardPage")
);
const HomeTab = lazy(() => import("../HomeTab/HomeTab"));
const StatisticsTab = lazy(() => import("../StatisticsTab/StatisticsTab"));
const CurrencyTab = lazy(() => import("../CurrencyTab/CurrencyTab"));

const AppRouter = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isLoading = useSelector((state) => state.global.isLoading);

  return (
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
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<HomeTab />} />
          <Route path="statistics" element={<StatisticsTab />} />
          <Route path="currency" element={<CurrencyTab />} />

          <Route index element={<HomeTab />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
