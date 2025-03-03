import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialLoginState = {
    user: {
        data: {
            id: "",
            userName: "",
            email: "",
            token: "",
            UserId: "",
            status: "",
     
        },
        error: "",
        loginType: "",
        isOnboarding:false
    },
    error: false,
    loading: false,
}

const loginSlice = createSlice({
    name: 'login',
    initialState: initialLoginState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setSuccess: (state, { payload }) => {
            state.loading = false;
            state.error = false;
            console.log(payload);
            
            if (payload) {
                // if (payload.token) {
                //     const content: any = jwt_decode(payload.token);
                //     console.log("token content::", content);

                //     state.user.data.id = content.id;
                //     state.user.data.userName = content.userName;
                //     state.user.data.email = content.email;
               
            
                //     state.user.data.token = payload.token;
              
                //     state.user.data.status = payload.status;
 
                } else {
                    state.user.data = {
                        id: "",
                        userName: "",
                       
                        email: "",
                        token: "",
                        UserId: "",
                        status: "",
               
                    };
                    state.user.isOnboarding =false;
                }
                
                state.user.error = payload.error;
                state.user.loginType = payload.loginType;
            }
            
        },
    //     setError: (state, { payload }) => {
    //         state.error = true;
    //         state.user = payload;
    //     }
    // }
})
// export the actions
// export const { setLoading, setSuccess, 
    
//     setError } = loginSlice.actions;

// export the default reducer
export default loginSlice.reducer;
