import { createSlice } from '@reduxjs/toolkit'
import { Helper } from 'utils/helper';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    employeeInfo: null
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.userInfo = null;
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
export const { setUser, clearUser, setEmployeeInfo, clearEmployeeInfo } = userSlice.actions

export default userSlice.reducer;