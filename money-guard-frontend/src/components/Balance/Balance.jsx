import React from "react";
import { useSelector } from "react-redux";

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
      <div style={{ padding: "10px", textAlign: "left" }}>
        {" "}
        <p style={{ fontSize: "12px", color: "#a5a5a5", marginBottom: "5px" }}>
          Your Balance
        </p>
        <p
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#a5a5a5",
            margin: 0,
          }}
        >
          ...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px", textAlign: "left" }}>
      {" "}
      <p style={{ fontSize: "12px", color: "#a5a5a5", marginBottom: "5px" }}>
        Your Balance
      </p>
      <h2 style={{ fontSize: "30px", fontWeight: "bold", margin: 0 }}>
        ₴ {formattedBalance}
      </h2>
    </div>
  );
};

export default Balance;
