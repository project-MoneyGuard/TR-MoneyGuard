import Currency from "../Currency/Currency";
import styles from "./CurrencyTab.module.css";

const CurrencyTab = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}></h2>
      <Currency />
    </div>
  );
};

export default CurrencyTab;
