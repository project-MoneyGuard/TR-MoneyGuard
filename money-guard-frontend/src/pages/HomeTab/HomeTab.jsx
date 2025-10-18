import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchCategories, deleteTransactionAPI } from '../../redux/finance/operations';
import { ThreeDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import css from './HomeTab.module.css';
const HomeTab = () => {
  const dispatch = useDispatch();
  const { transactions, categories, isLoading, error } = useSelector(
    (state) => state.finance
  );
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchTransactions()).unwrap();
        await dispatch(fetchCategories()).unwrap();
      } catch (err) {
        toast.error('Failed to load data');
      }
    };
    loadData();
  }, [dispatch]);
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTransactionAPI(id)).unwrap();
      toast.success('Transaction deleted successfully');
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };
  if (isLoading) {
    return (
      <div className={css.loaderContainer}>
        <ThreeDots color="#FFC727" height={80} width={80} />
      </div>
    );
  }
  if (error) {
    return <div className={css.error}>Error: {error}</div>;
  }
  return (
    <div className={css.homeTabContainer}>
      <div className={css.transactionsTable}>
        <div className={css.tableHeader}>
          <div className={css.headerCell}>Date</div>
          <div className={css.headerCell}>Type</div>
          <div className={css.headerCell}>Category</div>
          <div className={css.headerCell}>Comment</div>
          <div className={css.headerCell}>Sum</div>
          <div className={css.headerCell}></div>
        </div>
        <div className={css.tableBody}>
          {transactions.length === 0 ? (
            <div className={css.noTransactions}>No transactions yet</div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className={css.tableRow}>
                <div className={css.cell}>{formatDate(transaction.transactionDate)}</div>
                <div className={css.cell}>
                  <span className={css.typeSymbol}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                  </span>
                </div>
                <div className={css.cell}>
                  {getCategoryName(transaction.categoryId)}
                </div>
                <div className={css.cell}>{transaction.comment || '-'}</div>
                <div
                  className={`${css.cell} ${
                    transaction.type === 'INCOME' ? css.incomeAmount : css.expenseAmount
                  }`}
                >
                  {transaction.amount.toFixed(2)}
                </div>
                <div className={css.cell}>
                  <button
                    className={css.deleteBtn}
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default HomeTab;