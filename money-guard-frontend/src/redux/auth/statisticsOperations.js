import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://wallet.b.goit.study/api';

export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async ({ month, year }, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching statistics from API for:', { month, year });

      const state = getState();
      const token = state.user.token;
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.get('/transactions-summary', {
        params: {
          month: month,
          year: year
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);

      const apiData = response.data;
      
      const formattedData = {
        totalIncome: apiData.incomeSummary || 0,
        totalExpenses: Math.abs(apiData.expenseSummary) || 0, 
        periodTotal: apiData.periodTotal || 0,
        categories: apiData.categoriesSummary || [],
        month: apiData.month,
        year: apiData.year
      };
      
      console.log('Formatted Data:', formattedData);
      return formattedData;
      
    } catch (error) {
      console.error('API Error:', error);
      
      let errorMessage = 'Failed to fetch statistics';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error: Could not connect to server';
      } else {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const formatStatisticsData = (apiData) => {
  console.log('Raw API Data:', apiData);
  
  return {
    totalIncome: apiData.incomeSummary || 0,
    totalExpenses: Math.abs(apiData.expenseSummary) || 0,
    periodTotal: apiData.periodTotal || 0,
    categories: Array.isArray(apiData.categoriesSummary) 
      ? apiData.categoriesSummary.map(category => ({
          name: category.name || category.category || 'Unknown',
          amount: category.amount || category.sum || 0,
          color: category.color || getRandomColor()
        }))
      : [],
    month: apiData.month,
    year: apiData.year
  };
};

const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};