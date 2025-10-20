import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from '../Chart/Chart';
import { fetchStatistics } from '../../redux/auth/statisticsOperations';
import { 
  selectStatistics, 
  selectStatisticsLoading, 
  selectStatisticsError,
  clearStatistics 
} from '../../redux/slices/statisticsSlice';
import styles from './StatisticsTab.module.css';

const StatisticsTab = () => {
  
  const dispatch = useDispatch();

  const statistics = useSelector(selectStatistics);
  const isLoading = useSelector(selectStatisticsLoading);
  const error = useSelector(selectStatisticsError);

  const transactions = useSelector(state => state.finance.transactions);
  const categories = useSelector(state => state.finance.categories);
  const expenses = useSelector(state => state.finance.expenses);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  
 useEffect(() => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  useEffect(() => {
    return () => {
      dispatch(clearStatistics());
    };
  }, [dispatch]);

  const getCategoryStatistics = () => {
    if (!transactions || !categories) return {};
    
    const expenseTransactions = transactions.filter(t => t && t.type === 'EXPENSE');
    const categoryTotals = {};
    
    expenseTransactions.forEach(transaction => {
      if (transaction && transaction.categoryId) {
        const categoryId = transaction.categoryId;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += transaction.amount || 0;
      }
    });
    
    return categoryTotals;
  };

  const categoryTotals = getCategoryStatistics();

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, 
    { value: 3, label: 'March' }, { value: 4, label: 'April' }, 
    { value: 5, label: 'May' }, { value: 6, label: 'June' }, 
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, 
    { value: 9, label: 'September' }, { value: 10, label: 'October' }, 
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  const handleRetry = () => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
  };


  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <h2 className={styles.title}>Statistics</h2>
        <Chart transactions={transactions} categories={categories} />
      </div>
      <div className={styles.apiContainer}>
         <div className={styles.apiSection}>
        <div className={styles.periodSelector}>
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={styles.select}
              disabled={isLoading}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.selectGroup}>
            <label className={styles.selectLabel}>Year:</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.select}
              disabled={isLoading}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        
        {isLoading && <div className={styles.loading}>Loading statistics...</div>}
        {error && (
          <div className={styles.error}>
            Error: {error}
            <button 
              onClick={handleRetry}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        
        {statistics && !isLoading && (
          <div className={styles.apiData}>
            <div className={styles.dataItem}>
              <div className={`${styles.dataValue} ${styles.income}`}>
                ${statistics.totalIncome?.toFixed(2) || '0.00'}
              </div>
              <div className={styles.dataLabel}>Income</div>
            </div>
            <div className={styles.dataItem}>
              <div className={`${styles.dataValue} ${styles.expense}`}>
                ${statistics.totalExpenses?.toFixed(2) || '0.00'}
              </div>
              <div className={styles.dataLabel}>Expenses</div>
            </div>
            <div className={styles.dataItem}>
              <div className={`${styles.dataValue} ${styles.balance} ${
                (statistics.totalIncome - statistics.totalExpenses) >= 0 ? styles.positive : styles.negative
              }`}>
                ${((statistics.totalIncome || 0) - (statistics.totalExpenses || 0)).toFixed(2)}
              </div>
              <div className={styles.dataLabel}>Balance</div>
            </div>
          </div>
        )}
      </div>


      <div className={styles.categoriesContainer}>
        <h3 className={styles.categoriesTitle}>Category</h3>
        <ul className={styles.categoriesList}>
          {categories.map((category, index) => {
            const total = categoryTotals[category.id] || 0;
            const colors = [
              '#FED057', '#FFD8D0', '#FD9498', '#C5BAFF',
              '#6E78E8', '#4A56E2', '#81E1FF', '#24CCA7', '#00AD84'
            ];
            
      
      

      
            return (
              <li key={category.id} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <div 
                    className={styles.colorIndicator}
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className={styles.categoryName}>{category.name}</span>
                </div>
                <span className={styles.categoryAmount}>
                  {total.toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className={styles.expensesTotal}>
          <span className={styles.totalLabel}>Expenses:</span>
          <span className={styles.totalAmount}>
            {expenses.toFixed(2)}
          </span>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default StatisticsTab;
