import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import css from "./DashboardPage.module.css";
import Balance from "../../components/Balance/Balance";
import Currency from '../../components/Currency/Currency';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTransactions } from "../../redux/finance/operations";

const DashboardPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);
  return (
    <>
      <Header />
      <div className={css.dasboardContainer}>
        <div className={css.sidebar}>
          <div className={css.section1}>
            <Navigation />
            <Balance className={css.balance}/>
          </div>
          <div className={css.section2}>
            <Currency />
          </div>
        </div>
        <div className={css.content}>
          <Outlet />
          
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
