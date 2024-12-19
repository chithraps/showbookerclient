import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../../Features/UserActions";
import axios from "axios";
import swal from "sweetalert";

function EditProfile({ onClose }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userId = user?.user?.id;
  const token = user?.accessToken;

  const [userDetails, setUserDetails] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/fetchUserDetails/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId && token) {
      fetchUserDetails();
    }
  }, [userId, token]);

 
  useEffect(() => {
    if (userDetails) {
      setFormData({
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        email: userDetails.email || "",
        mobileNumber: userDetails.mobileNumber || "",
      });
    }
  }, [userDetails]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emptyFields = [];
      if (!formData.firstName.trim()) emptyFields.push("First Name");
      if (!formData.lastName.trim()) emptyFields.push("Last Name");
      if (!formData.mobileNumber.trim()) emptyFields.push("Phone Number");
      if (emptyFields.length > 0) {
        swal("Error", `The following fields are required: ${emptyFields.join(", ")}`, "error");
        return;
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/edit-profile/${userId}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        dispatch(loginUser(response.data.user, token));
        swal("Success", response.data.message, "success");
        onClose();
      }
    } catch (error) {
      swal("Error", error.response?.data?.message || "An error occurred", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Edit Profile
      </h2>
      <div className="space-y-4">
        {/* First Name */}
        <div className="flex justify-between items-center">
          <label className="block text-gray-600 w-28">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Last Name */}
        <div className="flex justify-between items-center">
          <label className="block text-gray-600 w-28">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Email */}
        <div className="flex justify-between items-center">
          <label className="block text-gray-600 w-28">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-64 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Phone Number */}
        <div className="flex justify-between items-center">
          <label className="block text-gray-600 w-28">Phone Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-64 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditProfile;
