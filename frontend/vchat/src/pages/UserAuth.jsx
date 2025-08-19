import React, { useState } from "react";
import CarImg from "../assets/CarImg.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../useApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { saveLogin, removeLogin } from "../store/slice";
import { EyeClosed, Eye } from "lucide-react";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useApi();
  const [isVisible, setIsVisible] = useState(false);

  const initialValues = {
    username: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  };

  const validateSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .trim()
        .matches(/^(?!\s{2,})/, "Username cannot start with spaces")
        .matches(/^(?!_{2,3})/, "Username cannot start with underscores")
        .required("Username is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be atleast 6 characters")
        .matches(/[A-Z]/, "At least one uppercase letter required")
        .matches(/[1-9]/, "At least one number required")
        .matches(/[!@#$%^&*]/, "At least one special character required"),
      ...(isLogin
        ? {}
        : {
            firstName: Yup.string()
            .trim()
            .matches(/^(?!\s{2,})/, "First name cannot start with spaces")
            .matches(/^(?!_{2,3})/, "First name cannot start with underscores")
            .required("First name is required"),
            lastName: Yup.string()
            .trim()
            .matches(/^(?!\s{2,})/, "Last name cannot start with spaces")
            .matches(/^(?!_{2,3})/, "Last name cannot start with underscores")
            .required("Last name is required"),
            password2: Yup.string()
              .oneOf([Yup.ref("password"), null], "Password must match")
              .required("Confirm password is required"),
          }),
    });
  };

  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      if (isLogin) {
        const response = await api.post("users/login/", {
          username: values.username,
          password: values.password,
        });

        if (response.status === 200) {
          dispatch(
            saveLogin({
              access_token: response.data.access,
              refresh_token: response.data.refresh,
              user: response.data.user,
            })
          );

          toast.success("Logged in successfully");
          navigate("/", { replace: true });
        }
      } else {
        const response = await api.post("users/register/", {
          username: values.username,
          password: values.password,
          password2: values.password2,
          first_name: values.firstName,
          last_name: values.lastName,
        });

        if (response.status === 201) {
          toast.success("Account created! You can now login.");
          resetForm();
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.log("Auth error:", error.response?.data || error.message);
      toast.error("Something went wrong");

      const backendErrors = error?.response?.data;

      if (backendErrors) {
        const formikFormattedError = {};
        for (let key in backendErrors) {
          if (Array.isArray(backendErrors[key])) {
            formikFormattedError[key] = backendErrors[key][0];
          } else {
            formikFormattedError[key] = backendErrors[key];
          }
        }
        setErrors(formikFormattedError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="m-0 p-0 h-[100vh] overflow-hidden relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="absolute top-0 left-0 w-full h-full">
        <img className="w-full h-full object-cover" src={CarImg} alt="car" />
      </div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="bg-white opacity-90 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-xl font-bold mb-6 text-center font-montserrat">
            {isLogin ? "Login To Your Account" : "Create a New Account"}
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="font-montserrat mb-1 ml-2">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="border rounded-full p-2 focus:outline-none focus:ring-blue-500 tracking-wider font-montserrat"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm ml-2"
                  />
                </div>
                {!isLogin && (
                  <div className="flex gap-4">
                    <div className="flex flex-col w-[50%]">
                      <label className="font-montserrat mb-1 ml-2">
                        First Name
                      </label>
                      <Field
                        type="text"
                        name="firstName"
                        className="border rounded-full p-2 focus:outline-none focus:ring-blue-500 tracking-wider font-montserrat "
                      />

                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-sm ml-2"
                      />
                    </div>

                    <div className="flex flex-col w-[50%]">
                      <label className="font-montserrat mb-1 ml-2">
                        Last Name
                      </label>
                      <Field
                        type="text"
                        name="lastName"
                        className="border rounded-full p-2 focus:outline-none focus:ring-blue-500 tracking-wider font-montserrat"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-sm ml-2"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col relative">
                  <label className="font-montserrat mb-1 ml-2">Password</label>

                  <div className="relative">
                    <Field
                      type={isVisible ? "text" : "password"}
                      name="password"
                      className="w-full border rounded-full p-2 pr-10 focus:outline-none focus:ring-blue-500 tracking-wider font-montserrat"
                    />

                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      {isVisible ? <Eye /> : <EyeClosed />}
                    </div>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm ml-2"
                  />
                </div>

                {!isLogin && (
                  <div className="flex flex-col">
                    <label className="font-montserrat mb-1 ml-2">
                      Confirm Password
                    </label>
                    <Field
                      type={isVisible ? "text" : "password"}
                      name="password2"
                      className="border rounded-full p-2 focus:outline-none focus:ring-blue-500 tracking-wider font-montserrat"
                    />

                    <ErrorMessage
                      name="password2"
                      component="div"
                      className="text-red-500 text-sm ml-2"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 border text-white font-semibold py-2 transition-all ease-in-out bg-black font-montserrat hover:bg-white hover:text-black "
                >
                  {isLogin
                    ? isSubmitting
                      ? "Logging in..."
                      : "Login"
                    : isSubmitting
                    ? "Registering..."
                    : "Register"}
                </button>

                <p
                  className="text-sm mt-4 text-center cursor-pointer text-blue-600 hover:text-orange-500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Don’t have an account? Register"
                    : "Already have an account? Login"}
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
