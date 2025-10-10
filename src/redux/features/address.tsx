import { createSlice } from '@reduxjs/toolkit'

export const AddressSlice = createSlice({
  name: 'address',
  initialState: {
    city: null,
    districts: null,
    ward: null
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
    },
    clearCity: (state) => {
      state.city = null
    },
    setDistricts: (state, action) => {
      state.districts = action.payload;
    },
    clearDistricts: (state) => {
      state.districts = null
    },
    setWard: (state, action) => {
      state.ward = action.payload;
    },
    clearWard: (state) => {
      state.ward = null
    },
  },
})

// Action creators are generated for each case reducer function
export const {setCity,
  clearCity,
  setDistricts,
  clearDistricts,
  setWard,
  clearWard} = AddressSlice.actions

export default AddressSlice.reducer;
