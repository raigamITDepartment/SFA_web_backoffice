import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setLoading, setSuccess, setError } from "../reducers/LoginReducer";
// import {
//   setForgetPasswordLoading,
//   setForgetPasswordSuccess,
//   setForgetPasswordError,
// } from "../reducers/ForgetPasswordReducer";
import { userManagementApi } from "../services/axios/Api";
// import {
//   setResetPasswordError,
//   setResetPasswordLoading,
//   setResetPasswordSuccess,
// } from "../reducers/ResetPasswordReducer";

const loginUser = (
  data: any
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: any, getState: any) => {
    dispatch(setLoading());
    let url = `/api/auth/user/login`;
    await userManagementApi()
      .post(url, data, {
        headers: { "content-type": "application/json; charset=UTF-8" },
      })
      .then((response: any) => dispatch(setSuccess(response.data.payload)))
      .catch((err: any) => dispatch(setError(err.response.data)));
  };
};


const loginByToken = (
  data: any
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(setLoading());
    let url = `/api/auth/user/verifyToken`;
    await userManagementApi()
      .post(url, data, {
        headers: { "content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => dispatch(setSuccess(response.data.payload)))
      .catch((err) => dispatch(setError(err.response.data)));
  };
};

const signupUser = (
  data: any
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(setLoading());
    let url = `api/auth/user/save`;
    data.vendorName=data.businessName;
    data.vendorAddress1="selfAddress";
    data.vendorAddress2="selfAddress1";
    data.cityName="selfCity";
    data.stateName="selfState";
    data.postalCode="0000";
   
    
    await userManagementApi()
      .post(url, data, {
        headers: { "content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => dispatch(setSuccess(response.data.payload)))
      .catch((err) => dispatch(setError(err.response.data)));
  };
};



export {
  loginUser,
  //loginByEmail,
  signupUser,
  loginByToken,
  //sendTempPassword,
 // resetPassword,
};
