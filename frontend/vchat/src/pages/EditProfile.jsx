import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useApi from "../useApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { saveLogin } from "../store/slice";


const EditProfile = ({ loggedinUser, onClose }) => {
    const api = useApi()
    const dispatch = useDispatch()
    const { access_token, refresh_token } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    username: Yup.string(),
    first_name: Yup.string(),
    last_name: Yup.string(),
    profile_img: Yup.mixed()
      .nullable()
      .test("fileSize", "File too large", (value) => {
        if (value) {
          return value.size <= 5 * 1024 * 1024;
        }
        return true;
      })
      .test("fileType", "Invalid file type", (value) => {
        if (value) {
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }
        return true;
      }),
  });

  const initialValues = {
    username: loggedinUser.username || "",
    first_name: loggedinUser.first_name || "",
    last_name: loggedinUser.last_name || "",
    profile_img: null,
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    if (values.profile_img) {
      formData.append("profile_img", values.profile_img);
    }

    try {
        const res = await api.put("users/update-profile/", formData)

        if (res.status === 200) {
            toast.success("User Updated successfully")
            console.log(`new updated user : ${JSON.stringify(res.data)}`)
            dispatch(saveLogin({
                user : res.data,
                access_token,
                refresh_token,
            }))

            onClose()
        }
    } catch (error) {
        toast.error("Something went wrong while updating");
        console.error(error);
      } 
    };

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-x-0">
      <div className="p-9 border-b flex justify-between items-center">
        <h2 className="text-xl font-montserrat font-bold">Edit Profile</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-lg">
          ✕
        </button>
      </div>

      <div className="p-5">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <Field
                  name="username"
                  className="w-full border p-2 rounded-md"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Field
                  name="first_name"
                  className="w-full border p-2 rounded-md"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Field
                  name="last_name"
                  className="w-full border p-2 rounded-md"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profile_img"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("profile_img", event.currentTarget.files[0]);
                  }}
                  className="w-full border p-2 rounded-md"
                />
                <ErrorMessage
                  name="profile_img"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfile;
