import { createSlice } from '@reduxjs/toolkit'

export const fileContractSlice = createSlice({
  name: 'fileContract',
  initialState: {
    list: null,
    listSelect:null
  },
  reducers: {
    setListFileContract: (state, action) => {
      state.list = action.payload;
    },
    clearListFileContract: (state) => {
      state.list = null;
    },
    setListSelectFileContract: (state, action) => {
      state.listSelect = action.payload;
    },
    clearListSelectFileContract: (state) => {
      state.listSelect = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setListFileContract,clearListFileContract,setListSelectFileContract,clearListSelectFileContract} = fileContractSlice.actions

export default fileContractSlice.reducer;