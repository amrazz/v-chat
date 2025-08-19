import React, { useEffect, useRef, useState } from "react";
import useApi from "../useApi";
import { toast, ToastContainer } from "react-toastify";
import {
  Edit2,
  Mail,
  Upload,
  User,
  Camera,
  Check,
  X,
  ArrowLeftCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const api = useApi();
  const naviatage = useNavigate();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    profile_img: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const MEDIA_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/read-update-user/");
        setUserData(res.data);
        setFormData({
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          profile_img: null,
        });
        if (res.data.profile_img) {
          setPreviewImage(`${MEDIA_URL}${res.data.profile_img}`);
        } else {
          setPreviewImage(null);
        }
      } catch (err) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_img: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = [];

    const usernameRegex = /^(?![_.]+$)[a-zA-Z0-9_]{3,20}$/;
    if (!formData.username.trim()) {
      errors.push("Username is required.");
    } else if (!usernameRegex.test(formData.username)) {
      errors.push(
        "Username must be 3-20 characters and contain only letters, numbers, and underscores."
      );
    }

    const nameRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
    if (!formData.first_name.trim()) {
      errors.push("First name is required.");
    } else if (!nameRegex.test(formData.first_name)) {
      errors.push("First name can only contain letters, spaces, or hyphens.");
    }

    if (!formData.last_name.trim()) {
      errors.push("Last name is required.");
    } else if (!nameRegex.test(formData.last_name)) {
      errors.push("Last name can only contain letters, spaces, or hyphens.");
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err)); // Show all errors
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    if (formData.profile_img) {
      data.append("profile_img", formData.profile_img);
    }

    try {
      setLoading(true);
      const res = await api.put("/users/read-update-user/", data);
      if (res.status === 200) {
        toast.success("User profile updated successfully");
        setIsEditing(false);
        setUserData(res.data);
        setPreviewImage(
          res.data.profile_img ? `${MEDIA_URL}${res.data.profile_img}` : null
        );
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <div
          className="absolute top-16  left-14 p-3 shadow rounded-full cursor-pointer z-50 bg-white"
          onClick={() => naviatage("/")}
        >
          {/* <ArrowLeft size={40} color="white" /> */}
          <ArrowLeft size={40} color="rgb(255,91,91)" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Card Header with Decorative Element */}

          <div className="relative bg-gradient-to-r from-red-500 to-red-300 px-8 py-8">
            <h1 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
              Profile Settings
            </h1>
            <div className="absolute top-0 right-0 w-42 h-42 bg-white/10 rounded-full -translate-y-12 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10 flex justify-center">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full bg-white p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={60} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {isEditing && (
                  <>
                    <button
                      onClick={triggerFileInput}
                      className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800"
                      type="text"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Check size={20} />
                    {loading ? "Saving changes..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewImage(`${MEDIA_URL}${userData.profile_img}`);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                {/* User Info Display */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    @{userData.username}
                  </h2>
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full">
                    <span className="text-lg font-medium text-gray-700">
                      {userData.first_name} {userData.last_name}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Edit2 size={20} />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
