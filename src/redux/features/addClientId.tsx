import { createSlice } from '@reduxjs/toolkit'

export const clientIdSlice = createSlice({
  name: 'clientId',
  initialState: {token: null},
  reducers: {
    setClientId: (state:any, action:any) => {
      state.clientId = action.payload;
    },
    clearClientId: (state:any) => {
      state.clientId = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setClientId, clearClientId } = clientIdSlice.actions

export default clientIdSlice.reducer;
