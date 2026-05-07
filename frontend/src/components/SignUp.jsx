import React from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ContactRound, Mail, Lock, UserPlus } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const url = "https://task-manager-backend-srzi.onrender.com";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSignUp = async (data) => {
    try {
      const response = await axios.post(url + "/api/user/signUp", data); // register user
      // toast.success("signUp successfull !"); // pop up displaying user signed in successfully
      localStorage.setItem("token", response.data.token); // set token to local storage as authentication
      localStorage.setItem("name", response.data.user.name); // set name in local
      localStorage.setItem("email", response.data.user.email); // set email in local storage
      localStorage.setItem("theme", ""); // setting theme as light mode initially

      navigate("/layout");  //Dashboard page

    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data || error.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-2 bg-[linear-gradient(90deg,_rgba(240,240,240,1)_0%,_rgba(255,237,237,1)_100%)] ">
      <div className="bg-white py-8 px-4 lg:px-8 md:px-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          <UserPlus className="inline-block" strokeWidth={3} size={30} /> Sign
          Up
        </h1>
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="space-y-3"
          noValidate
        >
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 ml-2">
              Name:
            </label>

            <div className="relative flex items-center">
              <ContactRound className="absolute left-3 text-gray-500" />

              <input
                type="text"
                placeholder="Your name"
                {...register("name", {
                  required: "Name is required",
                })}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2`}
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 ml-2">
              Email
            </label>

            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2`}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700 ml-2">
              Password
            </label>

            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-gray-500" />

              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2`}
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            value={isSubmitting ? "Submitting" : "Sign Up"}
            disabled={isSubmitting}
          />
          {/* Sign Up */}
          {/* </input> */}
          {!isSubmitting && (
            <h1 className="text-center text-lg text-gray-600 mt-1">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `font-semibold underline transition-colors duration-200 ${
                    isActive
                      ? "text-red-500"
                      : "text-blue-600 hover:text-blue-800"
                  }`
                }
              >
                Login here
              </NavLink>
            </h1>
          )}
        </form>
        {isSubmitting &&(
          <div className="flex flex-col items-center mt-4">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-md text-gray-500 animate-pulse text-center">
            Hold on... we’re creating your dashboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
