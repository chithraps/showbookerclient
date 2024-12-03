import {
  setTheaterAdmin,
  setTheaterAdminAccessToken,
  logoutTheaterAdmin,
} from "./TheaterAdminSlice";

export const loginTM =
  (theaterAdmin, theaterAdminAccessToken) => (dispatch) => {
    dispatch(setTheaterAdmin(theaterAdmin));
    dispatch(setTheaterAdminAccessToken(theaterAdminAccessToken));
  };
export const logoutTM = () => (dispatch) => {
  console.log("logoutTm called")
  dispatch(logoutTheaterAdmin());
};
