import {setUser,setAccessToken,logout} from './UserSlices';

export const loginUser = (user,accessToken) => (dispatch) =>{
  dispatch(setUser(user));
  dispatch(setAccessToken(accessToken))
}

export const logoutUser = () => (dispatch) =>{
    dispatch(logout())
}