import { createSlice } from '@reduxjs/toolkit'

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    list: null
  },
  reducers: {
    setListEmployee: (state, action) => {
      state.list = action.payload;
    },
    clearListEmployee: (state) => {
      state.list = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setListEmployee, clearListEmployee } = employeeSlice.actions

export default employeeSlice.reducer;