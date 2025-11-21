import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    ServiceCategory: null,
    ServiceCategoryChiHo: null,
    IncomeExpense: null,
    Income: null,
    Expense: null,
    Bank:null,
    FundCategory:null
  },
  reducers: {
    setServiceCategory: (state, action) => {
      state.ServiceCategory = action.payload;
    },
    clearServiceCategory: (state) => {
      state.ServiceCategory = null
    },
    setServiceCategoryChiHo: (state, action) => {
      state.ServiceCategoryChiHo = action.payload;
    },
    clearServiceCategoryChiHo: (state) => {
      state.ServiceCategoryChiHo = null
    },
    setIncomeExpense: (state, action) => {
      state.IncomeExpense = action.payload;
    },
    clearIncomeExpense: (state) => {
      state.IncomeExpense = null
    },
    setIncome: (state, action) => {
      state.Income = action.payload;
    },
    clearIncome: (state) => {
      state.Income = null
    },
    setExpense: (state, action) => {
      state.Expense = action.payload;
    },
    clearExpense: (state) => {
      state.Expense = null
    },
    setBank: (state, action) => {
      state.Bank = action.payload;
    },
    clearBank: (state) => {
      state.Bank = null
    },
    setFundCategory: (state, action) => {
      state.FundCategory = action.payload;
    },
    clearFundCategory: (state) => {
      state.FundCategory = null
    },
  },
})

// Action creators are generated for each case reducer function
export const {setServiceCategory,
  clearServiceCategory,
  setIncomeExpense,
  clearIncomeExpense,
  setServiceCategoryChiHo,
  clearServiceCategoryChiHo,
  setBank,
  clearBank,
  setFundCategory,
  clearFundCategory,
  setIncome,
  clearIncome,
  setExpense,
  clearExpense
} = categorySlice.actions

export default categorySlice.reducer;
