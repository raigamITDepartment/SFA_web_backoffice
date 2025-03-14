import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/UserAction";
import { RootState } from "../store";

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
