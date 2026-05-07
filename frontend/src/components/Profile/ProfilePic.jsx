import React, { useContext, useRef, useState, useEffect } from "react";
import { taskContext } from "../../App";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import userImg from "../../assets/userImg.png";

const ProfilePic = () => {
  const { image, setImage, openImage, setOpenImage } = useContext(taskContext);
  const [tempImage, setTempImage] = useState(null); // temporary image
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Server url (Backend)
  const url = "https://task-manager-backend-srzi.onrender.com";

  const fileInputRef = useRef(null);

  const handleChangeClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl); // preview only
    }
  }, [file]);

  const handleApply = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!file) {
      toast.error("Please upload image to change profile picture");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      const response = await axios.put(
        url + "/api/user/imageUpload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);
      setLoading(false);
      setImage(response.data.imageUrl);
      setTempImage(null);
      setOpenImage(false);
      toast.success("Profile picture updated!" ,{
        autoClose:1000
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleCancel = () => {
    setTempImage(null);
  };

  const handleClose = () => {
    setTempImage(null);
    setOpenImage(false);
  };

  //   for removing profile picture
  const handleRemove = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("please log in to remove profile pic", {
        autoClose: 1500,
      });
      return;
    }

    if (image === "") {
      toast.error("no profile picture to remove", {
        autoClose: 1000,
      });
      return;
    }

    // confirming if user want to remove profile picture
    const confirm = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirm) return;

    try {
      const response = await axios.put(
        url + "/api/user/removeImage",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImage("");
      setTempImage(null);
      setOpenImage(false);
      toast.success("profile picture removed", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("error while removing Image", {
        autoClose: 1500,
      });
    }
  };

  return (
    <>
      {openImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-40">
          <div className="relative backdrop-blur-md p-6 shadow-lg max-w-md w-[90%] rounded-xl bg-white/20">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white hover:text-black"
            >
              <X size={30} />
            </button>

            <div className="flex flex-col items-center text-center">
              <p className="text-lg font-semibold text-white mb-4">
                {tempImage
                  ? "Preview New Profile Image"
                  : "Current Profile Image"}
              </p>
              <img
                src={tempImage || (image !== "" ? image : userImg)}
                alt="Preview"
                className="w-65 h-65 object-cover rounded-full border-2 border-gray-300"
              />
            </div>

            <div className="flex justify-between mt-4 flex-wrap gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded w-full lg:w-[48%]"
                onClick={handleChangeClick}
              >
                Change Profile Pic
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded w-full lg:w-[48%]"
                onClick={handleRemove}
              >
                Remove Profile Pic
              </button>
            </div>

            {tempImage && (
              <div className="flex justify-between mt-3 flex-wrap gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full lg:w-[48%]"
                  onClick={handleApply}
                  disabled={loading}
                >
                  {loading ? "Applying.." : "Apply changes"}
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded w-full lg:w-[48%]"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              capture="user"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePic;
