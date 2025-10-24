import { createSlice } from '@reduxjs/toolkit'

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employeeInfo: null
  },
  reducers: {
    setEmployee: (state, action) => {
      state.employeeInfo = action.payload;
    },
    clearEmployee: (state) => {
      state.employeeInfo = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setEmployee, clearEmployee } = employeeSlice.actions

export default employeeSlice.reducer;