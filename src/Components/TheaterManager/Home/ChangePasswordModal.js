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
  const id = theaterAdmin.theaterAdmin.id;

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
        `${baseUrl}/tmAdmin/updatePassword/${id}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Change Password
        </h3>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {setPassword(e.target.value)} }
              className="border p-2 text-gray-700"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-gray-700 font-medium"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 text-gray-700"
            />
          </div>
        </form>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePasswordChange}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md shadow hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
