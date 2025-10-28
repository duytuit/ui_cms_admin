import { createSlice } from '@reduxjs/toolkit'

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
      state.employeeInfo = action.payload;
      localStorage.setItem('employeeInfo', JSON.stringify(action.payload))
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