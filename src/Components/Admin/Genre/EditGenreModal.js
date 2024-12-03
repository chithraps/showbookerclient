import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import Swal from 'sweetalert';
import { useSelector } from "react-redux";

function EditGenreModal({ genre, onClose, onUpdate }) {
  const [updatedGenre, setUpdatedGenre] = useState({ ...genre });
  const [errors, setErrors] = useState({});
  const admin = useSelector((state) => state.admin);  
  const adminAccessToken = admin.adminAccessToken;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedGenre((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updatedGenre.name) newErrors.name = 'Name is required';
    if (!updatedGenre.description) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        const genreId = updatedGenre._id;
        console.log(genreId)
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/updateGenre/${genreId}`, updatedGenre,{
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        Swal("Success", response.data.message, "success");
        onUpdate(updatedGenre);
        onClose();
      } catch (error) {
        Swal("Error", error.response.data.message || 'An error occurred while updating the genre', "error");
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
        <h2 className="text-xl mb-4">Edit Genre</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={updatedGenre.name}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={updatedGenre.description}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
              required
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGenreModal;
