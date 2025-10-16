import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  totalBalance: 0,
  income: 0,
  expenses: 0,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.income = action.payload
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      state.expenses = action.payload
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      state.totalBalance = state.income - state.expenses;
    },
    addTransaction: (state, action) => {
      const newTransaction = action.payload;
      state.transactions.unshift(newTransaction);
      
      if (newTransaction.type === 'income') {
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
        
        if (oldTransaction.type === 'income') {
          state.income -= oldTransaction.amount;
        } else {
          state.expenses -= oldTransaction.amount;
        }
        
        state.transactions[index] = { ...oldTransaction, ...updatedTransaction };
        
        if (updatedTransaction.type === 'income') {
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
        
        if (transaction.type === 'income') {
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
      state.totalBalance = 0;
      state.income = 0;
      state.expenses = 0;
    },
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
