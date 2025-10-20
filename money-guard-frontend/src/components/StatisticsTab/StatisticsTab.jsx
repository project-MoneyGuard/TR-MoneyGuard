// src/components/StatisticsTab/StatisticsTab.jsx
import { useSelector } from 'react-redux';
import Chart from '../Chart/Chart';
const StatisticsTab = () => {
  // Redux'tan verileri çek
  const transactions = useSelector(state => state.finance.transactions);
  const categories = useSelector(state => state.finance.categories);
  const expenses = useSelector(state => state.finance.expenses);
  // Kategorilere göre harcamaları grupla
  const getCategoryStatistics = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
    
    const categoryTotals = {};
    
    expenseTransactions.forEach(transaction => {
      const categoryId = transaction.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += transaction.amount;
    });
    
    return categoryTotals;
  };
  const categoryTotals = getCategoryStatistics();
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Sol taraf - Chart */}
      <div>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Statistics</h2>
        <Chart transactions={transactions} categories={categories} />
      </div>
      {/* Sağ taraf - Kategori Listesi */}
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>Category</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((category, index) => {
            const total = categoryTotals[category.id] || 0;
            const colors = [
              '#FED057', '#FFD8D0', '#FD9498', '#C5BAFF',
              '#6E78E8', '#4A56E2', '#81E1FF', '#24CCA7', '#00AD84'
            ];
            
            return (
              <li 
                key={category.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  marginBottom: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: colors[index % colors.length],
                      borderRadius: '2px'
                    }}
                  />
                  <span style={{ color: '#fff' }}>{category.name}</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  {total.toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '15px 10px',
          borderTop: '2px solid rgba(255,255,255,0.2)',
          marginTop: '10px'
        }}>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>Expenses:</span>
          <span style={{ color: '#FF6596', fontWeight: 'bold', fontSize: '18px' }}>
            {expenses.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTab;
