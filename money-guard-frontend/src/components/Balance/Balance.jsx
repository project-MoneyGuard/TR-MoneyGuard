import { useSelector } from "react-redux";

const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return formatted.replace(",", ".");
};

const Balance = () => {
  const totalBalance = useSelector((state) => state.finance.totalBalance);

  const formattedBalance = formatCurrency(totalBalance);

  return (
    <div>
      <p>Your Balance</p>
      <h2>
        $ {formattedBalance}
      </h2>
    </div>
  );
};

export default Balance;
