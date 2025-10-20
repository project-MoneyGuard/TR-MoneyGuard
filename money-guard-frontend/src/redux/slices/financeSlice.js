import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  fetchCategories,
  addTransactionAPI,
  deleteTransactionAPI,
  updateTransactionAPI,
} from "../finance/operations";
const initialState = {
  transactions: [],
  categories: [],
  totalBalance: 0,
  income: 0,
  expenses: 0,
  isLoading: false,
  error: null,
};

const recalculateBalance = (state) => {
  state.income = state.transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  state.expenses = state.transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  state.totalBalance = state.income - state.expenses;
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearFinance: (state) => {
      Object.assign(state, {
        transactions: [],
        categories: [],
        totalBalance: 0,
        income: 0,
        expenses: 0,
        isLoading: false,
        error: null,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        recalculateBalance(state);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addTransactionAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTransactionAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
        recalculateBalance(state);
      })
      .addCase(addTransactionAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTransactionAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTransactionAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        const idToDelete = action.payload;
        state.transactions = state.transactions.filter(
          (t) => t.id !== idToDelete
        );
        recalculateBalance(state);
      })
      .addCase(deleteTransactionAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateTransactionAPI.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTransactionAPI.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(
          (t) => t.id === updatedTransaction.id
        );
        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }
        recalculateBalance(state);
      })
      .addCase(updateTransactionAPI.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFinance } = financeSlice.actions;
export default financeSlice.reducer;
