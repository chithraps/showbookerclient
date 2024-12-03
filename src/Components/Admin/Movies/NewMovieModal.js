import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert';
import { useSelector } from "react-redux";

function NewMovieModal({ onClose, onSave }) {
  const [movie, setMovie] = useState({
    title: '',
    genre_id: '',
    release_date: '',
    duration: '',
    description: '',
    language: '',
    poster: null,
    trailer_url: '',
    cast: [],
    crew: []
  });

  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);
  const [castMember, setCastMember] = useState({ actor_name: '', character_name: '' });
  const [crewMember, setCrewMember] = useState({ crew_member: '', role: '' });
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/viewGenres?page=1&limit=1000`,{
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }); 
        setGenres(response.data.genres || []); 
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]); 
      }
    };

    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setMovie((prev) => ({ ...prev, [name]: value }));
   
  };

  const handleCastChange = (e) => {
    const { name, value } = e.target;
    console.log(`name and value ${name }${value}`)
    setCastMember((prev) => ({ ...prev, [name]: value }));
    console.log(`castMember is ${castMember.actor_name}`)
  };

  const handleCrewChange = (e) => {
    const { name, value } = e.target;
    setCrewMember((prev) => ({ ...prev, [name]: value }));
  };

  const addCastMember = () => {
    if (castMember.actor_name && castMember.character_name) {
      setMovie((prev) => ({
        ...prev,
        cast: [...prev.cast, castMember],
      }));
      console.log('Cast Member Added:', castMember);
      setCastMember({ actor_name: '', character_name: '' });
      
    }
  };

  const addCrewMember = () => {
    if (crewMember.crew_member && crewMember.role) {
      setMovie((prev) => ({
        ...prev,
        crew: [...prev.crew, crewMember],
      }));
      console.log('Crew Member Added:', crewMember);
      setCrewMember({ crew_member: '', role: '' });
      
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!movie.title) newErrors.title = 'Title is required';
    if (!movie.genre_id) newErrors.genre_id = 'Genre is required';
    if (!movie.release_date) newErrors.release_date = 'Release date is required';
    if (!movie.duration) newErrors.duration = 'Duration is required';
    if (!movie.description) newErrors.description = 'Description is required';
    if (!movie.language) newErrors.language = 'Language is required';
    if (!movie.poster) newErrors.poster = 'Poster is required';
    if (!movie.trailer_url) newErrors.trailer_url = 'Trailer URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    for (const key in movie) {
      if (key === 'cast' || key === 'crew') {
        formData.append(key, JSON.stringify(movie[key]));
      } else if (key === 'poster') {
        formData.append('file', movie.poster);
      } else {
        formData.append(key, movie[key]);
      }
    }

    try {
      // Logging after validation to ensure state is updated
      console.log("Movie Data:", movie);

      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(`${baseUrl}/admin/addMovie`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${adminAccessToken}`,
        }
      });
      Swal("Success", response.data.message, "success");
      onSave(movie);
      onClose();
    } catch (error) {
      Swal("Error", error.response?.data?.message || 'An error occurred while adding the movie', "error");
    }
  };

  const renderGenreOptions = () => {
    return genres.map((genre) => (
      <option key={genre._id} value={genre._id}>{genre.name}</option>
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl mx-4 sm:mx-8 md:mx-16 lg:mx-24 relative max-h-full overflow-y-auto">
        <button
          className="absolute top-2 right-2 bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        <h2 className="text-xl mb-4">Add New Movie</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={movie.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Genre</label>
            <select
              name="genre_id"
              value={movie.genre_id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">Select Genre</option>
              {renderGenreOptions()}
            </select>
            {errors.genre_id && <p className="text-red-500 text-sm">{errors.genre_id}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Release Date</label>
            <input
              type="date"
              name="release_date"
              value={movie.release_date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.release_date && <p className="text-red-500 text-sm">{errors.release_date}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={movie.duration}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={movie.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Language</label>
            <input
              type="text"
              name="language"
              value={movie.language}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Poster</label>
            <input
              type="file"
              accept="image/*"
              name="poster"
              onChange={(e) => setMovie((prev) => ({ ...prev, poster: e.target.files[0] }))}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.poster && <p className="text-red-500 text-sm">{errors.poster}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Trailer URL</label>
            <input
              type="url"
              name="trailer_url"
              value={movie.trailer_url}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.trailer_url && <p className="text-red-500 text-sm">{errors.trailer_url}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cast</label>
            <div className="flex mb-2">
              <input
                type="text"
                name="actor_name"
                value={castMember.actor_name}
                onChange={handleCastChange}
                placeholder="Actor Name"
                className="w-1/2 p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                name="character_name"
                value={castMember.character_name}
                onChange={handleCastChange}
                placeholder="Character Name"
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addCastMember}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Crew</label>
            <div className="flex mb-2">
              <input
                type="text"
                name="crew_member"
                value={crewMember.crew_member}
                onChange={handleCrewChange}
                placeholder="Crew Member"
                className="w-1/2 p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                name="role"
                value={crewMember.role}
                onChange={handleCrewChange}
                placeholder="Role"
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addCrewMember}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMovieModal;
 