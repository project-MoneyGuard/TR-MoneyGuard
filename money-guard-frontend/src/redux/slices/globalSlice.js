import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.successMessage = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccessMessage,
  clearError,
  clearSuccessMessage,
  clearMessages,
} = globalSlice.actions;
export default globalSlice.reducer;
