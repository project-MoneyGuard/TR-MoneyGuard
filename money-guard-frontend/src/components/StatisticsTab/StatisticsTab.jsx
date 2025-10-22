// src/components/StatisticsTab/StatisticsTab.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from '../Chart/Chart';
import { fetchStatistics } from '../../redux/auth/statisticsOperations';
import styles from './StatisticsTab.module.css';

const StatisticsTab = () => {
  const dispatch = useDispatch();

  // ✅ BASİT STATE YÖNETİMİ
  const statistics = useSelector(state => state.statistics?.data);
  const isLoading = useSelector(state => state.statistics?.isLoading || false);
  const transactions = useSelector(state => state.finance?.transactions || []);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // ✅ chartKey KALDIRILDI - sadece state
  const [chartKey, setChartKey] = useState(0);

  const handlePeriodChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    dispatch(fetchStatistics({ month, year }));
  };
  
  // ✅ BASİT useEffect
  useEffect(() => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  // ✅ TRANSACTIONS DEĞİŞİNCE YENİLE
  useEffect(() => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
    // ✅ Chart'ı yeniden render etmek için key'i güncelle
    setChartKey(prev => prev + 1);
  }, [dispatch, selectedMonth, selectedYear, transactions.length]);

  // ✅ API'den gelen kategori verilerini işle
  const getCategoryStatisticsFromAPI = () => {
    if (!statistics?.categories || statistics.categories.length === 0) {
      return [];
    }
    
    return statistics.categories
      .filter(category => category && Math.abs(category.total) > 0)
      .map((category, index) => ({
        id: `category-${index}-${category.name}`,
        name: category.name,
        amount: Math.abs(category.total),
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const apiCategories = getCategoryStatisticsFromAPI();

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

  const totalExpensesFromAPI = statistics?.totalExpenses || 0;

  // ✅ SABİT RENK PALETİ
  const categoryColors = [
    '#FED057', '#FFD8D0', '#FD9498', '#C5BAFF',
    '#6E78E8', '#4A56E2', '#81E1FF', '#24CCA7', '#00AD84'
  ];

  // ✅ LOADING DURUMU
  if (isLoading) {
    return <div className={styles.loading}>Loading statistics...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h2 className={styles.title}>Statistics</h2>
        <Chart key={chartKey} categories={apiCategories} />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.periodSelector}>
          <div className={styles.selectGroup}>
            <label>Month:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => handlePeriodChange(parseInt(e.target.value), selectedYear)}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.selectGroup}>
            <label>Year:</label>
            <select 
              value={selectedYear} 
              onChange={(e) => handlePeriodChange(selectedMonth, parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.categoriesContainer}>
          <div className={styles.categoriesTitle}>
            <span>Category</span>
            <span>Sum</span>
          </div>
          
          <ul className={styles.categoriesList}>
            {apiCategories.length > 0 ? (
              apiCategories.map((category, index) => (
                <li key={category.id} className={styles.categoryItem}>
                  <div className={styles.categoryInfo}>
                    <div 
                      className={styles.colorIndicator}
                      style={{ 
                        backgroundColor: categoryColors[index % categoryColors.length],
                        display: 'block'
                      }}
                    />
                    <span className={styles.categoryName}>{category.name}</span>
                  </div>
                  <span className={styles.categoryAmount}>
                    ₴ {category.amount.toFixed(2)}
                  </span>
                </li>
              ))
            ) : (
              <li className={styles.noData}>No expenses</li>
            )}
          </ul>
          
          <div className={styles.expensesTotal}>
            <span>Total Expenses:</span>
            <span>₴ {totalExpensesFromAPI.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;