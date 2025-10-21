// src/components/Currency/Currency.jsx
import { useState, useEffect } from 'react';
const Currency = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const CACHE_KEY = 'currency_rates';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)
  useEffect(() => {
    fetchCurrencyRates();
  }, []);
  const fetchCurrencyRates = async () => {
    try {
      // localStorage'dan cache kontrolü
      const cachedData = localStorage.getItem(CACHE_KEY);
      
      if (cachedData) {
        const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        
        // Eğer cache 1 saatten yeniyse, cache'i kullan
        if (now - timestamp < CACHE_DURATION) {
          console.log('Cache kullanılıyor');
          setRates(cachedRates);
          setLoading(false);
          return;
        }
      }
      // Cache yoksa veya eskiyse, API'den çek
      console.log('API\'den veri çekiliyor');
      const response = await fetch('https://api.monobank.ua/bank/currency');
      
      if (!response.ok) {
        throw new Error('Döviz kurları alınamadı');
      }
      const data = await response.json();
      
      // Sadece USD ve EUR kurlarını filtrele (UAH karşısında)
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
      // localStorage'a kaydet
      const cacheData = {
        rates: filteredRates,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setRates(filteredRates);
      setLoading(false);
    } catch (err) {
      console.error('Hata:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Yükleniyor...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>Hata: {error}</p>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Currency</th>
            <th style={styles.headerCell}>Buy</th>
            <th style={styles.headerCell}>Sell</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{rate.currency}</td>
              <td style={styles.cell}>{rate.buy}</td>
              <td style={styles.cell}>{rate.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Kurlar her saat güncellenir
        </p>
      </div>
    </div>
  );
};
const styles = {
  container: {
    backgroundColor: '#4A56E2',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '280px',
    color: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '15px',
  },
  headerRow: {
    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
  },
  headerCell: {
    padding: '10px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
  },
  row: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  cell: {
    padding: '12px 10px',
    fontSize: '16px',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
  },
  error: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#FF6B6B',
  },
  footer: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: '12px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
};
export default Currency;