import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Loader from '../../components/Loader/Loader';
import './DashboardPage.css';
const HomeTab = lazy(() => import('../../components/HomeTab/HomeTab'));
const StatisticsTab = lazy(() => import('../../components/StatisticsTab/StatisticsTab'));
const CurrencyTab = lazy(() => import('../../components/CurrencyTab/CurrencyTab'));
const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <Header />
      
      <div className="dashboard-container">
        <Navigation />
        <main className="dashboard-main">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="home" element={<HomeTab />} />
              <Route path="statistics" element={<StatisticsTab />} />
              <Route path="currency" element={<CurrencyTab />} />
              <Route path="" element={<Navigate to="home" replace />} />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;