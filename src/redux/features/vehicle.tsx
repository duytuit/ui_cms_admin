import { createSlice } from '@reduxjs/toolkit'

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    vehicleInfo: null
  },
  reducers: {
    setVehicle: (state, action) => {
      state.vehicleInfo = action.payload;
    },
    clearVehicle: (state) => {
      state.vehicleInfo = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setVehicle, clearVehicle } = vehicleSlice.actions

export default vehicleSlice.reducer;