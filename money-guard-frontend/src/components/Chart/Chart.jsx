import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ transactions, categories }) => {
  console.log('Chart received data:', { transactions, categories });
  
  
  const chartColors = [
    '#FED057', '#FFD8D0', '#FD9498', '#C5BAFF',
    '#6E78E8', '#4A56E2', '#81E1FF', '#24CCA7', '#00AD84'
  ];


  const getCategoryStatistics = () => {
    if (!categories || categories.length === 0) {
      console.log('No categories data');
      return {
        labels: ['No expenses'],
        data: [0], 
        colors: ['#CCCCCC']
      };
    }
    
    console.log('Categories for chart:', categories);
    
    const labels = [];
    const data = [];
    const colors = [];

    categories.forEach((category, index) => {
      if (category && category.amount > 0) {
        labels.push(category.name);
        data.push(category.amount);
        colors.push(chartColors[index % chartColors.length]);
      }
    });

    console.log('Processed chart data:', { labels, data, colors });
    
    if (data.length === 0) {
      return {
        labels: ['No expenses'],
        data: [0], 
        colors: ['#CCCCCC']
      };
    }
    
    return {
      labels,
      data,
      colors
    };
  };

  const chartData = getCategoryStatistics();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartData.colors,
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: chartData.data[0] > 0,
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

  const totalExpenses = chartData.data.reduce((a, b) => a + b, 0);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <Doughnut data={data} options={options} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
          ₴ {totalExpenses.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default Chart;