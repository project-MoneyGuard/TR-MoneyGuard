import React, { useState, useEffect } from "react";
import "./Currency.css";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

export default function Currency() {
  const [rates, setRates] = useState([
    { currency: "USD", buy: 0, sell: 0 },
    { currency: "EUR", buy: 0, sell: 0 },
  ]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const setCurrencyData = (usdData, eurData) => {
    const newRates = [
      { currency: "USD", buy: usdData.rateBuy, sell: usdData.rateSell },
      { currency: "EUR", buy: eurData.rateBuy, sell: eurData.rateSell },
    ];
    setRates(newRates);

    const labels = ["USD Buy", "USD Sell", "EUR Buy", "EUR Sell"];
    const values = [
      usdData.rateBuy,
      usdData.rateSell,
      eurData.rateBuy,
      eurData.rateSell,
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: "Exchange Rates",
          data: values,
          borderColor: "var(--color-error)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, "rgba(255,138,212,0.4)");
            gradient.addColorStop(1, "rgba(60,0,120,0.2)");
            return gradient;
          },
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: "#ffb3e6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    });

    const cacheData = {
      rates: newRates,
      timestamp: Date.now(),
    };
    localStorage.setItem("currencyCache", JSON.stringify(cacheData));
  };

  const fetchRates = async () => {
    const cachedDataString = localStorage.getItem("currencyCache");
    if (cachedDataString) {
      const cachedData = JSON.parse(cachedDataString);
      const cacheTimestamp = cachedData.timestamp;
      const oneHour = 60 * 60 * 1000;

      if (Date.now() - cacheTimestamp < oneHour) {
        const usdData = cachedData.rates.find((r) => r.currency === "USD");
        const eurData = cachedData.rates.find((r) => r.currency === "EUR");
        setCurrencyData(
          { rateBuy: usdData.buy, rateSell: usdData.sell },
          { rateBuy: eurData.buy, rateSell: eurData.sell }
        );
        return;
      }
    }

    try {
      const response = await axios.get("https://api.monobank.ua/bank/currency");
      const data = response.data;
      const usd = data.find(
        (i) => i.currencyCodeA === 840 && i.currencyCodeB === 980
      );
      const eur = data.find(
        (i) => i.currencyCodeA === 978 && i.currencyCodeB === 980
      );

      if (usd && eur) {
        setCurrencyData(usd, eur);
      }
    } catch (err) {
      console.error("Currency fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed.y.toFixed(2)}`,
        },
      },
      datalabels: {
        align: "top",
        color: "var(--color-white)",
        font: {
          weight: "bold",
        },
        formatter: (value) => {
          return value.toFixed(2);
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  return (
    <div className="currency-box">
      <div className="currency-table-wrap">
        <div className="currency-table-header">
          <div className="currency-header-cell">Currency</div>
          <div className="currency-header-cell">Buy</div>
          <div className="currency-header-cell">Sell</div>
        </div>
        {rates.map((r, i) => (
          <div key={i} className="currency-table-row">
            <div className="currency-name">{r.currency}</div>
            <div className="currency-rate">{r.buy.toFixed(2)}</div>
            <div className="currency-rate">{r.sell.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="currency-chart-wrap">
        <Line data={chartData} options={chartOptions} />
        <div className="currency-chart-shadow"></div>
      </div>
    </div>
  );
}
