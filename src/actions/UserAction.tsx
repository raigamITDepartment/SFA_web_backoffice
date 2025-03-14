import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setFormData, setLoginSuccess, setLoginError } from "../reducers/LoginReducer";
import { userManagementApi } from "../services/axios/Api";

const loginUser = (
  data: any
): ThunkAction<void, RootState, unknown, Action> => {
  return async (dispatch) => {
    try {
      // Optional: Dispatch loading state if required
      dispatch(setFormData(data));

      const url = `/api/auth/user/login`;

      const response = await userManagementApi().post(url, data, {
        headers: { "content-type": "application/json; charset=UTF-8" },
      });

      // Dispatch success action
      dispatch(setLoginSuccess(response.data.payload));
    } catch (error: any) {
      // Dispatch error action
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "An error occurred during login.";
      dispatch(setLoginError(errorMessage));
    }
  };
};

export { loginUser };

