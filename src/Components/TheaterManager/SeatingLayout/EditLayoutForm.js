import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";

const EditLayoutForm = ({ layout, onSave, onClose }) => {
  const [className, setClassName] = useState(layout.class_name);
  const [price, setPrice] = useState(layout.price);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const token = theaterAdmin.theaterAdminAccessToken;

  const handleSave = async () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    try {
      const response = await axios.put(
        `${baseUrl}/tmAdmin/updateLayout`,
        {
          layoutId: layout._id,
          class_name: className,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        swal("Success", response.data.message);
      }
      onSave();
    } catch (error) {
      swal("Failed ",error.response.data.message)
      console.error("Error updating layout details:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Class:</label>
            <input
              type="text"
              value={className}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLayoutForm;
