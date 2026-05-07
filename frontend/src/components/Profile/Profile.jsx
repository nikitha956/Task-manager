import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { taskContext } from "../../App";
import { useForm } from "react-hook-form";
import { SquareUserRound, ShieldCheck, Settings} from "lucide-react";

function Profile() {
  const { image, setImage } = useContext(taskContext);
  const [loading, setLoading] = useState(false);

  const { userName, setUserName, userEmail, setUserEmail } =
    useContext(taskContext);

  const [file, setFile] = useState(null);

  // server URL
  const url = "https://task-manager-backend-srzi.onrender.com";

  // const handleImageUpload = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const token = localStorage.getItem("token");

  //   if (!file) {
  //     toast.error("Please upload image to change profile picture");
  //     setLoading(false);
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("imageFile", file);

  //   try {
  //     const response = await axios.put(
  //       url + "/api/user/imageUpload",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data.message);
  //     setLoading(false);
  //     setImage(response.data.imageUrl);
  //     toast.success("Profile picture updated Successfully!");
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message);
  //   }
  // };

  const handlePasswordChange = async (data) => {
    const token = localStorage.getItem("token");

    // check if new and confirm passsword matches or not
    if (data.newPassword !== data.confirmPassword) {
      toast.error("new and confirm password doesn't matches", {
        autoClose: 1500,
      });
      return;
    }

    if (!token) {
      toast.error("User not authenticated. Please login.", {
        autoClose: 1000,
      });
      return;
    }
    try {
      const response = await axios.put(url + "/api/user/updatePassword", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Password updated !", {
        autoClose: 1000,
      }); // pop up displaying updated password
      resetPassword();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update Password.";

      toast.error(message, {
        autoClose: 1000,
      });
      resetPassword();
    }
  };

  const handlePersonalInfo = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated. Please login.", {
        autoClose: 1000,
      });
      return;
    }
    try {
      const response = await axios.put(url + "/api/user/updateProfile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Personal information updated !", {
        autoClose: 1000,
      }); // pop up displaying updated personal information

      setUserName(response.data.user.name);
      setUserEmail(response.data.user.email);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update profile.";

      toast.error(message, {
        autoClose: 1500,
      });
    }
  };

  // for personal Info form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: userName,
      email: userEmail,
    },
  });

  // for change password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm();

  // get user details on every refresh
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(url + "/api/user/myDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const { name, email, imageUrl } = response.data.user;
          setUserName(name);
          setUserEmail(email);
          setImage(imageUrl);

          // Update form values
          resetProfile({ name, email });
        }
      } catch (error) {
        console.log("Error fetching userData", error);
      }
    };

    getUserDetails();
  }, [resetProfile]);

  return (
    <div className="mb-2">
      <h1 className="text-2xl text-center text-white bg-green-600 px-2 py-1.5 rounded-lg mb-4"><Settings className="inline-block"/> Profile Setting</h1>
      <div className="flex justify-center items-center gap-4 flex-wrap ">
        <div className="bg-white px-4 py-6 rounded-lg w-xs mx-2 shadow-lg shadow-gray-700">
          <h1 className="text-lg font-semibold mb-4">
            <SquareUserRound className="inline-block" size={25} />
            {" "} Personal Information
          </h1>
          <form
            className="space-y-5"
            onSubmit={handleSubmitProfile(handlePersonalInfo)}
          >
            {/* Name Field */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Name :
              </label>
              <input
                type="text"
                {...registerProfile("name", {
                  required: "Name is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  profileErrors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {profileErrors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {profileErrors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Email :
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...registerProfile("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  profileErrors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {profileErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {profileErrors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
              value={isSubmittingProfile ? "Saving..." : "Save changes"}
              disabled={isSubmittingProfile}
            />
          </form>
        </div>
        {/* ---------------------------------------------- */}

        {/* password change field */}
        <div className="bg-white px-4 py-6 rounded-lg w-xs shadow-lg shadow-gray-700">
          <h1 className="text-lg font-semibold mb-4">
            <ShieldCheck className="inline-block" size={25}/>
            {" "}Security</h1>
          <form
            className="space-y-5"
            onSubmit={handleSubmitPassword(handlePasswordChange)}
          >
            {/* current password Field */}
            <div>
              <input
                type="password"
                placeholder="Current Passsword"
                {...registerPassword("currentPassword", {
                  required: "Current Password is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  passwordErrors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {passwordErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            {/* new password field */}
            <div>
              <input
                type="password"
                placeholder="New Password"
                {...registerPassword("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  passwordErrors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            {/* confirm password field */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                {...registerPassword("confirmPassword", {
                  required: "Current Password is required",
                })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  passwordErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
              value={isSubmittingPassword ? "Updating..." : "Update Password"}
              disabled={isSubmittingPassword}
            />
          </form>
        </div>
      </div>

      {/* <form onSubmit={handleImageUpload}>
        <input
          type="file"
          name=""
          id=""
          capture="user"
          accept="image/*"
          className="bg-yellow-300"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="border rounded-md px-2 cursor-pointer"
          disabled={loading}
        >
          {loading ? "...uploading" : "Upload image"}
        </button>
      </form> */}
    </div>
  );
}

export default Profile;
