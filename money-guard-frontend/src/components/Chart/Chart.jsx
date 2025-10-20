// src/components/Chart/Chart.jsx
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
// Chart.js register
ChartJS.register(ArcElement, Tooltip, Legend);
const Chart = ({ transactions, categories }) => {
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
  
  // Kategorileri bul ve data hazırla
  const chartLabels = [];
  const chartData = [];
  const chartColors = [
    '#FED057',
    '#FFD8D0',
    '#FD9498',
    '#C5BAFF',
    '#6E78E8',
    '#4A56E2',
    '#81E1FF',
    '#24CCA7',
    '#00AD84'
  ];
  Object.keys(categoryTotals).forEach((categoryId, index) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      chartLabels.push(category.name);
      chartData.push(categoryTotals[categoryId]);
    }
  });
  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: chartColors.slice(0, chartLabels.length),
        borderWidth: 0,
        cutout: '70%', // Doughnut hole size
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false, // Legend'ı gizle (sağ tarafta liste var)
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ₴ ${value.toFixed(2)}`;
          }
        }
      },
    },
  };
  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <Doughnut data={data} options={options} />
      {/* Ortadaki toplam balance */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
          ₴ {chartData.reduce((a, b) => a + b, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
export default Chart;