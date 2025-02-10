import * as yup from "yup";

export const LogInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")  
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,.?]).{8,}$/,
      "Invalid password. Password must have 8 characters, with at least 1 number, uppercase, and special character",
    )
    .required("Password is required"),
});

export const signUpSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")  
      .required("Username is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .max(255, "Email must be at most 255 characters")  
      .required("Email is required"),
    password: yup
      .string()
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]{}_\-+=~`|:;"'<>,.?/]).{8,}$/,
        "Password must contain: 8+ characters, 1 uppercase, 1 number, 1 special character"
      )
      .required("Password is required"),
    phone: yup
      .string()
      .matches(
        /^\+?[1-9]\d{1,14}$/, 
        "Phone number must be valid international format (e.g. +1234567890)"
      )
      .required("Phone number is required")
  });
  

