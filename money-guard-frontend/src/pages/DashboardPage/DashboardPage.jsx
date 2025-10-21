import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Navigation from "../../components/Navigation/Navigation";
import css from "./DashboardPage.module.css";
import Balance from "../../components/Balance/Balance";
import ButtonAddTransactions from "../../components/ButtonAddTransactions/ButtonAddTransactions";
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
          <Navigation />
          <Balance className={css.balance}/>
        </div>
        <div className={css.content}>
          <Outlet />
          
          <ButtonAddTransactions
            name="+"
            className={css.addTransactionButton}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
