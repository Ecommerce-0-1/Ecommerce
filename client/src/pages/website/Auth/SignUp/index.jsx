import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { getUserCookies } from "../../../../utils/methods";
import { usePublicContext } from "../../../../providers/PublicContextProvider";
import CustomInput from "../../../../components/ui/custom-inputs/CustomInput";
import Label from "../../../../components/ui/custom-inputs/Label";
import ErrorFormik from "../../../../components/ui/ErrorFormik";
import { toast } from "react-toastify";
import FilledButton from "../../../../components/ui/buttons/FilledButton";
import { signUpSchema } from "../../../../utils/forms-schemas";
import { SignUpUser } from "../../../../queries/postQueryFns";

const Signup = () => {
  const [passwordMode, setPasswordMode] = useState(true);
  const { setIsLog } = usePublicContext();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: SignUpUser,
    onSuccess: (data) => {
      const { access_token, role, userID } = data || {};
      Cookies.set("userData", JSON.stringify({ access_token, role, userID }));
      setIsLog(true);

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      toast.success("Successful Sign Up!", { position: "top-right" });
    },
    onError: (error) => {
      toast.error("Sign up failed. Please check your details and try again.", {
        position: "top-right",
      });
    },
  });

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        phone: "",
      },
      validationSchema: signUpSchema,
      onSubmit: onSubmit,
    });

  useEffect(() => {
    const userData = getUserCookies();
    if (userData) {
      setIsLog(true);
      navigate("/");
    }
  }, [setIsLog, navigate]);

  const handlePasswordMode = () => {
    setPasswordMode((prevMode) => !prevMode);
  };

  function onSubmit() {
    if (Object.keys(errors).length === 0) {
      mutation.mutate(values);
    } else {
      console.log("Validation errors preventing submission");
    }
  }

  return (
    <section className="min-h-screen flex items-center bg-white">
      <div className="container mx-auto flex flex-col lg:flex-row md:flex-row items-center justify-between">
        {/* Left - Image */}
        <div className="w-full lg:w-3/5">
          <img
            src="https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"
            alt="Login Image"
            className="w-full object-cover"
          />
        </div>

        {/* Right - Content */}
        <div className="w-full lg:w-2/5 px-16">
          <div>
            <h1 className="text-2xl font-bold">Sign Up to Exclusive</h1>
            <p className="mt-2">Enter your details below</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* name Field */}
            <div className="mb-4">
              <Label text="name" forId="name" />
              <CustomInput
                id="name"
                type="text"
                name="name"
                value={values?.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border-primary3 focus:border-primary2 focus:ring-primary2 w-full rounded-md border-2 px-3 py-2 focus:ring-1"
              />
              <ErrorFormik
                isError={errors?.name && touched?.name}
                error={errors?.name}
                isTouched={touched?.name}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <Label text="Email" forId="email" />
              <CustomInput
                id="email"
                type="text"
                name="email"
                value={values?.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border-primary3 focus:border-primary2 focus:ring-primary2 w-full rounded-md border-2 px-3 py-2 focus:ring-1"
              />
              <ErrorFormik
                isError={errors?.email && touched?.email}
                error={errors?.email}
                isTouched={touched?.email}
              />
            </div>

            {/* Password Field */}
            <div className="relative mb-4">
              <Label text="Password" forId="password" />
              <CustomInput
                id="password"
                type={passwordMode ? "password" : "text"}
                name="password"
                value={values?.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border-primary3 focus:border-primary2 focus:ring-primary2 w-full rounded-md border-2 px-3 py-2 focus:ring-1"
              />
              <ErrorFormik
                isError={errors?.password && touched?.password}
                error={errors?.password}
                isTouched={touched?.password}
              />
              <span
                className="absolute right-[13px] top-[33px] flex items-center cursor-pointer"
                onClick={handlePasswordMode}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {passwordMode ? (
                    <>
                      <path
                        d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  ) : (
                    <path
                      d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </span>
            </div>

            {/* Phone Field */}
            <div className="mb-4">
              <Label text="Phone" forId="phone" />
              <CustomInput
                id="phone"
                type="text"
                name="phone"
                value={values?.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border-primary3 focus:border-primary2 focus:ring-primary2 w-full rounded-md border-2 px-3 py-2 focus:ring-1"
              />
              <ErrorFormik
                isError={errors?.phone && touched?.phone}
                error={errors?.phone}
                isTouched={touched?.phone}
              />
            </div>

            {/* Submit Button */}
            <div className="mb-5 flex flex-col items-center">
              <FilledButton
                text={mutation.isLoading ? "Signing Up..." : "Create Account"}
                icon={<div className="m-1"></div>}
                buttonType="submit"
                isButton={true}
                className="w-full cursor-pointer rounded-md bg-[#DB4444] p-4 text-white transition hover:bg-opacity-80"
                isDisable={mutation?.isLoading}
              />
              <div>
                <p className="mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#DB4444]">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
