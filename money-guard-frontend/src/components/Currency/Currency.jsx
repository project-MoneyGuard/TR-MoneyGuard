import { useState, useEffect, useRef } from 'react';
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
  const [purchasePointPositions, setPurchasePointPositions] = useState({ usd: { x: 0, y: 0 }, eur: { x: 0, y: 0 } });
  const [salePointPositions, setSalePointPositions] = useState({ usd: { x: 0, y: 0 }, eur: { x: 0, y: 0 } });
  const [showPurchasePoints, setShowPurchasePoints] = useState(false);
  const [showSalePoints, setShowSalePoints] = useState(false);
  const purchaseChartRef = useRef(null);
  const saleChartRef = useRef(null);
  
  const CACHE_KEY = 'currency_rates';
  const CACHE_DURATION = 60 * 60 * 1000; 

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  useEffect(() => {
    if ((purchaseChartRef.current || saleChartRef.current) && rates.length > 0) {
      const timer = setTimeout(() => {
        updatePointPositions();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [rates]);

  const updatePointPositions = () => {
    if (purchaseChartRef.current) {
      const chart = purchaseChartRef.current;
      try {
        const meta = chart.getDatasetMeta(0);
        if (meta && meta.data.length >= 4) {
          const usdPoint = meta.data[1];
          const eurPoint = meta.data[3];
          
          if (usdPoint && eurPoint) {
            setPurchasePointPositions({
              usd: { x: usdPoint.x, y: usdPoint.y },
              eur: { x: eurPoint.x, y: eurPoint.y }
            });
          }
        }
      } catch (error) {
        console.log('Error getting purchase point positions:', error);
      }
    }

    if (saleChartRef.current) {
      const chart = saleChartRef.current;
      try {
        const meta = chart.getDatasetMeta(0);
        if (meta && meta.data.length >= 4) {
          const usdPoint = meta.data[1];
          const eurPoint = meta.data[3];
          
          if (usdPoint && eurPoint) {
            setSalePointPositions({
              usd: { x: usdPoint.x, y: usdPoint.y },
              eur: { x: eurPoint.x, y: eurPoint.y }
            });
          }
        }
      } catch (error) {
        console.log('Error getting sale point positions:', error);
      }
    }
  };

  const generatePurchaseChartData = (currentRates) => {
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
            pointRadius: showPurchasePoints ? [0, 8, 0, 8, 0] : [0, 0, 0, 0, 0],
            pointHoverRadius: 10,
          }
        ]
      };
    }

    const usdBuy = parseFloat(currentRates.find(r => r.currency === 'USD')?.buy || 27.55);
    const eurBuy = parseFloat(currentRates.find(r => r.currency === 'EUR')?.buy || 30.00);
    
    const purchaseData = [
      usdBuy - 0.10,
      usdBuy,
      (usdBuy + eurBuy) / 2 + 0.05,
      eurBuy,
      eurBuy + 0.10
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
          pointRadius: showPurchasePoints ? [0, 8, 0, 8, 0] : [0, 0, 0, 0, 0],
          pointHoverRadius: 10,
        }
      ]
    };
  };

  const generateSaleChartData = (currentRates) => {
    if (!currentRates || currentRates.length === 0) {
      return {
        labels: ['', 'USD', '', 'EUR', ''],
        datasets: [
          {
            label: 'Sale',
            data: [27.35, 27.45, 27.55, 27.50, 27.60],
            borderColor: 'rgba(255, 255, 255, 0)',
            backgroundColor: 'rgba(57, 0, 150, 0.3)',
            borderWidth: 0,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(74, 86, 226, 1)',
            pointBorderColor: '#4A56E2',
            pointBorderWidth: 3,
            pointRadius: showSalePoints ? [0, 8, 0, 8, 0] : [0, 0, 0, 0, 0],
            pointHoverRadius: 10,
          }
        ]
      };
    }

    const usdSell = parseFloat(currentRates.find(r => r.currency === 'USD')?.sell || 27.45);
    const eurSell = parseFloat(currentRates.find(r => r.currency === 'EUR')?.sell || 29.90);
    
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
          label: 'Sale',
          data: saleData,
          borderColor: 'rgba(255, 255, 255, 0)',
          backgroundColor: 'rgba(57, 0, 150, 0.3)',
          borderWidth: 0,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(74, 86, 226, 1)',
          pointBorderColor: '#4A56E2',
          pointBorderWidth: 3,
          pointRadius: showSalePoints ? [0, 8, 0, 8, 0] : [0, 0, 0, 0, 0],
          pointHoverRadius: 10,
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

  const purchaseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
          const values = context.chart.data.datasets[0].data;
          const minValue = Math.min(...values);
          return minValue - 0.3;
        },
        max: function(context) {
          const values = context.chart.data.datasets[0].data;
          const maxValue = Math.max(...values);
          return maxValue + 0.3;
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 10,
        hoverBorderWidth: 3,
      },
      line: {
        tension: 0.4
      }
    },
    layout: {
      padding: {
        top: 40,
        bottom: 40,
        left: 20,
        right: 20
      }
    },
    animation: {
      onComplete: updatePointPositions
    }
  };

  const saleChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
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
          const values = context.chart.data.datasets[0].data;
          const minValue = Math.min(...values);
          return minValue - 0.1;
        },
        max: function(context) {
          const values = context.chart.data.datasets[0].data;
          const maxValue = Math.max(...values);
          return maxValue + 0.3;
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 10,
        hoverBorderWidth: 3,
      },
      line: {
        tension: 0.4
      }
    },
    layout: {
      padding: {
        top: 40,
        bottom: 0,
        left: 20,
        right: 20
      }
    },
    animation: {
      onComplete: updatePointPositions
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

  const purchaseChartData = generatePurchaseChartData(rates);
  const saleChartData = generateSaleChartData(rates);

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.warning}>
          {error}
        </div>
      )}
      
      <div className={styles.tableSection}>
        <table className={styles.currencyTable}>
          <thead className={styles.currencyThead}>
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

      <div 
        className={styles.chartSectionPur}
        onMouseEnter={() => setShowPurchasePoints(true)}
        onMouseLeave={() => setShowPurchasePoints(false)}
      >
        <div className={styles.chartHeader}>
           <div className={styles.purchaseLegend}>
      <div className={styles.legendItem}>
        <div className={styles.legendLine}></div>
        <span>Purchase</span>
         </div>
         </div>
         <div className={styles.saleLegend}>
      <div className={styles.legendItem}>
        <div className={styles.legendArea}></div>
        <span>Sale</span>
      </div>
    </div>
        </div>
        <div className={styles.chartWrapperPur}>
          <Line ref={purchaseChartRef} data={purchaseChartData} options={purchaseChartOptions} />
          
          {showPurchasePoints && (
            <>
              <div 
                className={styles.valueLabel}
                style={{
                  left: purchasePointPositions.usd.x,
                  top: purchasePointPositions.usd.y - 18
                }}
              >
                {rates.find(rate => rate.currency === 'USD')?.buy}
              </div>
              
              <div 
                className={styles.valueLabel}
                style={{
                  left: purchasePointPositions.eur.x,
                  top: purchasePointPositions.eur.y - 18
                }}
              >
                {rates.find(rate => rate.currency === 'EUR')?.buy}
              </div>
            </>
          )}
        </div>
      </div>

      <div 
        className={styles.chartSectionSale}
        onMouseEnter={() => setShowSalePoints(true)}
        onMouseLeave={() => setShowSalePoints(false)}
      >
        <div className={styles.chartWrapperSale}>
          <Line 
            ref={saleChartRef} 
            data={saleChartData} 
            options={saleChartOptions}
          />
          
          {showSalePoints && (
            <>
              <div 
                className={styles.saleValueLabel}
                style={{
                  left: salePointPositions.usd.x,
                  top: salePointPositions.usd.y - 18
                }}
              >
                {rates.find(rate => rate.currency === 'USD')?.sell}
              </div>
              
              <div 
                className={styles.saleValueLabel}
                style={{
                  left: salePointPositions.eur.x,
                  top: salePointPositions.eur.y - 18
                }}
              >
                {rates.find(rate => rate.currency === 'EUR')?.sell}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Currency;