import React from "react";
import { useSelector } from "react-redux";
import css from "./Balance.module.css";
const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return formatted;
};

const Balance = () => {
  const totalBalance = useSelector((state) => state.finance.totalBalance);
  const isLoading = useSelector((state) => state.finance.isLoading);

  const formattedBalance = formatCurrency(totalBalance);

  if (isLoading) {
    return (
      <div className={css.sidebarBalance}>
        {" "}
        <p  className={css.balanceP}>
          Your Balance
        </p>
        <p className={css.balanceFormat} >
          ...
        </p>
      </div>
    );
  }

  return (
    <div className={css.sidebarBalance}>
      {" "}
      <p className={css.balanceP}>
        Your Balance
      </p>
      <h2 className={css.balanceFormat}>
        ₴ {formattedBalance}
      </h2>
    </div>
  );
};

export default Balance;
