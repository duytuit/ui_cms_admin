import { createSlice } from '@reduxjs/toolkit'

export const fileContractSlice = createSlice({
  name: 'fileContract',
  initialState: {
    fileContractInfo: null
  },
  reducers: {
    setFileContract: (state, action) => {
      state.fileContractInfo = action.payload;
    },
    clearFileContract: (state) => {
      state.fileContractInfo = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setFileContract,clearFileContract} = fileContractSlice.actions

export default fileContractSlice.reducer;