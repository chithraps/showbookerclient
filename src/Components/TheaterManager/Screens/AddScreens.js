import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import sweet from "sweetalert";

function AddScreens({ formData, setFormData, onScreenAdded,handleScreenAdded }) {
  const [errors, setErrors] = useState({});
  const [screenNumber,setScrenNumber]= useState("")
  const [capacity,setCapacity]=useState("");
  const [soundSystem,setSoundSystem] = useState("")
  const theaterAdmin = useSelector((state) => state.theaterAdmin);
  const theater_id = theaterAdmin.theaterAdmin.theaterId;
  const token = theaterAdmin.theaterAdminAccessToken
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const validateForm = () => {
    const errors = {};
    if (!screenNumber) {
      errors.screenNumber = "Screen number is required.";
    }
    if (screenNumber <= 0) {
      errors.screenNumber = "Screen number must be a positive number.";
    }    
    if (capacity <= 0) {
      errors.seatCapacity = "Seat capacity must be a positive number.";
    }
    if (!soundSystem) {
      errors.soundSystem = "Sound system is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/tmAdmin/addScreen`,
        {
          theater_id,
          screenNumber,
          capacity,
          soundSystem,
        },
        { headers }
      );      
      const screenId = response.data.screenId
      const updatedFormData = {
        ...formData,
        screenId: screenId,
      };
      setFormData(updatedFormData);
      console.log("Updated formData:", updatedFormData); 
      sweet("Success", response.data.message, "success");
      
      
      setScrenNumber("");
      setCapacity("");
      setSoundSystem("")
      onScreenAdded();
      handleScreenAdded()
    } catch (error) {
      console.error("Error creating screen:", error);
      sweet("Error", error.response.data.error, "error");
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center p-8">
      <div className="w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add new screen</h2>        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="screenNumber"
            >
              Screen Number
            </label>
            <input
              type="number"
              name="screenNumber"
              id="screenNumber"
              value={screenNumber}
              onChange={(e) =>
                setScrenNumber(e.target.value)
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.screenNumber ? "border-red-500" : ""
              }`}
            />
            {errors.screenNumber && (
              <p className="text-red-500 text-xs italic">
                {errors.screenNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="seatCapacity"
            >
              Seat Capacity of screen
            </label>
            <input
              type="number"
              name="seatCapacity"
              id="seatCapacity"
              value={capacity}
              onChange={(e) =>
                setCapacity(e.target.value)
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.seatCapacity ? "border-red-500" : ""
              }`}
            />
            {errors.seatCapacity && (
              <p className="text-red-500 text-xs italic">
                {errors.seatCapacity}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="soundSystem"
            >
              Sound System
            </label>
            <select
              name="soundSystem"
              id="soundSystem"
              value={soundSystem}
              onChange={(e) =>
                setSoundSystem(e.target.value)
              }
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.soundSystem ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Sound System</option>
              <option value="5.1 Surround Sound">5.1 Surround Sound</option>
              <option value="7.1 Surround Sound">7.1 Surround Sound</option>
              <option value="Dolby Atmos">Dolby Atmos</option>
              <option value="DTS:X">DTS:X</option>
              <option value="Auro 11.1">Auro 11.1</option>
            </select>
            {errors.soundSystem && (
              <p className="text-red-500 text-xs italic">
                {errors.soundSystem}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddScreens;
