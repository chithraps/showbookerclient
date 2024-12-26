import React, { useState, useRef, useEffect } from "react";
import loadScript from "../../Utils/LoadScript";

function EditTheater({ isOpen, theater, onClose, onSave, onInputChange }) {
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const autocompleteService = useRef(null);

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
    onInputChange(e); // Update parent state

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
    onInputChange({
      target: {
        name: field,
        value: suggestion.description.split(",")[0],
      },
    });
    if (field === "location") setLocationSuggestions([]);
    else if (field === "city") setCitySuggestions([]);
    else if (field === "state") setStateSuggestions([]);
  };

  if (!isOpen || !theater) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Theater</h2>

        {["name", "location", "city", "state"].map((field) => {
          const suggestions =
            field === "location"
              ? locationSuggestions
              : field === "city"
              ? citySuggestions
              : stateSuggestions;

          return (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={theater[field] || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTheater;
