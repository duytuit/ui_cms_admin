import { createSlice } from '@reduxjs/toolkit'

export const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    supplier: null,
    customer: null,
    list:null
  },
  reducers: {
    setSupplier: (state, action) => {
      state.supplier = action.payload;
    },
    clearSupplier: (state) => {
      state.supplier = null
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearCustomer: (state) => {
      state.customer = null
    },
    setListPartner: (state, action) => {
      state.list = action.payload;
    },
    clearListPartner: (state) => {
      state.list = null
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setSupplier,
  clearSupplier,
  setCustomer,
  clearCustomer,
  setListPartner,
  clearListPartner
} = partnerSlice.actions

export default partnerSlice.reducer;
