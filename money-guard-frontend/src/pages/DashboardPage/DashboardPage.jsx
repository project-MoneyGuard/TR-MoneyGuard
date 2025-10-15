import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Loader from '../../components/Loader/Loader';
const HomeTab = lazy(() => import('../../components/HomeTab/HomeTab'));
const StatisticsTab = lazy(() => import('../../components/StatisticsTab/StatisticsTab'));
const CurrencyTab = lazy(() => import('../../components/CurrencyTab/CurrencyTab'));
const DashboardPage = () => {
  return (
    <div>
      <Header />
      <Navigation />
      <main>
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
  );
};

export default DashboardPage;