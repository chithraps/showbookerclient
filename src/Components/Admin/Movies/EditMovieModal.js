import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert";
import { useSelector } from "react-redux";

function EditMovieModal({ movie, onClose, onUpdate }) {
  const [updatedMovie, setUpdatedMovie] = useState({
    ...movie,
    genre_id: movie.genre_id?._id || "",
    release_date: movie.release_date
      ? new Date(movie.release_date).toISOString().split("T")[0]
      : "",
  });
  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);
  const [castMember, setCastMember] = useState({
    actor_name: "",
    character_name: "",
  });
  const [crewMember, setCrewMember] = useState({ crew_member: "", role: "" });
  const admin = useSelector((state) => state.admin);
  const adminAccessToken = admin.adminAccessToken;
  console.log("updatedMovie ", updatedMovie);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await axios.get(`${baseUrl}/admin/getGenre`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminAccessToken}`,
          },
        });
        //console.log(response.data.genres)

        setGenres(response.data.genres || []);
        console.log("genre ", genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenres([]);
      }
    };

    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleCastChange = (index, e) => {
    const { name, value } = e.target;
    const newCast = updatedMovie.cast.map((member, i) =>
      i === index ? { ...member, [name]: value } : member
    );
    setUpdatedMovie((prev) => ({ ...prev, cast: newCast }));
  };

  const handleCrewChange = (index, e) => {
    const { name, value } = e.target;
    const newCrew = updatedMovie.crew.map((member, i) =>
      i === index ? { ...member, [name]: value } : member
    );
    setUpdatedMovie((prev) => ({ ...prev, crew: newCrew }));
  };

  const addCastMember = () => {
    if (castMember.actor_name && castMember.character_name) {
      setUpdatedMovie((prev) => ({
        ...prev,
        cast: [...prev.cast, castMember],
      }));
      setCastMember({ actor_name: "", character_name: "" });
    }
  };

  const addCrewMember = () => {
    if (crewMember.crew_member && crewMember.role) {
      setUpdatedMovie((prev) => ({
        ...prev,
        crew: [...prev.crew, crewMember],
      }));
      setCrewMember({ crew_member: "", role: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updatedMovie.title) newErrors.title = "Title is required";
    if (!updatedMovie.genre_id) newErrors.genre_id = "Genre is required";
    if (!updatedMovie.release_date)
      newErrors.release_date = "Release date is required";
    if (!updatedMovie.duration) newErrors.duration = "Duration is required";
    if (!updatedMovie.description)
      newErrors.description = "Description is required";
    if (!updatedMovie.language) newErrors.language = "Language is required";
    if (!updatedMovie.poster) newErrors.poster = "Poster is required";
    if (!updatedMovie.trailer_url)
      newErrors.trailer_url = "Trailer URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    for (const key in updatedMovie) {
      if (key === "genre_id" && typeof updatedMovie[key] === "object") {
        formData.append("genre_id", updatedMovie[key]._id);
      } else if (key === "cast" || key === "crew") {
        formData.append(key, JSON.stringify(updatedMovie[key]));
      } else if (key === "poster") {
        formData.append("file", updatedMovie.poster);
      } else {
        formData.append(key, updatedMovie[key]);
      }
    }

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.put(
        `${baseUrl}/admin/updateMovie/${updatedMovie._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );
      Swal("Success", response.data.message, "success");
      onUpdate(updatedMovie);
      onClose();
    } catch (error) {
      Swal(
        "Error",
        error.response?.data?.message ||
          "An error occurred while updating the movie",
        "error"
      );
    }
  };

  const renderGenreOptions = () => {
    return genres.map((genre) => (
      <option key={genre._id} value={genre._id}>
        {genre.name}
      </option>
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
        <h2 className="text-xl mb-4">Edit Movie</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={updatedMovie.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Genre</label>
            <select
              name="genre_id"
              value={updatedMovie.genre_id?._id || updatedMovie.genre_id}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="">Select Genre</option>
              {renderGenreOptions()}
            </select>
            {errors.genre_id && (
              <p className="text-red-500 text-sm">{errors.genre_id}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Release Date</label>
            <input
              type="date"
              name="release_date"
              value={updatedMovie.release_date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.release_date && (
              <p className="text-red-500 text-sm">{errors.release_date}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={updatedMovie.duration}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={updatedMovie.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Language</label>
            <input
              type="text"
              name="language"
              value={updatedMovie.language}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Poster</label>

            
            {updatedMovie.poster instanceof File ? (
              
              <img
                src={URL.createObjectURL(updatedMovie.poster)}
                alt="Poster Preview"
                className="w-24 h-32 object-cover mb-2 rounded shadow"
              />
            ) : updatedMovie.posterUrl ? (
             
              <img
                src={updatedMovie.posterUrl}
                alt="Poster Preview"
                className="w-24 h-32 object-cover mb-2 rounded shadow"
              />
            ) : null}

            <input
              type="file"
              accept="image/*"
              name="poster"
              onChange={(e) =>
                setUpdatedMovie((prev) => ({
                  ...prev,
                  poster: e.target.files[0], 
                }))
              }
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.poster && (
              <p className="text-red-500 text-sm">{errors.poster}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Trailer URL</label>
            <input
              type="text"
              name="trailer_url"
              value={updatedMovie.trailer_url}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.trailer_url && (
              <p className="text-red-500 text-sm">{errors.trailer_url}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cast</label>
            {updatedMovie.cast.map((member, index) => (
              <div className="flex gap-2 mb-2" key={index}>
                <input
                  type="text"
                  name="actor_name"
                  value={member.actor_name}
                  onChange={(e) => handleCastChange(index, e)}
                  placeholder="Actor Name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="character_name"
                  value={member.character_name}
                  onChange={(e) => handleCastChange(index, e)}
                  placeholder="Character Name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="actor_name"
                value={castMember.actor_name}
                onChange={(e) =>
                  setCastMember({ ...castMember, actor_name: e.target.value })
                }
                placeholder="New Actor Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="character_name"
                value={castMember.character_name}
                onChange={(e) =>
                  setCastMember({
                    ...castMember,
                    character_name: e.target.value,
                  })
                }
                placeholder="New Character Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addCastMember}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Crew</label>
            {updatedMovie.crew.map((member, index) => (
              <div className="flex gap-2 mb-2" key={index}>
                <input
                  type="text"
                  name="crew_member"
                  value={member.crew_member}
                  onChange={(e) => handleCrewChange(index, e)}
                  placeholder="Crew Member"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="role"
                  value={member.role}
                  onChange={(e) => handleCrewChange(index, e)}
                  placeholder="Role"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="crew_member"
                value={crewMember.crew_member}
                onChange={(e) =>
                  setCrewMember({ ...crewMember, crew_member: e.target.value })
                }
                placeholder="New Crew Member"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="role"
                value={crewMember.role}
                onChange={(e) =>
                  setCrewMember({ ...crewMember, role: e.target.value })
                }
                placeholder="New Role"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addCrewMember}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMovieModal;
