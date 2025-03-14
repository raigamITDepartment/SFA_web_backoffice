<<<<<<< HEAD
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
//import { setLoading, setSuccess, setError } from "../reducers/LoginReducer";

import { userManagementApi } from "../services/axios/Api";
=======
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
>>>>>>> 59d13b453f863c8db598e07dccbbc9d21f529e05

export { loginUser };

<<<<<<< HEAD
// const loginUser = (
//   data: any
// ): ThunkAction<void, RootState, unknown, AnyAction> => {
//   return async (dispatch: any, getState: any) => {
//     dispatch(setLoading());
//     let url = `/api/auth/user/login`;
//     await userManagementApi()
//       .post(url, data, {
//         headers: { "content-type": "application/json; charset=UTF-8" },
//       })
//       .then((response: any) => dispatch(setSuccess(response.data.payload)))
//       .catch((err: any) => dispatch(setError(err.response.data)));
//   };
// };


// const loginByToken = (
//   data: any
// ): ThunkAction<void, RootState, unknown, AnyAction> => {
//   return async (dispatch, getState) => {
//     dispatch(setLoading());
//     let url = `/api/auth/user/verifyToken`;
//     await userManagementApi()
//       .post(url, data, {
//         headers: { "content-type": "application/json; charset=UTF-8" },
//       })
//       .then((response) => dispatch(setSuccess(response.data.payload)))
//       .catch((err) => dispatch(setError(err.response.data)));
//   };
// };





export {
  // loginUser,
  // loginByToken,
 
};
=======
>>>>>>> 59d13b453f863c8db598e07dccbbc9d21f529e05
