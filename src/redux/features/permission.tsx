import { createSlice } from '@reduxjs/toolkit'

export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    permission: null,
  },
  reducers: {
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    clearPermission: (state) => {
      state.permission = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPermission, clearPermission } = permissionSlice.actions

export default permissionSlice.reducer;