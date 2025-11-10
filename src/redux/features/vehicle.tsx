import { createSlice } from '@reduxjs/toolkit'

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    list: null
  },
  reducers: {
    setListVehicle: (state, action) => {
      state.list = action.payload;
    },
    clearListVehicle: (state) => {
      state.list = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setListVehicle, clearListVehicle } = vehicleSlice.actions

export default vehicleSlice.reducer;