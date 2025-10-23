import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import styles from './Currency.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Currency = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const CACHE_KEY = 'currency_rates';
  const CACHE_DURATION = 60 * 60 * 1000; 

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  const generateChartData = (currentRates) => {
  if (!currentRates || currentRates.length === 0) {
    
    return {
      labels: ['', 'USD', '', 'EUR', ''],
      datasets: [
        {
          label: 'Purchase',
          data: [27.45, 27.55, 27.65, 27.60, 27.70],
          borderColor: '#FF868D',
          backgroundColor: 'transparent',
          borderWidth: 4,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: 'rgba(74, 86, 226, 1)',
          pointBorderColor: '#FF868D',
          pointBorderWidth: 3,
          pointRadius: [0, 8, 0, 8, 0],
          pointHoverRadius: 10,
        },
        {
          label: 'Sale',
          data: [27.55, 27.65, 27.75, 27.70, 27.80],
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(57, 0, 150, 0.3)',
          borderWidth: 0,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        }
      ]
    };
  }

  const usdBuy = parseFloat(currentRates.find(r => r.currency === 'USD')?.buy || 27.55);
  const eurBuy = parseFloat(currentRates.find(r => r.currency === 'EUR')?.buy || 30.00);
  const usdSell = parseFloat(currentRates.find(r => r.currency === 'USD')?.sell || 27.65);
  const eurSell = parseFloat(currentRates.find(r => r.currency === 'EUR')?.sell || 30.10);
  
  
  const purchaseData = [
    usdBuy - 0.10, 
    usdBuy,         
    (usdBuy + eurBuy) / 2 + 0.05, 
    eurBuy,         
    eurBuy + 0.10   
  ];
  
  const saleData = [
    usdSell - 0.10, 
    usdSell,         
    (usdSell + eurSell) / 2 + 0.05, 
    eurSell,         
    eurSell + 0.10   
  ];
  
  return {
    labels: ['', 'USD', '', 'EUR', ''],
    datasets: [
      {
        label: 'Purchase',
        data: purchaseData,
        borderColor: '#FF868D',
        backgroundColor: 'transparent',
        borderWidth: 4,
        fill: false,
        tension: 0.4, 
        pointBackgroundColor: 'rgba(74, 86, 226, 1)',
        pointBorderColor: '#FF868D',
        pointBorderWidth: 3,
        pointRadius: [0, 8, 0, 8, 0], 
        pointHoverRadius: 10,
      },
      {
        label: 'Sale',
        data: saleData,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(57, 0, 150, 0.3)',
        borderWidth: 0,
        fill: true,
        tension: 0.4, 
        pointRadius: 0,
        pointHoverRadius: 0,
      }
    ]
  };
};

  const fetchCurrencyRates = async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          console.log('Using cached rates');
          setRates(cachedRates);
          setLoading(false);
          return;
        }
      }

      console.log('Fetching from API');
      const response = await fetch('https://api.monobank.ua/bank/currency');
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch currency rates: ${response.status}`);
      }
      
      const data = await response.json();
      
      const filteredRates = data
        .filter(rate => 
          (rate.currencyCodeA === 840 || rate.currencyCodeA === 978) && 
          rate.currencyCodeB === 980
        )
        .map(rate => ({
          currency: rate.currencyCodeA === 840 ? 'USD' : 'EUR',
          buy: rate.rateBuy?.toFixed(2) || 'N/A',
          sell: rate.rateSell?.toFixed(2) || 'N/A',
        }));

      console.log('Fetched rates:', filteredRates);

      const cacheData = {
        rates: filteredRates,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      
      setRates(filteredRates);
      setLoading(false);
      
    } catch (err) {
      console.error('Error:', err);
      
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData && err.message.includes('Rate limit')) {
        const { rates: cachedRates } = JSON.parse(cachedData);
        setRates(cachedRates);
        setError('Live rates unavailable. Showing cached data.');
      } else {
        setError(err.message);
      }
      
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#FF868D',
        borderWidth: 2,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        },
        min: function(context) {
          const values = context.chart.data.datasets.flatMap(dataset => dataset.data);
          const minValue = Math.min(...values);
          return minValue - 0.1;
        },
        max: function(context) {
          const values = context.chart.data.datasets.flatMap(dataset => dataset.data);
          const maxValue = Math.max(...values);
          return maxValue + 0.1;
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 10,
        hoverBorderWidth: 3,
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading currency rates...</p>
      </div>
    );
  }

  if (error && rates.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={fetchCurrencyRates}
        >
          Try Again
        </button>
      </div>
    );
  }

  const chartData = generateChartData(rates);

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.warning}>
          {error}
        </div>
      )}
      
      <div className={styles.tableSection}>
        <table className={styles.currencyTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Currency</th>
              <th className={styles.tableHeader}>Purchase</th>
              <th className={styles.tableHeader}>Sale</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{rate.currency}</td>
                <td className={styles.tableCell}>{rate.buy}</td>
                <td className={styles.tableCell}>{rate.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartWrapper}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Currency;