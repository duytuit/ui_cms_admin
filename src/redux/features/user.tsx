import { createSlice } from '@reduxjs/toolkit'
import { Helper } from 'utils/helper';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    list: null,
    employeeInfo: null
  },
  reducers: {
    setListUser: (state, action) => {
      state.list = action.payload;
    },
    clearListUser: (state) => {
      state.list = null;
    },
    setEmployeeInfo: (state, action) => {
      const _employeeInfo = Helper.camelToSnake(action.payload);
      state.employeeInfo = _employeeInfo;
      localStorage.setItem('employeeInfo', JSON.stringify(_employeeInfo))
    },
    clearEmployeeInfo: (state) => {
      state.employeeInfo = null;
      localStorage.removeItem('employeeInfo');    
    },
  },
})

// Action creators are generated for each case reducer function
export const { setListUser, clearListUser, setEmployeeInfo, clearEmployeeInfo } = userSlice.actions

export default userSlice.reducer;