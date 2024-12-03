import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert";
import { useSelector } from "react-redux";

function NewGenreModal({ onClose, onSave }) {
  const [newGenre, setNewGenre] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const admin = useSelector((state) => state.admin);
  console.log("admin and token ", admin.admin, " ", admin.adminAccessToken);
  const adminAccessToken = admin.adminAccessToken;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGenre((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newGenre.name) newErrors.name = "Name is required";
    if (!newGenre.description)
      newErrors.description = "Description is required";
    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/admin/addGenre`,
          newGenre,
          {
            headers: {
              Authorization: `Bearer ${adminAccessToken}`,
            },
          }
        );
        Swal("Success", response.data.message, "success");
        onSave(newGenre);
        onClose();
      } catch (error) {
        Swal(
          "Error",
          error.response.data.message ||
            "An error occurred while adding the genre",
          "error"
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-1/3 relative">
        <button
          className="absolute top-2 right-2 bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        <h2 className="text-xl mb-4">Add Genre</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={newGenre.name}
              onChange={handleInputChange}
              className={`w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded mt-1`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={newGenre.description}
              onChange={handleInputChange}
              className={`w-full p-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded mt-1`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewGenreModal;
