import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'token',
  initialState: {token: null},
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload)
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
})

// Action creators are generated for each case reducer function
export const { setToken, clearToken } = authSlice.actions

export default authSlice.reducer;
