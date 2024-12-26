import React, { useState, useEffect } from "react";
import axios from "axios";
import {logoutUser} from "../../../Features/UserActions"
import Header from "../LandingPage/Header";
import { useSelector,useDispatch } from "react-redux";
import Footer from "../Footer/Footer"; 
import EditProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

function ViewProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  console.log(user.id); 
  const [userDetails, setUserDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = user.user.id;
  const token = user.accessToken;

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
        if(error.response.data.message==="Unauthorized: Token has expired"){
          swal({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutUser()); 
              navigate("/");
            }
          });
        }else if (
          error.response.data.message === "User is blocked. Access denied."
        ) {
          swal({
            title: "User Blocked",
            text: "Your account has been blocked. Please contact support for further assistance.",
            icon: "error",
            buttons: true,
            dangerMode: true,
          }).then((willLogout) => {
            if (willLogout) {
              dispatch(logoutUser());
              navigate("/");
            }
          });
        }
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUserDetailsUpdate = (updatedDetails) => {
    setUserDetails(updatedDetails);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-gray-50 rounded-lg p-6 shadow-md mx-auto mt-10 w-full max-w-2xl mb-10 min-h-[300px]">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Profile Details
        </h2>

        <div className="space-y-4">
          {/* First Name */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">First Name:</span>
            <span className="text-gray-800">
              {userDetails.firstName || "N/A"}
            </span>
          </div>

          {/* Last Name */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Last Name:</span>
            <span className="text-gray-800">
              {userDetails.lastName || "N/A"}
            </span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-800">{userDetails.email || "N/A"}</span>
          </div>

          {/* Mobile Number */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Phone Number:</span>
            <span className="text-gray-800">
              {userDetails.mobileNumber || "N/A"}
            </span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <EditProfile onClose={handleCloseModal} userDetails={userDetails} onUpdate={handleUserDetailsUpdate} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ViewProfile;
