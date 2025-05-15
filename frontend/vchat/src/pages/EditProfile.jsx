import React, { useEffect, useRef, useState } from "react";
import useApi from "../useApi";
import { toast } from "react-toastify";
import { Edit2, Mail, Upload, User } from "lucide-react";

const EditProfile = () => {
  const api = useApi();
  const fileInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    profile_img: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // const MEDIA_URL = "http://localhost:8000";
  const MEDIA_URL = "https://v-chat-j9d2.onrender.com";

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
        setPreviewImage(`${MEDIA_URL}${res.data.profile_img}`);
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

  const handleSave = async () => {
    const data = new FormData();
    data.append("username", formData.username);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    if (formData.profile_img) {
      data.append("profile_img", formData.profile_img);
    }

    try {
      const res = await api.put("/users/read-update-user/", data);
      if (res.status === 200) {
        toast.success("User profile updated successfully");
        setIsEditing(false);
        setUserData(res.data);
        setPreviewImage(`${MEDIA_URL}${res.data.profile_img}`);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Update failed!");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen"></div>;
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 font-montserrat">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

      <div className="flex justify-center items-center mb-6">
        <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={50} className="text-gray-400" />
          )}

          {isEditing && (
            <>
              <button
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload size={24} />
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

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              type="text"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-full">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(`${MEDIA_URL}${userData.profile_img}`);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <h3 className="text-2xl font-bold">{userData.username}</h3>
          <p className="text-xl font-semibold text-gray-700">
            Name: {userData.first_name} {userData.last_name}
          </p>
          <div className="flex justify-center items-center">
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
