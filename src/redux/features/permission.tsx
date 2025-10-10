import { createSlice } from '@reduxjs/toolkit'

export const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    permissionCate: [],
    permissionTool: [],
  },
  reducers: {
    setPermission: (state, action) => {
      state.permissionCate = action.payload.permissionCate;
      state.permissionTool = action.payload.permissionTool;
    },
    clearPermission: (state) => {
      state.permissionCate = [];
      state.permissionTool = [];
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPermission, clearPermission } = permissionSlice.actions

export default permissionSlice.reducer;