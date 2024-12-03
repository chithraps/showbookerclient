import React, { useState } from "react";
import Header from "../LandingPage/Header";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../Footer/Footer";
import { loginUser } from "../../../Features/UserActions";
import axios from "axios";
import swal from "sweetalert";

function EditProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { firstName, lastName, email, mobileNumber } = user.user || {};
  const token = user.accessToken;
  
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    mobileNumber: false,
  });

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    mobileNumber: mobileNumber || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = (field) => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field],
    });
  }; 

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Form Data ", formData);
      console.log("user ", user.user.id);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.put(
        `${baseUrl}/edit-profile/${user.user.id}`,
        {
          formData,
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status === 200) {
        const updatedUser = response.data.user;
        dispatch(loginUser(updatedUser, token));
        swal("Success", response.data.message, "success");
        console.log("Profile updated successfully");
      }
      setIsEditing({
        firstName: false,
        lastName: false,
        mobileNumber: false,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-gray-50 rounded-lg p-6 shadow-md mx-auto mt-10 w-full max-w-2xl mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <label className="block text-gray-600 w-28">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              readOnly={!isEditing.firstName}
            />
            <button
              type="button"
              onClick={() => handleEditClick("firstName")}
              className="text-blue-500"
            >
              {isEditing.firstName ? "Save" : "Edit"}
            </button>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <label className="block text-gray-600 w-28">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              readOnly={!isEditing.lastName}
            />
            <button
              type="button"
              onClick={() => handleEditClick("lastName")}
              className="text-blue-500"
            >
              {isEditing.lastName ? "Save" : "Edit"}
            </button>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <label className="block text-gray-600 w-28">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              readOnly
            />
            
          </div>

          <div className="flex justify-center items-center space-x-2">
            <label className="block text-gray-600 w-28">Phone Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber || "Nil"}
              onChange={handleChange}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              readOnly={!isEditing.mobileNumber}
            />
            <button
              type="button"
              onClick={() => handleEditClick("mobileNumber")}
              className="text-blue-500"
            >
              {isEditing.mobileNumber ? "Save" : "Edit"}
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfile;
