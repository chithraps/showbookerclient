import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  theaterAdmin: JSON.parse(localStorage.getItem('theaterAdmin')) || null,
  theaterAdminAccessToken: localStorage.getItem('theaterAdminAccessToken') || null
};

console.log("Initial state:", initialState);
const theaterAdminSlice = createSlice({
    name : 'theaterAdmin',
    initialState,
    reducers : {
      setTheaterAdmin : (state,action) =>{
        state.theaterAdmin = action.payload;
        localStorage.setItem('theaterAdmin',JSON.stringify(action.payload))
      },
      setTheaterAdminAccessToken : (state,action) =>{
        state.theaterAdminAccessToken = action.payload;
        localStorage.setItem('theaterAdminAccessToken',action.payload)
      },
      logoutTheaterAdmin : (state) =>{
        state.theaterAdmin = null;
        state.theaterAdminAccessToken = null;
        localStorage.removeItem('theaterAdmin');
        localStorage.removeItem('theaterAdminAccessToken')
      }
    }
});

export const { setTheaterAdmin, setTheaterAdminAccessToken, logoutTheaterAdmin } = theaterAdminSlice.actions;

export const selectTheaterAdmin = (state) => state.theaterAdmin;
export const selectTheaterAdminAccessToken = (state) => state.theaterAdminAccessToken;

export default theaterAdminSlice.reducer;
