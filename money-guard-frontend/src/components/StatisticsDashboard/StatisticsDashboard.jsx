import React, { useState, useEffect } from "react";
import "./StatisticsDashboard.css";

const StatisticsDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const years = [2025, 2024, 2023, 2022];
  const months = [
    { value: 1, label: "Ocak" },
    { value: 2, label: "Şubat" },
    { value: 3, label: "Mart" },
    { value: 4, label: "Nisan" },
    { value: 5, label: "Mayıs" },
    { value: 6, label: "Haziran" },
    { value: 7, label: "Temmuz" },
    { value: 8, label: "Ağustos" },
    { value: 9, label: "Eylül" },
    { value: 10, label: "Ekim" },
    { value: 11, label: "Kasım" },
    { value: 12, label: "Aralık" },
  ];

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);
      setStatisticsData(null);

      try {
        const apiUrl = `/api/statistics/tab?year=${selectedYear}&month=${selectedMonth}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("İstatistik verileri alınırken bir sorun oluştu.");
        }

        const data = await response.json();
        setStatisticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>İstatistikler yükleniyor...</p>;
    }

    if (error) {
      return <p className='error-message'>Hata: {error}</p>;
    }

    if (!statisticsData) {
      return <p>Seçilen dönem için veri bulunamadı.</p>;
    }

    return (
      <>
        <p>
          Seçilen dönem ({months.find((m) => m.value === selectedMonth).label}{" "}
          {selectedYear}) için sonuçlar:
        </p>
        <pre>{JSON.stringify(statisticsData, null, 2)}</pre>
      </>
    );
  };

  return (
    <div className='statistics-dashboard'>
      <div className='dashboard-header'>
        <h2>İstatistik Gösterge Paneli</h2>

        <div className='date-selectors'>
          <label htmlFor='month-select'>Ay:</label>
          <select
            id='month-select'
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={isLoading}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <label htmlFor='year-select'>Yıl:</label>
          <select
            id='year-select'
            value={selectedYear}
            onChange={handleYearChange}
            disabled={isLoading}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='statistics-content'>{renderContent()}</div>
    </div>
  );
};

export default StatisticsDashboard;
