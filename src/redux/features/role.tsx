import { createSlice } from '@reduxjs/toolkit'

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: { roles: null },
  reducers: {
    setRoles: (state:any, action) => {
      state.master = action.payload.master;
      state.giamdocsan = action.payload.giamdocsan;
    },
    clearRoles: (state) => {
      state.roles = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRoles, clearRoles } = rolesSlice.actions

export default rolesSlice.reducer;
