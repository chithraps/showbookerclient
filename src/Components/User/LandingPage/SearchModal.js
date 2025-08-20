import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { selectLocation } from "../../../Features/LocationSlice";

const SearchModal = ({ isOpen, onClose }) => {
  const selectedLocation = useSelector(selectLocation);
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [languageFilter, setLanguageFilter] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    if (isOpen) {
      const fetchMovies = async () => {
        try {
          const baseUrl = process.env.REACT_APP_BASE_URL;
          const response = await axios.get(`${baseUrl}/moviesInTheaters`, {
            params: { location: selectedLocation },
          });
          setMovies(response.data.movies);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      };

      fetchMovies();
    }
  }, [isOpen, selectedLocation]);

  // Filter movies based on search term and language filter
  useEffect(() => {
    let filtered = movies;

    if (languageFilter) {
      filtered = filtered.filter((movie) => movie.language === languageFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [searchTerm, languageFilter, movies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md relative w-5/6 h-5/6">
        
        <button className="absolute top-4 right-4" onClick={onClose}>
          <FaTimes className="text-gray-500" />
        </button>

        
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search for movies ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-2/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

       
        <div className="flex justify-start mt-4">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
          </select>
        </div>

        
        <div className="mt-8 overflow-y-auto">
          {filteredMovies.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4">
              {filteredMovies.map((movie) => (
                <li key={movie._id} className="bg-gray-100 p-4 rounded">
                  
                  <h3
                    className="text-lg font-semibold text-blue-500 cursor-pointer"
                    onClick={() => navigate(`/theatersForMovie/${movie._id}`)}
                  >
                    {movie.title}
                  </h3>
                  <p className="text-gray-500">{movie.language}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No movies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
