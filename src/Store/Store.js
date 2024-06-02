import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlices";
import adminReducer from "../Features/AdminSlice";
import theaterAdminReducer from "../Features/TheaterAdminSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    theaterAdmin: theaterAdminReducer,
  },
});