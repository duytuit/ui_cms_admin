import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    ServiceCategory: null,
    ServiceCategoryChiHo: null,
    IncomeExpense: null
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
    }
  },
})

// Action creators are generated for each case reducer function
export const {setServiceCategory,
  clearServiceCategory,
  setIncomeExpense,
  clearIncomeExpense,
  setServiceCategoryChiHo,
  clearServiceCategoryChiHo
} = categorySlice.actions

export default categorySlice.reducer;
