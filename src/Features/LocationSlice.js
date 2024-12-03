import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: localStorage.getItem("location") || "Location", 
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
      localStorage.setItem("location", action.payload); 
    },
    clearLocation: (state) => {
      state.location = "Location"; 
      localStorage.removeItem("location"); 
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;

export const selectLocation = (state) => state.location.location;

export default locationSlice.reducer;
