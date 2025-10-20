import { createSlice } from '@reduxjs/toolkit';
import { fetchStatistics } from '../auth/statisticsOperations';

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
    period: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }
  },
  reducers: {
    fetchStatisticsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatisticsSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchStatisticsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.data = null;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    clearStatistics: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});


export const {
  fetchStatisticsStart,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  setPeriod,
  clearStatistics,
  clearError
} = statisticsSlice.actions;


export const selectStatistics = (state) => state.statistics.data;
export const selectStatisticsLoading = (state) => state.statistics.isLoading;
export const selectStatisticsError = (state) => state.statistics.error;
export const selectStatisticsPeriod = (state) => state.statistics.period;


export default statisticsSlice.reducer;