import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from '../Chart/Chart';
import { fetchStatistics } from '../../redux/auth/statisticsOperations';
import styles from './StatisticsTab.module.css';
import { ScaleLoader } from "react-spinners";
import Select from 'react-select';

const StatisticsTab = () => {
  const dispatch = useDispatch();

  const statistics = useSelector(state => state.statistics?.data);
  const isLoading = useSelector(state => state.statistics?.isLoading || false);
  const transactions = useSelector(state => state.finance?.transactions || []);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [chartKey, setChartKey] = useState(0);

  const handlePeriodChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    dispatch(fetchStatistics({ month, year }));
  };

  useEffect(() => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  useEffect(() => {
    dispatch(fetchStatistics({ month: selectedMonth, year: selectedYear }));
    setChartKey(prev => prev + 1);
  }, [dispatch, selectedMonth, selectedYear, transactions.length]);

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
  const totalIncomeFromAPI = statistics?.totalIncome || 0;

  const categoryColors = [
    '#FED057', '#FFD8D0', '#FD9498', '#C5BAFF',
    '#6E78E8', '#4A56E2', '#81E1FF', '#24CCA7', '#00AD84'
  ];

  if (isLoading) {
    return <div className={styles.loaderContainer}>
      <div className={styles.loading} style={{margin: '0 auto' }}>
        <ScaleLoader color="var(--color-yellow)" size={50} className={styles.loaderBox}/>
      </div>
    </div>;
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
            <Select
              id='month-select'
              value={months.find((month) => month.value === selectedMonth)}
              onChange={(selectedOption) => handlePeriodChange(selectedOption.value, selectedYear)}
              options={months}
              isDisabled={isLoading}
              placeholder="Select Month"
              classNamePrefix="custom"
              styles={{
                control: (base, state) => ({
                  ...base,
                  background: "transparent",
                  color: "var(--color-white)",
                  border: "none",
                  borderBottom: state.isFocused
                    ? "1px solid var(--color-yellow)"
                    : "1px solid var(--color-white)",
                  outline: "none",
                  padding: "2px 4px",
                  minHeight: "46px",
                  transition: "all 0.2s ease",
                  width: "100%",
                  "&:focus": {
                    outline: "none",
                    border: "none",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  background:
                    "linear-gradient(0deg, rgba(83, 61, 186, 0.8) 0%, rgba(80, 48, 154, 0.8) 36%, rgba(106, 70, 165, 0.8) 61%, rgba(133, 93, 175, 0.8) 100%)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  padding: "4px 0",
                }),
                option: (base, state) => ({
                  ...base,
                  color: state.isSelected
                    ? "var(--color-pink)"
                    : "var(--color-white)",
                  backgroundColor: state.isFocused
                    ? "rgba(255,255,255,0.1)"
                    : "",
                  cursor: "pointer",
                  padding: "10px 16px",
                  transition: "background 0.15s ease",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "var(--color-muted)",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                  "&:hover": {
                    color: "var(--color-linear-purple)",
                  },
                }),
                indicatorSeparator: () => ({ display: "none" }),
                input: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                }),
              }}
            />
          </div>

          <div className={styles.selectGroup}>
            <Select
              id='year-select'
              value={years.find((year) => year === selectedYear)}
              onChange={(selectedOption) => handlePeriodChange(selectedMonth, selectedOption.value)}
              options={years.map((year) => ({ value: year, label: year }))}
              isDisabled={isLoading}
              placeholder="Select Year"
              classNamePrefix="custom"
              styles={{
                control: (base, state) => ({
                  ...base,
                  background: "transparent",
                  color: "var(--color-white)",
                  border: "none",
                  borderBottom: state.isFocused
                    ? "1px solid var(--color-yellow)"
                    : "1px solid var(--color-white)",
                  outline: "none",
                  padding: "2px 4px",
                  minHeight: "46px",
                  transition: "all 0.2s ease",
                  width: "100%",
                  "&:focus": {
                    outline: "none",
                    border: "none",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  background:
                    "linear-gradient(0deg, rgba(83, 61, 186, 0.8) 0%, rgba(80, 48, 154, 0.8) 36%, rgba(106, 70, 165, 0.8) 61%, rgba(133, 93, 175, 0.8) 100%)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  padding: "4px 0",
                }),
                option: (base, state) => ({
                  ...base,
                  color: state.isSelected
                    ? "var(--color-pink)"
                    : "var(--color-white)",
                  backgroundColor: state.isFocused
                    ? "rgba(255,255,255,0.1)"
                    : "",
                  cursor: "pointer",
                  padding: "10px 16px",
                  transition: "background 0.15s ease",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "var(--color-muted)",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                  "&:hover": {
                    color: "var(--color-linear-purple)",
                  },
                }),
                indicatorSeparator: () => ({ display: "none" }),
                input: (base) => ({
                  ...base,
                  color: "var(--color-white)",
                }),
              }}
            />
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
                        display: 'block',
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

          <div className={styles.incomeExpensesContainer}>
            <div className={styles.incomeExpenseItem}>
              <span className={styles.incomeLabel}>Income:</span>
              <span className={styles.incomeValue}>
                ₴ {totalIncomeFromAPI.toFixed(2)}
              </span>
            </div>
            <div className={styles.incomeExpenseItem}>
              <span className={styles.expenseLabel}>Expenses:</span>
              <span className={styles.expenseValue}>
                ₴ {totalExpensesFromAPI.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;
