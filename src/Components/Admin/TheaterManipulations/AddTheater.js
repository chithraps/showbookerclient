import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert";
import { useSelector } from "react-redux";
import loadScript from "../../Utils/LoadScript";

function AddTheater({ isOpen, onClose, onTheaterAdded}) {
  const [theaterDetails, setTheaterDetails] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    managerEmail: "",
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const autocompleteService = useRef(null);
  const [errors, setErrors] = useState({});
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    ).then(() => {
      if (window.google && window.google.maps) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTheaterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (value && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input: value, types: ["(regions)"] },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            if (name === "location") setLocationSuggestions(predictions || []);
            else if (name === "city") setCitySuggestions(predictions || []);
            else if (name === "state") setStateSuggestions(predictions || []);
          } else {
            if (name === "location") setLocationSuggestions([]);
            else if (name === "city") setCitySuggestions([]);
            else if (name === "state") setStateSuggestions([]);
          }
        }
      );
    } else {
      if (name === "location") setLocationSuggestions([]);
      else if (name === "city") setCitySuggestions([]);
      else if (name === "state") setStateSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion, field) => {
    setTheaterDetails((prevDetails) => ({
      ...prevDetails,
      [field]: suggestion.description.split(",")[0],
    }));
    if (field === "location") setLocationSuggestions([]);
    else if (field === "city") setCitySuggestions([]);
    else if (field === "state") setStateSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation checks
    if (!theaterDetails.name.trim()) newErrors.name = "Name is required.";
    if (!theaterDetails.location.trim())
      newErrors.location = "Location is required.";
    if (!theaterDetails.city.trim()) newErrors.city = "City is required.";
    if (!theaterDetails.state.trim()) newErrors.state = "State is required.";
    if (!theaterDetails.managerEmail.trim())
      newErrors.managerEmail = "Manager Email is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      theaterDetails.managerEmail &&
      !emailRegex.test(theaterDetails.managerEmail)
    ) {
      newErrors.managerEmail = "Invalid email format.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors to state
      return;
    }

    setErrors({});
    try {
      const response = await axios.post(
        `${baseUrl}/admin/addTheater`,
        theaterDetails,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      if (response.data.success) {
        Swal("Success", response.data.message, "success");
        setTheaterDetails({
          name: "",
          location: "",
          city: "",
          state: "",
          managerEmail: "",
        });
        onTheaterAdded();
      } else {
        Swal("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error adding theater:", error);
      Swal("Error", error.response?.data?.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 bg-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-400 focus:outline-none"
          onClick={onClose}
        >
          <IoMdClose size={20} />
        </button>
        <h2 className="text-xl font-bold mb-3">Add Theater and Manager</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-md"
        >
          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={theaterDetails.name}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
          </div>

          {["location", "city", "state"].map((field) => {
            const suggestions =
              field === "location"
                ? locationSuggestions
                : field === "city"
                ? citySuggestions
                : stateSuggestions;

            return (
              <div className="mb-2" key={field}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={field}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  id={field}
                  value={theaterDetails[field]}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {errors[field] && <p className="text-red-500 text-xs italic mt-1">{errors[field]}</p>}
                {suggestions.length > 0 && (
                  <ul className="bg-white border rounded shadow-md mt-2 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion, field)}
                      >
                        {suggestion.description.split(",")[0]}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}

          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="managerEmail"
            >
              Manager Email
            </label>
            <input
              type="email"
              name="managerEmail"
              id="managerEmail"
              value={theaterDetails.managerEmail}
              onChange={handleInputChange}
              className={`shadow appearance-none border ${
                errors.managerEmail ? "border-red-500" : "border-gray-300"
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.managerEmail && <p className="text-red-500 text-xs italic mt-1">{errors.managerEmail}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTheater;
