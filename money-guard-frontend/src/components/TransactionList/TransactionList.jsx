import { useSelector } from "react-redux";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import styles from "./TransactionsList.module.css";

const TransactionsList = ({ onDelete, isLoading = false }) => {
  const transactions = useSelector(
    (state) => state.transactions.transactions || []
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyMessage}>Henüz işlem bulunmuyor</div>
        <div className={styles.emptySubMessage}>
          İlk işleminizi eklemek için "+" butonuna tıklayın
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>İşlem Geçmişi</h2>
      </div>

      <div className={styles.scrollContainer}>
        {transactions.map((transaction) => (
          <TransactionsItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionsList;
