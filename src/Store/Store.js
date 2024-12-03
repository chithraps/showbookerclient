import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlices";
import adminReducer from "../Features/AdminSlice";
import theaterAdminReducer from "../Features/TheaterAdminSlice";
import locationReducer from "../Features/LocationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    theaterAdmin: theaterAdminReducer,
    location: locationReducer,
  },
});
