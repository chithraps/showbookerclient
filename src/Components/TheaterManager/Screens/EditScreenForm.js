import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert";
import { useSelector } from "react-redux";

const EditScreenForm = ({ selectedScreen, onSave, onClose }) => {
  const [capacity, setCapacity] = useState(selectedScreen.capacity);
  const [soundSystem, setSoundSystem] = useState(
    selectedScreen.sound_system || ""
  );

  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;

  const handleSave = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    try {
      const response = await axios.put(
        `${baseUrl}/tmAdmin/updateScreen`,
        {
          screenId: selectedScreen._id,
          capacity,
          soundSystem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal("Screen updated successfully", response.data.message, "success");
      onSave(response.data.screen); 
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating screen details:", error);
      Swal(
        "Error updating screen details",
        error.response?.data?.message || "Error",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative mt-12">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Screen</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Screen Number:</label>
          <input
            type="text"
            value={selectedScreen.screen_number}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Capacity:</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Sound System:</label>
          <select
            value={soundSystem}
            onChange={(e) => setSoundSystem(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Sound System</option>
            <option value="5.1 Surround Sound">5.1 Surround Sound</option>
            <option value="7.1 Surround Sound">7.1 Surround Sound</option>
            <option value="Dolby Atmos">Dolby Atmos</option>
            <option value="DTS:X">DTS:X</option>
            <option value="Auro 11.1">Auro 11.1</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditScreenForm;
