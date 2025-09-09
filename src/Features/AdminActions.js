import { setAdmin, setAdminAccessToken, logoutAdmin } from "./AdminSlice";
import { setAccessToken } from "../Components/Utils/adminApi";

export const loginAdmin = (admin, adminAccessToken) => (dispatch) => {
    dispatch(setAdmin(admin));
    dispatch(setAdminAccessToken(adminAccessToken));
    setAccessToken(adminAccessToken)
};

export const logoutSuperAdmin = () => (dispatch) => {
    dispatch(logoutAdmin());
    setAccessToken(null)
};