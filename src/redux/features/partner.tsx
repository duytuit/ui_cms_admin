import { createSlice } from '@reduxjs/toolkit'

export const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    vendor: null,
    customer: null
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
    }
  },
})

// Action creators are generated for each case reducer function
export const {setVendor,
  clearVendor,
  setCustomer,
  clearCustomer} = partnerSlice.actions

export default partnerSlice.reducer;
