import React, { useState, useEffect } from "react";
import Select from "react-select";
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

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
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
          <Select
            id='month-select'
            value={months.find((month) => month.value === selectedMonth)}
            onChange={handleMonthChange}
            options={months}
            isDisabled={isLoading}
            placeholder="Ay Seçin"
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

          <label htmlFor='year-select'>Yıl:</label>
          <Select
            id='year-select'
            value={years.find((year) => year === selectedYear)}
            onChange={handleYearChange}
            options={years.map((year) => ({ value: year, label: year }))}
            isDisabled={isLoading}
            placeholder="Yıl Seçin"
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

      <div className='statistics-content'>{renderContent()}</div>
    </div>
  );
};

export default StatisticsDashboard;
