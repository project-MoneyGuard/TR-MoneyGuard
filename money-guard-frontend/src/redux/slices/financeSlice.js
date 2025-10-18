import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchTransactions, 
  fetchCategories, 
  addTransactionAPI, 
  deleteTransactionAPI 
} from '../finance/operations';
const initialState = {
  transactions: [],
  categories: [],
  totalBalance: 0,
  income: 0,
  expenses: 0,
  isLoading: false,
  error: null,
};
const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.income = action.payload
        .filter(transaction => transaction.type === 'INCOME')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      state.expenses = action.payload
        .filter(transaction => transaction.type === 'EXPENSE')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      state.totalBalance = state.income - state.expenses;
    },
    addTransaction: (state, action) => {
      const newTransaction = action.payload;
      state.transactions.unshift(newTransaction);
      
      if (newTransaction.type === 'INCOME') {
        state.income += newTransaction.amount;
      } else {
        state.expenses += newTransaction.amount;
      }
      state.totalBalance = state.income - state.expenses;
    },
    updateTransaction: (state, action) => {
      const { id, updatedTransaction } = action.payload;
      const index = state.transactions.findIndex(transaction => transaction.id === id);
      
      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        
        if (oldTransaction.type === 'INCOME') {
          state.income -= oldTransaction.amount;
        } else {
          state.expenses -= oldTransaction.amount;
        }
        
        state.transactions[index] = { ...oldTransaction, ...updatedTransaction };
        
        if (updatedTransaction.type === 'INCOME') {
          state.income += updatedTransaction.amount;
        } else {
          state.expenses += updatedTransaction.amount;
        }
        
        state.totalBalance = state.income - state.expenses;
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      const index = state.transactions.findIndex(transaction => transaction.id === id);
      
      if (index !== -1) {
        const transaction = state.transactions[index];
        
        if (transaction.type === 'INCOME') {
          state.income -= transaction.amount;
        } else {
          state.expenses -= transaction.amount;
        }
        
        state.transactions.splice(index, 1);
        state.totalBalance = state.income - state.expenses;
      }
    },
    clearFinance: (state) => {
      state.transactions = [];
      state.categories = [];
      state.totalBalance = 0;
      state.income = 0;
      state.expenses = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.income = action.payload
          .filter(transaction => transaction.type === 'INCOME')
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        state.expenses = action.payload
          .filter(transaction => transaction.type === 'EXPENSE')
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        state.totalBalance = state.income - state.expenses;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Categories
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
      // Add Transaction
      .addCase(addTransactionAPI.fulfilled, (state, action) => {
        const newTransaction = action.payload;
        state.transactions.unshift(newTransaction);
        
        if (newTransaction.type === 'INCOME') {
          state.income += newTransaction.amount;
        } else {
          state.expenses += newTransaction.amount;
        }
        state.totalBalance = state.income - state.expenses;
      })
      // Delete Transaction
      .addCase(deleteTransactionAPI.fulfilled, (state, action) => {
        const id = action.payload;
        const index = state.transactions.findIndex(transaction => transaction.id === id);
        
        if (index !== -1) {
          const transaction = state.transactions[index];
          
          if (transaction.type === 'INCOME') {
            state.income -= transaction.amount;
          } else {
            state.expenses -= transaction.amount;
          }
          
          state.transactions.splice(index, 1);
          state.totalBalance = state.income - state.expenses;
        }
      });
  },
});
export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearFinance,
} = financeSlice.actions;
export default financeSlice.reducer;