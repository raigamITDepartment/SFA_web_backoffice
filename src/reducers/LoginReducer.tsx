import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/UserAction";
import { RootState } from "../store";

<<<<<<< HEAD
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
=======
export const useSignUpState = () => {
  const dispatch = useDispatch();

  // Get Redux state (if required for error/success handling)
  const loginState = useSelector((state: RootState) => state.login);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
>>>>>>> 59d13b453f863c8db598e07dccbbc9d21f529e05

    try {
      setError("");
      setSuccess("");

      // Dispatch loginUser via Redux
      await dispatch(loginUser(formData) as any);
      setSuccess("Sign-up successful!");

      // Clear form data
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err: any) {
      setError("An error occurred during sign-up.");
    }
  };

  return {
    formData,
    error: error || loginState.error,
    success: success || loginState.success,
    handleChange,
    handleSubmit,
  };
};
