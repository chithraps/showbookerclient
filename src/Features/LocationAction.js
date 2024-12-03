import { setLocation, clearLocation } from "./LocationSlice";


export const selectLocation = (location) => (dispatch) => {
    dispatch(setLocation(location));
};


export const resetLocation = () => (dispatch) => {
    dispatch(clearLocation());
};
