import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { selectLocation } from "../../../Features/LocationAction"; 
import loadScript from "../../Utils/LoadScript";


function LocationModal({ isOpen, onClose, setSelectedLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch(); 
  const autocompleteService = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;    
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`).then(() => {
      if (window.google && window.google.maps) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
    });
  }, []);

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    if (searchQuery && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions( 
        { input: searchQuery, types: ["(cities)"] },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions || []);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (location) => {
    console.log("selected location ",location)
    setSelectedLocation(location);
    dispatch(selectLocation(location));
    onClose();
  };

  return (
    <Modal
  isOpen={isOpen}
  onRequestClose={onClose}
  className="fixed inset-0 flex justify-center items-center z-50"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
  ariaHideApp={false}
>
  <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl mx-4 p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-center flex-grow">Select Location</h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <IoMdClose />
      </button>
    </div>

    <div className="relative w-full mb-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search here"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <FaSearch className="text-gray-400" />
      </div>
    </div>

    <ul className="max-h-40 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          onClick={() => handleLocationSelect(suggestion.description.split(",")[0])}
        >
          {suggestion.description.split(",")[0]}
        </li>
      ))}
    </ul>
  </div>
</Modal>
  );
}

export default LocationModal;
