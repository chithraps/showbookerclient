import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";

function ChangePasswordModal({ closeModal }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;
  const theaterId = theaterAdmin.theaterAdmin.theaterId;
  console.log(theaterAdmin.theaterAdmin.theaterId);
  const handlePasswordChange = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.patch(
        `${baseUrl}/tmAdmin/updatePassword/${theaterId}`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        swal("Success!", "Password updated successfully.", "success");
        closeModal();
      }
    } catch (error) {
      setError("Failed to update password.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="fixed z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Change Password
        </h3>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 mb-4 border ${
            error.includes("field") ? "border-red-500" : "border-gray-300"
          } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full p-3 mb-6 border ${
            error.includes("field") ? "border-red-500" : "border-gray-300"
          } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <div className="flex justify-end">
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-400 ml-2 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
