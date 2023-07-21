import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {user: null},
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUserInfo, clearUser } = userSlice.actions

export default userSlice.reducer;