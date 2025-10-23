import React, { useState, useEffect } from "react";
import CurrencyGraph from "../CurrencyGraph/CurrencyGraph";
import styles from "./Currency.module.css";

const MONOBANK_API_URL = "https://api.monobank.ua/bank/currency";
const CACHE_DURATION_MS = 60 * 60 * 1000;

const CURRENCY_CODES = {
  840: "USD",
  978: "EUR",
  980: "UAH",
};

const getCurrencyCodeString = (numericCode) => {
  return CURRENCY_CODES[numericCode] || numericCode;
};

const Currency = () => {
  const [rates, setRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndCacheRates = async () => {
      const currentTime = new Date().getTime();

      try {
        const cachedRatesJSON = localStorage.getItem("currencyRates");
        const cachedTimestamp = localStorage.getItem("currencyRatesTimestamp");

        if (cachedRatesJSON && cachedTimestamp) {
          const timeElapsed = currentTime - Number(cachedTimestamp);

          if (timeElapsed < CACHE_DURATION_MS) {
            setRates(JSON.parse(cachedRatesJSON));
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read cache:", e);
        localStorage.removeItem("currencyRates");
        localStorage.removeItem("currencyRatesTimestamp");
      }

      try {
        const response = await fetch(MONOBANK_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const filteredRates = data.filter(
          (rate) =>
            (rate.currencyCodeA === 840 && rate.currencyCodeB === 980) ||
            (rate.currencyCodeA === 978 && rate.currencyCodeB === 980)
        );

        localStorage.setItem("currencyRates", JSON.stringify(filteredRates));
        localStorage.setItem("currencyRatesTimestamp", currentTime.toString());
        setRates(filteredRates);
      } catch (e) {
        console.error("Failed to fetch currency rates:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCacheRates();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading currency data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error fetching data: {error}</div>;
  }

  const usdRateData = rates.find((rate) => rate.currencyCodeA === 840);
  const eurRateData = rates.find((rate) => rate.currencyCodeA === 978);

  const graphDataForChart = [
    usdRateData?.rateBuy || 0,
    eurRateData?.rateBuy || 0,
  ];

  const graphLabelsForChart = ["USD Alış", "EUR Alış"];

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th>Currency</th>
            <th>Purchase</th>
            <th>Sale</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.currencyCodeA} className={styles.dataRow}>
              <td>{getCurrencyCodeString(rate.currencyCodeA)}</td>
              <td>{rate.rateBuy?.toFixed(2) || "N/A"}</td>
              <td>{rate.rateSell?.toFixed(2) || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.graphContainer}>
        <CurrencyGraph
          graphData={graphDataForChart}
          graphLabels={graphLabelsForChart}
        />
      </div>
    </div>
  );
};

export default Currency;
