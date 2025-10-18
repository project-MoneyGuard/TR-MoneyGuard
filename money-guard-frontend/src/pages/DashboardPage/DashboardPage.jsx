import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import css from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <>
      <Header />
      <div className={css.dasboardContainer}>
        <div className={css.sidebar}>
          <Navigation />
        </div>
        <div className={css.content}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;