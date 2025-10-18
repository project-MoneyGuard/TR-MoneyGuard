import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
// Transactions API çağrıları
export const fetchTransactions = createAsyncThunk(
  "finance/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/transactions");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);
export const fetchCategories = createAsyncThunk(
  "finance/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/transaction-categories");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);
export const addTransactionAPI = createAsyncThunk(
  "finance/addTransaction",
  async (transactionData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/transactions", transactionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add transaction"
      );
    }
  }
);
export const deleteTransactionAPI = createAsyncThunk(
  "finance/deleteTransaction",
  async (transactionId, { rejectWithValue }) => {
    try {
      await axios.delete(`/transactions/${transactionId}`);
      return transactionId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete transaction"
      );
    }
  }
);