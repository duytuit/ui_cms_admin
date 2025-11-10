import { createSlice } from '@reduxjs/toolkit'

export const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    vendor: null,
    customer: null,
    list:null
  },
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
    },
    clearVendor: (state) => {
      state.vendor = null
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
  setVendor,
  clearVendor,
  setCustomer,
  clearCustomer,
  setListPartner,
  clearListPartner
} = partnerSlice.actions

export default partnerSlice.reducer;
